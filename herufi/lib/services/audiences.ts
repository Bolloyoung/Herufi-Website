import { slugify } from '@/lib/domain/text'
import type { AudienceRecord, AutoRules } from '@/lib/domain/types'
import type { ListmonkClient } from '@/lib/integrations/listmonk/client'
import { db, isUniqueViolation, withTx, type Queryable } from '@/lib/server/db'
import { ConflictError, NotFoundError, ValidationError } from '@/lib/server/errors'
import { audit } from './audit'

export type AudienceWithCounts = AudienceRecord & { member_count: number; consented_count: number }

export async function listAudiences(q: Queryable = db(), opts: { includeArchived?: boolean } = {}): Promise<AudienceWithCounts[]> {
  const { rows } = await q.query(
    `select a.*,
            count(m.contact_id)::int as member_count,
            count(m.contact_id) filter (where m.consented)::int as consented_count
       from email_audiences a
       left join email_contact_audiences m on m.audience_id = a.id
      where ($1 or a.archived_at is null)
      group by a.id
      order by a.name`,
    [opts.includeArchived ?? false],
  )
  return rows
}

export async function getAudience(q: Queryable, id: string): Promise<AudienceRecord> {
  const { rows } = await q.query('select * from email_audiences where id = $1', [id])
  if (!rows[0]) throw new NotFoundError('Audience not found')
  return rows[0]
}

export async function listPublicAudiences(q: Queryable = db()): Promise<Array<{ slug: string; name: string; description: string | null }>> {
  const { rows } = await q.query(
    'select slug, name, description from email_audiences where public_signup and archived_at is null order by name',
  )
  return rows
}

function cleanRules(rules: AutoRules | undefined): AutoRules {
  const clean = (list?: string[]) => (list ?? []).map((s) => s.trim()).filter(Boolean).slice(0, 50)
  return { organisation_type: clean(rules?.organisation_type), category: clean(rules?.category), tags: clean(rules?.tags) }
}

export async function createAudience(
  actor: string,
  input: { name: string; description?: string | null; publicSignup?: boolean; autoRules?: AutoRules },
  correlationId?: string,
): Promise<AudienceRecord> {
  const name = input.name.trim()
  if (!name || name.length > 100) throw new ValidationError('Give the audience a name of up to 100 characters')
  const base = slugify(name) || 'audience'
  return withTx(async (c) => {
    // A failed INSERT aborts a Postgres transaction, so find a free slug first.
    const { rows: taken } = await c.query("select slug from email_audiences where slug = $1 or slug like $1 || '-%'", [base])
    const used = new Set<string>(taken.map((r: { slug: string }) => r.slug))
    let slug = base
    for (let i = 2; used.has(slug); i++) slug = `${base}-${i}`
    try {
      const { rows } = await c.query(
        `insert into email_audiences (name, slug, description, public_signup, auto_rules)
         values ($1, $2, $3, $4, $5::jsonb) returning *`,
        [name, slug, input.description?.trim() || null, input.publicSignup ?? false, JSON.stringify(cleanRules(input.autoRules))],
      )
      await audit(c, { actor, action: 'audience.created', entityType: 'audience', entityId: rows[0].id, correlationId, detail: { name, slug } })
      return rows[0] as AudienceRecord
    } catch (err) {
      if (isUniqueViolation(err)) throw new ConflictError('An audience with this name was just created. Try again.', 'audience_exists')
      throw err
    }
  })
}

export async function updateAudience(
  actor: string,
  id: string,
  patch: { name?: string; description?: string | null; publicSignup?: boolean; autoRules?: AutoRules },
  correlationId?: string,
): Promise<AudienceRecord> {
  return withTx(async (c) => {
    const current = await getAudience(c, id)
    const name = patch.name !== undefined ? patch.name.trim() : current.name
    if (!name || name.length > 100) throw new ValidationError('Give the audience a name of up to 100 characters')
    const { rows } = await c.query(
      `update email_audiences
          set name = $2, description = $3, public_signup = $4, auto_rules = $5::jsonb, updated_at = now()
        where id = $1 returning *`,
      [
        id, name,
        patch.description !== undefined ? patch.description?.trim() || null : current.description,
        patch.publicSignup ?? current.public_signup,
        JSON.stringify(patch.autoRules ? cleanRules(patch.autoRules) : current.auto_rules),
      ],
    )
    await audit(c, { actor, action: 'audience.updated', entityType: 'audience', entityId: id, correlationId, detail: { fields: Object.keys(patch) } })
    return rows[0]
  })
}

