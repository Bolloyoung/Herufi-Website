import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ListmonkClient } from '@/lib/integrations/listmonk/client'
import { reconcileFromListmonk, syncToListmonk } from '@/lib/integrations/listmonk/sync'
import { createAudience } from '@/lib/services/audiences'
import { applyDeliveryEvent, confirmSubscription, requestSubscription, unsubscribe } from '@/lib/services/consent'
import { archiveContact } from '@/lib/services/contacts'
import { createTestDatabase, devEnv, sql } from './helpers'
import { RUN, cleanupListmonk, configureListmonkEnv, lmClient, lmRaw, testEmail } from './listmonk-helpers'

let url = ''
let drop: () => Promise<void>
let aud: { id: string; slug: string; name: string }
let aud2: { id: string; slug: string; name: string }
const lm = lmClient()
let n = 0
const next = () => testEmail(++n)
const sync = (over: Partial<Parameters<typeof syncToListmonk>[0]> = {}) => syncToListmonk({ lm, actor: 'test', ...over })
const contact = async (e: string) => (await sql(url, 'select * from email_contacts where email = $1', [e]))[0]
const inLm = (e: string) => lm.findSubscriberByEmail(e)
const subStatus = async (e: string, listId: number) => (await inLm(e))?.lists.find((l) => l.id === listId)?.subscription_status

async function subscribe(e: string, slugs = [aud.slug]) {
  const r = await requestSubscription({ email: e, audienceSlugs: slugs, source: 'it form' })
  if (r.outcome !== 'sent') throw new Error(r.outcome)
  await confirmSubscription(r.token)
  return r.contactId
}
async function listId(a = aud) { return (await sql(url, 'select listmonk_list_id from email_audiences where id = $1', [a.id]))[0].listmonk_list_id as number }

beforeAll(async () => {
  const d = await createTestDatabase(); url = d.url; drop = d.drop
  configureListmonkEnv('allowlist')
  aud = await createAudience('t', { name: `it-${RUN} Research updates`, publicSignup: true })
  aud2 = await createAudience('t', { name: `it-${RUN} Venture briefs`, publicSignup: true })
})
afterAll(async () => { await cleanupListmonk(); await drop?.() })

describe('what is pushed to Listmonk', () => {
  it('never pushes contacts who have not consented, even when flagged for sync', async () => {
    const pending = next(); const imported = next()
    await requestSubscription({ email: pending, audienceSlugs: [aud.slug], source: 'x' })
    await sql(url, "insert into email_contacts (email, needs_listmonk_sync) values ($1, true)", [imported])
    await sql(url, "update email_contacts set needs_listmonk_sync = true where email = $1", [pending])
    const s = await sync()
    expect(s.notEligible).toBeGreaterThanOrEqual(2)
    expect(await inLm(pending)).toBeNull()
    expect(await inLm(imported)).toBeNull()
  })

  it('creates a confirmed subscriber with the right attributes for a confirmed contact', async () => {
    const e = next()
    const id = await subscribe(e)
    await sql(url, "update email_contacts set first_name = 'Ann', last_name = 'Lee', organisation = 'Acme', notes = 'PRIVATE NOTE' where id = $1", [id])
    const s = await sync()
    expect(s).toMatchObject({ created: 1, failed: 0 })
    const ls = await inLm(e)
    expect(ls).toMatchObject({ email: e, name: 'Ann Lee', status: 'enabled' })
    expect(ls!.attribs).toMatchObject({ first_name: 'Ann', organisation: 'Acme', herufi_contact_id: id })
    expect(String(ls!.attribs.unsubscribe_url)).toMatch(/^https:\/\/herufi\.test\/unsubscribe\?t=/)
    expect(JSON.stringify(ls!.attribs)).not.toContain('PRIVATE NOTE')
    expect(await subStatus(e, await listId())).toBe('confirmed')
    const c = await contact(e)
    expect(c).toMatchObject({ listmonk_subscriber_id: ls!.id, needs_listmonk_sync: false })
    expect(c.listmonk_synced_at).toBeTruthy()
  })

  it('creates the Listmonk list as private and double opt in, named after the audience', async () => {
    const lists = await lm.getLists()
    const l = lists.find((x) => x.name === `Herufi: ${aud.name}`)
    expect(l).toMatchObject({ type: 'private', optin: 'double' })
  })

  it('is idempotent: syncing again, even when re-flagged, never creates a duplicate subscriber', async () => {
    const e = next()
    const id = await subscribe(e)
    await sync()
    expect((await sync()).examined).toBe(0)
    for (let i = 0; i < 3; i++) {
      await sql(url, 'update email_contacts set needs_listmonk_sync = true where id = $1', [id])
      expect((await sync()).updated).toBe(1)
    }
    const found = await lm.querySubscribers({ query: `subscribers.email='${e}'` })
    expect(found.total).toBe(1)
  })

  it('adopts an existing Listmonk subscriber instead of failing when the stored id was lost', async () => {
    const e = next()
    const id = await subscribe(e)
    await sync()
    const before = (await contact(e)).listmonk_subscriber_id
    await sql(url, 'update email_contacts set listmonk_subscriber_id = null, needs_listmonk_sync = true where id = $1', [id])
    const s = await sync()
    expect(s).toMatchObject({ failed: 0, updated: 1, created: 0 })
    expect((await contact(e)).listmonk_subscriber_id).toBe(before)
  })

  it('subscribes a contact to several audiences', async () => {
    const e = next()
    await subscribe(e, [aud.slug, aud2.slug])
    await sync()
    expect(await subStatus(e, await listId(aud))).toBe('confirmed')
    expect(await subStatus(e, await listId(aud2))).toBe('confirmed')
  })

  it('removes them from one list when consent for that audience is withdrawn, leaving the other', async () => {
    const e = next()
    const id = await subscribe(e, [aud.slug, aud2.slug])
    await sync()
    await sql(url, 'update email_contact_audiences set consented = false where contact_id = $1 and audience_id = $2', [id, aud2.id])
    await sql(url, 'update email_contacts set needs_listmonk_sync = true where id = $1', [id])
    await sync()
    expect(await subStatus(e, await listId(aud))).toBe('confirmed')
    expect(await subStatus(e, await listId(aud2))).toBe('unsubscribed')
  })

  it('only pushes addresses on the test allowlist outside live mode', async () => {
    const outside = `it-${RUN}-outside@elsewhere.test`
    const id = await subscribe(outside)
    const s = await sync()
    expect(s.notEligible).toBeGreaterThanOrEqual(1)
    expect(await inLm(outside)).toBeNull()
    expect((await contact(outside)).listmonk_subscriber_id).toBeNull()
    void id
  })

  it('does nothing at all while sending is disabled', async () => {
    const e = next()
    await subscribe(e)
    process.env.EMAIL_SEND_MODE = 'disabled'
    try {
      expect(await sync()).toMatchObject({ skipped: 'send_mode_disabled', examined: 0 })
      expect(await inLm(e)).toBeNull()
      expect((await contact(e)).needs_listmonk_sync).toBe(true)
    } finally {
      process.env.EMAIL_SEND_MODE = 'allowlist'
    }
    await sync()
    expect(await inLm(e)).not.toBeNull()
  })
})

