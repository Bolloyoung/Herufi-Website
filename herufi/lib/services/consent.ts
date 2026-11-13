import type { PoolClient } from 'pg'
import { transition, type ConsentEventType, type Initiator } from '@/lib/domain/consent'
import { cleanText, isValidEmail, normaliseEmail } from '@/lib/domain/text'
import type { ContactRecord, ContactStatus } from '@/lib/domain/types'
import { withTx, db, type Queryable } from '@/lib/server/db'
import { AppError, ConflictError, NotFoundError, ValidationError } from '@/lib/server/errors'
import { generateToken, hashToken } from '@/lib/server/tokens'
import { audit } from './audit'

export { CONSENT_WORDING, CONSENT_WORDING_VERSION } from '@/lib/domain/consent-wording'
import { CONSENT_WORDING_VERSION } from '@/lib/domain/consent-wording'
export const CONFIRMATION_TTL_HOURS = 48

type EventInput = {
  contactId: string | null
  email: string
  type: string
  from?: ContactStatus | null
  to?: ContactStatus | null
  purpose?: string | null
  source?: string | null
  wordingVersion?: string | null
  evidence?: string | null
  audienceIds?: string[]
  actor: string
  correlationId?: string
  metadata?: Record<string, unknown>
}

export async function logConsentEvent(q: Queryable, e: EventInput): Promise<void> {
  await q.query(
    `insert into email_consent_events
       (contact_id, email, event_type, from_status, to_status, purpose, source, wording_version, evidence,
        audience_ids, actor, correlation_id, metadata)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::uuid[],$11,$12,$13::jsonb)`,
    [
      e.contactId, e.email, e.type, e.from ?? null, e.to ?? null, e.purpose ?? null, e.source ?? null,
      e.wordingVersion ?? null, e.evidence ?? null, e.audienceIds ?? [], e.actor, e.correlationId ?? null,
      JSON.stringify(e.metadata ?? {}),
    ],
  )
}

async function lockContactById(c: PoolClient, id: string): Promise<ContactRecord | null> {
  const { rows } = await c.query('select * from email_contacts where id = $1 for update', [id])
  return rows[0] ?? null
}

async function lockContactByEmail(c: PoolClient, email: string): Promise<ContactRecord | null> {
  const { rows } = await c.query('select * from email_contacts where email = $1 for update', [email])
  return rows[0] ?? null
}

async function activeSuppression(c: Queryable, email: string): Promise<string | null> {
  const { rows } = await c.query('select reason from email_suppressions where email = $1 and cleared_at is null', [email])
  return rows[0]?.reason ?? null
}

/** Record a global suppression without ever weakening one that is already active. */
async function suppress(c: Queryable, email: string, reason: 'unsubscribed' | 'bounced' | 'complained' | 'manual' | 'invalid', source: string, detail?: string) {
  await c.query(
    `insert into email_suppressions (email, reason, source, detail)
     values ($1, $2, $3, $4)
     on conflict (email) do update set
       reason     = case when email_suppressions.cleared_at is null then
                      case when excluded.reason = 'complained' then 'complained'
                           when excluded.reason = 'bounced' and email_suppressions.reason in ('unsubscribed','invalid') then 'bounced'
                           when excluded.reason = 'manual' and email_suppressions.reason in ('unsubscribed','invalid') then 'manual'
                           else email_suppressions.reason end
                    else excluded.reason end,
       source     = case when email_suppressions.cleared_at is null then email_suppressions.source else excluded.source end,
       detail     = case when email_suppressions.cleared_at is null then email_suppressions.detail else excluded.detail end,
       created_at = case when email_suppressions.cleared_at is null then email_suppressions.created_at else now() end,
       cleared_at = null, cleared_by = null, clear_reason = null`,
    [email, reason, source, detail ?? null],
  )
}

function setStatusSql(changed: boolean) {
  return changed ? ', status_changed_at = now()' : ''
}

