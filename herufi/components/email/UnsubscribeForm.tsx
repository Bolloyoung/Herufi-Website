'use client'

import Link from 'next/link'
import { useState } from 'react'

type State = 'ready' | 'working' | 'done' | 'failed'

/** One press unsubscribes. The signed link in the email is the only authority needed. */
export default function UnsubscribeForm({ token, campaign }: { token: string; campaign?: string }) {
  const [state, setState] = useState<State>('ready')
  const [message, setMessage] = useState('')

  async function unsubscribe() {
    setState('working')
    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, campaign }),
      })
      if (res.ok) {
        setState('done')
        return
      }
      const body = await res.json().catch(() => null)
      setMessage(body?.error?.message ?? 'We could not unsubscribe you.')
      setState('failed')
    } catch {
      setMessage('We could not reach the server. Please try again in a moment.')
      setState('failed')
    }
  }

  if (state === 'done') {
    return (
      <div role="status">
        <h1 className="font-serif text-2xl text-charcoal mb-3">You have been unsubscribed</h1>
        <p className="text-sm text-charcoal/65 mb-6">
          You will not receive any more email from us. If this was a mistake, you can subscribe again from the home page.
        </p>
        <Link href="/" className="btn-secondary">Back to the home page</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-3">Unsubscribe from Herufi updates</h1>
      <p className="text-sm text-charcoal/65 mb-6">Press the button to stop receiving email from Herufi. It takes effect straight away.</p>
      {state === 'failed' && <p className="text-sm text-red-700 mb-4" role="alert">{message}</p>}
      <button type="button" onClick={unsubscribe} disabled={state === 'working'} className="btn-primary">
        {state === 'working' ? 'Unsubscribing' : state === 'failed' ? 'Try again' : 'Unsubscribe'}
      </button>
    </div>
  )
}