describe('keeping Listmonk safe when Herufi side status changes', () => {
  it('unsubscribes them in Listmonk without blocklisting', async () => {
    const e = next(); const id = await subscribe(e)
    await sync()
    await unsubscribe({ contactId: id, source: 'email link' })
    await sync()
    const ls = await inLm(e)
    expect(ls!.status).toBe('enabled')
    expect(await subStatus(e, await listId())).toBe('unsubscribed')
    expect((await contact(e)).needs_listmonk_sync).toBe(false)
  })

  it('blocklists bounced addresses in Listmonk', async () => {
    const e = next(); await subscribe(e)
    await sync()
    await applyDeliveryEvent({ email: e, type: 'bounce', source: 'test' })
    await sync()
    expect((await inLm(e))!.status).toBe('blocklisted')
  })

  it('takes archived contacts off the lists', async () => {
    const e = next(); const id = await subscribe(e)
    await sync()
    await archiveContact('admin@herufi.org', id, 'No longer relevant')
    await sync()
    expect(await subStatus(e, await listId())).toBe('unsubscribed')
  })

  it('keeps a pending unsubscribe pending if the contact changes while a sync is mid flight (no lost update)', async () => {
    const e = next(); const id = await subscribe(e)
    class Racing extends ListmonkClient {
      async createSubscriber(...a: Parameters<ListmonkClient['createSubscriber']>) {
        await unsubscribe({ contactId: id, source: 'email link during sync' }) // lands after the contact was read
        return super.createSubscriber(...a)
      }
    }
    const env = devEnv()
    const racing = new Racing({ baseUrl: 'http://127.0.0.1:9000', username: env.LISTMONK_API_USERNAME, token: env.LISTMONK_API_TOKEN })
    await syncToListmonk({ lm: racing, actor: 'test', onlyContactIds: [id] })
    // The subscriber was created as confirmed, but Herufi knows the unsubscribe still has to be pushed.
    expect(await subStatus(e, await listId())).toBe('confirmed')
    expect((await contact(e)).needs_listmonk_sync).toBe(true)
    await sync({ onlyContactIds: [id] })
    expect(await subStatus(e, await listId())).toBe('unsubscribed')
    expect((await contact(e)).needs_listmonk_sync).toBe(false)
  })
})

