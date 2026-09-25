import type { AcceptanceQuery, DisclaimerAcceptance } from '../server/disclaimers';

import { expect, test } from '@playwright/test';

import { disclaimers } from '../src/data/disclaimers';
import { resources } from '../src/data/resources';
import { acceptanceExists, createDisclaimerHandler, protectedContent, recordAcceptance, recordAcceptanceInNeon } from '../server/disclaimers';
import { subscriptionOrigins } from '../server/subscribe';

const ID = '8f6b7a2e-4c1d-4e5f-9a0b-1c2d3e4f5a6b';
const CURRENT = disclaimers['kickbacks-ai'].version;
const ACCEPT = { disclaimer: 'kickbacks-ai', version: CURRENT, accepted: true };
const RESUME = { disclaimer: 'kickbacks-ai', version: CURRENT, acceptance: ID };
const ALLOWED_ORIGINS = subscriptionOrigins({ NODE_ENV: 'production' });

function request(payload: unknown, headers: Record<string, string> = {}): Request {
  return new Request('https://demosvibes.gr/api/disclaimer', {
    method: 'POST',
    headers: { origin: 'https://demosvibes.gr', 'content-type': 'application/json', ...headers },
    body: JSON.stringify(payload),
  });
}

function handler(overrides: Partial<Parameters<typeof createDisclaimerHandler>[0]> = {}) {
  return createDisclaimerHandler({
    allowedOrigins: ALLOWED_ORIGINS,
    record: async () => ID,
    verify: async () => true,
    ...overrides,
  });
}

test('an acceptance is recorded with server-side metadata before the protected content is returned', async () => {
  const stored: DisclaimerAcceptance[] = [];
  const response = await handler({
    trustVercelHeaders: true,
    record: async (acceptance) => { stored.push(acceptance); return ID; },
  })(request({ ...ACCEPT }, {
    'user-agent': 'Reader/1.0', referer: 'https://demosvibes.gr/kickbacks-ai/?from=video#top', 'x-vercel-forwarded-for': '203.0.113.7',
  }));
  expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.acceptance).toBe(ID);
  expect(body.blocks).toEqual(protectedContent['kickbacks-ai']);
  expect(stored).toEqual([{
    disclaimer: 'kickbacks-ai', version: CURRENT,
    ip: '203.0.113.7', userAgent: 'Reader/1.0', referrer: 'https://demosvibes.gr/kickbacks-ai/?from=video',
  }]);
});

test('a stored acceptance id unlocks only after the database confirms it', async () => {
  const checks: string[][] = [];
  const confirmed = await handler({ verify: async (...args) => { checks.push(args); return true; } })(request({ ...RESUME, acceptance: ID.toUpperCase() }));
  expect(confirmed.status).toBe(200);
  expect(checks).toEqual([[ID, 'kickbacks-ai', CURRENT]]);

  let writes = 0;
  const unknown = await handler({ verify: async () => false, record: async () => { writes += 1; return ID; } })(request(RESUME));
  expect(unknown.status).toBe(403);
  const body = await unknown.json();
  expect(body).toEqual({ ok: false, error: 'acceptance_required' });
  expect(writes).toBe(0);
});

test('an outdated disclaimer version is refused without recording anything', async () => {
  let writes = 0;
  const run = handler({ record: async () => { writes += 1; return ID; }, verify: async () => { writes += 1; return true; } });
  for (const payload of [{ ...ACCEPT, version: '2020-01-01' }, { ...RESUME, version: '2020-01-01' }]) {
    const response = await run(request(payload));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ ok: false, error: 'disclaimer_outdated' });
  }
  expect(writes).toBe(0);
});

test('malformed requests, foreign origins and other methods never record or reveal content', async () => {
  let writes = 0;
  const run = handler({ record: async () => { writes += 1; return ID; }, verify: async () => { writes += 1; return true; } });
  const invalid = [
    null, [], 'kickbacks-ai',
    { ...ACCEPT, disclaimer: 'unknown' },
    { ...ACCEPT, disclaimer: '__proto__' },
    { ...ACCEPT, accepted: false },
    { ...ACCEPT, accepted: 'true' },
    { disclaimer: 'kickbacks-ai', accepted: true },
    { ...ACCEPT, acceptance: ID },
    { ...RESUME, acceptance: 'not-a-uuid' },
    { disclaimer: 'kickbacks-ai', version: CURRENT },
  ];
  for (const payload of invalid) {
    const response = await run(request(payload));
    expect(response.status).toBe(400);
    expect(JSON.stringify(await response.json())).not.toContain('blocks');
  }
  expect((await run(new Request('https://demosvibes.gr/api/disclaimer'))).status).toBe(405);
  for (const origin of ['', 'https://attacker.test', 'http://demosvibes.gr']) {
    expect((await run(request(ACCEPT, { origin }))).status).toBe(403);
  }
  expect((await run(request(ACCEPT, { 'content-type': 'text/plain' }))).status).toBe(415);
  expect((await run(request({ ...ACCEPT, padding: 'x'.repeat(2_000) }))).status).toBe(413);
  expect(writes).toBe(0);
});

test('unconfirmed or failed persistence returns no content and leaks no provider details', async () => {
  let reports = 0;
  for (const record of [
    async () => null,
    async () => { throw new Error('postgres://secret-password@example.invalid/db'); },
  ]) {
    const response = await handler({ record, reportPersistenceFailure: () => { reports += 1; } })(request(ACCEPT));
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ ok: false, error: 'disclaimer_failed' });
  }
  expect(reports).toBe(2);
  await expect(recordAcceptanceInNeon({ disclaimer: 'kickbacks-ai', version: CURRENT }, undefined))
    .rejects.toThrow('disclaimer_database_unavailable');
});

test('persistence uses bound parameters and requires a returned uuid', async () => {
  const calls: { statement: string; values: (string | null)[] }[] = [];
  const query = (rows: Record<string, unknown>[]): AcceptanceQuery => async (statement, values) => {
    calls.push({ statement, values });
    return rows;
  };
  expect(await recordAcceptance({ disclaimer: 'kickbacks-ai', version: CURRENT, userAgent: 'Reader/1.0' }, query([{ id: ID }]))).toBe(ID);
  expect(calls[0].statement).toContain('INSERT INTO public.disclaimer_acceptances');
  expect(calls[0].statement).toContain('RETURNING id');
  expect(calls[0].values).toEqual(['kickbacks-ai', CURRENT, null, 'Reader/1.0', null]);
  expect(await recordAcceptance({ disclaimer: 'kickbacks-ai', version: CURRENT }, query([]))).toBeNull();
  expect(await recordAcceptance({ disclaimer: 'kickbacks-ai', version: CURRENT }, query([{ id: 'nope' }]))).toBeNull();
  expect(await acceptanceExists(ID, 'kickbacks-ai', CURRENT, query([{ id: ID }]))).toBe(true);
  expect(await acceptanceExists(ID, 'kickbacks-ai', CURRENT, query([]))).toBe(false);
  expect(calls[calls.length - 1].values).toEqual([ID, 'kickbacks-ai', CURRENT]);
});

test('every protected block has a disclaimer and server-only content', () => {
  const protectedIds = resources.flatMap((resource) => resource.blocks)
    .flatMap((block) => (block.kind === 'protected' ? [block.disclaimer] : []));
  expect(protectedIds).toContain('kickbacks-ai');
  for (const id of protectedIds) {
    expect(disclaimers[id]?.id).toBe(id);
    expect(protectedContent[id]?.length).toBeGreaterThan(0);
  }
});
