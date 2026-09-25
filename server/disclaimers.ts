import type { ContentBlock } from '../src/data/types.js';

import { neon } from '@neondatabase/serverless';

import { disclaimers } from '../src/data/disclaimers.js';
import { kickbacksAiGuide } from './protected/kickbacks-ai.js';
import { subscriberMetadata } from './subscriber-metadata.js';

const MAX_BODY_BYTES = 1_024;
const DATABASE_TIMEOUT_MS = 8_000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Server-only article bodies, keyed by the disclaimer that unlocks them. */
export const protectedContent: Record<string, ContentBlock[]> = {
  'kickbacks-ai': kickbacksAiGuide,
};

export interface DisclaimerAcceptance {
  disclaimer: string;
  version: string;
  ip?: string | null;
  userAgent?: string | null;
  referrer?: string | null;
}

export type AcceptanceQuery = (statement: string, values: (string | null)[]) => Promise<Record<string, unknown>[]>;

interface DisclaimerDependencies {
  allowedOrigins: ReadonlySet<string>;
  trustVercelHeaders?: boolean;
  /** Stores one acceptance and returns its id, or null if the database did not confirm it. */
  record: (acceptance: DisclaimerAcceptance) => Promise<string | null>;
  /** Confirms a previously returned id for the current disclaimer version. */
  verify: (id: string, disclaimer: string, version: string) => Promise<boolean>;
  reportPersistenceFailure?: () => void;
}

type ParsedRequest =
  | { disclaimer: string; version: string; accept: true }
  | { disclaimer: string; version: string; acceptance: string };

class InvalidRequest extends Error {
  constructor(readonly status: number) {
    super('invalid_disclaimer_request');
  }
}

function jsonResponse(status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...(status === 405 ? { Allow: 'POST' } : {}),
    },
  });
}

const failure = (status: number, error = 'disclaimer_failed') => jsonResponse(status, { ok: false, error });

async function readPayload(request: Request): Promise<unknown> {
  const length = request.headers.get('content-length');
  if (length !== null) {
    if (!/^\d+$/.test(length)) throw new InvalidRequest(400);
    if (Number(length) > MAX_BODY_BYTES) throw new InvalidRequest(413);
  }
  if (!request.body) throw new InvalidRequest(400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytesRead = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new InvalidRequest(413);
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return JSON.parse(body);
  } finally {
    reader.releaseLock();
  }
}

/** Exactly one of: a fresh acceptance, or a previously issued acceptance id. */
function parseRequest(value: unknown): ParsedRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InvalidRequest(400);
  const payload = value as Record<string, unknown>;
  const { disclaimer, version, accepted, acceptance } = payload;
  if (typeof disclaimer !== 'string' || !Object.prototype.hasOwnProperty.call(disclaimers, disclaimer)
    || typeof version !== 'string' || version.length > 64) throw new InvalidRequest(400);
  if (accepted === true && acceptance === undefined) return { disclaimer, version, accept: true };
  if (accepted === undefined && typeof acceptance === 'string' && UUID.test(acceptance)) {
    return { disclaimer, version, acceptance: acceptance.toLowerCase() };
  }
  throw new InvalidRequest(400);
}

/**
 * Protected article content leaves the server only in this response, after the
 * acceptance is durably recorded (or a recorded one is confirmed).
 */
export function createDisclaimerHandler({ allowedOrigins, trustVercelHeaders = false, record, verify, reportPersistenceFailure }: DisclaimerDependencies) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') return failure(405);
    const origin = request.headers.get('origin');
    if (!origin || !allowedOrigins.has(origin)) return failure(403);
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return failure(415);
    }
    let parsed: ParsedRequest;
    try {
      parsed = parseRequest(await readPayload(request));
    } catch (error) {
      return failure(error instanceof InvalidRequest ? error.status : 400);
    }
    // A page opened before the text changed must reload and show the new version.
    if (parsed.version !== disclaimers[parsed.disclaimer].version) return failure(409, 'disclaimer_outdated');
    const blocks = protectedContent[parsed.disclaimer];
    if (!blocks) return failure(404);

    let acceptance: string | null = null;
    try {
      if ('accept' in parsed) {
        const metadata = subscriberMetadata(request.headers, trustVercelHeaders);
        acceptance = await record({ disclaimer: parsed.disclaimer, version: parsed.version, ...metadata });
      } else {
        if (!await verify(parsed.acceptance, parsed.disclaimer, parsed.version)) return failure(403, 'acceptance_required');
        acceptance = parsed.acceptance;
      }
    } catch {
      // Driver errors may contain connection details: never log them.
    }
    if (!acceptance) {
      reportPersistenceFailure?.();
      return failure(503);
    }
    return jsonResponse(200, { ok: true, acceptance, blocks });
  };
}

export async function recordAcceptance(acceptance: DisclaimerAcceptance, query: AcceptanceQuery): Promise<string | null> {
  const rows = await query(
    `INSERT INTO public.disclaimer_acceptances (disclaimer, version, accepted, ip, user_agent, referrer)
     VALUES ($1, $2, true, $3::inet, $4, $5)
     RETURNING id`,
    [acceptance.disclaimer, acceptance.version, acceptance.ip ?? null, acceptance.userAgent ?? null, acceptance.referrer ?? null],
  );
  const id = rows.length === 1 ? rows[0].id : null;
  return typeof id === 'string' && UUID.test(id) ? id : null;
}

export async function acceptanceExists(id: string, disclaimer: string, version: string, query: AcceptanceQuery): Promise<boolean> {
  const rows = await query(
    `SELECT id FROM public.disclaimer_acceptances
     WHERE id = $1::uuid AND disclaimer = $2 AND version = $3
     LIMIT 1`,
    [id, disclaimer, version],
  );
  return rows.length === 1;
}

function neonQuery(databaseUrl: string | undefined): AcceptanceQuery {
  if (!databaseUrl) throw new Error('disclaimer_database_unavailable');
  const sql = neon(databaseUrl, { fetchOptions: { signal: AbortSignal.timeout(DATABASE_TIMEOUT_MS) } });
  return async (statement, values) => sql.query(statement, values);
}

export async function recordAcceptanceInNeon(acceptance: DisclaimerAcceptance, databaseUrl: string | undefined): Promise<string | null> {
  return recordAcceptance(acceptance, neonQuery(databaseUrl));
}

export async function acceptanceExistsInNeon(id: string, disclaimer: string, version: string, databaseUrl: string | undefined): Promise<boolean> {
  return acceptanceExists(id, disclaimer, version, neonQuery(databaseUrl));
}
