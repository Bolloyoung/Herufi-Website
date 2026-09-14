'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
    <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-white border border-border-soft rounded-lg p-8">
        {submitted ? (
          <div role="status">
            <div className="w-10 h-10 rounded-full bg-forest/10 text-forest flex items-center justify-center mb-5">
              <Mail size={18} strokeWidth={1.5} aria-hidden />
            </div>
            <h1 className="text-lg font-semibold text-charcoal mb-2">Check your email</h1>
            <p className="text-sm text-charcoal/65 leading-relaxed">
              We sent a sign in link to <strong className="text-charcoal">{email}</strong>. Open it to reach your member dashboard.
            </p>
            <p className="text-xs text-charcoal/55 mt-5">
              No email? Check your spam folder or{' '}
              <button type="button" onClick={() => setSubmitted(false)} className="text-forest underline underline-offset-2">
                try again
              </button>.
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-charcoal mb-1">Member sign in</h1>
            <p className="text-sm text-charcoal/60 mb-6">Enter your email to receive a sign in link. No password needed.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="field-label">Email address</label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="field"
                />
              </div>
              {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending' : 'Send sign in link'}
              </button>
            </form>

            <p className="text-xs text-charcoal/55 mt-6">
              Not a member yet?{' '}
              <Link href="/contact" className="text-forest hover:text-forest-light underline underline-offset-2">
                Request access
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
