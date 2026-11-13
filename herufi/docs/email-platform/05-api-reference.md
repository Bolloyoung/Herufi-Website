# API reference

All responses are JSON. Success is `{ "data": ... }`. Failure is
`{ "error": { "code", "message", "details"? }, "correlationId" }`. Send `x-correlation-id` to trace a request.

**Administrator endpoints** need `Authorization: Bearer <Supabase access token>` from a signed in user whose
email is in `ADMIN_EMAILS` (or `NEXT_PUBLIC_ADMIN_EMAIL`). The token is checked with Supabase on every request.

| Status | Meaning |
|---|---|
| 400 `validation_error` | The input is not valid. `details` lists the fields |
| 401 / 403 | Not signed in / not an administrator, or a cross origin or bad signature request |
| 404 `not_found` | |
| 409 | A conflict, such as `audience_changed`, `already_submitted`, `sync_in_progress`, `not_editable` |
| 429 `rate_limited` | |
| 502 / 503 | A provider (Listmonk, Google, the database) failed. Safe to retry |

## Public (no login)

| Method and path | Purpose |
|---|---|
| `GET /api/subscribe/audiences` | Topics offered on the form. Names only |
| `POST /api/subscribe` | `{ email, firstName?, audiences: [slug], website? }`. Step one of double opt in. Always answers the same way. Same origin only. 10 per hour per IP, 3 per day per address. `website` is a honeypot |
| `POST /api/subscribe/confirm` | `{ token }`. Step two. Single use, expires after 48 hours |
| `POST /api/unsubscribe` | `{ token, campaign? }`. Signed token from the email link. Idempotent |
| `POST /api/webhooks/email-events` | Signed provider events, see below |

### Delivery events webhook

Headers `x-herufi-timestamp` (unix seconds, within 5 minutes) and `x-herufi-signature`
(`hex(HMAC_SHA256(EMAIL_WEBHOOK_SECRET, "<timestamp>.<raw body>"))`). Body is one event or an array of up to 100:
`{ "id", "provider", "type": "bounce" | "complaint" | "delivered", "email", "detail"? }`.
Events are deduplicated by provider and id. Listmonk's own bounce handling is the primary path. Use this
endpoint if a provider can post events and you write a small adapter for its format.

## Scheduled job

| Method and path | Purpose |
|---|---|
| `GET` or `POST /api/internal/sync` | `Authorization: Bearer <INTERNAL_JOB_SECRET>`. Reconcile from Listmonk, push pending contacts, refresh campaigns |

## Administrator

| Method and path | Purpose |
|---|---|
| `GET /api/whoami` | Checks access |
| `GET /api/email-status` | Environment, send mode, which settings exist, Listmonk health and lists, counts, recent jobs |
| `POST /api/sync` | Run the sync now |
| `GET /api/audit` | Audit log. Query `entityType`, `entityId`, `limit` |
| `GET /api/integrations/google-sheets/info` | Service account address, defaults. `?spreadsheetId=` lists tabs |
| `POST /api/integrations/google-sheets/preview` | `{ spreadsheetId, worksheet, mapping?, tagDelimiter? }`. Writes nothing |
| `POST /api/integrations/google-sheets/sync` | Same, plus `rowNumbers?` (import only these) and `onlyRows?` (retry these) |
| `GET /api/integrations/google-sheets/status` | Recent jobs. `?jobId=` row errors. `?spreadsheetId=&worksheet=` unresolved rows |
| `GET /api/contacts` | Query `q`, `status`, `audienceId`, `claim`, `archived`, `page`, `perPage` |
| `GET /api/contacts/{id}` | Contact, memberships, consent history, suppression |
| `POST /api/contacts/{id}/consent` | Record consent obtained elsewhere. Needs `audienceIds`, `date`, `source`, `purpose`, `evidence` |
| `POST /api/contacts/{id}/actions` | `{ action: archive \| restore \| suppress \| clear_suppression, reason }` |
| `POST /api/contacts/accept-claimed` | `{ contactIds, audienceIds }`. Only contacts with a complete sheet claim are accepted |
| `GET` `POST /api/audiences` | List, create |
| `PATCH` `DELETE /api/audiences/{id}` | Update, archive |
| `POST /api/audiences/{id}/members` | `{ action: add \| remove, contactIds }`. Never grants consent |
| `GET` `POST /api/senders`, `PATCH /api/senders/{id}` | Senders. `PATCH { verified?, makeDefault? }` |
| `GET` `POST /api/templates`, `GET` `PATCH` `DELETE /api/templates/{id}` | Reusable email templates |
| `GET` `POST /api/campaigns` | List (`q`, `status`, `page`), create |
| `GET` `PATCH` `DELETE /api/campaigns/{id}` | Read, edit (draft, test or failed only), archive |
| `GET /api/campaigns/{id}/review` | Eligible and excluded counts with reasons, checks, preview. Recomputed each time |
| `POST /api/campaigns/{id}/test` | `{ recipients: [email] }`, up to 5. Reports "queued", not "delivered" |
| `POST /api/campaigns/{id}/submit` | `{ mode: send_now \| schedule, scheduledAt?, expectedEligibleCount, confirm: true, idempotencyKey }` |
| `POST /api/campaigns/{id}/control` | `{ action: pause \| resume \| cancel \| refresh }` |

### Submitting a campaign

`confirm` must be exactly `true`. `expectedEligibleCount` is what the reviewer saw. If the true number
now differs, nothing is sent and the answer is `409 audience_changed`. `idempotencyKey` is a fresh value per
review screen: repeating it returns the same result without sending again, and a different key for an
already submitted campaign returns `409 already_submitted`. A schedule must be at least 5 minutes ahead.
Before anything is sent, Herufi syncs, re-checks eligibility, and unsubscribes from the Listmonk list
anyone who should not be there.
