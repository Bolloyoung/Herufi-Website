import type { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import CTASection from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'About',
  description: 'Herufi combines analytical methods, venture strategy, field knowledge, and African market context to produce useful intelligence.',
}

const values = [
  { title: 'Clarity over noise', body: 'The value of research is not volume — it is precision. Every piece of work should answer a real question.' },
  { title: 'Context over assumptions', body: 'African markets are not monolithic. Context changes everything. We start with the specific, not the general.' },
  { title: 'Evidence over hype', body: 'Hot takes are easy. Evidence-backed analysis takes work. We do the work.' },
  { title: 'Frameworks over hot takes', body: 'Good analysis is reusable. Frameworks outlive the moment. We build tools, not just opinions.' },
  { title: 'Usefulness over complexity', body: 'If the output does not help someone make a better decision, it has failed. Simplicity in service of the decision.' },
]

const expertise = [
  'African venture ecosystems and capital markets',
  'Investment readiness and due diligence frameworks',
  'Impact investing and development finance',
  'Informal market dynamics and local context',
  'Climate, energy, and food systems',
  'Football analytics and sports business intelligence',
  'Data analysis, forecasting, and decision modelling',
  'Market entry and go-to-market strategy',
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About"
        title="A research intelligence platform for African markets"
        description="Herufi combines analytical methods, original frameworks, and data-backed intelligence to produce structured insights for decision-makers who cannot afford to be wrong."
      />

      {/* Mission */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-4">Mission</p>
          <h2 className="text-3xl font-semibold text-charcoal mb-6 leading-snug">
            Useful intelligence for decision-makers who cannot afford to be wrong
          </h2>
          <div className="space-y-4 text-charcoal/65 leading-relaxed">
            <p>
              Herufi is a research intelligence platform — a hybrid of research institution, analytics laboratory, venture intelligence engine, and strategic foresight system. It was built to fill a specific gap: structured, African-context-first intelligence for decision-makers who need evidence, not opinion.
            </p>
            <p>
              The platform produces structured reports, original frameworks, quantitative models, and interactive dashboards — across venture strategy, African market systems, climate and energy, data analytics, sports business intelligence, and policy analysis. The common thread is methodological rigour applied to real decisions.
            </p>
            <p>
              Every finding passes a reliability layer before publication. Confidence levels are classified. Sources are linked. Methodology is made explicit. The goal is not to produce more content — it is to produce intelligence that holds up over time.
            </p>
          </div>
        </div>
      </section>

      {/* Research Philosophy */}
      <section className="py-20 px-6 bg-gray-soft border-y border-border-soft">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-4">Research Philosophy</p>
          <h2 className="text-3xl font-semibold text-charcoal mb-6 leading-snug">How Herufi thinks about research</h2>
          <div className="space-y-4 text-charcoal/65 leading-relaxed">
            <p>
              Good research starts with a precise question. Not "what is happening in African fintech" but "what are the structural reasons why fintech credit products fail to scale beyond informal savings groups in East Africa?" The precision of the question shapes the quality of the answer.
            </p>
            <p>
              Herufi research is designed to have a long shelf life. It should still be useful six months after publication. That means avoiding reactive commentary and focusing on structural analysis that holds up over time.
            </p>
            <p>
              Where data is available, it is used. Where data is limited — as it often is in African markets — methodology is made explicit and qualitative intelligence is used with appropriate care. The goal is never to disguise uncertainty. It is to name it clearly and work within it honestly.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Approach */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-4">Platform Approach</p>
          <h2 className="text-3xl font-semibold text-charcoal mb-8 leading-snug">Seven capabilities. One platform.</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Research Institution', desc: 'Long shelf-life, evidence-backed analysis' },
              { label: 'Venture Intelligence', desc: 'Investment readiness and deal intelligence' },
              { label: 'Analytics Laboratory', desc: 'Models, forecasts, and quantitative rigour' },
              { label: 'Economic Strategy', desc: 'Market systems and structural analysis' },
              { label: 'Policy Research Hub', desc: 'Development finance and policy frameworks' },
              { label: 'Mixed Methods Engine', desc: 'Qualitative depth + quantitative rigour' },
              { label: 'Interactive Intelligence', desc: 'Dashboards, tools, and visual outputs' },
              { label: 'Sports Analytics', desc: 'Football economics and performance data' },
            ].map((c) => (
              <div key={c.label} className="bg-gray-soft border border-border-soft rounded-xl p-4">
                <p className="text-xs font-semibold text-charcoal mb-1 leading-snug">{c.label}</p>
                <p className="text-xs text-charcoal/50 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Herufi Works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-4">Approach</p>
          <h2 className="text-3xl font-semibold text-charcoal mb-10 leading-snug">How Herufi works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Define the question',
                body: 'Every engagement starts with a precise question or decision that needs to be made. Vague briefs produce vague outputs.',
              },
              {
                step: '02',
                title: 'Build the analysis',
                body: 'Research is structured around a methodology — quantitative where data exists, qualitative where it does not, always with explicit assumptions.',
              },
              {
                step: '03',
                title: 'Produce useful output',
                body: 'The deliverable is oriented around the decision or use case. A report that sits unread has failed.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-gray-soft rounded-xl p-6 border border-border-soft">
                <span className="text-3xl font-bold text-charcoal/10 block mb-3">{item.step}</span>
                <h3 className="text-base font-semibold text-charcoal mb-2">{item.title}</h3>
                <p className="text-sm text-charcoal/55 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="py-20 px-6 bg-cream border-y border-border-soft">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-4">Expertise</p>
          <h2 className="text-3xl font-semibold text-charcoal mb-8">Areas of deep work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {expertise.map((area) => (
              <div
                key={area}
                className="flex items-center gap-3 bg-white border border-border-soft rounded-lg px-4 py-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0" />
                <span className="text-sm text-charcoal/70">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
<section className="py-20 px-6 bg-white">
  <div className="max-w-4xl mx-auto">
    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-forest mb-6">Founder</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
      {/* Avatar */}
      <div className="flex flex-col items-center md:items-start gap-4">
        <div className="w-24 h-24 rounded-2xl bg-forest flex items-center justify-center">
          <span className="text-3xl font-bold text-cream">MO</span>
        </div>
        <div>
          <p className="font-semibold text-charcoal text-lg">Michael Omega</p>
          <p className="text-sm text-charcoal/50">Founder, Herufi</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/michael-omega-a179b3195/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-forest hover:text-forest-light transition-colors flex items-center gap-1"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            LinkedIn
          </a>
          <a
            href="mailto:hello@herufi.org"
            className="text-xs font-medium text-forest hover:text-forest-light transition-colors"
          >
            hello@herufi.org
          </a>
        </div>
      </div>
      {/* Bio */}
      <div className="md:col-span-2 space-y-4 text-charcoal/65 leading-relaxed text-sm">
        <p>
          Herufi was founded by a researcher and analyst with a background spanning venture strategy, impact investment, African market intelligence, and sports business analytics. The work is grounded in real engagement with founders, investors, and institutions operating across African markets — not theoretical frameworks built from a distance.
        </p>
        <p>
          The platform emerged from a consistent observation: that too much research about African markets is either too shallow, too generic, or built for a different audience. Decision-makers working in and around these markets need something different — structured, context-aware intelligence that actually helps them act.
        </p>
        <p>
          The research spans six core pillars because that is where the genuine analytical demand sits: venture strategy, market systems, climate and development, data intelligence, sports business, and culture and context. The common thread is rigour applied to real decisions.
        </p>
        <div className="grid grid-cols-2 gap-3 pt-3">
          {[
            'African venture ecosystems',
            'Impact and development finance',
            'Sports business analytics',
            'Data and decision modelling',
            'Market entry and strategy',
            'Climate and energy investment',
          ].map((skill) => (
            <div key={skill} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-forest flex-shrink-0" />
              <span className="text-xs text-charcoal/60">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Values */}
      <section className="py-20 px-6 bg-charcoal">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold mb-4">Values</p>
          <h2 className="text-3xl font-semibold text-cream mb-10">What Herufi stands for</h2>
          <div className="space-y-5">
            {values.map((v) => (
              <div key={v.title} className="border-b border-cream/10 pb-5 last:border-0">
                <h3 className="text-base font-semibold text-cream mb-1">{v.title}</h3>
                <p className="text-sm text-cream/50 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        label="Work together"
        headline="Looking for research or strategy support?"
        body="Get in touch to discuss how Herufi can help with your research, analytics, or decision intelligence needs."
        primaryCta={{ label: 'Contact Herufi', href: '/contact' }}
        secondaryCta={{ label: 'Explore our work', href: '/our-work' }}
      />
    </>
  )
}
