# Vercel and Neon deployment

Status recorded on **9 September 2026**: the Vercel backend is deployed and verified
against Neon; GitHub is linked, and both apex/www DNS were verified at **14:01 UTC**.
The final legacy export contains **94 unique consenting addresses**. Local checks
passed (37 tests, TypeScript and production build), including real emitted-Node-ESM
checks for both APIs. Live saves, duplicates, concurrent retries, rejected requests,
browser reload persistence and already-open legacy forms were verified.
Netlify builds and hosting are disabled as of **14:18:31 UTC**, after the old
**900-second DNS TTL** expired. Application revision `5656ab7` deployed successfully from `main`;
all 28 public pages and 52 referenced assets passed anonymous checks, and actual
custom-domain subscriptions were independently confirmed in Neon. The migration is
complete. See [MIGRATION_AUDIT.md](MIGRATION_AUDIT.md) for evidence.

**Follow-up metadata update completed, 9 September 2026:** the six-field API and schema are deployed, and the
backfill for all 94 archived subscriber events is complete. A repeated import changed
zero rows. Production revision `06d5d237449131d9c85c49799ec5ec4b4ded0d75` is ready in
deployment `dpl_5vcGs8fhgaNcGWzFwJLX4YY5FPVs`. Migration 003 ran after the compatible
API was ready; all 94 rows and their six retained fields were unchanged. The revised
six-field implementation passed **43 tests**, TypeScript and a production build with
**28 routes**. Live checks at **14:44:25–14:44:28 UTC** verified durable current and
legacy submissions, duplicate preservation, platform IP handling, optional headers
and exact test cleanup. All 94 real records retained all six fields unchanged.
See [SUBSCRIBER_METADATA_AUDIT.md](SUBSCRIBER_METADATA_AUDIT.md) for schema/import evidence.

## Project identity

| Item | Configured target |
| --- | --- |
| GitHub source | `dgodolias/demosvibes.gr` |
| Public domain | `demosvibes.gr` |
| Vercel scope | `dgodolias-projects`, the owner's personal Hobby scope (called “demos” by the owner) |
| Vercel project | `demosvibes` |
| Vercel function region | `fra1` |
| Neon project | `square-fog-37598870` |
| Neon location / plan | AWS Frankfurt / Free |
| Runtime database role | Restricted role `demosvibes_api` |
| Runtime secret | `DATABASE_URL`, configured for Vercel Production, server-only |

The workstation's default Vercel CLI authentication belongs to the unrelated
`imopsch` / `evs` account. **Every Vercel command must include both** the private
global configuration and the intended scope. From this checkout:

```powershell
vercel whoami --global-config "C:\Users\demosgod\.codex\private\demosvibes-migration\vercel" --scope dgodolias-projects
vercel link --project demosvibes --global-config "C:\Users\demosgod\.codex\private\demosvibes-migration\vercel" --scope dgodolias-projects
vercel env ls production --global-config "C:\Users\demosgod\.codex\private\demosvibes-migration\vercel" --scope dgodolias-projects
```

Check the reported identity/project before making deployment or environment changes.
The local `.vercel/` link is ignored by Git. Owner credentials and the CLI auth
configuration stay outside the repository; connection strings and tokens must not
appear in command arguments, committed files, screenshots or logs.

## Request and data flow

1. `npm run build` uses `vite-react-ssg` to produce static pages in `dist/` and generates
   the sitemap. Vercel serves these pages and applies canonical trailing slashes.
2. The optional email gate sends `POST /api/subscribe` as JSON:
   `{ "email": "…", "consent": true, "honeypot": "" }`.
3. `api/subscribe.ts` delegates to `server/subscribe.ts`. The handler validates method,
   exact allowed origin, JSON content type, body size, email, consent and honeypot.
   For a validated consenting submission, IP comes from platform-supplied request metadata;
   user-agent and referrer come from request headers. These fields are not accepted
   from the browser's JSON payload.
4. `server/subscribers.ts` writes through Neon using the server's restricted
   `DATABASE_URL`. An email is trimmed/lowercased, inserted once, and verified before
   success is returned. A duplicate returns the same success response after verifying
   the existing consenting row; its original timestamp and submission
   metadata are retained.
5. The client accepts only a successful JSON `{ "ok": true }` acknowledgement. A
   failed request leaves the email available for retry and offers explicit continuation
   without another submission. An empty email makes no API request.

