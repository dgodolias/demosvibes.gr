import { test, expect } from '@playwright/test';

const KEY = 'dv_gate_accepted_v1';

test('gate appears on first visit and "Μπαίνω στο site" works with an EMPTY email', async ({ page }) => {
  await page.goto('/');

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  const enter = page.getByRole('button', { name: 'Μπαίνω στο site' });
  await expect(enter).toBeVisible();
  await expect(enter).toBeEnabled();

  // Click with no email at all — the gate must still let the user in.
  await enter.click();
  await expect(dialog).toBeHidden();

  // Acceptance persisted.
  const stored = await page.evaluate((k) => localStorage.getItem(k), KEY);
  expect(stored).toBe('1');

  // The page content is visible underneath.
  await expect(page.getByRole('heading', { name: 'Βρες το υλικό πίσω από το βίντεο.' })).toBeVisible();

  // Reload → gate does NOT reappear.
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('returning visitor (localStorage set) is not gated', async ({ page }) => {
  await page.addInitScript((k) => localStorage.setItem(k, '1'), KEY);
  await page.goto('/founders-idea');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Founders Playbook: η ιδέα' })).toBeVisible();
});

test('a valid email POSTs the right payload to Netlify Forms (implicit consent)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('dialog')).toBeVisible();

  // Intercept the form POST (only POST to "/" is the submission).
  let posted: string | null = null;
  await page.route('http://localhost:4173/', async (route, request) => {
    if (request.method() === 'POST') {
      posted = request.postData();
      await route.fulfill({ status: 200, contentType: 'text/html', body: 'OK' });
    } else {
      await route.continue();
    }
  });

  await page.fill('input[name="email"]', 'test@example.com');
  await page.getByRole('button', { name: 'Μπαίνω στο site' }).click();

  await expect(page.getByRole('dialog')).toBeHidden();

  expect(posted).not.toBeNull();
  expect(posted!).toContain('form-name=email-gate');
  expect(posted!).toContain('email=test%40example.com');
  expect(posted!).toContain('consent=yes');
});

test('the gate also guards deep links to sub-pages', async ({ page }) => {
  await page.goto('/graphify');
  await expect(page.getByRole('dialog')).toBeVisible();
});
