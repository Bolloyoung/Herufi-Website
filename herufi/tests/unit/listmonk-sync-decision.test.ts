import { describe, expect, it } from 'vitest'
import { decidePush, type DesiredList } from '@/lib/integrations/listmonk/sync'
import type { ListmonkSubscriber } from '@/lib/integrations/listmonk/schemas'

const T1 = '2026-11-01T10:00:00.000Z'
const T2 = '2026-11-05T10:00:00.000Z'
const want = (listId: number, consentConfirmedAt: string | null = T1): DesiredList => ({ listId, audienceId: `a${listId}`, consentConfirmedAt })
const sub = (over: Partial<ListmonkSubscriber> = {}): ListmonkSubscriber => ({ id: 7, email: 'a@example.org', name: 'A', status: 'enabled', attribs: {}, lists: [], ...over })
const on = (id: number, status: 'unconfirmed' | 'confirmed' | 'unsubscribed', at?: string) => ({ id, subscription_status: status, ...(at ? { subscription_updated_at: at } : {}) })

describe('decidePush', () => {
  it('creates a subscriber who does not exist yet, on every wanted list', () => {
    expect(decidePush([want(3), want(4)], null)).toEqual({ action: 'create', listIds: [3, 4] })
  })
  it('skips a contact with nothing to subscribe to', () => {
    expect(decidePush([], null)).toEqual({ action: 'skip' })
  })
  it('lets a Listmonk blocklist win', () => {
    expect(decidePush([want(3)], sub({ status: 'blocklisted' }))).toEqual({ action: 'adopt_blocklist', subscriberId: 7 })
  })
  it('does nothing risky when they are already confirmed on the list', () => {
    expect(decidePush([want(3)], sub({ lists: [on(3, 'confirmed')] }))).toEqual({ action: 'update', subscriberId: 7, addListIds: [], removeListIds: [] })
  })
  it('adds a missing list and confirms an unconfirmed one', () => {
    const d = decidePush([want(3), want(4)], sub({ lists: [on(3, 'unconfirmed')] }))
    expect(d).toEqual({ action: 'update', subscriberId: 7, addListIds: [3, 4], removeListIds: [] })
  })
  it('adopts a Listmonk unsubscribe that happened after consent, instead of re-adding them', () => {
    // consent T1, unsubscribed in Listmonk later at T2
    expect(decidePush([want(3, T1)], sub({ lists: [on(3, 'unsubscribed', T2)] }))).toEqual({ action: 'adopt_unsubscribe', subscriberId: 7 })
  })
  it('re-adds them only when they gave NEW consent after that unsubscribe', () => {
    // unsubscribed T1, opted back in T2
    expect(decidePush([want(3, T2)], sub({ lists: [on(3, 'unsubscribed', T1)] }))).toMatchObject({ action: 'update', addListIds: [3] })
  })
  it('treats an unsubscribe and a consent at the same instant as an unsubscribe', () => {
    expect(decidePush([want(3, T1)], sub({ lists: [on(3, 'unsubscribed', T1)] }))).toMatchObject({ action: 'adopt_unsubscribe' })
  })
  it('does not re-add when the timestamps are missing or unreadable', () => {
    expect(decidePush([want(3, null)], sub({ lists: [on(3, 'unsubscribed', T1)] }))).toMatchObject({ action: 'adopt_unsubscribe' })
    expect(decidePush([want(3, T2)], sub({ lists: [on(3, 'unsubscribed')] }))).toMatchObject({ action: 'adopt_unsubscribe' })
    expect(decidePush([want(3, 'garbage')], sub({ lists: [on(3, 'unsubscribed', T1)] }))).toMatchObject({ action: 'adopt_unsubscribe' })
  })
  it('one unsubscribed list means the person is unsubscribed everywhere', () => {
    const d = decidePush([want(3, T1), want(4, T1)], sub({ lists: [on(3, 'confirmed'), on(4, 'unsubscribed', T2)] }))
    expect(d.action).toBe('adopt_unsubscribe')
  })
  it('removes them from lists they are no longer consented to, but leaves already unsubscribed ones alone', () => {
    const d = decidePush([want(3)], sub({ lists: [on(3, 'confirmed'), on(4, 'confirmed'), on(5, 'unsubscribed', T1)] }))
    expect(d).toEqual({ action: 'update', subscriberId: 7, addListIds: [], removeListIds: [4] })
  })
})
