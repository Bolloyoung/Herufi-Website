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
      <p className="summary">Development finance pulled back harder than ever in 2025 and local capital surged to fill the gap. Here is what that shift, and a portfolio model built on it, mean for how a fund should actually be built.</p>
      <div className="meta"><span>Michael Omega</span><span>24 July 2026</span><span>7 min read</span></div>
      <div className="prose">
        <p><em>The fourth report in the African Startup Investment series.</em></p>
        <p>Two things happened to African venture capital in 2025, and they point in opposite directions.</p>
        <p>The money behind the funds changed hands. For three decades it came mostly from public institutions in Europe. Last year African corporations and local investors took over, and the foreign share collapsed. That is the broader, more local capital base the continent has been asking for.</p>
        <p>At the same time, the bet those funds are placing got worse. A startup that raised a seed round in 2019 had roughly a one in eight chance of raising the next round. For companies that raised seed in 2022, it was closer to one in twenty four, and it took them almost a year longer to find out.</p>
        <p>So a fund being raised today sits on new money and old arithmetic. This piece is about what the arithmetic should now say.</p>
        <h2>The money behind the funds changed hands in a single year</h2>
        <p>Venture funds do not invest their own money. They raise it from backers, who in the industry are called limited partners, or LPs. In Africa those backers were, for thirty years, mostly development finance institutions: public bodies such as the IFC, British International Investment, Proparco, DEG, the European Investment Bank and the African Development Bank, which invest public money in poorer countries.</p>
        <p>In 2025 that base moved further than it ever has. Development institutions fell from an average 45% of the money committed to African funds to 27%. European venture and development money together fell from 70% to 21%. African corporations went the other way, from 7% of commitments to 41%, and local African backers rose toward a quarter of the total.</p>
        <BlogFigure data={r4fig1 as FigureData} />
        <blockquote>Figure 1: Who funds the funds. The 2025 mix flipped from foreign development capital toward African corporates and local capital in a single year.</blockquote>
        <p>That shift happened during a drought, not a boom. Just $107M closed across six funds in 2025, down 87% on the year before. For the first time since 2021, no Africa focused fund reached a $100M final close.</p>
        <p>Those two facts belong together. A market that is calmly reallocating does not also shrink by seven eighths. This is a capital base being rebuilt in real time, and the builders are not the ones who built the last one.</p>
        <h2>A seed cheque today buys worse odds than it did in 2019</h2>
        <p>The number that matters most to a seed investor is the share of companies that raise the round after the one they funded. Seed money buys a lottery ticket into Series A, the round that turns a promising experiment into a company with scale. If that conversion rate falls, every seed fund in the market is quietly overpaying.</p>
        <p>The 2014 baseline that opened this series put African seed to Series A conversion at 5.1%, already a third of North America&apos;s rate. Partech&apos;s 2025 report now splits that figure by the year a company raised its seed, and the trend runs the wrong way. The 2019 group converted at 12.7%, within about eighteen months. The 2022 group converted at 4.2%, and took twenty nine months to do it.</p>
        <BlogFigure data={r4fig6 as FigureData} />
        <blockquote>Figure 2: The graduation crisis, updated. A newer, more selectively funded group is converting at a worse rate over a longer timeline, not a better one.</blockquote>
        <p>Read that carefully, because the direction is counterintuitive. The 2022 companies were funded more selectively than the 2019 ones. They still did worse. Whatever is stopping them is not the quality of the screen at seed.</p>
        <p>For anyone building a fund now, that is one concrete change: underwrite a 4% to 7% chance that a fresh seed company reaches Series A, not the 10% or more a 2019 era pattern suggests. That single assumption drives how much of the fund should be held back and how it should be spent.</p>
        <h2>Holding money back only helps if a fund can actually deploy it</h2>
        <p>Funds keep part of their capital in reserve. The idea is simple: invest in twenty five companies, then put more money into the few that start working. The money held back is the reserve, and the later cheques are follow ons.</p>
        <p>To test how big a reserve should be, this report runs a representative $30M African seed fund 20,000 times through a simulator. Each run gives every company a different outcome, drawn from Correlation Ventures&apos; published distribution of roughly 24,000 US venture deals between 2004 and 2018. That distribution is brutal and it is the point: 65% of deals return less than the money put in, and 0.4% return more than fifty times it. Venture returns come from a handful of extreme winners, so a fund&apos;s job is to own enough tickets to hold one.</p>
        <p>The base case fund holds 25 positions, reserves 40% of its capital and puts two follow on dollars in for every initial dollar.</p>
        <BlogFigure data={r4fig8 as FigureData} />
        <blockquote>Figure 3: The base case fund. Median outcome 1.52x, and it is the top tenth of runs, not the middle, that approaches the 3x a top quartile fund reports.</blockquote>
        <p>The model lines up with Carta&apos;s published fund benchmarks, and it produces three results worth building a fund around.</p>
        <p>More companies cuts the risk of losing money, on its own. The chance a fund returns less than it raised falls from roughly 31% at fifteen positions to about 12% at forty. Nothing clever is happening here. The fund is simply buying more tickets against a distribution where almost everything depends on holding one winner.</p>
        <p>Putting more into the winners lifts the middle outcome without adding much risk. That sounds too good until the reason becomes clear: follow on money only ever goes into companies that have already shown they can raise the next round. It is not a second bet. It is a larger share of a bet that is already paying.</p>
        <p>And reserving more than a fund can realistically spend is a drag, not a hedge. A fund that holds back 80% of its capital against a 7% graduation rate ends up with a worse middle outcome than one holding back 20%. The reason is dull and decisive. Money that never finds a company to follow sits there at the value it went in at, compounding nothing, while the companies that could have used it were never bought.</p>
        <h2>The strongest result in the model is also the one to read most carefully</h2>
        <p>The most useful thing the simulator does is compare two kinds of fund. One writes seed cheques into companies and hopes. The other only buys into companies that have already cleared the seed to Series A hurdle. In this model, the second configuration lifts the middle outcome several times over and cuts the chance of losing money to under 1%.</p>
        <p>Read the direction, not the size. No public dataset splits African venture returns by whether a company had already graduated, so the magnitude here is a property of the model rather than a measured fact. What the direction echoes is the first lesson this series produced from the 2014 data: the constraint was never capital arriving. It was capital following through.</p>
        <h2>What to do about it</h2>
        <p>A fund manager should underwrite the 2022 odds rather than the 2019 ones, and size the reserve to what the fund can realistically deploy against those odds rather than to an industry rule of thumb. The second move is to go where the money went this year. Corporate investors and local pension capital are now writing the cheques European development institutions used to write, and those are different relationships to build.</p>
        <p>For an institution or a pension fund allocating capital, the headroom in Kenya and Nigeria is the story. Both hold enormous assets, both sit at roughly 1% of them in private equity and venture, and both have regulatory caps far above that. The constraint there has never been money. Report 5 in this series looks at what it would take to make that capital signable.</p>
        <hr />
        <p><em>Based on <Link href="/publications/writing-the-cheques-2026">Who Is Actually Writing the Cheques: African VC&apos;s Capital Supply Layer and Portfolio Construction</Link> (M. Omega, July 2026), the fourth report in the African Startup Investment series, with a portfolio simulator independently re-run for this publication and every external figure sourced and dated. No personal data was used in this analysis.</em></p>
      </div>
      <Link className="pubcard" href="/publications/writing-the-cheques-2026">
        <span className="eyebrow gold">Full Publication</span>
        <h3>Who Is Actually Writing the Cheques: African VC&apos;s Capital Supply Layer and Portfolio Construction</h3>
        <p>Report 4 of the African Startup Investment series. The full capital supply map, the fund simulator, the methodology and every source.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <div className="tags"><span className="tag">Venture Capital</span><span className="tag">LP Capital</span><span className="tag">Portfolio Construction</span><span className="tag">Fund Strategy</span></div>
    </article>
  )
}
