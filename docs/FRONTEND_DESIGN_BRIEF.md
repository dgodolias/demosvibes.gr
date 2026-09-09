# Demos Vibes redesign

Approved for implementation and publication by the owner on 9 September 2026, after review of the local HTML prototype and successive copy/layout revisions.

## Scope and navigation

Exactly three primary sections: Videos at `/` (default), Tools at `/tools/`, About me at `/about/`. Every existing video resource keeps its published URL. Third-party tools covered by a video stay in Videos; Tools contains the author's own projects. Navigation and global search remain reachable from detail pages too.

Approved headings:

- Videos: «Είδες το βίντεο. Πάρε και το υλικό.»
- Tools: «Τα έφτιαξα για να διευκολυνθώ εγώ. Τώρα επωφελείσαι και εσύ!»
- About me: «Γεια είμαι ο Δήμος»

## Visual contract

Light background, green accent, actual site logo and existing real resource thumbnails. Persistent three-item navigation, concise introduction and searchable video grid. Tools use full-width cards stacked vertically, with soft shadows around the complete card; no exterior border, colored top rule, numbering or QR availability badge. Each card has a clear title, a live iframe preview or actual project icon, description and relevant actions. Internal columns stack on phones. Contego retains its coming-soon status and has no installation action.

QRCodeStyleGen previews `https://dgodolias.github.io/QRCodeStyleGen/`. About me features `https://dimosthenisgkontolias.com/`. Preview links open the actual sites in a new tab; the embedded UI does not intercept pointer/keyboard interaction. Direct links and loading/degraded copy remain available. Only restrained hover feedback is used, with reduced-motion support.

## Search and content

Each primary section has local search; the header opens global search with a button or Ctrl/Cmd+K. Global results cover released video pages including nested content, own tools, profile and the Contego policy. Search is client-side and ranked using title/keyword/content matches, Greek accent/final-sigma normalization, Greeklish, bounded typo tolerance and curated synonyms/task vocabulary. It has no paid service, search endpoint or generated answers. Local query parameters can still appear in normal hosting access logs on reload. Do not describe this as unrestricted AI understanding.

Search empty states support correction/reset; results link directly to the relevant resource, tool or policy. Inactive resources and scheduled resources before release are excluded, including their descendants. An empty local query preserves the existing newest-first video order. Query parameters retain local search on reload. Global native dialog supports keyboard navigation, Escape and focus restoration.

## Contego privacy

Permanent public URL: `https://demosvibes.gr/tools/contego/privacy/`. This route must prerender complete policy text and be accessible on a first visit without the site's email gate.

Policy source: `C:/Users/demosgod/Desktop/PROJECTS/General/contego/privacy-site/app/policy-body.ts`, current English version 1.2.3 dated 9 September 2026. Preserve the source article text exactly; do not republish the obsolete bilingual mockup or its prototype notice. A separate line identifies Netlify as this page's hosting provider. Future extension-policy edits should update the stored article snapshot deliberately.

## Evidence and release contract

Audience: Greek-speaking social-video viewers, primarily mobile (inferred), plus tool users and visitors viewing the portfolio. Principal risks: wrong destinations, hidden resources becoming discoverable early, broken responsive navigation/search, inaccessible policy content, or losing existing URLs. Read-only browsing is reversible; existing optional newsletter behavior remains unchanged for existing gated pages.

Verify TypeScript, static build and sitemap; existing email-gate tests; search relevance, Greeklish/typos, scope and release rules; navigation, full-width borderless tool layout, search keyboard focus, direct privacy first visits and existing resource access. Visually inspect real iframe rendering and desktop/mobile pages in a connected browser. Verify deployed commit and actual public page content after pushing main. Detailed release evidence belongs in COMPLETION_AUDIT.md.

M02 editorial/search applies. External iframes activate media/loading/fallback requirements, and the existing email gate activates persisted state. Commerce, collaboration, generated media, automated external actions and other specialized product modules are outside this redesign. Screen-reader behavior uses native semantic controls; no comprehensive assistive-technology certification is claimed.
