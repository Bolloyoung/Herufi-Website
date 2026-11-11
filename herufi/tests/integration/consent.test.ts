import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  acceptClaimedConsent, applyDeliveryEvent, clearSuppression, confirmSubscription, getConsentHistory, InvalidTokenError,
  recordExternalConsent, requestSubscription, suppressContact, unsubscribe,
} from '@/lib/services/consent'
import { createAudience } from '@/lib/services/audiences'
import { withTx } from '@/lib/server/db'
import { createTestDatabase, sql } from './helpers'

let url = ''
let drop: () => Promise<void>
let aud: { id: string; slug: string }
let aud2: { id: string; slug: string }
let n = 0
const email = () => `person${++n}@example.org`
const contactOf = async (e: string) => (await sql(url, 'select * from email_contacts where email = $1', [e]))[0]
const memberships = (id: string) => sql(url, 'select a.slug, m.consented from email_contact_audiences m join email_audiences a on a.id = m.audience_id where m.contact_id = $1 order by a.slug', [id])
const events = (id: string) => sql(url, 'select event_type, from_status, to_status, actor from email_consent_events where contact_id = $1 order by created_at, id', [id])

async function subscribe(e: string, slugs = [aud.slug]) {
  const r = await requestSubscription({ email: e, audienceSlugs: slugs, source: 'test form' })
  if (r.outcome !== 'sent') throw new Error(`expected sent, got ${r.outcome}`)
  await confirmSubscription(r.token)
  return r
}

beforeAll(async () => {
  const db = await createTestDatabase()
  url = db.url
  drop = db.drop
  aud = await createAudience('admin@herufi.org', { name: 'Research updates', publicSignup: true })
  aud2 = await createAudience('admin@herufi.org', { name: 'Venture briefs', publicSignup: true })
})
afterAll(async () => { await drop?.() })

