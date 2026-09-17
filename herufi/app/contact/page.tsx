import type { Metadata } from 'next'
import { FileText, Compass, BarChart2, Users, Mail, Linkedin } from 'lucide-react'
import PhotoHero from '@/components/PhotoHero'
import Reveal from '@/components/Reveal'
import { heroImages } from '@/data/heroes'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Looking for research, analytics or strategy support? Get in touch with Herufi.',
}

const engagementTypes = [
  { icon: FileText, title: 'Commission a report', body: 'Standalone research or market intelligence.' },
  { icon: Compass, title: 'Venture strategy support', body: 'Investment readiness, due diligence or market entry.' },
  { icon: BarChart2, title: 'Data and analytics', body: 'Dashboards, models and scoring tools.' },
  { icon: Users, title: 'Research partnership', body: 'Ongoing support for funds and institutions.' },
]

export default function ContactPage() {
  return (
    <>
      <PhotoHero
        image={heroImages.contact}
        title="Work with Herufi"
        description="Tell us about the decision you need to make or the problem you need to understand. We respond to every enquiry within two business days."
      />

      <section className="py-16 px-6 bg-cream">
        <Reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-base font-semibold text-charcoal mb-6">Ways to engage</h2>
            <ul className="space-y-5">
              {engagementTypes.map((e) => (
                <li key={e.title} className="flex gap-3">
                  <e.icon size={18} strokeWidth={1.5} className="text-forest flex-shrink-0 mt-0.5" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-charcoal">{e.title}</p>
                    <p className="text-sm text-charcoal/60">{e.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-border-soft space-y-3">
              <a
                href="mailto:hello@herufi.org"
                className="flex items-center gap-2.5 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <Mail size={16} strokeWidth={1.5} aria-hidden />
                hello@herufi.org
              </a>
              <a
                href="https://linkedin.com/company/herufi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-charcoal/70 hover:text-charcoal transition-colors"
              >
                <Linkedin size={16} strokeWidth={1.5} aria-hidden />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </Reveal>
      </section>
    </>
  )
}
