import Tag from './Tag'
import type { BlogPost } from '@/data/blogPosts'

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.fileUrl}
      className="group block bg-white border border-border-soft rounded-xl overflow-hidden hover:border-forest/40 hover:shadow-md transition-all duration-200"
    >
      <div className="h-1 bg-forest group-hover:bg-gold transition-colors duration-300" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Tag label={post.pillar} variant="green" />
          <span className="text-xs text-charcoal/35">{post.readingTime}</span>
        </div>
        <h3 className="text-lg font-semibold text-charcoal mb-2 leading-snug group-hover:text-forest transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-charcoal/55 leading-relaxed mb-4 line-clamp-3">
          {post.summary}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-charcoal/40">{post.date}</span>
          <div className="flex gap-1 flex-wrap justify-end">
            {post.tags.slice(0, 2).map((tag) => (
              <Tag key={tag} label={tag} variant="outline" />
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}