describe('double opt in', () => {
  it('a sign up never subscribes anyone until the link is confirmed', async () => {
    const e = email()
    const r = await requestSubscription({ email: ` ${e.toUpperCase()} `, firstName: 'Ann', audienceSlugs: [aud.slug], source: 'homepage' })
    expect(r.outcome).toBe('sent')
    const c = await contactOf(e)
    expect(c).toMatchObject({ status: 'pending_confirmation', first_name: 'Ann', consent_given_at: null })
    expect(await memberships(c.id)).toEqual([{ slug: aud.slug, consented: false }])
    expect(c.needs_listmonk_sync).toBe(false)
  })

  it('confirming subscribes the right contact and records the evidence', async () => {
    const e = email()
    const r = await requestSubscription({ email: e, audienceSlugs: [aud.slug, aud2.slug], source: 'homepage' })
    if (r.outcome !== 'sent') throw new Error('x')
    const done = await confirmSubscription(r.token)
    expect(done.email).toBe(e)
    const c = await contactOf(e)
    expect(c).toMatchObject({
      status: 'subscribed', consent_source: 'homepage', consent_wording_version: 'public-form-v1', needs_listmonk_sync: true,
    })
    expect(c.consent_given_at).toBeTruthy()
    expect(c.consent_purpose).toContain('Research updates')
    expect(c.consent_evidence).toContain('Double opt in')
    expect(await memberships(c.id)).toEqual([{ slug: aud2.slug, consented: true }, { slug: aud.slug, consented: true }].sort((a, b) => a.slug.localeCompare(b.slug)))
    expect((await events(c.id)).map((x) => x.event_type)).toEqual(['confirmation_requested', 'confirmed'])
  })

  it('a link works only once', async () => {
    const e = email()
    const r = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })
    if (r.outcome !== 'sent') throw new Error('x')
    await confirmSubscription(r.token)
    await expect(confirmSubscription(r.token)).rejects.toBeInstanceOf(InvalidTokenError)
  })

  it('an expired link is refused', async () => {
    const e = email()
    const r = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })
    if (r.outcome !== 'sent') throw new Error('x')
    await sql(url, "update email_confirmation_tokens set expires_at = now() - interval '1 minute' where contact_id = $1", [r.contactId])
    await expect(confirmSubscription(r.token)).rejects.toBeInstanceOf(InvalidTokenError)
    expect((await contactOf(e)).status).toBe('pending_confirmation')
  })

  it('only the newest link works when someone asks twice', async () => {
    const e = email()
    const a = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })
    const b = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })
    if (a.outcome !== 'sent' || b.outcome !== 'sent') throw new Error('x')
    await expect(confirmSubscription(a.token)).rejects.toBeInstanceOf(InvalidTokenError)
    await expect(confirmSubscription(b.token)).resolves.toMatchObject({ email: e })
  })

  it('stores only a hash of the token, never the token itself', async () => {
    const e = email()
    const r = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })
    if (r.outcome !== 'sent') throw new Error('x')
    const rows = await sql(url, 'select token_hash from email_confirmation_tokens where contact_id = $1', [r.contactId])
    expect(rows[0].token_hash).toMatch(/^[0-9a-f]{64}$/)
    expect(JSON.stringify(rows)).not.toContain(r.token)
  })

  it('two simultaneous confirmations of the same link succeed exactly once', async () => {
    const e = email()
    const r = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })
    if (r.outcome !== 'sent') throw new Error('x')
    const results = await Promise.allSettled([confirmSubscription(r.token), confirmSubscription(r.token), confirmSubscription(r.token)])
    expect(results.filter((x) => x.status === 'fulfilled')).toHaveLength(1)
    expect((await sql(url, "select count(*)::int n from email_consent_events where contact_id = $1 and event_type = 'confirmed'", [r.contactId]))[0].n).toBe(1)
  })

  it('rolls everything back if the confirmation cannot complete', async () => {
    const e = email()
    const r = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })
    if (r.outcome !== 'sent') throw new Error('x')
    // Poison the token with an audience that does not exist, so the membership insert fails mid transaction.
    await sql(url, "update email_confirmation_tokens set audience_ids = array['00000000-0000-4000-8000-000000000000']::uuid[] where contact_id = $1", [r.contactId])
    await expect(confirmSubscription(r.token)).rejects.toBeTruthy()
    const c = await contactOf(e)
    expect(c.status).toBe('pending_confirmation')
    expect(c.consent_given_at).toBeNull()
    const tok = await sql(url, 'select used_at from email_confirmation_tokens where contact_id = $1', [r.contactId])
    expect(tok[0].used_at).toBeNull()
    expect((await events(c.id)).map((x) => x.event_type)).toEqual(['confirmation_requested'])
  })

  it('rejects an invalid address and an unknown or non public audience', async () => {
    await expect(requestSubscription({ email: 'nope', audienceSlugs: [aud.slug], source: 'x' })).rejects.toMatchObject({ code: 'validation_error' })
    await expect(requestSubscription({ email: email(), audienceSlugs: ['nonexistent'], source: 'x' })).rejects.toMatchObject({ code: 'validation_error' })
    await expect(requestSubscription({ email: email(), audienceSlugs: [], source: 'x' })).rejects.toMatchObject({ code: 'validation_error' })
  })

  it('gives no signal about whether an address is already known', async () => {
    const known = email()
    await subscribe(known)
    const again = await requestSubscription({ email: known, audienceSlugs: [aud.slug], source: 'x' })
    expect(again).toEqual({ outcome: 'no_action', reason: 'already_subscribed' })
    // The route turns every outcome into the same response; here we just confirm no token leaks.
    expect(JSON.stringify(again)).not.toMatch(/token/i)
  })

  it('lets a subscriber add a second audience without losing the first', async () => {
    const e = email()
    await subscribe(e, [aud.slug])
    await subscribe(e, [aud2.slug])
    const c = await contactOf(e)
    expect(c.status).toBe('subscribed')
    expect((await memberships(c.id)).every((m) => m.consented)).toBe(true)
    expect(await memberships(c.id)).toHaveLength(2)
  })
})

