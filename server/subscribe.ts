import type { Subscriber } from './subscribers.js';

import { subscriberMetadata } from './subscriber-metadata.js';

const MAX_BODY_BYTES = 2_048;
const MAX_EMAIL_LENGTH = 254;
const SITE_ORIGIN = 'https://demosvibes.gr';
const PRODUCTION_ORIGINS = [SITE_ORIGIN, 'https://www.demosvibes.gr', 'https://demosvibes.vercel.app'];

interface SubscriptionEnvironment {
  NODE_ENV?: string;
  VERCEL_URL?: string;
  VERCEL_BRANCH_URL?: string;
  VERCEL_PROJECT_PRODUCTION_URL?: string;
  SUBSCRIBE_LOCAL_ORIGINS?: string;
}

interface SubscriptionDependencies {
  persist: (subscriber: Subscriber) => Promise<boolean>;
  allowedOrigins: ReadonlySet<string>;
  trustVercelHeaders?: boolean;
  reportPersistenceFailure?: () => void;
}

class InvalidRequest extends Error {
  constructor(readonly status: number) {
    super('invalid_subscription_request');
  }
}

/** Exact server-configured hosts only; never trust Host or wildcard vercel.app. */
export function subscriptionOrigins(environment: SubscriptionEnvironment): Set<string> {
  const origins = new Set(PRODUCTION_ORIGINS);
  for (const hostname of [environment.VERCEL_URL, environment.VERCEL_BRANCH_URL, environment.VERCEL_PROJECT_PRODUCTION_URL]) {
    if (hostname && /^[a-z0-9-]+\.vercel\.app$/i.test(hostname)) origins.add(`https://${hostname.toLowerCase()}`);
  }
  if (environment.NODE_ENV !== 'production') {
    for (const candidate of (environment.SUBSCRIBE_LOCAL_ORIGINS ?? '').split(',')) {
      const origin = candidate.trim();
      if (!origin) continue;
      try {
        const url = new URL(origin);
        if (['http:', 'https:'].includes(url.protocol)
          && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
          && url.origin === origin) origins.add(origin);
      } catch {
        // Invalid optional development origins grant no access.
      }
    }
  }
  return origins;
}

export function normalizeSubscriberEmail(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > MAX_EMAIL_LENGTH + 2) return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH) return null;
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  const [local, domain] = parts;
  if (!local || local.length > 64 || !/^[a-z0-9.!#$%&'*+\/=?^_`{|}~-]+$/.test(local)
    || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null;
  const labels = domain.split('.');
  if (labels.length < 2 || labels[labels.length - 1].length < 2
    || labels.some((label) => label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return null;
  return email;
}

function parseSubscriber(value: unknown): Subscriber {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InvalidRequest(400);
  const payload = value as Record<string, unknown>;
  const email = normalizeSubscriberEmail(payload.email);
  if (!email || payload.consent !== true || payload.honeypot !== '') throw new InvalidRequest(400);
  return { email, consent: true };
}

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

function jsonResponse(status: number, ok: boolean): Response {
  return new Response(JSON.stringify(ok ? { ok: true } : { ok: false, error: 'subscription_failed' }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      ...(status === 405 ? { Allow: 'POST' } : {}),
    },
  });
}

/** Validation is independent of Neon so failure and browser contracts stay testable. */
export function createSubscriptionHandler({ persist, allowedOrigins, trustVercelHeaders = false, reportPersistenceFailure }: SubscriptionDependencies) {
  return async (request: Request): Promise<Response> => {
    if (request.method !== 'POST') return jsonResponse(405, false);
    const origin = request.headers.get('origin');
    if (!origin || !allowedOrigins.has(origin)) return jsonResponse(403, false);
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return jsonResponse(415, false);
    }
    let subscriber: Subscriber;
    try {
      subscriber = parseSubscriber(await readPayload(request));
    } catch (error) {
      return jsonResponse(error instanceof InvalidRequest ? error.status : 400, false);
    }
    try {
      if (await persist({ ...subscriber, ...subscriberMetadata(request.headers, trustVercelHeaders) })) return jsonResponse(200, true);
    } catch {
      // Driver errors may contain connection details or email values: never log them.
    }
    reportPersistenceFailure?.();
    return jsonResponse(503, false);
  };
}
