# Remaining manual actions

Everything below needs an account, a decision or a DNS change that only you can make. Nothing has been
deployed, no DNS was changed, no real email was sent and no secret was written to the repository.

## Before anything else

- [ ] **Rotate the Anthropic API key** that was found in a file named `.env` at the root of the project folder (`Herufi 2.0/.env`). It was printed into a working session by mistake. The file is ignored by git and was never committed, but treat the key as exposed.
- [ ] Review and commit the changes. They are uncommitted so you can review them. See "Committing" at the end.

## Accounts and credentials

- [ ] Supabase: run `supabase/migrations/20261111000000_email_platform.sql`; copy the transaction pooler string into Vercel as `DATABASE_URL`.
- [ ] Generate `EMAIL_TOKEN_SECRET`, `INTERNAL_JOB_SECRET`, `EMAIL_WEBHOOK_SECRET` (`openssl rand -hex 32`). Set `CRON_SECRET` to match `INTERNAL_JOB_SECRET`.
- [ ] Render: apply `deploy/render/render.yaml` (validate it first). Capture the Listmonk API token from the first start logs.
- [ ] Listmonk: set SMTP, root URL, bounce processing and a restricted API user (see the deployment guide).
- [ ] Choose the delivery provider (Resend or Amazon SES) and enter its SMTP details in Listmonk.
- [ ] Google: create the service account, enable the Sheets API, share the sheet, set `GOOGLE_*`.
- [ ] Vercel: set every variable in `.env.example` for Production and Preview. Redeploy.
- [ ] GitHub: add `EMAIL_SYNC_URL` and `INTERNAL_JOB_SECRET` secrets for the scheduled sync.
- [ ] Optional proxy: put Cloudflare (or similar) in front of Listmonk with the path rules in the deployment guide, and set `LISTMONK_PROXY_TOKEN`.

## DNS (you make these changes, after recording the current records)

- [ ] DKIM records from the delivery provider.
- [ ] Merge the provider's `include:` into the existing SPF record. Do not add a second SPF record.
- [ ] DMARC at `_dmarc.herufi.org`, starting with `p=none`.
- [ ] Do not change MX records.

## Decisions

- [ ] Existing `newsletter_subscribers`: re-permission or import as claims (see the operations guide).
- [ ] Which audiences exist, and which are offered on the public form.
- [ ] Whether more than one person needs administrator access (`ADMIN_EMAILS`).
- [ ] Retention period for consent and audit records.
- [ ] The lawful basis and footer requirements for each audience and country.
- [ ] Whether to keep the legacy newsletter fallback after go live.

## Verification only you can do

- [ ] Sign in as an administrator and walk through every screen in `/admin/email` on a staging deployment. These screens were type checked and built, but exercised in a browser only against a stubbed login.
- [ ] Run the acceptance checklist in the deployment guide on staging.
- [ ] Complete the domain checks and confirm SPF, DKIM and DMARC pass in a real Gmail "Show original".
- [ ] Confirm a reply to a campaign reaches your Gmail or Workspace mailbox.
- [ ] Confirm the first real campaign in `allowlist` mode before switching to `live`.

## Committing

Your working tree also holds uncommitted work of your own (new blog posts, a publication, charts). Commit
the email platform separately so it can be reviewed on its own:

```bash
git switch -c email-platform
git add herufi/supabase herufi/lib herufi/app/api herufi/app/admin herufi/app/subscribe herufi/app/unsubscribe \
        herufi/components/admin herufi/components/email herufi/components/NewsletterSignup.tsx herufi/docs \
        herufi/deploy herufi/scripts/email herufi/scripts/fix-invisible-chars.py herufi/tests \
        herufi/vitest.config.ts herufi/vitest.integration.config.ts herufi/.env.example herufi/next.config.js \
        herufi/package.json herufi/package-lock.json .github/workflows/email-sync.yml
git status          # check nothing of your own work is staged by mistake
git commit -m "Add Listmonk email platform with consent, Google Sheets import and campaigns"
```

Do not merge to `main` until staging passes, because Vercel deploys `main` automatically.
