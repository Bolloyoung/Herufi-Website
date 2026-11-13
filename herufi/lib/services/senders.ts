import { cleanDisplayName, isValidEmail, normaliseEmail } from '@/lib/domain/text'
import { sanitizeEmailHtml } from '@/lib/integrations/email/content'
import { senderDefaults } from '@/lib/server/env'
import { db, withTx, isUniqueViolation, type Queryable } from '@/lib/server/db'
import { ConflictError, NotFoundError, ValidationError } from '@/lib/server/errors'
import { audit } from './audit'

export type SenderIdentity = {
  id: string
  from_name: string
  from_email: string
  reply_to: string | null
  signature_html: string | null
  verified: boolean
  is_default: boolean
  created_at: string
}

export async function listSenders(q: Queryable = db()): Promise<SenderIdentity[]> {
  const { rows } = await q.query('select * from email_sender_identities order by is_default desc, from_email')
  return rows
}

export async function getVerifiedSender(q: Queryable, fromEmail: string): Promise<SenderIdentity | null> {
  const { rows } = await q.query('select * from email_sender_identities where from_email = $1 and verified', [fromEmail.toLowerCase()])
  return rows[0] ?? null
}

export async function createSender(
  actor: string,
  input: { fromName: string; fromEmail: string; replyTo?: string | null; signatureHtml?: string | null },
  correlationId?: string,
): Promise<SenderIdentity> {
  const fromEmail = normaliseEmail(input.fromEmail)
  const replyTo = input.replyTo ? normaliseEmail(input.replyTo) : null
  const fromName = cleanDisplayName(input.fromName)
  if (!isValidEmail(fromEmail)) throw new ValidationError('Enter a valid sender email address')
  if (replyTo && !isValidEmail(replyTo)) throw new ValidationError('Enter a valid reply to address')
  if (!fromName) throw new ValidationError('Enter the name recipients will see')
  return withTx(async (c) => {
    try {
      const { rows } = await c.query(
        `insert into email_sender_identities (from_name, from_email, reply_to, signature_html, verified, is_default)
         values ($1, $2, $3, $4, false, not exists (select 1 from email_sender_identities)) returning *`,
        [fromName, fromEmail, replyTo, input.signatureHtml ? sanitizeEmailHtml(input.signatureHtml) : null],
      )
      await audit(c, { actor, action: 'sender.created', entityType: 'sender', entityId: rows[0].id, correlationId, detail: { fromEmail } })
      return rows[0]
    } catch (err) {
      if (isUniqueViolation(err)) throw new ConflictError('That sender address already exists', 'sender_exists')
      throw err
    }
  })
}

/**
 * Mark a sender verified. This is an administrator's statement that the sending
 * domain is authenticated with the delivery provider (SPF, DKIM and DMARC), so
 * only do it after completing the domain checklist.
 */
export async function setSenderVerified(actor: string, id: string, verified: boolean, correlationId?: string): Promise<void> {
  await withTx(async (c) => {
    const { rows } = await c.query('update email_sender_identities set verified = $2 where id = $1 returning from_email', [id, verified])
    if (!rows[0]) throw new NotFoundError('Sender not found')
    await audit(c, { actor, action: verified ? 'sender.verified' : 'sender.unverified', entityType: 'sender', entityId: id, correlationId, detail: { fromEmail: rows[0].from_email } })
  })
}

export async function setDefaultSender(actor: string, id: string, correlationId?: string): Promise<void> {
  await withTx(async (c) => {
    const { rows } = await c.query('select 1 from email_sender_identities where id = $1', [id])
    if (!rows[0]) throw new NotFoundError('Sender not found')
    await c.query('update email_sender_identities set is_default = (id = $1)', [id])
    await audit(c, { actor, action: 'sender.default_set', entityType: 'sender', entityId: id, correlationId })
  })
}

/** The identity to prefill on a new campaign: the default sender if any, else the environment defaults. */
export async function defaultSenderFields(q: Queryable = db()): Promise<{ fromName: string; fromEmail: string; replyTo: string | null }> {
  const { rows } = await q.query('select * from email_sender_identities where is_default limit 1')
  if (rows[0]) return { fromName: rows[0].from_name, fromEmail: rows[0].from_email, replyTo: rows[0].reply_to }
  const d = senderDefaults()
  return { fromName: d.fromName, fromEmail: d.fromEmail, replyTo: d.replyTo ?? d.fromEmail }
}
