import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { reconcileFromListmonk, syncToListmonk } from '@/lib/integrations/listmonk/sync'
import { verifyUnsubscribeToken } from '@/lib/server/tokens'
import { createAudience } from '@/lib/services/audiences'
import {
  cancelCampaign, createCampaign, getReview, refreshCampaign, sendTest, submitCampaign, updateCampaign, type CampaignRecord,
} from '@/lib/services/campaigns'
import { confirmSubscription, requestSubscription, unsubscribe } from '@/lib/services/consent'
import { createSender, setSenderVerified } from '@/lib/services/senders'
import { createTestDatabase, sql } from './helpers'
import { RUN, cleanupListmonk, configureListmonkEnv, lmClient, mailpitClear, mailpitMessages, testEmail, useMailpit, waitForMail } from './listmonk-helpers'

const lm = lmClient()
const ACTOR = 'admin@herufi.org'
let url = ''
let drop: () => Promise<void>
let aud: { id: string; slug: string }
let n = 100
const email = () => testEmail(++n)
const key = () => `k-${Math.random().toString(36).slice(2)}-${Date.now()}-abcdefgh`
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function subscribe(e: string, firstName?: string) {
  const r = await requestSubscription({ email: e, firstName, audienceSlugs: [aud.slug], source: 'it form' })
  if (r.outcome !== 'sent') throw new Error(r.outcome)
  await confirmSubscription(r.token)
  return r.contactId
}
async function newCampaign(name: string, patch: Parameters<typeof updateCampaign>[2] = {}) {
  const c = await createCampaign(ACTOR, { name: `it-${RUN} ${name}`, audienceId: aud.id })
  return updateCampaign(ACTOR, c.id, {
    subject: 'Briefing for {{first_name|colleague}}',
    bodyHtml: '<p>Hello {{first_name|there}},</p><p>Read <a href="https://herufi.org/blogs/x">the briefing</a>.</p>',
    ...patch,
  })
}
async function waitForStatus(id: string, wanted: string, timeoutMs = 90_000): Promise<CampaignRecord> {
  const t0 = Date.now()
  for (;;) {
    const c = await refreshCampaign(id, lm)
    if (c.status === wanted) return c
    if (Date.now() - t0 > timeoutMs) throw new Error(`Campaign stayed ${c.status}, wanted ${wanted}`)
    await sleep(700)
  }
}
const getC = async (id: string) => (await sql(url, 'select * from email_campaigns where id = $1', [id]))[0] as CampaignRecord

let s1: string, s2: string, uns: string, pend: string, imp: string
let s1Id: string

beforeAll(async () => {
  const d = await createTestDatabase(); url = d.url; drop = d.drop
  configureListmonkEnv('allowlist')
  await useMailpit()
  await mailpitClear()
  aud = await createAudience(ACTOR, { name: `it-${RUN} Briefings`, publicSignup: true })
  const sender = await createSender(ACTOR, { fromName: 'Herufi Research', fromEmail: 'hello@herufi.org', replyTo: 'hello@herufi.org', signatureHtml: '<p>The Herufi team</p>' })
  await setSenderVerified(ACTOR, sender.id, true)

  s1 = email(); s2 = email(); uns = email(); pend = email(); imp = email()
  s1Id = await subscribe(s1, 'Ann')
  await subscribe(s2)
  const unsId = await subscribe(uns)
  await unsubscribe({ contactId: unsId, source: 'email link' })
  await requestSubscription({ email: pend, audienceSlugs: [aud.slug], source: 'x' })
  await sql(url, "insert into email_contacts (email) values ($1)", [imp])
  await sql(url, "insert into email_contact_audiences (contact_id, audience_id, consented) select id, $2, false from email_contacts where email = $1", [imp, aud.id])
})
afterAll(async () => { await cleanupListmonk(); await mailpitClear(); await drop?.() })
beforeEach(() => { process.env.EMAIL_SEND_MODE = 'allowlist' })

