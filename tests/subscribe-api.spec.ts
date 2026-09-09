import type { Subscriber, SubscriberQuery } from '../server/subscribers';

import { expect, test } from '@playwright/test';

import { createSubscriptionHandler, normalizeSubscriberEmail, subscriptionOrigins } from '../server/subscribe';
import { persistSubscriber, persistSubscriberInNeon } from '../server/subscribers';

const VALID_PAYLOAD = { email: 'reader@example.com', consent: true, honeypot: '', sourcePath: '/tools/' };
const ALLOWED_ORIGINS = subscriptionOrigins({ NODE_ENV: 'production' });

function request(payload: unknown = VALID_PAYLOAD, headers: Record<string, string> = {}): Request {
  return new Request('https://demosvibes.gr/api/subscribe', {
    method: 'POST',
    headers: { origin: 'https://demosvibes.gr', 'content-type': 'application/json', ...headers },
    body: JSON.stringify(payload),
  });
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((complete) => { resolve = complete; });
  return { promise, resolve };
}

test('successful subscription waits for persistence and normalizes only stored fields', async () => {
  const started = deferred<void>();
  const committed = deferred<boolean>();
  const stored: Subscriber[] = [];
  const handler = createSubscriptionHandler({
    allowedOrigins: ALLOWED_ORIGINS,
    persist: async (subscriber) => {
      stored.push(subscriber);
      started.resolve();
      return committed.promise;
    },
  });
  let settled = false;
  const pending = handler(request({ ...VALID_PAYLOAD, email: ' Reader+News@Example.COM ', sourcePath: '/tools/?email=private#token' }))
    .then((response) => { settled = true; return response; });
  await started.promise;
  expect(settled).toBe(false);
  expect(stored).toEqual([{ email: 'reader+news@example.com', consent: true, sourcePath: '/tools/' }]);
  committed.resolve(true);
  const response = await pending;
  expect(response.status).toBe(200);
  expect(await response.json()).toEqual({ ok: true });
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(response.headers.get('access-control-allow-origin')).toBeNull();
});

test('invalid addresses, consent, honeypots and source paths never reach persistence', async () => {
  let writes = 0;
  const handler = createSubscriptionHandler({ allowedOrigins: ALLOWED_ORIGINS, persist: async () => { writes += 1; return true; } });
  const invalid = [
    null, [], 'reader@example.com',
    { ...VALID_PAYLOAD, email: '' },
    { ...VALID_PAYLOAD, email: 'a..b@example.com' },
    { ...VALID_PAYLOAD, email: '.reader@example.com' },
    { ...VALID_PAYLOAD, email: 'reader@-example.com' },
    { ...VALID_PAYLOAD, email: 'reader@localhost' },
    { ...VALID_PAYLOAD, email: 'reader@example..com' },
    { ...VALID_PAYLOAD, email: `${'x'.repeat(65)}@example.com` },
    { ...VALID_PAYLOAD, email: `${'x'.repeat(250)}@example.com` },
    { ...VALID_PAYLOAD, email: 'reader@example.com\r\nbcc:other@example.com' },
    { ...VALID_PAYLOAD, consent: false },
    { ...VALID_PAYLOAD, consent: 'true' },
    { ...VALID_PAYLOAD, honeypot: 'bot' },
    { ...VALID_PAYLOAD, honeypot: undefined },
    { ...VALID_PAYLOAD, sourcePath: 'https://example.com/' },
    { ...VALID_PAYLOAD, sourcePath: '//example.com/' },
    { ...VALID_PAYLOAD, sourcePath: '/\\example.com/' },
    { ...VALID_PAYLOAD, sourcePath: `/x${'x'.repeat(500)}` },
    { ...VALID_PAYLOAD, sourcePath: '/bad\u0000path' },
  ];
  for (const payload of invalid) {
    const response = await handler(request(payload));
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: 'subscription_failed' });
  }
  expect(writes).toBe(0);
  expect(normalizeSubscriberEmail('Reader+News@Example.COM')).toBe('reader+news@example.com');
});

test('GET, foreign or missing origins and unsupported content types cannot write or list subscribers', async () => {
  let writes = 0;
  const handler = createSubscriptionHandler({ allowedOrigins: ALLOWED_ORIGINS, persist: async () => { writes += 1; return true; } });
  const get = await handler(new Request('https://demosvibes.gr/api/subscribe'));
  expect(get.status).toBe(405);
  expect(get.headers.get('allow')).toBe('POST');
  for (const origin of ['', 'null', 'https://attacker.test', 'https://demosvibes.gr.attacker.test', 'http://demosvibes.gr']) {
    expect((await handler(request(VALID_PAYLOAD, { origin }))).status).toBe(403);
  }
  for (const contentType of ['text/plain', 'application/x-www-form-urlencoded', 'text/json']) {
    expect((await handler(request(VALID_PAYLOAD, { 'content-type': contentType }))).status).toBe(415);
  }
  expect(writes).toBe(0);
});

