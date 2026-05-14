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
}

export type Article = ArticleFrontmatter & {
  content: string
}

export type FrameworkFrontmatter = {
  title: string
  slug: string
  problem: string
  users: string[]
  method: string
  output: string
  status: string
}

export type Framework = FrameworkFrontmatter & {
  content: string
}

function getFiles(folder: string): string[] {
  const dir = path.join(contentDir, folder)
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
}

export function getAllArticles(): ArticleFrontmatter[] {
  const files = getFiles('research')
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(contentDir, 'research', file), 'utf-8')
      const { data } = matter(raw)
      return data as ArticleFrontmatter
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getArticleBySlug(slug: string): Article | null {
  const files = getFiles('research')
  const file = files.find((f) => f.replace(/\.mdx?$/, '') === slug)
  if (!file) return null
  const raw = fs.readFileSync(path.join(contentDir, 'research', file), 'utf-8')
  const { data, content } = matter(raw)
  return { ...(data as ArticleFrontmatter), content }
}

export function getArticlesByPillar(pillar: string): ArticleFrontmatter[] {
  return getAllArticles().filter((a) => a.pillar === pillar)
}

export function getAllFrameworks(): FrameworkFrontmatter[] {
  const files = getFiles('frameworks')
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(contentDir, 'frameworks', file), 'utf-8')
    const { data } = matter(raw)
    return data as FrameworkFrontmatter
  })
}

export function getFrameworkBySlug(slug: string): Framework | null {
  const files = getFiles('frameworks')
  const file = files.find((f) => f.replace(/\.mdx?$/, '') === slug)
  if (!file) return null
  const raw = fs.readFileSync(path.join(contentDir, 'frameworks', file), 'utf-8')
  const { data, content } = matter(raw)
  return { ...(data as FrameworkFrontmatter), content }
}
