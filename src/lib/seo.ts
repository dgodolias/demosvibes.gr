import type { Resource } from '../data/types';
import { site } from '../data/site';

/** Absolute canonical URL for a route path. Top-level pages get a trailing slash. */
export function canonical(path: string): string {
  if (path === '/') return `${site.url}/`;
  const clean = path.replace(/\/+$/, '');
  return `${site.url}${clean}/`;
}

/** WebSite + SearchAction JSON-LD for the homepage. */
export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: `${site.url}/`,
    inLanguage: site.lang,
    description: site.description,
    publisher: {
      '@type': 'Organization',
      name: site.name,
      logo: { '@type': 'ImageObject', url: site.logo },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/?q={query}` },
      'query-input': 'required name=query',
    },
  };
}

/** TechArticle + BreadcrumbList JSON-LD for a content page. */
export function articleLd(r: Resource) {
  const url = canonical('/' + r.slug);

  const crumbItems: { name: string; item: string }[] = [];
  if (r.crumb.to !== '/') crumbItems.push({ name: 'videos', item: `${site.url}/` });
  crumbItems.push({ name: r.crumb.label, item: canonical(r.crumb.to) });
  crumbItems.push({ name: r.heading, item: url });

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${url}#article`,
        headline: r.seoTitle,
        description: r.seoDescription,
        inLanguage: site.lang,
        url,
        image: ogImageFor(r),
        datePublished: r.date,
        dateModified: r.date,
        author: { '@type': 'Person', name: site.author, url: `${site.url}/` },
        publisher: {
          '@type': 'Organization',
          name: site.name,
          logo: { '@type': 'ImageObject', url: site.logo },
        },
        ...(r.citation ? { citation: r.citation } : {}),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: crumbItems.map((c, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: c.name,
          item: c.item,
        })),
      },
    ],
  };
}

/** Per-page Open Graph image (falls back to the site default). */
export function ogImageFor(r?: Resource): string {
  if (r) return `${site.url}/og/${r.slug.replace(/\//g, '_')}.jpg`;
  return site.ogImage;
}
