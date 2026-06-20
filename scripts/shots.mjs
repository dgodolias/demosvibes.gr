import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const BASE = process.env.BASE || 'http://localhost:4173';
const KEY = 'dv_gate_accepted_v1';
await mkdir('.shots', { recursive: true });

const browser = await chromium.launch();

// 1) Gate visible on first visit (desktop)
let page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
await page.screenshot({ path: '.shots/01-gate.png' });

// Accept gate for the rest of the shots.
const ctx = await browser.newContext({ viewport: { width: 1280, height: 1400 } });
await ctx.addInitScript((k) => localStorage.setItem(k, '1'), KEY);
page = await ctx.newPage();

const shots = [
  ['/', '02-home.png'],
  ['/founders-idea', '03-prompt.png'],
  ['/graphify', '04-guide.png'],
  ['/estate-ai-furnishing/tools', '05-tools.png'],
  ['/privacy', '06-privacy.png'],
];
for (const [path, file] of shots) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: '.shots/' + file, fullPage: true });
}

// Mobile home
const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
await m.addInitScript((k) => localStorage.setItem(k, '1'), KEY);
const mp = await m.newPage();
await mp.goto(BASE + '/', { waitUntil: 'networkidle' });
await mp.waitForTimeout(300);
await mp.screenshot({ path: '.shots/07-home-mobile.png', fullPage: true });

await browser.close();
console.log('shots written to .shots/');
