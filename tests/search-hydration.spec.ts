import { expect, test } from '@playwright/test';

const CASES = [
  { path: '/tools/?q=cookie', query: 'cookie', input: '#tools-search', result: '#contego', headingId: 'tools-title' },
  { path: '/?q=sql', query: 'sql', input: '#video-search', result: '.hub-video-grid a[href="/harvard-sql"]', headingId: 'videos-title' },
  { path: '/about/?q=projects', query: 'projects', input: '#about-search', result: '.hub-about-layout', headingId: 'about-title' },
];

for (const { path, query, input, result, headingId } of CASES) {
  test(`saved search ${path} hydrates and reloads without React errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error' && /hydrat|did not match|server.html|server.rendered|Minified React error #(418|419|421|422|423|425)/i.test(message.text())) {
        errors.push(message.text());
      }
    });
    await page.addInitScript(() => localStorage.setItem('dv_gate_accepted_v1', '1'));
    // Exercise our prerendered page independently of third-party preview servers.
    for (const origin of ['https://dgodolias.github.io', 'https://dimosthenisgkontolias.com']) {
      await page.route(`${origin}/**`, (route) => route.fulfill({
        status: 200, contentType: 'text/html',
        body: '<!doctype html><html lang="en"><title>Preview</title><body>Preview</body></html>',
      }));
    }

    // Nested SSG output uses canonical trailing slashes. Unlike Netlify, Vite's
    // preview falls back to home HTML for /tools and /about without the slash.
    const response = await page.goto(path);
    expect(response?.ok()).toBe(true);
    expect(await response!.text()).toContain(`id="${headingId}"`);
    await expect(page.locator(input)).toHaveValue(query);
    await expect(page.locator(result)).toBeVisible();
    expect(new URL(page.url()).searchParams.get('q')).toBe(query);
    if (query === 'cookie') await expect(page.locator('#qrcode-style-gen')).toHaveCount(0);
    expect(errors).toEqual([]);

    const reloadResponse = await page.reload();
    expect(reloadResponse?.ok()).toBe(true);
    expect(await reloadResponse!.text()).toContain(`id="${headingId}"`);
    await expect(page.locator(input)).toHaveValue(query);
    await expect(page.locator(result)).toBeVisible();
    expect(new URL(page.url()).searchParams.get('q')).toBe(query);
    if (query === 'cookie') await expect(page.locator('#qrcode-style-gen')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}
