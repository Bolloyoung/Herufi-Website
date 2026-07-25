import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import r5fig1 from '@/data/charts/r5_fig1.json'
import r5fig6 from '@/data/charts/r5_fig6.json'
import r5fig9 from '@/data/charts/r5_fig9.json'

export default function HowToFillAfricasMissingMiddle() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">← Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Four Ways to Fill Africa&apos;s Missing Middle, and What Each One Really Costs</h1>
      <p className="summary">African startups get funded once and then stall. Four financing tools already used on the continent could change that. This is what the math says each one earns, costs and can realistically deliver.</p>
      <div className="meta"><span>Michael Omega</span><span>·</span><span>2026-07-25</span><span>·</span><span>9 min read</span></div>
      <div className="prose">
        <p><em>The fifth report in the African Startup Investment series.</em></p>
        <p>Four reports into this series, one problem keeps refusing to move. African startups raise a first cheque and then run out of road. The 2014 baseline measured it. The 2026 comparison found it had not improved. The 2030 forecast called it the biggest risk of the decade. Report 4 showed the money that would fix it simply is not organised to arrive. Every one of those reports measured the gap. This one asks a different question: what could actually fill it, and what would each option cost the people on both sides of the table.</p>
        <h2>First, the size of the hole</h2>
        <p>Out of every hundred African startups that raise a seed round, only four went on to raise a Series A in the most recent cohort measured. Seven years ago that number was almost thirteen. The companies did not get worse. The money stopped following through.</p>
        <BlogFigure data={r5fig1 as FigureData} />
        <blockquote>Figure 1: The gap in companies and in dollars. Roughly 100 to 150 companies a year now sit in the unfunded but fundable zone, which at a typical Series A cheque comes to $300M to $750M of demand nobody is serving.</blockquote>
        <p>Set that against everything African startups raised in 2025, about $3.2 billion, and the scale becomes clear. The missing piece is not the whole market. It is one stage, worth a few hundred million dollars a year, and it sits exactly where a company stops being a promising idea and starts being a real business.</p>
        <h2>Debt is cheaper than it looks, and more expensive than it sounds</h2>
        <p>Borrowing money instead of selling shares is the most developed of the four options on the continent today. Cauris Finance closed a $40 million debt facility for African fintechs. Spiro, MNT-Halan, valU, SolarAfrica and MAX all borrowed at scale, because their businesses own things a lender can hold as security: bikes, batteries, panels, loan books.</p>
        <p>The headline number on these facilities is an interest rate of 12% to 18%. That number is misleading in both directions. Price the whole structure, with the upfront fee, the success fee at the end and the small slice of equity the lender takes as a warrant, and a lender repaid on schedule earns about 27%, not 15%. The founder should read that as the real cost of the money. What the founder gets in exchange is enormous: giving up roughly 1% of the company instead of the 15% to 25% a priced round would take.</p>
        <p>The catch is simple and it is the reason debt suits some companies and ruins others. The repayment is due whether the business is having a good year or a bad one, and whether or not the next equity round shows up. Equity only pays out if things go well. Debt does not care.</p>
        <h2>Revenue based financing: the tool nobody in Africa is offering</h2>
        <p>The second option works like this: an investor advances money and takes a fixed slice of monthly revenue, say 8%, until a capped total is repaid, usually about 1.4 times the advance. No board seat, no equity, no fixed monthly payment. If revenue dips, the payments dip with it.</p>
        <p>It fits Africa&apos;s subscription platforms and steady fintechs almost perfectly. And essentially nobody on the continent offers it. There is no dedicated African vehicle at scale, which makes this the one genuinely empty lane of the four.</p>
        <p>There is a quirk worth knowing before anyone rushes in. Because the repayment total is capped, a fast growing company hits that cap sooner, which means it pays the same amount of money over a much shorter period. In annual terms, that makes the capital more expensive the faster you grow. Steady, predictable businesses get the best deal here. The rocket ships get the worst one, which is roughly the opposite of what a venture investor is looking for, and probably part of why the instrument has not arrived yet.</p>
        <h2>The one that moves the most money per dollar</h2>
        <p>The third option is the least intuitive and by far the most powerful. Someone patient, usually a development finance institution, agrees to take the first losses in a pool of investments. Everyone else invests behind that cushion. Because the cushion absorbs the early damage, capital that would never touch African venture suddenly can.</p>
        <p>The numbers on this are not theoretical. The African Guarantee Fund turned $4 million of its own capital into $45 million of guarantee capacity, roughly eleven dollars moved for every one committed, and is targeting $500 million by 2028. MIGA mobilised $8.40 of private money for every dollar of guarantee capacity in 2025. Closer to startups, I&amp;P and the Catalyst Fund both run venture pools built on exactly this structure.</p>
        <BlogFigure data={r5fig6 as FigureData} />
        <blockquote>Figure 2: What each side of a first loss structure gets. A junior cushion worth 15% of the pool cuts the senior investor&apos;s chance of losing money from 11.4% to 6.3%, and the junior investor is paid for that position rather than donating it.</blockquote>
        <p>That halving of risk is the whole point, and it matters most for one specific group of investors. Kenyan and Nigerian pension funds hold enormous room under their regulatory caps and almost no exposure to venture. Their obstacle has never been money. It is that a trustee cannot approve an investment carrying a roughly one in nine chance of losing capital outright. Put a cushion underneath it and the same investment becomes something a trustee can sign.</p>
        <h2>Syndicates: real, useful, and small</h2>
        <p>The fourth option pools many small cheques behind one lead investor. Future Africa runs an AngelList syndicate writing standard $50,000 cheques and reports a 51.6% return since 2014, with early money into Andela, Flutterwave and Kobo360. iHub runs something similar across about a thousand investors.</p>
        <p>Filling a $5 million round this way takes a hundred backers at Future Africa&apos;s cheque size, and costs about a quarter of the eventual upside in fees to the lead and the platform. A 5x company hands a backer 4x. That is a fair price for something that otherwise could not happen at all, since a $40,000 cheque has no route into a $5 million round on its own. The limit is arithmetic: Africa&apos;s organised angels deployed just $4.4 million in all of 2025. Aggregation cannot conjure capital that is not there.</p>
        <h2>Add it all up and be honest about the answer</h2>
        <BlogFigure data={r5fig9 as FigureData} />
        <blockquote>Figure 3: What each mechanism could realistically deliver by 2030, against the gap. The two mature options get most of the way. Nothing gets all of the way.</blockquote>
        <p>Debt could plausibly move $150 million to $300 million a year toward this stage. First loss structures could unlock another $100 million to $250 million if two or three more vehicles reach the scale the African Guarantee Fund already operates at. Syndicates stay under $50 million. Revenue based financing delivers nothing until somebody builds the vehicle.</p>
        <p>Together, the two mature mechanisms reach $250 million to $550 million a year against a gap of $300 million to $750 million. Meaningful, and not a clean solve.</p>
        <p>What that leaves is a clearer picture than this series has had at any point. The missing middle is not missing because nobody knows how to fill it. Every tool described here already exists in Africa, already works and already has named vehicles running it. It is missing because none of them has been deployed anywhere near the scale the gap requires. That is a problem of ambition and allocation, not invention, and problems of that kind get solved when enough people decide to solve them.</p>
        <hr />
        <p><em>Based on <Link href="/publications/filling-the-missing-middle-2026">Filling the Missing Middle: Return Math for Africa&apos;s Series A and B Gap</Link> (M. Omega, July 2026), the fifth report in the African Startup Investment series. All four mechanism models were independently re run for this publication and every external figure is sourced and dated. No personal data was used in this analysis.</em></p>
      </div>
      <Link className="pubcard" href="/publications/filling-the-missing-middle-2026">
        <span className="eyebrow gold">Full Publication</span>
        <h3>Filling the Missing Middle: Return Math for Africa&apos;s Series A and B Gap</h3>
        <p>This blog draws on a detailed publication. Read the full analysis, the four mechanism models, the blended capital stack, methodology and sources.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <div className="tags"><span className="tag">Venture Capital</span><span className="tag">Venture Debt</span><span className="tag">Blended Finance</span><span className="tag">Series A</span></div>
    </article>
  )
}
