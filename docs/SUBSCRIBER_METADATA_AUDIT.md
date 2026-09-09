# Subscriber metadata evidence — 9 September 2026

The metadata columns and historical backfill are complete. The user subsequently
requested a six-field table. **Deployment of the revised API, removal of the two
superseded columns, and verification of new live submissions remain pending.**
This is a follow-up to the completed hosting/email migration; its historical
[MIGRATION_AUDIT.md](MIGRATION_AUDIT.md) is unchanged.

## Target schema and verified access

The final `public.subscribers` table contains only these six fields:

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
is pending; it will drop the superseded columns after the revised API is deployed.
No replacement columns are added.

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

The first run reported **0 metadata conflicts** and **0 records skipped for a different
event timestamp**. The repeat changed no rows, and all **94** metadata records remained
verified. The archive and row-level comparison data stay private; this audit records
aggregate evidence only.

An independent full comparison confirmed **94 rows before and 94 rows after**.
Every row retained its original email, consent and timestamp. For **94/94** addresses, the selected earliest archived event's
date, consent, IP, user-agent and referrer exactly match the stored values. All three
metadata fields are populated on all **94** rows.

## Application validation and remaining evidence

- The revised six-field implementation passed **43 local tests**, TypeScript and
  a production build producing **28 prerendered routes**. Both API modules also
  passed real Node ESM import and GET-handler checks after NodeNext compilation.
- The updated regular privacy page describes submission-only IP/user-agent/referrer
  capture, missing metadata, URL handling and preservation on duplicate registration.
- New request `referrer` values are supplied HTTP(S) URLs that may retain query parameters. URLs containing user information are
  omitted, and fragments are removed from accepted URLs.
- This change adds no cookies, analytics service or device fingerprinting. Client
  headers can be absent and are not verified identity information.
- **Pending:** deploy the revised API, apply migration 003, confirm the
  six-column schema, verify actual new-submission metadata in Neon, verify duplicate
  metadata preservation on that deployment, and record its commit
  and production deployment identifier before marking the entire metadata update complete.

The Contego article and its separate hosting note are unchanged by this update.
