import sanitizeHtml from 'sanitize-html'
import { ValidationError } from '@/lib/server/errors'

/**
 * Campaign content pipeline.
 *
 *   editor HTML  ->  sanitise  ->  compile merge tags  ->  Listmonk body
 *
 * Staff compose with simple merge tags such as {{first_name|there}}. We compile
 * those into Listmonk's Go template syntax ourselves. Anything else that looks
 * like a template action is rejected, because Listmonk's template engine can
 * call functions (including ones that read server environment variables), and
 * content written in an editor must never be able to reach them.
 */

import { MERGE_FIELDS } from './merge-fields'
export { MERGE_FIELDS, MERGE_FIELD_LABELS, type MergeField } from './merge-fields'
import type { MergeField } from './merge-fields'

const TAG_RE = /\{\{\s*([a-z_]+)\s*(?:\|([^{}|]*))?\}\}/g

/** HTML escape for text we place between template actions. */
function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/** Every merge tag used in the text, for validation and the editor sidebar. */
export function findMergeTags(text: string): Array<{ field: string; fallback: string; raw: string }> {
  const out: Array<{ field: string; fallback: string; raw: string }> = []
  for (const m of Array.from(text.matchAll(TAG_RE))) out.push({ field: m[1], fallback: (m[2] ?? '').trim(), raw: m[0] })
  return out
}

/**
 * Returns a list of problems. Empty means the content only uses known merge tags.
 * Any `{{` that is not a recognised merge tag is a problem, which also blocks
 * attempts to smuggle template actions.
 */
export function validateTemplateSyntax(text: string): string[] {
  const problems: string[] = []
  const known = new Set<string>(MERGE_FIELDS)
  for (const tag of findMergeTags(text)) {
    if (!known.has(tag.field)) problems.push(`Unknown merge tag "${tag.field}". Use one of: ${MERGE_FIELDS.join(', ')}`)
    if (tag.fallback.length > 100) problems.push(`The fallback for "${tag.field}" is too long`)
  }
  const stripped = text.replace(TAG_RE, '')
  if (stripped.includes('{{') || stripped.includes('}}')) {
    problems.push('Found "{{" or "}}" that is not a valid merge tag. Remove it, or write a tag like {{first_name|there}}')
  }
  return problems
}

/** Compile merge tags into Listmonk (Go template) syntax. Throws if the content is not valid. */
export function compileMergeTags(text: string, opts: { html?: boolean } = {}): string {
  const html = opts.html ?? true
  const problems = validateTemplateSyntax(text)
  if (problems.length) throw new ValidationError(problems[0], problems)
  return text.replace(TAG_RE, (_m, field: string, fallback: string | undefined) => {
    const fb = html ? escapeHtml((fallback ?? '').trim()) : (fallback ?? '').trim()
    const value = field === 'name' ? '.Subscriber.Name' : `.Subscriber.Attribs.${field}`
    return `{{ if ${value} }}{{ ${value} }}{{ else }}${fb}{{ end }}`
  })
}

/** Replace merge tags with sample values, for the in app preview. */
export function renderMergePreview(text: string, sample: Partial<Record<MergeField, string>>): string {
  return text.replace(TAG_RE, (_m, field: string, fallback: string | undefined) => {
    const v = sample[field as MergeField]
    return escapeHtml(v && v.trim() ? v : (fallback ?? '').trim())
  })
}

