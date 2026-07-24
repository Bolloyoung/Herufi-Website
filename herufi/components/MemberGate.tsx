'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type MemberGateProps = {
  children: React.ReactNode
  preview?: React.ReactNode
  featureLabel?: string
}

export default function MemberGate({ children, preview, featureLabel = 'full access' }: MemberGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsAuthenticated(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="animate-pulse bg-gray-soft rounded-xl h-32 border border-border-soft" />
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {preview && (
        <div className="relative overflow-hidden rounded-xl">
          <div className="pointer-events-none select-none opacity-40 blur-[2px]">
            {preview}
          </div>
        </div>
      )}
      <div className={`${preview ? 'mt-0 rounded-b-xl border-t-0' : 'rounded-xl'} bg-white border border-border-soft p-8 text-center`}>
        <div className="w-10 h-10 rounded-full bg-forest/8 flex items-center justify-center mx-auto mb-4">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1B4332" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
        </div>
        <h3 className="text-base font-semibold text-charcoal mb-2">Members only</h3>
        <p className="text-sm text-charcoal/55 mb-5 max-w-xs mx-auto">
          Sign in or request access to unlock {featureLabel}, advanced dashboards, full methodology and source data.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className="text-sm font-medium bg-charcoal text-cream px-5 py-2.5 rounded hover:bg-forest transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium border border-charcoal/20 text-charcoal px-5 py-2.5 rounded hover:border-forest hover:text-forest transition-colors"
          >
            Request access
          </Link>
        </div>
      </div>
    </div>
  )
}
