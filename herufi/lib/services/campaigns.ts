import { cleanDisplayName, cleanHeaderText, cleanText, isValidEmail, normaliseEmail } from '@/lib/domain/text'
import type { CampaignStatus } from '@/lib/domain/types'
import { buildCampaignBody, renderMergePreview, sanitizeEmailHtml, validateTemplateSyntax } from '@/lib/integrations/email/content'
import { EXCLUSION_LABELS, summarise, type EligibilitySummary, type Exclusion, type RecipientInput } from '@/lib/integrations/email/eligibility'
import { assertAllCanReceive, assertCanSend, recipientFilter } from '@/lib/integrations/email/send-guard'
import { ensureWrapperTemplate } from '@/lib/integrations/listmonk'
import { ListmonkError, type ListmonkCampaignInput, type ListmonkClient } from '@/lib/integrations/listmonk/client'
import { buildCampaignInput, renderPreviewDocument } from '@/lib/integrations/listmonk/mapper'
import { reconcileFromListmonk, syncToListmonk } from '@/lib/integrations/listmonk/sync'
import { db, getPool, withTx, type Queryable } from '@/lib/server/db'
import { appBaseUrl, sendMode, requireTestSendBeforeCampaign, type SendMode } from '@/lib/server/env'
import { AppError, ConflictError, NotFoundError, ValidationError } from '@/lib/server/errors'
import type { Logger } from '@/lib/server/logger'
import { audit } from './audit'
import { ensureListmonkList, getAudience } from './audiences'
import { getVerifiedSender } from './senders'
import { getTemplate } from './templates'

