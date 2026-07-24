import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Comments from '@/components/Comments'
import { blogPosts } from '@/data/blogPosts'
import '../explainer.css'

const contentMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'why-african-startups-stall': () => import('@/content/blogs/why-african-startups-stall'),
  'real-story-african-startup-growth': () => import('@/content/blogs/real-story-african-startup-growth'),
  'africa-2030-better-than-the-hype': () => import('@/content/blogs/africa-2030-better-than-the-hype'),
  'who-writes-the-cheques-african-vc': () => import('@/content/blogs/who-writes-the-cheques-african-vc'),
}

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  return Object.keys(contentMap).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.id === params.slug)
  if (!post) return {}
  return { title: post.title, description: post.summary }
}

export default async function BlogPostPage({ params }: Props) {
  const post = blogPosts.find((p) => p.id === params.slug)
  const loader = contentMap[params.slug]
  if (!post || !loader) notFound()

  const { default: Content } = await loader()

  return (
    <div className="explainer-doc">
      <Content />
      <div className="article" style={{ paddingTop: 0 }}>
        <Comments />
      </div>
    </div>
  )
}
