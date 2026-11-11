import { classify } from '@/lib/integrations/email/eligibility'
import { recipientFilter } from '@/lib/integrations/email/send-guard'
import type { ContactRecord } from '@/lib/domain/types'
import { appBaseUrl, sendMode } from '@/lib/server/env'
import { getPool, type Queryable } from '@/lib/server/db'
import type { Logger } from '@/lib/server/logger'
import { ensureListmonkList } from '@/lib/services/audiences'
import { applyDeliveryEvent, recordSuppression, suppressContact, unsubscribe } from '@/lib/services/consent'
import { finishJob, heartbeat, startJob } from '@/lib/services/sync-jobs'
import { ListmonkError, type ListmonkClient } from './client'
import { contactToAttribs, displayNameFor } from './mapper'
import type { ListmonkSubscriber } from './schemas'

/**
 * Keeping Listmonk in step with Herufi, and Herufi in step with what happens in Listmonk.
 *
 * Why this is careful: on Listmonk 6.2, adding a subscriber to a list with status
 * "confirmed" silently flips a subscription that was "unsubscribed" back to
 * "confirmed". So we never add blindly. Before touching a subscriber we read their
 * state and apply decidePush(), which adopts a Listmonk side unsubscribe into
 * Herufi rather than overwriting it.
 */

export type DesiredList = { listId: number; audienceId: string; consentConfirmedAt: string | null }

export type PushDecision =
  | { action: 'skip' }
  | { action: 'create'; listIds: number[] }
  | { action: 'update'; subscriberId: number; addListIds: number[]; removeListIds: number[] }
  | { action: 'adopt_unsubscribe'; subscriberId: number }
  | { action: 'adopt_blocklist'; subscriberId: number }

/** Pure decision: what to do for a contact Herufi considers eligible, given what Listmonk holds. */
export function decidePush(desired: DesiredList[], existing: ListmonkSubscriber | null): PushDecision {
  if (!existing) return desired.length ? { action: 'create', listIds: desired.map((d) => d.listId) } : { action: 'skip' }
  // A Listmonk blocklist wins until an administrator clears it in Herufi.
  if (existing.status === 'blocklisted') return { action: 'adopt_blocklist', subscriberId: existing.id }

  const addListIds: number[] = []
  for (const d of desired) {
    const sub = existing.lists.find((l) => l.id === d.listId)
    if (!sub) {
      addListIds.push(d.listId)
    } else if (sub.subscription_status === 'unconfirmed') {
      addListIds.push(d.listId)
    } else if (sub.subscription_status === 'unsubscribed') {
      // Unsubscribed in Listmonk. Only a consent given AFTER that moment counts as opting back in.
      const unsubAt = sub.subscription_updated_at ? Date.parse(sub.subscription_updated_at) : NaN
      const consentAt = d.consentConfirmedAt ? Date.parse(d.consentConfirmedAt) : NaN
      if (Number.isFinite(consentAt) && Number.isFinite(unsubAt) && consentAt > unsubAt) addListIds.push(d.listId)
      else return { action: 'adopt_unsubscribe', subscriberId: existing.id }
    }
  }
  const wanted = new Set(desired.map((d) => d.listId))
  const removeListIds = existing.lists
    .filter((l) => !wanted.has(l.id) && l.subscription_status !== 'unsubscribed')
    .map((l) => l.id)
  return { action: 'update', subscriberId: existing.id, addListIds, removeListIds }
}

export type SyncSummary = {
  skipped?: 'send_mode_disabled'
  examined: number
  created: number
  updated: number
  unsubscribedInListmonk: number
  blocklistedInListmonk: number
  adoptedUnsubscribes: number
  adoptedBlocklists: number
  notEligible: number
  raced: number
  failed: number
  remaining: number
}

const emptySummary = (): SyncSummary => ({
  examined: 0, created: 0, updated: 0, unsubscribedInListmonk: 0, blocklistedInListmonk: 0, adoptedUnsubscribes: 0,
  adoptedBlocklists: 0, notEligible: 0, raced: 0, failed: 0, remaining: 0,
})

type Candidate = ContactRecord & { updated_at_ms: string }

