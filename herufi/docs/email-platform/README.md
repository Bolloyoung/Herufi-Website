# Herufi email platform

Contacts, consent, audiences and email campaigns for Herufi, built on Listmonk.

Herufi keeps the record of who agreed to receive what. Listmonk does the sending. Staff work only in
Herufi, at `/admin/email`.

| Read this | When |
|---|---|
| [00 Architecture assessment](00-architecture-assessment.md) | To understand how it fits together and why |
| [01 Deployment guide](01-deployment-guide.md) | To set it up on Supabase, Render and Vercel |
| [02 Google Sheets setup](02-google-sheets-setup.md) | To connect the contact spreadsheet |
| [03 Domain authentication checklist](03-domain-authentication-checklist.md) | Before sending the first real email |
| [04 Operations guide](04-operations-guide.md) | For day to day use and when something goes wrong |
| [05 API reference](05-api-reference.md) | For the HTTP endpoints |
| [06 Remaining manual actions](06-remaining-manual-actions.md) | The list of things only you can do |

## Quick start for development

```bash
cd herufi
docker compose -f deploy/listmonk/docker-compose.dev.yml --env-file deploy/listmonk/.env.dev up -d
npm run test              # unit tests, no services needed
npm run test:integration  # real Postgres, real Listmonk, a mail catcher. Sends no real email
node --env-file=.env.local scripts/email/check-setup.mjs   # readiness check for any environment
```

The development stack runs Listmonk 6.2.0, a Postgres for Herufi's own data, and Mailpit, a mail
catcher at http://127.0.0.1:8025 that shows every email Listmonk "sends" without delivering any.
