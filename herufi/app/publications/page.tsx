import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import EmptyState from '@/components/EmptyState'
import Tag from '@/components/Tag'
import { publications } from '@/data/publications'

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Detailed publications from Herufi: structured reports with full methodology, sources, and analysis for decision makers working across African markets.',
}

export default function PublicationsPage() {
  return (
    <>
      <PageHeader
        label="Publications"
        title="Detailed reports and structured analysis"
        description="The full depth behind our blogs: long form publications with explicit methodology, linked sources, and findings that hold up over time."
      />

      <section className="py-16 px-6 bg-cream min-h-[40vh]">
        <div className="max-w-7xl mx-auto">
          {publications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-white border border-border-soft rounded-xl p-6 flex flex-col hover:border-forest/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Tag label={pub.category} variant="green" size="md" />
                    <span className="text-xs text-charcoal/35">{pub.date}</span>
                  </div>
                  <h3 className="text-base font-semibold text-charcoal mb-2 leading-snug">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-charcoal/55 leading-relaxed mb-5 flex-1">
                    {pub.summary}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border-soft">
                    <div className="flex flex-wrap gap-1.5">
                      {pub.tags.slice(0, 3).map((t) => (
                        <Tag key={t} label={t} variant="outline" size="sm" />
                      ))}
                    </div>
                    <a
                      href={pub.fileUrl}
                      className="text-sm font-medium text-forest hover:text-forest-light transition-colors flex-shrink-0"
                    >
                      Read
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="First publication coming soon"
              description="Detailed publications are on the way. In the meantime, explore the blogs for shorter reads."
            />
          )}
        </div>
      </section>
    </>
  )
}
