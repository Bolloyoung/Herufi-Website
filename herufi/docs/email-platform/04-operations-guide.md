# Operations guide

## A normal month

1. **Import**: Imports, choose the sheet, Preview, fix problems in the sheet, import. Repeating is safe.
2. **Review claims**: Contacts, filter "Complete evidence, not yet accepted". Open a few, check the evidence is real, select, choose the audience, press **Accept sheet consent**. This records that you checked the evidence.
3. **Write**: Campaigns, New campaign. Pick the audience, sender and reply to address. Write the email. Use merge fields such as `{{first_name|there}}`: the text after the bar is used when a value is missing.
4. **Test**: Send a test to yourself. "Queued" means Listmonk accepted it, not that it arrived. Open it and check it.
5. **Review and send**: read who will and will not receive it and why, tick the confirmation, send or schedule. If the audience changed since you opened the page, sending is refused and you review again.
6. **Afterwards**: the campaign page shows queued, accepted by the mail server, bounces, unsubscribes, opens and clicks. There is no delivered figure, because Listmonk cannot provide one. Opens are an estimate, because many mail apps block or pre-load the tracking image.

## Consent rules in practice

| Situation | What to do |
|---|---|
| Someone consented at an event and you hold the sign up sheet | Record it on their contact page with the date, source, purpose and a reference to the evidence, or put it in the sheet and accept it in bulk |
| Someone asks to be added by phone or email | Ask them to use the signup form. If you must record it, record the date, how they asked and a reference to the message |
| Someone unsubscribed and now wants back | They sign up again on the form and confirm. You cannot override it with old evidence |
| Someone asks you never to email them | Contact page, Suppress, with a reason. They cannot sign up again until you clear it |
| An address bounced and is now valid | Contact page, Clear suppression, with a reason. They return to "no consent" and must opt in again |

## When something goes wrong

**Sync keeps failing**
* Overview shows recent jobs and errors. "Sync now" runs one by hand.
* A contact that fails is retried next run. If Listmonk is unreachable, nothing is lost: pending changes stay flagged.
* A sync that crashed releases its lock after 15 minutes.

**Import rows failed**
* Imports, Import history, Details lists each failed row and why. Fix the sheet, then **Retry failed rows**, or re-import everything (safe).
* "Email changed, review": the same external ID now has a different email. Decide which is right, and fix the sheet or the contact. Nothing was rewritten.

**A campaign shows "failed"**
* The message on the campaign says why. Fix it, then review and send again. A failure before Listmonk was told to send leaves the campaign as it was.

**"The audience changed since you reviewed it"**
* Someone unsubscribed, was added or was suppressed in the last minutes. Read the new numbers and confirm again.

**"Listmonk has N confirmed subscribers but M are eligible. Nothing was sent."**
* The two are out of step. Press Sync now and try again. If it persists, check the sync job errors.

**Bounces and complaints**
* Listmonk records them (enable bounce processing) and Herufi picks them up every sync, marking the contact bounced or complained and removing consent.
* A high bounce rate harms your sending reputation. Remove bad addresses and re-check where the list came from.

**An unsubscribe did not seem to work**
* The unsubscribe link updates Herufi at once and tells Listmonk straight away. If Listmonk was unreachable, the next sync completes it. Before any campaign starts, Herufi re-checks, so a late unsubscribe still cannot receive it.

**Emergency stop**
* Set `EMAIL_SEND_MODE=disabled` and redeploy, then Pause or Cancel any running campaign.

## Existing newsletter subscribers

Before this system, the signup form wrote addresses to the Supabase table `newsletter_subscribers` with
no consent evidence. They are not imported automatically. Options:

1. **Re-permission (safest).** Ask them to sign up again through the new form. Existing subscribers who confirm get full evidence.
2. **Import them as claims.** Export the table, add columns for consent status, date, source, purpose and evidence that you can honestly fill in (the form's wording at the time, `created_at` as the date, the form as the source), import them, and accept them in bulk. Only do this if you can stand behind that evidence.

Until the email platform is configured on a deployment, the old form behaviour continues so signups
are not lost. Remove that fallback (`platform === 'legacy'` in `components/NewsletterSignup.tsx`)
once the new platform is live.

## Data retention and deletion

* **Contacts are archived, never deleted**, so consent history and suppression remain.
* **Suppression records are kept** for as long as you might email the address, otherwise you could email someone who opted out.
* **Erasure request**: confirm identity, then in the Supabase SQL editor, in one transaction, replace the personal data and keep a minimal suppression so the person is never emailed again:
  ```sql
  begin;
  insert into email_suppressions (email, reason, source, detail)
    values (lower('person@example.org'), 'manual', 'erasure request', 'Erased on request')
    on conflict (email) do nothing;
  update email_contacts set first_name=null, last_name=null, organisation=null, job_title=null, country=null,
         notes=null, tags='{}', claimed_consent=null, archived_at=now(), status='suppressed'
   where email = lower('person@example.org');
  commit;
  ```
  Then remove the subscriber in Listmonk (Subscribers, delete). If the person insists their address itself is erased, delete the suppression too and accept that they could be emailed again.
* The audit log and consent events record who did what. Decide on a retention period (for example seven years for consent evidence) and document it.
* Minimise: notes and claims are never sent to Listmonk, and logs mask addresses.

## Credentials

* Rotate `LISTMONK_API_TOKEN`: create a new API token in Listmonk, update Vercel, redeploy, delete the old one.
* Rotate the Google key: create a new key for the service account, update Vercel, delete the old key.
* If a secret was ever pasted into chat, a ticket or a commit, treat it as exposed and rotate it.
