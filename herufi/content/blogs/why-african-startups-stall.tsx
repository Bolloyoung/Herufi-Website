import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import r1fig5 from '@/data/charts/r1_fig5.json'
import r1fig6 from '@/data/charts/r1_fig6.json'

export default function WhyAfricanStartupsStall() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">← Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Why African Startups Stall After Their First Cheque</h1>
      <p className="summary">We analysed 49,000 companies worldwide to find out what really holds African startups back. The answer is not talent, sectors or geography. It is the size and shape of the money.</p>
      <div className="meta"><span>Michael Omega</span><span>·</span><span>2026-07-16</span><span>·</span><span>6 min read</span></div>
      <div className="prose">
        <p><em>The African Startup Investment Trilogy. Explainer 1 of 3.</em></p>
        <p>Here is the puzzle. Back in 2014, African startups actually got funded faster than almost anywhere else, about 13 months after founding, quicker than in the United States or China. The ecosystem was growing fast too: the number of newly funded African startups quadrupled in five years. And yet almost none of these companies ever grew big. Why?</p>
        <p>The answer is in the cheque book. The typical (median) African seed investment was $40,000. In Southeast Asia it was $315,000. In the United States, $500,000. Forty thousand dollars pays for a pilot project, not for the 18 months of runway a company needs to prove itself to the next investor. So African startups came back to the market too early, with too little to show and the market said no.</p>
        <h2>The numbers on &quot;no&quot; are brutal</h2>
        <p>Of every 100 African startups that raised a seed round, only 5 ever reached Series A, the round that turns a promising experiment into a scaling company. In North America, 16 of every 100 made it. Only 17% of African startups ever raised a second round of any kind and just 1 in 100 was ever acquired. Startups were not failing to launch. They were being stranded after launch.</p>
        <BlogFigure data={r1fig6 as FigureData} />
        <blockquote>Figure 1: African seed cheques were a fraction of everyone else&apos;s and African startups almost never graduated to Series A.</blockquote>
        <h2>A machine learning model confirmed it and cleared Africa&apos;s name</h2>
        <p>We trained a model on 7,700 seed funded startups worldwide to find what predicts making it to Series A. The single strongest predictor was the size of the seed cheque, bigger than the effect of the startup&apos;s country and bigger than its sector. In plain terms: an African startup funded like an American one has a fighting chance. The problem was never that these companies are African. It is how they were capitalised.</p>
        <h2>Other regions show what works and what does not</h2>
        <p>The United States shows that follow on money and exits, not first cheques, are what make an ecosystem compound. Singapore shows how one hub can serve a whole region, a template for Lagos, Nairobi, Cairo and Cape Town, which already host two thirds of Africa&apos;s funded startups. And Latin America is the warning: Chile handed out thousands of standardised grants of about $40,000 and produced lots of startups but the worst graduation rate anywhere, just 2.4%. Cheap cheques manufacture startup counts, not companies.</p>
        <BlogFigure data={r1fig5 as FigureData} />
        <blockquote>Figure 2: The funding ladder in Africa versus North America. Africa&apos;s ladder breaks after the first rung.</blockquote>
        <h2>So what?</h2>
        <p>If you invest in African startups, as a fund, an angel, a DFI or a government, the highest impact move is not writing more first cheques. It is writing fewer, bigger ones ($300K or more, syndicated if necessary) and reserving money to follow on when a company earns it. Fix the ladder and the talent is already there to climb it.</p>
        <hr />
        <p><em>Based on <Link href="/publications/broken-ladder-2014-baseline">The Broken Ladder: A Global Baseline Diagnosis of African Startup Investment</Link> (M. Omega, July 2026), analysing a Crunchbase derived dataset of 49,436 companies with funding recorded to 2014. Full report and reproducible notebooks available on request. No personal data was used in this analysis.</em></p>
      </div>
      <Link className="pubcard" href="/publications/broken-ladder-2014-baseline">
        <span className="eyebrow gold">Full Publication</span>
        <h3>The Broken Ladder: A Global Baseline Diagnosis of African Startup Investment</h3>
        <p>This blog draws on a detailed publication. Read the full analysis, methodology and sources.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <Link className="nextcard" href="/blogs/real-story-african-startup-growth">
        <div><span className="eyebrow forest">Next in the trilogy</span><h3>African Startups Raise 10x More Than a Decade Ago. That Is Not the Real Story.</h3></div>
        <span className="arrow">→</span>
      </Link>
      <div className="tags"><span className="tag">Startup Funding</span><span className="tag">Venture Capital</span><span className="tag">Seed Stage</span><span className="tag">Africa</span></div>
    </article>
  )
}
