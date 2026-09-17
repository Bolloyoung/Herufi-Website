import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import PhotoHero from '@/components/PhotoHero'
import Reveal from '@/components/Reveal'
import { heroImages } from '@/data/heroes'
import EmptyState from '@/components/EmptyState'
import Tag from '@/components/Tag'
import { publications } from '@/data/publications'

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Detailed publications from Herufi: structured reports with full methodology, sources and analysis for decision makers working across African markets.',
}

export default function PublicationsPage() {
  const herufiReports = publications.filter((p) => !p.source)
  const curated = publications.filter((p) => p.source)

  return (
    <>
      <PhotoHero
        image={heroImages.publications}
        title="Detailed reports and structured analysis"
        description="The full depth behind our blogs: long form publications with explicit methodology, linked sources and findings that hold up over time."
      />

      <section className="py-16 px-6 bg-cream">
        <Reveal className="max-w-7xl mx-auto">
          {publications.length === 0 ? (
            <EmptyState
              title="First publication coming soon"
              description="Detailed publications are on the way. In the meantime, explore the blogs for shorter reads."
            />
          ) : (
            <>
              <PublicationGroup
                title="The African Startup Investment Series"
                intro="Five reports, one dataset lineage: from a 2014 baseline to instrument level return math for the Series A and B gap."
                items={herufiReports}
              />
              {curated.length > 0 && (
                <PublicationGroup
                  title="Published research by the Herufi team"
                  intro="Discussion papers and policy briefs published through other institutions, curated here with full attribution."
                  items={curated}
                  className="mt-20"
                />
              )}
            </>
          )}
        </Reveal>
      </section>
    </>
  )
}

function PublicationGroup({
  title,
  intro,
  items,
  className = '',
}: {
  title: string
  intro: string
  items: typeof publications
  className?: string
}) {
  return (
    <div className={className}>
      <div className="max-w-2xl mb-8">
        <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight">{title}</h2>
        <p className="mt-3 text-base text-charcoal/65 leading-relaxed">{intro}</p>
      </div>
      <ol className="border-t border-border-soft">
        {items.map((pub) => (
          <li key={pub.id} className="border-b border-border-soft">
            <Link
              href={pub.fileUrl}
              className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 py-7 hover:bg-white transition-colors duration-150 md:px-4 md:-mx-4"
            >
              <div className="md:col-span-3">
                <Tag label={pub.category} variant="green" />
                <p className="mt-1.5 text-sm text-charcoal/55">
                  {pub.date}. {pub.format}
                </p>
              </div>
              <div className="md:col-span-8">
                <h3 className="font-serif text-xl font-normal text-charcoal leading-snug group-hover:underline underline-offset-4 decoration-charcoal/40">
                  {pub.title}
                </h3>
                {pub.author && (
                  <p className="mt-2 text-sm text-charcoal/70">
                    {pub.author}
                    {pub.source && <span className="text-charcoal/55">. {pub.source}</span>}
                  </p>
                )}
                <p className="mt-3 text-sm text-charcoal/65 leading-relaxed max-w-3xl">{pub.summary}</p>
                {pub.authorNote && (
                  <p className="mt-2 text-xs text-charcoal/55">{pub.authorNote}</p>
                )}
              </div>
              <div className="hidden md:flex md:col-span-1 md:justify-end md:pt-1">
                <ArrowRight size={18} strokeWidth={1.5} className="text-charcoal/40 group-hover:text-forest transition-colors" aria-hidden />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
