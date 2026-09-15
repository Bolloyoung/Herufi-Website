import type { Metadata } from 'next'
import PhotoHero from '@/components/PhotoHero'
import Reveal from '@/components/Reveal'
import { heroImages } from '@/data/heroes'
import NewsletterSignup from '@/components/NewsletterSignup'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Herufi combines analytical methods, venture strategy, field knowledge and African market context to produce useful intelligence.',
}

const values = [
  { title: 'Clarity over noise', body: 'The value of research is not volume. It is precision. Every piece of work should answer a real question.' },
  { title: 'Context over assumptions', body: 'African markets are not monolithic. Context changes everything. We start with the specific, not the general.' },
  { title: 'Evidence over hype', body: 'Hot takes are easy. Analysis grounded in evidence takes work. We do the work.' },
  { title: 'Frameworks over hot takes', body: 'Good analysis is reusable. Frameworks outlive the moment. We build tools, not just opinions.' },
  { title: 'Usefulness over complexity', body: 'If the output does not help someone make a better decision, it has failed. Simplicity in service of the decision.' },
]

const capabilities = [
  { label: 'Research institution', desc: 'Durable analysis grounded in evidence, with a long shelf life.' },
  { label: 'Venture intelligence', desc: 'Investment readiness, due diligence and deal intelligence.' },
  { label: 'Analytics laboratory', desc: 'Quantitative models, forecasts and scenario analysis.' },
  { label: 'Economic strategy', desc: 'Market systems and structural analysis of African economies.' },
  { label: 'Policy research', desc: 'Development finance, trade and public policy frameworks.' },
  { label: 'Mixed methods', desc: 'Qualitative depth combined with quantitative rigour.' },
  { label: 'Interactive intelligence', desc: 'Dashboards, tools and visual outputs built on the research.' },
]

const process = [
  {
    title: 'Define the question',
    body: 'Every engagement starts with a precise question or a decision that needs to be made. Vague briefs produce vague outputs.',
  },
  {
    title: 'Build the analysis',
    body: 'Research is structured around a clear methodology. Quantitative where data exists, qualitative where it does not, always with explicit assumptions.',
  },
  {
    title: 'Produce useful output',
    body: 'The deliverable is oriented around the decision or use case. A report that sits unread has failed.',
  },
]

const expertise = [
  'African venture ecosystems and capital markets',
  'Investment readiness and due diligence frameworks',
  'Impact investing and development finance',
  'Informal market dynamics and local context',
  'Data analysis, forecasting and decision modelling',
  'Market entry and growth strategy',
]

const founders = [
  {
    name: 'Michael Omega',
    role: 'Founder',
    initials: 'MO',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/michael-omega-a179b3195/', external: true },
      { label: 'hello@herufi.org', href: 'mailto:hello@herufi.org', external: false },
    ],
    bio: [
      'Herufi was founded by a researcher and analyst with a background spanning venture strategy, impact investment and African market intelligence. The work is grounded in real engagement with founders, investors and institutions operating across African markets, not theoretical frameworks built from a distance.',
      'The platform emerged from a consistent observation: too much research about African markets is either too shallow, too generic, or built for a different audience. Decision makers working in and around these markets need structured intelligence, aware of context, that actually helps them act.',
      'The research spans four pillars because that is where the genuine analytical demand sits: venture strategy, market systems, data intelligence and culture and context. The common thread is rigour applied to real decisions.',
    ],
    focus: [
      'African venture ecosystems',
      'Impact and development finance',
      'Data and decision modelling',
      'Market entry and strategy',
      'Research methodology',
    ],
  },
  {
    name: 'Kevin Wanjala',
    role: 'Co-Founder',
    initials: 'KW',
    links: [{ label: 'hello@herufi.org', href: 'mailto:hello@herufi.org', external: false }],
    bio: [
      "Kevin Wanjala is co-founder of Herufi, bringing a background in applied public policy research from Kenya's public policy research community. His published research spans firm level global value chain participation, the financing constraints facing small and medium enterprises, and the effect of trade policy instruments such as export levies on sector competitiveness.",
      'That work is built on the same standard Herufi applies to every publication: indices and models built from real survey and trade data, econometric analysis of what actually drives outcomes, and recommendations tied directly to what the evidence shows rather than to what is convenient to argue.',
      "His research sits primarily within Markets, Systems and African Economies, Herufi's pillar for how African markets and trade actually function beneath the headline numbers.",
    ],
    focus: [
      'Trade policy and global value chains',
      'SME finance and access to capital',
      'Applied econometric research',
      'Kenyan and East African markets',
      'Public policy research',
    ],
  },
]

