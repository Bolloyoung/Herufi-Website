import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type { FigureData } from '@/components/charts/types'
import r2fig1 from '@/data/charts/r2_fig1.json'
import r2fig2 from '@/data/charts/r2_fig2.json'
import r2fig3 from '@/data/charts/r2_fig3.json'
import r2fig4 from '@/data/charts/r2_fig4.json'

export default function FrontierToMarket20142026() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications →</Link>
          </div>
          <p className="eyebrow">The African Startup Investment Trilogy · Report 2 of 3</p>
          <h1>From Frontier to Market</h1>
          <p className="sub">How African startup funding transformed between 2014 and 2026. A source linked reality check of the 2014 lessons.</p>
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
            <p>African startups now raise more in a single year than the entire recorded history of the ecosystem up to 2014. This report compares the 2014 baseline established in <Link href="/publications/broken-ladder-2014-baseline">Report 1</Link> (194 companies; $1.68 billion of lifetime funding) against the 2015 to 2026 record published by the credible trackers of African startup funding: Africa: The Big Deal, Partech Africa, Disrupt Africa, AVCA and TechCabal Insights. In 2025 alone the continent raised $3.2 to $4.1 billion (depending on tracker methodology) across roughly 500 deals, survived a 46% funding winter in 2023 and rebounded 25% to 40% in 2025, the only region worldwide where deal activity grew that year.</p>
            <p>The seven 2014 lessons are graded against twelve years of evidence: three materialised, four remain partial. The capital structure lessons were fixed: seed cheques grew past the old $40,000 median and the missing debt rail became a record $1.64 billion market, 40% of all 2025 funding. The institutional lessons remain under construction: exits jumped from two acquisitions ever to a record 67 M&amp;A deals in 2025 (with African buyers now doing two thirds of them), yet there is still no IPO market and the Series A and B missing middle persists. Big Four concentration deepened to 82% of funding.</p>
            <p>Four new realities, invisible in the 2014 data, now define the risk landscape: an extreme and static gender funding gap (female CEO startups received 2.0% to 2.2% of funding in 2024 and 2025); an imported business cycle driven by global interest rates; a sector rotation in which cleantech overtook fintech as the top sector by capital in 2025; and currency risk as a first order variable, where naira devaluation pushed Nigeria, the former growth darling, into decline while Kenya took the number one spot ($1.04 billion, up 72%).</p>
          </div>

          <div className="stats">
            <div className="stat"><div className="v">10x</div><div className="l">One 2025 beats all funding recorded to 2014, twice over</div></div>
            <div className="stat gold"><div className="v">$1.64B</div><div className="l">Debt financing in 2025, now 40% of all funding</div></div>
            <div className="stat dark"><div className="v">67</div><div className="l">Record M&amp;A exits in 2025, two thirds by African buyers</div></div>
            <div className="stat"><div className="v">2%</div><div className="l">Share of funding going to female CEO startups</div></div>
          </div>

          <h2 className="sec"><span className="num">01</span>Introduction and background</h2>
          <p>Report 1 ended with a diagnosis and seven recommendations; this report asks the only question that matters next: what actually happened? A diagnosis made on 2014 data is only useful if tested against the subsequent record. Between 2014 and 2026 the African ecosystem lived through an emergence phase, a global liquidity boom, a brutal correction and a recovery. That period constitutes a natural experiment on the 2014 lessons and this report scores each of them against published evidence, with every figure source linked.</p>
          <p>The comparison also serves a practical investor need: separating structural progress from cyclical noise. Headlines about African tech oscillate between euphoria (record year) and despair (funding collapse). By anchoring on structural metrics, graduation rates, instrument mix, exit counts, concentration, this report shows which changes are durable market plumbing and which are tides that came in with global liquidity and went out with it.</p>

          <h2 className="sec"><span className="num">02</span>Objectives</h2>
          <p>The report pursues three objectives. First, to reconstruct the 2015 to 2025 funding record from primary trackers and reconcile their differing methodologies. Second, to compare today&apos;s ecosystem against the 2014 baseline metric by metric: scale, deal counts, instruments, exits, concentration, sectors, valuations. Third, to grade the seven lessons of Report 1 and identify new structural issues that no 2014 dataset could reveal.</p>

          <h2 className="sec"><span className="num">03</span>Data and methodology</h2>
          <h3 className="sub">3.1 Sources and collection</h3>
          <p>African funding data is published by trackers whose methodologies differ by design and any honest comparison must respect that. Africa: The Big Deal counts equity and debt deals of $100,000 or more (from 2019); Partech Africa counts deals of $200,000 or more, reporting equity and debt separately (from 2015, the longest series); Disrupt Africa counts only disclosed equity (the strictest definition, hence the lowest totals); AVCA reports venture capital deals as an industry association. For 2025 the resulting totals span $3.2B (Big Deal) to $4.1B (Partech, equity plus debt), a spread that reflects measurement, not disagreement about reality.</p>
          <p>Data was collected in July 2026 through a combination of live scraping and hand curation, with every value carrying its source. Where technically possible the publishers&apos; own pages were scraped directly (the Big Deal&apos;s 2025 year in review); all other figures were hand collected from the publishers&apos; reports and articles into source linked tables. The 2014 baseline is recomputed from the cleaned dataset of Report 1. All sources are listed in the References; the companion notebook reproduces every number.</p>
          <h3 className="sub">3.2 Data protection</h3>
          <p>As in Report 1, no personal data is processed. All figures are aggregate market statistics or publicly disclosed company level facts; named individuals appear only as public figure executives already named in cited press coverage. Scraping was limited to single requests against publicly accessible pages with the publisher credited. A full statement appears in Annexure C.</p>

          <h2 className="sec"><span className="num">04</span>Findings and analysis</h2>
          <p>All analysis in this section was designed and conducted by Michael Omega. Modern period figures are drawn from the sources listed in the References; 2014 baseline figures are recomputed from the Report 1 dataset.</p>

          <h3 className="sub">4.1 The twenty year arc</h3>
          <p>One modern year of African startup funding now equals roughly twice everything the 2014 dataset had ever recorded. Three eras join on a logarithmic scale: the discovery era captured by the 2014 snapshot, the emergence years measured by Partech ($277M of equity in 2015 rising to $2.02B by 2019) and the modern period tracked in parallel by multiple publishers. The 2025 total of $3.2 to $4.1B compares with $1.68B of cumulative funding recorded to 2014. Against Disrupt Africa&apos;s ground measurement of 2015 ($186M of disclosed equity), 2025 is roughly seventeen times larger; an order of magnitude of growth is the honest summary.</p>
          <Figure n={1} data={r2fig1 as FigureData} />
          <p>The market also acquired a business cycle, imported, not domestic. The arc shows the 2021 and 2022 boom ($4.3 to $6.5B per year, fed by global zero interest rate capital), the 2023 crash (down 46%), the 2024 trough ($2.2B) and the 2025 recovery (up 25% to 40% year on year). Per AVCA, Africa was the only region worldwide where 2025 deal activity did not decline (up 4%). An ecosystem that absorbs a 46% shock and rebounds within two years is no longer an experiment, but its cycle is set in Washington, not Lagos.</p>

          <h3 className="sub">4.2 Metric by metric: the 2014 baseline versus today</h3>
          <p>The transformation is clearest when each 2014 metric is placed beside its 2025 and 2026 counterpart. Table 1 makes the direct comparison and the four most consequential shifts are the debt rail (4.6% of startups ever using debt in 2014, versus debt composing 40% of 2025 funding value); exits (two acquisitions ever recorded to 2014, versus a record 67 M&amp;A deals in 2025 and 63 in the first half of 2026 alone); concentration (the Big Four&apos;s share of funding rising with deal size, reaching 81% of $10M plus deals); and country totals (Kenya&apos;s $1.04B in 2025 alone exceeding any country&apos;s entire recorded history to 2014).</p>
          <div className="tblwrap">
            <p className="tblcap">Table 1: The 2014 baseline versus the 2025 and 2026 evidence, by metric.</p>
            <table>
              <thead><tr><th>Metric</th><th>2014 baseline</th><th>2025 and 2026 evidence</th><th>Verdict</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Annual funding</td><td className="num">up to $675M/yr</td><td className="num">$3.2 to $4.1B (2025)</td><td className="verdict" style={{ color: 'var(--forest)' }}>Order of magnitude</td></tr>
                <tr><td className="metric-col">Deals per year</td><td className="num">49 newly funded (2014)</td><td className="num">about 500 to 600 (of $100K+)</td><td className="verdict" style={{ color: 'var(--forest)' }}>About 10x more</td></tr>
                <tr><td className="metric-col">Companies worth $1B or more</td><td className="num">0</td><td className="num">8+ unicorns (2026)</td><td className="verdict" style={{ color: 'var(--forest)' }}>New asset class</td></tr>
                <tr><td className="metric-col">Debt financing</td><td className="num">4.6% of startups ever</td><td className="num">$1.64B = 40% of 2025</td><td className="verdict" style={{ color: 'var(--forest)' }}>Transformed</td></tr>
                <tr><td className="metric-col">Exits (M&amp;A)</td><td className="num">2 acquisitions ever (1%)</td><td className="num">67 in 2025; 63 in H1 2026</td><td className="verdict" style={{ color: 'var(--gold)', filter: 'brightness(.8)' }}>Improved, still thin</td></tr>
                <tr><td className="metric-col">Big Four concentration</td><td className="num">66% of firms, ~97% funding</td><td className="num">82% of 2025 funding</td><td className="verdict" style={{ color: '#B4453A' }}>Unchanged or worse</td></tr>
                <tr><td className="metric-col">Top country</td><td className="num">South Africa ($647M)</td><td className="num">Kenya ($1.04B, up 72%)</td><td className="verdict" style={{ color: 'var(--forest)' }}>Leadership rotated</td></tr>
                <tr><td className="metric-col">Dominant sector</td><td className="num">E commerce, mobile, software</td><td className="num">Fintech; cleantech #1 by capital</td><td className="verdict" style={{ color: 'var(--forest)' }}>Web to infrastructure</td></tr>
                <tr><td className="metric-col">Female CEO funding share</td><td className="num">Not measurable</td><td className="num">2.0% (2024), 2.2% (2025)</td><td className="verdict" style={{ color: '#B4453A' }}>Newly visible problem</td></tr>
              </tbody>
            </table>
          </div>
          <Figure n={2} data={r2fig2 as FigureData} />

          <h3 className="sub">4.3 The unicorn generation</h3>
          <p>A class of billion dollar African companies now exists where none did in 2014 and every one of them is financial technology. The eight unicorns as of early 2026, at conservative valuations (sources value Flutterwave anywhere between $3B and $5.2B), are a combined roughly $13.5B, led by Nigerian payments and mobile money companies, with Wave (Senegal), Tyme (South Africa) and MNT Halan (Egypt) broadening the map. The top of the ecosystem has begun generating its own liquidity: Flutterwave acquired Mono in January 2026 and OPay is reported to be preparing a US IPO at a target valuation around $4B.</p>
          <Figure n={3} data={r2fig3 as FigureData} />

          <h3 className="sub">4.4 Grading the seven 2014 lessons</h3>
          <p>The scorecard&apos;s headline: the lessons investors could implement alone were implemented; the lessons requiring coordination were not. Bigger seed cheques (Lesson 1) and the debt rail (Lesson 6) materialised fully, both are capital structure choices individual investors control. Follow on capacity (Lesson 2), hub plus region strategy (Lesson 4), concentrated later bets (Lesson 5) and exits (Lesson 7) are partial, each depends on institutions (Series B funds, acquirers, public markets) that take a generation to build. The Latin American grant trap warning (Lesson 3) was heeded. This pattern precisely matches the Report 1 model&apos;s implication: capital structure is fixable fast; institutions are not.</p>
          <div className="tblwrap">
            <p className="tblcap">Table 2: The seven 2014 lessons graded against the 2015 to 2026 record.</p>
            <table>
              <thead><tr><th className="num">#</th><th>2014 lesson</th><th>2026 verdict</th><th>Key evidence</th></tr></thead>
              <tbody>
                <tr><td className="num">1</td><td className="hl">Write bigger seed cheques</td><td className="verdict" style={{ color: 'var(--forest)' }}>Materialised</td><td>Standard seeds now in the hundreds of thousands; the $100K floor is 2.5x the old median seed</td></tr>
                <tr><td className="num">2</td><td className="hl">Build Series A and B follow on capacity</td><td className="verdict" style={{ color: 'var(--gold)', filter: 'brightness(.8)' }}>Partial, the bottleneck</td><td>Series A investors up 7%, Series B up 29% in 2025; missing middle still most cited gap</td></tr>
                <tr><td className="num">3</td><td className="hl">Avoid the small grant trap</td><td className="verdict" style={{ color: 'var(--forest)' }}>Avoided</td><td>Market moved to real seed, venture and debt instruments</td></tr>
                <tr><td className="num">4</td><td className="hl">Back hubs, think regional</td><td className="verdict" style={{ color: 'var(--gold)', filter: 'brightness(.8)' }}>Half materialised</td><td>Big Four took 82% of 2025 funding; francophone rise (Senegal number 5, Benin number 6)</td></tr>
                <tr><td className="num">5</td><td className="hl">Bigger, later, concentrated bets</td><td className="verdict" style={{ color: 'var(--forest)' }}>Happened, repriced</td><td>2021 and 2022 mega rounds and unicorns; 2025 shows disciplined up 8% equity growth</td></tr>
                <tr><td className="num">6</td><td className="hl">Develop the debt rail</td><td className="verdict" style={{ color: 'var(--forest)' }}>Dramatically done</td><td>$1.64B of debt in 2025 = 40% of funding, record 108 deals</td></tr>
                <tr><td className="num">7</td><td className="hl">Engineer exit paths</td><td className="verdict" style={{ color: 'var(--gold)', filter: 'brightness(.8)' }}>Improving from low</td><td>Record 67 M&amp;A in 2025 (up 72%); foreign acquirer share fell 56% to 33%; no IPO market</td></tr>
              </tbody>
            </table>
          </div>

          <h3 className="sub">4.5 New realities invisible in 2014</h3>
          <p>Four structural issues now shape African venture risk that no 2014 dataset could measure. First, the gender gap: startups led by female CEOs received 2.0% of 2024 funding ($48M) and 2.2% in 2025; only three of the hundred most funded African startups since 2019 have female CEOs. Second, the imported cycle: the boom, winter and recovery pattern tracks global interest rates, not African fundamentals. Third, capital localisation, the one strongly positive new trend: the share of exits bought by foreign acquirers fell from 56% in 2020 to 33% in 2025, meaning African buyers now do two thirds of deals. Fourth, currency risk: Nigeria was the only Big Four market to shrink in 2025 (down 3% on Partech&apos;s count, down 17% on the Big Deal&apos;s) largely on naira devaluation, while cleantech overtook fintech as the top sector by capital raised.</p>
          <Figure n={4} data={r2fig4 as FigureData} />

          <h2 className="sec"><span className="num">05</span>Discussion</h2>
          <p>Composition matured faster than size and composition is what makes a capital market real. The 10x headline growth is less significant than what grew underneath it: a $1.6B debt market that did not exist, an exit market running at record pace with local buyers in the majority, eight unicorns generating acquisitions and IPO pipelines, plus sector rotation from consumer apps toward revenue generating infrastructure. These are the plumbing of a functioning market being installed in real time.</p>
          <p>The bottleneck did not disappear; it moved up the ladder. In 2014 the constraint was seed too small. In 2026 it is growth capital and liquidity too thin. The structure of the problem is identical: capital exists to start the journey but thins out at the next stage, which is why the Report 1 recommendation that aged best (reserve follow on capacity) remains the highest leverage trade today.</p>
          <p>Concentration is the uncomfortable finding for ecosystem builders. The Big Four&apos;s share of funding rose from roughly two thirds of companies (2014) to 82% of capital (2025) and concentration increases with deal size. The counter signal is francophone West Africa: Wave&apos;s Senegal headquarters, Senegal at number 5 and Benin at number 6 in 2025, the first data backed evidence for a next four thesis.</p>

          <h2 className="sec"><span className="num">06</span>Recommendations (2026 update)</h2>
          <ol className="recs">
            <li><b>Fund the missing middle.</b><p>Series A and B remains the scarcest capital layer; the 2014 recommendation stands, now with far better proven pipelines behind it.</p></li>
            <li><b>Ride the debt rail with real credit skills.</b><p>40% of the market is now debt. Asset backed cleantech and lending books require credit underwriting, not venture instinct.</p></li>
            <li><b>Treat foreign exchange as a core underwriting variable.</b><p>Nigeria 2023 to 2025 is the case study: dollar returns on naira revenues repriced an entire country&apos;s deal flow.</p></li>
            <li><b>Build and back local capital pools.</b><p>Pension funds, corporates and family offices dampen the imported cycle and already form the majority of exit buyers.</p></li>
            <li><b>Price the gender gap as an inefficiency.</b><p>At 2% of funding, female led deal flow is the least competed segment on the continent, an equity problem and an alpha opportunity simultaneously.</p></li>
            <li><b>Position for liquidity events.</b><p>Unicorn M&amp;A (Flutterwave and Mono) and IPO pipelines (OPay) will reprice the whole ecosystem; secondary positions and pre IPO exposure are now viable strategies.</p></li>
          </ol>

          <h2 className="sec"><span className="num">07</span>Limitations</h2>
          <ul className="limits">
            <li>Tracker methodologies differ and the report deliberately preserves the spread. 2025 totals range from $3.2B to $4.1B across publishers; single source precision would be false precision.</li>
            <li>The 2014 baseline is a snapshot of lifetime funding, not annual flow, so growth multiples are order of magnitude statements. Unicorn valuations are private market estimates that vary by source; conservative figures are used.</li>
            <li>All amounts are nominal USD. Figures were collected in July 2026 and 2026 statements refer to events reported January to July 2026.</li>
          </ul>

          <h2 className="sec"><span className="num">08</span>Conclusion</h2>
          <p className="lede">So what? The 2014 diagnosis was right, the fixable half got fixed and the investable gap has moved. An investor reading Report 1 in 2014 and acting on its capital structure lessons would have been positioned ahead of the debt boom and the seed size normalisation. The same logic now points one rung higher: the scarce assets of 2026 to 2030 are Series A and B capacity, credit underwriting skill, local capital formation and exit engineering. Report 3 quantifies where those trends lead by 2030, with validated scenarios rather than headlines.</p>

          <h2 className="sec"><span className="num">A</span>Annexure A: Tracker methodology comparison</h2>
          <div className="tblwrap">
            <table>
              <thead><tr><th>Tracker</th><th>Counts</th><th>Threshold</th><th className="num">Series from</th><th className="num">2025 total</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Africa: The Big Deal</td><td>Equity plus debt deals</td><td>$100K or more</td><td className="num">2019</td><td className="num">$3.2B</td></tr>
                <tr><td className="metric-col">Partech Africa</td><td>Equity and debt (separate)</td><td>$200K or more</td><td className="num">2015</td><td className="num">$4.1B (eq + debt)</td></tr>
                <tr><td className="metric-col">Disrupt Africa</td><td>Disclosed equity only</td><td>None</td><td className="num">2015</td><td className="num">strictest</td></tr>
                <tr><td className="metric-col">AVCA</td><td>Venture capital deals</td><td>n/a</td><td className="num">n/a</td><td className="num">$3.9B / 506 deals</td></tr>
                <tr><td className="metric-col">TechCabal Insights</td><td>Equity plus debt</td><td>n/a</td><td className="num">n/a</td><td className="num">$3.42B / 502 deals</td></tr>
              </tbody>
            </table>
          </div>

          <h2 className="sec"><span className="num">B</span>Annexure B: Unicorn register (early 2026)</h2>
          <div className="tblwrap">
            <p className="tblcap">African companies valued at $1 billion or more, conservative valuations.</p>
            <table>
              <thead><tr><th>Company</th><th>HQ / origin</th><th>Sector</th><th className="num">Valuation</th><th className="num">Founded</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Flutterwave</td><td>Nigeria</td><td>Payments</td><td className="num">$3.0B (up to $5.2B)</td><td className="num">2016</td></tr>
                <tr><td className="metric-col">OPay</td><td>Nigeria</td><td>Mobile money</td><td className="num">$2.8B (up to $3.1B)</td><td className="num">2018</td></tr>
                <tr><td className="metric-col">Wave</td><td>Senegal</td><td>Mobile money</td><td className="num">$1.7B</td><td className="num">2018</td></tr>
                <tr><td className="metric-col">Tyme Group</td><td>South Africa</td><td>Digital banking</td><td className="num">$1.5B</td><td className="num">2018</td></tr>
                <tr><td className="metric-col">Andela</td><td>Nigeria / US</td><td>Tech talent</td><td className="num">$1.5B</td><td className="num">2014</td></tr>
                <tr><td className="metric-col">Interswitch</td><td>Nigeria</td><td>Payments</td><td className="num">$1.0B</td><td className="num">2002</td></tr>
                <tr><td className="metric-col">Moniepoint</td><td>Nigeria</td><td>Banking / POS</td><td className="num">$1.0B</td><td className="num">2015</td></tr>
                <tr><td className="metric-col">MNT Halan</td><td>Egypt</td><td>Lending</td><td className="num">$1.0B</td><td className="num">2018</td></tr>
              </tbody>
            </table>
          </div>

          <div className="series">
            <Link href="/publications/broken-ladder-2014-baseline"><div className="k">Report 1 of 3</div><div className="t">The Broken Ladder: a global baseline diagnosis, evidence to 2014 →</div></Link>
            <Link href="/publications/continent-heading-2026-2030"><div className="k">Report 3 of 3</div><div className="t">Where the Continent Is Heading: validated scenarios for 2026 to 2030 →</div></Link>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <h4>References</h4>
          <ol>
            <li>Africa: The Big Deal, 2025 in Review: Mapping the Money. <a href="https://thebigdeal.substack.com/p/2025ir2" target="_blank" rel="noopener">thebigdeal.substack.com</a></li>
            <li>Partech, 2025 Africa Tech VC Report: funding rebounds to US$4.1B. <a href="https://partechpartners.com/news/2025-partech-africa-tech-vc-report-african-tech-funding-rebounds-to-us41b-driven-by-record-debt-activity-and-disciplined-equity-growth" target="_blank" rel="noopener">partechpartners.com</a></li>
            <li>Partech, 2019 annual report: US$2.02B raised in equity funding. <a href="https://partechpartners.com/news/partech-africa-publishes-its-annual-report-african-tech-start-ups-reach-new-symbolic-milestone-us-202-billion-raised-equity-funding-representing-74-yoy-growth" target="_blank" rel="noopener">partechpartners.com</a></li>
            <li>Partech, 2022 Africa Report: $6.5 billion raised in 2022. <a href="https://partechpartners.com/news/presenting-2022-partech-africa-report-resilient-african-tech-ecosystem-still-growing-65-billion-raised-2022" target="_blank" rel="noopener">partechpartners.com</a></li>
            <li>Partech, 2024 Africa Tech VC Report: US$3.2B raised. <a href="https://partechpartners.com/news/2024-partech-africa-tech-vc-report-with-us32b-raised-african-startups-show-resilience-despite-7-drop-in-funding" target="_blank" rel="noopener">partechpartners.com</a></li>
            <li>Disrupt Africa, African Tech Startups Funding Reports. <a href="https://disruptafrica.com/research/" target="_blank" rel="noopener">disruptafrica.com/research</a></li>
            <li>AVCA figures via Punch: African startups raise $3.9bn across 506 deals in 2025. <a href="https://punchng.com/african-startups-raise-3-9bn-across-506-deals/" target="_blank" rel="noopener">punchng.com</a></li>
            <li>Connecting Africa: African startups raised $3.2B in 2025, 40% more than 2024. <a href="https://www.connectingafrica.com/investment/african-startups-raised-3-2b-in-2025-40-more-than-in-2024" target="_blank" rel="noopener">connectingafrica.com</a></li>
            <li>TechCabal Insights: Six things we learned about African tech in 2025. <a href="https://insights.techcabal.com/six-things-we-learned-about-african-tech-in-2025/" target="_blank" rel="noopener">insights.techcabal.com</a></li>
            <li>TechCabal Insights: The State of Startup Exits in Africa in 5 Charts. <a href="https://insights.techcabal.com/the-state-of-startup-exits-in-africa-in-5-charts/" target="_blank" rel="noopener">insights.techcabal.com</a></li>
            <li>Launch Base Africa: 13 Charts From a Decade of African Exits. <a href="https://launchbaseafrica.com/2026/04/20/13-charts-from-a-decade-of-african-exits-and-the-uncomfortable-takeaway/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>TechCrunch: Flutterwave buys Nigeria&apos;s Mono in rare African fintech exit. <a href="https://techcrunch.com/2026/01/05/flutterwave-buys-nigerias-mono-in-rare-african-fintech-exit/" target="_blank" rel="noopener">techcrunch.com</a></li>
            <li>African Business: Africa&apos;s unicorns, valuations, signals and the next generation. <a href="https://african.business/2026/01/innov-africa-deals/africas-unicorns-valuations-signals-and-the-next-generation" target="_blank" rel="noopener">african.business</a></li>
            <li>Fintech Magazine Africa: Female CEOs face record low funding in 2024. <a href="https://fintechmagazine.africa/2025/01/14/africa-start-up-funding-female-ceos-face-record-low-funding-in-2024/" target="_blank" rel="noopener">fintechmagazine.africa</a></li>
            <li>Condia: How Africa&apos;s startup funding shifted from growth to infrastructure in 2025. <a href="https://thecondia.com/africa-startup-funding-2025/" target="_blank" rel="noopener">thecondia.com</a></li>
            <li>Companion notebook: African_Startups_2014_vs_2026_Comparison.ipynb (M. Omega, 2026).</li>
          </ol>
          <p className="ethics"><b style={{ color: 'var(--cream)' }}>Annexure C: Data protection and ethics.</b> This report processes aggregate market statistics and publicly disclosed company information only. No personally identifiable information was collected, processed or stored; individuals are referenced only as public figure executives already named in cited press coverage. Web scraping was limited to single requests against publicly accessible pages, with fair use extracts and full publisher attribution. The approach is consistent with the Kenya Data Protection Act (2019) and EU GDPR principles of lawfulness, data minimisation and purpose limitation.</p>
          <Link className="backlink" href="/publications">← Back to all publications</Link>
        </div>
      </footer>
    </>
  )
}
