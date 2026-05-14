import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import ProjectCard from '@/components/ProjectCard'
import CTASection from '@/components/CTASection'
import { projects } from '@/data/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Herufi project portfolio — research reports, strategy projects, dashboards, predictive models, and sports intelligence tools.',
}

const categories = [...new Set(projects.map((p) => p.category))]

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        label="Projects"
        title="Work in progress and completed"
        description="A view of Herufi research reports, strategy projects, tools, and dashboards — live, in progress, and coming soon."
      />

      <section className="py-16 px-6 bg-cream">
        <div className="max-w-7xl mx-auto">
          {categories.map((cat) => {
            const catProjects = projects.filter((p) => p.category === cat)
            return (
              <div key={cat} className="mb-14 last:mb-0">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40 mb-5 border-b border-border-soft pb-3">
                  {cat}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catProjects.map((p) => <ProjectCard key={p.id} project={p} />)}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <CTASection
        headline="Interested in a bespoke project?"
        body="Herufi can scope and deliver research, strategy, or analytics projects for your specific needs."
        primaryCta={{ label: 'Discuss a project', href: '/contact' }}
        secondaryCta={{ label: 'View services', href: '/services' }}
      />
    </>
  )
}
