import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export type ArticleFrontmatter = {
  title: string
  slug: string
  date: string
  category: string
  pillar: string
  summary: string
  readingTime: string
  author: string
  tags: string[]
  /** Optional id of a related publication (matches an id in data/publications.ts). */
  publication?: string
}

export type Article = ArticleFrontmatter & {
  content: string
}

function getFiles(folder: string): string[] {
  const dir = path.join(contentDir, folder)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
}

export function getAllArticles(): ArticleFrontmatter[] {
  const files = getFiles('blog')
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, 'blog', file), 'utf-8')
      const { data } = matter(raw)
      return data as ArticleFrontmatter
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getArticleBySlug(slug: string): Article | null {
  const files = getFiles('blog')
  const file = files.find((f) => f.replace(/\.mdx?$/, '') === slug)
  if (!file) return null
  const raw = fs.readFileSync(path.join(contentDir, 'blog', file), 'utf-8')
  const { data, content } = matter(raw)
  return { ...(data as ArticleFrontmatter), content }
}

export function getArticlesByPillar(pillar: string): ArticleFrontmatter[] {
  return getAllArticles().filter((a) => a.pillar === pillar)
}
