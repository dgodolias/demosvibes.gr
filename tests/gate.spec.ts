import { expect, test } from '@playwright/test';

const KEY = 'dv_gate_accepted_v1';
const EMAIL = 'test@example.com';

test('empty email enters without a subscription request and remains accepted on reload', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/subscribe', async (route) => {
    requests += 1;
    await route.fulfill({ status: 500 });
  });
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
  await expect(dialog).toHaveCount(0);
  expect(requests).toBe(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('1');
  await expect(page.getByRole('heading', { name: 'Είδες το βίντεο. Πάρε και το υλικό.' })).toBeVisible();
  await page.reload();
  await expect(dialog).toHaveCount(0);
  expect(requests).toBe(0);
});

test('returning visitor with the existing browser preference is not gated', async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, '1'), KEY);
  await page.goto('/founders-idea/');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Founders Playbook: η ιδέα' })).toBeVisible();
});

test('JSON subscription waits for durable acknowledgement and does not ask or POST again after reload', async ({ page }) => {
  const requests: { method: string; contentType: string; body: unknown }[] = [];
  let acknowledge = () => {};
  const confirmation = new Promise<void>((resolve) => { acknowledge = resolve; });
  await page.route('**/api/subscribe', async (route, request) => {
    requests.push({ method: request.method(), contentType: request.headers()['content-type'], body: request.postDataJSON() });
    await confirmation;
    await route.fulfill({ status: 201, json: { ok: true } });
  });
  await page.goto('/graphify/?q=private-search#ignored');
  const dialog = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  await dialog.getByRole('textbox', { name: 'Το email σου' }).fill(EMAIL);
  await dialog.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
  try {
    await expect(dialog.getByRole('button', { name: 'Αποθηκεύουμε το email…' })).toBeDisabled();
    await expect.poll(() => requests.length).toBe(1);
    expect(requests[0]).toEqual({
      method: 'POST', contentType: 'application/json',
      body: { email: EMAIL, consent: true, honeypot: '' },
    });
    expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull();
  } finally {
    acknowledge();
  }
  await expect(dialog).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('1');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'graphify — οδηγός βήμα βήμα' })).toBeVisible();
  await expect(dialog).toHaveCount(0);
  expect(requests).toHaveLength(1);
});

test('failed save keeps the email and gate open until a successful retry', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/subscribe', async (route) => {
    requests += 1;
    await route.fulfill({ status: requests === 1 ? 503 : 200, json: { ok: requests > 1 } });
  });
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  await dialog.getByRole('textbox', { name: 'Το email σου' }).fill(EMAIL);
  await dialog.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
  await expect(dialog.getByRole('alert')).toContainText('Δεν μπορέσαμε να επιβεβαιώσουμε');
  await expect(dialog.getByRole('textbox', { name: 'Το email σου' })).toHaveValue(EMAIL);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull();
  await dialog.getByRole('button', { name: 'Δοκίμασε ξανά' }).click();
  await expect(dialog).toHaveCount(0);
  expect(requests).toBe(2);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('1');
});

test('a network failure permits explicit entry without resubmitting the email', async ({ page }) => {
  let requests = 0;
  await page.route('**/api/subscribe', async (route) => {
    requests += 1;
    await route.abort('failed');
  });
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  await dialog.getByRole('textbox', { name: 'Το email σου' }).fill(EMAIL);
  await dialog.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
  await expect(dialog.getByRole('alert')).toBeVisible();
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull();
  await dialog.getByRole('button', { name: 'Συνέχεια χωρίς νέα υποβολή' }).click();
  await expect(dialog).toHaveCount(0);
  expect(requests).toBe(1);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('1');
});

test('an HTML success response cannot masquerade as a saved subscription', async ({ page }) => {
  await page.route('**/api/subscribe', async (route) => {
    await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Site fallback</title>' });
  });
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  await dialog.getByRole('textbox', { name: 'Το email σου' }).fill(EMAIL);
  await dialog.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
  await expect(dialog.getByRole('alert')).toBeVisible();
  await expect(dialog.getByRole('textbox', { name: 'Το email σου' })).toHaveValue(EMAIL);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull();
});

test('the actual honeypot value is included in the subscription request', async ({ page }) => {
  let body: unknown;
  await page.route('**/api/subscribe', async (route, request) => {
    body = request.postDataJSON();
    await route.fulfill({ status: 400, json: { ok: false } });
  });
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  await dialog.getByRole('textbox', { name: 'Το email σου' }).fill(EMAIL);
  await dialog.locator('input[name="bot-field"]').evaluate((input: HTMLInputElement) => { input.value = 'bot-value'; });
  await dialog.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
  await expect(dialog.getByRole('alert')).toBeVisible();
  expect(body).toEqual({ email: EMAIL, consent: true, honeypot: 'bot-value' });
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBeNull();
});

test('a repeated email acknowledged by the API enters normally on a new browser visit', async ({ page }) => {
  const submittedEmails: string[] = [];
  await page.route('**/api/subscribe', async (route, request) => {
    submittedEmails.push(request.postDataJSON().email);
    // The API uses the same acknowledgement for inserted and existing subscribers.
    await route.fulfill({ status: 200, json: { ok: true } });
  });
  await page.goto('/');
  const dialog = page.getByRole('dialog', { name: 'Μπες στο demosvibes.' });
  for (let visit = 0; visit < 2; visit += 1) {
    await dialog.getByRole('textbox', { name: 'Το email σου' }).fill(EMAIL);
    await dialog.getByRole('button', { name: 'Μπαίνω στο site', exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe('1');
    if (visit === 0) {
      await page.evaluate((key) => localStorage.removeItem(key), KEY);
      await page.reload();
    }
  }
  expect(submittedEmails).toEqual([EMAIL, EMAIL]);
});

test('the gate also guards deep links to resource pages', async ({ page }) => {
  await page.goto('/graphify/');
  await expect(page.getByRole('dialog', { name: 'Μπες στο demosvibes.' })).toBeVisible();
});
