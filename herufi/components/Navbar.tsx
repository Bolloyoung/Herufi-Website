'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/data/navigation'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const initial = user?.email?.charAt(0).toUpperCase() ?? ''

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream border-b border-border-soft">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center" aria-label="Herufi home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`text-sm font-medium transition-colors duration-150 ${
                  active ? 'text-charcoal' : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-charcoal/60 hover:text-charcoal transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-forest text-cream text-xs font-semibold flex items-center justify-center hover:bg-forest-light transition-colors"
                title={user.email}
              >
                {initial}
              </Link>
            </>
          ) : (
            <Link href="/contact" className="btn-primary px-4 py-2">
              Work with Herufi
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 -mr-2 text-charcoal"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="lg:hidden bg-cream border-t border-border-soft px-6 py-3" aria-label="Primary">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname)
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`block py-3 text-base border-b border-border-soft last:border-0 ${
                  active ? 'font-semibold text-charcoal' : 'font-medium text-charcoal/70'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <div className="py-4">
            {user ? (
              <Link href="/dashboard" className="btn-primary w-full">
                Dashboard
              </Link>
            ) : (
              <Link href="/contact" className="btn-primary w-full">
                Work with Herufi
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
