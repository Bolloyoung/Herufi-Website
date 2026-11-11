import { describe, expect, it } from 'vitest'
import { transition, isBlockedStatus, statusFromSuppression, type ConsentEventType, type Initiator } from '@/lib/domain/consent'
import { CONTACT_STATUSES, type ContactStatus } from '@/lib/domain/types'

const EVENTS: ConsentEventType[] = [
  'request_confirmation', 'confirm', 'record_external_consent', 'unsubscribe',
  'bounce', 'complaint', 'suppress', 'mark_invalid', 'clear_suppression',
]
const INITIATORS: Initiator[] = ['subscriber', 'admin', 'system']

describe('consent state machine', () => {
  it('only ever reaches subscribed through the documented paths', () => {
    const reached: string[] = []
    for (const from of CONTACT_STATUSES) {
      for (const event of EVENTS) {
        for (const initiator of INITIATORS) {
          const r = transition(from, event, { initiator })
          if (r.ok && r.to === 'subscribed' && from !== 'subscribed') reached.push(`${from} --${event}--> subscribed`)
        }
      }
    }
    // Everything that can make a non subscribed contact subscribed:
    expect(Array.from(new Set(reached)).sort()).toEqual([
      'imported_pending_consent --record_external_consent--> subscribed',
      'pending_confirmation --confirm--> subscribed',
      'pending_confirmation --record_external_consent--> subscribed',
    ])
  })

  it('never lets staff trigger a consent request, only the subscriber', () => {
    for (const from of CONTACT_STATUSES) {
      expect(transition(from, 'request_confirmation', { initiator: 'admin' }).ok).toBe(false)
      expect(transition(from, 'request_confirmation', { initiator: 'system' }).ok).toBe(false)
      expect(transition(from, 'request_confirmation').ok).toBe(false)
    }
  })

  it('lets an unsubscribed person opt back in themselves, but not staff', () => {
    expect(transition('unsubscribed', 'request_confirmation', { initiator: 'subscriber' })).toEqual({
      ok: true, to: 'pending_confirmation', changed: true,
    })
    expect(transition('unsubscribed', 'record_external_consent').ok).toBe(false)
  })

  it('does not let a blocked address be re-subscribed by form, confirmation or recorded consent', () => {
    for (const from of ['bounced', 'complained', 'suppressed', 'invalid'] as ContactStatus[]) {
      expect(isBlockedStatus(from)).toBe(true)
      expect(transition(from, 'request_confirmation', { initiator: 'subscriber' }).ok).toBe(false)
      expect(transition(from, 'confirm').ok).toBe(false)
      expect(transition(from, 'record_external_consent').ok).toBe(false)
    }
  })

  it('restores a blocked contact only to "no consent", never straight to subscribed', () => {
    for (const from of ['bounced', 'complained', 'suppressed', 'invalid', 'unsubscribed'] as ContactStatus[]) {
      expect(transition(from, 'clear_suppression')).toEqual({ ok: true, to: 'imported_pending_consent', changed: true })
    }
    expect(transition('subscribed', 'clear_suppression').ok).toBe(false)
  })

  it('treats unsubscribe as always safe and never weakens a stronger block', () => {
    expect(transition('subscribed', 'unsubscribe')).toMatchObject({ ok: true, to: 'unsubscribed' })
    expect(transition('imported_pending_consent', 'unsubscribe')).toMatchObject({ ok: true, to: 'unsubscribed' })
    expect(transition('pending_confirmation', 'unsubscribe')).toMatchObject({ ok: true, to: 'unsubscribed' })
    for (const from of ['bounced', 'complained', 'suppressed', 'invalid'] as ContactStatus[]) {
      expect(transition(from, 'unsubscribe')).toMatchObject({ ok: true, to: from, changed: false })
    }
  })

  it('orders severity: complained beats suppressed beats bounced', () => {
    expect(transition('subscribed', 'bounce')).toMatchObject({ to: 'bounced' })
    expect(transition('bounced', 'complaint')).toMatchObject({ to: 'complained' })
    expect(transition('complained', 'bounce')).toMatchObject({ to: 'complained', changed: false })
    expect(transition('suppressed', 'bounce')).toMatchObject({ to: 'suppressed', changed: false })
    expect(transition('complained', 'suppress')).toMatchObject({ to: 'complained', changed: false })
    expect(transition('subscribed', 'suppress')).toMatchObject({ to: 'suppressed' })
  })

  it('subscribing again through the form while already subscribed stays subscribed', () => {
    expect(transition('subscribed', 'request_confirmation', { initiator: 'subscriber' })).toEqual({
      ok: true, to: 'subscribed', changed: false,
    })
  })

  it('maps suppression reasons to the matching contact status', () => {
    expect(statusFromSuppression('unsubscribed')).toBe('unsubscribed')
    expect(statusFromSuppression('manual')).toBe('suppressed')
    expect(statusFromSuppression('bounced')).toBe('bounced')
    expect(statusFromSuppression('complained')).toBe('complained')
    expect(statusFromSuppression('invalid')).toBe('invalid')
  })
})