describe('never undoing what happened in Listmonk', () => {
  it('adopts a Listmonk unsubscribe into Herufi and does NOT re-subscribe them on the next sync', async () => {
    const e = next(); const id = await subscribe(e)
    await sync()
    const subscriber = (await inLm(e))!
    const lid = await listId()
    await lm.setSubscriptions({ ids: [subscriber.id], action: 'unsubscribe', listIds: [lid] }) // done on Listmonk's own page
    expect(await subStatus(e, lid)).toBe('unsubscribed')

    const r = await reconcileFromListmonk({ lm, actor: 'test' })
    expect(r.unsubscribesAdopted).toBeGreaterThanOrEqual(1)
    expect((await contact(e)).status).toBe('unsubscribed')
    expect((await sql(url, 'select reason from email_suppressions where email = $1 and cleared_at is null', [e]))[0].reason).toBe('unsubscribed')

    await sync()
    await sync()
    expect(await subStatus(e, lid)).toBe('unsubscribed') // never flipped back to confirmed
    void id
  })

  it('does the same even when Herufi has not reconciled first: the push itself refuses to re-subscribe', async () => {
    const e = next(); const id = await subscribe(e)
    await sync()
    const subscriber = (await inLm(e))!
    const lid = await listId()
    await lm.setSubscriptions({ ids: [subscriber.id], action: 'unsubscribe', listIds: [lid] })
    await sql(url, 'update email_contacts set needs_listmonk_sync = true where id = $1', [id])
    const s = await sync({ onlyContactIds: [id] })
    expect(s.adoptedUnsubscribes).toBe(1)
    expect(await subStatus(e, lid)).toBe('unsubscribed')
    expect((await contact(e)).status).toBe('unsubscribed')
  })

  it('honours a genuine later opt in: new double opt in consent after a Listmonk unsubscribe re-subscribes them', async () => {
    const e = next(); const id = await subscribe(e)
    await sync()
    const lid = await listId()
    await lm.setSubscriptions({ ids: [(await inLm(e))!.id], action: 'unsubscribe', listIds: [lid] })
    await reconcileFromListmonk({ lm, actor: 'test' })
    expect((await contact(e)).status).toBe('unsubscribed')
    await new Promise((r) => setTimeout(r, 30)) // ensure the new consent is strictly later
    await subscribe(e)
    expect((await contact(e)).status).toBe('subscribed')
    await sync({ onlyContactIds: [id] })
    expect(await subStatus(e, lid)).toBe('confirmed')
  })

  it('adopts a Listmonk blocklist as a suppression and does not undo it', async () => {
    const e = next(); const id = await subscribe(e)
    await sync()
    await lm.blocklistSubscriber((await inLm(e))!.id)
    await reconcileFromListmonk({ lm, actor: 'test' })
    expect((await contact(e)).status).toBe('suppressed')
    await sync({ onlyContactIds: [id] })
    expect((await inLm(e))!.status).toBe('blocklisted')
  })

  it('records a suppression for a blocklisted address Herufi has never stored', async () => {
    const e = next()
    const created = await lm.createSubscriber({ email: e, name: 'Stranger', attribs: {}, lists: [], preconfirm: false })
    await lm.blocklistSubscriber(created.id)
    await reconcileFromListmonk({ lm, actor: 'test' })
    expect(await contact(e)).toBeUndefined()
    expect((await sql(url, 'select reason, source from email_suppressions where email = $1', [e]))[0]).toMatchObject({ reason: 'manual', source: 'listmonk' })
  })

  it('can run reconciliation twice without changing anything the second time', async () => {
    await reconcileFromListmonk({ lm, actor: 'test' })
    const before = await sql(url, 'select count(*)::int n from email_consent_events')
    const r = await reconcileFromListmonk({ lm, actor: 'test' })
    expect(r.unsubscribesAdopted).toBe(0)
    expect(await sql(url, 'select count(*)::int n from email_consent_events')).toEqual(before)
  })
})

describe('Listmonk connectivity', () => {
  it('authenticates and reports health', async () => {
    expect(await lm.checkAuthenticated()).toBe(true)
  })
  it('rejects wrong credentials with a clear, non revealing error', async () => {
    const bad = new ListmonkClient({ baseUrl: 'http://127.0.0.1:9000', username: 'herufi_api', token: 'wrong-token-value' })
    const err = (await bad.checkAuthenticated().catch((e) => e)) as Error
    expect(err.message).toMatch(/rejected the API credentials/)
    expect(err.message).not.toContain('wrong-token-value')
  })
  it('exists as a public health endpoint for the hosting platform', async () => {
    const res = await fetch('http://127.0.0.1:9000/health')
    expect(res.status).toBe(200)
    expect(await lmRaw('GET', '/api/health')).toEqual({ data: true })
  })
})
