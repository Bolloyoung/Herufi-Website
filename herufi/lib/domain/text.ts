/** Input hygiene shared by imports, public forms and admin edits. */

const ZERO_WIDTH = /[\u200B-\u200D\u2060\uFEFF]/g
// C0 and C1 control characters except tab and newline.
// eslint-disable-next-line no-control-regex
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g

/**
 * Cleans a free text value. Angle brackets are removed outright so a value can
 * never carry markup into an email template, whatever engine renders it.
 */
export function cleanText(value: unknown, max = 200): string | null {
  if (value === null || value === undefined) return null
  let s = String(value).normalize('NFC').replace(ZERO_WIDTH, '').replace(CONTROL, ' ')
  s = s.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim()
  if (!s) return null
  return s.length > max ? s.slice(0, max).trim() : s
}

export function cleanNotes(value: unknown, max = 2000): string | null {
  if (value === null || value === undefined) return null
  let s = String(value).normalize('NFC').replace(ZERO_WIDTH, '').replace(CONTROL, ' ')
  s = s.replace(/[<>]/g, '').replace(/[ \t]+/g, ' ').trim()
  if (!s) return null
  return s.length > max ? s.slice(0, max).trim() : s
}

const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/

export function normaliseEmail(value: unknown): string {
  if (value === null || value === undefined) return ''
  return String(value)
    .replace(ZERO_WIDTH, '')
    .trim()
    .replace(/^mailto:/i, '')
    .replace(/^[<"'\s]+|[>"'\s]+$/g, '')
    .toLowerCase()
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  if (!EMAIL_RE.test(email)) return false
  const [local, domain] = email.split('@')
  if (local.length > 64) return false
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  const tld = domain.slice(domain.lastIndexOf('.') + 1)
  return /^(?:[a-z]{2,}|xn--[a-z0-9]+)$/.test(tld)
}

export function parseTags(value: unknown, delimiter = ','): string[] {
  if (value === null || value === undefined) return []
  const seen = new Set<string>()
  const out: string[] = []
  for (const part of String(value).split(delimiter)) {
    const tag = cleanText(part, 50)
    if (!tag) continue
    const key = tag.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(tag)
    if (out.length >= 20) break
  }
  return out
}

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

/**
 * For values that end up in an email header (subject, display name). Strips every
 * control character, including CR and LF, so a value can never inject a header.
 */
export function cleanHeaderText(value: unknown, max = 200): string {
  if (value === null || value === undefined) return ''
  const s = String(value)
    .normalize('NFC')
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return s.length > max ? s.slice(0, max).trim() : s
}

/** A display name that is safe inside `Name <address>`: no quotes, brackets or separators. */
export function cleanDisplayName(value: unknown, max = 100): string {
  return cleanHeaderText(value, max).replace(/["<>,;:\\]/g, '').replace(/\s+/g, ' ').trim()
}
