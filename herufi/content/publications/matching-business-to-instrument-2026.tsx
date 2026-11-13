import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type { FigureData } from '@/components/charts/types'
import ag_fig7 from '@/data/charts/ag_fig7.json'
import ag_fig8 from '@/data/charts/ag_fig8.json'
import ag_fig9 from '@/data/charts/ag_fig9.json'
import ag_fig10 from '@/data/charts/ag_fig10.json'

export default function MatchingBusinessToInstrument2026() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications &rarr;</Link>
          </div>
          <p className="eyebrow">Agricultural Capital Series &middot; Report 2 of 3</p>
          <h1>Matching the Business to the Instrument</h1>
          <p className="sub">Five agricultural business models, the balance sheet each one has, and the capital each one is offered</p>
          <div className="byline">
            <span><b>Michael Omega</b></span>
            <span>Impact Investment and Advisory Professional, Nairobi</span>
            <span>October 2026</span>
          </div>
        </div>
      </header>

      <main>
        <div className="wrap">
          <div className="stats">
            <div className="stat"><div className="v">1 of 5</div><div className="l">Agricultural business archetypes with the economics venture equity requires</div></div>
            <div className="stat gold"><div className="v">76%</div><div className="l">Fall in African agritech equity from its 2022 peak, while debt reached 41 per cent of all African technology funding</div></div>
            <div className="stat dark"><div className="v">29x / 8%</div><div className="l">Leverage on the largest loans against the share of borrowers there who have never held a formal loan</div></div>
            <div className="stat"><div className="v">3.3% / 4.6%</div><div className="l">Non performing loans at women owned enterprises against enterprises owned by men over 35</div></div>
          </div>

          <div className="exec">
            <p className="eyebrow">Executive summary</p>
            <p>Report 1 of this series established that the binding constraint at the bottom of the agricultural lending market is the cost of making a loan rather than the risk of losing it. This report asks the question that follows. Given that cost structure, what kind of capital fits an agricultural business, and what is it usually offered instead?</p>
            <p><strong>The capital that is most available fits the part of the sector that matters least for the outcome the sector says it wants.</strong> Of the five agricultural business archetypes set out here, one has venture economics. It is also the smallest part of the sector by revenue and the most indirectly connected to farmer incomes.</p>
            <p><strong>Key findings</strong></p>
            <p>1. <strong>Agritech equity fell about 76 per cent from its 2022 peak while debt rose.</strong> African agritech raised 168 million dollars in 2025 against 207 million in 2024, with equity falling from roughly 328 million in 2022 to roughly 80 million in 2025, a minority of sector funding for the first time. Across African technology as a whole, debt reached 41 per cent of capital deployed against 17 per cent in 2019. This is better read as capital finding the right instrument than as capital losing interest.</p>
            <p>2. <strong>Leverage and additionality are the same fact seen twice.</strong> Aceli&apos;s data shows leverage rising from 5x to 29x as ticket size rises, while the share of first time borrowers falls from 84 per cent to 8 per cent. A facility managed on leverage will climb up market until it finances borrowers who had other options.</p>
            <p>3. <strong>Women and young borrowers are the better credit.</strong> Non performing loans run at 3.3 per cent for women owned enterprises and 2.5 per cent for youth owned, against 4.6 per cent for enterprises owned by men over 35. They also borrow half as much, so they generate lower leverage. That is the mechanism by which a leverage target excludes them.</p>
            <p>4. <strong>Part of the constraint is a shortage of structurers rather than a shortage of capital.</strong> The two transactions in this report that financed a balance sheet as the framework prescribes were structured by the same intermediary, and both were reported as firsts of their kind. A balance sheet with nobody able to build its instrument takes the instrument already on the shelf.</p>
            <p><strong>What follows from this.</strong> Report 3 holds the concessional budget fixed and models what happens to volume and to reach when it is reallocated from cover against credit losses to the cost of origination.</p>
          </div>

          <h2>The matching problem</h2>
          <h3>2.1 What venture capital requires, and what agriculture has</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Venture capital needs</th>
        <th>Agricultural enterprises have</th>
        </tr></thead><tbody>
        <tr><td>Margins that scale without proportional cost</td><td className="num">Trading and processing margins of 5 to 20 per cent</td></tr>
        <tr><td>Growth non linear in capital</td><td>Growth proportional to hectares, tonnage and working capital</td></tr>
        <tr><td>A liquidity event inside the fund life</td><td>Thin trade sale markets, almost no listings</td></tr>
        <tr><td>Low working capital intensity</td><td>Working capital intensity as the defining feature</td></tr>
        <tr><td>Risk concentrated in adoption</td><td>Risk in weather, price and counterparty</td></tr>
        </tbody></table></div>
          <p>This does not make them bad businesses. It makes them bad venture equity, which is a different judgement. A processor running a 12 per cent margin and growing 40 per cent a year on rising tonnage is an excellent credit and a poor venture bet, and both are true at once.</p>
          <h3>2.2 Five archetypes, five balance sheets</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Business model</th>
        <th>What the balance sheet is</th>
        <th>Capital that fits</th>
        <th>Capital usually offered</th>
        </tr></thead><tbody>
        <tr><td>Input distributor</td><td>Inventory, receivables</td><td>Inventory and receivables finance, local currency, revolving</td><td>Growth equity priced on a software multiple</td></tr>
        <tr><td>Offtaker and processor</td><td>Plant, warehouse stock, offtake contracts</td><td>Warehouse receipt and trade finance, plus long dated debt for plant</td><td>Venture equity expecting non linear growth</td></tr>
        <tr><td>Embedded agricultural lender</td><td>Receivables portfolio</td><td>On lending facility, first loss on the portfolio, equity only for the platform</td><td>Equity funding the loan book itself</td></tr>
        <tr><td>Digital advisory and marketplace</td><td>Software, farmer network</td><td>Venture equity, and this is the one case where that is true</td><td>Debt against revenue with no asset behind it</td></tr>
        <tr><td>Asset financier and mechanisation</td><td>The financed asset</td><td>Long dated local currency debt, securitisation once a track record exists</td><td>Five to seven year fund money against a ten year asset</td></tr>
        </tbody></table></div>
          <Figure n={1} data={ag_fig7 as FigureData} />
          <p>Only the digital advisory archetype has venture economics. It is also the smallest part of the sector by revenue and the most indirectly connected to farmer incomes. <strong>The capital that is most available fits the part of the sector that matters least for the outcome the sector says it wants.</strong></p>
          <p><strong>Documented cases against each archetype.</strong> The framework is testable against the public record, so it is tested here. Attribution is deliberately weak: none of these companies succeeded or failed for one reason, and none of them publishes audited profit figures, so &quot;financed well&quot; below means financed in a way the balance sheet can service, not demonstrated profitability.</p>
          <div className="tablewrap"><table><thead><tr>
        <th>Archetype</th>
        <th>Case</th>
        <th>What happened</th>
        <th>Reading</th>
        </tr></thead><tbody>
        <tr><td>Input distributor</td><td>iProcure (Kenya)</td><td className="num">Raised about USD 17m across debt and equity, reached more than one million farmers, entered administration April 2024 after failing to close a new round. Reported unpaid debts were modest against the total raised.</td><td>A seasonal inventory business was funded by rounds rather than by a facility that breathes with the season. A round that does not arrive is not a facility.</td></tr>
        <tr><td>Offtaker and processor</td><td>Twiga Foods (Kenya)</td><td className="num">Raised more than USD 180m, built owned logistics. Cut 283 jobs in 2023, 59 in 2024, over 300 in 2025 alongside a holding company restructure and an announced shift to an asset light model. A subsidiary entered administration in August 2026.</td><td>The asset light pivot is the company&apos;s own verdict that the balance sheet and the instrument had come apart. Other factors, including an expensive logistics lease, are documented.</td></tr>
        <tr><td>Embedded agricultural lender</td><td>Apollo Agriculture (Kenya)</td><td className="num">May 2026: Kenya&apos;s first private agriculture focused securitisation. KES 276m first tranche against a KES 370m receivables pool covering 23,839 farmers; IDH Farmfit Fund anchor, Kaleidofin structurer; programme target KES 2.37bn.</td><td>The loan book funded by debt secured on the loan book, in the currency of repayment, with equity reserved for the platform. The archetype financed as the framework prescribes.</td></tr>
        <tr><td>Digital advisory and marketplace</td><td>Pula (Kenya)</td><td className="num">USD 20m Series B, April 2024, led by BlueOrchard with the IFC and the GAFSP Private Sector Window. Distributes through more than 100 partner organisations rather than direct to farmers.</td><td>Venture shaped economics, funded by impact and development investors rather than by classic venture funds. The instrument fits; the investor base is not the one the archetype predicts.</td></tr>
        <tr><td>Asset financier</td><td>SunCulture (Kenya)</td><td className="num">September 2026: USD 10m senior secured facility from the Mirova Gigaton Fund into an SPV acquiring SunCulture Kenya receivables, structured by Kaleidofin. A USD 15m Bridgin receivables facility was announced in September 2025.</td><td>Growth constrained by receivables financing capacity, then relieved by financing the receivables. Equity funds the product, debt funds the assets.</td></tr>
        </tbody></table></div>
          <p><strong>One observation the funding totals do not surface.</strong> Kaleidofin structured both the Apollo and the SunCulture transactions, and both were reported as firsts of their kind. The binding constraint was not only the quantity of capital. It was partly the absence of intermediaries able to build the instrument a given balance sheet needed, which left that balance sheet taking the instrument already on the shelf.</p>
          <h3>2.3 The supply side and its binding constraints</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Provider</th>
        <th>Binding constraint</th>
        <th>Reaches smallholders</th>
        </tr></thead><tbody>
        <tr><td>Venture capital</td><td>Needs a power law outcome and an exit inside the fund life</td><td>Only via the advisory archetype</td></tr>
        <tr><td>Impact and patient equity</td><td>Still needs an exit; agricultural trade sales are thin</td><td>Yes, but the cheque is too large for most</td></tr>
        <tr><td>Local commercial banks</td><td>Origination cost at small tickets, and collateral rules</td><td>Where an incentive changes the arithmetic</td></tr>
        <tr><td>Specialist and social lenders</td><td>Hard currency funding against local currency revenue</td><td>Directly, via the offtaker channel</td></tr>
        <tr><td>Development finance institutions</td><td>Minimum ticket size; diligence cost per dollar deployed</td><td>Only at two removes</td></tr>
        <tr><td>Donors and philanthropy</td><td>Budget, and a habit of funding risk cover not transaction cost</td><td>Yes, and uniquely able to pay for origination</td></tr>
        </tbody></table></div>
          <p>Read down that column and a division of labour appears that nobody designed. Only the local bank can reach the small end. Only concessional capital can pay for the thing that stops it.</p>
          <h3>2.4 What makes these models commercially viable</h3>
          <p>Four mechanisms, each an attack on the origination cost curve rather than on credit risk:</p>
          <p>1. <strong>Aggregation.</strong> Underwrite the cooperative, outgrower scheme or supplier book rather than the farmer. One credit file, many borrowers. The largest single lever. 2. <strong>Embedded distribution.</strong> Originate inside a transaction that is happening anyway. The acquisition cost is already sunk by the commercial relationship. 3. <strong>Data substitution.</strong> Replace the field visit with offtaker purchase history, satellite yield estimates, mobile money flows or warehouse receipts. 4. <strong>Portfolio underwriting.</strong> Price a book rather than a name. Flat, predictable credit loss across the size range is exactly the condition under which this works.</p>
          <p>And one that is not about cost:</p>
          <p>5. <strong>Local currency funding.</strong> TCX research suggests one in eight low income countries sees a currency fall of 20 per cent or more in any given year. Of Aceli&apos;s 55 lenders, 45 are African domiciled and originated 96 per cent of loans in local currency, against a pre launch expectation that international impact investors would do half the volume.</p>
          <p>Uganda in 2026 is the worked example. A borrower earning shillings and servicing a dollar facility saw that obligation rise by roughly a quarter in local currency terms between March and late October, with no change to the facility and no change to the business. The same event then raised the price of the local currency alternative, because the policy rate rose from 9.75 to 12 per cent in defence of the currency. Currency mismatch and opportunity cost are not two separate risks here. They are one event arriving twice.</p>
          <h3>2.5 The trade off nobody prices</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Loan size</th>
        <th>First time borrowers</th>
        <th>Leverage</th>
        </tr></thead><tbody>
        <tr><td>10k to 49k</td><td className="num">84%</td><td className="num">5x</td></tr>
        <tr><td>50k to 99k</td><td className="num">35%</td><td className="num">7x</td></tr>
        <tr><td>100k to 249k</td><td className="num">26%</td><td className="num">10x</td></tr>
        <tr><td>250k to 499k</td><td className="num">16%</td><td className="num">19x</td></tr>
        <tr><td>500k to 1.75M</td><td className="num">8%</td><td className="num">29x</td></tr>
        </tbody></table></div>
          <Figure n={2} data={ag_fig8 as FigureData} />
          <Figure n={3} data={ag_fig9 as FigureData} />
          <p><strong>Leverage, defined precisely, because the term is used loosely.</strong> Aceli spends donor money on two things: an origination incentive paid per qualifying loan, and cover against a share of losses. The loans themselves are funded by the lender from its own deposits and capital. Leverage is the ratio of the second to the first: USD 1m of donor spend against USD 10m of lender balance sheet deployed is 10x. &quot;Mobilised commercial capital&quot; therefore means capital that must be repaid to a commercial lender, not granted by a donor.</p>
          <p>Leverage and additionality are mirror images. Large loans mobilise more capital per concessional dollar because they go to borrowers who were already bankable.</p>
          <p>Aceli&apos;s results against its own projections read as two misses and several large beats:</p>
          <div className="tablewrap"><table><thead><tr>
        <th>Metric</th>
        <th>Projected</th>
        <th>Actual</th>
        </tr></thead><tbody>
        <tr><td>Lenders</td><td className="num">20</td><td className="num">55</td></tr>
        <tr><td>Loans</td><td className="num">1,500</td><td className="num">5,576</td></tr>
        <tr><td>Average loan size</td><td className="num">400k</td><td className="num">79k</td></tr>
        <tr><td>Capital mobilised</td><td className="num">600m</td><td className="num">440m</td></tr>
        <tr><td>Leverage ratio</td><td className="num">15x</td><td className="num">10x</td></tr>
        <tr><td>First time borrowers</td><td className="num">35%</td><td className="num">63%</td></tr>
        <tr><td>Farmers and workers reached</td><td className="num">1.1m</td><td className="num">2.3m</td></tr>
        </tbody></table></div>
          <p>The two misses are the same sentence as the beats. 10x remains more than double the roughly 4x average Convergence found across 340 blended finance transactions globally.</p>
          <h3>2.6 Who is actually the risk</h3>
          <div className="tablewrap"><table><thead><tr>
        <th></th>
        <th>Women owned</th>
        <th>Youth owned</th>
        <th>Men 35 and over</th>
        </tr></thead><tbody>
        <tr><td>Average loan</td><td className="num">49k</td><td className="num">36k</td><td className="num">95k</td></tr>
        <tr><td>First time borrowers</td><td className="num">77%</td><td className="num">79%</td><td className="num">56%</td></tr>
        <tr><td>Non performing loans</td><td className="num">3.3%</td><td className="num">2.5%</td><td className="num">4.6%</td></tr>
        <tr><td>Leverage ratio</td><td className="num">7.0</td><td className="num">6.0</td><td className="num">10.5</td></tr>
        </tbody></table></div>
          <Figure n={4} data={ag_fig10 as FigureData} />
          <p>The under served segment is the better credit. Because it borrows less, it produces lower leverage, which is how a leverage target excludes it without anyone deciding to. Aceli notes it is aware of no other sex or age disaggregated loan performance data at SME scale anywhere, which means the sector has been allocating on an untested assumption.</p>
          <hr />
          <h2>Appendix A. Method</h2>
          <p><strong>How the archetypes were built.</strong> The five archetypes are a reading of what agricultural enterprises hold on their balance sheets, set against what venture equity requires. They are a framework for matching an instrument to an asset, not a taxonomy with a claim to completeness, and a real company can sit in two of them at once.</p>
          <p><strong>How the cases were selected and read.</strong> Each case is a dated, publicly reported event at a named company, chosen because the company is a clear instance of its archetype. Attribution is deliberately weak. None of these companies succeeded or failed for one reason, none publishes audited profit figures, and no causal claim is made from a financing structure to an outcome.</p>
          <h2>Appendix B. Limitations</h2>
          <p>1. <strong>One programme, five countries, one vintage.</strong> Aceli&apos;s benchmark data covers 2020 to 2023 in relatively deep regional financial markets. West and Central African lender economics are likely worse, which would strengthen the direction of the argument while making the levels wrong.</p>
          <p>2. <strong>No view on any individual company or fund.</strong> The archetypes are a framework, not an assessment.</p>
          <p>3. <strong>The loan performance comparison sits inside a screen.</strong> Aceli&apos;s figures come from loans actually issued to borrowers who passed a credit screen. The comparison by sex and age therefore says which screened borrowers performed better, not how the unscreened population would perform.</p>
          <h2>Appendix C. What would falsify this</h2>
          <ul><li>A sharp recovery in agritech equity returns, suggesting the 2022 to 2025 retreat was a cycle rather than a correction.</li><li>An agricultural processor or input distributor delivering venture scale equity returns, which would mean the balance sheet reading here is wrong.</li></ul>
          <hr />
          <p><em>A shorter explainer of this report is published as <Link href="/blogs/good-business-wrong-money">Good Business, Wrong Money</Link>. Sources are listed in full in SOURCES.md. Data, model and notebooks are open and reproducible.</em></p>

          <div className="series">
            <Link href="/publications/cost-of-a-small-loan-2026"><div className="k">Report 1 of the series</div><div className="t">The Cost of a Small Loan: why Africa&apos;s agricultural lending gap behaves like a cost problem and is priced as a risk problem &rarr;</div></Link>
            <Link href="/publications/same-budget-different-result-2026"><div className="k">Report 3 of the series</div><div className="t">The Same Budget, a Different Result: a lender allocation model run across five scenarios, holding the concessional budget fixed &rarr;</div></Link>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <h4>References</h4>
          <ol>
            <li>Aceli Africa (analysis by Dalberg), Agricultural SME Lending in East &amp; Southern Africa: 2025 Financial Benchmarking Report (2025) <a href="https://aceliafrica.org/app/uploads/2025/04/Aceli-2025-Financial-Benchmarking-Report-Final.pdf" target="_blank" rel="noopener">aceliafrica.org</a></li>
            <li>Aceli Africa, Activating the Agri-SME Finance Market: Learning from 2020-2025 (Year 5 Learning Report) (2026) <a href="https://aceliafrica.org/app/uploads/2026/04/Activating-the-Agri-SME-Finance-Market-Report.pdf" target="_blank" rel="noopener">aceliafrica.org</a></li>
            <li>Convergence Blended Finance, The State of Blended Finance 2026 (2026) <a href="https://www.convergence.finance/resource/state-of-blended-finance-2026/view" target="_blank" rel="noopener">convergence.finance</a></li>
            <li>Partech Partners, 2025 Partech Africa Tech Venture Capital Report (2026) <a href="https://partechpartners.com/africa-reports/2025-africa-tech-venture-capital-report" target="_blank" rel="noopener">partechpartners.com</a></li>
            <li>Briter Bridges, State of Agtech Investment in Africa 2025 (2026) <a href="https://briterbridges.com/" target="_blank" rel="noopener">briterbridges.com</a></li>
            <li>Sarah Laniyan, African agtech funding drops to $170M in 2025 as debt overtakes equity for first time (2026) <a href="https://techpoint.africa/insight/african-agtech-funding-landscape-2025/" target="_blank" rel="noopener">techpoint.africa</a></li>
            <li>TechCabal, Investor interest in African agritech slips as deal counts fall (2026) <a href="https://techcabal.com/2026/01/29/agritech-funding-in-africa-falls-to-168-million/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>AgFunder, Global AgriFoodTech Investment Report 2026 (2026) <a href="https://agfunder.com/research/" target="_blank" rel="noopener">agfunder.com</a></li>
            <li>TCX (The Currency Exchange Fund), Blended Finance for Local Currency Solutions (2025) <a href="https://www.tcxfund.com/wp-content/uploads/2025/11/Blended-Finance-for-Local-Currency-Solutions-1.pdf" target="_blank" rel="noopener">tcxfund.com</a></li>
            <li>OECD, Unlocking Local Currency Financing in Emerging Markets and Developing Economies (2025) <a href="https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/02/unlocking-local-currency-financing-in-emerging-markets-and-developing-economies_af15df6a/bc84fde7-en.pdf" target="_blank" rel="noopener">oecd.org</a></li>
            <li>Michael Omega, Filling the Missing Middle: A Funding Model for Africa&apos;s Series A/B Gap (2026) <a href="https://herufi.org/blogs/how-to-fill-africas-missing-middle" target="_blank" rel="noopener">herufi.org</a></li>
            <li>Michael Omega, The Broken Ladder: Africa&apos;s 2014 Baseline (2026) <a href="https://herufi.org/blogs/why-african-startups-stall" target="_blank" rel="noopener">herufi.org</a></li>
            <li>Michael Omega, Who Is Actually Writing the Cheques (2026) <a href="https://herufi.org/blogs/who-writes-the-cheques-african-vc" target="_blank" rel="noopener">herufi.org</a></li>
            <li>TechCabal, Kenyan startup Twiga Foods enters administration after years of financial pressure (2026) <a href="https://techcabal.com/2026/09/14/kenyan-startup-twiga-foods-enters-administration-after-years-of-financial-pressure/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>TechCabal, Twiga Foods creates holding company, cuts over 300 jobs (2025) <a href="https://techcabal.com/2025/05/24/twiga-foods-creates-holdco-lays-off-over-300-staff/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>TechCabal, Twiga Foods lays off 59 employees as it restructures business for sustainability (2024) <a href="https://techcabal.com/2024/08/21/twiga-foods-layoffs/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>TechCabal, Kenyan agritech startup iProcure enters administration (2024) <a href="https://techcabal.com/2024/05/02/iprocure-under-administration/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>ImpactAlpha, Kenya&apos;s iProcure, used by a million farmers, is the latest African funding crunch casualty (2024) <a href="https://impactalpha.com/kenyas-iprocure-used-by-1-million-farmers-may-be-next-african-startup-casualty-amid-funding-crunch/" target="_blank" rel="noopener">impactalpha.com</a></li>
            <li>Ecofin Agency, Apollo Agriculture completes Kenya&apos;s first private agriculture focused securitization (2026) <a href="https://www.ecofinagency.com/news-finances/1205-55488-apollo-agriculture-completes-kenya-s-first-private-agriculture-focused-securitization" target="_blank" rel="noopener">ecofinagency.com</a></li>
            <li>Kenyan Wall Street, Apollo Agriculture unlocks KSh276 mn by securitizing loans (2026) <a href="https://kenyanwallstreet.com/apollo-agriculture-securitization-tranche" target="_blank" rel="noopener">kenyanwallstreet.com</a></li>
            <li>Launch Base Africa, SunCulture closes 10m dollar securitisation deal as African climate tech turns to capital markets (2026) <a href="https://launchbaseafrica.com/2026/09/24/sunculture-closes-10m-securitisation-deal-as-african-climate-tech-turns-to-capital-markets/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>Launch Base Africa, SunCulture taps Bridgin for 15m dollars to scale solar irrigation in Kenya (2025) <a href="https://launchbaseafrica.com/2025/09/26/sunculture-taps-bridgin-for-15m-to-scale-solar-irrigation-in-kenya/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>Disrupt Africa, Kenyan agri-tech startup Pula raises 20m dollar Series B funding round (2024) <a href="https://disruptafrica.com/2024/04/17/kenyan-agri-tech-startup-pula-raises-20m-series-b-funding-round/" target="_blank" rel="noopener">disruptafrica.com</a></li>
            <li>Impact Investor, Agri-insurer Pula closes BlueOrchard led 20m dollar funding round (2024) <a href="https://impact-investor.com/agri-insurer-pula-closes-blueorchard-led-20m-funding-round/" target="_blank" rel="noopener">impact-investor.com</a></li>
            <li>Ecofin Agency, Uganda raises interest rate to 12% as shilling weakens against dollar (2026) <a href="https://www.ecofinagency.com/news-finances/2810-60216-uganda-raises-interest-rate-to-12-as-shilling-weakens-against-dollar" target="_blank" rel="noopener">ecofinagency.com</a></li>
            <li>Daily Monitor (Martin Luther Oketch), BoU takes action on falling shilling (2026) <a href="https://www.monitor.co.ug/uganda/news/national/bou-takes-action-on-falling-shilling-5633068" target="_blank" rel="noopener">monitor.co.ug</a></li>
          </ol>
        </div>
      </footer>
    </>
  )
}
