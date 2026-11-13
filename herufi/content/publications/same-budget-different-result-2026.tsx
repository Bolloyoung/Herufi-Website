import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type { FigureData } from '@/components/charts/types'
import ag_fig12 from '@/data/charts/ag_fig12.json'
import ag_fig11 from '@/data/charts/ag_fig11.json'
import ag_fig13 from '@/data/charts/ag_fig13.json'
import ag_fig14 from '@/data/charts/ag_fig14.json'

export default function SameBudgetDifferentResult2026() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications &rarr;</Link>
          </div>
          <p className="eyebrow">Agricultural Capital Series &middot; Report 3 of 3</p>
          <h1>The Same Budget, a Different Result</h1>
          <p className="sub">A lender allocation model run across five scenarios, holding the concessional budget fixed</p>
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
            <div className="stat"><div className="v">252% / 51%</div><div className="l">Rise in lending to the smallest borrowers against the rise in total lending, on a fixed concessional budget</div></div>
            <div className="stat gold"><div className="v">1.722</div><div className="l">Concessional points per dollar lent, held identical across the three scenarios the comparison rests on</div></div>
            <div className="stat dark"><div className="v">4.65% / 0.55%</div><div className="l">Margin on the smallest loans from a lower cost structure against the margin from a larger subsidy</div></div>
            <div className="stat"><div className="v">4.5% / 26%</div><div className="l">Cost of donor retrenchment against the cost of a worse macro environment, in the same downside scenario</div></div>
          </div>

          <div className="exec">
            <p className="eyebrow">Executive summary</p>
            <p>Reports 1 and 2 of this series established the cost structure of agricultural lending and the mismatch between agricultural balance sheets and the instruments offered to them. This report holds the concessional budget fixed and asks what changes when that budget is spent differently.</p>
            <p><strong>The model is structural rather than statistical, by necessity.</strong> No public deal level database exists for African agricultural finance. Rather than fit an equation to absent data, this model fits the published lender cost function and builds an allocation rule on it, then runs five scenarios, three of which spend the same concessional budget to the decimal place.</p>
            <p><strong>Key findings</strong></p>
            <p>1. <strong>The scenario modelling produces a result worth stating carefully.</strong> Holding the concessional budget fixed and reallocating it from credit risk cover to origination support is close to <strong>volume neutral</strong>: 4.07 billion dollars against 4.10 billion. But lending at the 10,000 to 50,000 dollar band, where 84 per cent of borrowers have never held a formal loan, rises 174 per cent, and rises 252 per cent once origination is made structurally cheaper. <strong>How much concessional capital there is determines how much lending happens. What it is spent on determines who gets it.</strong></p>
            <p>2. <strong>There is a difference between technically viable and durably viable.</strong> Under the better scenarios the smallest band earns about half a point of margin, which one bad season erases. Only a lower cost structure, rather than a larger subsidy, takes it to 4.65 points. Subsidy lifts a band across zero. Cost structure keeps it there.</p>
            <p>3. <strong>Most of the downside in the worst case is macroeconomic, not fiscal.</strong> The Constrained scenario changes donor support and the macro environment together. Separated, donor retrenchment alone costs 4.5 per cent of lending and macro deterioration alone costs 26.4 per cent, roughly six sevenths of the total fall. This does not weaken the case for attacking origination cost. It strengthens it, because the cost base is the lever the sector controls and the bond market is not. It does mean any evaluation of a cost reduction programme must state its macro assumptions in advance, or it will measure the bond market and report it as a programme result.</p>
            <p><strong>The recommendation</strong> is a division of labour that differs from current practice. Local commercial banks are the only institutions that can reach the small end, and what stops them is a 16.4 per cent origination cost. Donors are the only capital that can pay for origination, because origination support has no repayment and therefore no instrument other than a grant. Development finance institutions should fund balance sheets wholesale rather than take direct exposure to borrowers they cannot efficiently assess. Impact and patient equity should fund the platforms that lower origination cost and the long term asset layer that is 99.6 per cent unserved. Venture capital should fund the one archetype with venture economics and stop underwriting processors as though they were software.</p>
          </div>

          <h2>Scenarios and outlook</h2>
          <h3>3.1 Method</h3>
          <p>Convergence estimates its market outlook with an OLS regression on its own transaction database. No equivalent public database exists for African agricultural finance, so this report builds a structural model on the one thing published in decomposed form.</p>
          <p>For each ticket band:</p>
          <p>``` net margin = revenue              − operating cost × efficiency − origination subsidy × pass through              − expected credit loss × (1 − guarantee coverage)              − cost of funds ```</p>
          <p>Agriculture&apos;s share of a bank loan book is a logistic function of the gap between that margin and the alternative return. The curve has one free parameter, calibrated to the single observed point available: 4 per cent of portfolios at a 5.3 per cent value weighted margin against a 22.25 per cent alternative. Solved value 0.0887.</p>
          <h3>3.2 The scenarios</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Scenario</th>
        <th>Guarantee</th>
        <th>Origination subsidy</th>
        <th>Cost of funds</th>
        <th>Operating cost</th>
        <th>Alternative return</th>
        </tr></thead><tbody>
        <tr><td>Constrained</td><td className="num">25%</td><td className="num">0.000</td><td className="num">+1.5</td><td className="num">×1.00</td><td className="num">25.0%</td></tr>
        <tr><td>Baseline</td><td className="num">50%</td><td className="num">0.500</td><td className="num">0.0</td><td className="num">×0.97</td><td className="num">22.25%</td></tr>
        <tr><td>Favourable</td><td className="num">80%</td><td className="num">1.000</td><td className="num">-0.5</td><td className="num">×0.95</td><td className="num">20.0%</td></tr>
        <tr><td>Matched</td><td className="num">50%</td><td className="num">1.271</td><td className="num">-0.5</td><td className="num">×0.95</td><td className="num">20.0%</td></tr>
        <tr><td>Matched + operating model</td><td className="num">50%</td><td className="num">1.271</td><td className="num">-0.5</td><td className="num">×0.70</td><td className="num">20.0%</td></tr>
        </tbody></table></div>
          <p>Favourable, Matched and Matched + operating model all spend <strong>1.722 concessional points per dollar lent</strong>, solved rather than assumed. The budget ratio to Favourable is exactly 1.000 in each case, so the comparison isolates the mechanism.</p>
          <h3>3.3 Volume</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Scenario</th>
        <th>Agricultural lending</th>
        <th>Against baseline</th>
        </tr></thead><tbody>
        <tr><td>Constrained</td><td className="num">2.22bn</td><td className="num">-31%</td></tr>
        <tr><td>Baseline</td><td className="num">3.22bn</td><td>reference</td></tr>
        <tr><td>Favourable</td><td className="num">4.10bn</td><td className="num">+27%</td></tr>
        <tr><td>Matched</td><td className="num">4.07bn</td><td className="num">+26%</td></tr>
        <tr><td>Matched + operating model</td><td className="num">4.41bn</td><td className="num">+37%</td></tr>
        </tbody></table></div>
          <p><strong>Budget neutral reallocation is close to volume neutral</strong>, by under one per cent and in the wrong direction. This is the arithmetic of a market where half of all loan value sits above 200,000 dollars, where operating cost is already trivial and a guarantee is the cheaper gift. Aggregate volume is a poor test of whether a policy reaches anyone new.</p>
          <h3>3.4 Reach</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Scenario</th>
        <th>Total</th>
        <th>Loans of 10k to 50k</th>
        <th>Additional lending</th>
        </tr></thead><tbody>
        <tr><td>Baseline</td><td className="num">2.93bn</td><td className="num">0.27bn</td><td className="num">0.66bn</td></tr>
        <tr><td>Favourable</td><td className="num">4.10bn</td><td className="num">0.74bn</td><td className="num">1.17bn</td></tr>
        <tr><td>Matched</td><td className="num">4.07bn</td><td className="num">0.74bn</td><td className="num">1.17bn</td></tr>
        <tr><td>Matched + operating model</td><td className="num">4.41bn</td><td className="num">0.96bn</td><td className="num">1.38bn</td></tr>
        </tbody></table></div>
          <Figure n={1} data={ag_fig12 as FigureData} />
          <p>Small ticket lending rises 252 per cent against a 51 per cent rise in total volume. Both figures are on this table&apos;s basis, which counts only viable bands. Additional lending roughly doubles.</p>
          <p><strong>A note on the two totals.</strong> The table above counts only loan sizes that earn a positive margin, on the view that a lender does not build a book in a product that loses money. Section 3.3 counts the allocation across every band. The two agree exactly wherever all five bands are viable, and diverge in the Constrained and Baseline cases where the smallest band is not: Baseline is USD 3.22bn on the all bands basis and USD 2.93bn on the viable bands basis. Measured consistently on the viable bands basis, Matched plus operating model is 51 per cent above baseline rather than 37 per cent. `model.reconcile_totals()` prints the comparison, so nothing quoting either figure has to guess which basis it is on.</p>
          <p><strong>How much concessional capital there is determines how much lending happens. What that capital is spent on determines who gets it.</strong></p>
          <h3>3.5 Technically viable against durably viable</h3>
          <p>Net margin on the 10,000 to 25,000 dollar band, where 84 per cent of borrowers have never held a formal loan:</p>
          <Figure n={2} data={ag_fig11 as FigureData} />
          <div className="tablewrap"><table><thead><tr>
        <th>Scenario</th>
        <th>Margin</th>
        </tr></thead><tbody>
        <tr><td>Constrained</td><td className="num">-3.52%</td></tr>
        <tr><td>Baseline</td><td className="num">-0.93%</td></tr>
        <tr><td>Favourable</td><td className="num">+0.53%</td></tr>
        <tr><td>Matched</td><td className="num">+0.55%</td></tr>
        <tr><td>Matched + operating model</td><td className="num">+4.65%</td></tr>
        </tbody></table></div>
          <p>Half a point is a margin one bad season erases and no credit committee will defend against a 16 per cent treasury bill. Only the cost structure change produces a margin a bank will build a department around. <strong>Subsidy lifts a band across zero. Cost structure keeps it there.</strong></p>
          <h3>3.6 Sensitivity</h3>
          <p>Tested across allocation sensitivities from 0.05 to 0.20, a range of four times, the scenario ordering is identical at every value. Absolute levels move by a factor of about seven and should not be quoted as point estimates. The ranking does not move.</p>
          <Figure n={3} data={ag_fig13 as FigureData} />
          <h3>3.7 What the Constrained scenario actually contains</h3>
          <p>The Constrained scenario applies two shocks at once: donor retrenchment (guarantee cover thins, origination support ends) and macro deterioration (funding costs rise, bond yields rise, tickets drift smaller). Bundling them is realistic, since budget pressure and macro stress tend to co-occur, but it makes the result unattributable. `model.decompose_constrained()` runs each half against Baseline.</p>
          <Figure n={4} data={ag_fig14 as FigureData} />
          <div className="tablewrap"><table><thead><tr>
        <th></th>
        <th>Lending</th>
        <th>Against Baseline</th>
        <th>Share of the Constrained fall</th>
        </tr></thead><tbody>
        <tr><td>Baseline</td><td className="num">2.93bn</td><td></td><td></td></tr>
        <tr><td>Donors retrench, macro holds</td><td className="num">2.80bn</td><td className="num"><strong>-4.5%</strong></td><td className="num">15%</td></tr>
        <tr><td>Macro deteriorates, donors hold</td><td className="num">2.15bn</td><td className="num"><strong>-26.4%</strong></td><td className="num">87%</td></tr>
        <tr><td>Constrained, both</td><td className="num">2.03bn</td><td className="num"><strong>-30.5%</strong></td><td className="num">100%</td></tr>
        </tbody></table></div>
          <p>The halves do not sum exactly, because the allocation rule is a logistic. The residual is USD 0.012bn, which is small enough that the two effects can be treated as close to additive over this range.</p>
          <p><strong>Roughly six sevenths of the damage in the worst case is macroeconomic rather than fiscal.</strong> Three consequences follow.</p>
          <p>First, the case for attacking origination cost strengthens rather than weakens. If the macro environment does most of the damage and no actor in agricultural finance controls it, the cost base is the principal lever the sector actually holds.</p>
          <p>Second, the framing of this research as an argument about donor allocation is incomplete. Donor allocation determines <em>who</em> is reached, as Section 3.4 shows. It is a second order determinant of <em>how much</em> is lent, behind the price of money and the yield on government paper. Report 1 of this series established the mechanism in its Section 1.5; this quantifies it.</p>
          <p>Third, and practically: any evaluation of a cost reduction intervention must state its macro assumptions in advance. A programme that lowers origination cost by 30 per cent and then meets conditions like Uganda&apos;s in late 2026 will report disappointing volumes. The programme will not have failed. The denominator will have moved. Without a stated counterfactual, such an evaluation measures the bond market.</p>
          <hr />
          <h2>Recommendations</h2>
          <p><strong>Local commercial banks.</strong> The only institutions that can reach the small end: branch networks, local currency deposits, an existing cost base. What stops them is a 16.4 per cent origination cost, not risk appetite. Aceli&apos;s 45 African domiciled lenders originated 96 per cent of its loans against an expectation that international investors would do half.</p>
          <p><strong>Donors and philanthropy.</strong> The only capital that can pay for origination, because origination support has no repayment and therefore no instrument other than a grant. This is the highest value use of a shrinking concessional budget and it is not where most of that budget goes. Fund the transaction cost, not only the credit risk.</p>
          <p><strong>Development finance institutions.</strong> Fund balance sheets, not borrowers. Diligence costs roughly the same on a 2 million dollar cheque as on a 20 million one, which makes the minimum ticket a cost function rather than a preference. The comparative advantage is wholesale: on lending facilities to local banks, portfolio guarantees, local currency capacity.</p>
          <p><strong>Impact and patient equity.</strong> Fund the platforms that lower origination cost, and the long term asset layer that is 99.6 per cent unserved. Irrigation, storage, processing, mechanisation. That layer needs capital with a longer life than a seven year fund.</p>
          <p><strong>Venture capital.</strong> Fund the one archetype with venture economics. That is a smaller market than the sector has been telling itself, and an honest one.</p>
          <p><strong>Everyone.</strong> Report leverage beside additionality, always. Set leverage targets as floors rather than maxima. Price additionality explicitly, since the trade off curve is now measured and the price is knowable.</p>
          <hr />
          <h2>Appendix A. Methodology</h2>
          <p><strong>Model development.</strong> The dependent variable is agriculture&apos;s share of commercial bank loan portfolios, converted to dollars using private sector credit outstanding across the five focus countries. The independent variables are the components of lender net margin: revenue, operating cost, expected credit loss, cost of funds, and the two concessional levers, guarantee coverage and origination subsidy.</p>
          <p><strong>Why not a regression.</strong> Convergence fits OLS to its own transaction database, disaggregating annual data by climate theme to raise 11 observations to 44. No comparable deal level database exists publicly for African agricultural finance. Rather than fit an equation to absent data, this model fits the published cost function and builds an allocation rule on it.</p>
          <p><strong>Cost curve.</strong> Log linear least squares on five published observations. Operating cost as a share of loan value equals exp(9.753) × ticket^(-0.7042), R squared 0.988. Used for interpolation between Aceli&apos;s bands only, never extrapolation beyond 10,000 to 2,000,000 dollars.</p>
          <p><strong>Allocation rule.</strong> Logistic in the margin gap, with a ceiling of 22 per cent anchored on Tanzania, where the observed agricultural share passed 13 per cent by 2025, and on agriculture&apos;s 20 to 26 per cent share of GDP in four of the five countries. The sensitivity parameter is solved from one observed point and sensitivity tested over 0.05 to 0.20.</p>
          <p><strong>Scenario construction.</strong> Constrained, Baseline and Favourable vary the volume and price of capital in the Convergence manner. Matched and Matched + operating model hold the concessional budget at the Favourable level, solved to the decimal place, and vary only the allocation between credit risk cover and origination support, and in the final case the underlying cost structure.</p>
          <p><strong>Aggregation.</strong> Band level results are weighted by Aceli&apos;s observed distribution of loan value. Reach results apply Aceli&apos;s measured additionality curve by band.</p>
          <h2>Appendix B. Limitations</h2>
          <p>1. <strong>One programme, five countries, one vintage.</strong> Aceli&apos;s benchmark data covers 2020 to 2023 in relatively deep regional financial markets. West and Central African lender economics are likely worse, which would strengthen the direction of the argument while making the levels wrong.</p>
          <p>2. <strong>Five observations in the cost curve.</strong> R squared of 0.988 on n=5 is a well determined line through very few points.</p>
          <p>3. <strong>The allocation parameter is calibrated, not estimated.</strong> One point, one parameter. The ranking is robust across a wide range; the levels are not and are not offered as forecasts.</p>
          <p>4. <strong>The 30 per cent operating cost reduction is an assumption.</strong> If the true figure is 15 per cent, the final scenario loses about half its advantage. It would not change the ranking.</p>
          <p>5. <strong>Selection bias runs one way.</strong> Aceli&apos;s figures come from loans actually issued to borrowers who passed a screen. Aceli believes this understates the risk of the broader segment. Expected credit loss would have to rise by an order of magnitude to overturn the conclusion, and the guarantee ceiling result would survive even then.</p>
          <p>6. <strong>The model is supply side.</strong> It asks what lenders do at given margins. It does not model demand, absorptive capacity or price effects. A facility succeeding on these terms could still fail on pipeline, which Aceli&apos;s own 73 per cent of capital target suggests is a live risk.</p>
          <h2>Appendix C. What would falsify this</h2>
          <ul><li>A pure guarantee facility demonstrably moving lending at the 10,000 to 50,000 dollar band with no origination support.</li><li>Origination cost proving irreducible in practice, which would mean the small end requires permanent subsidy. This is the assumption most worth testing.</li></ul>
          <hr />
          <p><em>A shorter explainer of this report is published as <Link href="/blogs/spend-the-same-money-differently">Spend the Same Money Differently</Link>. Sources are listed in full in SOURCES.md. Data, model and notebooks are open and reproducible.</em></p>

          <div className="series">
            <Link href="/publications/cost-of-a-small-loan-2026"><div className="k">Report 1 of the series</div><div className="t">The Cost of a Small Loan: why Africa&apos;s agricultural lending gap behaves like a cost problem and is priced as a risk problem &rarr;</div></Link>
            <Link href="/publications/matching-business-to-instrument-2026"><div className="k">Report 2 of the series</div><div className="t">Matching the Business to the Instrument: five agricultural business models, the balance sheet each one has, and the capital each one is offered &rarr;</div></Link>
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
            <li>OECD, Aceli Africa: mobilising private capital for agricultural enterprises in East Africa (Blended Finance Case Studies) (2024) <a href="https://www.oecd.org/en/publications/blended-finance-case-studies_2fb90b9a-en/aceli-africa-mobilising-private-capital-for-agricultural-enterprises-in-east-africa_5707a4f7-en.html" target="_blank" rel="noopener">oecd.org</a></li>
            <li>AgDevCo, Annual Report for the year ended 31 December 2025 (2026) <a href="https://agdevco.com/site/assets/files/2900/agdevco_annual_report_2025.pdf" target="_blank" rel="noopener">agdevco.com</a></li>
            <li>Michael Omega, Filling the Missing Middle: A Funding Model for Africa&apos;s Series A/B Gap (2026) <a href="https://herufi.org/blogs/how-to-fill-africas-missing-middle" target="_blank" rel="noopener">herufi.org</a></li>
            <li>World Bank, World Development Indicators (2025) <a href="https://databank.worldbank.org/source/world-development-indicators" target="_blank" rel="noopener">databank.worldbank.org</a></li>
            <li>Ecofin Agency, Uganda raises interest rate to 12% as shilling weakens against dollar (2026) <a href="https://www.ecofinagency.com/news-finances/2810-60216-uganda-raises-interest-rate-to-12-as-shilling-weakens-against-dollar" target="_blank" rel="noopener">ecofinagency.com</a></li>
            <li>Daily Monitor (Martin Luther Oketch), BoU takes action on falling shilling (2026) <a href="https://www.monitor.co.ug/uganda/news/national/bou-takes-action-on-falling-shilling-5633068" target="_blank" rel="noopener">monitor.co.ug</a></li>
          </ol>
        </div>
      </footer>
    </>
  )
}