export type CampaignRecord = {
  id: string
  name: string
  subject: string
  preview_text: string | null
  from_name: string | null
  from_email: string | null
  reply_to: string | null
  audience_id: string | null
  template_id: string | null
  body_html: string
  body_text: string | null
  status: CampaignStatus
  listmonk_campaign_id: number | null
  listmonk_campaign_uuid: string | null
  scheduled_at: string | null
  timezone: string
  eligible_count: number | null
  excluded_summary: Record<string, number> | null
  test_sent_at: string | null
  test_recipients: string[]
  submitted_at: string | null
  submitted_by: string | null
  idempotency_key: string | null
  stats: CampaignStats
  last_reconciled_at: string | null
  last_error: string | null
  created_by: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export type CampaignStats = {
  to_send?: number
  /** Messages Listmonk handed to the mail server. This is "accepted", not "delivered". */
  sent?: number
  views?: number
  clicks?: number
  bounces?: number
  /** Unsubscribes recorded by Herufi from this campaign's unsubscribe link. */
  unsubscribes?: number
  /** Delivery confirmations are not available from Listmonk. Always null. */
  delivered?: null
}

const EDITABLE: ReadonlySet<CampaignStatus> = new Set<CampaignStatus>(['draft', 'test', 'failed'])
const LIST_COLUMNS =
  `c.id, c.name, c.subject, c.status, c.audience_id, c.eligible_count, c.scheduled_at, c.timezone, c.stats, c.submitted_at,
   c.test_sent_at, c.last_error, c.last_reconciled_at, c.created_at, c.updated_at, a.name as audience_name`

export async function listCampaigns(
  filter: { q?: string; status?: CampaignStatus; page?: number; perPage?: number } = {},
  q: Queryable = db(),
) {
  const perPage = Math.min(Math.max(filter.perPage ?? 25, 1), 100)
  const page = Math.max(filter.page ?? 1, 1)
  const term = filter.q?.trim().slice(0, 100)
  const { rows } = await q.query(
    `select ${LIST_COLUMNS}, count(*) over()::int as total_rows
       from email_campaigns c left join email_audiences a on a.id = c.audience_id
      where c.archived_at is null
        and ($1::text is null or c.status = $1)
        and ($2::text is null or c.name ilike $2 or c.subject ilike $2)
      order by c.updated_at desc limit $3 offset $4`,
    [filter.status ?? null, term ? `%${term.replace(/[\\%_]/g, (m) => `\\${m}`)}%` : null, perPage, (page - 1) * perPage],
  )
  return { rows: rows.map(({ total_rows: _t, ...r }: Record<string, unknown>) => r), total: rows[0]?.total_rows ?? 0, page, perPage }
}

export async function getCampaign(q: Queryable, id: string): Promise<CampaignRecord> {
  const { rows } = await q.query('select * from email_campaigns where id = $1 and archived_at is null', [id])
  if (!rows[0]) throw new NotFoundError('Campaign not found')
  return rows[0]
}

export async function createCampaign(actor: string, input: { name: string; audienceId?: string | null; templateId?: string | null }, correlationId?: string): Promise<CampaignRecord> {
  const name = cleanHeaderText(input.name, 200)
  if (!name) throw new ValidationError('Give the campaign a name')
  const { defaultSenderFields } = await import('./senders')
  return withTx(async (c) => {
    const sender = await defaultSenderFields(c)
    if (input.audienceId) await getAudience(c, input.audienceId)
    let subject = '', preview: string | null = null, body = ''
    if (input.templateId) {
      const t = await getTemplate(c, input.templateId)
      subject = t.subject ?? ''
      preview = t.preview_text
      body = t.body_html
    }
    const { rows } = await c.query(
      `insert into email_campaigns (name, subject, preview_text, from_name, from_email, reply_to, audience_id, template_id, body_html, created_by)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *`,
      [name, subject, preview, sender.fromName, sender.fromEmail, sender.replyTo, input.audienceId ?? null, input.templateId ?? null, body, actor],
    )
    await audit(c, { actor, action: 'campaign.created', entityType: 'campaign', entityId: rows[0].id, correlationId, detail: { name } })
    return rows[0]
  })
}

export type CampaignPatch = Partial<{
  name: string
  subject: string
  previewText: string | null
  fromName: string
  fromEmail: string
  replyTo: string | null
  audienceId: string | null
  bodyHtml: string
  bodyText: string | null
  scheduledAt: string | null
  timezone: string
}>

function validTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

export async function updateCampaign(actor: string, id: string, patch: CampaignPatch, correlationId?: string): Promise<CampaignRecord> {
  return withTx(async (c) => {
    const { rows } = await c.query('select * from email_campaigns where id = $1 and archived_at is null for update', [id])
    const cur = rows[0] as CampaignRecord | undefined
    if (!cur) throw new NotFoundError('Campaign not found')
    if (!EDITABLE.has(cur.status)) throw new ConflictError(`A ${cur.status} campaign cannot be edited`, 'not_editable')

    const sets: string[] = []
    const vals: unknown[] = [id]
    const set = (col: string, v: unknown) => { vals.push(v); sets.push(`${col} = $${vals.length}`) }
    let contentChanged = false

    if (patch.name !== undefined) {
      const name = cleanHeaderText(patch.name, 200)
      if (!name) throw new ValidationError('Give the campaign a name')
      set('name', name)
    }
    if (patch.subject !== undefined) {
      const subject = cleanHeaderText(patch.subject, 200)
      const problems = validateTemplateSyntax(subject)
      if (problems.length) throw new ValidationError(`Subject: ${problems[0]}`, problems)
      set('subject', subject); contentChanged = true
    }
    if (patch.previewText !== undefined) {
      const pt = patch.previewText ? cleanHeaderText(patch.previewText, 150) : null
      const problems = pt ? validateTemplateSyntax(pt) : []
      if (problems.length) throw new ValidationError(`Preview text: ${problems[0]}`, problems)
      set('preview_text', pt); contentChanged = true
    }
    if (patch.fromName !== undefined) {
      const n = cleanDisplayName(patch.fromName)
      if (!n) throw new ValidationError('Enter the name recipients will see')
      set('from_name', n); contentChanged = true
    }
    if (patch.fromEmail !== undefined) {
      const e = normaliseEmail(patch.fromEmail)
      if (!isValidEmail(e)) throw new ValidationError('Enter a valid sender email address')
      if (!(await getVerifiedSender(c, e))) throw new ValidationError('This sender address is not verified. Add it under Senders and confirm the domain checks first.')
      set('from_email', e); contentChanged = true
    }
    if (patch.replyTo !== undefined) {
      const r = patch.replyTo ? normaliseEmail(patch.replyTo) : null
      if (r && !isValidEmail(r)) throw new ValidationError('Enter a valid reply to address')
      set('reply_to', r); contentChanged = true
    }
    if (patch.audienceId !== undefined) {
      if (patch.audienceId) {
        const a = await getAudience(c, patch.audienceId)
        if (a.archived_at) throw new ValidationError('That audience is archived')
      }
      set('audience_id', patch.audienceId); contentChanged = true
    }
    if (patch.bodyHtml !== undefined) {
      const clean = sanitizeEmailHtml(patch.bodyHtml)
      const problems = validateTemplateSyntax(clean)
      if (problems.length) throw new ValidationError(problems[0], problems)
      set('body_html', clean); contentChanged = true
    }
    if (patch.bodyText !== undefined) {
      const t = patch.bodyText ? patch.bodyText.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').slice(0, 50_000) : null
      const problems = t ? validateTemplateSyntax(t) : []
      if (problems.length) throw new ValidationError(`Plain text: ${problems[0]}`, problems)
      set('body_text', t); contentChanged = true
    }
    if (patch.timezone !== undefined) {
      if (!validTimezone(patch.timezone)) throw new ValidationError('That time zone is not recognised')
      set('timezone', patch.timezone)
    }
    if (patch.scheduledAt !== undefined) {
      if (patch.scheduledAt) {
        const t = Date.parse(patch.scheduledAt)
        if (Number.isNaN(t)) throw new ValidationError('That date and time is not valid')
      }
      set('scheduled_at', patch.scheduledAt)
    }
    if (!sets.length) return cur
    if (contentChanged) { sets.push("status = 'draft'", 'test_sent_at = null') }
    sets.push('updated_at = now()')
    const { rows: out } = await c.query(`update email_campaigns set ${sets.join(', ')} where id = $1 returning *`, vals)
    await audit(c, { actor, action: 'campaign.updated', entityType: 'campaign', entityId: id, correlationId, detail: { fields: Object.keys(patch) } })
    return out[0]
  })
}

export async function archiveCampaign(actor: string, id: string, correlationId?: string): Promise<void> {
  await withTx(async (c) => {
    const cur = await getCampaign(c, id)
    if (!['draft', 'test', 'failed', 'cancelled', 'sent'].includes(cur.status)) throw new ConflictError('Cancel the campaign before removing it', 'not_removable')
    await c.query('update email_campaigns set archived_at = now(), updated_at = now() where id = $1', [id])
    await audit(c, { actor, action: 'campaign.archived', entityType: 'campaign', entityId: id, correlationId })
  })
}

// ---------------------------------------------------------------------------
// Eligibility and review
// ---------------------------------------------------------------------------
export async function loadAudienceRecipients(q: Queryable, audienceId: string): Promise<RecipientInput[]> {
  const { rows } = await q.query(
    `select c.id as "contactId", c.email, c.status, (c.archived_at is not null) as archived, m.consented as "membershipConsented",
            exists (select 1 from email_suppressions s where s.email = c.email and s.cleared_at is null) as "globallySuppressed"
       from email_contact_audiences m join email_contacts c on c.id = m.contact_id
      where m.audience_id = $1`,
    [audienceId],
  )
  return rows
}

export type ReviewCheck = { key: string; ok: boolean; blocking: boolean; message: string }

export type CampaignReview = {
  campaign: Pick<CampaignRecord, 'id' | 'name' | 'subject' | 'preview_text' | 'from_name' | 'from_email' | 'reply_to' | 'status' | 'scheduled_at' | 'timezone' | 'test_sent_at' | 'test_recipients'>
  audience: { id: string; name: string } | null
  recipients: { total: number; eligible: number; excluded: Array<{ reason: Exclusion; label: string; count: number }>; excludedTotal: number }
  sendMode: SendMode
  checks: ReviewCheck[]
  canSubmit: boolean
  preview: { html: string; text: string; subject: string }
}

const SAMPLE = { first_name: 'Ann', last_name: 'Lee', name: 'Ann Lee', organisation: 'Example Foundation', job_title: 'Programme Officer', country: 'Kenya', organisation_type: 'Foundation' } as const

export async function getReview(id: string, q: Queryable = db()): Promise<CampaignReview> {
  const c = await getCampaign(q, id)
  const audience = c.audience_id ? await getAudience(q, c.audience_id) : null
  const summary: EligibilitySummary = audience ? summarise(await loadAudienceRecipients(q, audience.id), { allow: recipientFilter() }) : { total: 0, eligible: [], excluded: [], excludedCounts: {} }
  const sender = c.from_email ? await getVerifiedSender(q, c.from_email) : null
  const { rows: sigRows } = c.from_email ? await q.query('select signature_html from email_sender_identities where from_email = $1', [c.from_email]) : { rows: [] }
  const built = buildCampaignBody({ html: c.body_html, signatureHtml: sigRows[0]?.signature_html, textOverride: c.body_text })
  const mode = sendMode()
  const requireTest = requireTestSendBeforeCampaign()

  const checks: ReviewCheck[] = [
    { key: 'subject', ok: !!c.subject.trim(), blocking: true, message: c.subject.trim() ? 'Subject is set' : 'Add a subject line' },
    { key: 'body', ok: !!c.body_html.replace(/<[^>]+>/g, '').trim(), blocking: true, message: c.body_html.trim() ? 'Email body has content' : 'Write the email body' },
    { key: 'audience', ok: !!audience, blocking: true, message: audience ? `Sending to ${audience.name}` : 'Choose an audience' },
    { key: 'sender', ok: !!sender, blocking: true, message: sender ? 'Sender address is verified' : 'Choose a verified sender address' },
    { key: 'reply_to', ok: !!c.reply_to, blocking: false, message: c.reply_to ? `Replies go to ${c.reply_to}` : 'No reply to address is set' },
    { key: 'merge_tags', ok: built.problems.length === 0, blocking: true, message: built.problems[0] ?? 'Merge tags are valid' },
    { key: 'recipients', ok: summary.eligible.length > 0, blocking: true, message: summary.eligible.length ? `${summary.eligible.length} eligible recipients` : 'No eligible recipients in this audience' },
    {
      key: 'test_send', ok: !!c.test_sent_at, blocking: requireTest,
      message: c.test_sent_at ? `Test email queued ${c.test_sent_at.slice(0, 16).replace('T', ' ')} UTC. Check your inbox before sending.` : 'Send yourself a test email first',
    },
    { key: 'send_mode', ok: mode !== 'disabled', blocking: true, message: mode === 'disabled' ? 'Sending is turned off in this environment' : mode === 'allowlist' ? 'Test environment: only allowlisted addresses will receive email' : 'Live sending is on' },
  ]
  if (c.scheduled_at) {
    const future = Date.parse(c.scheduled_at) >= Date.now() + 5 * 60_000
    checks.push({ key: 'schedule', ok: future, blocking: true, message: future ? `Scheduled for ${c.scheduled_at.slice(0, 16).replace('T', ' ')} UTC` : 'The scheduled time must be at least 5 minutes from now' })
  }

  const excluded = (Object.entries(summary.excludedCounts) as Array<[Exclusion, number]>)
    .map(([reason, count]) => ({ reason, label: EXCLUSION_LABELS[reason], count }))
    .sort((a, b) => b.count - a.count)
  const html = renderPreviewDocument({ title: renderMergePreview(c.subject, SAMPLE), bodyHtml: renderMergePreview(built.problems.length ? sanitizeEmailHtml(c.body_html) : sanitizeEmailHtml(c.body_html) + (sigRows[0]?.signature_html ?? ''), SAMPLE) })
  return {
    campaign: { id: c.id, name: c.name, subject: c.subject, preview_text: c.preview_text, from_name: c.from_name, from_email: c.from_email, reply_to: c.reply_to, status: c.status, scheduled_at: c.scheduled_at, timezone: c.timezone, test_sent_at: c.test_sent_at, test_recipients: c.test_recipients },
    audience: audience ? { id: audience.id, name: audience.name } : null,
    recipients: { total: summary.total, eligible: summary.eligible.length, excluded, excludedTotal: summary.excluded.length },
    sendMode: mode,
    checks,
    canSubmit: checks.every((x) => x.ok || !x.blocking) && EDITABLE.has(c.status),
    preview: { html, text: renderMergePreview(built.text.startsWith('{{') || built.problems.length ? c.body_text ?? '' : built.text.replace(/\{\{ if [^}]*\}\}\{\{ [^}]*\}\}\{\{ else \}\}([^{]*)\{\{ end \}\}/g, '$1'), SAMPLE), subject: renderMergePreview(c.subject, SAMPLE) },
  }
}

