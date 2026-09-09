# Vercel and Neon migration evidence

Recorded on **9 September 2026**. Vercel serves the new deployment, the subscription
backend writes to Neon, and apex/www DNS was verified at **14:01 UTC**. The GitHub
repository is linked to Vercel. Final deployed-commit reconciliation and disabling
the previous Netlify hosting remain pending; this report does not close those steps.

## Verified behavior

| Requirement | Evidence |
| --- | --- |
| Local application checks | Production build, TypeScript and all 34 local tests passed. After the API import fix, TypeScript and all 8 focused API tests passed again. |
| Real Node module loading | API/server sources compiled with TypeScript `NodeNext`; emitted `api/subscribe.js` imported successfully in Node ESM, and its `default.fetch` returned GET 405 without contacting the database. |
| Live function and database | Fixed production deployment `dpl_EvKhtnbsZTRoUvkn413SGuSdE3ur` was ready. Anonymous requests to `https://demosvibes.vercel.app/api/subscribe` with approved origin `https://demosvibes.gr` passed the checks below at 14:01:24–14:01:27 UTC. |
| Durable save | A unique synthetic `example.test` address returned JSON `{ "ok": true }`; independent owner-side inspection confirmed one consenting row, source `website`, and only the page pathname stored. |
| Duplicate protection | An uppercase/space-padded retry returned the same success and preserved the original timestamp, consent and source metadata. Six concurrent requests for a second synthetic address all returned 200 and created exactly one normalized-email row. |
| Request rejection | Foreign/missing origin: 403; unsupported content type: 415; invalid consent, honeypot, email or JSON: 400; oversized body: 413; GET: 405 with `Allow: POST`. Rejected requests created no row. |
| Browser persistence | A real browser submission closed the gate; reloading kept it closed. Independent inspection confirmed its single consenting database row with source `website` and source path `/`. |
| Test-data cleanup | After browser reload confirmation, its exact synthetic row was deleted. The two independently generated API test rows were also deleted by exact address. Follow-up queries confirmed zero matching test rows. No real subscriber rows were deleted. |

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

www redirects to the apex with HTTP **308**. Netlify builds are stopped. Its hosting
remains **enabled while the previous 900-second DNS TTL expires**, retaining the old
deployment during propagation.

## Maintenance and final reconciliation

API/server relative imports must name their emitted **`.js`** files, even in
TypeScript source. Vite's bundler-oriented typecheck alone does not prove that Node
can resolve a deployed function's imports. Keep the real emitted-ESM smoke check when
changing these files.

The exact owned stable origin `https://demosvibes.vercel.app` is explicitly allowed,
alongside apex/www and configured Vercel deployment hosts. No wildcard `vercel.app`
origin is trusted. A regression check covers the stable alias when Vercel's production
hostname variable points to the custom domain.

Root operator to complete:

- [ ] Record the final committed migration revision and matching ready production deployment.
- [ ] Record final anonymous checks on the custom domain, including both public policies and subscription behavior.
- [ ] After the previous DNS TTL has elapsed and routing is verified, disable Netlify hosting and record the time.

See [DEPLOYMENT.md](DEPLOYMENT.md) for configuration and maintenance commands.