// ---------------------------------------------------------------------------
// Public: request a subscription (step one of double opt in)
// ---------------------------------------------------------------------------
export type RequestOutcome =
  | { outcome: 'sent'; token: string; contactId: string; email: string; audienceNames: string[] }
  | { outcome: 'no_action'; reason: 'blocked' | 'already_subscribed' }

/**
 * A person asks to be subscribed. This never subscribes anyone: it records a
 * pending request and returns a single use token to email to that address. The
 * caller must respond identically whatever the outcome, so the form cannot be
 * used to discover which addresses are already known.
 */
export async function requestSubscription(input: {
  email: string
  firstName?: string | null
  audienceSlugs: string[]
  source: string
  wordingVersion?: string
  correlationId?: string
}): Promise<RequestOutcome> {
  const email = normaliseEmail(input.email)
  if (!isValidEmail(email)) throw new ValidationError('Enter a valid email address')
  if (!input.audienceSlugs.length) throw new ValidationError('Choose at least one topic')
  const firstName = cleanText(input.firstName, 100)
  const wording = input.wordingVersion ?? CONSENT_WORDING_VERSION
  const source = cleanText(input.source, 200) ?? 'website form'

  return withTx(async (c) => {
    const { rows: audiences } = await c.query(
      `select id, name from email_audiences where slug = any($1::text[]) and public_signup and archived_at is null`,
      [input.audienceSlugs],
    )
    if (!audiences.length) throw new ValidationError('Choose at least one topic')
    const audienceIds: string[] = audiences.map((a: { id: string }) => a.id)
    const audienceNames: string[] = audiences.map((a: { name: string }) => a.name)

    const suppression = await activeSuppression(c, email)
    let contact = await lockContactByEmail(c, email)

    if (contact) {
      const t = transition(contact.status, 'request_confirmation', { initiator: 'subscriber' })
      // A person who unsubscribed may opt in again. Any other active suppression needs an administrator.
      if (!t.ok || (suppression && suppression !== 'unsubscribed')) return { outcome: 'no_action', reason: 'blocked' } as const
      const { rows: have } = await c.query(
        'select audience_id from email_contact_audiences where contact_id = $1 and consented and audience_id = any($2::uuid[])',
        [contact.id, audienceIds],
      )
      if (contact.status === 'subscribed' && have.length === audienceIds.length) {
        return { outcome: 'no_action', reason: 'already_subscribed' } as const
      }
      await c.query(
        `update email_contacts set status = $2, first_name = coalesce(first_name, $3), updated_at = now() ${setStatusSql(t.changed)}
          where id = $1`,
        [contact.id, t.to, firstName],
      )
    } else {
      if (suppression && suppression !== 'unsubscribed') return { outcome: 'no_action', reason: 'blocked' } as const
      const { rows } = await c.query(
        `insert into email_contacts (email, first_name, status) values ($1, $2, 'pending_confirmation') returning *`,
        [email, firstName],
      )
      contact = rows[0]
    }

    const contactId = contact!.id
    await c.query(
      `insert into email_contact_audiences (contact_id, audience_id, consented, added_via)
       select $1, unnest($2::uuid[]), false, 'public_form'
       on conflict do nothing`,
      [contactId, audienceIds],
    )

    // Only the newest confirmation link works.
    await c.query('update email_confirmation_tokens set expires_at = now() where contact_id = $1 and used_at is null and expires_at > now()', [contactId])
    const token = generateToken()
    const purpose = `Email updates from Herufi: ${audienceNames.join(', ')}`
    await c.query(
      `insert into email_confirmation_tokens (token_hash, contact_id, audience_ids, purpose, wording_version, source, expires_at)
       values ($1, $2, $3::uuid[], $4, $5, $6, now() + make_interval(hours => $7))`,
      [hashToken(token), contactId, audienceIds, purpose, wording, source, CONFIRMATION_TTL_HOURS],
    )
    await logConsentEvent(c, {
      contactId, email, type: 'confirmation_requested', from: contact!.status, to: 'pending_confirmation', purpose, source,
      wordingVersion: wording, audienceIds, actor: 'subscriber', correlationId: input.correlationId,
    })
    return { outcome: 'sent', token, contactId, email, audienceNames } as const
  })
}

