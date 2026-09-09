import type { Subscriber, SubscriberQuery } from '../server/subscribers';

import { expect, test } from '@playwright/test';

import { createLegacySubscriptionHandler } from '../server/legacy-subscribe';
import { createSubscriptionHandler, subscriptionOrigins } from '../server/subscribe';
import { subscriberMetadata } from '../server/subscriber-metadata';
import { persistSubscriber } from '../server/subscribers';

const allowedOrigins = subscriptionOrigins({ NODE_ENV: 'production' });
const payload = { email: 'metadata@example.test', consent: true, honeypot: '' };

function jsonRequest(body: unknown, headers: Record<string, string>) {
  return new Request('https://demosvibes.gr/api/subscribe', {
    method: 'POST',
    headers: { origin: 'https://demosvibes.gr', 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

test('metadata comes from request headers, never JSON fields or a body runtime flag', async () => {
  const captured: Subscriber[] = [];
  const headers = { 'x-vercel-forwarded-for': '203.0.113.4', 'user-agent': 'HeaderAgent/1.0', referer: 'https://demosvibes.gr/tools/?from=video#fragment' };
  const body = { ...payload, ip: '198.51.100.8', user_agent: 'BodyAgent', userAgent: 'BodyAgent', referrer: 'https://body.example.test/', VERCEL: '1', trustVercelHeaders: true };
  for (const trustVercelHeaders of [false, true]) {
    const handler = createSubscriptionHandler({
      allowedOrigins, trustVercelHeaders,
      persist: async (subscriber) => { captured.push(subscriber); return true; },
    });
    expect((await handler(jsonRequest(body, headers))).status).toBe(200);
  }
  expect(captured.map(({ ip, userAgent, referrer }) => ({ ip, userAgent, referrer }))).toEqual([
    { ip: null, userAgent: 'HeaderAgent/1.0', referrer: 'https://demosvibes.gr/tools/?from=video' },
    { ip: '203.0.113.4', userAgent: 'HeaderAgent/1.0', referrer: 'https://demosvibes.gr/tools/?from=video' },
  ]);
});

test('trusted IP extraction accepts single IPv4 or IPv6 and rejects ambiguous or invalid addresses', () => {
  const cases: { headers: Record<string, string>; expected: string | null }[] = [
    { headers: { 'x-vercel-forwarded-for': '203.0.113.9', 'x-forwarded-for': '198.51.100.9' }, expected: '203.0.113.9' },
    { headers: { 'x-forwarded-for': '198.51.100.9' }, expected: '198.51.100.9' },
    { headers: { 'x-vercel-forwarded-for': '2001:db8::1234' }, expected: '2001:db8::1234' },
    { headers: { 'x-vercel-forwarded-for': '203.0.113.9, 198.51.100.9' }, expected: null },
    { headers: { 'x-forwarded-for': '203.0.113.9, 198.51.100.9' }, expected: null },
    { headers: { 'x-vercel-forwarded-for': 'invalid', 'x-forwarded-for': '198.51.100.9' }, expected: null },
    { headers: { 'x-vercel-forwarded-for': '203.0.113.999' }, expected: null },
    { headers: { 'x-vercel-forwarded-for': '203.0.113.9:443' }, expected: null },
    { headers: { 'x-vercel-forwarded-for': '2001:db8::1234/64' }, expected: null },
    { headers: { 'x-vercel-forwarded-for': 'fe80::1%eth0' }, expected: null },
    { headers: { 'x-real-ip': '203.0.113.9' }, expected: null },
    { headers: {}, expected: null },
  ];
  for (const { headers, expected } of cases) {
    expect(subscriberMetadata(new Headers(headers), true).ip).toBe(expected);
    expect(subscriberMetadata(new Headers(headers), false).ip).toBeNull();
  }
});

test('user agents are bounded and control-cleaned while invalid referrers become null', () => {
  expect(subscriberMetadata(new Headers({ 'user-agent': 'Agent\tName\u007f' }), false).userAgent).toBe('Agent Name');
  expect(subscriberMetadata(new Headers({ 'user-agent': 'x'.repeat(3_000) }), false).userAgent).toHaveLength(2_048);
  expect(subscriberMetadata(new Headers(), false)).toEqual({ ip: null, userAgent: null, referrer: null });
  for (const referer of [
    'not a url', 'javascript:alert(1)', 'https:example.test', '/relative/path',
    'https://reader:secret@example.test/path', 'https://reader@example.test/',
    `https://example.test/${'x'.repeat(4_096)}`,
  ]) expect(subscriberMetadata(new Headers({ referer }), true).referrer).toBeNull();
  expect(subscriberMetadata(new Headers({ referer: 'https://example.test/path?campaign=video#private-fragment' }), false).referrer)
    .toBe('https://example.test/path?campaign=video');
});

test('bad optional metadata cannot block a valid consented save and unconsented requests cannot persist it', async () => {
  const captured: Subscriber[] = [];
  const handler = createSubscriptionHandler({
    allowedOrigins, trustVercelHeaders: true,
    persist: async (subscriber) => { captured.push(subscriber); return true; },
  });
  const headers = { 'x-vercel-forwarded-for': 'invalid-ip', referer: 'https://reader:secret@example.test/', 'user-agent': 'x'.repeat(3_000) };
  expect((await handler(jsonRequest(payload, headers))).status).toBe(200);
  expect(captured).toHaveLength(1);
  expect(captured[0].ip).toBeNull();
  expect(captured[0].referrer).toBeNull();
  expect(captured[0].userAgent).toHaveLength(2_048);
  expect((await handler(jsonRequest({ ...payload, consent: false }, headers))).status).toBe(400);
  expect(captured).toHaveLength(1);
});

test('legacy form conversion preserves original request metadata for the shared handler', async () => {
  const captured: Subscriber[] = [];
  const handler = createLegacySubscriptionHandler({
    allowedOrigins, trustVercelHeaders: true,
    persist: async (subscriber) => { captured.push(subscriber); return true; },
  });
  const form = new URLSearchParams({ 'form-name': 'email-gate', email: payload.email, consent: 'yes', 'bot-field': '' });
  const response = await handler(new Request('https://demosvibes.gr/', {
    method: 'POST',
    headers: {
      origin: 'https://demosvibes.gr', 'content-type': 'application/x-www-form-urlencoded',
      'content-length': String(new TextEncoder().encode(form.toString()).byteLength),
      'x-vercel-forwarded-for': '2001:db8::7', 'user-agent': 'LegacyBrowser/1.0',
      referer: 'https://demosvibes.gr/founders-idea/?source=old-tab#prompt',
    },
    body: form,
  }));
  expect(response.status).toBe(200);
  expect(captured).toEqual([{
    email: payload.email, consent: true, ip: '2001:db8::7', userAgent: 'LegacyBrowser/1.0',
    referrer: 'https://demosvibes.gr/founders-idea/?source=old-tab',
  }]);
});

test('metadata uses bound SQL values and duplicate retries never update original metadata', async () => {
  const subscriber: Subscriber = {
    email: payload.email, consent: true, ip: '2001:db8::8',
    userAgent: "Agent's value", referrer: 'https://demosvibes.gr/?source=video',
  };
  const calls: { statement: string; values: (string | null)[] }[] = [];
  const query: SubscriberQuery = async (statement, values) => {
    calls.push({ statement, values });
    return calls.length === 1 ? [] : [{ email: subscriber.email, consent: true }];
  };
  expect(await persistSubscriber(subscriber, query)).toBe(true);
  expect(calls).toHaveLength(2);
  expect(calls[0].statement).toContain('(email, consent, ip, user_agent, referrer)');
  expect(calls[0].statement).toContain('$2::inet, $3, $4');
  expect(calls[0].statement).not.toMatch(/\bsource(?:_path)?\b/);
  expect(calls[0].statement).toContain('ON CONFLICT (email) DO NOTHING');
  expect(calls[0].statement).not.toContain(subscriber.userAgent!);
  expect(calls[0].values).toEqual([subscriber.email, subscriber.ip, subscriber.userAgent, subscriber.referrer]);
  expect(calls[1].statement).toMatch(/^SELECT email, consent/);
  expect(calls.every(({ statement }) => !/UPDATE/i.test(statement))).toBe(true);
});
