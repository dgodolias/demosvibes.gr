import type { SearchDocument } from '../lib/search';
import type { Block, Resource } from './types';

import { isReleasedOnHomepage } from '../lib/release';
import { contegoPrivacyArticle } from './contegoPrivacy';
import { resources } from './resources';

const ENTITIES: Record<string, string> = {
  amp: '&', apos: "'", gt: '>', hellip: '…', laquo: '«', ldquo: '“',
  lsquo: '‘', lt: '<', mdash: '—', nbsp: ' ', ndash: '–', quot: '"', raquo: '»',
  rdquo: '”', rsquo: '’',
};

/** Extract visible text without requiring the DOM during prerendering or tests. */
export function stripSearchMarkup(value: string): string {
  return value.replace(/<!--[^]*?-->/g, ' ')
    .replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code: string) => {
      if (!code.startsWith('#')) return ENTITIES[code.toLowerCase()] ?? ' ';
      const point = code[1].toLowerCase() === 'x' ? Number.parseInt(code.slice(2), 16) : Number.parseInt(code.slice(1), 10);
      return point > 0 && point <= 0x10ffff ? String.fromCodePoint(point) : entity;
    }).replace(/\s+/g, ' ').trim();
}

function blockText(block: Block): string {
  switch (block.kind) {
    case 'prompt': return `${block.label} ${block.text}`;
    case 'steps': return `${block.title} ${block.items.join(' ')}`;
    case 'prose': return `${block.title ?? ''} ${block.html}`;
    case 'cardLinks': return block.items.map(({ title, sub }) => `${title} ${sub}`).join(' ');
    case 'html': return block.html;
  }
}

const RESOURCE_INTENTS: Record<string, string[]> = {
  'harvard-sql': ['μάθω SQL', 'μάθημα', 'course', 'πιστοποίηση', 'δωρεάν certificate'],
  'menu-explain': ['μετάφραση μενού', 'φαγητό', 'εστιατόριο', 'ταξίδι'],
  'cv-tailor': ['βιογραφικό', 'δουλειά', 'εργασία', 'resume', 'αίτηση εργασίας'],
  'suno-ai': ['μουσική', 'τραγούδι', 'music', 'song', 'στίχοι'],
  'estate-ai-furnishing': ['διακόσμηση', 'επίπλωση', 'σπίτι', 'δωμάτιο', 'staging'],
  'which-ai': ['ποιο AI να διαλέξω', 'σύγκριση', 'επιλογή AI'],
  'false-sense-security': ['ειλικρίνεια', 'κολακεία', 'αλήθεια', 'συμφωνεί συνέχεια'],
};

/** Child routes inherit release restrictions from every card-bearing ancestor. */
export function getResourceSearchDocuments(source: Resource[], now: number): SearchDocument[] {
  const bySlug = new Map(source.map((resource) => [resource.slug, resource]));
  return source.filter((resource) => {
    const segments = resource.slug.split('/');
    let hasReleasedCard = false;
    for (let length = 1; length <= segments.length; length += 1) {
      const ancestor = bySlug.get(segments.slice(0, length).join('/'));
      if (!ancestor?.card) continue;
      if (!isReleasedOnHomepage(ancestor, now)) return false;
      hasReleasedCard = true;
    }
    return hasReleasedCard;
  }).map((resource) => ({
    id: resource.slug,
    title: resource.card?.title ?? resource.heading,
    description: resource.card?.desc ?? resource.seoDescription,
    href: `/${resource.slug}`,
    scope: 'videos',
    keywords: [
      ...(resource.card?.searchTags ?? []), ...(resource.card?.cardTags ?? []),
      ...(RESOURCE_INTENTS[resource.slug] ?? []), resource.pageKind, 'video',
    ],
    content: stripSearchMarkup([
      resource.heading, resource.seoTitle, resource.seoDescription, resource.introHtml,
      resource.headerExtraHtml ?? '', ...resource.blocks.map(blockText),
    ].join(' ')),
  }));
}

const SITE_DOCUMENTS: SearchDocument[] = [
  {
    id: 'qrcode-style-gen', title: 'QRCodeStyleGen', scope: 'tools',
    description: 'Φτιάξε το δικό σου QR code με χρώματα, σχήματα και λογότυπο, μέσα στον browser σου.',
    href: '/tools#qrcode-style-gen',
    keywords: ['qr', 'qrcode', 'qr code', 'generator', 'χρώματα', 'λογότυπο', 'logo', 'δωρεάν', 'web app', 'εργαλείο'],
    content: 'QR codes στα μέτρα σου. Δημιουργία και σχεδιασμός QR code για ένα link, με χρώματα, σχήματα και λογότυπο. QRCodeStyleGen.',
  },
  {
    id: 'contego', title: 'Contego', scope: 'tools',
    description: 'Chrome extension για cookie banners με τις προτιμήσεις σου και προαιρετικό ad blocking. Έρχεται σύντομα.',
    href: '/tools#contego',
    keywords: ['chrome', 'extension', 'επέκταση', 'cookies', 'cookie banners', 'consent', 'ads', 'adblock', 'διαφημίσεις', 'privacy', 'ιδιωτικότητα'],
    content: 'Οι επιλογές σου στο browsing. Extension που χειρίζεται τα cookie banners με τις προτιμήσεις σου και προσφέρει προαιρετικό ad blocking. Η εγκατάσταση θα είναι διαθέσιμη σύντομα. Συμπληρωματικό υλικό: πολιτική απορρήτου.',
  },
  {
    id: 'contego-privacy', title: 'Contego — Πολιτική απορρήτου', scope: 'tools',
    description: 'Πώς λειτουργεί το Contego και ποια δεδομένα χρησιμοποιεί. Η πολιτική απορρήτου είναι στα αγγλικά.',
    href: '/tools/contego/privacy/',
    keywords: ['contego', 'privacy', 'policy', 'απόρρητο', 'πολιτική απορρήτου', 'δεδομένα', 'προσωπικά δεδομένα', 'chrome web store'],
    content: stripSearchMarkup(contegoPrivacyArticle),
  },
  {
    id: 'about', title: 'Γεια είμαι ο Δήμος', scope: 'about',
    description: 'AI Software Engineer & Creator. Projects, εμπειρία και επικοινωνία στο προσωπικό μου site.',
    href: '/about',
    keywords: ['Δήμος', 'Δημοσθένης Γκοντολιάς', 'Dimosthenis Gkontolias', 'Dimos', 'dgodolias', 'demos vibes', 'about me', 'portfolio', 'projects', 'επικοινωνία', 'contact'],
    content: 'Φτιάχνω software και μοιράζομαι όσα μαθαίνω για το AI, μέσα από το Demos Vibes. AI Software Engineer & Creator. Αθήνα, Ελλάδα. Στο προσωπικό μου site θα βρεις τα projects, την εμπειρία μου και τρόπους να επικοινωνήσουμε. dimosthenisgkontolias.com',
  },
];

let cachedKey = '';
let cachedDocuments: SearchDocument[] = [];

export function getSearchDocuments(now = Date.now()): SearchDocument[] {
  const released = getResourceSearchDocuments(resources, now);
  const key = released.map(({ id }) => id).join('|');
  if (key !== cachedKey || !cachedDocuments.length) {
    cachedKey = key;
    cachedDocuments = [...released, ...SITE_DOCUMENTS];
  }
  return cachedDocuments;
}
