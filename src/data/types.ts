/**
 * Content model for demosvibes.gr.
 *
 * Everything that varies per page lives in `resources.ts` as typed data, so
 * adding a new video page = appending one `Resource` object (no new HTML
 * boilerplate, no new route wiring).
 *
 * Common, clean layouts (prompt + Copy button, "Οδηγίες" steps, source links,
 * card links) are first-class typed blocks. The handful of bespoke "guide"
 * pages and rich tables use the `html` escape-hatch block, styled by the shared
 * classes ported into index.css.
 */

/** Chip filters on the landing page (matched against searchTags + text). */
export type FilterTag = 'prompt' | 'tool' | 'guide' | 'founders';

/** Which renderer / SEO treatment a page gets. */
export type PageKind = 'prompt' | 'guide' | 'toolList';

export type Thumb =
  | { type: 'solo'; src: string; alt: string; official?: boolean }
  | {
      type: 'pair';
      before: { src: string; alt: string };
      after: { src: string; alt: string };
    };

export interface CardLinkItem {
  icon: 'chat' | 'tool';
  title: string;
  sub: string;
  to: string;
}

/** Content blocks that can be rendered directly, including server-delivered ones. */
export type ContentBlock =
  | { kind: 'prompt'; label: string; text: string }
  | { kind: 'steps'; title: string; items: string[] }
  | { kind: 'prose'; title?: string; html: string }
  | { kind: 'cardLinks'; items: CardLinkItem[] }
  | { kind: 'html'; html: string };

/**
 * Ordered content blocks rendered by <BlockRenderer>. A `protected` block keeps
 * its content out of the prerendered HTML and the JS bundle: /api/disclaimer
 * returns it only after the visitor accepts the disclaimer (src/data/disclaimers.ts).
 */
export type Block = ContentBlock | { kind: 'protected'; disclaimer: string };

export interface Crumb {
  label: string;
  to: string;
}

/** The landing-grid card for a resource (top-level pages only). */
export interface ResourceCardData {
  title: string;
  desc: string;
  metaLine: string;
  cardTags: string[];
  searchTags: string[];
  filters: FilterTag[];
  /** Omit for a text-only card (no thumbnail asset). */
  thumb?: Thumb;
  status?: 'active' | 'inactive' | 'scheduled';
  visibleAfter?: string;
  featured?: boolean;
}

export interface Resource {
  /** Route segment(s) and old folder name, e.g. 'founders-idea' or 'estate-ai-furnishing/chatbots'. */
  slug: string;
  pageKind: PageKind;
  /** ISO date — used for sorting and JSON-LD datePublished. */
  date: string;

  /** Present for pages shown in the landing grid. Omitted for nested children. */
  card?: ResourceCardData;

  /** Per-page SEO. */
  seoTitle: string;
  seoDescription: string;

  /** Breadcrumb back-link (parent). */
  crumb: Crumb;
  heading: string;
  introHtml: string;
  /** Optional extra header markup (e.g. the Thea availability bar). */
  headerExtraHtml?: string;

  blocks: Block[];

  /** Optional source URL for JSON-LD `citation`. */
  citation?: string;
}
