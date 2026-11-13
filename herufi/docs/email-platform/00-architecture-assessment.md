# Architecture assessment

## What was found in the repository

| Question | Finding |
|---|---|
| Framework | Next.js 14.2.5, App Router, TypeScript, Tailwind. No test framework existed. |
| Hosting | Vercel, per the README and CLAUDE.md. There is no Render or Vercel configuration file in the repository, so how Render is used today could not be confirmed from the code. |
| Database and login | Supabase. Members sign in with magic links. The administrator is identified by an email address in an environment variable. |
| Existing email | The contact form sends through Resend from hello@herufi.org. The newsletter form wrote an address straight into a Supabase table from the browser, with no consent record. |
| Custom domain mailbox | Not discoverable from the repository, and nothing here changes it. See the domain checklist. |
| Design system | Tailwind utilities (`btn-primary`, `field`) with Inter and Merriweather. The new screens reuse them. |

## Architecture

```
  Browser                       Herufi on Vercel (Next.js)                        Other services
  -------                       -------------------------                          --------------
  /admin/email/*  ──bearer──>   Admin API routes  ┐
  public forms    ──POST────>   Public API routes │  Integration layer (lib/)
                                Scheduled job     │   ├ consent state machine
  GitHub Actions  ──secret──>   /api/internal/sync┘   ├ eligibility, suppression
                                        │             ├ Google Sheets client ────> Google Sheets (read only)
                                        │             └ Listmonk client ─────────> Listmonk on Render
                                        v                                              │
                              Postgres (Supabase)                                      v
                              contacts, consent, audiences,               Listmonk's own Postgres
                              campaigns, sync jobs, audit log                          │
                                                                                       v
                                                                          SMTP provider (Resend or SES)
                                                                                       │
                                                                                       v
                                                                                  Inboxes

                              Reply-To: your existing Gmail or Workspace mailbox (unchanged)
```

Rules the code follows:

* The browser never talks to Google, Listmonk or SMTP. Every call goes through an authenticated Herufi endpoint.
* Herufi's database is separate from Listmonk's. Consent and provenance live in Herufi, so Listmonk is replaceable.
* A contact appearing in a sheet is never permission. Imports create "no consent" contacts.
* Provider specific code lives in `lib/integrations/`. Business rules live in `lib/domain/` and `lib/services/`.

## Decisions and why

| Decision | Reason |
|---|---|
| Connect to Postgres directly with `pg` and `DATABASE_URL` | Consent changes must be atomic: the status change, the audit event and the token use succeed or fail together. That needs real transactions, which supabase-js over REST does not give. |
| Verify admin sessions with Supabase's `/auth/v1/user` | Needs no service role key. The token is never trusted without asking Supabase who owns it. |
| Row level security on, no policies | The browser has no route to this data at all. Only the server, using the database owner connection, can read it. The migration also revokes the table and function grants Supabase gives by default. |
| Listmonk pinned to 6.2.0 | The newest release is a v7 beta. 6.2.0 is the current stable tag and the one Docker Hub's `latest` points to. |
| Unsubscribe link points to Herufi | An unsubscribe updates Herufi's record at once. Listmonk has no outbound webhooks, so a Listmonk side unsubscribe is only discovered by polling. |
| Confirmation is a POST behind a button | Mail security scanners open links automatically. A GET would let a scanner subscribe someone. |
| Consent is per audience | People agree to receive specific things. Contact level states (bounced, unsubscribed) stay global. |
| Staff cannot trigger consent request emails | Emailing imported contacts to ask them to opt in is itself unsolicited marketing in many jurisdictions. Only the person can start the process, from the public form. |
| Resend can serve as the SMTP provider | It is already configured and verified for herufi.org. Amazon SES is the cheaper option at volume. The SMTP settings are provider neutral. |

## Contact states

`imported_pending_consent`, `pending_confirmation`, `subscribed`, `unsubscribed`, `bounced`,
`complained`, `suppressed`, `invalid`. The rules are in `lib/domain/consent.ts` and are tested
exhaustively: the only ways to become `subscribed` are a confirmed double opt in, or an
administrator recording evidence of consent with a date, source, purpose and reference.

* An import or sync never moves a contact towards subscribed. It can only restrict (a sheet that says "unsubscribed" is honoured).
* `bounced`, `complained`, `suppressed` and `invalid` cannot be re-subscribed by the public form. Only an administrator, giving a reason, can clear them, and that returns the person to "no consent", never to subscribed.
* Someone who unsubscribed can opt back in themselves through double opt in.

## Who receives a campaign

A person receives it only if they are `subscribed`, not archived, not on the global suppression list,
and have recorded consent for that campaign's audience. The same function (`classify` in
`lib/integrations/email/eligibility.ts`) counts recipients on the review screen, decides who is pushed
to Listmonk, and re-checks at the moment of sending.

## Behaviours of Listmonk 6.2.0 that shaped the design

These were found by calling a real instance, and several differ from or are missing in its documentation.

| Behaviour | What Herufi does about it |
|---|---|
| Adding a subscriber to a list as "confirmed" silently flips an unsubscribed person back to confirmed. | Never adds blindly. It reads the subscriber first and adopts a Listmonk side unsubscribe into Herufi. Only consent given after the unsubscribe counts as opting back in. |
| A test email only works for addresses that already exist as subscribers. | Creates a list free record for the test address, so it can never be reached by a real campaign. |
| A scheduled campaign cannot be cancelled directly. | Moves it back to draft. |
| `.Campaign.Subject` in a template is the raw subject template source, not the rendered subject. | The wrapper template does not use it. |
| Template content is a Go template with access to Sprig functions, which include reading environment variables. | Editor content may contain only known merge tags. Anything else that looks like a template action is rejected on save, and again when sending. |
| A duplicate subscriber returns 409. | Treated as "adopt the existing one". |
| No outbound webhooks for unsubscribes or bounces. | A scheduled reconcile job polls the API. |
| `/health` is public and `/api/*` needs a token. `/admin`, `/api` and `/webhooks/bounce` share a host with the public pages. | The deployment guide gives proxy rules. An optional proxy token header adds a second lock on the API. |
| Test sends return success even when SMTP is not configured. | The interface says "queued", never "delivered". |

## How it was tested

Run `npm run test` (180 unit tests) and `npm run test:integration` (97 tests against a real Postgres 17,
a real Listmonk 6.2.0 and a real SMTP catcher). Highlights:

* A full campaign goes Herufi to Listmonk to SMTP to a mail catcher, and the test checks the From and Reply-To headers, per person personalisation, the signed unsubscribe link, the `List-Unsubscribe` header, and that unsubscribed, unconfirmed and unconsented contacts receive nothing.
* Safeguards were broken on purpose to prove the tests catch it: reusing a confirmation token, removing the row lock, and letting a bounced address back in through the form each made tests fail.
* Concurrent confirmations of one link succeed exactly once. Two syncs of one sheet cannot run at once. A contact who unsubscribes in the middle of a sync is not lost.

**Not tested here, because it needs your accounts:** the live Google Sheets API (the client is tested
with a mocked server and real RSA signing), Supabase Auth (tested with a stubbed verifier), Resend and
SES delivery, a Render deployment, a Vercel deployment, and the admin screens in a browser with a real
login. The first real run of each should happen in staging with `EMAIL_SEND_MODE=allowlist`.
