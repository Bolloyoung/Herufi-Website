import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type { FigureData } from '@/components/charts/types'
import r3fig1 from '@/data/charts/r3_fig1.json'
import r3fig2 from '@/data/charts/r3_fig2.json'
import r3fig3 from '@/data/charts/r3_fig3.json'
import r3fig4 from '@/data/charts/r3_fig4.json'
import r3fig5 from '@/data/charts/r3_fig5.json'

export default function ContinentHeading20262030() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications →</Link>
          </div>
          <p className="eyebrow">The African Startup Investment Trilogy · Report 3 of 3</p>
          <h1>Where the Continent Is Heading</h1>
          <p className="sub">Validated scenarios for African startup funding, 2026 to 2030. Every variable, every assumption, every check.</p>
          <div className="byline">
            <span><b>Michael Omega</b></span>
            <span>Impact Investment and Advisory Professional, Nairobi</span>
            <span>July 2026</span>
          </div>
        </div>
      </header>

      <main>
        <div className="wrap">
          <div className="exec">
            <p className="eyebrow">Executive summary</p>
            <p>Africa 2030 is a consolidation story, not a moonshot story: the validated base case is roughly a doubling of the market, not a twentyfold explosion. This report forecasts every variable tracked in <Link href="/publications/broken-ladder-2014-baseline">Report 1</Link> and <Link href="/publications/frontier-to-market-2014-2026">Report 2</Link> over the period July 2026 to 2030: total funding, deal counts, debt share, exits, unicorns, geographic concentration and the gender funding gap. The base case (50% probability) puts annual funding at approximately $5.5 billion by 2030, alongside roughly 175 exits per year, about 15 cumulative unicorns, a stable 35% to 40% debt layer and Big Four concentration easing modestly to about 75% of capital.</p>
            <p>Every forecast in this report was validated before being believed and the validation results discipline the entire exercise. A backtest (models trained on 2015 to 2022, asked to predict the 2023 to 2025 winter) shows that trend extrapolation fails catastrophically: the standard log linear growth model missed actual 2025 funding by a factor of nearly six (357% error), while a naive last value model was the most accurate. Monte Carlo simulation, an out of sample check against the published H1 2026 actuals ($1.44 billion, the model passes) and benchmarking against external projections complete the validation battery.</p>
            <p>The much quoted $62 to $94 billion projections for 2030 would require 81% to 97% compound growth for five consecutive years, treat them as aspirations, not forecasts. History&apos;s best sustained growth stretch was roughly 28% per year (off a tiny base); the post boom market grows at about 8%. The optimistic headline numbers extrapolate pre 2021 growth rates, precisely the method the backtest discredits.</p>
            <p>The single most robust forecast is exits; the single most important warning is the shrinking deal count. M&amp;A grew from 39 deals (2024) to 67 (2025) to 63 in the first half of 2026 alone, consolidation thrives even when funding is scarce, making roughly 175 exits per year by 2030 the most defensible projection in this report. Meanwhile deal counts are contracting (H1 2026 annualises to about 380 versus 506 in 2025): today&apos;s missing seed cheques are 2030&apos;s missing Series A companies and this is the indicator most likely to convert the base case into the bear case.</p>
          </div>

          <div className="stats">
            <div className="stat"><div className="v">$5.5B</div><div className="l">Base case annual funding by 2030, roughly a doubling</div></div>
            <div className="stat gold"><div className="v">175</div><div className="l">Exits per year by 2030, the most defensible forecast</div></div>
            <div className="stat dark"><div className="v">15</div><div className="l">Cumulative unicorns projected by 2030 (base case)</div></div>
            <div className="stat"><div className="v">357%</div><div className="l">Error when the trend model was backtested, why we validate</div></div>
          </div>

          <h2 className="sec"><span className="num">01</span>Introduction and background</h2>
          <p>The trilogy closes by looking forward, with the humility the data demands. Report 1 diagnosed the 2014 ecosystem; Report 2 measured the 2014 to 2026 transformation. This report projects 2026 to 2030. The forecasting problem is unusually hard: the funding series has eleven annual observations containing a 3x boom and a 46% crash, both driven by global forces no African dataset could predict. The report therefore treats validation as the product, not a footnote: every projection survives (or is disciplined by) four independent checks before interpretation.</p>
          <p>Forecasts here are decision tools for investors, not predictions of fate. The deliverable is a set of bear, base and bull scenarios with explicit drivers, probabilities and monitoring indicators, so that a fund manager, DFI or policymaker can position for the base case while knowing exactly which signals would announce the alternatives.</p>

          <h2 className="sec"><span className="num">02</span>Objectives</h2>
          <p>The report pursues four objectives. First, to forecast total African startup funding to 2030 with honest uncertainty bands. Second, to forecast each component variable from the earlier reports: debt share, deal counts, exits, unicorns, Big Four concentration and female CEO funding share. Third, to validate all projections through backtesting, out of sample checks against H1 2026 actuals and external benchmarks. Fourth, to translate the scenarios into investor guidance and a monitoring dashboard of leading indicators.</p>

          <h2 className="sec"><span className="num">03</span>Data and methodology</h2>
          <h3 className="sub">3.1 The series and its regimes</h3>
          <p>The forecast base is the 2015 to 2025 series assembled in Report 2, anchored by the H1 2026 actuals published in July 2026. The series splices Partech equity figures (2015 to 2018, the only tracker for those years) onto Africa: The Big Deal&apos;s equity plus debt series (2019 to 2025). H1 2026 actuals ($1.44 billion, essentially flat year on year, across just 146 disclosed rounds versus 252 a year earlier) provide a live out of sample anchor. Two growth regimes emerge from the data: the full decade (about up 28% per year, inflated by low base hypergrowth) and the mature era from 2019 onward (about up 8% per year, spanning a full boom bust cycle). Choosing between them is the central forecasting decision and the backtest in Section 4.2 makes the choice empirical.</p>
          <h3 className="sub">3.2 Methods</h3>
          <p>Three methods are combined, each compensating for the others&apos; weaknesses. (1) Backtesting: three candidate models, log linear trend, damped CAGR and naive last value, are trained on 2015 to 2022 and scored on their 2023 to 2025 predictions. (2) Monte Carlo bootstrap: 10,000 five year paths are simulated by resampling observed year on year log growth rates, preserving the boom and bust asymmetry and yielding probability bands rather than a single line. (3) Scenario construction: bear, base and bull narratives with explicit drivers are located inside the Monte Carlo distribution so they inherit statistical discipline. Component variables with too few observations for any model (unicorn arrivals, gender share) use transparent scenario logic instead of spurious curve fitting.</p>
          <h3 className="sub">3.3 Data protection</h3>
          <p>As throughout the trilogy, no personal data is processed. All inputs are aggregate market statistics from published reports; the full ethics statement appears in Annexure C.</p>

          <h2 className="sec"><span className="num">04</span>Findings and analysis</h2>
          <p>All modelling and analysis in this section was designed and conducted by Michael Omega. The companion notebook (African_Startups_Forecast_2026_2030.ipynb) reproduces every simulation with fixed random seeds.</p>

          <h3 className="sub">4.1 The forecasting problem</h3>
          <p>The series to be forecast is short, volatile and regime switching, conditions under which overconfident models do the most damage. The series and its year on year growth rates tell the story: a up 207% year (2021) sits four years from a down 37% year (2023) and the standard deviation of log growth in the mature era alone is 0.55. Any model that averages these into a smooth trend is destroying the very information, violent cyclicality, that most affects investor outcomes.</p>
          <Figure n={1} data={r3fig1 as FigureData} />

          <h3 className="sub">4.2 Validation check 1: the backtest</h3>
          <p>Asked to predict the 2023 to 2025 funding winter from 2015 to 2022 data, the standard growth model failed by a factor of six and that failure dictates this report&apos;s design. The log linear trend model, trained through the boom, predicted $18 billion for 2025 against an actual $3.2 billion (357% mean error). The damped CAGR model still erred by 167%. The naive model, simply carrying the last value forward, was the most accurate (70% error). Three design rules follow: anchor forecasts on the latest level, not the decade trend; treat growth as a distribution to sample from, not a constant; and report intervals and scenarios, never a single line.</p>
          <Figure n={2} data={r3fig2 as FigureData} />

          <h3 className="sub">4.3 The core forecast: Monte Carlo bands and scenarios</h3>
          <p>The validated base case puts 2030 funding at approximately $5.5 billion, inside a deliberately wide probability band. The 10,000 bootstrap simulations from the mature era growth regime give a 2030 median of about $4.3 billion, with a 25% to 75% band of roughly $1.9 to $10 billion. Three scenario paths are drawn inside the band: bear about $2.3 billion (25% probability, tight global liquidity, recurring FX crises, continued early stage contraction), base about $5.5 billion (50%, mature era growth plus the structural tailwinds of debt, exits and local capital) and bull about $11 billion (25%, global easing plus an IPO unlock and pension fund participation). The upside tail stretches further than the downside: venture markets crash by halves but grow by multiples.</p>
          <Figure n={3} data={r3fig3 as FigureData} />
          <p>Validation check 2: the model survives contact with 2026. Applying 2025&apos;s second half seasonality to the published H1 2026 actual ($1.44 billion) yields a full year nowcast of about $3.2 billion, a flat year. That value sits at the 50th percentile of the model&apos;s first forecast year: the forecast and the incoming data agree. Qualitatively too, H1 2026 (flat value on collapsing deal count, rescued by one $270 million cleantech mega deal, Spiro) is the signature of the disciplined consolidation regime the model assumes, not a new boom.</p>

          <h3 className="sub">4.4 Component forecasts</h3>
          <p>Each component variable is forecast with the same philosophy: anchor on the latest level, damp the trend, show the range. Four quantitative components stand out. Debt share plateaus at 35% to 40% of funding, structural because asset heavy cleantech and lending fintechs need it, capped because it is collateral constrained. Exits are the strongest trend in the dataset, 39, then 67, then 63 in half of 2026 and project to roughly 175 per year by 2030 even with heavy damping. Deal counts are the warning: the 2026 run rate of about 380 deals is well below 2025&apos;s 506 and the bear path assumes this contraction persists. Unicorns are modelled as arrival rates: up 0.5 per year (bear) to up 3 per year (bull), for roughly 10 to 23 cumulative by 2030 with 15 as the base.</p>
          <Figure n={4} data={r3fig4 as FigureData} />
          <p>Concentration and the gender gap are forecast as scenario ranges because their series are short and trendless. Big Four concentration (82% of 2025 funding) eases to about 75% in the base case, de concentration must be earned by the francophone corridor and DFI frontier mandates, while the bear case sees flight to safety pushing it toward 88%. The female CEO funding share (2.0% to 2.2% in 2024 and 2025) reaches only about 3.5% by 2030 in the base case; nothing in the record justifies predicting organic improvement and the bull case (about 7%) explicitly requires deliberate gender lens vehicles at scale. Sector wise, cleantech holds the top capital spot in the base case (it took number 1 in 2025 and supplied 2026&apos;s largest round), fintech retains leadership in revenue and unicorn production and AI remains a wildcard attracting attention but not yet capital at scale.</p>

          <h3 className="sub">4.5 Validation checks 3 and 4: external benchmarks and sanity tests</h3>
          <p>The widely quoted $62 to $94 billion projections for 2030 fail the arithmetic test that this report&apos;s scenarios pass. The compound annual growth each 2030 target requires from the 2025 base of $3.2 billion is revealing. The Tony Blair Institute&apos;s business as usual ($62B) and improved policy ($94B) projections require up 81% and up 97% per year sustained for five years; history&apos;s best sustained stretch was about up 28% (off a base fifty times smaller) and the post boom market grows at up 8%. This report&apos;s bear, base and bull targets require down 6%, up 11% and up 28% respectively, all within historical experience. The $62 to $94B figures are best read as aspirational policy targets, not forecasts.</p>
          <Figure n={5} data={r3fig5 as FigureData} />
          <p>Two structural sanity checks support the base to bull range without supporting the moonshot. First, global share: a $5.5 billion Africa against a global venture market of roughly $350 to $450 billion implies about 1.4% of global VC by 2030, versus roughly 1% today, a modest, credible share gain for a continent holding 18% of world population. Second, the Southeast Asia analogue: SEA went from about $1 billion (2015) to $8 to $12 billion (2021 and 2022) before resetting to $4 to $8 billion; the base case puts Africa in 2030 where SEA sat around 2019 and 2020, consistent with the roughly seven year lag observed on every other metric (unicorns, exits, debt). Demand side projections, GSMA&apos;s mobile economy path to $290 billion of GDP contribution by 2030 and fintech revenue projections of $47 to $65 billion, argue against the bear case persisting, but the capital market plumbing (the deal count canary) could deliver it anyway.</p>

          <h2 className="sec"><span className="num">05</span>Discussion</h2>
          <p>The master table condenses the trilogy&apos;s forward view into one page. Table 1 lists every variable with its latest actual and its 2030 bear, base and bull values, with the method noted. Read as a whole, it describes an ecosystem whose composition keeps maturing faster than its size: even in the bear case, exits keep rising and debt remains structural; even in the bull case, funding stays around 2% to 3% of global VC.</p>
          <div className="tblwrap">
            <p className="tblcap">Table 1: Master forecast, every tracked variable, latest actual to 2030 scenarios.</p>
            <table>
              <thead><tr><th>Variable</th><th className="num">Latest actual</th><th className="num">Bear (25%)</th><th className="num">Base (50%)</th><th className="num">Bull (25%)</th><th>Method</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Total funding ($B/yr)</td><td className="num">3.2 to 4.1</td><td className="num b-bear">about 2.3</td><td className="num b-base">about 5.5</td><td className="num b-bull">about 11</td><td>Monte Carlo + scenarios</td></tr>
                <tr><td className="metric-col">Deals of $100K+ (per yr)</td><td className="num">506</td><td className="num b-bear">about 310</td><td className="num b-base">about 580</td><td className="num b-bull">about 950</td><td>Run rate + scenarios</td></tr>
                <tr><td className="metric-col">Debt share of funding</td><td className="num">40%</td><td className="num b-bear">25 to 30%</td><td className="num b-base">35 to 40%</td><td className="num b-bull">40 to 48%</td><td>Plateau logic</td></tr>
                <tr><td className="metric-col">Exits / M&amp;A (per yr)</td><td className="num">67</td><td className="num b-bear">about 75</td><td className="num b-base">about 175</td><td className="num b-bull">about 250</td><td>Damped up 15% per yr</td></tr>
                <tr><td className="metric-col">Cumulative unicorns</td><td className="num">8</td><td className="num b-bear">about 10</td><td className="num b-base">about 15</td><td className="num b-bull">about 23</td><td>Arrival rate scenarios</td></tr>
                <tr><td className="metric-col">Big Four funding share</td><td className="num">82%</td><td className="num b-bear">about 88%</td><td className="num b-base">about 75%</td><td className="num b-bull">about 68%</td><td>Scenario logic (sticky)</td></tr>
                <tr><td className="metric-col">Female CEO funding share</td><td className="num">2.2%</td><td className="num b-bear">about 2%</td><td className="num b-base">about 3.5%</td><td className="num b-bull">about 7%</td><td>Scenario logic</td></tr>
                <tr><td className="metric-col">Top sector by capital</td><td className="num">Cleantech</td><td className="num b-bear">Fintech</td><td className="num b-base">Cleantech</td><td className="num b-bull">Fintech + AI</td><td>Qualitative</td></tr>
              </tbody>
            </table>
          </div>
          <p>Three conclusions carry the interpretive weight. First, the ecosystem&apos;s engine is rotating from funding to liquidity: an Africa producing 150 to 200 exits a year by 2030, two thirds bought by African acquirers, solves from the inside the deepest pathology of the 2014 dataset (a 1% exit rate), the flywheel Report 1 said was missing is now the most predictable part of the forecast. Second, the 2030 risk sits at the bottom of the ladder, not the top: the deal count contraction is Report 1&apos;s missing middle resurfacing one rung lower and if it persists to 2028 it guarantees the bear case with a lag. Third, the binding constraints are now identifiable, financial and monitorable (global rates, FX regimes, domestic institutional capital, IPO absence), which is why this report ends with a dashboard rather than a prophecy.</p>
          <p>A monitoring dashboard turns the forecast into a living tool. Table 2 lists the six leading indicators that will announce which scenario is unfolding, with the bear and bull signals for each. Investors should re score this table quarterly; the companion notebook re runs the full simulation in minutes as new data arrives.</p>
          <div className="tblwrap">
            <p className="tblcap">Table 2: Leading indicators to monitor, 2026 to 2030.</p>
            <table>
              <thead><tr><th>Indicator</th><th>Bear signal</th><th>Bull signal</th><th>Where to check</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Deals $100K+, rolling 12m</td><td className="b-bear">under 350</td><td className="b-bull">over 550</td><td>Africa: The Big Deal (monthly)</td></tr>
                <tr><td className="metric-col">First African unicorn IPO</td><td className="b-bear">Delayed past 2028</td><td className="b-bull">OPay or peer lists by 2027</td><td>Financial press</td></tr>
                <tr><td className="metric-col">Debt share of funding</td><td className="b-bear">over 50% (credit drift)</td><td className="b-bull">Stable 35 to 45%</td><td>Partech annual report</td></tr>
                <tr><td className="metric-col">Foreign acquirer share of exits</td><td className="b-bear">Rebounds above 50%</td><td className="b-bull">At or below about 35%</td><td>TechCabal Insights</td></tr>
                <tr><td className="metric-col">Nigeria funding, year on year</td><td className="b-bear">Third straight negative year</td><td className="b-bull">Macro stabilisation rebound</td><td>Partech / Big Deal</td></tr>
                <tr><td className="metric-col">US policy rate path</td><td className="b-bear">Higher for longer</td><td className="b-bull">Sustained easing</td><td>US Federal Reserve</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="sec"><span className="num">06</span>Recommendations</h2>
          <ol className="recs">
            <li><b>Position for the base case; insure against the bear; keep optionality on the bull.</b><p>Build portfolios that work at $5.5 billion of annual market funding (disciplined entry prices, follow on reserves, revenue quality companies), stress test them at $2.3 billion (runway to 2028, debt lines secured early) and hold instruments that capture a bull repricing (secondaries, pre IPO exposure to the unicorn class).</p></li>
            <li><b>Be counter cyclical at seed, now.</b><p>The deal count contraction means the least competition and the greatest structural impact per dollar sit at the earliest stage. A seed vehicle deployed in 2026 and 2027 buys the exact pipeline the 2029 and 2030 Series A market will lack.</p></li>
            <li><b>Build credit skill or partner for it.</b><p>With debt structurally at 35% to 40% of the market, funds without credit underwriting capability are locked out of nearly half the opportunity and mispriced credit is the likeliest source of the ecosystem&apos;s next scandal.</p></li>
            <li><b>Treat the exit market as an asset class of its own.</b><p>Consolidation at 100 to 200 deals a year creates systematic opportunities: roll up strategies, secondary purchases from 2016 to 2021 vintage funds needing DPI and advisory positioning around the unicorns&apos; acquisition programmes.</p></li>
            <li><b>Fund the gender gap deliberately.</b><p>The base case leaves female led startups at about 3.5% of funding; only purpose built vehicles change that line and they buy the least competed deal flow on the continent while doing so.</p></li>
          </ol>

          <h2 className="sec"><span className="num">07</span>Limitations</h2>
          <ul className="limits">
            <li>Eleven observations cannot be modelled into certainty and the wide bands are themselves the finding. The bootstrap assumes 2019 to 2025 growth dynamics persist; a structural break, an African AI boom, a continental debt crisis, invalidates the bands in either direction.</li>
            <li>The series splices two trackers (levels before and after 2019 are not perfectly comparable), all amounts are nominal USD, scenario probabilities are judgmental and the component forecasts for unicorns, gender and concentration rest on very short series and are presented as transparent scenario logic rather than statistical estimates.</li>
            <li>Anyone selling a precise 2030 number is extrapolating; this report&apos;s honesty about uncertainty is what makes its central numbers usable.</li>
          </ul>

          <h2 className="sec"><span className="num">08</span>Conclusion</h2>
          <p className="lede">So what does 2030 look like? A market twice today&apos;s size, producing its own buyers, its own credit and, finally, its own liquidity. The trilogy began with 194 companies and a broken ladder; it ends with a validated projection of a $5.5 billion annual market with 175 exits a year and 15 unicorns by 2030. The moonshot numbers in circulation do not survive validation and they are not needed: an African venture market that doubles while installing exits, credit and local capital is a better investment environment than one that quintuples on imported liquidity and collapses again. The continent is heading somewhere unglamorous and valuable, toward a functioning capital market. Investors who understand that trajectory and monitor the six indicators that could bend it are the ones the 2030 retrospective will call early.</p>

          <h2 className="sec"><span className="num">A</span>Annexure A: Model specifications</h2>
          <p><b>Backtest.</b> Candidates: log linear OLS on log(funding); damped CAGR (last value grown at half the 2015 to 2022 geometric mean rate); naive last value. Training window 2015 to 2022; test window 2023 to 2025; metric: mean absolute percentage error (MAPE). Results: 357% / 167% / 70% respectively.</p>
          <p><b>Monte Carlo bootstrap.</b> 10,000 paths of five years; each year&apos;s growth drawn with replacement from observed log growth rates (mature era: 2020 to 2025 observations); start value $3.2B (2025 actual); fixed random seed 42. Reported percentiles for 2030 (mature regime): p10 about $1.0B, p25 about $1.9B, p50 about $4.3B, p75 about $10.1B, p90 about $23.1B.</p>
          <p><b>Nowcast.</b> FY2026 estimated as H1 2026 actual ($1.44B) times one plus 2025&apos;s H2 to H1 ratio (about 1.25), giving about $3.2B; this value falls at the 50th percentile of the model&apos;s simulated 2026 distribution.</p>

          <h2 className="sec"><span className="num">B</span>Annexure B: Scenario assumptions</h2>
          <div className="tblwrap">
            <table>
              <thead><tr><th>Scenario</th><th className="num">Probability</th><th>Macro assumptions</th><th>Ecosystem assumptions</th></tr></thead>
              <tbody>
                <tr><td className="metric-col b-bear">Bear</td><td className="num">25%</td><td>Tight global liquidity; recurring FX crises; risk off toward frontier markets</td><td>Early stage pipeline keeps shrinking; local capital fails to scale; foreign acquirers retreat further</td></tr>
                <tr><td className="metric-col b-base">Base</td><td className="num">50%</td><td>Gradual global easing; FX stabilisation in key markets</td><td>Debt rail stable at 35% to 40%; exits compound about 15% per yr; slow local capital growth; francophone corridor matures</td></tr>
                <tr><td className="metric-col b-bull">Bull</td><td className="num">25%</td><td>Sustained global easing; EM risk appetite returns</td><td>IPO unlock (OPay class listings); pension fund allocations open; AfCFTA driven regional scale ups</td></tr>
              </tbody>
            </table>
          </div>

          <div className="series">
            <Link href="/publications/broken-ladder-2014-baseline"><div className="k">Report 1 of 3</div><div className="t">The Broken Ladder: a global baseline diagnosis, evidence to 2014 →</div></Link>
            <Link href="/publications/frontier-to-market-2014-2026"><div className="k">Report 2 of 3</div><div className="t">From Frontier to Market: how funding transformed between 2014 and 2026 →</div></Link>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <h4>References</h4>
          <ol>
            <li>Africa: The Big Deal, H1 2026: Amounts hold, deal count suffers. <a href="https://thebigdeal.substack.com/p/h12026b" target="_blank" rel="noopener">thebigdeal.substack.com</a></li>
            <li>TechCabal, $1.44 billion raised in the first half of 2026. <a href="https://techcabal.com/2026/07/03/1-44-billion-raised-in-the-first-half-of-2026/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>Startup.Africa, African startup funding hits $1.4B in H1 2026 as June sparks recovery. <a href="https://www.startup.africa/african-startup-funding-hits-1-4-billion-in-h1-2026-as-june-sparks-recovery/" target="_blank" rel="noopener">startup.africa</a></li>
            <li>Tekedia, African startups raise nearly $1.4 billion in H1 2026. <a href="https://www.tekedia.com/african-startups-raise-nearly-1-4-billion-in-h1-2026-as-june-funding-surge-reverses-slow-start/" target="_blank" rel="noopener">tekedia.com</a></li>
            <li>bne IntelliNews, Mega deals, debt financing and M&amp;A drive African startup funding to $1.44bn in H1 2026. <a href="https://www.intellinews.com/mega-deals-debt-financing-and-manda-drive-african-startup-funding-to-1-44bn-in-h1-2026-452305/" target="_blank" rel="noopener">intellinews.com</a></li>
            <li>TechCabal Insights, Over $700M raised in Q1 2026. <a href="https://insights.techcabal.com/over-700m-raised-in-q1-2026/" target="_blank" rel="noopener">insights.techcabal.com</a></li>
            <li>Tony Blair Institute, Supercharging Africa&apos;s Startups ($62B and $94B 2030 projections). <a href="https://institute.global/insights/tech-and-digitalisation/supercharging-africas-startups-continents-path-tech-excellence" target="_blank" rel="noopener">institute.global</a></li>
            <li>African Development Bank, Catch Me If You Can: On Drivers of Venture Capital Investment in Africa. <a href="https://www.afdb.org/sites/default/files/documents/publications/wps_no364_catch_me_if_you_can_on_drivers_of_venture_capital_investment_in_africa_repaired.pdf" target="_blank" rel="noopener">afdb.org</a></li>
            <li>GSMA, The Mobile Economy Africa 2026. <a href="https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-economy/africa/" target="_blank" rel="noopener">gsma.com</a></li>
            <li>McKinsey, Fintech in Africa: the end of the beginning. <a href="https://www.mckinsey.com/industries/financial-services/our-insights/fintech-in-africa-the-end-of-the-beginning" target="_blank" rel="noopener">mckinsey.com</a></li>
            <li>McKinsey, Redefining success: a new playbook for African fintech leaders. <a href="https://www.mckinsey.com/industries/financial-services/our-insights/redefining-success-a-new-playbook-for-african-fintech-leaders" target="_blank" rel="noopener">mckinsey.com</a></li>
            <li>Partech, 2025 Africa Tech VC Report (historical series and 2025 actuals). <a href="https://partechpartners.com/news/2025-partech-africa-tech-vc-report-african-tech-funding-rebounds-to-us41b-driven-by-record-debt-activity-and-disciplined-equity-growth" target="_blank" rel="noopener">partechpartners.com</a></li>
            <li>Crunchbase News, global venture funding reports. <a href="https://news.crunchbase.com/venture/" target="_blank" rel="noopener">news.crunchbase.com</a></li>
            <li>Semafor, The African venture capital moment. <a href="https://www.semafor.com/article/03/02/2026/the-african-venture-capital-moment" target="_blank" rel="noopener">semafor.com</a></li>
            <li>Companion notebook: African_Startups_Forecast_2026_2030.ipynb (M. Omega, 2026), full reproducible simulations.</li>
          </ol>
          <p className="ethics"><b style={{ color: 'var(--cream)' }}>Annexure C: Data protection and ethics.</b> This report processes aggregate market statistics only. No personally identifiable information was collected, processed or stored. All inputs are published market aggregates from the sources credited in the References; companies are discussed as corporate entities. The approach is consistent with the Kenya Data Protection Act (2019) and EU GDPR principles. Forecasts concern markets, not individuals and no automated decision making affecting natural persons is performed.</p>
          <Link className="backlink" href="/publications">← Back to all publications</Link>
        </div>
      </footer>
    </>
  )
}
