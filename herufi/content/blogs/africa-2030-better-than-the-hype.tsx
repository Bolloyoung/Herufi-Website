import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import r3fig3 from '@/data/charts/r3_fig3.json'
import r3fig5 from '@/data/charts/r3_fig5.json'

export default function Africa2030BetterThanTheHype() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">← Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Africa 2030: The $5.5 Billion Story That Beats the Hype</h1>
      <p className="summary">Forecasts of $60 to $90 billion make headlines. The math says something more modest and more useful. Here is where African startup funding is actually heading.</p>
      <div className="meta"><span>Michael Omega</span><span>·</span><span>2026-07-14</span><span>·</span><span>6 min read</span></div>
      <div className="prose">
        <p><em>The African Startup Investment Trilogy. Explainer 3 of 3.</em></p>
        <p>We tested the forecasting methods before trusting them. The test was humbling. We trained the standard &quot;draw a growth line&quot; model on 2015 to 2022 data and asked it to predict 2023 to 2025. It predicted $18 billion for 2025. Reality: $3.2 billion. Off by a factor of six. That failed method is exactly how the eye catching &quot;$62 to $94 billion by 2030&quot; projections are produced. They would require the market to grow 81% to 97% per year, five years running. It has never once done that sustainably.</p>
        <h2>So what does a validated forecast say?</h2>
        <p>Roughly a doubling by 2030. Using 10,000 simulations built from the market&apos;s actual growth behaviour and checked against the just published first half 2026 numbers, which the model called correctly, the base case (50% likely) puts African startup funding around $5.5 billion a year by 2030. The bear case is about $2.3 billion. The bull case, needing an IPO breakthrough and global easing, is about $11 billion.</p>
        <BlogFigure data={r3fig3 as FigureData} />
        <blockquote>Figure 1: Where African startup funding is heading. Bear, base and bull scenarios for 2026 to 2030, drawn inside the range of 10,000 simulations.</blockquote>
        <BlogFigure data={r3fig5 as FigureData} />
        <blockquote>Figure 2: Reality check. The growth rates each 2030 target requires. The headline $62 to $94 billion projections need growth the market has never sustained.</blockquote>
        <h2>The most reliable prediction is not about funding at all. It is about exits.</h2>
        <p>Startup acquisitions went from 39 (2024) to 67 (2025) to 63 in just the first half of 2026. Consolidation thrives even when funding is tight, so roughly 175 exits a year by 2030 is the most defensible number in the whole forecast. By 2030, Africa&apos;s startup market should also carry around 15 billion dollar companies, a permanent 35% to 40% debt layer and, slowly, a broader map beyond the four big hubs.</p>
        <h2>One warning light is flashing: the number of deals is shrinking</h2>
        <p>Money held up in early 2026 ($1.44 billion, flat on 2025) but across far fewer deals, propped up by one $270 million mega round. Fewer seed deals today means fewer Series A companies in 2029. This is the indicator most likely to turn the base case into the bear case and it argues for doing the unfashionable thing: investing early stage, now, while everyone else has retreated.</p>
        <h2>So what?</h2>
        <p>Plan for the $5.5B market, survive the $2.3B one and keep a ticket for the $11B one. In practice: price deals for a disciplined market, hold follow on reserves, build or borrow credit skills for the debt layer, position around the exit boom (secondaries, consolidation plays) and be counter cyclical at seed while it is cheap. And watch six dials: deal counts, the first African unicorn IPO, the debt share, who is buying the exits, Nigeria&apos;s recovery and US interest rates. They will tell you which future is arriving long before the headlines do.</p>
        <hr />
        <p><em>Based on <Link href="/publications/continent-heading-2026-2030">Where the Continent Is Heading: Validated Scenarios for African Startup Funding, 2026 to 2030</Link> (M. Omega, July 2026). Methods: backtesting, Monte Carlo simulation, out of sample validation against H1 2026 actuals and external benchmarks (Tony Blair Institute, GSMA, McKinsey). No personal data was used.</em></p>
      </div>
      <Link className="pubcard" href="/publications/continent-heading-2026-2030">
        <span className="eyebrow gold">Full Publication</span>
        <h3>Where the Continent Is Heading: Validated Scenarios for African Startup Funding, 2026 to 2030</h3>
        <p>This blog draws on a detailed publication. Read the full analysis, methodology and sources.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <Link className="nextcard" href="/publications">
        <div><span className="eyebrow forest">Next in the trilogy</span><h3>Read the full trilogy: three source linked reports in Publications</h3></div>
        <span className="arrow">→</span>
      </Link>
      <div className="tags"><span className="tag">Forecasting</span><span className="tag">Venture Capital</span><span className="tag">Scenarios</span><span className="tag">Exits</span></div>
    </article>
  )
}
