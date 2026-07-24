import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import r4fig1 from '@/data/charts/r4_fig1.json'
import r4fig6 from '@/data/charts/r4_fig6.json'
import r4fig8 from '@/data/charts/r4_fig8.json'

export default function WhoWritesTheChequesAfricanVC() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">← Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Who Is Actually Writing Africa&apos;s VC Cheques Now</h1>
      <p className="summary">The African Startup Investment series looked at what the money does. This is what I found when I went one layer deeper, to who supplies it and how a fund manager should actually build a portfolio around it.</p>
      <div className="meta"><span>Michael Omega</span><span>·</span><span>2026-07-24</span><span>·</span><span>10 min read</span></div>
      <div className="prose">
        <p><em>The fourth notebook in the African Startup Investment series.</em></p>
        <p>I have sat on the fund facing side of this problem: building investor pipelines, preparing board and LP materials, and working through how a debt facility gets structured to plug a working capital gap a pure equity vehicle cannot reach. So when people ask me where African VC is headed, the honest answer starts with who is actually funding the funds, because that has changed faster in the past eighteen months than at any point I have tracked.</p>
        <h2>The backbone just moved</h2>
        <p>For three decades, development finance institutions such as IFC, British International Investment, Proparco, DEG, the EIB and the African Development Bank were the backbone of startup investing on the continent. In 2025 that backbone shifted harder than the ecosystem has ever seen. DFI commitments fell from an average 45% share of LP capital to 27%. European VC and DFI money fell from 70% to 21%. In the same period, African corporates jumped from 7% to 41% of commitments and local African LPs rose toward a quarter of the total.</p>
        <BlogFigure data={r4fig1 as FigureData} />
        <blockquote>Figure 1: Who funds the funds. The 2025 LP mix flipped from foreign development capital toward African corporates and local capital in a single year.</blockquote>
        <p>Total fund manager fundraising collapsed alongside that mix shift, just $107M closed across six funds in 2025, an 87% year on year decline, and for the first time since 2021 no Africa focused fund reached a $100M final close. That is not a healthy market pausing. It is a market rebuilding its capital base in real time.</p>
        <h2>The graduation math got worse, not better</h2>
        <p>The 2014 baseline that opened this series found a 5.1% seed to Series A conversion rate for African startups, already a third of North America&apos;s. Partech&apos;s 2025 Africa Tech VC Report now breaks that number out by cohort year and the trend should worry anyone underwriting a seed fund today. The 2019 cohort converted at 12.7% within about eighteen months. The 2022 cohort converted at just 4.2%, and it took twenty nine months to get there.</p>
        <BlogFigure data={r4fig6 as FigureData} />
        <blockquote>Figure 2: The graduation crisis, updated. A newer, more selectively funded cohort is converting at a worse rate over a longer timeline, not a better one.</blockquote>
        <p>This matters directly for portfolio construction, which is the part of this notebook I most wanted to get right. A fund built today should underwrite something closer to a 4% to 7% graduation probability for a fresh seed cheque, not the 10% plus that a 2019 era pattern would suggest. That single assumption changes how much of a fund should sit in reserve and how it should be deployed.</p>
        <h2>What the reserve math actually says</h2>
        <p>I built a Monte Carlo fund simulator calibrated to Correlation Ventures&apos; published venture return distribution (roughly 24,000 US deals, 2004 to 2018, where 65% of deals return less than 1x and just 0.4% return more than 50x) and to the graduation data above, then ran 20,000 simulations of a representative $30M African seed fund: 25 initial positions, a 40% reserve share and a standard 2 for 1 follow on ratio.</p>
        <BlogFigure data={r4fig8 as FigureData} />
        <blockquote>Figure 3: The base case fund. Median outcome 1.52x, and it is the top decile, not the median, that approaches the 3x TVPI benchmark top quartile funds report.</blockquote>
        <p>The model holds up against Carta&apos;s published fund benchmarks and it produces three concrete findings worth underwriting to. More initial positions cuts loss risk sharply on its own, from roughly 31% at fifteen positions to about 12% at forty, simply by buying more tickets against a power law. A higher follow on multiple lifts the median return without materially adding loss risk, because follow on dollars only ever chase companies that already showed graduation signal. And reserving more than a fund can realistically deploy is a drag, not a hedge: a fund reserving 80% of its capital against a 7% graduation rate posts a lower median return than one reserving 20%, because the unused reserve sits idle at a 1.0x placeholder instead of compounding anywhere.</p>
        <p>The most useful single result, if I am advising a manager raising a $20M to $40M Africa focused vehicle right now, is what happens when you stop blind seeding and instead build a fund that only buys into companies that have already cleared one seed to Series A filter. In this model that specialist configuration lifts the median multiple several times over and cuts loss probability to under 1%. Read the direction, not the exact size of that number, since no public dataset splits African returns by prior graduation status. But the direction echoes the very first lesson this series produced back in the 2014 baseline: the constraint was never capital entering the ecosystem. It was capital following through.</p>
        <h2>So what</h2>
        <p>If you manage a fund, underwrite a 2022 cohort graduation rate, not a 2019 one. Size your reserve to that rate rather than to an industry rule of thumb. And go where the LP money actually moved this year, corporate strategics and local pension capital, not just the DFI relationships that built the last decade of African VC. If you allocate capital as an LP, the pension fund headroom alone in Kenya and Nigeria is worth a serious look before the next fundraising cycle closes it off.</p>
        <hr />
        <p><em>Based on <Link href="/publications/writing-the-cheques-2026">Who Is Actually Writing the Cheques: African VC&apos;s Capital Supply Layer and Portfolio Construction</Link> (M. Omega, July 2026), the fourth report in the African Startup Investment series, with a portfolio simulator independently re-run for this publication and every external figure sourced and dated. No personal data was used in this analysis.</em></p>
      </div>
      <Link className="pubcard" href="/publications/writing-the-cheques-2026">
        <span className="eyebrow gold">Full Publication</span>
        <h3>Who Is Actually Writing the Cheques: African VC&apos;s Capital Supply Layer and Portfolio Construction</h3>
        <p>This blog draws on a detailed publication. Read the full analysis, the fund simulator, methodology and sources.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <div className="tags"><span className="tag">Venture Capital</span><span className="tag">LP Capital</span><span className="tag">Portfolio Construction</span><span className="tag">Fund Strategy</span></div>
    </article>
  )
}
