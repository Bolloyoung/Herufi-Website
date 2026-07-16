'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-24">
      <Link href="/" className="mb-10">
        <Logo />
      </Link>

      <div className="w-full max-w-sm bg-white border border-border-soft rounded-2xl p-8">
        {submitted ? (
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-forest/8 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.81a19.79 19.79 0 01-3.07-8.64A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">Check your email</h2>
            <p className="text-sm text-charcoal/55">
              We sent a login link to <strong>{email}</strong>. Click it to access your member dashboard.
            </p>
            <p className="text-xs text-charcoal/40 mt-4">No email? Check your spam folder, or <button onClick={() => setSubmitted(false)} className="text-forest underline">try again</button>.</p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-charcoal mb-1">Sign in to Herufi</h1>
            <p className="text-sm text-charcoal/50 mb-6">Enter your email to receive a sign-in link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full border border-border-soft rounded-lg px-3 py-2.5 text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-forest transition-colors"
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-charcoal text-cream text-sm font-medium py-2.5 rounded-lg hover:bg-forest transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send login link'}
              </button>
            </form>

            <p className="text-xs text-charcoal/40 mt-5 text-center">
              Don&apos;t have access?{' '}
              <Link href="/contact" className="text-forest hover:text-forest-light">
                Request membership
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
