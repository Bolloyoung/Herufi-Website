import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type { FigureData } from '@/components/charts/types'
import ag_fig2 from '@/data/charts/ag_fig2.json'
import ag_fig1 from '@/data/charts/ag_fig1.json'
import ag_fig3 from '@/data/charts/ag_fig3.json'
import ag_fig6 from '@/data/charts/ag_fig6.json'
import ag_fig4 from '@/data/charts/ag_fig4.json'
import ag_fig5 from '@/data/charts/ag_fig5.json'

export default function CostOfASmallLoan2026() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications &rarr;</Link>
          </div>
          <p className="eyebrow">Agricultural Capital Series &middot; Report 1 of 3</p>
          <h1>The Cost of a Small Loan</h1>
          <p className="sub">Why Africa&apos;s agricultural lending gap behaves like a cost problem and is priced as a risk problem</p>
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
            <div className="stat"><div className="v">39x</div><div className="l">How much more the cost of making a loan varies by loan size than the expected credit loss does</div></div>
            <div className="stat gold"><div className="v">0.4%</div><div className="l">Share of the long term agricultural finance need that is met in Africa south of the Sahara</div></div>
            <div className="stat dark"><div className="v">23 to 1</div><div className="l">Operating cost against expected credit loss on the smallest loans a commercial bank makes</div></div>
            <div className="stat"><div className="v">43bn / 2bn</div><div className="l">Annual smallholder finance supplied by agribusiness buyers against the amount supplied by commercial banks</div></div>
          </div>

          <div className="exec">
            <p className="eyebrow">Executive summary</p>
            <p>Agriculture is roughly a fifth of value added and more than half of all employment across Kenya, Tanzania, Uganda, Rwanda and Zambia. It receives about 4 per cent of commercial bank lending. This report asks why, and tests the explanation the sector gives for it.</p>
            <p><strong>The diagnosis is that agriculture&apos;s capital problem is misdiagnosed.</strong> It is treated as a risk problem, and the instruments built for it are therefore risk instruments. The only decomposed loan level data that exists for African agricultural lending says the binding constraint at the bottom of the market is something else.</p>
            <p><strong>Key findings</strong></p>
            <p>1. <strong>Credit loss barely varies by loan size. Operating cost varies enormously.</strong> Across Aceli Africa&apos;s 32,000 loan dataset, expected credit loss moves 0.4 percentage points between the smallest and largest loans. Operating cost moves 15.5 points, from 16.4 per cent of loan value to 0.9 per cent. The swing in cost is 39 times the swing in risk. Lenders already price for the small end, charging 4.6 points more, and it is not enough because cost falls nine times faster than price.</p>
            <p>2. <strong>The dominant instrument is capped by arithmetic.</strong> A guarantee can only return the losses a lender expects to take. A hypothetical guarantee covering 100 per cent of expected credit loss at no cost moves the smallest band from minus 2.2 per cent to minus 1.5 per cent. Still loss making, still unserved. Aceli&apos;s lenders rate its origination incentive higher than its first loss cover, 90 per cent against 73 per cent.</p>
            <p>3. <strong>The gap has a tenor shape that the aggregate hides.</strong> In Africa south of the Sahara, smallholder short term working capital is 30 per cent met. Long term capital, which buys irrigation, storage, processing and mechanisation, is <strong>0.4 per cent met</strong>: 0.1 billion dollars of supply against 27.1 billion of need. The migration toward working capital is rational, because short term lending repays itself out of the harvest. It leaves the productivity layer untouched.</p>
            <p>4. <strong>The largest financier of smallholder agriculture is the buyer, not a bank.</strong> Value chain actors supply about 43 billion dollars a year, 45 per cent of global smallholder finance. Commercial banks supply 2 billion. Venture backed agricultural fintech supplies 0.9 billion. Offtakers underwrite cheaply because the trading relationship is the credit file, which is the origination cost advantage everyone else lacks.</p>
            <p><strong>What follows from this.</strong> Report 2 takes the cost structure established here and asks what kind of capital fits an agricultural balance sheet. Report 3 models what changes when a fixed concessional budget is spent on the cost of lending rather than on cover against losses.</p>
          </div>

          <h2>The mismatch</h2>
          <h3>1.1 What agriculture is, against what it receives</h3>
          <p>Across Kenya, Tanzania, Uganda, Rwanda and Zambia, agriculture averages 19.3 per cent of value added and 53.0 per cent of employment. Those five economies carry about 74.6 billion dollars of private sector credit between them.</p>
          <p>Agricultural SME lending accounts for about 4 per cent of partner bank loan portfolios, up from 3 per cent in 2020. Agritech equity accounted for roughly 3.9 per cent of African technology equity in 2025.</p>
          <p>Zambia is the instructive case. Agriculture is 4.1 per cent of value added and 54.5 per cent of employment, a productivity gap of more than tenfold. The financing question and the productivity question are not separable.</p>
          <p>The standard explanation for the gap is risk. The rest of this report tests it.</p>
          <h3>1.2 The hypothesis</h3>
          <p>&gt; Agriculture&apos;s capital problem is treated as a risk problem, and the instruments built for it are therefore risk instruments. The binding constraint at the bottom of the market is the cost of originating and servicing a small loan. The two call for different instruments, and the mismatch is why capital does not reach the enterprises that serve smallholder farmers.</p>
          <p>This is falsifiable. If the risk explanation holds, expected credit loss should rise sharply as loans get smaller and dominate the cost structure. If the cost explanation holds, credit loss should be flat while operating cost explodes.</p>
          <h3>1.3 The evidence</h3>
          <p>Aceli Africa, working with Dalberg, publishes a standardised profit and loss for agricultural SME lending: 32,000 loans worth about 2 billion dollars from 41 lenders across five countries, decomposed into revenue, origination cost, servicing cost, expected credit loss and cost of funds at five ticket sizes.</p>
          <Figure n={1} data={ag_fig2 as FigureData} />
          <Figure n={2} data={ag_fig1 as FigureData} />
          <p>Commercial bank economics, as a percentage of loan value over the life of the loan:</p>
          <div className="tablewrap"><table><thead><tr>
        <th>Loan size</th>
        <th>Revenue</th>
        <th>Operating cost</th>
        <th>Expected credit loss</th>
        <th>Cost of funds</th>
        <th>Net</th>
        </tr></thead><tbody>
        <tr><td>10k to 25k</td><td className="num">17.9</td><td className="num">16.4</td><td className="num">0.7</td><td className="num">3.0</td><td className="num"><strong>-2.2</strong></td></tr>
        <tr><td>25k to 50k</td><td className="num">17.2</td><td className="num">11.5</td><td className="num">0.9</td><td className="num">3.2</td><td className="num"><strong>1.6</strong></td></tr>
        <tr><td>50k to 200k</td><td className="num">15.0</td><td className="num">5.9</td><td className="num">1.1</td><td className="num">3.0</td><td className="num"><strong>5.0</strong></td></tr>
        <tr><td>200k to 500k</td><td className="num">13.6</td><td className="num">2.5</td><td className="num">1.0</td><td className="num">3.0</td><td className="num"><strong>7.1</strong></td></tr>
        <tr><td>500k to 2M</td><td className="num">13.3</td><td className="num">0.9</td><td className="num">0.8</td><td className="num">3.2</td><td className="num"><strong>8.4</strong></td></tr>
        </tbody></table></div>
          <p>Every band reconciles exactly against the published net margin.</p>
          <p>Expected credit loss reads 0.7, 0.9, 1.1, 1.0, 0.8. It barely moves, and it is not monotonic: the largest loans carry marginally more expected loss than the smallest. The total variation is 0.4 percentage points.</p>
          <p>Operating cost reads 16.4, 11.5, 5.9, 2.5, 0.9. A swing of 15.5 points, 39 times larger.</p>
          <p>Fitting operating cost against ticket size gives a log linear relationship with an elasticity of <strong>-0.704</strong> and an R squared of <strong>0.988</strong> on five observations. A 1 per cent increase in loan size reduces operating cost by 0.70 per cent of loan value. Revenue falls too, at an elasticity of -0.079, nine times more slowly.</p>
          <p><strong>The hypothesis survives.</strong> The accurate sentence is not that agriculture is too risky to lend to at small ticket sizes, but that it is too expensive to underwrite at small ticket sizes.</p>
          <h3>1.4 The guarantee ceiling</h3>
          <p>A guarantee can only return the losses a lender expects to take, so expected credit loss is an arithmetic ceiling on what the instrument can achieve.</p>
          <Figure n={3} data={ag_fig3 as FigureData} />
          <div className="tablewrap"><table><thead><tr>
        <th>Loan size</th>
        <th>Net margin</th>
        <th>Full guarantee adds</th>
        <th>Result</th>
        <th>Operating cost to credit loss</th>
        </tr></thead><tbody>
        <tr><td>10k to 25k</td><td className="num">-2.2</td><td className="num">+0.7</td><td className="num"><strong>-1.5</strong></td><td className="num">23 to 1</td></tr>
        <tr><td>25k to 50k</td><td className="num">1.6</td><td className="num">+0.9</td><td className="num">2.5</td><td className="num">13 to 1</td></tr>
        <tr><td>50k to 200k</td><td className="num">5.0</td><td className="num">+1.1</td><td className="num">6.1</td><td className="num">5 to 1</td></tr>
        <tr><td>200k to 500k</td><td className="num">7.1</td><td className="num">+1.0</td><td className="num">8.1</td><td className="num">2.5 to 1</td></tr>
        <tr><td>500k to 2M</td><td className="num">8.4</td><td className="num">+0.8</td><td className="num">9.2</td><td className="num">1.1 to 1</td></tr>
        </tbody></table></div>
          <p>A guarantee more generous than any in existence leaves the smallest band loss making. Aceli reached the same conclusion when designing its facility: the standard 50 per cent guarantee was not on its own enough to shift lender behaviour, so it added an origination incentive. Its lenders now rate that incentive more highly than the risk cover.</p>
          <p>Risk cover is necessary. At the bottom of the market it is not the binding constraint.</p>
          <h3>1.5 The competition for the balance sheet</h3>
          <p>A bank chooses between agriculture and the next best use of the same capital.</p>
          <Figure n={4} data={ag_fig6 as FigureData} />
          <div className="tablewrap"><table><thead><tr>
        <th></th>
        <th>Return</th>
        </tr></thead><tbody>
        <tr><td>Agricultural SME lending, simple average</td><td className="num">3.5%</td></tr>
        <tr><td>Same, weighted by loan value</td><td className="num">5.3%</td></tr>
        <tr><td>Same, with concessional incentives</td><td className="num">~6.5%</td></tr>
        <tr><td>Government bonds, five country average</td><td className="num">16.2%</td></tr>
        <tr><td>Overall commercial bank profitability</td><td className="num">28.3%</td></tr>
        </tbody></table></div>
          <p>This carries a policy consequence that is rarely stated: <strong>high domestic interest rates are an agricultural finance problem.</strong> Every rise in the yield on government paper widens the gap a subsidy must close. A facility designed when treasury bills paid 10 per cent is underpowered when they pay 16.</p>
          <p><strong>Uganda, 2026, as a live instance.</strong> The shilling fell from about 3,604 per US dollar in March 2026 to nearly 4,500 by late October. On 14 October the Bank of Uganda raised the Central Bank Rate from 9.75 to 12 per cent and the cash reserve requirement from 11 to 13.5 per cent. Three effects land on a farm borrower at once: dollar denominated debt costs about a quarter more to service in shilling terms, shilling debt reprices upward, and the lendable pool shrinks as a larger share of each deposit sits at the central bank. None of it originates in agriculture. The case recurs in Report 2 of this series, on currency matching, and in Report 3, on what the Constrained scenario actually contains.</p>
          <h3>1.6 The tenor gap</h3>
          <p>ISF Advisors sizes smallholder financing need at 323 billion dollars annually against 95 billion of supply, a gap of about 230 billion, more than 70 per cent of demand unmet. For Africa south of the Sahara the need is 78 billion and the supply about 19 billion.</p>
          <Figure n={5} data={ag_fig4 as FigureData} />
          <p>Split by purpose:</p>
          <div className="tablewrap"><table><thead><tr>
        <th>Purpose</th>
        <th>Supply</th>
        <th>Need</th>
        <th>Met</th>
        </tr></thead><tbody>
        <tr><td>Short term agricultural</td><td className="num">10.0bn</td><td className="num">33.0bn</td><td className="num">30.3%</td></tr>
        <tr><td>Long term agricultural</td><td className="num">0.1bn</td><td className="num">27.1bn</td><td className="num"><strong>0.4%</strong></td></tr>
        <tr><td>Non agricultural household</td><td className="num">9.0bn</td><td className="num">18.0bn</td><td className="num">50.0%</td></tr>
        </tbody></table></div>
          <p>The long term agricultural finance market is 99.6 per cent unserved. Short term lending works, to the extent it does, because the harvest repays it and an offtaker can withhold it. Long term capital has no such mechanism, and it is the capital that raises yields.</p>
          <p>This reframes the shift toward working capital as both rational and incomplete.</p>
          <h3>1.7 Who actually lends</h3>
          <div className="tablewrap"><table><thead><tr>
        <th>Channel</th>
        <th>Annual volume</th>
        <th>A financial institution?</th>
        </tr></thead><tbody>
        <tr><td>Agribusiness value chain actors</td><td className="num">43.0bn</td><td>No</td></tr>
        <tr><td>Informal and community based</td><td className="num">25.0bn</td><td>No</td></tr>
        <tr><td>State banks</td><td className="num">13.0bn</td><td>Yes</td></tr>
        <tr><td>Microfinance institutions</td><td className="num">10.0bn</td><td>Yes</td></tr>
        <tr><td>Commercial banks</td><td className="num">2.0bn</td><td>Yes</td></tr>
        <tr><td>Innovators, fintech and platforms</td><td className="num">0.9bn</td><td>Yes</td></tr>
        </tbody></table></div>
          <Figure n={6} data={ag_fig5 as FigureData} />
          <p>Offtakers are the largest channel because the trading relationship is the credit file and the next purchase is the recovery mechanism. That is the origination cost advantage identified in Section 1.3, solved commercially rather than financially.</p>
          <p>The implication for strategy: the way to lower origination cost is usually not to build a new direct channel to the farmer, but to finance and plug into the channel that already reaches them.</p>
          <hr />
          <h2>Appendix A. Method</h2>
          <p><strong>Source of the cost decomposition.</strong> Aceli Africa, working with Dalberg, publishes a standardised profit and loss for agricultural SME lending across five ticket bands. Every band reproduced in this report reconciles exactly against that published net margin, so the decomposition here introduces no estimate of its own.</p>
          <p><strong>Cost curve.</strong> Log linear least squares on five published observations. Operating cost as a share of loan value equals exp(9.753) × ticket^(-0.7042), R squared 0.988. Used for interpolation between Aceli&apos;s bands only, never extrapolation beyond 10,000 to 2,000,000 dollars.</p>
          <h2>Appendix B. Limitations</h2>
          <p>1. <strong>One programme, five countries, one vintage.</strong> Aceli&apos;s benchmark data covers 2020 to 2023 in relatively deep regional financial markets. West and Central African lender economics are likely worse, which would strengthen the direction of the argument while making the levels wrong.</p>
          <p>2. <strong>Five observations in the cost curve.</strong> R squared of 0.988 on n=5 is a well determined line through very few points.</p>
          <p>3. <strong>Selection bias runs one way.</strong> Aceli&apos;s figures come from loans actually issued to borrowers who passed a screen. Aceli believes this understates the risk of the broader segment. Expected credit loss would have to rise by an order of magnitude to overturn the conclusion, and the guarantee ceiling result would survive even then.</p>
          <p>4. <strong>Two different markets.</strong> The smallholder figures and the agricultural SME figures are different populations and are never added together in this report.</p>
          <h2>Appendix C. What would falsify this</h2>
          <ul><li>Expected credit loss proving strongly size dependent in a larger or differently selected sample.</li><li>A pure guarantee facility demonstrably moving lending at the 10,000 to 50,000 dollar band with no origination support.</li></ul>
          <hr />
          <p><em>A shorter explainer of this report is published as <Link href="/blogs/why-banks-turn-down-farm-loans">Why Banks Turn Down Farm Loans They Expect to Be Repaid</Link>. Sources are listed in full in SOURCES.md. Data, model and notebooks are open and reproducible.</em></p>

          <div className="series">
            <Link href="/publications/matching-business-to-instrument-2026"><div className="k">Report 2 of the series</div><div className="t">Matching the Business to the Instrument: five agricultural business models, the balance sheet each one has, and the capital each one is offered &rarr;</div></Link>
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
            <li>Aceli Africa, Profitability of Agricultural SME Lending in East Africa: 2023 Benchmarking Report (2023) <a href="https://aceliafrica.org/app/uploads/2023/03/Aceli-Africa-2023-Benchmarking-Report.pdf" target="_blank" rel="noopener">aceliafrica.org</a></li>
            <li>ISF Advisors, Beyond the Frontier: Decoding Viability in Smallholder Finance (State of the Sector Report) (2025) <a href="https://isfadvisors.co/wp-content/uploads/2025/10/ISF_AgFinance-SoS-Report-Oct-2025.pdf" target="_blank" rel="noopener">isfadvisors.co</a></li>
            <li>Partech Partners, 2025 Partech Africa Tech Venture Capital Report (2026) <a href="https://partechpartners.com/africa-reports/2025-africa-tech-venture-capital-report" target="_blank" rel="noopener">partechpartners.com</a></li>
            <li>Briter Bridges, State of Agtech Investment in Africa 2025 (2026) <a href="https://briterbridges.com/" target="_blank" rel="noopener">briterbridges.com</a></li>
            <li>ISF Advisors / CASA, The State of the Agri-SME Sector: Bridging the Finance Gap (2022) <a href="https://www.casaprogramme.com/wp-content/uploads/2022/03/the-state-of-the-agri-sme-sector-bridging-the-finance-gap.pdf" target="_blank" rel="noopener">casaprogramme.com</a></li>
            <li>OECD, Aceli Africa: mobilising private capital for agricultural enterprises in East Africa (Blended Finance Case Studies) (2024) <a href="https://www.oecd.org/en/publications/blended-finance-case-studies_2fb90b9a-en/aceli-africa-mobilising-private-capital-for-agricultural-enterprises-in-east-africa_5707a4f7-en.html" target="_blank" rel="noopener">oecd.org</a></li>
            <li>Kevin Wanjala and Mohamed Abdulahi, Integrating Small and Medium Enterprises into Global Value Chains through Financial Interventions (2022) <a href="https://herufi.org/blogs/financing-smes-into-global-value-chains" target="_blank" rel="noopener">herufi.org</a></li>
            <li>World Bank, World Development Indicators (2025) <a href="https://databank.worldbank.org/source/world-development-indicators" target="_blank" rel="noopener">databank.worldbank.org</a></li>
            <li>Ecofin Agency, Uganda raises interest rate to 12% as shilling weakens against dollar (2026) <a href="https://www.ecofinagency.com/news-finances/2810-60216-uganda-raises-interest-rate-to-12-as-shilling-weakens-against-dollar" target="_blank" rel="noopener">ecofinagency.com</a></li>
            <li>Daily Monitor (Martin Luther Oketch), BoU takes action on falling shilling (2026) <a href="https://www.monitor.co.ug/uganda/news/national/bou-takes-action-on-falling-shilling-5633068" target="_blank" rel="noopener">monitor.co.ug</a></li>
          </ol>
        </div>
      </footer>
    </>
  )
}