describe('review before sending', () => {
  let c: CampaignRecord
  beforeAll(async () => { c = await newCampaign('Review') })

  it('counts who will receive it and explains everyone who will not', async () => {
    const r = await getReview(c.id)
    expect(r.recipients).toMatchObject({ total: 5, eligible: 2, excludedTotal: 3 })
    expect(Object.fromEntries(r.recipients.excluded.map((e) => [e.reason, e.count]))).toEqual({ unsubscribed: 1, pending_confirmation: 1, not_consented: 1 })
    expect(r.recipients.excluded.every((e) => e.label.length > 3)).toBe(true)
  })

  it('will not let an untested campaign go out, and says why', async () => {
    const r = await getReview(c.id)
    expect(r.canSubmit).toBe(false)
    expect(r.checks.find((k) => k.key === 'test_send')).toMatchObject({ ok: false, blocking: true })
  })

  it('renders a preview with sample values, the wrapper, the signature and no template syntax', async () => {
    const r = await getReview(c.id)
    expect(r.preview.subject).toBe('Briefing for Ann')
    expect(r.preview.html).toContain('Hello Ann,')
    expect(r.preview.html).toContain('The Herufi team')
    expect(r.preview.html).toContain('HERUFI')
    expect(r.preview.html).not.toContain('{{')
  })
})

describe('test email', () => {
  it('refuses a test to an address outside the allowlist, and sends nothing', async () => {
    const c = await newCampaign('Test refusal')
    await expect(sendTest(ACTOR, c.id, ['someone@gmail.com'], lm)).rejects.toMatchObject({ status: 403 })
    expect(await mailpitMessages()).toHaveLength(0)
  })

  it('is refused entirely while sending is disabled', async () => {
    const c = await newCampaign('Disabled')
    process.env.EMAIL_SEND_MODE = 'disabled'
    await expect(sendTest(ACTOR, c.id, [testEmail('qa')], lm)).rejects.toMatchObject({ status: 403 })
    await expect(submitCampaign(ACTOR, c.id, { mode: 'send_now', expectedEligibleCount: 2, confirm: true, idempotencyKey: key() }, lm)).rejects.toMatchObject({ status: 403 })
  })

  it('delivers a correctly addressed, personalised email with the right headers', async () => {
    await mailpitClear()
    const c = await newCampaign('Test delivery')
    const qa = testEmail(`qa${RUN}`)
    await sendTest(ACTOR, c.id, [qa], lm)
    const [m] = await waitForMail(1)
    expect(m.to).toEqual([qa])
    expect(m.from).toBe('hello@herufi.org')
    expect(m.fromName).toBe('Herufi Research')
    expect(m.replyTo).toEqual(['hello@herufi.org'])
    expect(m.subject).toBe('Briefing for colleague') // no first name on record: the fallback is used
    expect(m.html).toContain('Hello there,')
    expect(m.html).toContain('href="https://herufi.org/blogs/x"')
    expect(m.html).toContain('The Herufi team')
    expect(m.html).toContain('You are receiving this email because you subscribed')
    expect(m.text).toContain('Hello there,')
    expect(m.text).toContain('the briefing (https://herufi.org/blogs/x)')
    expect(m.listUnsubscribe).not.toBeNull()
    expect((await getC(c.id)).status).toBe('test')
    expect((await getC(c.id)).test_recipients).toEqual([qa])
    await mailpitClear()
  })

  it('goes back to untested when the content is edited', async () => {
    const c = await newCampaign('Edit resets')
    await sendTest(ACTOR, c.id, [testEmail('qa2')], lm)
    expect((await getC(c.id)).status).toBe('test')
    const edited = await updateCampaign(ACTOR, c.id, { subject: 'A different subject' })
    expect(edited).toMatchObject({ status: 'draft', test_sent_at: null })
    await mailpitClear()
  })
})

