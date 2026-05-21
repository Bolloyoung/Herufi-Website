'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts'

const pillarData = [
  { name: 'Venture Strategy', value: 1, color: '#1B4332' },
  { name: 'Markets & Economies', value: 1, color: '#2D6A4F' },
  { name: 'Climate & Energy', value: 1, color: '#4A8C6F' },
  { name: 'Data & Analytics', value: 1, color: '#C9A84C' },
  { name: 'Sports Business', value: 1, color: '#E8C96A' },
  { name: 'Culture & Context', value: 1, color: '#8B7355' },
]

const timelineData = [
  { period: 'Q3 2024', articles: 1 },
  { period: 'Q4 2024', articles: 2 },
  { period: 'Q1 2025', articles: 2 },
  { period: 'Q2 2025', articles: 0 },
  { period: 'Q3 2025', articles: 1 },
]

const platformStats = [
  { label: 'Research articles', value: 6 },
  { label: 'Frameworks', value: 10 },
  { label: 'Reports', value: 7 },
  { label: 'Data tools', value: 6 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-charcoal text-cream text-xs px-3 py-2 rounded-lg shadow-lg">
        <p className="font-semibold mb-0.5">{label || payload[0]?.name}</p>
        <p>{payload[0]?.value} {payload[0]?.dataKey === 'articles' ? 'article(s)' : ''}</p>
      </div>
    )
  }
  return null
}

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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-forest border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="min-h-screen bg-cream pt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-forest text-cream text-lg font-bold flex items-center justify-center">
              {initial}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest mb-0.5">Member Portal</p>
              <h1 className="text-2xl font-semibold text-charcoal">Welcome back</h1>
              <p className="text-sm text-charcoal/50">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-charcoal/40 hover:text-charcoal transition-colors border border-border-soft px-4 py-2 rounded-lg"
          >
            Sign out
          </button>
        </div>

        {/* Platform stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {platformStats.map((stat) => (
            <div key={stat.label} className="bg-white border border-border-soft rounded-xl p-5">
              <p className="text-3xl font-bold text-charcoal mb-1">{stat.value}</p>
              <p className="text-xs text-charcoal/40">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* Research by pillar */}
          <div className="bg-white border border-border-soft rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-1">Research distribution</p>
            <h3 className="text-base font-semibold text-charcoal mb-4">Articles by pillar</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pillarData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pillarData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {pillarData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-charcoal/55 truncate">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Research timeline */}
          <div className="bg-white border border-border-soft rounded-2xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-1">Research output</p>
            <h3 className="text-base font-semibold text-charcoal mb-4">Articles published by quarter</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={timelineData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E3" />
                <XAxis dataKey="period" tick={{ fontSize: 10, fill: '#1C1C1E99' }} />
                <YAxis tick={{ fontSize: 10, fill: '#1C1C1E99' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="articles" name="Articles" fill="#1B4332" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Member access */}
        <div className="bg-white border border-border-soft rounded-2xl p-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-5">Your access</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Research Intelligence',
                items: ['Full methodology appendices', 'Source database access', 'Advanced research filters'],
                available: true,
              },
              {
                title: 'Analytics & Dashboards',
                items: ['Interactive drilldowns', 'Reliability scores', 'Sports intelligence tools'],
                available: true,
              },
              {
                title: 'Data Exports',
                items: ['CSV dataset downloads', 'Model output exports', 'Report downloads'],
                available: false,
              },
            ].map((section) => (
              <div key={section.title} className={`rounded-xl border p-5 ${section.available ? 'border-border-soft' : 'border-border-soft opacity-50'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${section.available ? 'bg-forest' : 'bg-charcoal/20'}`} />
                  <p className="text-sm font-semibold text-charcoal">{section.title}</p>
                  {!section.available && <span className="text-xs text-charcoal/30 ml-auto">Coming soon</span>}
                </div>
                <ul className="space-y-1.5">
                  {section.items.map((item) => (
                    <li key={item} className="text-xs text-charcoal/50 flex items-center gap-2">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d={section.available ? "M2 6l3 3 5-5" : "M3 3l6 6M9 3l-6 6"} stroke={section.available ? "#1B4332" : "#1C1C1E40"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
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
            { label: 'Browse research', href: '/research' },
            { label: 'Analytics', href: '/analytics' },
            { label: 'Platform overview', href: '/platform' },
            { label: 'Services', href: '/services' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-forest border border-forest/20 px-4 py-2 rounded-lg hover:border-forest/40 hover:bg-forest/4 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