// ---------------------------------------------------------------------------
// Listmonk campaign construction
// ---------------------------------------------------------------------------
async function buildInput(q: Queryable, lm: ListmonkClient, c: CampaignRecord, sendAt?: Date | null): Promise<{ input: ListmonkCampaignInput; listId: number }> {
  if (!c.audience_id) throw new ValidationError('Choose an audience')
  if (!c.from_email || !(await getVerifiedSender(q, c.from_email))) throw new ValidationError('Choose a verified sender address')
  const audience = await getAudience(q, c.audience_id)
  const listId = await ensureListmonkList(q, lm, audience)
  const { rows } = await q.query('select signature_html from email_sender_identities where from_email = $1', [c.from_email])
  const built = buildCampaignBody({ html: c.body_html, signatureHtml: rows[0]?.signature_html, textOverride: c.body_text })
  if (built.problems.length) throw new ValidationError(built.problems[0], built.problems)
  const templateId = await ensureWrapperTemplate(lm)
  const input = buildCampaignInput({
    name: `${c.name} (${c.id.slice(0, 8)})`, subject: c.subject, previewText: c.preview_text, fromName: c.from_name ?? 'Herufi', fromEmail: c.from_email,
    replyTo: c.reply_to, listIds: [listId], bodyHtml: built.html, bodyText: built.text, templateId, sendAt, tags: ['herufi'],
  })
  return { input, listId }
}

