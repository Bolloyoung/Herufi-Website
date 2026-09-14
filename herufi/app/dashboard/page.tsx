'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import { Check, Minus } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { publications } from '@/data/publications'
import { pillars } from '@/data/pillars'

const platformStats = [
  { label: 'Publications', value: publications.length },
  { label: 'Series explainers', value: blogPosts.length },
  { label: 'Research pillars', value: pillars.length },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push('/login')
      } else {
        setUser(data.session.user)
      }
      setLoading(false)
    })
  }, [router])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest text-cream text-lg font-bold flex items-center justify-center">
              {initial}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-forest mb-0.5">Member Portal</p>
              <h1 className="text-2xl font-semibold text-charcoal">Welcome back</h1>
              <p className="text-sm text-charcoal/50">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="btn-secondary"
          >
            Sign out
          </button>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {platformStats.map((stat) => (
            <div key={stat.label} className="bg-white border border-border-soft rounded-lg p-5">
              <p className="text-3xl font-bold text-charcoal mb-1">{stat.value}</p>
              <p className="text-xs text-charcoal/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Latest publications */}
        <div className="bg-white border border-border-soft rounded-lg p-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/40 mb-4">Latest publications</p>
          <ul className="divide-y divide-border-soft">
            {publications.slice(0, 5).map((pub) => (
              <li key={pub.id}>
                <Link href={pub.fileUrl} className="group flex items-baseline justify-between gap-6 py-3">
                  <span className="text-sm font-medium text-charcoal group-hover:underline underline-offset-4 decoration-charcoal/40">{pub.title}</span>
                  <span className="text-xs text-charcoal/55 whitespace-nowrap">{pub.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Member access */}
        <div className="bg-white border border-border-soft rounded-lg p-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-charcoal/40 mb-5">Your access</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Research Intelligence',
                items: ['Full methodology appendices', 'Source database access', 'Advanced research filters'],
                available: true,
              },
              {
                title: 'Analytics and Dashboards',
                items: ['Interactive drilldowns', 'Reliability scores', 'Scenario models'],
                available: true,
              },
              {
                title: 'Data Exports',
                items: ['CSV dataset downloads', 'Model output exports', 'Report downloads'],
                available: false,
              },
            ].map((section) => (
              <div key={section.title} className={`rounded-lg border p-5 ${section.available ? 'border-border-soft' : 'border-border-soft opacity-50'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-sm font-semibold text-charcoal">{section.title}</p>
                  {!section.available && <span className="text-xs text-charcoal/30 ml-auto">Coming soon</span>}
                </div>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className="text-xs text-charcoal/50 flex items-center gap-2">
                      {section.available
                        ? <Check size={12} strokeWidth={2} className="text-forest" aria-hidden />
                        : <Minus size={12} strokeWidth={2} className="text-charcoal/40" aria-hidden />}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Browse blogs', href: '/blogs' },
            { label: 'Publications', href: '/publications' },
            { label: 'About Herufi', href: '/about' },
            { label: 'Contact us', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="btn-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
