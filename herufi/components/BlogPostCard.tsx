import Link from 'next/link'
import Tag from './Tag'
import type { BlogPost } from '@/data/blogPosts'
import { formatDate } from '@/lib/format'

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={post.fileUrl}
      className="group flex flex-col bg-white border border-border-soft rounded-lg p-6 hover:border-charcoal/40 transition-colors duration-150"
    >
      <div className="flex items-baseline justify-between gap-3 mb-4">
        <Tag label={post.category} variant="green" />
        <span className="text-xs text-charcoal/55 whitespace-nowrap">{post.readingTime}</span>
      </div>
      <h3 className="font-serif text-lg font-normal text-charcoal leading-snug mb-3 group-hover:underline underline-offset-4 decoration-charcoal/40">
        {post.title}
      </h3>
      <p className="text-sm text-charcoal/65 leading-relaxed line-clamp-3 mb-6">
        {post.summary}
      </p>
      <p className="mt-auto text-xs text-charcoal/55">{formatDate(post.date)}</p>
    </Link>
  )
}