describe('unsubscribe and suppression', () => {
  it('unsubscribing makes the contact ineligible at once and withdraws consent', async () => {
    const e = email()
    const { contactId } = await subscribe(e)
    const r = await unsubscribe({ contactId, source: 'email link', campaignUuid: 'camp-uuid-1' })
    expect(r).toEqual({ email: e, changed: true })
    const c = await contactOf(e)
    expect(c.status).toBe('unsubscribed')
    expect(c.needs_listmonk_sync).toBe(true)
    expect((await memberships(contactId)).every((m) => !m.consented)).toBe(true)
    expect((await sql(url, 'select reason from email_suppressions where email = $1 and cleared_at is null', [e]))[0].reason).toBe('unsubscribed')
    const ev = await sql(url, "select metadata from email_consent_events where contact_id = $1 and event_type = 'unsubscribed'", [contactId])
    expect(ev[0].metadata).toEqual({ campaign_uuid: 'camp-uuid-1' })
  })

  it('is idempotent and records one event', async () => {
    const e = email()
    const { contactId } = await subscribe(e)
    await unsubscribe({ contactId, source: 'a' })
    const second = await unsubscribe({ contactId, source: 'a' })
    expect(second.changed).toBe(false)
    expect((await events(contactId)).filter((x) => x.event_type === 'unsubscribed')).toHaveLength(1)
  })

  it('reports an unknown contact id', async () => {
    await expect(unsubscribe({ contactId: '00000000-0000-4000-8000-000000000000', source: 'x' })).rejects.toMatchObject({ status: 404 })
  })

  it('lets someone who unsubscribed opt back in themselves, which clears the unsubscribe record', async () => {
    const e = email()
    const { contactId } = await subscribe(e)
    await unsubscribe({ contactId, source: 'x' })
    const r = await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'again' })
    expect(r.outcome).toBe('sent')
    expect((await contactOf(e)).status).toBe('pending_confirmation')
    if (r.outcome === 'sent') await confirmSubscription(r.token)
    expect((await contactOf(e)).status).toBe('subscribed')
    expect(await sql(url, 'select 1 from email_suppressions where email = $1 and cleared_at is null', [e])).toHaveLength(0)
  })

  it('does not let a bounced address back in through the form', async () => {
    const e = email()
    const { contactId } = await subscribe(e)
    await applyDeliveryEvent({ email: e, type: 'bounce', source: 'listmonk', detail: 'hard bounce' })
    expect((await contactOf(e)).status).toBe('bounced')
    expect(await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })).toEqual({ outcome: 'no_action', reason: 'blocked' })
    expect((await memberships(contactId)).every((m) => !m.consented)).toBe(true)
  })

  it('records bounces and complaints even for addresses Herufi has never stored', async () => {
    const e = email()
    await applyDeliveryEvent({ email: e, type: 'complaint', source: 'provider' })
    expect(await contactOf(e)).toBeUndefined()
    expect((await sql(url, 'select reason from email_suppressions where email = $1', [e]))[0].reason).toBe('complained')
    // ...and a later sign up with that address is refused.
    expect(await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })).toEqual({ outcome: 'no_action', reason: 'blocked' })
  })

  it('escalates a bounce to a complaint but never the other way', async () => {
    const e = email()
    await subscribe(e)
    await applyDeliveryEvent({ email: e, type: 'bounce', source: 'p' })
    await applyDeliveryEvent({ email: e, type: 'complaint', source: 'p' })
    expect((await contactOf(e)).status).toBe('complained')
    await applyDeliveryEvent({ email: e, type: 'bounce', source: 'p' })
    expect((await contactOf(e)).status).toBe('complained')
    expect((await sql(url, 'select reason from email_suppressions where email = $1', [e]))[0].reason).toBe('complained')
  })

  it('a manual block upgrades a plain unsubscribe, so the person can no longer self subscribe', async () => {
    const e = email()
    const { contactId } = await subscribe(e)
    await unsubscribe({ contactId, source: 'x' })
    await suppressContact('admin@herufi.org', contactId, 'Requested removal by phone')
    expect((await sql(url, 'select reason from email_suppressions where email = $1', [e]))[0].reason).toBe('manual')
    expect(await requestSubscription({ email: e, audienceSlugs: [aud.slug], source: 'x' })).toEqual({ outcome: 'no_action', reason: 'blocked' })
  })

  it('clearing a suppression needs a reason, and returns the contact to no consent, never to subscribed', async () => {
    const e = email()
    const { contactId } = await subscribe(e)
    await suppressContact('admin@herufi.org', contactId, 'Spam trap hit')
    await expect(clearSuppression('admin@herufi.org', contactId, 'short')).rejects.toMatchObject({ code: 'validation_error' })
    await clearSuppression('admin@herufi.org', contactId, 'Confirmed by phone that the address is valid')
    const c = await contactOf(e)
    expect(c.status).toBe('imported_pending_consent')
    expect((await memberships(contactId)).every((m) => !m.consented)).toBe(true)
    expect(await sql(url, 'select 1 from email_suppressions where email = $1 and cleared_at is null', [e])).toHaveLength(0)
    const hist = await events(contactId)
    expect(hist[hist.length - 1]).toMatchObject({ event_type: 'suppression_cleared', actor: 'admin@herufi.org' })
  })

  it('refuses to clear a contact that is not suppressed', async () => {
    const { contactId } = await subscribe(email())
    await expect(clearSuppression('a@herufi.org', contactId, 'a long enough reason here')).rejects.toMatchObject({ status: 409 })
  })
})

