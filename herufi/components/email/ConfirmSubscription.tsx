'use client'

import Link from 'next/link'
import { useState } from 'react'

type State = 'ready' | 'working' | 'done' | 'failed'

/**
 * The emailed link opens this page, and the subscription is only confirmed when
 * the person presses the button. Mail security scanners open links on their own,
 * and a scanner must never be able to subscribe someone.
 */
export default function ConfirmSubscription({ token }: { token: string }) {
  const [state, setState] = useState<State>('ready')
  const [message, setMessage] = useState('')

  async function confirm() {
    setState('working')
    try {
      const res = await fetch('/api/subscribe/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (res.ok) {
        setState('done')
        return
      }
      const body = await res.json().catch(() => null)
      setMessage(body?.error?.message ?? 'We could not confirm your subscription.')
      setState('failed')
    } catch {
      setMessage('We could not reach the server. Please check your connection and try again.')
      setState('failed')
    }
  }

  if (!token) {
    return (
      <div>
        <h1 className="font-serif text-2xl text-charcoal mb-3">This link is incomplete</h1>
        <p className="text-sm text-charcoal/65 mb-6">Open the link from the confirmation email, or sign up again.</p>
        <Link href="/" className="btn-secondary">Back to the home page</Link>
      </div>
    )
  }

  if (state === 'done') {
    return (
      <div role="status">
        <h1 className="font-serif text-2xl text-charcoal mb-3">You are subscribed</h1>
        <p className="text-sm text-charcoal/65 mb-6">
          Thank you. We will email you when new research is published. Every email has an unsubscribe link.
        </p>
        <Link href="/blogs" className="btn-primary">Read the latest blogs</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-charcoal mb-3">Confirm your subscription</h1>
      <p className="text-sm text-charcoal/65 mb-6">
        Press the button to confirm that you want to receive email updates from Herufi. You can unsubscribe at any time.
      </p>
      {state === 'failed' && <p className="text-sm text-red-700 mb-4" role="alert">{message}</p>}
      <button type="button" onClick={confirm} disabled={state === 'working'} className="btn-primary">
        {state === 'working' ? 'Confirming' : state === 'failed' ? 'Try again' : 'Confirm subscription'}
      </button>
    </div>
  )
}
