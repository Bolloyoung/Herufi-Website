# Google Sheets setup

Herufi reads contacts from a Google Sheet with a **service account** that has read only access. It
never writes to the sheet, and the sheet does not need to be public.

## 1. Create the service account

1. Google Cloud console: create (or pick) a project.
2. APIs and Services, Library: enable **Google Sheets API**.
3. IAM and Admin, Service accounts: create one, for example `herufi-sheets`. It needs no project roles.
4. Open it, Keys, Add key, Create new key, JSON. A file downloads. Treat it like a password.
5. From that file, copy `client_email` into `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `private_key` into `GOOGLE_PRIVATE_KEY`. In an environment variable screen, write the key on one line with the line breaks as `\n`. Do not commit the file or paste it into chat.

The only permission Herufi requests is `spreadsheets.readonly`.

## 2. Share the spreadsheet

Open the sheet, Share, paste the service account email, role **Viewer**. The Imports screen shows the
exact address to use. If the sheet is not shared, the screen says so and names the address.

## 3. Sheet layout

Headings can be anything. On the Imports screen you match them to Herufi's fields, and Herufi
suggests matches from common names. The mapping is saved per sheet and tab.

| Field | Required | Notes |
|---|---|---|
| Email | Yes | Lower cased and checked. Blank, malformed and repeated addresses are reported, not imported |
| First name, last name, organisation, job title, country | No | |
| Organisation type, category, tags | No | Used for audience rules. Tags split on a comma, semicolon or pipe |
| External ID | Recommended | A stable ID from your source. Matches rows even if other cells change. If the same ID arrives with a different email, the row is flagged for review and nothing is rewritten |
| Consent status, date, source, purpose, evidence | No | See below |
| Notes | No | Internal only. Never sent to Listmonk or included in email |

### Consent columns

A sheet saying someone consented is a **claim**, not permission. Herufi stores it and shows it on the
Contacts screen. It becomes consent only when an administrator accepts it, and only if the row holds
a date, a source, a purpose and an evidence reference. Words like "Yes", "Opted in" and "Consented"
count as given. Words like "No", "Unsubscribed" and "Do not contact" count as withdrawn, and a
withdrawal is applied immediately, because that only ever makes a contact more restricted.

Dates are read **day first**, so `04/03/2026` is 4 March 2026. ISO dates (`2026-03-04`) and
`4 March 2026` also work. Future dates and dates before 1990 are rejected.

## 4. Behaviour to know about

* **Preview first.** It shows new, changed, unchanged, invalid and duplicate rows and writes nothing.
* **Choose rows.** Untick any row you do not want.
* **Safe to repeat.** Running an import twice changes nothing the second time.
* **A blank cell never erases** data that is already held.
* **Rows that disappear from the sheet are not deleted.** Archive a contact deliberately instead.
* **An unsubscribed or suppressed contact is never reactivated** by an import, whatever the sheet says.
* **Only one import per sheet runs at a time.** A crashed import releases its lock after 15 minutes.
* Limit: 50,000 rows per worksheet. Google allows about 60 reads a minute per user, which Herufi respects with retries and backoff.
