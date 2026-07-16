import type { Metadata } from 'next'
import { Suspense } from 'react'
import PageHeader from '@/components/PageHeader'
import BlogFilter from '@/components/BlogFilter'
import { pillars } from '@/data/pillars'
import { getAllArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Blogs',
  description:
    'Blog posts from Herufi covering venture strategy, African markets, climate and energy, data analytics, and culture and context.',
}

export default function BlogsPage() {
  const articles = getAllArticles()

  return (
    <>
      <PageHeader
        label="Blogs"
        title="Ideas, analysis, and field notes"
        description="Shorter reads built on the same evidence standards as our publications. Each blog links to the detailed publication behind it."
      />
      <Suspense>
        <BlogFilter articles={articles} pillars={pillars} />
      </Suspense>
    </>
  )
}