The live `public.subscribers` table was verified to contain exactly these six fields:

| Column | Meaning |
| --- | --- |
| `email` | Normalized address; primary key prevents duplicates |
| `consent` | Must be `true` |
| `created_at` | Stored timestamp; legacy imports retain their recorded date |
| `ip` | Optional PostgreSQL `inet`; IP supplied by the hosting platform for the submission |
| `user_agent` | Optional browser information from the User-Agent header; text limited to 2,048 characters |
| `referrer` | Optional provided HTTP(S) Referer URL; text limited to 4,096 characters; query parameters may remain, credential-bearing URLs are omitted and fragments removed |

Subscriber metadata is recorded only after a valid consenting submission. Ordinary
page visits, empty-email entry, and rejected/nonconsenting requests do not create
these subscriber records. The metadata capture adds no cookies, analytics service or
device fingerprinting. Missing or invalid metadata remains absent; user-agent and
referrer are client-provided headers and are not verified identity information.

The `referrer` preserves the actual valid HTTP(S) URL supplied by the browser and can
include its query. URLs containing user information are omitted; fragments are removed
from accepted URLs. Invalid or unsupported URLs are omitted. The browser may omit or shorten its referrer.
Duplicate submissions leave the initially saved IP, user-agent and referrer unchanged.

Error logging uses generic identifiers, excluding email values, request metadata and
database connection details. This describes the subscription application, separately
from providers' hosting logs.

The browser stores only the accepted-entry preference `dv_gate_accepted_v1`, not the
email. It is kept after confirmed saving, explicit skipping or empty-email entry.
Returning visits in the same browser and domain keep this preference. A different
browser/device or cleared site storage can show the gate again; database deduplication
still applies. Changing hosting providers does not itself transfer a preference to a
different hostname.

This project stores subscriptions. It does not provision a newsletter-sending service.
The public policy explains how to request access or deletion by contacting the owner.

### Compatibility for pages opened before migration

Old Netlify pages submit URL-encoded `email-gate` data to `POST /`. Keep the
method-specific root route and `api/legacy-subscribe.ts` so an already open tab can
still save after DNS switches to Vercel. The adapter requires the exact old form name,
explicit `consent=yes`, an empty honeypot, an approved origin and a bounded request body,
then uses the same validated subscriber handler and Neon deduplication as the new gate.
It returns success only after confirmed persistence. Ordinary GET requests keep serving
the prerendered homepage. See Vercel's [method-specific routes documentation](https://vercel.com/docs/project-configuration/vercel-json#routes).

## Environment and database maintenance

The production API already has a `DATABASE_URL` for the restricted `demosvibes_api`
role. It must remain server-only: no `VITE_` prefix, browser bundle, public config file
or client database connection. `.env.example` documents the variable name only.

Schema: [`001_subscribers.sql`](../db/migrations/001_subscribers.sql),
[`002_subscriber_metadata.sql`](../db/migrations/002_subscriber_metadata.sql), and
[`003_remove_subscriber_source.sql`](../db/migrations/003_remove_subscriber_source.sql).
All three migrations are applied. Migration 003 ran after the revised API was ready
and removed the two obsolete columns without adding replacements. For future
restoration, preserve that deployment-before-removal order. Runtime INSERT access includes the three metadata
columns; runtime UPDATE and DELETE remain unavailable. Schema changes, imports, exports and deletion
requests use authorized maintenance access; runtime API credentials are separate from
owner credentials. Keep owner connection strings in the owner's private environment,
outside the checkout. Review role privileges when changing the persistence queries.

Migration [`004_disclaimer_acceptances.sql`](../db/migrations/004_disclaimer_acceptances.sql)
is additive: it creates `public.disclaimer_acceptances` for `/api/disclaimer` and leaves
`public.subscribers` untouched. Each row is one acceptance of a protected guide's
disclaimer: `id` (uuid, returned to the browser), `disclaimer`, `version`, `accepted`
(always `true`), `accepted_at`, and optional `ip`, `user_agent` and `referrer` captured
with the subscriber-metadata rules. The migration grants `demosvibes_api` INSERT on the
written columns and SELECT on `id`, `disclaimer` and `version` only (for `RETURNING id`
and confirming a stored acceptance); runtime UPDATE, DELETE and metadata reads remain
unavailable. Apply it with owner access before deploying code that calls the endpoint.

