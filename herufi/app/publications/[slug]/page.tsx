import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { publications } from '@/data/publications'
import '../report.css'

const contentMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'broken-ladder-2014-baseline': () => import('@/content/publications/broken-ladder-2014-baseline'),
  'frontier-to-market-2014-2026': () => import('@/content/publications/frontier-to-market-2014-2026'),
  'continent-heading-2026-2030': () => import('@/content/publications/continent-heading-2026-2030'),
}

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return Object.keys(contentMap).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pub = publications.find((p) => p.id === params.slug)
  if (!pub) return {}
  return { title: pub.title, description: pub.summary }
}

export default async function PublicationPage({ params }: Props) {
  const pub = publications.find((p) => p.id === params.slug)
  const loader = contentMap[params.slug]
  if (!pub || !loader) notFound()

  const { default: Content } = await loader()

  return (
    <div className="report-doc">
      <Content />
    </div>
  )
}
