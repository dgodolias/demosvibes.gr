# Subscriber metadata evidence — 9 September 2026

**Complete:** the six-field API and schema are deployed, the historical metadata
backfill is verified, and new live submission checks passed on
**9 September 2026, 14:44:25–14:44:28 UTC**.
This is a follow-up to the completed hosting/email migration; its historical
[MIGRATION_AUDIT.md](MIGRATION_AUDIT.md) is unchanged.

## Live deployment, schema and access

Production revision `06d5d237449131d9c85c49799ec5ec4b4ded0d75` is ready in Vercel
deployment `dpl_5vcGs8fhgaNcGWzFwJLX4YY5FPVs`, in the intended project/workspace.

The live `public.subscribers` table was verified to contain exactly these six fields:

| Column | Verified type / constraint |
| --- | --- |
| `email` | Normalized text address; primary key |
| `consent` | Boolean, must be true |
| `created_at` | Timestamp with time zone; original submission date retained |
| `ip` | PostgreSQL `inet`, individual host address |
| `user_agent` | `text`, at most 2,048 characters |
| `referrer` | `text`, at most 4,096 characters |

The three nullable metadata columns were added live by
[`002_subscriber_metadata.sql`](../db/migrations/002_subscriber_metadata.sql).
[`003_remove_subscriber_source.sql`](../db/migrations/003_remove_subscriber_source.sql)
ran only after the compatible API was ready and removed the superseded columns.
No replacement columns were added. An independent before/after comparison confirmed
**94 rows before / 94 after**, with every value of all six retained fields unchanged.

The runtime role `demosvibes_api` has INSERT access for all three new columns.
Runtime UPDATE and DELETE privileges remain **false**. Historical backfill used
separate owner maintenance access; no owner credentials were added to application code.

## Historical import and repeat verification

The private archive contains **99 submissions / 94 normalized unique email addresses**.
The importer selects the complete earliest event for each address and matches its
`created_at` to the existing historical row before filling missing metadata. It retains
the original timestamp and any already-populated metadata.

| Result | First backfill | Repeated import |
| --- | ---: | ---: |
| Input rows | 99 | 99 |
| Unique addresses | 94 | 94 |
| Inserted rows | 0 | 0 |
| Updated rows | 94 | 0 |
| Verified subscriber rows | 94 | 94 |
| Verified metadata records | 94 | 94 |

After migration 003, the revised importer ran against the six-column table with
**99 input rows / 94 unique addresses / 0 inserted / 0 updated / 94 verified /
94 metadata verified / 0 conflicts / 0 different-event skips**.

The first run reported **0 metadata conflicts** and **0 records skipped for a different
event timestamp**. The repeat changed no rows, and all **94** metadata records remained
verified. The archive and row-level comparison data stay private; this audit records
aggregate evidence only.

An independent full comparison confirmed **94 rows before and 94 rows after**.
Every row retained its original email, consent and timestamp. For **94/94** addresses, the selected earliest archived event's
date, consent, IP, user-agent and referrer exactly match the stored values. All three
metadata fields are populated on all **94** rows.

## Application validation

- The revised six-field implementation passed **43 local tests**, including **17
  focused backend checks**, TypeScript and
  a production build producing **28 prerendered routes**. Both API modules also
  passed real Node ESM import and GET-handler checks after NodeNext compilation.
- The final knowledge graph update completed with **196 nodes / 306 edges**.
- Public homepage, regular privacy and Contego privacy returned **HTTP 200**; both
  APIs returned the expected **GET 405**. The deployed privacy content is current and
  the served application asset matches the final local build.
- The updated regular privacy page describes submission-only IP/user-agent/referrer
  capture, missing metadata, URL handling and preservation on duplicate registration.
- New request `referrer` values are supplied HTTP(S) URLs that may retain query parameters. URLs containing user information are
  omitted, and fragments are removed from accepted URLs.
- This change adds no cookies, analytics service or device fingerprinting. Client
  headers can be absent and are not verified identity information.

## Live capture and cleanup verification

Checks ran against the production deployment at **14:44:25–14:44:28 UTC**:

- The database exposed exactly the six documented columns. All **94** existing real
  records retained every value in those six fields.
- Modern JSON and legacy four-field form requests returned `{ "ok": true }` only
  with an independently confirmed durable row in Neon.
- Saved IP was a valid platform-derived address. Spoofed values in both forwarded
  headers and bogus JSON metadata were ignored. Saved user-agent matched the request
  header; referrer retained its query parameters and had its fragment removed.
- Email case/spacing variations and duplicates crossing the two APIs preserved the
  original timestamp and every field.
- Missing or invalid optional headers remained null. User-agent truncation passed.
- Exactly **4 generated synthetic records** were deleted, **0** remained, and all
  **94 real records** remained unchanged after cleanup.

The private aggregate proof artifact is
`metadata-live-qa-proof-1788965065565-a80904d7.json`. Subscriber values, request metadata,
credentials and row-level comparison artifacts remain outside the repository.

The Contego article and its separate hosting note are unchanged by this update.