/** The reason an address is currently suppressed, or null. A plain unsubscribe is a reason too. */
async function activeSuppressionReason(q: Queryable, email: string): Promise<string | null> {
  const { rows } = await q.query('select reason from email_suppressions where email = $1 and cleared_at is null', [email])
  return rows[0]?.reason ?? null
}

async function desiredLists(q: Queryable, lm: ListmonkClient, contactId: string): Promise<DesiredList[]> {
  const { rows } = await q.query(
    `select a.*, m.consent_confirmed_at
       from email_contact_audiences m join email_audiences a on a.id = m.audience_id
      where m.contact_id = $1 and m.consented and a.archived_at is null
      order by a.name`,
    [contactId],
  )
  const out: DesiredList[] = []
  for (const a of rows) {
    out.push({ listId: await ensureListmonkList(q, lm, a), audienceId: a.id, consentConfirmedAt: a.consent_confirmed_at })
  }
  return out
}

/** Record the result, but leave the "needs sync" flag set if anything changed while we were working. */
async function markSynced(q: Queryable, c: Candidate, subscriberId: number | null): Promise<boolean> {
  const { rows } = await q.query(
    `update email_contacts
        set listmonk_subscriber_id = coalesce($2, listmonk_subscriber_id), listmonk_synced_at = now(),
            needs_listmonk_sync = case when date_trunc('milliseconds', updated_at) = $3::timestamptz then false else true end
      where id = $1 returning needs_listmonk_sync`,
    [c.id, subscriberId, c.updated_at_ms],
  )
  return rows[0]?.needs_listmonk_sync === false
}

/** Push (or pull back) one contact. Returns what happened, for the summary. */
async function pushContact(
  q: Queryable, lm: ListmonkClient, c: Candidate, allow: ((email: string) => boolean) | undefined, summary: SyncSummary,
): Promise<void> {
  const suppressionReason = await activeSuppressionReason(q, c.email)
  const suppressed = suppressionReason !== null
  const verdict = classify(
    { contactId: c.id, email: c.email, status: c.status, archived: !!c.archived_at, membershipConsented: true, globallySuppressed: suppressed },
    { allow },
  )

  // ---- not eligible: make sure Listmonk cannot send to them ---------------------------------
  if (!verdict.eligible) {
    summary.notEligible++
    const existing = c.listmonk_subscriber_id ? await lm.getSubscriber(c.listmonk_subscriber_id) : null
    if (existing && existing.status !== 'blocklisted') {
      // Blocklist only for genuine blocks. A plain unsubscribe must stay an unsubscribe, so the person can opt in again.
      const genuineBlock = ['bounced', 'complained', 'suppressed', 'invalid'].includes(c.status) || (suppressionReason !== null && suppressionReason !== 'unsubscribed')
      if (genuineBlock) {
        await lm.blocklistSubscriber(existing.id)
        summary.blocklistedInListmonk++
      } else {
        const active = existing.lists.filter((l) => l.subscription_status !== 'unsubscribed').map((l) => l.id)
        if (active.length) {
          await lm.setSubscriptions({ ids: [existing.id], action: 'unsubscribe', listIds: active })
          summary.unsubscribedInListmonk++
        }
      }
    }
    await markSynced(q, c, existing?.id ?? null)
    return
  }

  // ---- eligible: create or update ----------------------------------------------------------
  const desired = await desiredLists(q, lm, c.id)
  let existing = c.listmonk_subscriber_id ? await lm.getSubscriber(c.listmonk_subscriber_id) : null
  if (!existing) existing = await lm.findSubscriberByEmail(c.email)
  let decision = decidePush(desired, existing)
  const attribs = contactToAttribs(c, appBaseUrl())
  const name = displayNameFor(c)

  if (decision.action === 'create') {
    try {
      const created = await lm.createSubscriber({ email: c.email, name, attribs, lists: decision.listIds, preconfirm: true })
      summary.created++
      await markSynced(q, c, created.id)
      return
    } catch (err) {
      // Someone else created it between our lookup and our create. Fall through to the update path.
      if (!(err instanceof ListmonkError && err.upstreamStatusCode === 409)) throw err
      existing = await lm.findSubscriberByEmail(c.email)
      decision = decidePush(desired, existing)
    }
  }

  switch (decision.action) {
    case 'skip':
      await markSynced(q, c, existing?.id ?? null)
      return
    case 'create':
      throw new ListmonkError('Could not create or find the subscriber in Listmonk', true)
    case 'adopt_unsubscribe': {
      // They unsubscribed in Listmonk (for example through its own page). Honour it in Herufi.
      await unsubscribe({ contactId: c.id, source: 'listmonk', actor: 'system:listmonk' })
      summary.adoptedUnsubscribes++
      return
    }
    case 'adopt_blocklist': {
      await suppressContact('system:listmonk', c.id, 'Blocklisted in Listmonk')
      summary.adoptedBlocklists++
      return
    }
    case 'update': {
      await lm.patchSubscriber(decision.subscriberId, { name, status: 'enabled', attribs })
      if (decision.addListIds.length) {
        await lm.setSubscriptions({ ids: [decision.subscriberId], action: 'add', listIds: decision.addListIds, status: 'confirmed' })
      }
      if (decision.removeListIds.length) {
        await lm.setSubscriptions({ ids: [decision.subscriberId], action: 'unsubscribe', listIds: decision.removeListIds })
      }
      summary.updated++
      await markSynced(q, c, decision.subscriberId)
      return
    }
  }
}

