import { Head } from 'vite-react-ssg';
import { site } from '../data/site';
import { canonical } from '../lib/seo';

interface SeoProps {
  title: string;
  description: string;
  /** Route path, e.g. '/founders-idea' or '/'. */
  path: string;
  ogType?: 'website' | 'article';
  image?: string;
  /** JSON-LD object(s) injected as <script type="application/ld+json">. */
  jsonLd?: object | object[];
}

/**
 * Per-page <head>: title, description, canonical, Open Graph, Twitter Card and
 * JSON-LD. Rendered into the prerendered HTML by vite-react-ssg's <Head>.
 */
export default function Seo({ title, description, path, ogType = 'article', image, jsonLd }: SeoProps) {
  const url = canonical(path);
  const img = image ?? site.ogImage;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <html lang={site.lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${title} — ${site.name}`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {blocks.map((b, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(b)}
        </script>
      ))}
    </Head>
  );
}