describe('content safety on save', () => {
  it('rejects template actions, unknown tags and unverified senders', async () => {
    const c = await newCampaign('Safety')
    await expect(updateCampaign(ACTOR, c.id, { bodyHtml: '<p>{{ env "LISTMONK_db__password" }}</p>' })).rejects.toMatchObject({ code: 'validation_error' })
    await expect(updateCampaign(ACTOR, c.id, { subject: '{{ .Subscriber.Email }}' })).rejects.toMatchObject({ code: 'validation_error' })
    await expect(updateCampaign(ACTOR, c.id, { bodyHtml: '<p>{{secret}}</p>' })).rejects.toMatchObject({ code: 'validation_error' })
    await expect(updateCampaign(ACTOR, c.id, { fromEmail: 'ceo@evil.example' })).rejects.toMatchObject({ code: 'validation_error' })
  })
  it('sanitises HTML before storing it', async () => {
    const c = await newCampaign('Sanitise')
    const u = await updateCampaign(ACTOR, c.id, { bodyHtml: '<p onclick="x()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">x</a>' })
    expect(u.body_html).not.toMatch(/script|onclick|javascript/i)
    expect(u.body_html).toContain('Hi')
  })
})

describe('sending', () => {
  let c: CampaignRecord
  const sentMail: Record<string, Awaited<ReturnType<typeof mailpitMessages>>[number]> = {}

  beforeAll(async () => {
    await mailpitClear()
    c = await newCampaign('Main send')
    await sendTest(ACTOR, c.id, [testEmail('qa3')], lm)
    await waitForMail(1)
    await mailpitClear()
  })

  it('needs an explicit confirmation and a request key', async () => {
    await expect(submitCampaign(ACTOR, c.id, { mode: 'send_now', expectedEligibleCount: 2, confirm: false, idempotencyKey: key() }, lm)).rejects.toMatchObject({ code: 'validation_error' })
    await expect(submitCampaign(ACTOR, c.id, { mode: 'send_now', expectedEligibleCount: 2, confirm: true, idempotencyKey: 'short' }, lm)).rejects.toMatchObject({ code: 'validation_error' })
    expect((await getC(c.id)).idempotency_key).toBeNull()
  })

  it('refuses when the audience changed since it was reviewed, and sends nothing', async () => {
    await expect(submitCampaign(ACTOR, c.id, { mode: 'send_now', expectedEligibleCount: 5, confirm: true, idempotencyKey: key() }, lm))
      .rejects.toMatchObject({ code: 'audience_changed' })
    const row = await getC(c.id)
    expect(row.idempotency_key).toBeNull() // released, so it can be retried after reviewing again
    expect(row.status).toBe('test')
    expect(await mailpitMessages()).toHaveLength(0)
  })

  it('sends to exactly the eligible people and nobody else', async () => {
    const k = key()
    const r = await submitCampaign(ACTOR, c.id, { mode: 'send_now', expectedEligibleCount: 2, confirm: true, idempotencyKey: k }, lm)
    expect(r).toMatchObject({ alreadySubmitted: false, eligible: 2 })
    expect(r.campaign.status).toBe('sending')

    const mails = await waitForMail(2)
    await sleep(2500) // give any stray message time to appear
    const all = await mailpitMessages()
    expect(all).toHaveLength(2)
    const recipients = all.flatMap((m) => m.to).sort()
    expect(recipients).toEqual([s1, s2].sort())
    for (const bad of [uns, pend, imp]) expect(recipients).not.toContain(bad)
    for (const m of mails) sentMail[m.to[0]] = m
  })

  it('personalises each email and falls back cleanly when a value is missing', async () => {
    expect(sentMail[s1].subject).toBe('Briefing for Ann')
    expect(sentMail[s1].html).toContain('Hello Ann,')
    expect(sentMail[s2].subject).toBe('Briefing for colleague')
    expect(sentMail[s2].html).toContain('Hello there,')
    expect(sentMail[s1].html).not.toContain('{{')
  })

  it('puts a working, signed Herufi unsubscribe link in every email, plus List-Unsubscribe', async () => {
    const campaignUuid = (await getC(c.id)).listmonk_campaign_uuid!
    for (const e of [s1, s2]) {
      const m = sentMail[e]
      const href = /href="(https:\/\/herufi\.test\/unsubscribe\?[^"]+)"/.exec(m.html)?.[1]
      expect(href, `unsubscribe link for ${e}`).toBeTruthy()
      const u = new URL(href!.replace(/&amp;/g, '&'))
      const contactId = verifyUnsubscribeToken(u.searchParams.get('t')!)
      expect(contactId).toBe((await sql(url, 'select id from email_contacts where email = $1', [e]))[0].id)
      expect(u.searchParams.get('c')).toBe(campaignUuid)
      expect(m.listUnsubscribe).not.toBeNull()
    }
  })

  it('is safe to submit twice: the same request key does nothing more, and a new key is refused', async () => {
    const row = await getC(c.id)
    const again = await submitCampaign(ACTOR, c.id, { mode: 'send_now', expectedEligibleCount: 2, confirm: true, idempotencyKey: row.idempotency_key! }, lm)
    expect(again.alreadySubmitted).toBe(true)
    await expect(submitCampaign(ACTOR, c.id, { mode: 'send_now', expectedEligibleCount: 2, confirm: true, idempotencyKey: key() }, lm)).rejects.toMatchObject({ code: 'already_submitted' })
    await sleep(1500)
    expect(await mailpitMessages()).toHaveLength(2)
  })

  it('reports status and statistics honestly: accepted not delivered, and no invented metrics', async () => {
    const done = await waitForStatus(c.id, 'sent')
    expect(done.stats).toMatchObject({ to_send: 2, sent: 2, bounces: 0, unsubscribes: 0, delivered: null })
    const row = await getC(c.id)
    expect(row.eligible_count).toBe(2)
    expect(row.excluded_summary).toEqual({ unsubscribed: 1, pending_confirmation: 1, not_consented: 1 })
    expect(row.submitted_by).toBe(ACTOR)
  })

  it('counts an unsubscribe from this campaign, and the person stops being eligible straight away', async () => {
    const m = sentMail[s1]
    const href = /href="(https:\/\/herufi\.test\/unsubscribe\?[^"]+)"/.exec(m.html)![1].replace(/&amp;/g, '&')
    const u = new URL(href)
    const contactId = verifyUnsubscribeToken(u.searchParams.get('t')!)!
    expect(contactId).toBe(s1Id)
    await unsubscribe({ contactId, source: 'email link', campaignUuid: u.searchParams.get('c') })
    const refreshed = await refreshCampaign(c.id, lm)
    expect(refreshed.stats.unsubscribes).toBe(1)
    const r = await getReview((await newCampaign('After unsubscribe')).id)
    expect(r.recipients.eligible).toBe(1)
  })

  it('records who sent it and what happened in the audit log', async () => {
    const log = await sql(url, "select action, actor, detail from email_audit_log where entity_id = $1 and action in ('campaign.test_sent','campaign.sent')", [c.id])
    expect(log.map((l: { action: string }) => l.action).sort()).toEqual(['campaign.sent', 'campaign.test_sent'])
    expect(log.every((l: { actor: string }) => l.actor === ACTOR)).toBe(true)
  })
})

