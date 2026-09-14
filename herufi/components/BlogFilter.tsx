'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import ResearchCard from '@/components/ResearchCard'
import EmptyState from '@/components/EmptyState'
import type { ArticleFrontmatter } from '@/lib/content'
import type { Pillar } from '@/data/pillars'

// Maps blog pillar titles (frontmatter) to pillar IDs (data/pillars.ts)
const pillarTitleToId: Record<string, string> = {
  'Venture Strategy and Capital Intelligence': 'venture-strategy',
  'Markets, Systems and African Economies': 'markets-systems',
  'Data, Predictive Analytics and Decision Intelligence': 'data-analytics',
  'Culture, Context and Intelligence Notes': 'culture-context',
}

// Short chip labels for the filter row
const pillarShortLabel: Record<string, string> = {
  'venture-strategy': 'Venture strategy',
  'markets-systems': 'Markets and economies',
  'data-analytics': 'Data and analytics',
  'culture-context': 'Culture and context',
}

type Props = {
  articles: ArticleFrontmatter[]
  pillars: Pillar[]
}

export default function BlogFilter({ articles, pillars }: Props) {
  const searchParams = useSearchParams()
  const pillarParam = searchParams.get('pillar')
  const [query, setQuery] = useState('')
  const [activePillar, setActivePillar] = useState<string | null>(
    pillarParam && pillars.some((p) => p.id === pillarParam) ? pillarParam : null
  )

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesPillar = activePillar
        ? pillarTitleToId[a.pillar] === activePillar || a.pillar === activePillar
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

  const chipClass = (active: boolean) =>
    `text-sm font-medium px-3 py-1.5 rounded-md border transition-colors duration-150 ${
      active
        ? 'bg-charcoal text-cream border-charcoal'
        : 'bg-white text-charcoal/70 border-border-soft hover:border-charcoal/40 hover:text-charcoal'
    }`

  const activeTitle = activePillar ? pillars.find((p) => p.id === activePillar)?.title : null
  const count = filteredArticles.length
  const countLabel = `${count} ${count === 1 ? 'post' : 'posts'}`

  return (
    <section className="py-16 px-6 bg-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-8">
          All blogs
        </h2>

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="blog-search" className="sr-only">Search blogs</label>
            <Search size={16} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/45" aria-hidden />
            <input
              id="blog-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, topic or tag"
              className="field pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-charcoal/50 hover:text-charcoal"
                aria-label="Clear search"
              >
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setActivePillar(null)} className={chipClass(activePillar === null)} aria-pressed={activePillar === null}>
              All pillars
            </button>
            {pillars.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillar(activePillar === p.id ? null : p.id)}
                className={chipClass(activePillar === p.id)}
                aria-pressed={activePillar === p.id}
              >
                {pillarShortLabel[p.id] ?? p.title}
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-charcoal/60 mb-6" aria-live="polite">
          {activeTitle ? `${activeTitle}: ${countLabel}` : countLabel}
          {query ? ` matching "${query}"` : ''}
        </p>

        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article) => (
              <ResearchCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No blogs match"
            description={
              query
                ? `Nothing found for "${query}". Try a different term or clear the pillar filter.`
                : 'No posts in this pillar yet.'
            }
          />
        )}
      </div>
    </section>
  )
}
