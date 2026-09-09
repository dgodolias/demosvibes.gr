# Vercel and Neon migration evidence

Recorded on **9 September 2026**. Vercel serves the new deployment, the subscription
backend writes to Neon, and apex/www DNS was verified at **14:01 UTC**. The GitHub
repository is linked to Vercel. Migration commit `041242dbabe6e1488eb01faa7ec0cba110550a9c`
on `main` automatically produced ready production deployment
`dpl_FTPZjSGMam8NLRhYfRRCVGfqdoP1` (`demosvibes-pvc0qqlfi-dgodolias-projects.vercel.app`),
in the intended project and `fra1` function region. Netlify hosting was disabled
reversibly at **14:18:31 UTC**, after DNS propagation checks and the previous TTL elapsed.

The final application revision is `5656ab7481e99807df1d915755ee3e3fc1634f95`, including
compatibility for already-open Netlify pages. Its automatically triggered production
deployment `dpl_9eCrNaezrDMcv4HHpzuk9rZ2hH9a`
(`demosvibes-pei0qz5d2-dgodolias-projects.vercel.app`) is READY and owns the public aliases.
All **37 tests** passed after this addition; the emitted legacy API also loaded under
real Node ESM and returned the expected GET 405.

## Verified behavior

| Requirement | Evidence |
| --- | --- |
| Local application checks | Production build, TypeScript and all 37 local tests passed, including both modern and legacy subscription APIs. |
| Real Node module loading | API/server sources compiled with TypeScript `NodeNext`; emitted `api/subscribe.js` imported successfully in Node ESM, and its `default.fetch` returned GET 405 without contacting the database. |
| Live function and database | Fixed production deployment `dpl_EvKhtnbsZTRoUvkn413SGuSdE3ur` was ready. Anonymous requests to `https://demosvibes.vercel.app/api/subscribe` with approved origin `https://demosvibes.gr` passed the checks below at 14:01:24–14:01:27 UTC. |
| Durable save | A unique synthetic `example.test` address returned JSON `{ "ok": true }`; independent owner-side inspection confirmed one consenting row, source `website`, and only the page pathname stored. |
| Duplicate protection | An uppercase/space-padded retry returned the same success and preserved the original timestamp, consent and source metadata. Six concurrent requests for a second synthetic address all returned 200 and created exactly one normalized-email row. |
| Request rejection | Foreign/missing origin: 403; unsupported content type: 415; invalid consent, honeypot, email or JSON: 400; oversized body: 413; GET: 405 with `Allow: POST`. Rejected requests created no row. |
| Browser persistence | A real browser submission closed the gate; reloading kept it closed. Independent inspection confirmed its single consenting database row with source `website` and source path `/`. |
| Test-data cleanup | After browser reload confirmation, its exact synthetic row was deleted. The two independently generated API test rows were also deleted by exact address. Follow-up queries confirmed zero matching test rows. No real subscriber rows were deleted. |
| Public domain and stable alias | At 14:05:15–14:05:17 UTC, matching-origin POSTs on `demosvibes.gr` and `demosvibes.vercel.app` both returned confirmed JSON success for one synthetic address. Independent inspection confirmed one row and unchanged original metadata. The exact test row was deleted and its absence verified. |
| Published pages and assets | Anonymous audits of the apex and stable alias verified all 28 sitemap routes against local titles, canonical URLs, H1 headings and JSON-LD, plus all 52 referenced assets. Contego article text matches the source and its hosting note says Vercel. The old form stub returns 404. |
| Browser preference across migration | The existing accepted-entry preference on `demosvibes.gr` remained effective after the provider change. Tools navigation and the actual QRCodeStyleGen iframe were verified in the browser. |
| Credential isolation | Independent review verified restricted runtime privileges, hidden Vercel Production secret, and ignored private configuration. Scans of Git candidates, build files and public HTML/JS/CSS found no credential patterns. |
| Already-open legacy forms | At 14:15:31–14:15:34 UTC, the exact old URL-encoded `POST /` returned confirmed success and saved one consenting row. An uppercase legacy retry and a retry through the new JSON API preserved that single row and original metadata. Invalid legacy consent returned 400. The exact synthetic row was deleted and absence verified. |
| GET routing after compatibility change | All 28 public sitemap routes were rechecked after adding the method-specific root POST rule; each returned 200 with the expected title and page heading. |

The live API uses the restricted `demosvibes_api` role. During these live tests,
owner access was used only for independent verification and exact synthetic-row cleanup. Tests used no real
subscriber addresses. Credentials, exports and raw private logs remain outside the
repository.

The immutable deployment hostname is protected by Vercel authentication; the public
stable alias was used for anonymous API verification. This distinction does not
imply that the public custom domain requires a Vercel account.

## Imported subscribers

- Initial export: **97 rows → 93 unique consenting addresses**, with 4 duplicate rows.
- Final cutover export: **99 rows → 94 unique consenting addresses**, with 5 duplicate
  rows. The delta import added **1 new unique address**.
- Imports normalize email addresses, preserve the earliest source timestamp, label
  imported rows `netlify-import`, and leave existing rows unchanged on conflict.

These are aggregate import counts, not a claim that the total database count remains
fixed after new website subscriptions arrive.

## DNS and hosting state

Vercel verified both apex and www at **14:01 UTC**. The applied recommended records
were:

| Host | Type | Value |
| --- | --- | --- |
| `demosvibes.gr` | A | `216.198.79.1` |
| `demosvibes.gr` | A | `64.29.17.1` |
| `www.demosvibes.gr` | CNAME | `fc0a6dc095e1bb26.vercel-dns-017.com` |

www redirects to the apex with HTTP **308**. Netlify hosting was kept active through
the previous **900-second DNS TTL**. At 14:16:59 UTC, Google, Cloudflare and the local
resolver all returned Vercel targets. The final export/import at 14:17:39 UTC confirmed
99 source submissions, 94 unique consenting addresses and zero additional inserts.

The reversible Netlify disable returned HTTP 204 at **14:18:31 UTC**; readback confirmed
`disabled=true` and `stop_builds=true`. The project and form were not deleted. At
14:19:20 UTC, public homepage/privacy requests still returned Vercel HTTPS 200 and the
API returned the expected GET 405. Private exports remain available outside Git.
At 14:20:16 UTC, the direct archived form-submissions endpoint still returned 200 and
all 99 submissions matched the final export (94 unique consenting addresses). Netlify's
site-level forms listing returns 404 while disabled; direct submission access is retained.

During propagation, direct HTTPS requests for `demosvibes.gr` forced to the old
Netlify IP and the new Vercel IP both returned 200 at 14:09:35 UTC. This verifies the
overlap: clients retaining the old DNS answer still had a working site.

## Maintenance and final reconciliation

API/server relative imports must name their emitted **`.js`** files, even in
TypeScript source. Vite's bundler-oriented typecheck alone does not prove that Node
can resolve a deployed function's imports. Keep the real emitted-ESM smoke check when
changing these files.

The exact owned stable origin `https://demosvibes.vercel.app` is explicitly allowed,
alongside apex/www and configured Vercel deployment hosts. No wildcard `vercel.app`
origin is trusted. A regression check covers the stable alias when Vercel's production
hostname variable points to the custom domain.

Completion checklist:

- [x] Record the final committed migration revision and matching ready production deployment.
- [x] Record final anonymous checks on the custom domain, including both public policies and subscription behavior.
- [x] After the previous DNS TTL elapsed and routing was verified, disable Netlify hosting and record the time.

See [DEPLOYMENT.md](DEPLOYMENT.md) for configuration and maintenance commands.
