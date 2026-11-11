import type { Queryable } from '@/lib/server/db'

export type AuditEntry = {
  actor: string
  action: string
  entityType?: string
  entityId?: string
  correlationId?: string
  detail?: Record<string, unknown>
}

const SECRET_KEY = /(token|secret|password|authorization|api_?key|private)/i

function stripSecrets(value: unknown, depth = 0): unknown {
  if (depth > 4) return '[truncated]'
  if (Array.isArray(value)) return value.slice(0, 100).map((v) => stripSecrets(v, depth + 1))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SECRET_KEY.test(k) ? '[redacted]' : stripSecrets(v, depth + 1)
    }
    return out
  }
  return value
}

/** Append only record of who did what. Never put credentials in `detail`; known secret keys are stripped anyway. */
export async function audit(q: Queryable, e: AuditEntry): Promise<void> {
  await q.query(
    `insert into email_audit_log (actor, action, entity_type, entity_id, correlation_id, detail)
     values ($1, $2, $3, $4, $5, $6::jsonb)`,
    [e.actor, e.action, e.entityType ?? null, e.entityId ?? null, e.correlationId ?? null, JSON.stringify(stripSecrets(e.detail ?? {}))],
  )
}

export async function listAudit(
  q: Queryable,
  filter: { entityType?: string; entityId?: string; limit?: number } = {},
): Promise<Array<{ id: string; actor: string; action: string; entity_type: string | null; entity_id: string | null; detail: unknown; created_at: string }>> {
  const { rows } = await q.query(
    `select id, actor, action, entity_type, entity_id, detail, created_at
       from email_audit_log
      where ($1::text is null or entity_type = $1) and ($2::text is null or entity_id = $2)
      order by created_at desc limit $3`,
    [filter.entityType ?? null, filter.entityId ?? null, Math.min(filter.limit ?? 100, 500)],
  )
  return rows
}