Development and Preview environments require their own deliberately configured
database connection. A Production variable does not imply that previews have one.
Use an isolated development database/branch when testing writes outside Production.

For local API work, `SUBSCRIBE_LOCAL_ORIGINS` can list exact loopback origins, such as
`http://localhost:3000`, in a non-production environment. Production permits the real
site origins, the owned stable alias `https://demosvibes.vercel.app`, and the deployment
hosts supplied by Vercel's environment variables.
Arbitrary `vercel.app` origins and untrusted request Host headers are not allowed.

## Legacy import

The initial consenting export was imported as **97 input rows, 93 unique email
addresses, 4 duplicate rows**. The final cutover export contained **99 input rows,
94 unique addresses, 5 duplicate rows**; its delta import added **1 new unique
address**. Preserve both exports privately. Subsequent website subscriptions can
increase the database total beyond these import counts.

The archived-metadata backfill is complete: **99 input rows / 94 unique addresses**,
**0 inserted / 94 updated / 94 metadata verified**, with **0 conflicts** and **0 events
skipped for a timestamp mismatch**. Repeating the import produced **0 inserted / 0
updated / 94 verified**, with all 94 metadata records still present.

After migration 003, the revised importer was run again against the final six-column
table: **99 input rows / 94 unique addresses / 0 inserted / 0 updated / 94 verified /
94 metadata verified**, with **0 conflicts** and **0 different-event skips**.

An independent comparison confirmed **94 rows before / 94 after**, with email, consent
and original date unchanged for every row. All 94 first-event
dates, consent values, IPs, user-agents and referrers exactly match the selected
archived events; all three metadata fields are populated on all 94 rows.

For maintenance, match each normalized email to its original archived submission using
the retained first-submission `created_at` timestamp. Import that submission's IP,
user-agent and referrer together; preserve the original timestamp.
The importer fills only missing metadata on the same historical event, retaining
existing values and reporting conflicts or different events. Keep row-level evidence
private. Aggregate results are recorded in the subscriber metadata audit.

[`scripts/import-subscribers.mjs`](../scripts/import-subscribers.mjs) is a maintenance
tool. Its input is a JSON array on stdin, converted from the private export:

```json
[
  {
    "email": "person@example.com",
    "consent": true,
    "created_at": "2026-09-09T10:00:00Z",
    "ip": "192.0.2.10",
    "user_agent": "Example browser",
    "referrer": "https://demosvibes.gr/?campaign=example"
  }
]
```

Provide the owner database connection through the process environment as
`DATABASE_URL`; the script does not accept it on the command line. With that private
environment already prepared, the invocation is:

```powershell
Get-Content -Raw -LiteralPath 'C:\path\outside-the-repository\subscribers.json' | node scripts/import-subscribers.mjs
```

The script validates rows, normalizes addresses and selects one complete earliest
event per address. Equal timestamps retain the first complete row in the supplied
export. It inserts with `ON CONFLICT DO NOTHING`, then fills missing metadata only
where the existing row has the same timestamp. These operations and
verification run in a transaction. Existing populated metadata is preserved; reported
conflicts or skipped events need review. It prints aggregate counts only. Repeated
runs are idempotent. Imports are separate from normal deployments; subscriber data
never belongs in the build output.

## Build, test and deploy

Node.js **22** is specified in `package.json`. [`vercel.json`](../vercel.json) configures
`npm ci`, `npm run build`, output `dist`, trailing slashes, Frankfurt functions and a
15-second function duration limit.

```powershell
npm ci
npm run typecheck
npm run build
npm run test:e2e
```

The Playwright suite includes API contract tests and browser flows for successful
saving, retry, explicit skip, repeated email acknowledgement and browser persistence.
Browser subscription requests are mocked; a passing local suite does not prove a live
Vercel function can write to Neon. Vite dev/preview does not serve the API.

**Node ESM imports:** relative imports in `api/` and `server/` must include the emitted
`.js` extension, for example `../server/subscribe.js` inside `api/subscribe.ts`.
Extensionless paths pass the frontend's bundler-resolution typecheck but fail at
Vercel runtime with `ERR_MODULE_NOT_FOUND`. After changing backend imports, compile
the API/server files as `NodeNext`, load the emitted API module in Node, and exercise
its handler before deployment. The migration's emitted-module smoke check returned
the expected GET 405 without database access.