/** Create the Listmonk draft, or update the one we made earlier. Starts a fresh one if the old one has moved on. */
async function upsertListmonkCampaign(q: Queryable, lm: ListmonkClient, c: CampaignRecord, input: ListmonkCampaignInput): Promise<{ id: number; uuid: string | null }> {
  if (c.listmonk_campaign_id) {
    const existing = await lm.getCampaign(c.listmonk_campaign_id)
    if (existing) {
      if (existing.status === 'scheduled') await lm.setCampaignStatus(existing.id, 'draft')
      if (existing.status === 'draft' || existing.status === 'scheduled') {
        const u = await lm.updateCampaign(existing.id, input)
        return { id: u.id, uuid: u.uuid ?? existing.uuid ?? null }
      }
    }
  }
  const created = await lm.createCampaign(input)
  await q.query('update email_campaigns set listmonk_campaign_id = $2, listmonk_campaign_uuid = $3, updated_at = now() where id = $1', [c.id, created.id, created.uuid ?? null])
  return { id: created.id, uuid: created.uuid ?? null }
}

/**
 * Listmonk only sends a test to people it already knows. A test address that is
 * not a subscriber yet gets a minimal record with NO list membership, so it can
 * receive test emails but can never be reached by a real campaign.
 */
async function ensureTestSubscribers(lm: ListmonkClient, emails: string[]): Promise<void> {
  for (const email of emails) {
    if (await lm.findSubscriberByEmail(email)) continue
    try {
      await lm.createSubscriber({
        email,
        name: cleanText(email.split('@')[0].replace(/[._+-]+/g, ' '), 100) ?? 'Test recipient',
        attribs: { herufi_test_recipient: true, unsubscribe_url: `${appBaseUrl()}/unsubscribe?t=test` },
        lists: [],
        preconfirm: false,
      })
    } catch (err) {
      // Created by someone else a moment ago: that is fine.
      if (!(err instanceof ListmonkError && err.upstreamStatusCode === 409)) throw err
    }
  }
}

