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
      <div className="meta"><span>Michael Omega</span><span>16 July 2026</span><span>4 min read</span></div>
      <div className="prose">
        <p><em>The first report in the African Startup Investment series.</em></p>
        <p>Here is the puzzle. In 2014, African startups got funded faster than almost anywhere on earth, about 13 months after being founded, quicker than in the United States or China. The ecosystem was growing fast too. The number of newly funded African startups quadrupled in five years.</p>
        <p>Almost none of those companies ever got big. Why not?</p>
        <p>The answer is in the size of the cheque. The typical African seed investment was $40,000. In Southeast Asia it was $315,000. In the United States, $500,000.</p>
        <p>Forty thousand dollars pays for a pilot. It does not pay for the eighteen months of operating money a company needs to build something an investor will fund again. So African startups came back to the market early, with too little to show, and the market said no.</p>
        <h2>The numbers on &quot;no&quot; are brutal</h2>
        <p>Out of every 100 African startups that raised a seed round, only 5 ever reached Series A. That is the round that turns a promising experiment into a company that can scale. In North America, 16 of every 100 got there.</p>
        <p>The rest of the picture is worse. Only 17% of African startups ever raised a second round of any kind, and just 1 in 100 was ever acquired.</p>
        <p>These companies were not failing to launch. They were being stranded after launch, which is a different problem with a different fix.</p>
        <BlogFigure data={r1fig6 as FigureData} />
        <blockquote>Figure 1: African seed cheques were a fraction of everyone else&apos;s and African startups almost never graduated to Series A.</blockquote>
        <h2>A model tested the obvious objection, and cleared Africa&apos;s name</h2>
        <p>The obvious objection is that African startups raise less because they are worth less. So we tested it. We trained a model on 7,700 seed funded startups worldwide to find what actually predicts reaching Series A.</p>
        <p>The strongest single predictor was the size of the seed cheque. It mattered more than the country the company was in, and more than the sector it worked in.</p>
        <p>In plain terms: an African startup funded like an American one has a fighting chance. The problem was never that these companies are African. It is how much money they were given to prove themselves.</p>
        <h2>Three other regions show what works, and what only looks like it works</h2>
        <p>The United States shows that an ecosystem compounds on follow on money and exits, not on first cheques. The first cheque starts a company. The second one builds it, and the exit pays for the next round of first cheques.</p>
        <p>Singapore shows that one hub can serve a whole region. That is a template for Lagos, Nairobi, Cairo and Cape Town, which already host two thirds of Africa&apos;s funded startups between them.</p>
        <p>Chile is the warning. It handed out thousands of standardised grants of about $40,000 and produced a great many startups, alongside the worst graduation rate anywhere measured: 2.4%. Cheap cheques manufacture startup counts, not companies.</p>
        <BlogFigure data={r1fig5 as FigureData} />
        <blockquote>Figure 2: The funding ladder in Africa versus North America. Africa&apos;s ladder breaks after the first rung.</blockquote>
        <h2>Fewer, bigger cheques beat more of them</h2>
        <p>If you put money into African startups, whether as a fund, an angel investor, a government or a development finance institution, the highest value move is not writing more first cheques.</p>
        <p>It is writing fewer and bigger ones, $300,000 or more, syndicated with other investors where a single cheque will not stretch. Then holding money back to follow on when a company earns it.</p>
        <p>The talent to climb the ladder is already there. The ladder is what is missing a rung.</p>
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
