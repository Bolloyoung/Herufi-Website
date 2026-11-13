import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import ag_fig7 from '@/data/charts/ag_fig7.json'
import ag_fig8 from '@/data/charts/ag_fig8.json'

export default function GoodBusinessWrongMoney() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">&larr; Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Good Business, Wrong Money</h1>
      <p className="summary">Equity funding for African agricultural technology fell by roughly three quarters in three years. That is usually read as investors losing faith. The balance sheets suggest something else: capital finally finding the instrument these businesses can actually service.</p>
      <div className="meta"><span>Michael Omega</span><span>28 October 2026</span><span>11 min read</span></div>
      <div className="prose">
        <p>A company can be a good business and a bad investment at the same time, for the same investor. That is not a paradox, and it is not a polite way of saying the company is mediocre. It is the single most useful idea in African agricultural finance, and a decade of disappointment in the sector comes from missing it.</p>
        <p>Consider a maize processor with a 12 per cent margin, growing revenue 40 per cent a year, with contracts from two large buyers and a waiting list of farmers who want to supply it. It is an excellent borrower. It is a poor venture investment. Both are true at once, and neither is a judgement about the quality of the company.</p>
        <p>The previous article established that small farm loans fail on cost rather than on risk. That means the businesses are not uniquely dangerous. It leaves the obvious question unanswered.</p>
        <p><strong>If these businesses are not dangerous, what exactly is wrong with the money they have been offered?</strong> The short answer is that it did not match them. Five very different kinds of agricultural company have been handed broadly one kind of capital, and only one of the five was ever built to take it.</p>
        <hr />
        <h2>Equity left agricultural technology faster than it left anything else</h2>
        <p>Two facts from 2025 look contradictory until they sit side by side.</p>
        <p>African technology funding went up. The continent&apos;s startups raised 4.1 billion dollars, about a quarter more than the year before. Debt reached a record 1.6 billion, 41 per cent of all capital deployed, against 17 per cent in 2019.</p>
        <p>African agricultural technology went down. The sector raised 168 million dollars in 2025 against 207 million in 2024, a second annual fall in a row. Inside that total, equity dropped from roughly 328 million in 2022 to roughly 80 million in 2025, a minority of sector funding for the first time.</p>
        <p>Two caveats on that data. The 2023 figure is not disclosed in the available coverage, so the decline is measured across a gap. And Partech puts 2025 agricultural technology equity at 93 million rather than 80, because the two trackers define the sector differently. The direction is not in dispute. The decimal places are.</p>
        <p>So the market rose while agriculture fell, and within agriculture the part that collapsed was specifically equity. The usual reading is that investors got burned and walked away. That is at most half of it. The more useful reading is that capital is doing something rational and slightly embarrassing. It is discovering, late, that it had been offering these companies the wrong instrument for a decade.</p>
        <hr />
        <h2>Venture capital is not patient money. It is a product with requirements.</h2>
        <p>Risk appetite is not the answer. A venture fund needs a small number of enormous winners, because it is paid for by its two or three best investments rather than its average one. It needs them to turn into cash within roughly ten years, because a fund has a life. And it needs growth that outruns cost.</p>
        <p>A maize processor fails all three. To double revenue it must buy twice as much maize, hire more people, rent more storage and tie up more cash, so everything required to support revenue grows with revenue. Its exit options are thin. Its risks are mostly ones no founder can fix.</p>
        <p>None of that makes it a bad company. It makes it a bad fit for one instrument, which is an entirely different judgement. The sector has spent years treating the second as a verdict on the first.</p>
        <hr />
        <h2>Five business models, five balance sheets, one cheque</h2>
        <p>Agricultural technology is not one industry. It is at least five, with five different financial shapes. Each one below carries a real company, because a framework nobody can check against the record is just a diagram. None of these businesses succeeded or failed for one reason, none publishes audited profit figures, and nothing here claims the instrument was the only cause.</p>
        <p><strong>The input distributor</strong> sells seed and fertiliser on a thin margin, with its money sitting in stock. What fits is a revolving credit line in local currency that expands before planting and shrinks after harvest. What it often got was growth equity. iProcure reached more than a million farmers on about 17 million dollars, then entered administration in April 2024 after a round failed to close. A round that does not arrive is not a facility.</p>
        <p><strong>The crop buyer and processor</strong> owns machinery, warehouse stock and buyer contracts, with cash bunched around harvest. What fits is trade finance against the stock, plus long term debt for the plant. What it often got was venture equity expecting growth that tonnage cannot produce. Twiga Foods raised more than 180 million dollars and built its own trucks, depots and logistics hub. Then it spent three years dismantling that, and in 2025 announced a shift to an asset light model. A subsidiary entered administration in August 2026. The pivot is the company agreeing the balance sheet and the cheque never matched.</p>
        <p><strong>The lender embedded in the supply chain</strong> lends to farmers it already trades with, so its loan book is the business. What fits is debt to fund that book, loss cover on the portfolio, and equity only for the technology. What it often got was equity funding the loan book itself, the most expensive mistake here, because a loan book is the one thing in agriculture that makes genuinely good collateral. Apollo Agriculture is the contrast. In May 2026 it bundled its farmer loans and sold investors a security backed by the repayments, raising 276 million shillings against a pool covering 23,839 farmers. The loan book funded by money secured on the loan book, in the currency the farmers repay in.</p>
        <p><strong>The digital advisory service or marketplace</strong> sells software, advice or access, and can add customers without adding much cost. What fits is venture capital, and this is the one case where it genuinely does. Pula sells agricultural insurance through more than a hundred partners rather than directly, so somebody else already paid the cost of reaching the farmer. Notice who wrote its 20 million dollar cheque in April 2024: BlueOrchard, the International Finance Corporation and a World Bank managed fund. Even the one model with venture shaped economics was funded by impact and development investors.</p>
        <p><strong>The asset financier</strong> funds tractors, irrigation and equipment that earn over several years, with the asset as security. What fits is long term local currency debt. What it often got was a seven year fund backing a ten year asset. SunCulture, which sells solar irrigation pumps on credit, closed a 10 million dollar facility in September 2026 into a vehicle that buys those receivables. Equity pays for the product, and the assets are funded against the cash they generate.</p>
        <p><strong>Both working structures were built by the same small firm.</strong> Kaleidofin put together Apollo&apos;s and SunCulture&apos;s, and both were called firsts of their kind. The constraint was never only how much money existed. Part of it was that almost nobody could build the instrument a given balance sheet needed.</p>
        <BlogFigure data={ag_fig7 as FigureData} />
        <blockquote>Figure 1: The author&apos;s assessment of fit between five business models and six sources of capital. Every cell carries its reasoning.</blockquote>
        <p>That matrix is a judgement, not a measurement, published with its reasoning attached so it can be argued with. The venture capital column has exactly one strong cell, and it sits on the row furthest from what a farmer actually earns. The money that is easiest to raise fits the part of the sector that matters least for the outcome everyone says they want.</p>
        <p>The consequence for a company is predictable. It chases growth its margin cannot fund, raises again too early, and expands into new countries to show a bigger market rather than deepening the one relationship that was working. A large share of what gets written up as agricultural technology failure in Africa is this. Not a failure of product, market or founder, but a company that took the only cheque on offer and then spent years pretending to be a different kind of company.</p>
        <hr />
        <h2>The measure that quietly defeats the purpose</h2>
        <p>There is a second mismatch, and it sits inside development finance rather than inside the companies.</p>
        <p>A programme like Aceli pays a lender for each qualifying loan and covers part of the losses if those loans go bad. The loans themselves come from the lender&apos;s own deposits. Leverage is the ratio between the two: one million dollars of donor money that puts ten million of bank money out of the door is 10x. As a rough test of efficiency that is reasonable. It is also completely silent on who got the loans.</p>
        <BlogFigure data={ag_fig8 as FigureData} />
        <blockquote>Figure 2: Each point is one loan size band in Aceli Africa&apos;s portfolio.</blockquote>
        <p>The two measures are near mirror images. In the smallest band, 84 per cent of borrowers had never held a formal loan, and every subsidy dollar brought about 5 dollars off the lenders&apos; balance sheets. In the largest band, 8 per cent were first time borrowers and every subsidy dollar brought 29.</p>
        <p>The mechanism is not mysterious. A business that can absorb a 1.5 million dollar loan has accounts, assets and probably a bank already, so the donor dollar riding alongside it changes very little. A manager told to maximise leverage therefore has one reliable strategy, which is to write bigger cheques. The number on the slide looks excellent. The programme has stopped doing its job.</p>
        <p>The same dataset closes the trap. Businesses owned by women default on 3.3 per cent of loans and those owned by young entrepreneurs on 2.5 per cent, against 4.6 per cent for businesses owned by men over 35. The group the market treats as marginal is the safer borrower. It also borrows about half as much, so it generates less leverage, which is how a leverage target excludes it without anyone deciding to.</p>
        <hr />
        <h2>So is the equity retreat a failure?</h2>
        <p>Partly, and mostly not.</p>
        <p>Some genuinely good companies were starved when the only instrument on offer stopped being offered, and that is a real cost borne by real founders. But most of what happened was a correction, and an overdue one.</p>
        <p>One part of it deserves more attention than it gets. Aceli expected international impact investors to do about half the lending. They did almost none of it. Of its 55 partner lenders, 45 are African institutions, and they made 96 per cent of the loans in local currency. A local bank holds two things offshore capital cannot manufacture: branches near the farms, and deposits in the currency the farms earn.</p>
        <p>The danger now is the opposite mistake. The sector spent a decade offering equity to businesses that needed working capital. It could spend the next decade offering working capital to businesses that need patient money for irrigation, storage and processing. That is the 27 billion dollar layer that is 99.6 per cent unserved, and no revolving trade line will ever reach it.</p>
        <p>Which leaves the question a donor actually has to answer. If the constraint is cost, and different businesses need different instruments, what would change if the money were spent that way?</p>
        <p>That is what the final article tests.</p>
        <hr />
        <h2>Sources</h2>
        <p>Company cases are drawn from published reporting, listed here so every claim can be checked. The full bibliography is in SOURCES.md.</p>
        <h3>Funding totals</h3>
        <ul><li>Partech Partners, <a href="https://partechpartners.com/africa-reports/2025-africa-tech-venture-capital-report" target="_blank" rel="noopener noreferrer">2025 Africa Tech Venture Capital Report</a>. Total funding, the debt share, and an alternative agritech equity figure.</li><li>Briter Bridges, State of Agtech Investment in Africa 2025, reported via <a href="https://techcabal.com/2026/01/29/agritech-funding-in-africa-falls-to-168-million/" target="_blank" rel="noopener noreferrer">TechCabal</a> and <a href="https://techpoint.africa/insight/african-agtech-funding-landscape-2025/" target="_blank" rel="noopener noreferrer">Techpoint Africa</a>. 2023 is not disclosed.</li></ul>
        <h3>iProcure</h3>
        <ul><li>TechCabal, <a href="https://techcabal.com/2024/05/02/iprocure-under-administration/" target="_blank" rel="noopener noreferrer">Kenyan agritech startup iProcure enters administration</a>, 2 May 2024.</li><li>ImpactAlpha, <a href="https://impactalpha.com/kenyas-iprocure-used-by-1-million-farmers-may-be-next-african-startup-casualty-amid-funding-crunch/" target="_blank" rel="noopener noreferrer">Kenya&apos;s iProcure, used by a million farmers, is the latest African funding crunch casualty</a>, 2024. Totals differ slightly across outlets.</li></ul>
        <h3>Twiga Foods</h3>
        <ul><li>TechCabal, <a href="https://techcabal.com/2024/08/21/twiga-foods-layoffs/" target="_blank" rel="noopener noreferrer">Twiga Foods lays off 59 employees as it restructures</a>, 21 August 2024.</li><li>TechCabal, <a href="https://techcabal.com/2025/05/24/twiga-foods-creates-holdco-lays-off-over-300-staff/" target="_blank" rel="noopener noreferrer">Twiga Foods creates holding company, cuts over 300 jobs</a>, 24 May 2025. Twiga disputed the headcount.</li><li>TechCabal, <a href="https://techcabal.com/2026/09/14/kenyan-startup-twiga-foods-enters-administration-after-years-of-financial-pressure/" target="_blank" rel="noopener noreferrer">Kenyan startup Twiga Foods enters administration</a>, 14 September 2026. The filing names one subsidiary.</li></ul>
        <h3>Apollo Agriculture</h3>
        <ul><li>Ecofin Agency, <a href="https://www.ecofinagency.com/news-finances/1205-55488-apollo-agriculture-completes-kenya-s-first-private-agriculture-focused-securitization" target="_blank" rel="noopener noreferrer">Apollo Agriculture completes Kenya&apos;s first private agriculture focused securitization</a>, 2026.</li><li>Kenyan Wall Street, <a href="https://kenyanwallstreet.com/apollo-agriculture-securitization-tranche" target="_blank" rel="noopener noreferrer">Apollo Agriculture unlocks KSh276 mn by securitizing loans</a>, 2026.</li></ul>
        <h3>SunCulture</h3>
        <ul><li>Launch Base Africa, <a href="https://launchbaseafrica.com/2026/09/24/sunculture-closes-10m-securitisation-deal-as-african-climate-tech-turns-to-capital-markets/" target="_blank" rel="noopener noreferrer">SunCulture closes 10m dollar securitisation deal</a>, 24 September 2026.</li><li>Launch Base Africa, <a href="https://launchbaseafrica.com/2025/09/26/sunculture-taps-bridgin-for-15m-to-scale-solar-irrigation-in-kenya/" target="_blank" rel="noopener noreferrer">SunCulture taps Bridgin for 15m dollars</a>, 26 September 2025.</li></ul>
        <h3>Pula</h3>
        <ul><li>Disrupt Africa, <a href="https://disruptafrica.com/2024/04/17/kenyan-agri-tech-startup-pula-raises-20m-series-b-funding-round/" target="_blank" rel="noopener noreferrer">Kenyan agri-tech startup Pula raises 20m dollar Series B</a>, 17 April 2024.</li><li>Impact Investor, <a href="https://impact-investor.com/agri-insurer-pula-closes-blueorchard-led-20m-funding-round/" target="_blank" rel="noopener noreferrer">Agri-insurer Pula closes BlueOrchard led round</a>, 2024.</li></ul>
        <h3>Leverage, additionality and borrower performance</h3>
        <ul><li>Aceli Africa, <a href="https://aceliafrica.org/app/uploads/2026/04/Activating-the-Agri-SME-Finance-Market-Report.pdf" target="_blank" rel="noopener noreferrer">Activating the Agri-SME Finance Market</a>, 2026.</li></ul>
        <h3>Currency</h3>
        <ul><li>TCX, <a href="https://www.tcxfund.com/wp-content/uploads/2025/11/Blended-Finance-for-Local-Currency-Solutions.pdf" target="_blank" rel="noopener noreferrer">Blended Finance for Local Currency Solutions</a>, 2025.</li><li>Ecofin Agency, <a href="https://www.ecofinagency.com/news-finances/2810-60216-uganda-raises-interest-rate-to-12-as-shilling-weakens-against-dollar" target="_blank" rel="noopener noreferrer">Uganda raises interest rate to 12%</a>, 28 October 2026.</li><li>Daily Monitor, <a href="https://www.monitor.co.ug/uganda/news/national/bou-takes-action-on-falling-shilling-5633068" target="_blank" rel="noopener noreferrer">BoU takes action on falling shilling</a>, 15 October 2026.</li></ul>
        <h3>Earlier work in this programme</h3>
        <ul><li><Link href="/blogs/who-writes-the-cheques-african-vc">Who Is Actually Writing the Cheques</Link></li><li><Link href="/blogs/how-to-fill-africas-missing-middle">Filling the Missing Middle</Link></li></ul>
        <hr />
        <p><em>Second of three pieces from the Agri Capital Matching research project. Funding figures from Briter Bridges via Techpoint Africa and TechCabal, Partech&apos;s 2025 Africa Tech Venture Capital Report, and Aceli Africa&apos;s 2026 learning report. The five business models are the author&apos;s framework and describe typical balance sheets, not an assessment of any individual company.</em></p>
      </div>
      <Link className="nextcard" href="/blogs/spend-the-same-money-differently">
        <div>
          <span className="eyebrow forest">Next in the series</span>
          <h3>Spend the Same Money Differently</h3>
        </div>
        <span aria-hidden="true">&rarr;</span>
      </Link>
      <Link className="pubcard" href="/publications/matching-business-to-instrument-2026">
        <span className="eyebrow gold">Full Publication</span>
        <h3>Matching the Business to the Instrument</h3>
        <p>Report 2 of the Agricultural Capital series. The five archetypes, the documented case behind each one, the leverage and additionality trade off, and every source.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <div className="tags"><span className="tag">Agritech</span><span className="tag">Venture Capital</span><span className="tag">Working Capital</span><span className="tag">Debt Financing</span></div>
    </article>
  )
}
