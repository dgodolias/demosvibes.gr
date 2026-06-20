/** Single source of truth for site-wide identity (SEO, JSON-LD, footer). */
export const site = {
  name: 'demosvibes',
  domain: 'demosvibes.gr',
  url: 'https://demosvibes.gr',
  locale: 'el_GR',
  lang: 'el',
  author: 'dgodolias',
  email: 'imopsch@gmail.com',
  description:
    'Συμπληρωματικό υλικό για τα short-form βίντεο του dgodolias: prompts, εργαλεία, οδηγοί και links.',
  ogImage: 'https://demosvibes.gr/og/default.jpg',
  logo: 'https://demosvibes.gr/assets/logo_v2_180.png',
  github: 'https://github.com/dgodolias/demosvibes.gr',
} as const;
