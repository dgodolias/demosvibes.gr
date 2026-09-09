# demosvibes.gr

Greek creator hub with Videos (supplementary prompts and guides), Tools (own projects)
and About me (portfolio). **React + TypeScript + Tailwind**, prerendered to static HTML with
[`vite-react-ssg`](https://github.com/Daydreamer-riri/vite-react-ssg). Hosted on **Vercel**
with subscriber storage in **Neon PostgreSQL**.

**Live:** https://demosvibes.gr

**Migration completed, 9 September 2026:** Vercel serves the public domain, existing
subscribers are imported, and Netlify hosting is disabled. Both current and already-open
legacy forms save to Neon. All 37 tests and public route checks passed. See the
[deployment runbook](docs/DEPLOYMENT.md) and [migration evidence](docs/MIGRATION_AUDIT.md).

**Submission metadata update:** the metadata columns and historical backfill are complete.
All 94 archived subscriber events have verified metadata; the repeated import changed
zero rows. The target table contains only `email`, `consent`, `created_at`, `ip`,
`user_agent` and `referrer`. The revised six-field implementation passed **43 tests**
and built **28 routes**. Deployment of the revised six-field API,
removal of the two superseded database columns, and live verification remain pending.
See [subscriber metadata evidence](docs/SUBSCRIBER_METADATA_AUDIT.md).

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
db/migrations/  subscriber schema and metadata migrations
public/         assets/, thumbs/, og/, robots.txt, llms.txt
scripts/        SEO/images/screenshots, import-subscribers.mjs (private input on stdin)
vercel.json     static build, canonical trailing slashes and API runtime configuration
```

## Email gate

A first-visit interstitial ([`src/gate/`](src/gate/)) accepts an optional email.
An empty submission enters immediately without an API request. A nonempty submission
sends JSON to `POST /api/subscribe` with email, consent and the actual honeypot value.
The gate remembers entry only after the API confirms a saved or already
existing subscription with `{ "ok": true }`, or after the visitor explicitly skips.

Failures retain the email and show retry/continue controls. A successful save stores
the existing `dv_gate_accepted_v1` preference in `localStorage`, so the same browser is
not asked again on reload. Existing accepted-browser preferences survive the hosting
migration when the visitor continues using the same domain. Clearing browser storage
or using another browser/device can show the gate again.

The API normalizes emails and uses the database's email primary key to prevent
duplicates. Existing subscribers keep their original timestamp and
submission metadata. The server obtains IP from platform request metadata and
user-agent/referrer from request headers, rather than taking these fields from the
browser's JSON payload. They can be absent; user-agent and referrer are supplied by
the client and do not establish identity.

These fields are captured only with a consenting submission. Visiting a page or
entering with an empty email does not create a subscriber metadata record. No new
cookies, analytics or device fingerprinting are added. The `referrer` can retain query parameters from a valid
HTTP(S) URL; URLs containing credentials or invalid URLs are omitted, and fragments
are removed from accepted URLs.

The initial legacy import contained **97 rows / 93 unique emails / 4 duplicate rows**;
the final Netlify export contained **99 rows / 94 unique emails / 5 duplicate rows**.
All 94 consenting addresses were verified in Neon. This migration provides subscription
storage; newsletter delivery is a separate operation.

## Deploy

Source: [`dgodolias/demosvibes.gr`](https://github.com/dgodolias/demosvibes.gr).
Target: Vercel project **demosvibes** in personal Hobby scope **dgodolias-projects**,
with a server-only Neon `DATABASE_URL`. Build/output settings live in
[`vercel.json`](vercel.json).

Use the [deployment runbook](docs/DEPLOYMENT.md). The workstation's default Vercel
authentication belongs to an unrelated account; every Vercel command must explicitly
select the migration's private global configuration and correct scope.
