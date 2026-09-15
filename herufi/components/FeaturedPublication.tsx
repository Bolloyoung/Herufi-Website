import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Publication } from '@/data/publications'

type FeaturedPublicationProps = {
  publication: Publication
  /** One headline number from the publication, with its label. */
  stat: { value: string; label: string }
}

export default function FeaturedPublication({ publication, stat }: FeaturedPublicationProps) {
  return (
    <Link
      href={publication.fileUrl}
      className="group block bg-charcoal text-cream rounded-lg p-8 lg:p-10 hover:bg-[#232326] transition-colors duration-150"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gold mb-4">
            Latest publication
          </p>
          <h2 className="font-serif text-2xl lg:text-3xl font-normal leading-tight mb-3">
            {publication.title}
          </h2>
          <p className="text-sm text-cream/70 leading-relaxed max-w-xl">
            {publication.summary}
          </p>
        </div>
        <div className="lg:col-span-5 lg:border-l lg:border-cream/15 lg:pl-12">
          <p className="font-mono text-2xl lg:text-3xl font-medium leading-none tabular-nums">{stat.value}</p>
          <p className="mt-2 text-xs text-cream/60 leading-snug max-w-[20rem]">{stat.label}</p>
          <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-cream group-hover:underline underline-offset-4">
            Read the report
            <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  )
}
