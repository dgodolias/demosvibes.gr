import type { Subscriber } from '../server/subscribers';

import { expect, test } from '@playwright/test';

import { createLegacySubscriptionHandler } from '../server/legacy-subscribe';
import { subscriptionOrigins } from '../server/subscribe';

const allowedOrigins = subscriptionOrigins({ NODE_ENV: 'production' });
const originalForm = { 'form-name': 'email-gate', email: ' Reader+Legacy@Example.TEST ', consent: 'yes', 'bot-field': '' };

function request(fields = originalForm, headers: Record<string, string> = {}) {
  return new Request('https://demosvibes.gr/', {
    method: 'POST',
    headers: { origin: 'https://demosvibes.gr', 'content-type': 'application/x-www-form-urlencoded', ...headers },
    body: new URLSearchParams(fields),
  });
}

test('the original Netlify form becomes a normalized subscription only after persistence succeeds', async () => {
  const captured: Subscriber[] = [];
  const handler = createLegacySubscriptionHandler({
    allowedOrigins,
    persist: async (subscriber) => { captured.push(subscriber); return true; },
  });
  const response = await handler(request());
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
  expect(captured).toEqual([{ email: 'reader+legacy@example.test', consent: true, ip: null, userAgent: null, referrer: null }]);
  expect(response.headers.get('cache-control')).toBe('no-store');

  for (const persist of [async () => false, async () => { throw new Error('private_database_error'); }]) {
    const failing = createLegacySubscriptionHandler({ allowedOrigins, persist });
    const rejected = await failing(request());
    expect(rejected.status).toBe(503);
    expect(await rejected.json()).toEqual({ ok: false, error: 'subscription_failed' });
  }
});

test('legacy consent, form name, honeypot and email remain strict', async () => {
  let writes = 0;
  const handler = createLegacySubscriptionHandler({ allowedOrigins, persist: async () => { writes += 1; return true; } });
  for (const fields of [
    { ...originalForm, consent: 'no' },
    { ...originalForm, consent: 'true' },
    { ...originalForm, 'form-name': 'unrelated-form' },
    { ...originalForm, 'bot-field': 'bot' },
    { ...originalForm, email: 'bad..address@example.test' },
    { ...originalForm, unexpected: 'field' },
  ]) {
    const response = await handler(request(fields));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: 'subscription_failed' });
  }
  const duplicate = new URLSearchParams(originalForm);
  duplicate.append('consent', 'yes');
  const duplicateRequest = new Request('https://demosvibes.gr/', {
    method: 'POST', headers: { origin: 'https://demosvibes.gr', 'content-type': 'application/x-www-form-urlencoded' }, body: duplicate,
  });
  expect((await handler(duplicateRequest)).status).toBe(400);
  expect(writes).toBe(0);
});

test('legacy method, origins, media type and both announced and actual body sizes are bounded', async () => {
  let writes = 0;
  const handler = createLegacySubscriptionHandler({ allowedOrigins, persist: async () => { writes += 1; return true; } });
  const get = await handler(new Request('https://demosvibes.gr/api/legacy-subscribe'));
  expect(get.status).toBe(405);
  expect(get.headers.get('allow')).toBe('POST');
  expect((await handler(request(originalForm, { origin: 'https://other.example.test' }))).status).toBe(403);
  expect((await handler(request(originalForm, { 'content-type': 'application/json' }))).status).toBe(415);
  expect((await handler(request(originalForm, { 'content-length': '9999' }))).status).toBe(413);
  expect((await handler(request({ ...originalForm, email: 'x'.repeat(3_000) }))).status).toBe(413);
  expect(writes).toBe(0);
});
