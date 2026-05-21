'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import ResearchCard from '@/components/ResearchCard'
import ReportCard from '@/components/ReportCard'
import EmptyState from '@/components/EmptyState'
import type { ArticleFrontmatter } from '@/lib/content'
import type { Pillar } from '@/data/pillars'
import type { Report } from '@/data/reports'

// Maps article pillar titles to pillar IDs
const pillarTitleToId: Record<string, string> = {
  'Venture Strategy & Capital Intelligence': 'venture-strategy',
  'Markets, Systems & African Economies': 'markets-systems',
  'Climate, Energy, Food & Infrastructure': 'climate-energy',
  'Data, Predictive Analytics & Decision Intelligence': 'data-analytics',
  'Sports Business Intelligence': 'sports-business',
  'Culture, Context & Intelligence Notes': 'culture-context',
}

type Props = {
  articles: ArticleFrontmatter[]
  pillars: Pillar[]
  reports: Report[]
}

export default function ResearchFilter({ articles, pillars, reports }: Props) {
  const [query, setQuery] = useState('')
  const [activePillar, setActivePillar] = useState<string | null>(null)

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesPillar = activePillar
        ? pillarTitleToId[a.pillar] === activePillar
        : true
      const q = query.toLowerCase()
      const matchesQuery = q
        ? a.title.toLowerCase().includes(q) ||
          a.summary?.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q)) ||
          a.pillar.toLowerCase().includes(q)
        : true
      return matchesPillar && matchesQuery
    })
  }, [articles, query, activePillar])

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const q = query.toLowerCase()
      return q
        ? r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.tags.some((t) => t.toLowerCase().includes(q))
        : true
    })
  }, [reports, query])

  const totalResults = filteredArticles.length + filteredReports.length

  return (
    <>
      {/* Search bar */}
      <section className="py-8 px-6 bg-white border-b border-border-soft sticky top-16 z-40 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search input */}
            <div className="relative flex-1 max-w-xl">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/30" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search research, pillars, tags..."
                className="w-full pl-9 pr-9 py-2.5 text-sm border border-border-soft rounded-lg bg-gray-soft focus:outline-none focus:border-forest transition-colors text-charcoal placeholder-charcoal/30"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            {/* Results count */}
            {(query || activePillar) && (
              <p className="text-sm text-charcoal/40 flex-shrink-0">
                {totalResults} result{totalResults !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Pillar filter pills */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => setActivePillar(null)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 ${
                activePillar === null
                  ? 'bg-forest text-cream border-forest'
                  : 'bg-white text-charcoal/50 border-border-soft hover:border-forest/30 hover:text-charcoal'
              }`}
            >
              All pillars
            </button>
            {pillars.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 ${
                  activePillar === p.id
                    ? 'bg-forest text-cream border-forest'
                    : 'bg-white text-charcoal/50 border-border-soft hover:border-forest/30 hover:text-charcoal'
                }`}
              >
                {p.number} {p.title.split(' ').slice(0, 2).join(' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">
              {activePillar
                ? `${pillars.find((p) => p.id === activePillar)?.title ?? 'Pillar'} — ${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''}`
                : `All research — ${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''}`}
            </p>
            {activePillar && (
              <button
                onClick={() => setActivePillar(null)}
                className="text-xs text-charcoal/40 hover:text-charcoal flex items-center gap-1"
              >
                <X size={12} /> Clear filter
              </button>
            )}
          </div>

          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ResearchCard key={article.slug} article={article} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No research found"
              description={
                query
                  ? `No results for "${query}". Try a different search term.`
                  : 'No articles in this pillar yet.'
              }
            />
          )}
        </div>
      </section>

      {/* Reports — hidden when a pillar filter is active */}
      {!activePillar && (
        <section id="reports" className="py-16 px-6 bg-white border-t border-border-soft">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-2">Reports</p>
              <h2 className="text-2xl font-semibold text-charcoal">Long-form downloadable research</h2>
              <p className="text-sm text-charcoal/55 mt-1">
                Structured analysis for investment decisions, strategy development, and program design.
              </p>
            </div>
            {filteredReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((r) => (
                  <ReportCard key={r.id} report={r} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No reports found"
                description={`No reports match "${query}".`}
              />
            )}
          </div>
        </section>
      )}
    </>
  )
}
