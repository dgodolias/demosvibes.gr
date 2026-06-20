// Generates dist/sitemap.xml by scanning the prerendered output for HTML pages.
// Runs after `vite-react-ssg build` (see package.json "build").
import { readdir, writeFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://demosvibes.gr';
const today = new Date().toISOString().slice(0, 10);

/** Recursively collect every index.html under dist/. */
async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walk(full)));
    } else if (entry.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

const files = await walk(DIST);

const urls = files
  .map((file) => {
    const dir = relative(DIST, file).replace(/index\.html$/, '');
    const path = dir.split(sep).filter(Boolean).join('/');
    return path ? `${ORIGIN}/${path}/` : `${ORIGIN}/`;
  })
  // drop the 404/star fallback if present
  .filter((u) => !u.includes('/404/'))
  .sort((a, b) => (a === `${ORIGIN}/` ? -1 : a.localeCompare(b)));

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (u) =>
        `  <url><loc>${u}</loc><lastmod>${today}</lastmod>` +
        (u === `${ORIGIN}/` ? `<priority>1.0</priority>` : '') +
        `</url>`,
    )
    .join('\n') +
  `\n</urlset>\n`;

await writeFile(join(DIST, 'sitemap.xml'), xml, 'utf8');
await stat(join(DIST, 'sitemap.xml'));
console.log(`sitemap.xml written with ${urls.length} URLs`);