// ---------------------------------------------------------------------------
// Public: confirm (step two of double opt in)
// ---------------------------------------------------------------------------
export class InvalidTokenError extends AppError {
  constructor() {
    super(410, 'invalid_token', 'This confirmation link is invalid or has expired. Please sign up again.')
  }
}

export async function confirmSubscription(token: string, correlationId?: string): Promise<{ contactId: string; email: string; audienceIds: string[] }> {
  if (!token || token.length > 200) throw new InvalidTokenError()
  return withTx(async (c) => {
    const { rows: tokens } = await c.query(
      `select * from email_confirmation_tokens
        where token_hash = $1 and used_at is null and expires_at > now() for update`,
      [hashToken(token)],
    )
    const tok = tokens[0]
    if (!tok) throw new InvalidTokenError()
    const contact = await lockContactById(c, tok.contact_id)
    if (!contact) throw new InvalidTokenError()

    const t = transition(contact.status, 'confirm', { initiator: 'subscriber' })
    if (!t.ok) throw new ConflictError('This subscription request is no longer valid. Please sign up again.', 'request_not_valid')
    // A suppression that is not a plain unsubscribe (bounce, complaint, manual) blocks confirmation.
    const suppression = await activeSuppression(c, contact.email)
    if (suppression && suppression !== 'unsubscribed') throw new ConflictError('This address cannot be subscribed. Please contact us.', 'request_not_valid')

    await c.query(
      `update email_contacts
          set status = 'subscribed', consent_given_at = now(), consent_source = $2, consent_purpose = $3,
              consent_wording_version = $4, consent_evidence = $5, needs_listmonk_sync = true,
              archived_at = null, updated_at = now() ${setStatusSql(t.changed)}
        where id = $1`,
      [contact.id, tok.source, tok.purpose, tok.wording_version, `Double opt in confirmation, token record ${tok.id}`],
    )
    await c.query(
      `insert into email_contact_audiences (contact_id, audience_id, consented, consent_confirmed_at, added_via)
       select $1, unnest($2::uuid[]), true, now(), 'public_form'
       on conflict (contact_id, audience_id) do update set consented = true, consent_confirmed_at = now()`,
      [contact.id, tok.audience_ids],
    )
    await c.query(
      `update email_suppressions
          set cleared_at = now(), cleared_by = 'subscriber', clear_reason = 'Confirmed a new subscription'
        where email = $1 and cleared_at is null and reason = 'unsubscribed'`,
      [contact.email],
    )
    await c.query('update email_confirmation_tokens set used_at = now() where id = $1', [tok.id])
    await logConsentEvent(c, {
      contactId: contact.id, email: contact.email, type: 'confirmed', from: contact.status, to: 'subscribed', purpose: tok.purpose,
      source: tok.source, wordingVersion: tok.wording_version, evidence: `confirmation token record ${tok.id}`,
      audienceIds: tok.audience_ids, actor: 'subscriber', correlationId,
    })
    return { contactId: contact.id, email: contact.email, audienceIds: tok.audience_ids as string[] }
  })
}

// ---------------------------------------------------------------------------
// Unsubscribe, bounce, complaint, suppression
// ---------------------------------------------------------------------------
export type UnsubscribeInput = {
  contactId: string
  source: string
  campaignUuid?: string | null
  actor?: string
  correlationId?: string
}

