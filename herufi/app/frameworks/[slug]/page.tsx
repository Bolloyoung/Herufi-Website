import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Tag from '@/components/Tag'
import { frameworks } from '@/data/frameworks'

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return frameworks.map((f) => ({ slug: f.id }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const fw = frameworks.find((f) => f.id === params.slug)
  if (!fw) return {}
  return { title: fw.title, description: fw.problem }
}

const statusVariant = (s: string) => {
  if (s === 'Live') return 'green'
  if (s === 'Draft') return 'gold'
  return 'outline'
}

export default function FrameworkPage({ params }: Props) {
  const fw = frameworks.find((f) => f.id === params.slug)
  if (!fw) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <Link href="/frameworks" className="inline-flex items-center gap-1.5 text-sm text-charcoal/50 hover:text-charcoal mb-10 transition-colors">
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
          <path d="M13 8H3M7 4L3 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        All frameworks
      </Link>

      <div className="mb-8 flex gap-3 flex-wrap">
        <Tag label={fw.status} variant={statusVariant(fw.status)} size="md" />
        <Tag label={fw.pillar.split('&')[0].trim()} variant="outline" size="md" />
      </div>

      <h1 className="text-4xl md:text-5xl font-semibold text-charcoal mb-6 leading-tight">{fw.title}</h1>

      <div className="space-y-8">
        <div className="bg-white border border-border-soft rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-2">Problem it solves</h2>
          <p className="text-charcoal/70 leading-relaxed">{fw.problem}</p>
        </div>
        <div className="bg-white border border-border-soft rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-3">Who it is for</h2>
          <ul className="space-y-2">
            {fw.users.map((u) => (
              <li key={u} className="flex items-center gap-2 text-sm text-charcoal/70">
                <span className="w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0" />
                {u}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-border-soft rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-2">How it works</h2>
          <p className="text-charcoal/70 leading-relaxed">{fw.method}</p>
        </div>
        <div className="bg-forest/5 border border-forest/20 rounded-xl p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-forest mb-2">Example output</h2>
          <p className="text-charcoal/70 leading-relaxed">{fw.exampleOutput}</p>
        </div>
      </div>

      <div className="mt-12">
        <Link href="/contact" className="inline-flex items-center gap-2 bg-charcoal text-cream text-sm font-medium px-6 py-3 rounded hover:bg-forest transition-colors">
          Request this framework →
        </Link>
      </div>
    </div>
  )
}