describe('defence in depth before sending', () => {
  it('removes anyone who should not be on the Listmonk list, so they receive nothing', async () => {
    await mailpitClear()
    const target = await newCampaign('Leak defence')
    await sendTest(ACTOR, target.id, [testEmail('qa4')], lm)
    await waitForMail(1)
    await mailpitClear()
    // Simulate a leak: an unconsented contact ends up confirmed on the list inside Listmonk.
    const listId = (await sql(url, 'select listmonk_list_id from email_audiences where id = $1', [aud.id]))[0].listmonk_list_id
    const leaked = email()
    await lm.createSubscriber({ email: leaked, name: 'Leaked', attribs: {}, lists: [listId], preconfirm: true })
    expect((await lm.findSubscriberByEmail(leaked))!.lists[0].subscription_status).toBe('confirmed')

    const eligible = (await getReview(target.id)).recipients.eligible
    const r = await submitCampaign(ACTOR, target.id, { mode: 'send_now', expectedEligibleCount: eligible, confirm: true, idempotencyKey: key() }, lm)
    expect(r.removedFromList).toBeGreaterThanOrEqual(1)
    await waitForStatus(target.id, 'sent')
    await sleep(1500)
    const recipients = (await mailpitMessages()).flatMap((m) => m.to)
    expect(recipients).not.toContain(leaked)
    expect(recipients).toHaveLength(eligible)
    expect((await lm.findSubscriberByEmail(leaked))!.lists[0].subscription_status).toBe('unsubscribed')
  })

  it('syncs and respects an unsubscribe that happened inside Listmonk right before sending', async () => {
    await mailpitClear()
    const e = email()
    await subscribe(e)
    await syncToListmonk({ lm, actor: 't' })
    const target = await newCampaign('Late unsubscribe')
    await sendTest(ACTOR, target.id, [testEmail('qa5')], lm)
    await waitForMail(1); await mailpitClear()
    const listId = (await sql(url, 'select listmonk_list_id from email_audiences where id = $1', [aud.id]))[0].listmonk_list_id
    await lm.setSubscriptions({ ids: [(await lm.findSubscriberByEmail(e))!.id], action: 'unsubscribe', listIds: [listId] })
    // The reviewer saw the old count, which still included this person.
    const stale = (await getReview(target.id)).recipients.eligible
    await expect(submitCampaign(ACTOR, target.id, { mode: 'send_now', expectedEligibleCount: stale, confirm: true, idempotencyKey: key() }, lm)).rejects.toMatchObject({ code: 'audience_changed' })
    expect((await sql(url, 'select status from email_contacts where email = $1', [e]))[0].status).toBe('unsubscribed')
    expect(await mailpitMessages()).toHaveLength(0)
  })
})

