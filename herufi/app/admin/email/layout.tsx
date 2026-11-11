'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState, type ReactNode } from 'react'
import { api } from '@/lib/admin/api'
import { supabase } from '@/lib/supabase'
import { Spinner } from '@/components/admin/ui'

const NAV = [
  { href: '/admin/email', label: 'Overview', exact: true },
  { href: '/admin/email/campaigns', label: 'Campaigns' },
  { href: '/admin/email/contacts', label: 'Contacts' },
  { href: '/admin/email/audiences', label: 'Audiences' },
  { href: '/admin/email/imports', label: 'Imports' },
  { href: '/admin/email/settings', label: 'Senders and templates' },
]

type Gate = 'loading' | 'anonymous' | 'denied' | 'unavailable' | 'ok'

/** Access gate for the whole email area. The server checks every request again, so this is only for a clear message. */
export default function AdminEmailLayout({ children }: { children: ReactNode }) {
  const [gate, setGate] = useState<Gate>('loading')
  const [who, setWho] = useState('')
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) { if (!cancelled) setGate('anonymous'); return }
      try {
        const me = await api<{ email: string }>('/api/whoami')
        if (!cancelled) { setWho(me.email); setGate('ok') }
      } catch (e) {
        const status = (e as { status?: number }).status
        if (!cancelled) setGate(status === 403 ? 'denied' : status === 401 ? 'anonymous' : 'unavailable')
      }
    })()
    return () => { cancelled = true }
  }, [])

  if (gate === 'loading') return <div className="min-h-[60vh] flex items-center justify-center"><Spinner label="Checking access" /></div>

  if (gate !== 'ok') {
    const copy = {
      anonymous: { title: 'Sign in to continue', body: 'The email area is for Herufi administrators.', cta: { href: '/login', label: 'Sign in' } },
      denied: { title: 'Administrator access is required', body: 'You are signed in, but this account is not on the administrator list.', cta: { href: '/dashboard', label: 'Back to your dashboard' } },
      unavailable: { title: 'The email platform is not available', body: 'The server could not confirm your access. Check that the platform settings are in place, then try again.', cta: { href: '/dashboard', label: 'Back to your dashboard' } },
    }[gate]
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="max-w-md rounded-lg border border-border-soft bg-white p-8 text-center">
          <h1 className="font-serif text-2xl text-charcoal mb-2">{copy.title}</h1>
          <p className="text-sm text-charcoal/65 mb-6">{copy.body}</p>
          <Link href={copy.cta.href} className="btn-primary">{copy.cta.label}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-cream min-h-[calc(100vh-4rem)]">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:grid lg:grid-cols-[13rem_1fr] lg:gap-10">
        <aside className="mb-8 lg:mb-0">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-forest mb-3">Email</p>
          <nav aria-label="Email sections" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {NAV.map((n) => {
              const active = n.exact ? pathname === n.href : pathname === n.href || pathname.startsWith(n.href + '/')
              return (
                <Link key={n.href} href={n.href} aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${active ? 'bg-forest text-cream' : 'text-charcoal/70 hover:bg-white hover:text-charcoal'}`}>
                  {n.label}
                </Link>
              )
            })}
          </nav>
          <p className="mt-6 hidden text-xs text-charcoal/50 lg:block">Signed in as<br />{who}</p>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  )
}
