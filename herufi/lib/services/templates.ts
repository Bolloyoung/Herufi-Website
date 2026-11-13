import { cleanHeaderText } from '@/lib/domain/text'
import { sanitizeEmailHtml, validateTemplateSyntax } from '@/lib/integrations/email/content'
import { db, withTx, type Queryable } from '@/lib/server/db'
import { NotFoundError, ValidationError } from '@/lib/server/errors'
import { audit } from './audit'

export type EmailTemplate = {
  id: string
  name: string
  description: string | null
  subject: string | null
  preview_text: string | null
  body_html: string
  created_by: string | null
  created_at: string
  updated_at: string
  archived_at: string | null
}

export async function listTemplates(q: Queryable = db()): Promise<EmailTemplate[]> {
  const { rows } = await q.query('select * from email_templates where archived_at is null order by name')
  return rows
}

export async function getTemplate(q: Queryable, id: string): Promise<EmailTemplate> {
  const { rows } = await q.query('select * from email_templates where id = $1 and archived_at is null', [id])
  if (!rows[0]) throw new NotFoundError('Template not found')
  return rows[0]
}

type TemplateInput = { name: string; description?: string | null; subject?: string | null; previewText?: string | null; bodyHtml: string }

function clean(input: TemplateInput) {
  const name = cleanHeaderText(input.name, 100)
  if (!name) throw new ValidationError('Give the template a name')
  const bodyHtml = sanitizeEmailHtml(input.bodyHtml)
  const problems = validateTemplateSyntax(bodyHtml)
  if (problems.length) throw new ValidationError(problems[0], problems)
  return { name, description: input.description?.trim() || null, subject: input.subject ? cleanHeaderText(input.subject, 200) : null, previewText: input.previewText ? cleanHeaderText(input.previewText, 150) : null, bodyHtml }
}

export async function createTemplate(actor: string, input: TemplateInput, correlationId?: string): Promise<EmailTemplate> {
  const t = clean(input)
  return withTx(async (c) => {
    const { rows } = await c.query(
      `insert into email_templates (name, description, subject, preview_text, body_html, created_by) values ($1,$2,$3,$4,$5,$6) returning *`,
      [t.name, t.description, t.subject, t.previewText, t.bodyHtml, actor],
    )
    await audit(c, { actor, action: 'template.created', entityType: 'template', entityId: rows[0].id, correlationId, detail: { name: t.name } })
    return rows[0]
  })
}

export async function updateTemplate(actor: string, id: string, input: TemplateInput, correlationId?: string): Promise<EmailTemplate> {
  const t = clean(input)
  return withTx(async (c) => {
    await getTemplate(c, id)
    const { rows } = await c.query(
      `update email_templates set name=$2, description=$3, subject=$4, preview_text=$5, body_html=$6, updated_at=now() where id=$1 returning *`,
      [id, t.name, t.description, t.subject, t.previewText, t.bodyHtml],
    )
    await audit(c, { actor, action: 'template.updated', entityType: 'template', entityId: id, correlationId })
    return rows[0]
  })
}

export async function archiveTemplate(actor: string, id: string, correlationId?: string): Promise<void> {
  await withTx(async (c) => {
    await getTemplate(c, id)
    await c.query('update email_templates set archived_at = now() where id = $1', [id])
    await audit(c, { actor, action: 'template.archived', entityType: 'template', entityId: id, correlationId })
  })
}
