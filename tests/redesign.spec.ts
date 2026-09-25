import type { Page } from '@playwright/test';

import { expect, test } from '@playwright/test';

const GATE_KEY = 'dv_gate_accepted_v1';

async function enterAsReturningVisitor(page: Page) {
  await page.addInitScript((key) => localStorage.setItem(key, '1'), GATE_KEY);
}

test.beforeEach(async ({ page }) => {
  // Card layout and navigation must not depend on third-party iframe availability.
  for (const origin of ['https://dgodolias.github.io', 'https://dimosthenisgkontolias.com']) {
    await page.route(`${origin}/**`, (route) => route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><html lang="en"><title>External preview fixture</title><body>Preview</body></html>',
    }));
  }
});

test('the three primary sections keep the approved copy and existing resource access', async ({ page }) => {
  await enterAsReturningVisitor(page);
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Κύρια πλοήγηση' });
  await expect(navigation.getByRole('link')).toHaveText(['Videos', 'Tools', 'About me']);
  await expect(navigation.getByRole('link', { name: 'Videos', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#videos-title')).toHaveText('Είδες το βίντεο.Πάρε και το υλικό.');

  await navigation.getByRole('link', { name: 'Tools', exact: true }).click();
  await expect(page).toHaveURL(/\/tools\/?$/);
  await expect(navigation.getByRole('link', { name: 'Tools', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('#tools-title')).toHaveText('Τα έφτιαξα για να διευκολυνθώ εγώ.Τώρα επωφελείσαι και εσύ!');

  await navigation.getByRole('link', { name: 'About me', exact: true }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Γεια είμαι ο Δήμος');
  await expect(navigation.getByRole('link', { name: 'About me', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('link', { name: 'Προεπισκόπηση portfolio του Δήμου — άνοιγμα σε νέα καρτέλα' }))
    .toHaveAttribute('href', 'https://dimosthenisgkontolias.com/');

  await page.goto('/founders-idea');
  await expect(page.getByRole('heading', { name: 'Founders Playbook: η ιδέα', exact: true })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await navigation.getByRole('link', { name: 'Videos', exact: true }).click();
  await expect(page.locator('#videos-title')).toBeVisible();
});

for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
  test(`tools are compact, separate floating cards at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await enterAsReturningVisitor(page);
    await page.goto('/tools/');
    const cards = page.locator('.hub-tools-grid > article');
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0).getByRole('heading', { level: 2 })).toHaveText('QRCodeStyleGen');
    await expect(cards.nth(1).getByRole('heading', { level: 2 })).toHaveText('Contego');
    await expect(page.getByText('Διαθέσιμο', { exact: true })).toHaveCount(0);
    await expect(page.getByText(/^(01|02)$/)).toHaveCount(0);

    const geometry = await page.locator('.hub-tools-grid').evaluate((grid) => {
      const gridBounds = grid.getBoundingClientRect();
      return {
        grid: { x: gridBounds.x, width: gridBounds.width },
        pageOverflows: document.documentElement.scrollWidth > window.innerWidth + 1,
        cards: [...grid.querySelectorAll(':scope > article')].map((card) => {
          const rect = card.getBoundingClientRect();
          const style = window.getComputedStyle(card);
          return {
            x: rect.x, y: rect.y, bottom: rect.bottom, right: rect.right, width: rect.width, height: rect.height,
            borders: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
            shadow: style.boxShadow,
          };
        }),
      };
    });
    expect(geometry.pageOverflows).toBe(false);
    for (const card of geometry.cards) {
      expect(card.borders).toEqual(['0px', '0px', '0px', '0px']);
      expect(card.shadow).not.toBe('none');
    }
    const [first, second] = geometry.cards;
    if (viewport.width >= 1000) {
      // Three per row: two rows (six tools) fit in one desktop screen.
      expect(Math.abs(first.width - geometry.grid.width / 3)).toBeLessThanOrEqual(14);
      expect(Math.abs(second.y - first.y)).toBeLessThanOrEqual(1);
      expect(second.x - first.right).toBeGreaterThanOrEqual(12);
      expect(first.height * 2).toBeLessThan(viewport.height - 300);
    } else {
      // One compact row per tool on phones.
      expect(Math.abs(first.width - geometry.grid.width)).toBeLessThanOrEqual(1);
      expect(second.y - first.bottom).toBeGreaterThanOrEqual(8);
      expect(first.height).toBeLessThanOrEqual(112);
    }
    await expect(cards.nth(0).getByRole('link', { name: 'Προεπισκόπηση QRCodeStyleGen — άνοιγμα σε νέα καρτέλα' }))
      .toHaveAttribute('href', 'https://dgodolias.github.io/QRCodeStyleGen/');
    await expect(cards.nth(1).getByText('Έρχεται σύντομα', { exact: true })).toBeVisible();
  });
}

test('local tools search filters cards, preserves the privacy supplement and restores all tools', async ({ page }) => {
  await enterAsReturningVisitor(page);
  await page.goto('/tools/');
  const search = page.getByRole('searchbox', { name: 'Αναζήτηση στα Tools' });
  await search.fill('cookie');
  await expect(page.locator('.hub-tools-grid > article')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Contego', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'QRCodeStyleGen', exact: true })).toHaveCount(0);
  await expect(page.locator('#contego').getByRole('link', { name: 'Πολιτική απορρήτου', exact: true }))
    .toHaveAttribute('href', '/tools/contego/privacy/');
  await expect(page).toHaveURL(/\?q=cookie$/);

  await page.reload();
  await expect(search).toHaveValue('cookie');
  await expect(page.locator('.hub-tools-grid > article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Καθαρισμός: Αναζήτηση στα Tools', exact: true }).click();
  await expect(search).toHaveValue('');
  await expect(search).toBeFocused();
  await expect(page.locator('.hub-tools-grid > article')).toHaveCount(2);
});

test('global search understands a Greek task and opens the matching tool from another section', async ({ page }) => {
  await enterAsReturningVisitor(page);
  await page.goto('/about/');
  await page.getByRole('button', { name: 'Αναζήτηση σε όλο το site', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Τι ψάχνεις;' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('searchbox', { name: 'Αναζήτηση σε όλο το site' }).fill('θελω qr με λογοτυπο');
  const qrResult = dialog.getByRole('link', { name: /QRCodeStyleGen/ });
  await expect(qrResult).toBeVisible();
  await expect(qrResult).toHaveAttribute('href', '/tools#qrcode-style-gen');
  await qrResult.focus();
  await page.keyboard.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(page).toHaveURL(/\/tools\/?#qrcode-style-gen$/);
  await expect(page.locator('#qrcode-style-gen')).toBeInViewport();
});

test('Ctrl+K focuses search, native modal contains keyboard focus and Escape restores it', async ({ page }) => {
  await enterAsReturningVisitor(page);
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Αναζήτηση σε όλο το site', exact: true });
  await trigger.focus();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Τι ψάχνεις;' });
  const input = dialog.getByRole('searchbox', { name: 'Αναζήτηση σε όλο το site' });
  await expect(dialog).toBeVisible();
  await expect(input).toBeFocused();
  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press('Tab');
    await expect.poll(() => dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Control+k');
  await expect(input).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('Contego privacy is public on a first visit and ships the real policy in prerendered HTML', async ({ page }) => {
  const response = await page.goto('/tools/contego/privacy/');
  expect(response?.ok()).toBe(true);
  const html = await response!.text();
  expect(html).toContain('Version 1.2.3');
  expect(html).toContain('9 September 2026');
  expect(html).toContain('Dimosthenis Panagiotis Gkontolias');
  expect(html).toContain('We have no server copy to retrieve or delete.');

  await expect(page.getByRole('heading', { name: /Your browser\.\s*Your choices\./ })).toBeVisible();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Μπαίνω στο site' })).toHaveCount(0);
  expect(await page.evaluate((key) => localStorage.getItem(key), GATE_KEY)).toBeNull();
  await expect(page.locator('link[rel="canonical"]'))
    .toHaveAttribute('href', 'https://demosvibes.gr/tools/contego/privacy/');
  await expect(page.locator('article#en')).toHaveAttribute('lang', 'en');
  await expect(page.locator('article#en h2')).toHaveCount(7);
  await expect(page.getByRole('link', { name: 'dgodolias18@gmail.com', exact: true }))
    .toHaveAttribute('href', 'mailto:dgodolias18@gmail.com');
  await expect(page.getByText('This policy page is hosted on Vercel.', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('article#en')).toBeVisible();
});
