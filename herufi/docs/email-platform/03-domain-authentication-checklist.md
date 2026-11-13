# Domain authentication checklist

Nothing in this system changes DNS, MX records or your mailbox. You make every DNS change yourself,
after recording what is there now. This checklist is the whole job.

## Principles

* **Your Gmail or Google Workspace mailbox stays as it is.** It receives replies. Campaign email is sent by a delivery provider, because a mailbox is not a bulk sender and Google will throttle or suspend one used as a relay.
* **Do not touch MX records.** They decide where inbound mail goes. Replies must keep arriving in your mailbox.
* **A domain may have only one SPF record.** If one exists, add the provider's `include:` to it. Do not add a second SPF record, which breaks SPF.
* **Never delete an existing DKIM or DMARC record** without writing down its value first.

## 0. Record the current state (do this first)

In your DNS provider, copy down every TXT, CNAME and MX record for `herufi.org`, with a screenshot.
Note especially: the MX records, the existing SPF record (a TXT starting `v=spf1`), any
`*._domainkey` records, and any `_dmarc` record. Keep this somewhere safe.

## 1. Choose the delivery provider

| | Resend | Amazon SES |
|---|---|---|
| Already set up for herufi.org | Yes, the contact form uses it | No |
| SMTP for Listmonk | `smtp.resend.com`, user `resend`, password an API key | An SMTP endpoint with SMTP credentials |
| Cost at volume | Per plan | Lower per message |
| Bounce and complaint feedback | Webhook or its dashboard | SNS notifications, supported by Listmonk's `/webhooks/service/ses` |

Resend is the quickest start because the domain is already verified there. Check your plan's daily and
monthly sending limits and its rules about marketing email before sending to a large list. Keep the
provider choice open: Listmonk's SMTP settings are the only place it is configured.

## 2. Authenticate the sending domain with the provider

The provider tells you the exact records to add. Typically:

1. **DKIM**: two or three CNAME (or one TXT) records the provider generates. Add them exactly as shown.
2. **SPF**: merge the provider's `include:` into your single SPF record. For example, if you have `v=spf1 include:_spf.google.com ~all`, it becomes `v=spf1 include:_spf.google.com include:<provider-spf-domain> ~all`. Use the value the provider gives, not one from this document.
3. **Return path (custom MAIL FROM) if offered**: usually an MX and a TXT on a subdomain, such as `send.herufi.org`. It aligns SPF with your domain. It is on a subdomain, so it does not affect your mailbox's MX.
4. Wait for the provider to show the domain as **Verified**.

## 3. DMARC

Add one TXT record at `_dmarc.herufi.org`, or edit the existing one.

* Start in monitoring mode: `v=DMARC1; p=none; rua=mailto:<a mailbox that can receive reports>`.
* Watch the reports for two to four weeks to confirm that Google, your provider and anything else that sends as herufi.org all pass.
* Then move to `p=quarantine`, and later `p=reject` if you wish.
* DMARC passes when SPF or DKIM passes **and aligns** with the From domain. Sending from `hello@herufi.org` through a provider that signs with `herufi.org` aligns.

## 4. Check it works

1. Send a test email from the campaign screen to a Gmail address.
2. In Gmail, open the message, three dots, **Show original**. Confirm `SPF: PASS`, `DKIM: PASS`, `DMARC: PASS`.
3. Confirm it did not land in spam and that the unsubscribe link and the "Unsubscribe" button in the Gmail header both work.
4. Reply to it. The reply must arrive in your normal mailbox, addressed to the Reply-To address.
5. Optionally send one to a free deliverability checker and fix anything it reports.

## 5. Then, and only then

On Senders and templates, press **Mark as verified** for the sending address. Campaigns cannot use an
unverified sender.

## What not to do

* Do not use `smtp.gmail.com` in Listmonk. `check-setup.mjs` fails if it sees that.
* Do not send from an address on a domain you have not authenticated.
* Do not buy a list. Do not email people who have not agreed to receive it. Spam complaints damage the domain for your normal mail too.
* Do not set DMARC to `reject` before the monitoring period is clean.

## Rules about marketing email

Rules differ by recipient country (for example GDPR and ePrivacy in Europe, the Kenya Data Protection
Act, CAN-SPAM in the US). This system records consent with evidence, honours unsubscribes
immediately, and keeps a suppression list, which are the common building blocks. **You** remain
responsible for confirming the lawful basis and the rules for each audience and campaign type, and
for the physical address or identity details some countries require in the email footer.
