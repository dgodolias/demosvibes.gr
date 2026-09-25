import type { Page } from '@playwright/test';

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { expect, test } from '@playwright/test';

import { disclaimers } from '../src/data/disclaimers';
import { protectedContent } from '../server/disclaimers';

const GATE_KEY = 'dv_gate_accepted_v1';
const STORE_KEY = 'dv_disclaimers_v1';
const ID = '8f6b7a2e-4c1d-4e5f-9a0b-1c2d3e4f5a6b';
const VERSION = disclaimers['kickbacks-ai'].version;
const BLOCKS = protectedContent['kickbacks-ai'];
// Phrases that exist only in the server-side article body.
const PROTECTED_MARKERS = ['Download the signed VSIX', 'Set up payouts', 'W-8BEN'];

test.use({ viewport: { width: 390, height: 740 } });

async function enterSite(page: Page, stored?: string) {
  await page.addInitScript(([gateKey, storeKey, value]) => {
    localStorage.setItem(gateKey, '1');
    if (value) localStorage.setItem(storeKey, value);
  }, [GATE_KEY, STORE_KEY, stored ?? ''] as const);
}

async function scrollDisclaimerToEnd(page: Page) {
  await page.getByRole('region', { name: 'Κείμενο δήλωσης αποποίησης ευθύνης' })
    .evaluate((element) => { element.scrollTop = element.scrollHeight; });
}

test('the prerendered page and every built script exclude the protected article', async () => {
  const html = await readFile(join('dist', 'kickbacks-ai', 'index.html'), 'utf8');
  expect(html).toContain('Kickbacks.ai: πώς βγάζω χρήματα');
  const assets = (await readdir(join('dist', 'assets'))).filter((name) => name.endsWith('.js'));
  expect(assets.length).toBeGreaterThan(0);
  const scripts = await Promise.all(assets.map((name) => readFile(join('dist', 'assets', name), 'utf8')));
  for (const marker of PROTECTED_MARKERS) {
    expect(html).not.toContain(marker);
    for (const script of scripts) expect(script).not.toContain(marker);
  }
});

test('the article unlocks only after scrolling to the end and a recorded acceptance', async ({ page }) => {
  const bodies: unknown[] = [];
  await page.route('**/api/disclaimer', async (route, request) => {
    bodies.push(request.postDataJSON());
    await route.fulfill({ status: 200, json: { ok: true, acceptance: ID, blocks: BLOCKS } });
  });
  await enterSite(page);
  await page.goto('/kickbacks-ai/');
  const dialog = page.getByRole('dialog', { name: disclaimers['kickbacks-ai'].title });
  await expect(dialog).toBeVisible();
  const accept = dialog.getByRole('button', { name: 'Κύλισε μέχρι το τέλος για να συνεχίσεις' });
  await expect(accept).toBeDisabled();
  await expect(page.getByText('Download the signed VSIX')).toHaveCount(0);

  await scrollDisclaimerToEnd(page);
  await dialog.getByRole('button', { name: 'Διάβασα και αποδέχομαι' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Βήμα 3: Κατέβασε το Kickbacks.ai και εγκατέστησέ το από το Extensions' })).toBeVisible();
  expect(bodies).toEqual([{ disclaimer: 'kickbacks-ai', version: VERSION, accepted: true }]);
  expect(JSON.parse(await page.evaluate((key) => localStorage.getItem(key) ?? '{}', STORE_KEY)))
    .toEqual({ 'kickbacks-ai': { version: VERSION, acceptance: ID } });

  await page.reload();
  await expect(page.getByRole('heading', { name: 'Βήμα 7: Σύνδεσε το Stripe για να πληρωθείς' })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(bodies[1]).toEqual({ disclaimer: 'kickbacks-ai', version: VERSION, acceptance: ID });
});

test('removing the dialog from the page reveals no article and sends no request', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/disclaimer', async (route) => { requests += 1; await route.fulfill({ status: 500 }); });
  await enterSite(page);
  await page.goto('/kickbacks-ai/');
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.evaluate(() => document.querySelector('[role="dialog"]')?.remove());
  await expect(page.getByRole('heading', { name: 'Ο οδηγός είναι κλειδωμένος' })).toBeVisible();
  const text = await page.locator('main').innerText();
  for (const marker of PROTECTED_MARKERS) expect(text).not.toContain(marker);
  expect(requests).toBe(0);
});

test('a rejected stored acceptance is forgotten and the disclaimer is shown again', async ({ page }) => {
  await page.route('**/api/disclaimer', async (route) => {
    await route.fulfill({ status: 403, json: { ok: false, error: 'acceptance_required' } });
  });
  await enterSite(page, JSON.stringify({ 'kickbacks-ai': { version: VERSION, acceptance: ID } }));
  await page.goto('/kickbacks-ai/');
  await expect(page.getByRole('dialog', { name: disclaimers['kickbacks-ai'].title })).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), STORE_KEY)).toBe('{}');
});

test('a failed save keeps the disclaimer open with a retry', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/disclaimer', async (route) => {
    requests += 1;
    if (requests === 1) await route.fulfill({ status: 503, json: { ok: false, error: 'disclaimer_failed' } });
    else await route.fulfill({ status: 200, json: { ok: true, acceptance: ID, blocks: BLOCKS } });
  });
  await enterSite(page);
  await page.goto('/kickbacks-ai/');
  const dialog = page.getByRole('dialog', { name: disclaimers['kickbacks-ai'].title });
  await scrollDisclaimerToEnd(page);
  await dialog.getByRole('button', { name: 'Διάβασα και αποδέχομαι' }).click();
  await expect(dialog.getByRole('alert')).toContainText('Δεν μπορέσαμε να καταγράψουμε');
  expect(await page.evaluate((key) => localStorage.getItem(key), STORE_KEY)).toBeNull();
  await dialog.getByRole('button', { name: 'Διάβασα και αποδέχομαι' }).click();
  await expect(dialog).toHaveCount(0);
  expect(requests).toBe(2);
});

test('the email gate comes first, then the disclaimer', async ({ page }) => {
  await page.goto('/kickbacks-ai/');
  const gate = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  await expect(gate).toBeVisible();
  await expect(page.getByRole('dialog', { name: disclaimers['kickbacks-ai'].title })).toHaveCount(0);
  await gate.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
  await expect(page.getByRole('dialog', { name: disclaimers['kickbacks-ai'].title })).toBeVisible();
});

test('the Tools page lists Kickbacks.ai separately as a third-party tool', async ({ page }) => {
  await enterSite(page);
  await page.goto('/tools/');
  await expect(page.getByRole('heading', { name: /Εργαλεία που χρησιμοποιώ/ })).toBeVisible();
  const card = page.locator('#kickbacks-ai');
  await expect(card.getByText('Εργαλείο τρίτου')).toBeVisible();
  await card.getByRole('link', { name: 'Δες τον οδηγό βήμα βήμα' }).click();
  await expect(page).toHaveURL(/\/kickbacks-ai\/?$/);
});
