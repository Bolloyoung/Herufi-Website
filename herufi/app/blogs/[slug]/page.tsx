import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Comments from '@/components/Comments'
import { blogPosts } from '@/data/blogPosts'
import { publications } from '@/data/publications'
import { getAllArticles, getArticleBySlug } from '@/lib/content'
import { markdownToHtml } from '@/lib/markdown'
import '../explainer.css'

const contentMap: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'why-african-startups-stall': () => import('@/content/blogs/why-african-startups-stall'),
  'real-story-african-startup-growth': () => import('@/content/blogs/real-story-african-startup-growth'),
  'africa-2030-better-than-the-hype': () => import('@/content/blogs/africa-2030-better-than-the-hype'),
  'who-writes-the-cheques-african-vc': () => import('@/content/blogs/who-writes-the-cheques-african-vc'),
  'how-to-fill-africas-missing-middle': () => import('@/content/blogs/how-to-fill-africas-missing-middle'),
}

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const seriesSlugs = Object.keys(contentMap)
  const articleSlugs = getAllArticles().map((a) => a.slug)
  return Array.from(new Set([...seriesSlugs, ...articleSlugs])).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find((p) => p.id === params.slug)
  if (post) return { title: post.title, description: post.summary }
  const article = getArticleBySlug(params.slug)
  if (article) return { title: article.title, description: article.summary }
  return {}
}

export default async function BlogPostPage({ params }: Props) {
  const loader = contentMap[params.slug]

  if (loader) {
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

  const article = getArticleBySlug(params.slug)
  if (!article) notFound()

  const relatedPublication = article.publication
    ? publications.find((p) => p.id === article.publication)
    : undefined

  return (
    <div className="explainer-doc">
      <article className="article">
        <Link className="back" href="/blogs">← Back to blogs</Link>
        <div className="chips">
          <span className="pill green">{article.pillar}</span>
          <span className="pill outline">{article.category}</span>
        </div>
        <h1>{article.title}</h1>
        <p className="summary">{article.summary}</p>
        <div className="meta">
          <span>{article.author}</span>
          <span>&middot;</span>
          <span>{article.date}</span>
          <span>&middot;</span>
          <span>{article.readingTime}</span>
        </div>
        <div className="prose" dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }} />
        {relatedPublication && (
          <Link className="pubcard" href={relatedPublication.fileUrl}>
            <span className="eyebrow gold">Full Publication</span>
            <h3>{relatedPublication.title}</h3>
            <p>
              {relatedPublication.author
                ? `By ${relatedPublication.author}${relatedPublication.source ? `. ${relatedPublication.source}.` : ''}`
                : 'This blog draws on a detailed publication. Read the full analysis, methodology and sources.'}
            </p>
            <span className="btn">Read the publication</span>
          </Link>
        )}
        <div className="tags">
          {article.tags?.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </article>
      <div className="article" style={{ paddingTop: 0 }}>
        <Comments />
      </div>
    </div>
  )
}