// ---------------------------------------------------------------------------
// Test send
// ---------------------------------------------------------------------------
export async function sendTest(
  actor: string, id: string, recipients: string[], lm: ListmonkClient, correlationId?: string,
): Promise<{ queued: string[] }> {
  const emails = Array.from(new Set(recipients.map(normaliseEmail)))
  if (!emails.length || emails.length > 5) throw new ValidationError('Enter between 1 and 5 test addresses')
  if (emails.some((e) => !isValidEmail(e))) throw new ValidationError('One of the test addresses is not valid')
  assertAllCanReceive(emails, 'Test email')

  const pool = getPool()
  const c = await getCampaign(pool, id)
  if (!EDITABLE.has(c.status)) throw new ConflictError(`A ${c.status} campaign cannot be tested`, 'not_editable')
  const { input } = await buildInput(pool, lm, c)
  const lmc = await upsertListmonkCampaign(pool, lm, c, input)
  await ensureTestSubscribers(lm, emails)
  await lm.testCampaign(lmc.id, { ...input, subscribers: emails })
  await pool.query(
    `update email_campaigns set status = 'test', test_sent_at = now(), test_recipients = $2::text[], updated_at = now() where id = $1`,
    [id, emails],
  )
  await audit(pool, { actor, action: 'campaign.test_sent', entityType: 'campaign', entityId: id, correlationId, detail: { recipients: emails.length } })
  return { queued: emails }
}

