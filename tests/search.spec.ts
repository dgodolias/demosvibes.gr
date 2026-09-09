import { expect, test } from '@playwright/test';

import { getResourceSearchDocuments, getSearchDocuments, stripSearchMarkup } from '../src/data/search';
import { resources } from '../src/data/resources';
import { normalizeSearch, searchDocuments } from '../src/lib/search';

const NOW = Date.parse('2026-09-09T12:00:00+03:00');
const corpus = getSearchDocuments(NOW);

test('Greek accents and final sigma normalize; Greeklish finds the same public resource', () => {
  expect(normalizeSearch('  ΒΙΟΓΡΑΦΙΚΌ ΤΗΣ  ')).toBe('βιογραφικο τησ');
  for (const query of ['βιογραφικό', 'ΒΙΟΓΡΑΦΙΚΟ', 'viografiko', 'resume']) {
    expect(searchDocuments(corpus, query)[0]?.document.id).toBe('cv-tailor');
  }
});

test('misspellings and swapped letters rank the intended title first', () => {
  expect(searchDocuments(corpus, 'harvrad sql')[0]?.document.id).toBe('harvard-sql');
  expect(searchDocuments(corpus, 'contgeo')[0]?.document.id).toBe('contego');
  expect(searchDocuments(corpus, 'qrcodestylegn')[0]?.document.id).toBe('qrcode-style-gen');
});

test('natural task queries find relevant tools, learning material and translations', () => {
  for (const [query, id] of [
    ['θέλω να φτιάξω QR με λογότυπο', 'qrcode-style-gen'],
    ['thelw na ftiakso qr me xromata', 'qrcode-style-gen'],
    ['θέλω να μάθω SQL δωρεάν', 'harvard-sql'],
    ['μετάφραση μενού', 'menu-explain'],
    ['φτιάξε τραγούδι', 'suno-ai'],
    ['θέλω να επικοινωνήσω με τον Δήμο', 'about'],
    ['cookie banners', 'contego'],
    ['πολιτική απορρήτου contego', 'contego-privacy'],
  ]) {
    expect(searchDocuments(corpus, query)[0]?.document.id, query).toBe(id);
  }
});

test('local scopes never leak other sections; irrelevant and stopword-only queries stay empty', () => {
  expect(searchDocuments(corpus, 'QR', 'videos').every(({ document }) => document.scope === 'videos')).toBe(true);
  expect(searchDocuments(corpus, 'contego', 'about')).toEqual([]);
  expect(searchDocuments(corpus, 'zzzxqvvv')).toEqual([]);
  expect(searchDocuments(corpus, 'θέλω να')).toEqual([]);
  expect(searchDocuments(corpus, '', 'tools').map(({ document }) => document.id)).toEqual(['qrcode-style-gen', 'contego', 'contego-privacy']);
  expect(searchDocuments(corpus, 'AI').some(({ document }) => document.id === 'which-ai')).toBe(true);
  expect(searchDocuments(corpus, 'AI').some(({ document }) => document.id === 'contego-privacy')).toBe(false);
});

test('index includes actual body text and published nested pages without HTML attributes', () => {
  expect(searchDocuments(corpus, 'Edensign')[0]?.document.id).toBe('estate-ai-furnishing/tools');
  const harvard = corpus.find(({ id }) => id === 'harvard-sql');
  expect(harvard?.content).toContain('Gradebook');
  expect(harvard?.content).not.toContain('<strong>');
  expect(harvard?.content).not.toContain('target="_blank"');
  const privacy = corpus.find(({ id }) => id === 'contego-privacy');
  expect(privacy?.description).not.toContain('στα ελληνικά');
  expect(privacy?.content).toContain('Version 1.2.3');
  expect(privacy?.content).toContain('9 September 2026');
  expect(searchDocuments(corpus, 'aggregate counter')[0]?.document.id).toBe('contego-privacy');
  expect(stripSearchMarkup('<style>.hidden{}</style><p>A &amp; B &#x3B1; &#945;</p><script>secret()</script>')).toBe('A & B α α');
});

test('inactive resources never enter the corpus and schedules release at the exact instant', () => {
  expect(corpus.some(({ id }) => id === 'pic-a-pet-name' || id === 'ai-koskino')).toBe(false);
  const releaseAt = Date.parse('2026-06-28T21:30:00+03:00');
  expect(getSearchDocuments(releaseAt - 1).some(({ id }) => id === 'say-my-name')).toBe(false);
  expect(getSearchDocuments(releaseAt).some(({ id }) => id === 'say-my-name')).toBe(true);
});

test('nested descendants inherit inactive and scheduled parent restrictions', () => {
  const parent = resources.find(({ slug }) => slug === 'estate-ai-furnishing')!;
  const child = resources.find(({ slug }) => slug === 'estate-ai-furnishing/tools')!;
  const inactiveParent = { ...parent, card: { ...parent.card!, status: 'inactive' as const } };
  expect(getResourceSearchDocuments([inactiveParent, child], NOW)).toEqual([]);
  const releaseAt = '2026-09-10T10:00:00+03:00';
  const scheduledParent = { ...parent, card: { ...parent.card!, status: 'scheduled' as const, visibleAfter: releaseAt } };
  expect(getResourceSearchDocuments([scheduledParent, child], NOW)).toEqual([]);
  expect(getResourceSearchDocuments([scheduledParent, child], Date.parse(releaseAt)).map(({ id }) => id)).toEqual([parent.slug, child.slug]);
  expect(getResourceSearchDocuments([child], NOW)).toEqual([]);
});
