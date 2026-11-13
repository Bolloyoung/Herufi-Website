import type { ContactStatus } from './types'

/**
 * The consent state machine. Pure and exhaustive, so every rule about who may
 * become subscribed, and who may never be re-subscribed by accident, lives in
 * one place and is covered by tests.
 *
 * Principles:
 *  - Nothing makes a contact subscribed except a confirmed double opt in, or an
 *    administrator recording evidence of consent obtained elsewhere.
 *  - An import, a sync or a plain admin edit never changes a status towards
 *    subscribed. They can only move a contact towards a more restrictive state.
 *  - Bounced, complained, suppressed and invalid contacts can only be restored
 *    by an explicit administrator action that names a reason.
 */

export type ConsentEventType =
  | 'request_confirmation'
  | 'confirm'
  | 'record_external_consent'
  | 'unsubscribe'
  | 'bounce'
  | 'complaint'
  | 'suppress'
  | 'mark_invalid'
  | 'clear_suppression'

export type Initiator = 'subscriber' | 'admin' | 'system'

export type TransitionResult =
  | { ok: true; to: ContactStatus; changed: boolean }
  | { ok: false; reason: string }

const ok = (from: ContactStatus, to: ContactStatus): TransitionResult => ({ ok: true, to, changed: from !== to })
const no = (reason: string): TransitionResult => ({ ok: false, reason })

const BLOCKED: ReadonlySet<ContactStatus> = new Set<ContactStatus>(['bounced', 'complained', 'suppressed', 'invalid'])

export function isBlockedStatus(status: ContactStatus): boolean {
  return BLOCKED.has(status)
}

export function transition(
  from: ContactStatus,
  event: ConsentEventType,
  ctx: { initiator?: Initiator } = {},
): TransitionResult {
  switch (event) {
    case 'request_confirmation': {
      // Only the person themselves can ask to be subscribed. Staff cannot
      // trigger consent request emails, so an import cannot become outreach.
      if (ctx.initiator !== 'subscriber') return no('Only the subscriber can request to be subscribed')
      if (BLOCKED.has(from)) return no('This address cannot be subscribed without administrator review')
      if (from === 'subscribed') return ok(from, 'subscribed')
      return ok(from, 'pending_confirmation')
    }

    case 'confirm': {
      if (from === 'pending_confirmation') return ok(from, 'subscribed')
      if (from === 'subscribed') return ok(from, 'subscribed')
      return no('This contact is not awaiting confirmation')
    }

    case 'record_external_consent': {
      if (from === 'unsubscribed') return no('This contact has unsubscribed and must opt in again themselves')
      if (BLOCKED.has(from)) return no('Clear the suppression first, with a reason, before recording consent')
      return ok(from, 'subscribed')
    }

    case 'unsubscribe': {
      // Always safe. A blocked contact stays blocked, which is the stronger state.
      if (BLOCKED.has(from)) return ok(from, from)
      return ok(from, 'unsubscribed')
    }

    case 'bounce': {
      if (from === 'complained' || from === 'suppressed') return ok(from, from)
      return ok(from, 'bounced')
    }

    case 'complaint': {
      if (from === 'suppressed') return ok(from, from)
      return ok(from, 'complained')
    }

    case 'suppress': {
      if (from === 'complained') return ok(from, from)
      return ok(from, 'suppressed')
    }

    case 'mark_invalid': {
      if (from === 'imported_pending_consent' || from === 'pending_confirmation' || from === 'subscribed') {
        return ok(from, 'invalid')
      }
      return ok(from, from)
    }

    case 'clear_suppression': {
      if (BLOCKED.has(from) || from === 'unsubscribed') return ok(from, 'imported_pending_consent')
      return no('This contact is not suppressed')
    }
  }
}

/** A contact can only receive marketing email while subscribed. */
export function isSubscribed(status: ContactStatus): boolean {
  return status === 'subscribed'
}

/** Map a global suppression reason to the contact status it implies. */
export function statusFromSuppression(reason: 'unsubscribed' | 'bounced' | 'complained' | 'manual' | 'invalid'): ContactStatus {
  switch (reason) {
    case 'unsubscribed':
      return 'unsubscribed'
    case 'bounced':
      return 'bounced'
    case 'complained':
      return 'complained'
    case 'invalid':
      return 'invalid'
    case 'manual':
      return 'suppressed'
  }
}
