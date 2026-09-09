import { neon } from '@neondatabase/serverless';

// Maintenance-only tool. Pipe a JSON array of {email, consent, created_at} on
// stdin and provide an owner DATABASE_URL through the environment, never argv.
// Prints counts only. Source CSVs and connection strings must stay private.
async function main() {
  if (!process.env.DATABASE_URL) throw new Error('missing_database');
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  const rows = JSON.parse(input);
  if (!Array.isArray(rows)) throw new Error('invalid_import');
  const unique = new Map();
  for (const row of rows) {
    const email = typeof row.email === 'string' ? row.email.trim().toLowerCase() : '';
    const timestamp = Date.parse(row.created_at);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254
      || row.consent !== true || !Number.isFinite(timestamp)) throw new Error('invalid_import_row');
    const created_at = new Date(timestamp).toISOString();
    if (!unique.has(email) || created_at < unique.get(email).created_at) {
      unique.set(email, { email, consent: true, created_at });
    }
  }
  if (!unique.size) {
    console.log(JSON.stringify({ inputRows: rows.length, uniqueEmails: 0, inserted: 0 }));
    return;
  }
  const sql = neon(process.env.DATABASE_URL);
  const payload = JSON.stringify([...unique.values()]);
  const inserted = await sql`
    INSERT INTO public.subscribers (email, consent, created_at, source)
    SELECT entry.email, entry.consent, entry.created_at, 'netlify-import'
    FROM jsonb_to_recordset(${payload}::jsonb)
      AS entry(email text, consent boolean, created_at timestamptz)
    ON CONFLICT (email) DO NOTHING
    RETURNING email
  `;
  const [verified] = await sql`
    SELECT count(*)::integer AS count FROM public.subscribers
    WHERE consent = true AND email IN (
      SELECT entry.email FROM jsonb_to_recordset(${payload}::jsonb) AS entry(email text)
    )
  `;
  if (verified.count !== unique.size) throw new Error('import_verification_failed');
  console.log(JSON.stringify({
    inputRows: rows.length,
    uniqueEmails: unique.size,
    duplicateInputRows: rows.length - unique.size,
    inserted: inserted.length,
    alreadyPresent: unique.size - inserted.length,
    verified: verified.count,
  }));
}

main().catch(() => {
  console.error('Subscriber import failed. No email values or database credentials were logged.');
  process.exitCode = 1;
});
