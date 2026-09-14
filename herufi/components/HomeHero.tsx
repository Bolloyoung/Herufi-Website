import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Publication } from '@/data/publications'

type HomeHeroProps = {
  featured: Publication
  /** One headline number from the featured publication, with its label. */
  stat: { value: string; label: string }
}

export default function HomeHero({ featured, stat }: HomeHeroProps) {
  return (
    <section className="bg-white border-b border-border-soft">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-16 lg:pt-20 lg:pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        <div className="lg:col-span-7">
          <h1 className="font-serif text-4xl md:text-5xl font-normal text-charcoal leading-[1.1] max-w-2xl">
            Structured intelligence for African markets.
          </h1>
          <p className="mt-6 text-lg text-charcoal/65 leading-relaxed max-w-xl">
            Research, original frameworks and analysis grounded in evidence, for investors, founders and institutions.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/publications" className="btn-primary">
              Read the publications
            </Link>
            <Link href="/contact" className="btn-secondary">
              Work with Herufi
            </Link>
          </div>
        </div>

        <Link
          href={featured.fileUrl}
          className="group lg:col-span-5 block bg-charcoal text-cream rounded-lg p-8 lg:p-10 hover:bg-[#232326] transition-colors duration-150"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-gold mb-5">
            Latest publication
          </p>
          <h2 className="font-serif text-2xl lg:text-3xl font-normal leading-tight mb-3">
            {featured.title}
          </h2>
          <p className="text-sm text-cream/70 leading-relaxed mb-8">
            {featured.summary}
          </p>
          <div className="border-t border-cream/15 pt-6 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-2xl lg:text-3xl font-medium leading-none tabular-nums">{stat.value}</p>
              <p className="mt-2 text-xs text-cream/60 leading-snug max-w-[18rem]">{stat.label}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cream whitespace-nowrap group-hover:underline underline-offset-4">
              Read the report
              <ArrowRight size={15} strokeWidth={1.5} aria-hidden />
            </span>
          </div>
        </Link>
      </div>
    </section>
  )
}
