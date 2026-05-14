import Tag from './Tag'
import type { Project } from '@/data/projects'

type ProjectCardProps = { project: Project }

const statusVariant = (s: string) => {
  if (s === 'Live') return 'green'
  if (s === 'In Progress') return 'gold'
  return 'outline'
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-white border border-border-soft rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <Tag label={project.status} variant={statusVariant(project.status)} size="md" />
        <Tag label={project.sector} variant="outline" size="md" />
      </div>

      <p className="text-xs font-semibold text-charcoal/35 uppercase tracking-wide mb-1">{project.category}</p>
      <h3 className="text-lg font-semibold text-charcoal mb-3 leading-snug">{project.title}</h3>

      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-charcoal/50">Problem: </span>
          <span className="text-charcoal/70">{project.problem}</span>
        </div>
        <div>
          <span className="font-medium text-charcoal/50">Approach: </span>
          <span className="text-charcoal/70">{project.approach}</span>
        </div>
        <div>
          <span className="font-medium text-charcoal/50">Output: </span>
          <span className="text-charcoal/70">{project.output}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border-soft">
        <p className="text-xs text-charcoal/35 mb-1.5">Tools used</p>
        <div className="flex gap-1.5 flex-wrap">
          {project.tools.map((tool) => (
            <span
              key={tool}
              className="text-[11px] px-2 py-0.5 bg-gray-soft text-charcoal/60 rounded font-medium"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