/** Transaction aware unsubscribe, so imports can apply a withdrawal alongside their other writes. */
export async function unsubscribeInTx(c: PoolClient, input: UnsubscribeInput): Promise<{ email: string; changed: boolean }> {
  const contact = await lockContactById(c, input.contactId)
  if (!contact) throw new NotFoundError('Contact not found')
  const t = transition(contact.status, 'unsubscribe')
  if (!t.ok) throw new ConflictError(t.reason)
  if (t.changed) {
    await c.query(
      `update email_contacts set status = $2, needs_listmonk_sync = true, updated_at = now(), status_changed_at = now() where id = $1`,
      [contact.id, t.to],
    )
    // Withdrawn consent: any future subscription needs fresh confirmation.
    await c.query('update email_contact_audiences set consented = false, consent_confirmed_at = null where contact_id = $1', [contact.id])
  }
  await suppress(c, contact.email, 'unsubscribed', input.source)
  if (t.changed) {
    await logConsentEvent(c, {
      contactId: contact.id, email: contact.email, type: 'unsubscribed', from: contact.status, to: t.to, source: input.source,
      actor: input.actor ?? 'subscriber', correlationId: input.correlationId,
      metadata: input.campaignUuid ? { campaign_uuid: input.campaignUuid } : {},
    })
  }
  return { email: contact.email, changed: t.changed }
}

/** Always safe and idempotent. An unknown contact id is reported as not found without revealing anything. */
export async function unsubscribe(input: UnsubscribeInput): Promise<{ email: string; changed: boolean }> {
  return withTx((c) => unsubscribeInTx(c, input))
}

/**
 * Apply a bounce or complaint reported by a provider or by Listmonk. Works for
 * addresses Herufi has never stored, so the suppression list stays complete.
 */
export async function applyDeliveryEvent(input: {
  email: string
  type: 'bounce' | 'complaint'
  source: string
  detail?: string
  correlationId?: string
}): Promise<{ changed: boolean }> {
  const email = normaliseEmail(input.email)
  if (!isValidEmail(email)) throw new ValidationError('Invalid email address')
  return withTx(async (c) => {
    await suppress(c, email, input.type === 'bounce' ? 'bounced' : 'complained', input.source, input.detail)
    const contact = await lockContactByEmail(c, email)
    if (!contact) return { changed: false }
    const t = transition(contact.status, input.type === 'bounce' ? 'bounce' : 'complaint')
    if (!t.ok || !t.changed) return { changed: false }
    await c.query(
      `update email_contacts set status = $2, needs_listmonk_sync = true, updated_at = now(), status_changed_at = now() where id = $1`,
      [contact.id, t.to],
    )
    await c.query('update email_contact_audiences set consented = false, consent_confirmed_at = null where contact_id = $1', [contact.id])
    await logConsentEvent(c, {
      contactId: contact.id, email, type: input.type === 'bounce' ? 'bounced' : 'complained', from: contact.status, to: t.to,
      source: input.source, evidence: input.detail ?? null, actor: 'system', correlationId: input.correlationId,
    })
    return { changed: true }
  })
}

/** Record a suppression for an address regardless of whether Herufi stores it as a contact (used by reconciliation). */
export async function recordSuppression(
  email: string,
  reason: 'unsubscribed' | 'bounced' | 'complained' | 'manual' | 'invalid',
  source: string,
  detail?: string,
): Promise<void> {
  const e = normaliseEmail(email)
  if (!isValidEmail(e)) return
  await withTx((c) => suppress(c, e, reason, source, detail))
}

/** Block an address by hand. Stays blocked until an administrator clears it with a reason. */
export async function suppressContact(actor: string, contactId: string, reason: string, correlationId?: string): Promise<void> {
  const why = cleanText(reason, 300)
  if (!why || why.length < 5) throw new ValidationError('Give a reason of at least 5 characters')
  await withTx(async (c) => {
    const contact = await lockContactById(c, contactId)
    if (!contact) throw new NotFoundError('Contact not found')
    const t = transition(contact.status, 'suppress')
    if (!t.ok) throw new ConflictError(t.reason)
    await suppress(c, contact.email, 'manual', `admin:${actor}`, why)
    if (t.changed) {
      await c.query(`update email_contacts set status = $2, needs_listmonk_sync = true, updated_at = now(), status_changed_at = now() where id = $1`, [contact.id, t.to])
      await c.query('update email_contact_audiences set consented = false, consent_confirmed_at = null where contact_id = $1', [contact.id])
    }
    await logConsentEvent(c, { contactId, email: contact.email, type: 'suppressed', from: contact.status, to: t.to, evidence: why, actor, correlationId })
    await audit(c, { actor, action: 'contact.suppressed', entityType: 'contact', entityId: contactId, correlationId, detail: { reason: why } })
  })
}