// ---------------------------------------------------------------------------
// Submit (send now or schedule)
// ---------------------------------------------------------------------------
async function syncEverything(lm: ListmonkClient, actor: string, correlationId: string | undefined, log?: Logger): Promise<void> {
  await reconcileFromListmonk({ lm, actor, correlationId, log })
  let previous = Number.POSITIVE_INFINITY
  for (let i = 0; i < 40; i++) {
    const s = await syncToListmonk({ lm, actor, correlationId, log, limit: 500 })
    if (s.skipped || s.remaining === 0 || s.remaining >= previous) return
    previous = s.remaining
  }
}

/**
 * Compare Listmonk's own list with who Herufi says may receive this campaign.
 * Anyone active on the list who should not be is unsubscribed from it before
 * sending. Returns how many eligible people are confirmed and ready.
 */
export async function auditListmonkList(lm: ListmonkClient, listId: number, eligible: Set<string>): Promise<{ removed: number; confirmed: number }> {
  const extras: number[] = []
  let confirmed = 0
  for await (const page of lm.iterateSubscribers({ listId })) {
    for (const s of page) {
      const sub = s.lists.find((l) => l.id === listId)
      if (!sub || sub.subscription_status === 'unsubscribed' || s.status !== 'enabled') continue
      if (eligible.has(s.email.toLowerCase())) {
        if (sub.subscription_status === 'confirmed') confirmed++
      } else {
        extras.push(s.id)
      }
    }
  }
  for (let i = 0; i < extras.length; i += 200) {
    await lm.setSubscriptions({ ids: extras.slice(i, i + 200), action: 'unsubscribe', listIds: [listId] })
  }
  return { removed: extras.length, confirmed }
}

export type SubmitInput = {
  mode: 'send_now' | 'schedule'
  /** Required for schedule. ISO timestamp, at least 5 minutes ahead. */
  scheduledAt?: string
  /** The eligible count the person saw on the review screen. Must still be true when sending. */
  expectedEligibleCount: number
  /** Must be exactly true. There is no way to send without an explicit confirmation. */
  confirm: boolean
  /** A fresh value per review screen, so a double click or retry cannot send twice. */
  idempotencyKey: string
}

export type SubmitResult = { campaign: CampaignRecord; alreadySubmitted: boolean; eligible: number; removedFromList: number }