Tests start a dedicated preview server. Set `PREVIEW_PORT` if its default 4173 is busy.
Use canonical nested paths (`/tools/`, `/about/`, `/privacy/`) for static hydration checks;
Vite preview can return home HTML for extensionless paths without a trailing slash.

After the intended project is linked, the production CLI invocation is:

```powershell
vercel deploy --prod --global-config "C:\Users\demosgod\.codex\private\demosvibes-migration\vercel" --scope dgodolias-projects
```

The Git integration is linked to `dgodolias/demosvibes.gr`. Confirm the intended
production branch when changing project settings. Record the final deployed commit
and deployment URL; migration CLI deployments preceded the final source commit.
Build success alone is not DNS-cutover evidence.

## Completed cutover verification

- [x] Ready Vercel backend writes using the restricted runtime role. Independent live
  checks confirmed committed inserts, duplicate metadata preservation, six concurrent
  retries producing one row, expected error responses and exact synthetic-row cleanup.
- [x] Real browser submission and reload persistence were verified, with independent
  database confirmation before deleting that exact synthetic row.
- [x] Final legacy delta was imported: 99 export rows, 94 unique consenting addresses.
- [x] Vercel verified apex/www DNS at 14:01 UTC: apex A records `216.198.79.1` and
  `64.29.17.1`; www CNAME `fc0a6dc095e1bb26.vercel-dns-017.com`. www redirects to apex
  with HTTP 308. Netlify builds are stopped.
- [x] Migration commit `041242dbabe6e1488eb01faa7ec0cba110550a9c` produced ready production
  deployment `dpl_FTPZjSGMam8NLRhYfRRCVGfqdoP1` automatically from GitHub `main`.
- [x] Anonymous HTTPS checks passed on all 28 public pages and 52 assets, with both
  policies ungated. Actual matching-origin subscriptions on the custom domain and
  stable alias persisted one shared row, with duplicate preservation and exact cleanup.
- [x] After the previous 900-second DNS TTL expired, Google, Cloudflare and local DNS
  all resolved to Vercel. Netlify disable returned 204 at 14:18:31 UTC; readback confirmed
  `disabled=true` and `stop_builds=true`. Vercel homepage/privacy remained HTTPS 200 and
  the API returned the expected GET 405 after shutdown.
- [x] Final export/import confirmed 99 legacy submissions and 94 unique consenting
  emails, with zero further inserts. Private exports are preserved outside Git.
- [x] Migration evidence is recorded in [MIGRATION_AUDIT.md](MIGRATION_AUDIT.md).

The disabled Netlify project's site-level forms listing returns 404. Its direct
form-submissions API was verified readable after shutdown, with all 99 archived
submissions intact. Prefer Neon and the private exported backup for subscriber
maintenance. Re-enabling Netlify is a separate rollback action; normal publishing
continues through Vercel.

## Completed metadata verification

The ready six-field application and migration 003 were checked together on
**9 September 2026, 14:44:25–14:44:28 UTC**:

- Modern JSON and legacy four-field form submissions returned durable `{ "ok": true }`
  responses, independently confirmed in Neon.
- Valid platform-derived IP was saved; spoofed forwarded headers and metadata supplied
  in JSON were ignored. User-agent matched the submitted header. Referrer query
  parameters were retained and its fragment removed.
- Email case/spacing variations and duplicates across both APIs preserved the initial
  timestamp and all metadata. Missing or invalid optional headers remained null;
  user-agent truncation behaved as expected.
- Exactly four generated test records were deleted, with zero remaining. All **94**
  real records and all six retained fields were unchanged.

Detailed aggregate evidence is in
[SUBSCRIBER_METADATA_AUDIT.md](SUBSCRIBER_METADATA_AUDIT.md); row-level evidence and
private QA artifacts remain outside the repository.

The historical [redesign audit](COMPLETION_AUDIT.md) and
[design brief](FRONTEND_DESIGN_BRIEF.md) retain their original Netlify-era statements.
For current hosting, storage and maintenance, use this document. The Contego canonical
article in `src/data/contegoPrivacy.ts` stays byte-for-byte intact; only its separate
hosting note identifies Vercel.