/**
 * The only way back from bounced, complained, suppressed, invalid or unsubscribed
 * through an administrator. It returns the contact to "no consent": the person
 * must be subscribed again, either by confirming themselves or through recorded
 * evidence, before they can receive email.
 */
export async function clearSuppression(actor: string, contactId: string, reason: string, correlationId?: string): Promise<void> {
  const why = cleanText(reason, 300)
  if (!why || why.length < 10) throw new ValidationError('Explain why this is being cleared, in at least 10 characters')
  await withTx(async (c) => {
    const contact = await lockContactById(c, contactId)
    if (!contact) throw new NotFoundError('Contact not found')
    const t = transition(contact.status, 'clear_suppression')
    if (!t.ok) throw new ConflictError(t.reason)
    await c.query(
      `update email_contacts set status = $2, needs_listmonk_sync = true, updated_at = now(), status_changed_at = now() where id = $1`,
      [contact.id, t.to],
    )
    await c.query('update email_contact_audiences set consented = false, consent_confirmed_at = null where contact_id = $1', [contact.id])
    await c.query(
      `update email_suppressions set cleared_at = now(), cleared_by = $2, clear_reason = $3 where email = $1 and cleared_at is null`,
      [contact.email, actor, why],
    )
    await logConsentEvent(c, { contactId, email: contact.email, type: 'suppression_cleared', from: contact.status, to: t.to, evidence: why, actor, correlationId })
    await audit(c, { actor, action: 'contact.suppression_cleared', entityType: 'contact', entityId: contactId, correlationId, detail: { reason: why } })
  })
}

// ---------------------------------------------------------------------------
// Administrator: consent obtained outside the platform
// ---------------------------------------------------------------------------
export type ExternalConsentInput = {
  audienceIds: string[]
  /** ISO date (YYYY-MM-DD) on which the person gave consent. */
  date: string
  source: string
  purpose: string
  /** A reference to the proof, such as a form entry or a signed sheet. Required. */
  evidence: string
}

function validateExternalConsent(i: ExternalConsentInput): { date: string; source: string; purpose: string; evidence: string } {
  if (!i.audienceIds.length) throw new ValidationError('Choose the audience this consent covers')
  const date = /^\d{4}-\d{2}-\d{2}$/.test(i.date) ? i.date : ''
  const t = Date.parse(`${date}T00:00:00Z`)
  if (!date || Number.isNaN(t) || t > Date.now() + 86_400_000 || t < Date.parse('1990-01-01T00:00:00Z')) {
    throw new ValidationError('Give the date consent was given, as a past date')
  }
  const source = cleanText(i.source, 200)
  const purpose = cleanText(i.purpose, 300)
  const evidence = cleanText(i.evidence, 500)
  if (!source) throw new ValidationError('Say where the consent was given (the source)')
  if (!purpose) throw new ValidationError('Say what the person agreed to receive (the purpose)')
  if (!evidence) throw new ValidationError('Give a reference to the evidence of consent')
  return { date, source, purpose, evidence }
}