export async function submitCampaign(actor: string, id: string, input: SubmitInput, lm: ListmonkClient, correlationId?: string, log?: Logger): Promise<SubmitResult> {
  assertCanSend('Sending campaigns')
  if (input.confirm !== true) throw new ValidationError('Confirm that you want to send this campaign')
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(input.idempotencyKey)) throw new ValidationError('Missing request key. Reload the review page and try again.')
  const sendAt = input.mode === 'schedule' ? new Date(input.scheduledAt ?? '') : null
  if (input.mode === 'schedule' && (!sendAt || Number.isNaN(sendAt.getTime()) || sendAt.getTime() < Date.now() + 5 * 60_000)) {
    throw new ValidationError('Pick a time at least 5 minutes from now')
  }

  const pool = getPool()
  // Claim: only one request can ever take a campaign from editable to submitted.
  const claim = await pool.query(
    `update email_campaigns set idempotency_key = $2, updated_at = now()
      where id = $1 and idempotency_key is null and status in ('draft','test','failed') and archived_at is null returning *`,
    [id, input.idempotencyKey],
  ).catch((err) => {
    if ((err as { code?: string }).code === '23505') throw new ConflictError('This request key was already used for another campaign. Reload and try again.', 'duplicate_request')
    throw err
  })
  if (!claim.rows[0]) {
    const existing = await getCampaign(pool, id)
    if (existing.idempotency_key === input.idempotencyKey) return { campaign: existing, alreadySubmitted: true, eligible: existing.eligible_count ?? 0, removedFromList: 0 }
    throw new ConflictError(`This campaign is already ${existing.status} and cannot be sent again`, 'already_submitted')
  }

  const c = claim.rows[0] as CampaignRecord
  let touchedListmonk = false
  try {
    const review = await getReview(id, pool)
    const blockers = review.checks.filter((k) => !k.ok && k.blocking)
    if (blockers.length) throw new ValidationError(blockers[0].message, blockers.map((b) => b.message))

    const audience = await getAudience(pool, c.audience_id!)
    await syncEverything(lm, actor, correlationId, log)

    // Re-check who is eligible right now, after the sync.
    const summary = summarise(await loadAudienceRecipients(pool, audience.id), { allow: recipientFilter() })
    if (summary.eligible.length !== input.expectedEligibleCount) {
      throw new ConflictError(
        `The audience changed since you reviewed it: ${summary.eligible.length} people are eligible now, not ${input.expectedEligibleCount}. Review again before sending.`,
        'audience_changed', { eligible: summary.eligible.length },
      )
    }
    const listId = await ensureListmonkList(pool, lm, audience)
    const eligibleEmails = new Set<string>(summary.eligible.map((r) => r.email))
    const { removed, confirmed } = await auditListmonkList(lm, listId, eligibleEmails)
    if (confirmed !== summary.eligible.length) {
      throw new ConflictError(
        `Listmonk has ${confirmed} confirmed subscribers but ${summary.eligible.length} are eligible. Nothing was sent. Run a sync and try again.`,
        'list_out_of_sync', { confirmed, eligible: summary.eligible.length },
      )
    }

    const { input: lmInput } = await buildInput(pool, lm, c, sendAt)
    touchedListmonk = true
    const lmc = await upsertListmonkCampaign(pool, lm, c, lmInput)
    const started = await lm.setCampaignStatus(lmc.id, input.mode === 'schedule' ? 'scheduled' : 'running')

    const excluded: Record<string, number> = {}
    for (const [k, v] of Object.entries(summary.excludedCounts)) excluded[k] = v as number
    const { rows } = await pool.query(
      `update email_campaigns
          set status = $2, listmonk_campaign_id = $3, listmonk_campaign_uuid = $4, submitted_at = now(), submitted_by = $5,
              eligible_count = $6, excluded_summary = $7::jsonb, scheduled_at = $8, last_error = null, updated_at = now()
        where id = $1 returning *`,
      [id, input.mode === 'schedule' ? 'scheduled' : 'sending', lmc.id, started.uuid ?? lmc.uuid, actor, summary.eligible.length, JSON.stringify(excluded), sendAt?.toISOString() ?? null],
    )
    await audit(pool, {
      actor, action: input.mode === 'schedule' ? 'campaign.scheduled' : 'campaign.sent', entityType: 'campaign', entityId: id, correlationId,
      detail: { eligible: summary.eligible.length, excluded, removedFromList: removed, scheduledAt: sendAt?.toISOString() ?? null, sendMode: sendMode() },
    })
    return { campaign: rows[0], alreadySubmitted: false, eligible: summary.eligible.length, removedFromList: removed }
  } catch (err) {
    const message = err instanceof AppError ? err.message : 'Sending failed unexpectedly'
    // Release the claim so the campaign can be corrected and tried again.
    await pool.query(
      `update email_campaigns set idempotency_key = null, last_error = $2, status = case when $3::boolean then 'failed' else status end, updated_at = now() where id = $1`,
      [id, message.slice(0, 500), touchedListmonk],
    ).catch(() => undefined)
    throw err
  }
}

// ---------------------------------------------------------------------------
// Pause, resume, cancel
// ---------------------------------------------------------------------------
export async function pauseCampaign(actor: string, id: string, lm: ListmonkClient, correlationId?: string): Promise<CampaignRecord> {
  const pool = getPool()
  const c = await getCampaign(pool, id)
  if (c.status !== 'sending' || !c.listmonk_campaign_id) throw new ConflictError('Only a campaign that is sending can be paused', 'bad_state')
  await lm.setCampaignStatus(c.listmonk_campaign_id, 'paused')
  const { rows } = await pool.query("update email_campaigns set status = 'paused', updated_at = now() where id = $1 returning *", [id])
  await audit(pool, { actor, action: 'campaign.paused', entityType: 'campaign', entityId: id, correlationId })
  return rows[0]
}