describe('scheduling and cancelling', () => {
  it('schedules in Listmonk, sends nothing yet, and cancels cleanly', async () => {
    await mailpitClear()
    const sch = await newCampaign('Scheduled')
    await sendTest(ACTOR, sch.id, [testEmail('qa6')], lm)
    await waitForMail(1); await mailpitClear()
    const eligible = (await getReview(sch.id)).recipients.eligible
    const at = new Date(Date.now() + 30 * 60_000).toISOString()
    const r = await submitCampaign(ACTOR, sch.id, { mode: 'schedule', scheduledAt: at, expectedEligibleCount: eligible, confirm: true, idempotencyKey: key() }, lm)
    expect(r.campaign.status).toBe('scheduled')
    const row = await getC(sch.id)
    const lc = await lm.getCampaign(row.listmonk_campaign_id!)
    expect(lc!.status).toBe('scheduled')
    expect(Date.parse(lc!.send_at!)).toBeCloseTo(Date.parse(at), -4)
    await sleep(1500)
    expect(await mailpitMessages()).toHaveLength(0)

    const cancelled = await cancelCampaign(ACTOR, sch.id, lm)
    expect(cancelled.status).toBe('cancelled')
    expect((await lm.getCampaign(row.listmonk_campaign_id!))!.status).toBe('draft')
    await expect(cancelCampaign(ACTOR, sch.id, lm)).rejects.toMatchObject({ code: 'bad_state' })
  })

  it('refuses a time that is in the past or too soon', async () => {
    const c = await newCampaign('Bad schedule')
    await sendTest(ACTOR, c.id, [testEmail('qa7')], lm)
    await waitForMail(1); await mailpitClear()
    for (const when of [new Date(Date.now() - 3600_000), new Date(Date.now() + 60_000), new Date('nonsense')]) {
      await expect(submitCampaign(ACTOR, c.id, { mode: 'schedule', scheduledAt: when.toString() === 'Invalid Date' ? 'nonsense' : when.toISOString(), expectedEligibleCount: 1, confirm: true, idempotencyKey: key() }, lm)).rejects.toMatchObject({ code: 'validation_error' })
    }
  })
})

describe('Listmonk reconciliation does not disturb a normal state', () => {
  it('runs cleanly after all of the above', async () => {
    const r = await reconcileFromListmonk({ lm, actor: 'test' })
    expect(r.unsubscribesAdopted).toBeGreaterThanOrEqual(0)
  })
})
