import Link from 'next/link'
import type { Service } from '@/data/services'

type ServiceCardProps = { service: Service }

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white border border-border-soft rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="bg-forest px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-cream/10 flex items-center justify-center text-cream font-bold text-sm">
            {service.letter}
          </span>
          <h3 className="text-lg font-semibold text-cream">{service.title}</h3>
        </div>
        <p className="mt-2 text-sm text-cream/60">{service.tagline}</p>
      </div>

      <div className="p-6">
        {/* Audience */}
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-2">For</p>
          <p className="text-sm text-charcoal/70">{service.audience.join(' · ')}</p>
        </div>

        {/* Deliverables */}
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-2">Deliverables</p>
          <ul className="text-sm text-charcoal/70 space-y-1">
            {service.deliverables.slice(0, 5).map((d) => (
              <li key={d} className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-forest flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        {/* Sample questions */}
        <div className="bg-gray-soft rounded-lg p-4 mb-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-charcoal/40 mb-2">Example questions</p>
          <ul className="text-sm text-charcoal/60 space-y-1.5">
            {service.questions.slice(0, 2).map((q) => (
              <li key={q} className="italic">"{q}"</li>
            ))}
          </ul>
        </div>

        <Link
          href="/contact"
          className="block text-center bg-charcoal text-cream text-sm font-medium px-5 py-2.5 rounded hover:bg-forest transition-colors duration-200"
        >
          Discuss this service
        </Link>
      </div>
    </div>
  )
}
