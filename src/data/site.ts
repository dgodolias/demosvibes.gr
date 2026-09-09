/** Single source of truth for site-wide identity (SEO, JSON-LD, footer). */
export const site = {
  name: 'demosvibes',
  domain: 'demosvibes.gr',
  url: 'https://demosvibes.gr',
  locale: 'el_GR',
  lang: 'el',
  author: 'dgodolias',
  email: 'demosgodvibes@gmail.com',
  description:
    'Videos, εργαλεία και projects από τον Δήμο: prompts, links και οδηγοί για όσα βλέπεις στο Demos Vibes, μαζί με δικά μου εργαλεία και το portfolio μου.',
  ogImage: 'https://demosvibes.gr/og/default.jpg',
  logo: 'https://demosvibes.gr/assets/logo_v2_180.png',
  github: 'https://github.com/dgodolias/demosvibes.gr',
} as const;
