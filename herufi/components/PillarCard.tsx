import Link from 'next/link'
import type { Pillar } from '@/data/pillars'
import { TrendingUp, Globe, Leaf, BarChart2, Trophy, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  TrendingUp, Globe, Leaf, BarChart2, Trophy, BookOpen,
}

type PillarCardProps = { pillar: Pillar }

export default function PillarCard({ pillar }: PillarCardProps) {
  const Icon = iconMap[pillar.icon] || TrendingUp
  return (
    <Link
      href={`/research?pillar=${pillar.id}`}
      className="group block bg-white border border-border-soft rounded-xl p-6 hover:border-forest/40 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-10 h-10 rounded-lg bg-forest/8 flex items-center justify-center flex-shrink-0 group-hover:bg-forest/15 transition-colors">
          <Icon size={18} className="text-forest" />
        </div>
        <span className="text-xs font-semibold text-charcoal/30 tracking-[0.15em] uppercase mt-1">
          {pillar.number}
        </span>
      </div>
      <h3 className="text-base font-semibold text-charcoal mb-2 leading-snug group-hover:text-forest transition-colors">
        {pillar.title}
      </h3>
      <p className="text-sm text-charcoal/55 leading-relaxed line-clamp-3">
        {pillar.description}
      </p>
    </Link>
  )
}
