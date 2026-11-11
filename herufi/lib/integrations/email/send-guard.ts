import { sendMode, testAllowlist, type SendMode } from '@/lib/server/env'
import { ForbiddenError } from '@/lib/server/errors'

/**
 * Safe development mode. In `disabled` nothing may be sent, and in `allowlist`
 * only addresses on EMAIL_TEST_ALLOWLIST (full addresses, or "@domain.com"
 * entries) can receive email. Only `live` reaches real recipients, and that is
 * refused unless APP_ENV is production.
 */
export function matchesAllowlist(email: string, allowlist: string[]): boolean {
  const e = email.trim().toLowerCase()
  const domain = e.slice(e.lastIndexOf('@'))
  return allowlist.some((entry) => entry === e || (entry.startsWith('@') && entry === domain))
}

export function canSendTo(email: string, mode: SendMode = sendMode(), allowlist: string[] = testAllowlist()): boolean {
  if (mode === 'live') return true
  if (mode === 'allowlist') return matchesAllowlist(email, allowlist)
  return false
}

/** Predicate for recipient filtering, or undefined when no restriction applies. */
export function recipientFilter(mode: SendMode = sendMode(), allowlist: string[] = testAllowlist()) {
  if (mode === 'live') return undefined
  return (email: string) => canSendTo(email, mode, allowlist)
}

export function assertCanSend(what: string, mode: SendMode = sendMode()): void {
  if (mode === 'disabled') {
    throw new ForbiddenError(`${what} is turned off in this environment (EMAIL_SEND_MODE is disabled)`)
  }
}

export function assertAllCanReceive(emails: string[], what: string): void {
  const mode = sendMode()
  assertCanSend(what, mode)
  const blocked = emails.filter((e) => !canSendTo(e, mode))
  if (blocked.length) {
    throw new ForbiddenError(
      `${what} is limited to the test allowlist in this environment. Not allowed: ${blocked.length} address(es).`,
    )
  }
}
