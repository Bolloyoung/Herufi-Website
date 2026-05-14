import Tag from './Tag'
import type { DataTool } from '@/data/tools'

type ToolCardProps = { tool: DataTool }

const statusVariant = (s: string) => {
  if (s === 'Live') return 'green'
  if (s === 'Beta') return 'gold'
  return 'outline'
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="bg-white border border-border-soft rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <Tag label={tool.status} variant={statusVariant(tool.status)} size="md" />
        <span className="text-xs text-charcoal/30 tracking-wide">{tool.category}</span>
      </div>

      <h3 className="text-lg font-semibold text-charcoal mb-2 leading-snug">{tool.title}</h3>
      <p className="text-sm text-charcoal/55 leading-relaxed mb-4">{tool.description}</p>

      <div className="pt-4 border-t border-border-soft">
        <p className="text-xs font-semibold text-charcoal/35 uppercase tracking-wide mb-2">For</p>
        <p className="text-sm text-charcoal/60">{tool.users.join(' · ')}</p>
      </div>

      <div className="mt-4">
        {tool.status === 'Live' || tool.status === 'Beta' ? (
          <button className="w-full text-center bg-forest text-cream text-sm font-medium px-5 py-2.5 rounded hover:bg-forest-light transition-colors">
            View Prototype
          </button>
        ) : (
          <div className="w-full text-center bg-gray-soft text-charcoal/40 text-sm font-medium px-5 py-2.5 rounded cursor-not-allowed">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  )
}