describe('consent recorded by an administrator', () => {
  const evidence = { date: '2026-01-15', source: 'Nairobi summit sign up sheet', purpose: 'Research updates by email', evidence: 'Sheet page 3, row 12' }

  async function imported(e = email()) {
    await sql(url, "insert into email_contacts (email) values ($1)", [e])
    return (await contactOf(e)).id as string
  }

  it('subscribes only when every piece of evidence is supplied, and logs who recorded it', async () => {
    const id = await imported()
    await recordExternalConsent('admin@herufi.org', id, { audienceIds: [aud.id], ...evidence })
    const c = (await sql(url, 'select * from email_contacts where id = $1', [id]))[0]
    expect(c).toMatchObject({ status: 'subscribed', consent_source: evidence.source, consent_evidence: evidence.evidence, consent_wording_version: 'external-record' })
    expect(String(c.consent_given_at)).toContain('2026-01-15')
    expect((await events(id)).at(-1)).toMatchObject({ event_type: 'external_consent_recorded', actor: 'admin@herufi.org' })
  })

  it.each([
    ['no audience', { audienceIds: [] as string[] }],
    ['no date', { date: '' }],
    ['a future date', { date: '2999-01-01' }],
    ['a malformed date', { date: '15/01/2026' }],
    ['no source', { source: '  ' }],
    ['no purpose', { purpose: '' }],
    ['no evidence', { evidence: '' }],
  ])('refuses %s', async (_label, override) => {
    const id = await imported()
    await expect(recordExternalConsent('admin@herufi.org', id, { audienceIds: [aud.id], ...evidence, ...override })).rejects.toMatchObject({ code: 'validation_error' })
    expect((await sql(url, 'select status from email_contacts where id = $1', [id]))[0].status).toBe('imported_pending_consent')
  })

  it('cannot override an unsubscribe or a block with old evidence', async () => {
    const id = await imported()
    await sql(url, "update email_contacts set status = 'unsubscribed' where id = $1", [id])
    await expect(recordExternalConsent('a@herufi.org', id, { audienceIds: [aud.id], ...evidence })).rejects.toMatchObject({ status: 409 })
    const id2 = await imported()
    await applyDeliveryEvent({ email: (await sql(url, 'select email from email_contacts where id=$1', [id2]))[0].email, type: 'bounce', source: 'p' })
    await expect(recordExternalConsent('a@herufi.org', id2, { audienceIds: [aud.id], ...evidence })).rejects.toMatchObject({ status: 409 })
  })

  it('rejects an audience that does not exist', async () => {
    const id = await imported()
    await expect(recordExternalConsent('a@herufi.org', id, { audienceIds: ['00000000-0000-4000-8000-000000000000'], ...evidence })).rejects.toMatchObject({ code: 'validation_error' })
  })

  it('accepts a spreadsheet claim only when it is complete, and reports the rest as skipped', async () => {
    const good = await imported()
    const incomplete = await imported()
    const none = await imported()
    await sql(url, "update email_contacts set claimed_consent = $2::jsonb where id = $1", [good, JSON.stringify({ status: 'given', complete: true, date: '2025-05-05', source: 'Form', purpose: 'Updates', evidence: 'Ref 1', problems: [] })])
    await sql(url, "update email_contacts set claimed_consent = $2::jsonb where id = $1", [incomplete, JSON.stringify({ status: 'given', complete: false, date: null, source: 'Form', purpose: null, evidence: null, problems: ['x'] })])
    const r = await acceptClaimedConsent('admin@herufi.org', [good, incomplete, none], [aud.id])
    expect(r.accepted).toBe(1)
    expect(r.skipped.map((s) => s.contactId).sort()).toEqual([incomplete, none].sort())
    const statuses = await sql(url, 'select id, status from email_contacts where id = any($1::uuid[])', [[good, incomplete, none]])
    const by = Object.fromEntries(statuses.map((s: { id: string; status: string }) => [s.id, s.status]))
    expect(by).toEqual({ [good]: 'subscribed', [incomplete]: 'imported_pending_consent', [none]: 'imported_pending_consent' })
  })

  it('keeps an audit trail of consent changes in order', async () => {
    const e = email()
    const { contactId } = await subscribe(e)
    await unsubscribe({ contactId, source: 'x' })
    const hist = await getConsentHistory(contactId)
    expect(hist.map((h: { event_type: string }) => h.event_type)).toEqual(['unsubscribed', 'confirmed', 'confirmation_requested'])
    expect(hist.every((h: { actor: string }) => h.actor)).toBe(true)
  })
})

describe('transactions', () => {
  it('withTx rolls back every statement when one fails', async () => {
    const e = email()
    await expect(
      withTx(async (c) => {
        await c.query('insert into email_contacts (email) values ($1)', [e])
        await c.query('insert into email_contacts (email) values ($1)', [e]) // duplicate
      }),
    ).rejects.toBeTruthy()
    expect(await contactOf(e)).toBeUndefined()
  })
})
