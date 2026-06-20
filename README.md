# demosvibes.gr

Greek hub of AI prompts, step-by-step guides and curated tool lists that accompany
short-form videos. **React + TypeScript + Tailwind**, prerendered to static HTML with
[`vite-react-ssg`](https://github.com/Daydreamer-riri/vite-react-ssg), hosted on Netlify.

**Live:** https://demosvibes.gr

## Commands

```bash
npm install
npm run dev        # local dev server (Vite)
npm run build      # prerender all pages to dist/ + generate sitemap.xml
npm run preview    # serve the built dist/ locally
npm run typecheck  # tsc --noEmit
npm run test:e2e   # Playwright gate tests (builds-aware: runs against preview)
```

## How it works

Every page is **data-driven**. The single source of truth is
[`src/data/resources.ts`](src/data/resources.ts): an array of typed `Resource` objects.
Routes, the landing grid, search/filter, the sitemap and per-page JSON-LD are all derived
from it.

### Add a new video page

1. Append one `Resource` object to `src/data/resources.ts` (copy an existing one).
   - `card` → the landing-grid card (omit for nested child pages).
   - `blocks` → ordered content: `prompt` (Copy button), `steps` (Οδηγίες), `prose`
     (e.g. Πηγή), `cardLinks`, or `html` (escape hatch for bespoke "guide" layouts,
     styled by the shared classes in `src/index.css`).
   - `seoTitle` / `seoDescription` / `date` → SEO + sitemap.
2. (optional) Add a 1200×630 OG image: `node scripts/gen-og.mjs` (needs `npx playwright
   install chromium`), or drop a JPG at `public/og/<slug>.jpg`.
3. `npm run build` → the new page is prerendered with its own route, meta and JSON-LD.

That's it — no new HTML boilerplate, no manual route wiring.

## Structure

```
src/
  data/        resources.ts (source of truth), types.ts, site.ts
  components/   ResourceCard, FeaturedResource, SearchFilter, PromptCard, Steps,
                CardLinks, BlockRenderer, Crumb, Seo, Topbar, footers, icons
  pages/        HomePage, ResourcePage (generic), PrivacyPage, NotFound
  gate/         GateContext (localStorage), EmailGate, netlifyForms (Netlify POST)
  lib/          filter.ts (el-GR search), seo.ts (JSON-LD)
  routes.tsx    flat routes generated from resources
  index.css     ported "Stitch" theme + guide classes (Tailwind tokens in tailwind.config.ts)
public/         assets/, thumbs/, og/, __forms.html, robots.txt, llms.txt
scripts/        gen-seo.mjs (sitemap), gen-og.mjs (OG images), shots.mjs (screenshots)
```

## Email gate

A first-visit interstitial ([`src/gate/`](src/gate/)) captures emails via **Netlify Forms**.
Acceptance is cached in `localStorage` (`dv_gate_accepted_v1`) so returning visitors aren't
re-asked. The "Μπαίνω στο site" button always lets the user in (capture is best-effort); a
valid email is POSTed to Netlify with implicit consent. Netlify detects the form via the
static stub [`public/__forms.html`](public/__forms.html); submissions land in
**Netlify → Forms → email-gate** (free plan: 100/month).

## Deploy

Push to `main` → Netlify builds (`npm run build`, publish `dist`) per
[`netlify.toml`](netlify.toml). Netlify Forms only work on Netlify hosting.
