import { createHash } from 'node:crypto'
import { cleanDisplayName, cleanHeaderText, cleanText } from '@/lib/domain/text'
import { compileMergeTags } from '@/lib/integrations/email/content'
import type { ContactRecord } from '@/lib/domain/types'
import { signUnsubscribeToken } from '@/lib/server/tokens'
import type { ListmonkCampaignInput } from './client'


/**
 * The Listmonk campaign template that wraps every Herufi email. Created once by
 * scripts/email/bootstrap-listmonk.mjs. The unsubscribe link points at Herufi, so
 * an unsubscribe updates Herufi's own records immediately. If a subscriber has no
 * Herufi link stored yet, it falls back to Listmonk's own unsubscribe page.
 */
const UNSUBSCRIBE_HREF_LISTMONK =
  '{{ if .Subscriber.Attribs.unsubscribe_url }}{{ .Subscriber.Attribs.unsubscribe_url }}&c={{ .Campaign.UUID }}{{ else }}{{ UnsubscribeURL }}{{ end }}'

function wrapper(parts: { title: string; content: string; unsubscribeHref: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${parts.title}</title>
</head>
<body style="margin:0;padding:0;background:#FAFAF8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAF8;">
<tr><td align="center" style="padding:24px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #E5E5E3;">
    <tr><td style="padding:20px 32px;border-bottom:3px solid #1B4332;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.14em;color:#1B4332;">HERUFI</td></tr>
    <tr><td style="padding:32px;">${parts.content}</td></tr>
    <tr><td style="padding:20px 32px;border-top:1px solid #E5E5E3;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#6b6b6e;">
      You are receiving this email because you subscribed to updates from Herufi.<br>
      <a href="${parts.unsubscribeHref}" style="color:#1B4332;text-decoration:underline;">Unsubscribe</a>
      &nbsp;or reply to this email to reach us at hello@herufi.org.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`
}

// The title is static on purpose. In Listmonk, .Campaign.Subject is the subject's
// template source (our compiled merge expression), not the text each person sees,
// so using it would put raw template code in every email.
export const WRAPPER_TEMPLATE_HTML = wrapper({
  title: 'Herufi',
  content: '{{ template "content" . }}',
  unsubscribeHref: UNSUBSCRIBE_HREF_LISTMONK,
})

/**
 * The template name carries a hash of its content. A changed template is therefore
 * created as a new Listmonk template instead of being found by name and silently
 * reused in its old form, and templates already attached to scheduled campaigns
 * are never altered underneath them.
 */
export const WRAPPER_TEMPLATE_NAME = `Herufi campaign wrapper ${createHash('sha256').update(WRAPPER_TEMPLATE_HTML).digest('hex').slice(0, 8)}`

/** The same layout with sample content, for the in app preview. Contains no template actions. */
export function renderPreviewDocument(input: { title: string; bodyHtml: string }): string {
  return wrapper({ title: escapeHtml(input.title), content: input.bodyHtml, unsubscribeHref: '#' })
}

export function displayNameFor(c: Pick<ContactRecord, 'first_name' | 'last_name' | 'email'>): string {
  const full = [c.first_name, c.last_name].filter(Boolean).join(' ').trim()
  if (full) return full.slice(0, 100)
  const local = cleanText(c.email.split('@')[0].replace(/[._+-]+/g, ' '), 100)
  return local || 'Subscriber'
}

export function unsubscribeUrl(contactId: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/unsubscribe?t=${encodeURIComponent(signUnsubscribeToken(contactId))}`
}

type SubscriberSource = Pick<
  ContactRecord,
  | 'id' | 'email' | 'first_name' | 'last_name' | 'organisation' | 'job_title' | 'country'
  | 'organisation_type' | 'category' | 'tags' | 'consent_given_at'
>

/**
 * Attributes stored on the Listmonk subscriber. Every key is always sent (empty
 * string when unknown) so clearing a field in Herufi also clears it in Listmonk,
 * since Listmonk merges attributes on update. Internal notes are never sent.
 */
export function contactToAttribs(c: SubscriberSource, baseUrl: string): Record<string, unknown> {
  return {
    herufi_contact_id: c.id,
    first_name: c.first_name ?? '',
    last_name: c.last_name ?? '',
    organisation: c.organisation ?? '',
    job_title: c.job_title ?? '',
    country: c.country ?? '',
    organisation_type: c.organisation_type ?? '',
    category: c.category ?? '',
    tags: c.tags,
    consent_confirmed_at: c.consent_given_at ?? '',
    unsubscribe_url: unsubscribeUrl(c.id, baseUrl),
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Hidden text that mail apps show next to the subject in the inbox list. */
export function withPreheader(html: string, previewText?: string | null): string {
  const text = cleanHeaderText(previewText ?? '', 150)
  if (!text) return html
  const padding = '&nbsp;&zwnj;'.repeat(40)
  const preheader =
    `<div style="display:none;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">` +
    `${escapeHtml(text)}${padding}</div>`
  return preheader + html
}

export type CampaignInputSource = {
  name: string
  subject: string
  previewText?: string | null
  fromName: string
  fromEmail: string
  replyTo?: string | null
  listIds: number[]
  /** Already sanitised and compiled by buildCampaignBody. */
  bodyHtml: string
  bodyText: string
  templateId: number
  sendAt?: Date | null
  tags?: string[]
}

export function buildCampaignInput(c: CampaignInputSource): ListmonkCampaignInput {
  const fromName = cleanDisplayName(c.fromName) || 'Herufi'
  return {
    name: cleanHeaderText(c.name, 200) || 'Untitled campaign',
    subject: compileMergeTags(cleanHeaderText(c.subject, 200), { html: false }),
    lists: c.listIds,
    from_email: `${fromName} <${c.fromEmail.toLowerCase()}>`,
    type: 'regular',
    content_type: 'html',
    body: withPreheader(c.bodyHtml, c.previewText),
    altbody: c.bodyText,
    template_id: c.templateId,
    messenger: 'email',
    headers: c.replyTo ? [{ 'Reply-To': c.replyTo.toLowerCase() }] : [],
    ...(c.sendAt ? { send_at: c.sendAt.toISOString().replace(/\.\d{3}Z$/, 'Z') } : {}),
    tags: c.tags ?? ['herufi'],
  }
}
