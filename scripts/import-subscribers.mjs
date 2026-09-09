import { neon } from '@neondatabase/serverless';
import { isIP } from 'node:net';
import { pathToFileURL } from 'node:url';

// Maintenance-only importer for an owner-authorized archived Netlify export.
// Pipe JSON rows with email, consent, created_at and optional ip, user_agent,
// referrer on stdin. Supply owner DATABASE_URL through the environment, never
// argv. Archived data and credentials must stay private. Backfill only the
// supplied historical events with the same email and exact created_at value.
function optionalText(value, maxLength) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string' || [...value].length > maxLength || value.includes('\0')) {
    throw new Error('invalid_import_metadata');
  }
  return value;
}

function optionalIp(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') throw new Error('invalid_import_metadata');
  const ip = value.trim();
  // PostgreSQL inet stores addresses, without an interface zone identifier.
  if (!isIP(ip) || ip.includes('%')) throw new Error('invalid_import_metadata');
  return ip;
}

/** Select one complete earliest event; never combine metadata from duplicates. */
export function prepareSubscribers(rows) {
  if (!Array.isArray(rows)) throw new Error('invalid_import');
  const unique = new Map();
  for (const row of rows) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) throw new Error('invalid_import_row');
    const email = typeof row.email === 'string' ? row.email.trim().toLowerCase() : '';
    const timestamp = typeof row.created_at === 'string' ? Date.parse(row.created_at) : NaN;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
      || row.consent !== true || !Number.isFinite(timestamp)) throw new Error('invalid_import_row');
    const created_at = new Date(timestamp).toISOString();
    const subscriber = {
      email, consent: true, created_at,
      ip: optionalIp(row.ip),
      user_agent: optionalText(row.user_agent, 2048),
      referrer: optionalText(row.referrer, 4096),
    };
    // Equal timestamps retain the first whole row in the supplied export.
    if (!unique.has(email) || created_at < unique.get(email).created_at) {
      unique.set(email, subscriber);
    }
  }
  return [...unique.values()];
}

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('missing_database');
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const rows = JSON.parse(input);
  const subscribers = prepareSubscribers(rows);
  if (!subscribers.length) {
    console.log(JSON.stringify({ inputRows: rows.length, uniqueEmails: 0, inserted: 0, updated: 0, verified: 0, metadataVerified: 0 }));
    return;
  }
  const sql = neon(process.env.DATABASE_URL);
  const payload = JSON.stringify(subscribers);
  const metadataInputRows = subscribers.filter((row) => row.ip !== null || row.user_agent !== null || row.referrer !== null).length;
  const [inserted, updated, [verified]] = await sql.transaction([
    sql`
      INSERT INTO public.subscribers (email, consent, created_at, ip, user_agent, referrer)
      SELECT entry.email, entry.consent, entry.created_at, entry.ip, entry.user_agent, entry.referrer
      FROM jsonb_to_recordset(${payload}::jsonb)
        AS entry(email text, consent boolean, created_at timestamptz, ip inet, user_agent text, referrer text)
      ON CONFLICT (email) DO NOTHING
      RETURNING 1 AS saved
    `,
    sql`
      UPDATE public.subscribers AS existing
      SET ip = COALESCE(existing.ip, entry.ip),
          user_agent = COALESCE(existing.user_agent, entry.user_agent),
          referrer = COALESCE(existing.referrer, entry.referrer)
      FROM jsonb_to_recordset(${payload}::jsonb)
        AS entry(email text, created_at timestamptz, ip inet, user_agent text, referrer text)
      WHERE existing.email = entry.email
        AND existing.created_at = entry.created_at
        AND (
          (existing.ip IS NULL AND entry.ip IS NOT NULL)
          OR (existing.user_agent IS NULL AND entry.user_agent IS NOT NULL)
          OR (existing.referrer IS NULL AND entry.referrer IS NOT NULL)
        )
      RETURNING 1 AS backfilled
    `,
    sql`
      WITH matched AS (
        SELECT existing.consent,
          existing.created_at = entry.created_at AS same_event,
          entry.ip IS NOT NULL OR entry.user_agent IS NOT NULL OR entry.referrer IS NOT NULL AS has_metadata,
          (entry.ip IS NOT NULL AND existing.ip IS NULL)
            OR (entry.user_agent IS NOT NULL AND existing.user_agent IS NULL)
            OR (entry.referrer IS NOT NULL AND existing.referrer IS NULL) AS missing_metadata,
          (entry.ip IS NULL OR existing.ip = entry.ip)
            AND (entry.user_agent IS NULL OR existing.user_agent = entry.user_agent)
            AND (entry.referrer IS NULL OR existing.referrer = entry.referrer) AS matching_metadata
        FROM jsonb_to_recordset(${payload}::jsonb)
          AS entry(email text, created_at timestamptz, ip inet, user_agent text, referrer text)
        LEFT JOIN public.subscribers AS existing ON existing.email = entry.email
      )
      SELECT count(*) FILTER (WHERE consent = true)::integer AS count,
        count(*) FILTER (WHERE same_event AND has_metadata)::integer AS metadata_eligible,
        count(*) FILTER (WHERE same_event AND has_metadata AND matching_metadata)::integer AS metadata_verified,
        count(*) FILTER (WHERE same_event AND has_metadata AND missing_metadata)::integer AS metadata_missing,
        count(*) FILTER (WHERE same_event AND has_metadata AND NOT missing_metadata AND NOT matching_metadata)::integer AS metadata_conflicts
      FROM matched
    `,
  ]);
  if (verified.count !== subscribers.length || verified.metadata_missing !== 0) throw new Error('import_verification_failed');
  console.log(JSON.stringify({
    inputRows: rows.length,
    uniqueEmails: subscribers.length,
    duplicateInputRows: rows.length - subscribers.length,
    inserted: inserted.length,
    updated: updated.length,
    alreadyPresent: subscribers.length - inserted.length,
    verified: verified.count,
    metadataInputRows,
    metadataVerified: verified.metadata_verified,
    metadataPreservedConflicts: verified.metadata_conflicts,
    metadataSkippedDifferentEvent: metadataInputRows - verified.metadata_eligible,
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(() => {
    console.error('Subscriber import failed. No subscriber values or database credentials were logged.');
    process.exitCode = 1;
  });
}