export async function resumeCampaign(actor: string, id: string, lm: ListmonkClient, correlationId?: string, log?: Logger): Promise<CampaignRecord> {
  assertCanSend('Sending campaigns')
  const pool = getPool()
  const c = await getCampaign(pool, id)
  if (c.status !== 'paused' || !c.listmonk_campaign_id || !c.audience_id) throw new ConflictError('Only a paused campaign can be resumed', 'bad_state')
  // People may have unsubscribed while it was paused. Re-check before sending continues.
  await syncEverything(lm, actor, correlationId, log)
  const audience = await getAudience(pool, c.audience_id)
  const summary = summarise(await loadAudienceRecipients(pool, audience.id), { allow: recipientFilter() })
  await auditListmonkList(lm, await ensureListmonkList(pool, lm, audience), new Set<string>(summary.eligible.map((r) => r.email)))
  await lm.setCampaignStatus(c.listmonk_campaign_id, 'running')
  const { rows } = await pool.query("update email_campaigns set status = 'sending', updated_at = now() where id = $1 returning *", [id])
  await audit(pool, { actor, action: 'campaign.resumed', entityType: 'campaign', entityId: id, correlationId })
  return rows[0]
}

export async function cancelCampaign(actor: string, id: string, lm: ListmonkClient, correlationId?: string): Promise<CampaignRecord> {
  const pool = getPool()
  const c = await getCampaign(pool, id)
  if (!['scheduled', 'sending', 'paused'].includes(c.status) || !c.listmonk_campaign_id) throw new ConflictError('Only a scheduled, sending or paused campaign can be cancelled', 'bad_state')
  // Listmonk only allows "cancelled" for an active campaign. A scheduled one goes back to draft.
  await lm.setCampaignStatus(c.listmonk_campaign_id, c.status === 'scheduled' ? 'draft' : 'cancelled')
  const { rows } = await pool.query("update email_campaigns set status = 'cancelled', idempotency_key = null, updated_at = now() where id = $1 returning *", [id])
  await audit(pool, { actor, action: 'campaign.cancelled', entityType: 'campaign', entityId: id, correlationId })
  return rows[0]
}

// ---------------------------------------------------------------------------
// Status and statistics
// ---------------------------------------------------------------------------
const STATUS_MAP: Record<string, CampaignStatus | null> = { finished: 'sent', running: 'sending', scheduled: 'scheduled', paused: 'paused', cancelled: 'cancelled', draft: null }

export async function refreshCampaign(id: string, lm: ListmonkClient): Promise<CampaignRecord> {
  const pool = getPool()
  const c = await getCampaign(pool, id)
  if (!c.listmonk_campaign_id) return c
  const lc = await lm.getCampaign(c.listmonk_campaign_id)
  if (!lc) {
    if (['scheduled', 'sending', 'paused'].includes(c.status)) {
      const { rows } = await pool.query("update email_campaigns set status = 'failed', last_error = 'The campaign no longer exists in Listmonk', updated_at = now() where id = $1 returning *", [id])
      return rows[0]
    }
    return c
  }
  const unsub = c.listmonk_campaign_uuid
    ? (await pool.query("select count(*)::int n from email_consent_events where event_type = 'unsubscribed' and metadata ->> 'campaign_uuid' = $1", [c.listmonk_campaign_uuid])).rows[0].n
    : 0
  const stats: CampaignStats = { to_send: lc.to_send, sent: lc.sent, views: lc.views, clicks: lc.clicks, bounces: lc.bounces, unsubscribes: unsub, delivered: null }
  const mapped = STATUS_MAP[lc.status]
  const { rows } = await pool.query(
    `update email_campaigns set stats = $2::jsonb, status = coalesce($3, status), last_reconciled_at = now(), updated_at = now() where id = $1 returning *`,
    [id, JSON.stringify(stats), mapped && !['draft', 'test', 'failed'].includes(c.status) ? mapped : null],
  )
  return rows[0]
}

/** Bring every active campaign's status and statistics up to date. Run from the schedule. */
export async function reconcileCampaigns(lm: ListmonkClient, log?: Logger): Promise<{ refreshed: number; failed: number }> {
  const { rows } = await getPool().query("select id from email_campaigns where status in ('scheduled','sending','paused') and archived_at is null limit 100")
  let refreshed = 0, failed = 0
  for (const r of rows) {
    try { await refreshCampaign(r.id, lm); refreshed++ } catch (err) { failed++; log?.warn('campaign refresh failed', { id: r.id, error: err instanceof Error ? err.message : 'unknown' }) }
  }
  return { refreshed, failed }
}
