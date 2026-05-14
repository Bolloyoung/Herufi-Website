import Link from 'next/link'
import Tag from './Tag'
import type { Framework } from '@/data/frameworks'

type FrameworkCardProps = { framework: Framework }

const statusVariant = (s: string) => {
  if (s === 'Live') return 'green'
  if (s === 'Draft') return 'gold'
  return 'outline'
}

export default function FrameworkCard({ framework }: FrameworkCardProps) {
  return (
    <div className="group bg-white border border-border-soft rounded-xl p-6 hover:border-forest/40 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <Tag label={framework.status} variant={statusVariant(framework.status)} size="md" />
        <span className="text-xs text-charcoal/30 tracking-wide">{framework.pillar.split('&')[0].trim()}</span>
      </div>
      <h3 className="text-lg font-semibold text-charcoal mb-2 leading-snug group-hover:text-forest transition-colors">
        {framework.title}
      </h3>
      <p className="text-sm text-charcoal/55 leading-relaxed mb-4 line-clamp-2">
        {framework.problem}
      </p>

      <div className="border-t border-border-soft pt-4 mt-4">
        <p className="text-xs font-semibold text-charcoal/40 uppercase tracking-wide mb-2">For</p>
        <div className="flex gap-1.5 flex-wrap">
          {framework.users.slice(0, 3).map((u) => (
            <Tag key={u} label={u} variant="outline" />
          ))}
        </div>
      </div>

      <Link
        href={`/frameworks/${framework.id}`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-forest hover:text-forest-light transition-colors"
      >
        View framework
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
    </div>
  )
}
