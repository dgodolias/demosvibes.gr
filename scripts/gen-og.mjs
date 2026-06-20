// Generates 1200x630 Open Graph images into public/og/ (one per page + default).
// Run locally once (and whenever titles change): `node scripts/gen-og.mjs`.
// Requires: npx playwright install chromium
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const OUT = 'public/og';
await mkdir(OUT, { recursive: true });

// key = og filename (slug with '/' -> '_'); '' = default.jpg
const pages = [
  { key: '', title: 'Prompts, οδηγοί & AI εργαλεία', kicker: 'στα ελληνικά' },
  { key: 'founders-idea', title: 'Founders Playbook: η ιδέα', kicker: 'Validation' },
  { key: 'founders-mvp', title: 'Founders Playbook: το MVP', kicker: 'Product-market fit' },
  { key: 'founders-launch', title: 'Founders Playbook: το launch', kicker: 'Systems' },
  { key: 'founders-scale', title: 'Founders Playbook: το scale', kicker: 'Lock-in & moat' },
  { key: 'cv-tailor', title: 'CV tailoring prompt', kicker: 'ATS-aware' },
  { key: 'grill-me', title: 'grill-me', kicker: 'Οδηγός βήμα βήμα' },
  { key: 'thea-learning', title: 'Thea', kicker: 'Οδηγός μελέτης με AI' },
  { key: 'anomaly-ai', title: 'FindAnomaly', kicker: 'Data σε dashboard' },
  { key: 'graphify', title: 'graphify', kicker: 'Knowledge graph' },
  { key: 'estate-ai-furnishing', title: 'AI staging ακινήτων', kicker: 'Επίπλωση με AI' },
  { key: 'estate-ai-furnishing_chatbots', title: 'Chatbots + master prompt', kicker: 'AI staging' },
  { key: 'estate-ai-furnishing_tools', title: 'Ειδικά εργαλεία', kicker: 'AI staging' },
];

const template = ({ title, kicker }) => `<!doctype html><html lang="el"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Display:wght@500;700&family=Google+Sans+Text:wght@500;700&display=swap" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #10131a;
    background-image:
      radial-gradient(1100px 500px at 100% 0%, rgba(217,107,53,.25), transparent 60%),
      radial-gradient(900px 500px at 0% 100%, rgba(11,107,93,.30), transparent 60%),
      linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
    background-size: auto, auto, 40px 40px, 40px 40px;
    font-family: "Google Sans Text", system-ui, sans-serif; color: #fff;
    padding: 72px 80px; display: flex; flex-direction: column; justify-content: space-between; }
  .top { display: flex; align-items: center; gap: 14px; }
  .mark { width: 52px; height: 52px; display: grid; place-items: center; border-radius: 12px;
    background: #fff; color: #10131a; font-weight: 700; font-size: 20px; font-family: "Google Sans Display"; }
  .brand { font-size: 24px; font-weight: 700; letter-spacing: .2px; }
  .kicker { color: #f0a071; font-weight: 700; font-size: 24px; margin-bottom: 18px; }
  h1 { font-family: "Google Sans Display", sans-serif; font-weight: 700; font-size: 76px; line-height: 1.04; max-width: 18ch; }
  .url { color: rgba(255,255,255,.65); font-size: 22px; font-weight: 500; }
</style></head><body>
  <div class="top"><span class="mark">dg</span><span class="brand">demosvibes</span></div>
  <div><div class="kicker">${kicker}</div><h1>${title}</h1></div>
  <div class="url">demosvibes.gr</div>
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

for (const p of pages) {
  await page.setContent(template(p), { waitUntil: 'networkidle' });
  await page.waitForTimeout(250); // let webfonts settle
  const file = `${OUT}/${p.key || 'default'}.jpg`;
  await page.screenshot({ path: file, type: 'jpeg', quality: 90 });
  console.log('wrote', file);
}

await browser.close();