export async function archiveAudience(actor: string, id: string, correlationId?: string): Promise<void> {
  await withTx(async (c) => {
    await getAudience(c, id)
    await c.query('update email_audiences set archived_at = now(), public_signup = false, updated_at = now() where id = $1', [id])
    // Members must be taken off the Listmonk list on the next sync.
    await c.query(
      `update email_contacts set needs_listmonk_sync = true, updated_at = now()
        where id in (select contact_id from email_contact_audiences where audience_id = $1)`,
      [id],
    )
    await audit(c, { actor, action: 'audience.archived', entityType: 'audience', entityId: id, correlationId })
  })
}

/**
 * Make sure the audience has a Listmonk list, creating a private double opt in
 * list on first use. Safe to call repeatedly and concurrently.
 */
export async function ensureListmonkList(q: Queryable, lm: ListmonkClient, audience: AudienceRecord): Promise<number> {
  if (audience.listmonk_list_id) return audience.listmonk_list_id
  const list = await lm.createList({ name: `Herufi: ${audience.name}`, description: audience.description ?? '', tags: ['herufi'] })
  // Only the first writer wins; a concurrent caller reads the winner's id.
  const { rows } = await q.query(
    'update email_audiences set listmonk_list_id = $2, updated_at = now() where id = $1 and listmonk_list_id is null returning listmonk_list_id',
    [audience.id, list.id],
  )
  if (rows[0]) return rows[0].listmonk_list_id
  const { rows: again } = await q.query('select listmonk_list_id from email_audiences where id = $1', [audience.id])
  return again[0].listmonk_list_id
}

/** Add or remove staff chosen members. Membership alone never grants consent. */
export async function setMembership(
  actor: string,
  audienceId: string,
  contactIds: string[],
  action: 'add' | 'remove',
  correlationId?: string,
): Promise<{ changed: number }> {
  if (!contactIds.length) return { changed: 0 }
  if (contactIds.length > 5000) throw new ValidationError('Select at most 5000 contacts at a time')
  return withTx(async (c) => {
    await getAudience(c, audienceId)
    let changed = 0
    if (action === 'add') {
      const r = await c.query(
        `insert into email_contact_audiences (contact_id, audience_id, consented, added_via)
         select id, $2, false, 'manual' from email_contacts where id = any($1::uuid[])
         on conflict do nothing`,
        [contactIds, audienceId],
      )
      changed = r.rowCount ?? 0
    } else {
      const r = await c.query('delete from email_contact_audiences where audience_id = $2 and contact_id = any($1::uuid[])', [contactIds, audienceId])
      changed = r.rowCount ?? 0
      await c.query('update email_contacts set needs_listmonk_sync = true, updated_at = now() where id = any($1::uuid[])', [contactIds])
    }
    await audit(c, { actor, action: `audience.members_${action}`, entityType: 'audience', entityId: audienceId, correlationId, detail: { requested: contactIds.length, changed } })
    return { changed }
  })
}

/**
 * Apply each audience's automatic rules to the given contacts (or all contacts).
 * This only creates membership with consented = false, so it never makes anyone eligible.
 */
export async function applyAutoRules(q: Queryable, contactIds?: string[]): Promise<number> {
  const { rows: audiences } = await q.query(
    `select id, auto_rules from email_audiences
      where archived_at is null and auto_rules <> '{}'::jsonb`,
  )
  let added = 0
  for (const a of audiences) {
    const rules = a.auto_rules as AutoRules
    const types = rules.organisation_type ?? []
    const cats = rules.category ?? []
    const tags = rules.tags ?? []
    if (!types.length && !cats.length && !tags.length) continue
    const r = await q.query(
      `insert into email_contact_audiences (contact_id, audience_id, consented, added_via)
       select c.id, $1, false, 'import_rule'
         from email_contacts c
        where c.archived_at is null
          and ($5::uuid[] is null or c.id = any($5::uuid[]))
          and ( lower(c.organisation_type) = any($2::text[])
             or lower(c.category) = any($3::text[])
             or exists (select 1 from unnest(c.tags) t where lower(t) = any($4::text[])) )
       on conflict do nothing`,
      [a.id, types.map((s) => s.toLowerCase()), cats.map((s) => s.toLowerCase()), tags.map((s) => s.toLowerCase()), contactIds ?? null],
    )
    added += r.rowCount ?? 0
  }
  return added
}
