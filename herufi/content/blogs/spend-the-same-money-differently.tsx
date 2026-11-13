import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import ag_fig11 from '@/data/charts/ag_fig11.json'
import ag_fig12 from '@/data/charts/ag_fig12.json'
import ag_fig13 from '@/data/charts/ag_fig13.json'

export default function SpendTheSameMoneyDifferently() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">&larr; Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Spend the Same Money Differently</h1>
      <p className="summary">A model tests African agricultural lending under five futures. The result was not the one the research set out to prove. Moving donor money from guarantees to the cost of lending barely changes how much gets lent. It changes who gets it, and that turns out to be the more useful finding.</p>
      <div className="meta"><span>Michael Omega</span><span>28 October 2026</span><span>11 min read</span></div>
      <div className="prose">
        <p>The research built this model to prove something. The model refused.</p>
        <p>The first two articles established that small farm loans fail on cost rather than risk, and that different agricultural businesses need different instruments. The obvious next step was to show that a donor spending a fixed budget on the cost of lending, rather than on covering credit losses, would produce more lending. That prediction called for a clean result. The model produced a flat one: holding the budget constant and switching what it buys moves total lending by less than 1 per cent, and in the wrong direction.</p>
        <p>That null result turned out to be more useful than the finding the research went looking for. The reason is structural rather than accidental, and it points at something the sector systematically fails to measure.</p>
        <p><strong>How much concessional money exists decides how much lending happens. What that money is spent on decides who gets the loan.</strong> Those are two different questions, and almost every programme reports only the first.</p>
        <p>One thing governs how everything below should be read.</p>
        <div className="tablewrap"><table><thead><tr>
        <th>What it is</th>
        <th>How to treat it</th>
        </tr></thead><tbody>
        <tr><td>Lending economics from 32,000 real loans</td><td>Observed data, published by Aceli Africa</td></tr>
        <tr><td>The relationship between loan size and cost</td><td>Estimated, fitted to five published points</td></tr>
        <tr><td>How strongly lenders shift their book when margins change</td><td>An assumption, calibrated on one observation</td></tr>
        <tr><td>Scenario results in dollars</td><td>Model output under stated assumptions, not forecasts</td></tr>
        <tr><td>A 30 per cent fall in the cost of lending</td><td>An assumption to be tested, not a measurement</td></tr>
        </tbody></table></div>
        <p>Nothing below predicts what African agricultural lending will do. It compares five versions of the present, which is a more modest and far more answerable question.</p>
        <hr />
        <h2>What the model does, in plain terms</h2>
        <p>The model copies one decision: a bank choosing where to put its money. It can lend to agriculture, buy government bonds, or lend elsewhere.</p>
        <p>For every loan size it works out what the lender keeps. Start with interest and fees. Subtract the cost of finding and managing the borrower, then expected losses less whatever a guarantee covers, then the cost of the bank&apos;s own funding. What remains is the margin.</p>
        <p>Then it asks how much of the book flows to agriculture at that margin. Banks move at the edges rather than all at once, so the model is calibrated to reproduce the one real world number available: agriculture sitting at about 4 per cent of these banks&apos; loan books. That calibration is also its weakest point, and this article returns to it below rather than burying it.</p>
        <hr />
        <h2>Five futures</h2>
        <p><strong>Constrained.</strong> Donors pull back and the economy worsens at the same time. Guarantees shrink, cost support disappears, funding gets dearer and government bonds pay more.</p>
        <p><strong>Baseline.</strong> Roughly today. Partial guarantees are common and modest cost support exists in the few markets that have built it.</p>
        <p><strong>Favourable.</strong> More donor money arrives, spent the way donor money is usually spent, which is overwhelmingly on covering credit losses.</p>
        <p><strong>Matched.</strong> The same donor budget as Favourable, down to the decimal place, facing the same market. Only the split differs. Loss cover drops to today&apos;s level and every freed shilling pays for the cost of finding and assessing borrowers.</p>
        <p><strong>Matched plus a cheaper way of lending.</strong> The same budget again, plus one assumption: lenders cut the cost of making a loan by 30 per cent. That rests on four changes. Work through networks that already exist, use buyers&apos; trading records, assess the book rather than only the borrower, and move money through a phone.</p>
        <p>Scenarios three and four are the heart of it. They cost the same by construction, so any difference in result is the mechanism and nothing else.</p>
        <hr />
        <h2>Spending the same money differently barely changes the total</h2>
        <p>Favourable produces 4.10 billion dollars of lending. Matched produces 4.07 billion. The difference is under 1 per cent, and it is in the wrong direction.</p>
        <p>The reason is not a flaw in the argument. Half of all agricultural loan value sits in loans above 200,000 dollars, where the cost of making the loan is already tiny, between 0.9 and 2.5 per cent. Paying that down achieves very little. A guarantee there still returns a full percentage point of expected loss, so on large loans it is simply the better gift.</p>
        <p>Large loans dominate the total, which makes the total a poor test of anything. A count of the dollars that flowed into agriculture cannot show whether the programme reached anybody new. So the honest conclusion is narrower than the one the research set out to prove, and more useful. The amount of concessional money determines the volume of lending, and is close to indifferent to how that money is spent.</p>
        <p>Which means the sector has been measuring the wrong thing.</p>
        <hr />
        <h2>It changes who gets the loan</h2>
        <p>Split the same lending by loan size and the scenarios finally separate.</p>
        <div className="tablewrap"><table><thead><tr>
        <th>Scenario</th>
        <th>Total lending</th>
        <th>Loans of 10k to 50k</th>
        <th>Lending to first time borrowers</th>
        </tr></thead><tbody>
        <tr><td>Constrained</td><td className="num">2.03bn</td><td className="num">0.18bn</td><td className="num">0.45bn</td></tr>
        <tr><td>Baseline</td><td className="num">2.93bn</td><td className="num">0.27bn</td><td className="num">0.66bn</td></tr>
        <tr><td>Favourable</td><td className="num">4.10bn</td><td className="num">0.74bn</td><td className="num">1.17bn</td></tr>
        <tr><td>Matched</td><td className="num">4.07bn</td><td className="num">0.74bn</td><td className="num">1.17bn</td></tr>
        <tr><td>Matched plus a cheaper way of lending</td><td className="num">4.41bn</td><td className="num">0.96bn</td><td className="num">1.38bn</td></tr>
        </tbody></table></div>
        <p className="srcnote">Model output. Counts only loan sizes earning a positive margin, on the view that banks do not build a book in a product that loses money.</p>
        <BlogFigure data={ag_fig12 as FigureData} />
        <blockquote>Figure 1: The same scenarios with today set to 100, so the two measures can be compared directly.</blockquote>
        <p>Between today and the last scenario, total lending rises 51 per cent. Lending in the smallest loan sizes rises 252 per cent. Those small loans are where 84 per cent of borrowers have never held a formal loan, so lending that reaches genuinely new borrowers roughly doubles.</p>
        <p>That is the finding. More money moves the total. Better targeted money moves the frontier.</p>
        <hr />
        <h2>Half a percentage point is not a business</h2>
        <p>One row matters more than any total, and it is the smallest loans, because that is where the first time borrowers are.</p>
        <div className="tablewrap"><table><thead><tr>
        <th>Scenario</th>
        <th>What the bank keeps on a loan of 10,000 to 25,000 dollars</th>
        </tr></thead><tbody>
        <tr><td>Constrained</td><td className="num">-3.52%</td></tr>
        <tr><td>Baseline</td><td className="num">-0.93%</td></tr>
        <tr><td>Favourable</td><td className="num">+0.53%</td></tr>
        <tr><td>Matched</td><td className="num">+0.55%</td></tr>
        <tr><td>Matched plus a cheaper way of lending</td><td className="num">+4.65%</td></tr>
        </tbody></table></div>
        <BlogFigure data={ag_fig11 as FigureData} />
        <blockquote>Figure 2: Modelled net margin by loan size. The vertical tick on each row is today, for comparison.</blockquote>
        <p>In today&apos;s conditions these loans lose money, so they largely do not get made. Under the two better funded scenarios they cross into profit. Look closely at how they cross.</p>
        <p>Half a percentage point is not a margin. It is a rounding error with ambitions. One poor season erases it. So does a small rise in funding costs. And it still has to be defended against a treasury desk earning 16 per cent on government paper for no work at all.</p>
        <p>Only the cheaper operating model produces a margin a bank will build around. At 4.65 per cent somebody can staff a department, write a policy and defend the budget when it is questioned.</p>
        <p>This is the distinction the usual debate misses. A subsidy can lift a loan category across zero. Only a lower cost structure keeps it there. None of which means abandoning guarantees, which do useful work on larger loans.</p>
        <hr />
        <h2>Most of the downside is the economy, not the aid budget</h2>
        <p>The constrained scenario is not hypothetical, and it is worth separating. It changes two things at once: donors retrench, and the economy deteriorates. Run each half on its own and the split is lopsided.</p>
        <div className="tablewrap"><table><thead><tr>
        <th>What changes</th>
        <th>Lending</th>
        <th>Against today</th>
        </tr></thead><tbody>
        <tr><td>Today</td><td className="num">2.93bn</td><td></td></tr>
        <tr><td>Donors retrench, economy holds steady</td><td className="num">2.80bn</td><td className="num"><strong>-4.5%</strong></td></tr>
        <tr><td>Economy deteriorates, donors hold steady</td><td className="num">2.15bn</td><td className="num"><strong>-26.4%</strong></td></tr>
        <tr><td>Both, which is the Constrained scenario</td><td className="num">2.03bn</td><td className="num"><strong>-30.5%</strong></td></tr>
        </tbody></table></div>
        <p className="srcnote">Model output. The two halves do not sum exactly, because the allocation rule is a curve rather than a line.</p>
        <p>Roughly six sevenths of the damage comes from the economy. That is uncomfortable for anyone reading this series as an argument purely about how donors spend, and it should be.</p>
        <p>Two conclusions follow, and they point the same way. The case for attacking the cost of lending gets stronger, because if the economy does most of the damage and nobody in agricultural finance controls it, the cost base is the main lever this sector holds. And anyone evaluating such a programme must state their macro assumptions in advance, or they will measure the bond market and call it a programme evaluation.</p>
        <hr />
        <h2>How much to trust any of this</h2>
        <p>A model can look precise without being certain. The lending economics come from one programme in five countries. The cost curve rests on five observations. The way banks respond to margins is calibrated on a single real world number. And the 30 per cent cost saving is an assumption, not a measurement.</p>
        <BlogFigure data={ag_fig13 as FigureData} />
        <blockquote>Figure 3: The same five scenarios recomputed across the plausible range of the model&apos;s one free parameter.</blockquote>
        <p>The calibration is the weakest link, so it was tested. Across a fourfold range for that parameter the dollar figures move by a factor of about seven, and the ranking of the five scenarios never changes. Treat the ordering as the finding and the dollar amounts as illustration.</p>
        <p>One limitation matters more than the rest. The model only looks at the lending side, so it says nothing about whether enough suitable businesses exist to borrow. Aceli mobilised 73 per cent of its capital target, which suggests pipeline is a live constraint rather than a theoretical one.</p>
        <p>The publication behind this article carries the full methodology, every sensitivity test, the complete limitations and the four findings that would prove the argument wrong.</p>
        <hr />
        <h2>Who should do what</h2>
        <p><strong>Local banks are the only institutions that can reach the smallest businesses.</strong> They have the branches, the local currency deposits and the cost base. What stops them is a 16.4 per cent cost of making the loan, not a shortage of nerve.</p>
        <p><strong>Donors are the only source of money that can pay for that cost.</strong> It generates no repayment, so no instrument other than a grant can fund it. This is the highest value use of a shrinking budget, and it is not where most of the budget goes.</p>
        <p><strong>Development finance institutions should fund balance sheets, not borrowers.</strong> Checking a 2 million dollar deal costs roughly what checking a 20 million dollar deal costs, which makes their minimum cheque arithmetic rather than preference. Their advantage lies upstream.</p>
        <p><strong>Impact and patient investors should fund the platforms that make lending cheaper</strong>, and the long term assets that are 99.6 per cent unserved. That layer needs money with a longer life than a seven year fund.</p>
        <p><strong>Venture capital should fund the one business model that has venture economics</strong> and stop underwriting crop processors as though they were software companies.</p>
        <p><strong>And everyone should report leverage next to additionality, always.</strong> A leverage ratio with no measure of who was reached is not a result. It is a selection effect with a number attached.</p>
        <hr />
        <h2>The sentence it reduces to</h2>
        <p>Africa&apos;s agricultural finance problem is not mainly a shortage of money. Debt has risen to 41 per cent of all African technology capital. Local banks have stepped into gaps international investors could not reach. Capital has been moving, and moving quickly.</p>
        <p>It has been moving toward the instruments these balance sheets can service, which is progress, and toward the borrowers who were nearly bankable already, which is not.</p>
        <p>So the work now has two parts. Match the right capital to the right business at the right stage of growth. Then pay for the one thing standing between a local bank and a farmer who has never held a formal loan.</p>
        <p>That thing is the cost of making the loan. On a 15,000 dollar loan it is 16.4 per cent. Everything else is downstream of it.</p>
        <hr />
        <h2>Sources</h2>
        <p>The model, the data and the notebooks are open, so every scenario value can be recomputed rather than taken on trust. The full bibliography is in SOURCES.md.</p>
        <h3>Method</h3>
        <ul><li>Convergence Blended Finance, <a href="https://www.convergence.finance/resource/state-of-blended-finance-2026/view" target="_blank" rel="noopener noreferrer">The State of Blended Finance 2026</a>. The scenario architecture this project borrows.</li></ul>
        <h3>Lending economics behind every scenario</h3>
        <ul><li>Aceli Africa, <a href="https://aceliafrica.org/app/uploads/2025/04/Aceli-2025-Financial-Benchmarking-Report-Final.pdf" target="_blank" rel="noopener noreferrer">2025 Financial Benchmarking Report</a>.</li><li>Aceli Africa, <a href="https://aceliafrica.org/app/uploads/2026/04/Activating-the-Agri-SME-Finance-Market-Report.pdf" target="_blank" rel="noopener noreferrer">Activating the Agri-SME Finance Market</a>, 2026. The additionality curve and the capital target.</li></ul>
        <h3>The unserved long term layer</h3>
        <ul><li>ISF Advisors, <a href="https://isfadvisors.co/wp-content/uploads/2025/10/ISF_AgFinance-SoS-Report-Oct-2025.pdf" target="_blank" rel="noopener noreferrer">Beyond the Frontier</a>, October 2025.</li></ul>
        <h3>The macro half of the Constrained scenario</h3>
        <ul><li>Ecofin Agency, <a href="https://www.ecofinagency.com/news-finances/2810-60216-uganda-raises-interest-rate-to-12-as-shilling-weakens-against-dollar" target="_blank" rel="noopener noreferrer">Uganda raises interest rate to 12% as shilling weakens against dollar</a>, 28 October 2026.</li><li>Daily Monitor, <a href="https://www.monitor.co.ug/uganda/news/national/bou-takes-action-on-falling-shilling-5633068" target="_blank" rel="noopener noreferrer">BoU takes action on falling shilling</a>, 15 October 2026.</li><li>World Bank, <a href="https://databank.worldbank.org/source/world-development-indicators" target="_blank" rel="noopener noreferrer">World Development Indicators</a>, for the private credit denominators.</li></ul>
        <h3>Local currency and tenor</h3>
        <ul><li>TCX, <a href="https://www.tcxfund.com/wp-content/uploads/2025/11/Blended-Finance-for-Local-Currency-Solutions.pdf" target="_blank" rel="noopener noreferrer">Blended Finance for Local Currency Solutions</a>, 2025.</li><li>OECD, <a href="https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/02/unlocking-local-currency-financing-in-emerging-markets-and-developing-economies.pdf" target="_blank" rel="noopener noreferrer">Unlocking Local Currency Financing in Emerging Markets and Developing Economies</a>, 2025.</li></ul>
        <hr />
        <p><em>Final of three pieces from the Agri Capital Matching research project. All scenario values are model outputs under stated assumptions, not forecasts. The model, data, notebooks, interactive figures and every source are open. Method adapted from Convergence&apos;s State of Blended Finance 2026; lending economics from Aceli Africa; gap estimates from ISF Advisors.</em></p>
      </div>
      <Link className="pubcard" href="/publications/same-budget-different-result-2026">
        <span className="eyebrow gold">Full Publication</span>
        <h3>The Same Budget, a Different Result</h3>
        <p>Report 3 of the Agricultural Capital series. The model, the five scenarios, the sensitivity tests, the full methodology and every source.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <div className="tags"><span className="tag">Blended Finance</span><span className="tag">Development Finance</span><span className="tag">Scenario Analysis</span><span className="tag">Agricultural Finance</span></div>
    </article>
  )
}
