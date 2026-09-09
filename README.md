# demosvibes.gr

Greek creator hub with Videos (supplementary prompts and guides), Tools (own projects)
and About me (portfolio). **React + TypeScript + Tailwind**, prerendered to static HTML with
[`vite-react-ssg`](https://github.com/Daydreamer-riri/vite-react-ssg). The current migration
moves hosting to **Vercel** and subscriber storage to **Neon PostgreSQL**.

**Live:** https://demosvibes.gr

**Migration status, 9 September 2026:** infrastructure and the initial subscriber import
are prepared; production deployment and DNS cutover are in progress. See the
[deployment runbook](docs/DEPLOYMENT.md) for the correct account, configuration and remaining verification.

## Commands

```bash
npm ci
npm run dev        # local dev server (Vite)
npm run build      # prerender all pages to dist/ + generate sitemap.xml
npm run preview    # serve the built dist/ locally
npm run typecheck  # tsc --noEmit
npm run test:e2e   # search, navigation, accessibility, privacy and email-gate checks
```

Use Node.js 22. Vite development/preview serves the frontend; it does not run the
subscription API. The local browser tests intercept subscription requests, while
the API tests exercise validation and persistence contracts independently.

## How it works

The homepage `/` is Videos; `/tools/` and `/about/` share persistent navigation
and global search. Each section has its own local search. Ctrl/Cmd+K opens global
search, with Greeklish, accents, bounded typo matching and curated task synonyms.
The index uses published content and respects inactive/scheduled cards and parents.
Search runs in the browser; no remote search service or model is involved.

The policies at `/privacy/` and `/tools/contego/privacy/` bypass the email gate.
The latter is Contego's public extension policy.
Its reviewed article snapshot lives in `src/data/contegoPrivacy.ts`; update it from
`General/contego/privacy-site/app/policy-body.ts` when the extension policy changes.
Keep the full canonical article, current version and publisher/support details.

Approved layout and delivery requirements: [design brief](docs/FRONTEND_DESIGN_BRIEF.md).
That brief and the [redesign audit](docs/COMPLETION_AUDIT.md) remain historical records;
current hosting and subscriber operations are documented in the deployment runbook.
Set `PREVIEW_PORT` when the default test port 4173 is occupied. Tests start their own
preview server to ensure they verify this checkout's built `dist/`.

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
  data/         resources, site identity, search documents, Contego policy snapshot
  components/   shared navigation, resource cards, local/global search, previews
  pages/        Videos, Tools, About, resources and public privacy policies
  gate/         GateContext (localStorage), EmailGate, subscribe (JSON API client)
  lib/          ranked search, release rules, search state and SEO helpers
  routes.tsx    flat routes generated from resources
api/            subscribe.ts (Vercel Node function)
server/         subscription validation, allowed origins and Neon persistence
db/migrations/  001_subscribers.sql
public/         assets/, thumbs/, og/, robots.txt, llms.txt
scripts/        SEO/images/screenshots, import-subscribers.mjs (private input on stdin)
vercel.json     static build, canonical trailing slashes and API runtime configuration
```

## Email gate

A first-visit interstitial ([`src/gate/`](src/gate/)) accepts an optional email.
An empty submission enters immediately without an API request. A nonempty submission
sends JSON to `POST /api/subscribe` with email, consent, the actual honeypot value and
the page path. The gate remembers entry only after the API confirms a saved or already
existing subscription with `{ "ok": true }`, or after the visitor explicitly skips.

Failures retain the email and show retry/continue controls. A successful save stores
the existing `dv_gate_accepted_v1` preference in `localStorage`, so the same browser is
not asked again on reload. Existing accepted-browser preferences survive the hosting
migration when the visitor continues using the same domain. Clearing browser storage
or using another browser/device can show the gate again.

The API normalizes emails and uses the database's email primary key to prevent
duplicates. Existing subscribers keep their original timestamp and provenance.
The initial legacy import contained **97 rows / 93 unique emails / 4 duplicate rows**;
the 93 unique consenting subscribers are already imported. This migration provides
subscription storage; newsletter delivery is a separate operation.

## Deploy

Source: [`dgodolias/demosvibes.gr`](https://github.com/dgodolias/demosvibes.gr).
Target: Vercel project **demosvibes** in personal Hobby scope **dgodolias-projects**,
with a server-only Neon `DATABASE_URL`. Build/output settings live in
[`vercel.json`](vercel.json).

Use the [deployment runbook](docs/DEPLOYMENT.md). The workstation's default Vercel
authentication belongs to an unrelated account; every Vercel command must explicitly
select the migration's private global configuration and correct scope.
