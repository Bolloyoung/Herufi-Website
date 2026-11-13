import type { ContactStatus } from '@/lib/domain/types'

export type Exclusion =
  | 'archived'
  | 'complained'
  | 'bounced'
  | 'suppressed'
  | 'unsubscribed'
  | 'invalid'
  | 'pending_confirmation'
  | 'not_consented'
  | 'outside_allowlist'

export const EXCLUSION_LABELS: Record<Exclusion, string> = {
  archived: 'Archived',
  complained: 'Marked the email as spam',
  bounced: 'Address bounced',
  suppressed: 'Suppressed',
  unsubscribed: 'Unsubscribed',
  invalid: 'Invalid address',
  pending_confirmation: 'Has not confirmed yet',
  not_consented: 'No recorded consent for this audience',
  outside_allowlist: 'Not on the test allowlist',
}

export type RecipientInput = {
  contactId: string
  email: string
  status: ContactStatus
  archived: boolean
  /** Consent recorded for the audience being sent to. */
  membershipConsented: boolean
  /** The address appears on the global suppression list. */
  globallySuppressed: boolean
}

export type Classification = { eligible: true } | { eligible: false; reason: Exclusion }

/**
 * The single definition of "may receive this campaign". Used to count
 * recipients on the review screen, to decide who is pushed to Listmonk, and to
 * re-check immediately before sending.
 */
export function classify(r: RecipientInput, opts: { allow?: (email: string) => boolean } = {}): Classification {
  if (r.archived) return { eligible: false, reason: 'archived' }
  switch (r.status) {
    case 'complained':
      return { eligible: false, reason: 'complained' }
    case 'bounced':
      return { eligible: false, reason: 'bounced' }
    case 'suppressed':
      return { eligible: false, reason: 'suppressed' }
    case 'unsubscribed':
      return { eligible: false, reason: 'unsubscribed' }
    case 'invalid':
      return { eligible: false, reason: 'invalid' }
    case 'pending_confirmation':
      return { eligible: false, reason: 'pending_confirmation' }
    case 'imported_pending_consent':
      return { eligible: false, reason: 'not_consented' }
    case 'subscribed':
      break
  }
  if (r.globallySuppressed) return { eligible: false, reason: 'suppressed' }
  if (!r.membershipConsented) return { eligible: false, reason: 'not_consented' }
  if (opts.allow && !opts.allow(r.email)) return { eligible: false, reason: 'outside_allowlist' }
  return { eligible: true }
}

export type EligibilitySummary = {
  total: number
  eligible: RecipientInput[]
  excluded: Array<{ recipient: RecipientInput; reason: Exclusion }>
  excludedCounts: Partial<Record<Exclusion, number>>
}

export function summarise(
  recipients: RecipientInput[],
  opts: { allow?: (email: string) => boolean } = {},
): EligibilitySummary {
  const eligible: RecipientInput[] = []
  const excluded: EligibilitySummary['excluded'] = []
  const excludedCounts: Partial<Record<Exclusion, number>> = {}
  for (const recipient of recipients) {
    const c = classify(recipient, opts)
    if (c.eligible) {
      eligible.push(recipient)
    } else {
      excluded.push({ recipient, reason: c.reason })
      excludedCounts[c.reason] = (excludedCounts[c.reason] ?? 0) + 1
    }
  }
  return { total: recipients.length, eligible, excluded, excludedCounts }
}
