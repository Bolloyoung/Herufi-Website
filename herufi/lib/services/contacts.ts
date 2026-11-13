import type { ContactRecord, ContactStatus } from '@/lib/domain/types'
import { cleanText } from '@/lib/domain/text'
import { db, withTx, type Queryable } from '@/lib/server/db'
import { NotFoundError, ValidationError } from '@/lib/server/errors'
import { audit } from './audit'
import { logConsentEvent } from './consent'

export type ContactListFilter = {
  q?: string
  status?: ContactStatus
  audienceId?: string
  claim?: 'complete' | 'incomplete'
  archived?: boolean
  page?: number
  perPage?: number
}

export type ContactListRow = Pick<
  ContactRecord,
  | 'id' | 'email' | 'first_name' | 'last_name' | 'organisation' | 'job_title' | 'country' | 'organisation_type'
  | 'category' | 'tags' | 'status' | 'consent_given_at' | 'claimed_consent' | 'created_at' | 'updated_at' | 'archived_at'
> & { audiences: Array<{ id: string; name: string; consented: boolean }> }

/** Escape LIKE wildcards so a search for "100%" does not match everything. */
function likeTerm(term: string): string {
  return `%${term.replace(/[\\%_]/g, (m) => `\\${m}`)}%`
}

export async function listContacts(
  filter: ContactListFilter = {},
  q: Queryable = db(),
): Promise<{ rows: ContactListRow[]; total: number; page: number; perPage: number }> {
  const perPage = Math.min(Math.max(filter.perPage ?? 50, 1), 200)
  const page = Math.max(filter.page ?? 1, 1)
  const term = filter.q?.trim().slice(0, 100)
  const { rows } = await q.query(
    `select c.id, c.email, c.first_name, c.last_name, c.organisation, c.job_title, c.country, c.organisation_type,
            c.category, c.tags, c.status, c.consent_given_at, c.claimed_consent, c.created_at, c.updated_at, c.archived_at,
            coalesce((select json_agg(json_build_object('id', a.id, 'name', a.name, 'consented', m.consented) order by a.name)
                        from email_contact_audiences m join email_audiences a on a.id = m.audience_id
                       where m.contact_id = c.id), '[]'::json) as audiences,
            count(*) over()::int as total_rows
       from email_contacts c
      where (($1::boolean and c.archived_at is not null) or (not $1::boolean and c.archived_at is null))
        and ($2::text is null or c.email ilike $2 or c.first_name ilike $2 or c.last_name ilike $2 or c.organisation ilike $2)
        and ($3::text is null or c.status = $3)
        and ($4::uuid is null or exists (select 1 from email_contact_audiences m where m.contact_id = c.id and m.audience_id = $4))
        and ($5::text is null
             or ($5 = 'complete'   and c.claimed_consent ->> 'complete' = 'true' and c.claimed_consent ->> 'status' = 'given' and c.status <> 'subscribed')
             or ($5 = 'incomplete' and c.claimed_consent ->> 'complete' = 'false' and c.claimed_consent ->> 'status' = 'given'))
      order by c.created_at desc, c.email
      limit $6 offset $7`,
    [filter.archived ?? false, term ? likeTerm(term) : null, filter.status ?? null, filter.audienceId ?? null, filter.claim ?? null, perPage, (page - 1) * perPage],
  )
  const total = rows[0]?.total_rows ?? 0
  return { rows: rows.map(({ total_rows: _t, ...r }: Record<string, unknown>) => r as unknown as ContactListRow), total, page, perPage }
}

export async function getContact(id: string, q: Queryable = db()) {
  const { rows } = await q.query('select * from email_contacts where id = $1', [id])
  if (!rows[0]) throw new NotFoundError('Contact not found')
  const contact = rows[0] as ContactRecord
  const [aud, events, sup] = await Promise.all([
    q.query(
      `select a.id, a.name, m.consented, m.consent_confirmed_at, m.added_via
         from email_contact_audiences m join email_audiences a on a.id = m.audience_id
        where m.contact_id = $1 order by a.name`,
      [id],
    ),
    q.query(
      `select id, event_type, from_status, to_status, purpose, source, wording_version, evidence, audience_ids, actor, metadata, created_at
         from email_consent_events where contact_id = $1 order by created_at desc limit 200`,
      [id],
    ),
    q.query('select reason, source, detail, created_at from email_suppressions where email = $1 and cleared_at is null', [contact.email]),
  ])
  return { contact, audiences: aud.rows, consentHistory: events.rows, suppression: sup.rows[0] ?? null }
}

/** Counts per status, for the contacts overview. */
export async function statusCounts(q: Queryable = db()): Promise<Record<string, number>> {
  const { rows } = await q.query('select status, count(*)::int as n from email_contacts where archived_at is null group by status')
  const out: Record<string, number> = {}
  for (const r of rows) out[r.status] = r.n
  return out
}

/**
 * Archive instead of deleting. The contact stays in Herufi's records (so consent
 * history and suppression remain), and is taken off Listmonk lists on the next sync.
 */
export async function archiveContact(actor: string, id: string, reason: string, correlationId?: string): Promise<void> {
  const why = cleanText(reason, 300)
  if (!why || why.length < 5) throw new ValidationError('Give a reason of at least 5 characters')
  await withTx(async (c) => {
    const { rows } = await c.query('select email, status, archived_at from email_contacts where id = $1 for update', [id])
    if (!rows[0]) throw new NotFoundError('Contact not found')
    if (rows[0].archived_at) return
    await c.query('update email_contacts set archived_at = now(), needs_listmonk_sync = true, updated_at = now() where id = $1', [id])
    await logConsentEvent(c, { contactId: id, email: rows[0].email, type: 'archived', from: rows[0].status, to: rows[0].status, evidence: why, actor, correlationId })
    await audit(c, { actor, action: 'contact.archived', entityType: 'contact', entityId: id, correlationId, detail: { reason: why } })
  })
}

export async function restoreContact(actor: string, id: string, correlationId?: string): Promise<void> {
  await withTx(async (c) => {
    const { rows } = await c.query('select email, status, archived_at from email_contacts where id = $1 for update', [id])
    if (!rows[0]) throw new NotFoundError('Contact not found')
    if (!rows[0].archived_at) return
    await c.query('update email_contacts set archived_at = null, needs_listmonk_sync = true, updated_at = now() where id = $1', [id])
    await logConsentEvent(c, { contactId: id, email: rows[0].email, type: 'restored', from: rows[0].status, to: rows[0].status, actor, correlationId })
    await audit(c, { actor, action: 'contact.restored', entityType: 'contact', entityId: id, correlationId })
  })
}