// ---------------------------------------------------------------------------
// Sanitising and email safe styling
// ---------------------------------------------------------------------------
const FONT = "-apple-system,'Segoe UI',Helvetica,Arial,sans-serif"
const STYLES: Record<string, string> = {
  p: `margin:0 0 16px;font-family:${FONT};font-size:16px;line-height:1.6;color:#1C1C1E;`,
  h2: `margin:28px 0 12px;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:600;color:#1C1C1E;`,
  h3: `margin:24px 0 10px;font-family:${FONT};font-size:18px;line-height:1.3;font-weight:600;color:#1C1C1E;`,
  h4: `margin:20px 0 8px;font-family:${FONT};font-size:16px;line-height:1.3;font-weight:600;color:#1C1C1E;`,
  ul: `margin:0 0 16px;padding-left:24px;font-family:${FONT};font-size:16px;line-height:1.6;color:#1C1C1E;`,
  ol: `margin:0 0 16px;padding-left:24px;font-family:${FONT};font-size:16px;line-height:1.6;color:#1C1C1E;`,
  li: 'margin:0 0 6px;',
  blockquote: `margin:0 0 16px;padding:4px 0 4px 16px;border-left:3px solid #C9A84C;color:#4a4a4c;font-family:${FONT};font-size:16px;line-height:1.6;`,
  a: 'color:#1B4332;text-decoration:underline;',
  img: 'max-width:100%;height:auto;border:0;display:block;margin:0 0 16px;',
  hr: 'border:0;border-top:1px solid #E5E5E3;margin:24px 0;',
}

const styled =
  (tagName: string) =>
  (_tag: string, attribs: sanitizeHtml.Attributes): sanitizeHtml.Tag => {
    const extra: Record<string, string> = {}
    if (tagName === 'a') {
      extra.target = '_blank'
      extra.rel = 'noopener noreferrer'
    }
    return { tagName, attribs: { ...attribs, ...extra, style: STYLES[tagName] } }
  }

export function sanitizeEmailHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'h2', 'h3', 'h4', 'strong', 'b', 'em', 'i', 'u', 'a', 'ul', 'ol', 'li', 'blockquote', 'hr', 'img', 'span'],
    // `style` is allowed only on tags we overwrite it for, so author styles never survive.
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel', 'style'],
      img: ['src', 'alt', 'title', 'width', 'height', 'style'],
      p: ['style'], h2: ['style'], h3: ['style'], h4: ['style'], ul: ['style'], ol: ['style'],
      li: ['style'], blockquote: ['style'], hr: ['style'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['https'] },
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    transformTags: {
      p: styled('p'), h2: styled('h2'), h3: styled('h3'), h4: styled('h4'), ul: styled('ul'), ol: styled('ol'),
      li: styled('li'), blockquote: styled('blockquote'), a: styled('a'), img: styled('img'), hr: styled('hr'),
      // The editor can emit h1; keep one heading style for email.
      h1: styled('h2'),
    },
  })
}

// ---------------------------------------------------------------------------
// Plain text alternative
// ---------------------------------------------------------------------------
function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
}

export function htmlToText(html: string): string {
  let t = html
  t = t.replace(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_m, href: string, inner: string) => {
    const label = inner.replace(/<[^>]+>/g, '').trim()
    const url = decodeEntities(href)
    return label && label !== url ? `${label} (${url})` : url
  })
  t = t.replace(/<img\s[^>]*alt="([^"]*)"[^>]*>/gi, (_m, alt: string) => (alt ? `[${alt}]` : ''))
  t = t.replace(/<li[^>]*>/gi, '\n- ').replace(/<\/(p|h[1-6]|ul|ol|blockquote|div)>/gi, '\n\n')
  t = t.replace(/<br\s*\/?>/gi, '\n').replace(/<hr\s*\/?>/gi, '\n----\n')
  t = t.replace(/<[^>]+>/g, '')
  t = decodeEntities(t)
  return t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

// ---------------------------------------------------------------------------
// Assembling the final campaign body
// ---------------------------------------------------------------------------
export type BuiltBody = { html: string; text: string; problems: string[] }

export function buildCampaignBody(input: { html: string; signatureHtml?: string | null; textOverride?: string | null }): BuiltBody {
  const clean = sanitizeEmailHtml(input.html)
  const signature = input.signatureHtml ? sanitizeEmailHtml(input.signatureHtml) : ''
  const merged = signature ? `${clean}\n${signature}` : clean
  const problems = validateTemplateSyntax(merged)
  const textSource = input.textOverride?.trim() ? input.textOverride : htmlToText(merged)
  const textProblems = validateTemplateSyntax(textSource)
  return {
    html: problems.length ? merged : compileMergeTags(merged),
    text: textProblems.length ? textSource : compileMergeTags(textSource, { html: false }),
    problems: [...problems, ...textProblems],
  }
}
