import { createSubscriptionHandler } from './subscribe.js';

const MAX_BODY_BYTES = 2_048;
const LEGACY_FIELDS = ['form-name', 'email', 'consent', 'bot-field'];

class InvalidLegacyRequest extends Error {
  constructor(readonly status: number) {
    super('invalid_legacy_subscription_request');
  }
}

function failure(status: number): Response {
  return new Response(JSON.stringify({ ok: false, error: 'subscription_failed' }), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

async function readLegacyForm(request: Request): Promise<URLSearchParams> {
  const length = request.headers.get('content-length');
  if (length !== null) {
    if (!/^\d+$/.test(length)) throw new InvalidLegacyRequest(400);
    if (Number(length) > MAX_BODY_BYTES) throw new InvalidLegacyRequest(413);
  }
  if (!request.body) throw new InvalidLegacyRequest(400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let bytes = 0;
  let body = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new InvalidLegacyRequest(413);
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
  } finally {
    reader.releaseLock();
  }
  const form = new URLSearchParams(body);
  if (LEGACY_FIELDS.some((field) => form.getAll(field).length !== 1)
    || [...form.keys()].some((field) => !LEGACY_FIELDS.includes(field))
    || form.get('form-name') !== 'email-gate' || form.get('consent') !== 'yes') {
    throw new InvalidLegacyRequest(400);
  }
  return form;
}

/** Compatibility only for already-open pages from the Netlify deployment. */
export function createLegacySubscriptionHandler(dependencies: Parameters<typeof createSubscriptionHandler>[0]) {
  const subscribe = createSubscriptionHandler(dependencies);
  return async (request: Request): Promise<Response> => {
    const origin = request.headers.get('origin');
    // Reuse the standard method/origin rejection before reading an untrusted body.
    if (request.method !== 'POST' || !origin || !dependencies.allowedOrigins.has(origin)) return subscribe(request);
    if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/x-www-form-urlencoded') {
      return failure(415);
    }
    let form: URLSearchParams;
    try {
      form = await readLegacyForm(request);
    } catch (error) {
      return failure(error instanceof InvalidLegacyRequest ? error.status : 400);
    }
    const headers = new Headers(request.headers);
    headers.set('Content-Type', 'application/json');
    headers.delete('Content-Length');
    return subscribe(new Request(request.url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: form.get('email'), consent: true, honeypot: form.get('bot-field') }),
    }));
  };
}