/**
 * Push contacts flagged "needs sync" to Listmonk, a bounded batch at a time so it
 * fits a serverless time limit. Run it again (or from the schedule) until `remaining` is 0.
 * Does nothing at all while EMAIL_SEND_MODE is disabled.
 */
export async function syncToListmonk(opts: {
  lm: ListmonkClient
  actor: string
  correlationId?: string
  log?: Logger
  limit?: number
  onlyContactIds?: string[]
}): Promise<SyncSummary> {
  const mode = sendMode()
  const summary = emptySummary()
  if (mode === 'disabled') return { ...summary, skipped: 'send_mode_disabled' }

  const q = getPool()
  const job = await startJob(q, { kind: 'listmonk_sync', startedBy: opts.actor, correlationId: opts.correlationId })
  const allow = recipientFilter(mode)
  try {
    const { rows } = await q.query(
      `select *, date_trunc('milliseconds', updated_at) as updated_at_ms
         from email_contacts
        where needs_listmonk_sync and ($2::uuid[] is null or id = any($2::uuid[]))
        order by updated_at limit $1`,
      [Math.min(opts.limit ?? 200, 1000), opts.onlyContactIds ?? null],
    )
    for (const c of rows as Candidate[]) {
      summary.examined++
      try {
        await pushContact(q, opts.lm, c, allow, summary)
      } catch (err) {
        summary.failed++
        opts.log?.warn('contact sync failed', { contactId: c.id, error: err instanceof Error ? err.message : 'unknown' })
      }
      if (summary.examined % 25 === 0) await heartbeat(q, job.id, { ...summary })
    }
    const left = await q.query('select count(*)::int n from email_contacts where needs_listmonk_sync')
    summary.remaining = left.rows[0].n
    await finishJob(q, job.id, summary.failed ? 'partial' : 'succeeded', { ...summary })
    return summary
  } catch (err) {
    await finishJob(q, job.id, 'failed', { ...summary }, err instanceof Error ? err.message : 'sync failed').catch(() => undefined)
    throw err
  }
}

// ---------------------------------------------------------------------------
// Pulling Listmonk side changes back into Herufi
// ---------------------------------------------------------------------------
export type ReconcileSummary = {
  blocklistedSeen: number
  suppressed: number
  bouncesApplied: number
  unsubscribesAdopted: number
  lastBounceId: number
}

/**
 * Listmonk has no outbound webhooks, so we poll. This adopts, into Herufi:
 *  - subscribers Listmonk has blocklisted (suppressed, or bounced/complained when a bounce record says so)
 *  - hard bounces and complaints from Listmonk's bounce log
 *  - per list unsubscribes made through Listmonk's own pages
 * Herufi never overwrites any of these. Safe to run repeatedly.
 */