export default function AboutPage() {
  return (
    <>
      <PhotoHero
        image={heroImages.about}
        title="A research intelligence platform for African markets"
        description="Analytical methods, original frameworks and intelligence grounded in data, for decision makers who cannot afford to be wrong."
      />

      {/* Mission and philosophy: two essays side by side on wide screens */}
      <section className="py-16 lg:py-20 px-6 bg-cream">
        <Reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-6">
              Useful intelligence for decision makers who cannot afford to be wrong
            </h2>
            <div className="space-y-4 text-charcoal/70 leading-relaxed">
              <p>
                Herufi is a research intelligence platform: part research institution, part analytics laboratory, part venture intelligence engine and part strategic foresight system. It was built to fill a specific gap: structured intelligence rooted in African context, for decision makers who need evidence, not opinion.
              </p>
              <p>
                The platform produces blogs, detailed publications, original frameworks, quantitative models and interactive dashboards across venture strategy, African market systems, data analytics and policy analysis. The common thread is methodological rigour applied to real decisions.
              </p>
              <p>
                Every finding passes a reliability layer before publication. Confidence levels are classified. Sources are linked. Methodology is made explicit. The goal is not to produce more content. It is to produce intelligence that holds up over time.
              </p>
            </div>
          </div>
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-6">
              How Herufi thinks about research
            </h2>
            <div className="space-y-4 text-charcoal/70 leading-relaxed">
              <p>
                Good research starts with a precise question. Not &ldquo;what is happening in African fintech&rdquo; but &ldquo;what are the structural reasons why fintech credit products fail to scale beyond informal savings groups in East Africa?&rdquo; The precision of the question shapes the quality of the answer.
              </p>
              <p>
                Herufi research is designed to have a long shelf life. It should still be useful six months after publication. That means avoiding reactive commentary and focusing on structural analysis that holds up over time.
              </p>
              <p>
                Where data is available, it is used. Where data is limited, as it often is in African markets, methodology is made explicit and qualitative intelligence is used with appropriate care. The goal is never to disguise uncertainty. It is to name it clearly and work within it honestly.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Capabilities: definition list */}
      <section className="py-16 lg:py-20 px-6 bg-white border-y border-border-soft">
        <Reveal className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-10">
            Seven capabilities, one platform
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
            {capabilities.map((c) => (
              <div key={c.label} className="grid grid-cols-1 sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4 py-4 border-t border-border-soft">
                <dt className="text-sm font-semibold text-charcoal">{c.label}</dt>
                <dd className="text-sm text-charcoal/65 leading-relaxed">{c.desc}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Process and expertise */}
      <section className="py-16 lg:py-20 px-6 bg-cream">
        <Reveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-8">
              How an engagement runs
            </h2>
            <ol className="space-y-8">
              {process.map((item, i) => (
                <li key={item.title} className="grid grid-cols-[2.5rem_1fr] gap-4">
                  <span className="font-mono text-sm text-charcoal/50 pt-1 tabular-nums" aria-hidden>
                    {i + 1}.
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-charcoal mb-1.5">{item.title}</h3>
                    <p className="text-sm text-charcoal/65 leading-relaxed max-w-prose">{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="lg:col-span-5">
            <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-8">
              Areas of deep work
            </h2>
            <ul className="divide-y divide-border-soft border-y border-border-soft">
              {expertise.map((area) => (
                <li key={area} className="py-3.5 text-sm text-charcoal/80">{area}</li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Founders */}
      <section className="py-16 lg:py-20 px-6 bg-white border-y border-border-soft">
        <Reveal className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-12">
            Founders
          </h2>
          <div className="space-y-16">
            {founders.map((f) => (
              <div key={f.name} className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16">
                <div className="md:col-span-4 lg:col-span-3">
                  <div
                    className="w-16 h-16 rounded-md bg-forest text-cream flex items-center justify-center font-serif text-xl mb-4"
                    aria-hidden
                  >
                    {f.initials}
                  </div>
                  <p className="text-lg font-semibold text-charcoal">{f.name}</p>
                  <p className="text-sm text-charcoal/60 mb-4">{f.role}, Herufi</p>
                  <ul className="space-y-1.5">
                    {f.links.map((l) => (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target={l.external ? '_blank' : undefined}
                          rel={l.external ? 'noopener noreferrer' : undefined}
                          className="text-sm text-forest hover:text-forest-light transition-colors"
                        >
                          {l.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-8 lg:col-span-9">
                  <div className="space-y-4 text-charcoal/70 leading-relaxed max-w-3xl">
                    {f.bio.map((para) => (
                      <p key={para.slice(0, 40)}>{para}</p>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-charcoal/60">
                    <span className="font-medium text-charcoal">Focus: </span>
                    {f.focus.join(', ')}.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 px-6 bg-cream">
        <Reveal className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-normal text-charcoal leading-tight mb-10">
            What Herufi stands for
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10">
            {values.map((v) => (
              <div key={v.title}>
                <h3 className="text-base font-semibold text-charcoal mb-2">{v.title}</h3>
                <p className="text-sm text-charcoal/65 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <NewsletterSignup />

      <CTASection
        headline="Looking for research or strategy support?"
        body="Tell us about the decision you need to make or the problem you need to understand."
        primaryCta={{ label: 'Work with Herufi', href: '/contact' }}
        secondaryCta={{ label: 'Read the blogs', href: '/blogs' }}
      />
    </>
  )
}
