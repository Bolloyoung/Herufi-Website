export type Publication = {
  /** Unique id. Blog posts can reference this via the `publication` frontmatter field. */
  id: string
  title: string
  category: string
  summary: string
  date: string
  format: string
  fileUrl: string
  tags: string[]
}

// Publications are the detailed, long form reports behind the blog posts.
// Add new entries here; the newest first publication is coming soon.
export const publications: Publication[] = []