async function recordExternalConsentTx(c: PoolClient, actor: string, contactId: string, input: ExternalConsentInput, correlationId?: string): Promise<void> {
  const v = validateExternalConsent(input)
  const contact = await lockContactById(c, contactId)
  if (!contact) throw new NotFoundError('Contact not found')
  const t = transition(contact.status, 'record_external_consent')
  if (!t.ok) throw new ConflictError(t.reason)
  const suppression = await activeSuppression(c, contact.email)
  if (suppression) throw new ConflictError('This address is on the suppression list. Clear the suppression first.')
  const { rows: valid } = await c.query('select id from email_audiences where id = any($1::uuid[]) and archived_at is null', [input.audienceIds])
  if (valid.length !== input.audienceIds.length) throw new ValidationError('One of the chosen audiences does not exist or is archived')

  await c.query(
    `update email_contacts
        set status = 'subscribed', consent_given_at = $2::date, consent_source = $3, consent_purpose = $4,
            consent_wording_version = 'external-record', consent_evidence = $5, needs_listmonk_sync = true,
            updated_at = now() ${setStatusSql(t.changed)}
      where id = $1`,
    [contactId, v.date, v.source, v.purpose, v.evidence],
  )
  await c.query(
    `insert into email_contact_audiences (contact_id, audience_id, consented, consent_confirmed_at, added_via)
     select $1, unnest($2::uuid[]), true, $3::date, 'external_consent'
     on conflict (contact_id, audience_id) do update set consented = true, consent_confirmed_at = $3::date`,
    [contactId, input.audienceIds, v.date],
  )
  await logConsentEvent(c, {
    contactId, email: contact.email, type: 'external_consent_recorded', from: contact.status, to: 'subscribed', purpose: v.purpose,
    source: v.source, wordingVersion: 'external-record', evidence: v.evidence, audienceIds: input.audienceIds,
    actor, correlationId, metadata: { consent_date: v.date },
  })
}

/** Record verified evidence that someone consented elsewhere. Staff must supply every piece of evidence. */
export async function recordExternalConsent(actor: string, contactId: string, input: ExternalConsentInput, correlationId?: string): Promise<void> {
  await withTx(async (c) => {
    await recordExternalConsentTx(c, actor, contactId, input, correlationId)
    await audit(c, { actor, action: 'contact.external_consent_recorded', entityType: 'contact', entityId: contactId, correlationId, detail: { audienceIds: input.audienceIds, source: input.source } })
  })
}

/**
 * Accept the consent a spreadsheet claimed, for contacts whose claim is complete
 * (date, source, purpose and evidence all present). The administrator must name
 * the audiences it covers. Contacts with incomplete or missing claims are skipped
 * and reported, never subscribed.
 */
export async function acceptClaimedConsent(
  actor: string,
  contactIds: string[],
  audienceIds: string[],
  correlationId?: string,
): Promise<{ accepted: number; skipped: Array<{ contactId: string; reason: string }> }> {
  if (!contactIds.length) return { accepted: 0, skipped: [] }
  if (contactIds.length > 2000) throw new ValidationError('Accept at most 2000 contacts at a time')
  const skipped: Array<{ contactId: string; reason: string }> = []
  let accepted = 0
  for (const id of contactIds) {
    try {
      await withTx(async (c) => {
        const { rows } = await c.query('select claimed_consent from email_contacts where id = $1', [id])
        const claim = rows[0]?.claimed_consent
        if (!rows[0]) throw new NotFoundError('Contact not found')
        if (!claim || claim.status !== 'given' || !claim.complete) throw new ConflictError('The sheet does not hold a complete consent claim for this contact')
        await recordExternalConsentTx(c, actor, id, { audienceIds, date: claim.date, source: claim.source, purpose: claim.purpose, evidence: claim.evidence }, correlationId)
        await audit(c, { actor, action: 'contact.claimed_consent_accepted', entityType: 'contact', entityId: id, correlationId, detail: { audienceIds } })
      })
      accepted++
    } catch (err) {
      if (err instanceof AppError && err.status < 500) skipped.push({ contactId: id, reason: err.message })
      else throw err
    }
  }
  return { accepted, skipped }
}

export async function getConsentHistory(contactId: string, q: Queryable = db()) {
  const { rows } = await q.query(
    `select id, event_type, from_status, to_status, purpose, source, wording_version, evidence, audience_ids, actor, metadata, created_at
       from email_consent_events where contact_id = $1 order by created_at desc limit 200`,
    [contactId],
  )
  return rows
}

export type { ConsentEventType, Initiator }