export async function reconcileFromListmonk(opts: {
  lm: ListmonkClient
  actor: string
  correlationId?: string
  log?: Logger
}): Promise<ReconcileSummary> {
  const q = getPool()
  const out: ReconcileSummary = { blocklistedSeen: 0, suppressed: 0, bouncesApplied: 0, unsubscribesAdopted: 0, lastBounceId: 0 }
  const job = await startJob(q, { kind: 'reconcile', startedBy: opts.actor, correlationId: opts.correlationId })
  try {
    // Where the last run stopped reading the bounce log.
    const prev = await q.query(`select stats from email_sync_jobs where kind = 'reconcile' and status in ('succeeded','partial') order by finished_at desc limit 1`)
    let sinceBounceId = Number(prev.rows[0]?.stats?.lastBounceId ?? 0)
    out.lastBounceId = sinceBounceId

    // 1. Bounce log (the bounce API exists only when bounce processing is enabled in Listmonk)
    const bounceByEmail = new Map<string, 'hard' | 'complaint'>()
    try {
      for (let page = 1; ; page++) {
        const { results } = await opts.lm.listBounces({ page, perPage: 500 })
        for (const b of results) {
          if (b.id <= sinceBounceId) continue
          out.lastBounceId = Math.max(out.lastBounceId, b.id)
          const type = b.type.toLowerCase()
          const email = b.email.toLowerCase()
          if (type === 'complaint') bounceByEmail.set(email, 'complaint')
          else if (type === 'hard' && bounceByEmail.get(email) !== 'complaint') bounceByEmail.set(email, 'hard')
        }
        if (results.length < 500) break
      }
    } catch (err) {
      opts.log?.warn('bounce log unavailable', { error: err instanceof Error ? err.message : 'unknown' })
    }
    for (const [email, type] of Array.from(bounceByEmail)) {
      const r = await applyDeliveryEvent({ email, type: type === 'hard' ? 'bounce' : 'complaint', source: 'listmonk bounce log', correlationId: opts.correlationId })
      if (r.changed) out.bouncesApplied++
    }

    // 2. Subscribers blocklisted in Listmonk
    for await (const page of opts.lm.iterateSubscribers({ query: "subscribers.status='blocklisted'" })) {
      for (const s of page) {
        out.blocklistedSeen++
        const email = s.email.toLowerCase()
        if (bounceByEmail.has(email)) continue // handled above
        const { rows } = await q.query('select id, status from email_contacts where email = $1', [email])
        if (rows[0]) {
          if (['subscribed', 'pending_confirmation', 'imported_pending_consent', 'unsubscribed'].includes(rows[0].status)) {
            await suppressContact('system:listmonk', rows[0].id, 'Blocklisted in Listmonk')
            out.suppressed++
          }
        } else {
          await recordSuppression(email, 'manual', 'listmonk', 'Blocklisted in Listmonk')
          out.suppressed++
        }
      }
    }

    // 3. Unsubscribes made through Listmonk's own pages, per list
    const { rows: lists } = await q.query('select id, listmonk_list_id from email_audiences where listmonk_list_id is not null')
    for (const l of lists) {
      for await (const page of opts.lm.iterateSubscribers({ listId: l.listmonk_list_id, subscriptionStatus: 'unsubscribed' })) {
        const unsubAt = new Map<string, number>()
        for (const s of page) {
          const sub = s.lists.find((x) => x.id === l.listmonk_list_id)
          unsubAt.set(s.email.toLowerCase(), sub?.subscription_updated_at ? Date.parse(sub.subscription_updated_at) : Date.now())
        }
        const { rows: ours } = await q.query(
          `select c.id, c.email, m.consent_confirmed_at
             from email_contacts c join email_contact_audiences m on m.contact_id = c.id and m.audience_id = $2
            where c.email = any($1::text[]) and c.status = 'subscribed' and m.consented`,
          [Array.from(unsubAt.keys()), l.id],
        )
        for (const c of ours) {
          const when = unsubAt.get(c.email) ?? 0
          const consentAt = c.consent_confirmed_at ? Date.parse(c.consent_confirmed_at) : 0
          if (when >= consentAt) {
            await unsubscribe({ contactId: c.id, source: 'listmonk', actor: 'system:listmonk', correlationId: opts.correlationId })
            out.unsubscribesAdopted++
          }
        }
      }
    }

    await finishJob(q, job.id, 'succeeded', { ...out })
    return out
  } catch (err) {
    await finishJob(q, job.id, 'failed', { ...out }, err instanceof Error ? err.message : 'reconcile failed').catch(() => undefined)
    throw err
  }
}
