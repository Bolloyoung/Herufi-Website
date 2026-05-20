'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navLinks } from '@/data/navigation'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/Logo'

function isActive(href: string, pathname: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cream/95 backdrop-blur-sm shadow-sm border-b border-border-soft' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative nav-link text-sm font-medium transition-colors duration-200 pb-0.5 ${
                  active
                    ? 'text-forest after:!w-full'
                    : 'text-charcoal/60 hover:text-charcoal'
                }`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 h-px bg-forest transition-all duration-300 ${
                    active ? 'w-full' : 'w-0'
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm font-medium bg-charcoal text-cream px-4 py-2 rounded hover:bg-forest transition-colors duration-200"
          >
            Work With Herufi
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-charcoal"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-cream border-t border-border-soft px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => {
            const active = isActive(link.href, pathname)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`py-2.5 text-sm font-medium border-b border-border-soft last:border-0 flex items-center justify-between ${
                  active ? 'text-forest' : 'text-charcoal/70'
                }`}
              >
                {link.label}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-forest" />}
              </Link>
            )
          })}
          <Link
            href="/contact"
            className="mt-3 text-center text-sm font-medium bg-charcoal text-cream px-4 py-2.5 rounded"
          >
            Work With Herufi
          </Link>
        </div>
      )}
    </header>
  )
}
