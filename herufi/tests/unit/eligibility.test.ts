import { describe, expect, it } from 'vitest'
import { classify, summarise, type RecipientInput } from '@/lib/integrations/email/eligibility'
import { CONTACT_STATUSES } from '@/lib/domain/types'
import { canSendTo, matchesAllowlist, recipientFilter } from '@/lib/integrations/email/send-guard'

const base: RecipientInput = {
  contactId: 'c1', email: 'a@example.org', status: 'subscribed',
  archived: false, membershipConsented: true, globallySuppressed: false,
}

describe('recipient eligibility', () => {
  it('accepts a subscribed, consented, unsuppressed member', () => {
    expect(classify(base)).toEqual({ eligible: true })
  })

  it('excludes every status except subscribed, each with its own reason', () => {
    const expected: Record<string, string> = {
      imported_pending_consent: 'not_consented',
      pending_confirmation: 'pending_confirmation',
      unsubscribed: 'unsubscribed',
      bounced: 'bounced',
      complained: 'complained',
      suppressed: 'suppressed',
      invalid: 'invalid',
    }
    for (const status of CONTACT_STATUSES) {
      if (status === 'subscribed') continue
      expect(classify({ ...base, status })).toEqual({ eligible: false, reason: expected[status] })
    }
  })

  it('excludes an address on the global suppression list even if the contact says subscribed', () => {
    expect(classify({ ...base, globallySuppressed: true })).toEqual({ eligible: false, reason: 'suppressed' })
  })

  it('requires consent for the specific audience', () => {
    expect(classify({ ...base, membershipConsented: false })).toEqual({ eligible: false, reason: 'not_consented' })
  })

  it('excludes archived contacts first', () => {
    expect(classify({ ...base, archived: true, status: 'bounced' })).toEqual({ eligible: false, reason: 'archived' })
  })

  it('counts and explains exclusions for the review screen', () => {
    const list: RecipientInput[] = [
      base,
      { ...base, contactId: 'c2', email: 'b@example.org' },
      { ...base, contactId: 'c3', email: 'c@example.org', status: 'unsubscribed' },
      { ...base, contactId: 'c4', email: 'd@example.org', status: 'bounced' },
      { ...base, contactId: 'c5', email: 'e@example.org', status: 'imported_pending_consent' },
      { ...base, contactId: 'c6', email: 'f@example.org', status: 'pending_confirmation' },
    ]
    const s = summarise(list)
    expect(s.total).toBe(6)
    expect(s.eligible.map((r) => r.contactId)).toEqual(['c1', 'c2'])
    expect(s.excludedCounts).toEqual({ unsubscribed: 1, bounced: 1, not_consented: 1, pending_confirmation: 1 })
  })

  it('applies the test allowlist as an extra exclusion', () => {
    const allow = (e: string) => e.endsWith('@herufi.org')
    expect(classify({ ...base, email: 'x@herufi.org' }, { allow })).toEqual({ eligible: true })
    expect(classify(base, { allow })).toEqual({ eligible: false, reason: 'outside_allowlist' })
  })
})

describe('send guard', () => {
  const allowlist = ['qa@herufi.org', '@test.example']
  it('matches full addresses and @domain entries case insensitively', () => {
    expect(matchesAllowlist('QA@herufi.org', allowlist)).toBe(true)
    expect(matchesAllowlist('anyone@test.example', allowlist)).toBe(true)
    expect(matchesAllowlist('boss@herufi.org', allowlist)).toBe(false)
    expect(matchesAllowlist('x@evil.test.example.com', allowlist)).toBe(false)
  })
  it('sends to nobody when disabled, only the allowlist in allowlist mode, anyone when live', () => {
    expect(canSendTo('qa@herufi.org', 'disabled', allowlist)).toBe(false)
    expect(canSendTo('qa@herufi.org', 'allowlist', allowlist)).toBe(true)
    expect(canSendTo('other@x.org', 'allowlist', allowlist)).toBe(false)
    expect(canSendTo('other@x.org', 'live', allowlist)).toBe(true)
  })
  it('only applies a recipient filter outside live mode', () => {
    expect(recipientFilter('live', allowlist)).toBeUndefined()
    expect(recipientFilter('allowlist', allowlist)!('qa@herufi.org')).toBe(true)
    expect(recipientFilter('disabled', allowlist)!('qa@herufi.org')).toBe(false)
  })
})
