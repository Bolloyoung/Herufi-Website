# Deployment guide

Where each part runs:

| Part | Where | Notes |
|---|---|---|
| Herufi website and API | Vercel (unchanged) | Hosts the admin screens, public forms and integration layer |
| Herufi data (contacts, consent, campaigns) | Supabase Postgres (existing project) | New `email_*` tables only. Existing tables are untouched |
| Listmonk | Render, as a Docker service | Pinned to `listmonk/listmonk:v6.2.0` |
| Listmonk's database | Render managed Postgres | Separate from Herufi's data |
| Email delivery | Resend (already set up) or Amazon SES | Listmonk sends through SMTP |
| Scheduled sync | GitHub Actions | Works on any Vercel plan |

Do not migrate Herufi off Vercel. Do not run Listmonk on a free Render plan (the free database expires
after 30 days and free web services sleep and block outbound mail ports).

## 1. Database (Supabase)

1. Open the Supabase SQL editor and run `supabase/migrations/20261111000000_email_platform.sql`. It is safe to run twice. It adds 15 `email_*` tables with row level security on and no policies, and removes Supabase's default grants on them, so the browser cannot reach this data.
2. Settings, Database, Connection string. Use the **transaction pooler** string (port 6543) for `DATABASE_URL`, because Vercel functions are short lived. Keep it server side only.
3. Decide about existing newsletter signups. Herufi has a `newsletter_subscribers` table with no consent evidence. It is not migrated automatically. See [04 Operations](04-operations-guide.md#existing-newsletter-subscribers).

## 2. Listmonk on Render

1. Apply `deploy/render/render.yaml` as a Render Blueprint (see the comments in that file, and run `render blueprints validate` first).
2. Provide `LISTMONK_ADMIN_USER` and `LISTMONK_ADMIN_PASSWORD` when asked. Use a long random password.
3. After the first deploy, open the service logs and copy the line `export LISTMONK_ADMIN_API_TOKEN="..."`. It is printed once. That is `LISTMONK_API_TOKEN`. The user name is `herufi_api`.
4. Sign in at `https://<your-listmonk-host>/admin` and open Settings:
   * **General, Root URL**: your public Listmonk address, with `https`.
   * **SMTP**: your delivery provider. Resend example: host `smtp.resend.com`, port `465` with TLS (or `587` with STARTTLS), user `resend`, password a Resend API key. Amazon SES uses its SMTP endpoint and SMTP credentials. Do not use a Gmail mailbox as the relay.
   * **Privacy**: leave "Include `List-Unsubscribe` header" on. Leave individual tracking off.
   * **Bounces**: enable bounce processing, and for your provider enable its webhook (`/webhooks/service/ses` for SES, `/webhooks/service/postmark` and so on) or a POP mailbox. Suggested actions: hard bounce and complaint, blocklist after 1; soft bounce, no action or blocklist after several.
5. Run the readiness check from your machine: `node --env-file=.env.local scripts/email/check-setup.mjs`.

### Protect Listmonk

Listmonk serves its admin screen, its API and its public pages from one host. Put a proxy in front
(Cloudflare is a good fit, since you already use Cloudflare DNS if that is the case) with these rules:

| Path | Who may reach it |
|---|---|
| `/admin*`, `/webhooks/bounce` | Only you (your IP, or Cloudflare Access). Never the open internet |
| `/api/*` | Only requests carrying the header `X-Herufi-Proxy-Token` with the value of `LISTMONK_PROXY_TOKEN`. Herufi sends it. Vercel has no fixed IP, so a secret header is the practical lock, on top of the API token |
| `/subscription/*`, `/link/*`, `/campaign/*`, `/public/*`, `/uploads/*`, `/health` | Public. Tracking links and the pixel need them |
| `/webhooks/service/*` | Public, but only if you use provider webhooks. Allow only your provider's addresses if you can |

Create a dedicated Listmonk API user with only the permissions Herufi needs (lists, subscribers,
campaigns, templates, bounces read). Do not use the super administrator for the API.

## 3. Vercel environment variables

Set these for Production and for Preview (use different values for Preview, see staging). Names and
meaning are in `.env.example`.

| Variable | Production | Preview or staging |
|---|---|---|
| `APP_ENV` | `production` | `staging` |
| `EMAIL_SEND_MODE` | `live` when ready, `disabled` until then | `allowlist` |
| `EMAIL_TEST_ALLOWLIST` | not used | your own addresses |
| `APP_BASE_URL` | `https://herufi.org` | the preview address |
| `DATABASE_URL` | production database | a separate database (a second Supabase project is best) |
| `EMAIL_TOKEN_SECRET`, `INTERNAL_JOB_SECRET`, `EMAIL_WEBHOOK_SECRET` | generate with `openssl rand -hex 32` | different values |
| `CRON_SECRET` | same as `INTERNAL_JOB_SECRET` | same as that environment's |
| `LISTMONK_*` | production Listmonk | a separate staging Listmonk |
| `GOOGLE_*` | service account | same or a test sheet |
| `RESEND_API_KEY` | existing | existing |

Never add `NEXT_PUBLIC_` to a secret. `check-setup.mjs` fails if you do.

Changing `EMAIL_TOKEN_SECRET` later invalidates every unsubscribe link already sent, so set it once.

### Scheduled sync

Add two GitHub repository secrets: `EMAIL_SYNC_URL` (`https://herufi.org/api/internal/sync`) and
`INTERNAL_JOB_SECRET`. The workflow `.github/workflows/email-sync.yml` then runs every 15 minutes. It
does nothing until both exist. You can also press "Sync now" on the overview screen.

## 4. Staging first

Run a full copy of everything with `APP_ENV=staging` and `EMAIL_SEND_MODE=allowlist`. In this mode
nothing reaches an address outside `EMAIL_TEST_ALLOWLIST`, confirmation emails included, and contacts
outside the allowlist are never pushed to Listmonk. Use a separate Listmonk instance for staging so it
cannot affect real subscribers.

Acceptance checklist (the brief's test list):

* [ ] Preview a private sheet without importing it. Import valid rows. Invalid and duplicate rows are reported.
* [ ] Run the same import again. Nothing is created or changed.
* [ ] Importing a contact does not make them eligible. The review screen counts them as "no consent".
* [ ] Sign up on the public form, confirm by email, and the contact becomes subscribed with evidence recorded.
* [ ] Unsubscribe from a real email. The contact is ineligible at once. A later sheet import does not bring them back.
* [ ] Send a test email. Check From, Reply-To, the unsubscribe link, and that it is not in spam.
* [ ] SPF, DKIM and DMARC pass (see the domain checklist). View the message source in Gmail.
* [ ] Send a campaign to an allowlist audience. Only allowlisted people receive it.
* [ ] Schedule a campaign, then cancel it.
* [ ] Reply to a campaign email. The reply reaches your Gmail or Workspace mailbox.
* [ ] Cause a bounce (send to a nonexistent address on a domain you control). The contact becomes bounced.

## 5. Go live

1. Complete the domain checklist, then mark the sender verified under Senders and templates.
2. Set `APP_ENV=production` and `EMAIL_SEND_MODE=live` in Vercel Production, then redeploy.
3. Run `check-setup.mjs` against production.
4. Send the first campaign to a small internal audience, then to real ones.

## Rollback

* **Website**: Vercel, Deployments, promote the previous deployment. The database changes are additive, so the old code runs against the new tables.
* **Stop all sending at once**: set `EMAIL_SEND_MODE=disabled` and redeploy. Herufi then refuses to send, test or push contacts. To stop a campaign already running, open it and press Pause or Cancel.
* **Listmonk upgrade went wrong**: restore the Render database backup you took before the upgrade, then set the image back to the previous pinned tag. Listmonk schema upgrades are not reversible without the backup.

## Backups and recovery

* **Herufi data**: Supabase backups (daily on paid plans, point in time recovery as an add on). Also take a manual dump before any large import or migration: `pg_dump "$DATABASE_URL" --no-owner --format=custom --file herufi-$(date +%F).dump`.
* **Listmonk data**: Render Postgres backups on a paid plan, plus the same `pg_dump` against its connection string. Take one before every Listmonk upgrade.
* **Restore test**: restore a dump into a scratch database at least once, before you need it: `pg_restore --no-owner --dbname <scratch-url> herufi-YYYY-MM-DD.dump`.
* Consent history is the data you can least afford to lose. It lives only in Herufi's database.

## Monitoring

* Overview screen: send mode, which settings exist, Listmonk health, recent sync jobs.
* Listmonk `/health` for Render's health check.
* GitHub Actions: a failing "Email sync" run means the scheduled job cannot reach Herufi or is rejected.
* Structured JSON logs with a correlation id appear in Vercel logs. Credentials are redacted and email addresses masked.

## Upgrading Listmonk

1. Read the release notes. Take a database backup.
2. Change the pinned tag in `render.yaml` (and the dev compose file) to a stable release, never `latest` or a beta.
3. Deploy to staging, run `npm run test:integration` against it if possible, then promote.