test('preview origins are exact configured hosts and localhost is explicitly development-only', () => {
  const settings = {
    VERCEL_URL: 'demosvibes-unique-team.vercel.app',
    VERCEL_BRANCH_URL: 'demosvibes-git-main-team.vercel.app',
    VERCEL_PROJECT_PRODUCTION_URL: 'demosvibes.vercel.app',
    SUBSCRIBE_LOCAL_ORIGINS: 'http://localhost:3000,http://127.0.0.1:4173,https://attacker.test',
  };
  const production = subscriptionOrigins({ ...settings, NODE_ENV: 'production' });
  expect(production.has('https://www.demosvibes.gr')).toBe(true);
  expect(subscriptionOrigins({ NODE_ENV: 'production' }).has('https://demosvibes.vercel.app')).toBe(true);
  expect(production.has(`https://${settings.VERCEL_URL}`)).toBe(true);
  expect(production.has('https://unrelated.vercel.app')).toBe(false);
  expect(production.has('http://localhost:3000')).toBe(false);
  expect(subscriptionOrigins({ NODE_ENV: 'development' }).has('http://localhost:3000')).toBe(false);
  const development = subscriptionOrigins({ ...settings, NODE_ENV: 'development' });
  expect(development.has('http://localhost:3000')).toBe(true);
  expect(development.has('http://127.0.0.1:4173')).toBe(true);
  expect(development.has('https://attacker.test')).toBe(false);
  expect(subscriptionOrigins({ VERCEL_URL: 'good.vercel.app.attacker.test' }).size).toBe(3);
});

test('malformed JSON and actual oversized bodies fail even without a trustworthy content length', async () => {
  let writes = 0;
  const handler = createSubscriptionHandler({ allowedOrigins: ALLOWED_ORIGINS, persist: async () => { writes += 1; return true; } });
  for (const [body, status] of [['{"email":', 400], [JSON.stringify({ ...VALID_PAYLOAD, padding: 'x'.repeat(3_000) }), 413]] as const) {
    const raw = new Request('https://demosvibes.gr/api/subscribe', {
      method: 'POST', headers: { origin: 'https://demosvibes.gr', 'content-type': 'application/json' }, body,
    });
    expect((await handler(raw)).status).toBe(status);
  }
  expect((await handler(request(VALID_PAYLOAD, { 'content-length': '9999' }))).status).toBe(413);
  expect((await handler(request(VALID_PAYLOAD, { 'content-length': 'invalid' }))).status).toBe(400);
  expect(writes).toBe(0);
});

test('database rejection or unconfirmed persistence never produces a success or leaks provider details', async () => {
  let reports = 0;
  for (const persist of [
    async () => false,
    async () => { throw new Error('postgres://secret-password@example.invalid/db reader@example.com'); },
  ]) {
    const handler = createSubscriptionHandler({ allowedOrigins: ALLOWED_ORIGINS, persist, reportPersistenceFailure: () => { reports += 1; } });
    const response = await handler(request());
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: 'subscription_failed' });
  }
  expect(reports).toBe(2);
  await expect(persistSubscriberInNeon({ email: VALID_PAYLOAD.email, consent: true, sourcePath: '/' }, undefined))
    .rejects.toThrow('subscription_database_unavailable');
});

test('new inserts use bound parameters and require the database to return the persisted subscriber', async () => {
  const subscriber: Subscriber = { email: 'reader+news@example.com', consent: true, sourcePath: '/tools/' };
  const calls: { statement: string; values: (string | null)[] }[] = [];
  const saved = await persistSubscriber(subscriber, async (statement, values) => {
    calls.push({ statement, values });
    return [{ email: subscriber.email, consent: true }];
  });
  expect(saved).toBe(true);
  expect(calls).toHaveLength(1);
  expect(calls[0].statement).toContain('ON CONFLICT (email) DO NOTHING');
  expect(calls[0].statement).not.toContain(subscriber.email);
  expect(calls[0].values).toEqual([subscriber.email, '/tools/']);
});

test('conflicting subscriptions confirm the committed row without updating original consent or import metadata', async () => {
  const subscriber: Subscriber = { email: VALID_PAYLOAD.email, consent: true, sourcePath: '/about/' };
  for (const [existingRows, expected] of [
    [[{ email: subscriber.email, consent: true }], true],
    [[], false],
    [[{ email: subscriber.email, consent: false }], false],
    [[{ email: 'someone-else@example.com', consent: true }], false],
  ] as const) {
    const calls: string[] = [];
    const query: SubscriberQuery = async (statement) => {
      calls.push(statement);
      return calls.length === 1 ? [] : [...existingRows];
    };
    expect(await persistSubscriber(subscriber, query)).toBe(expected);
    expect(calls).toHaveLength(2);
    expect(calls[0]).not.toMatch(/DO UPDATE/i);
    expect(calls[1]).toMatch(/^SELECT email, consent/);
  }
});
