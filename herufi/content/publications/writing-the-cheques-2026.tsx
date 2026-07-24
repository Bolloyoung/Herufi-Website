import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type { FigureData } from '@/components/charts/types'
import r4fig1 from '@/data/charts/r4_fig1.json'
import r4fig2 from '@/data/charts/r4_fig2.json'
import r4fig3 from '@/data/charts/r4_fig3.json'
import r4fig4 from '@/data/charts/r4_fig4.json'
import r4fig5 from '@/data/charts/r4_fig5.json'
import r4fig6 from '@/data/charts/r4_fig6.json'
import r4fig7 from '@/data/charts/r4_fig7.json'
import r4fig8 from '@/data/charts/r4_fig8.json'
import r4fig9 from '@/data/charts/r4_fig9.json'
import r4fig10 from '@/data/charts/r4_fig10.json'
import r4fig11 from '@/data/charts/r4_fig11.json'
import r4fig12 from '@/data/charts/r4_fig12.json'
import r4fig13 from '@/data/charts/r4_fig13.json'

export default function WritingTheCheques2026() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications →</Link>
          </div>
          <p className="eyebrow">African Startup Investment Series · Report 4</p>
          <h1>Who Is Actually Writing the Cheques</h1>
          <p className="sub">African VC&apos;s capital supply layer and portfolio construction. Where the money behind the money comes from in 2026, and how a fund manager or LP should size a portfolio against it.</p>
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
            <p>The first three reports in this series measured what African startup capital does: funding totals, deal counts, exits and concentration at the continent and region level. This report goes one layer deeper, to the supply side. Who actually writes the cheques, how the limited partner base behind African VC is being rebuilt in real time, and, the part meant to be directly useful, how a fund manager or LP should size and construct a portfolio given everything the first three reports established about how African startups actually perform.</p>
            <p>2025 and 2026 have been the most consequential eighteen months this question has had. Development finance institutions, the traditional backbone of African VC, pulled back sharply just as corporate and local capital surged to fill the gap. Fund deployment slowed to a multi year low. And the missing Series A problem this series first surfaced in the 2014 data now has a precise, current number attached to it: a 2022 seed cohort converting at 4.2%, worse than the 2014 baseline and worse than the 2019 cohort&apos;s 12.7%.</p>
            <p>The second half of this report turns that evidence into a tool. A Monte Carlo fund simulator, calibrated to the venture power law and to this series&apos; own graduation data, is built, validated against published fund benchmarks and then used to answer three questions a fund manager actually has to answer: how many initial positions to hold, how hard to double down on graduates, and how those choices perform across bear, base and bull scenarios for 2030. Every external figure in this report is sourced and dated, almost all from the past twelve months. The model&apos;s assumptions are stated explicitly so a reader can substitute their own.</p>
          </div>

          <div className="stats">
            <div className="stat"><div className="v">$107M</div><div className="l">Total 2025 fund manager fundraising, an 87% year on year decline</div></div>
            <div className="stat gold"><div className="v">4.2%</div><div className="l">2022 cohort seed to Series A conversion, versus 12.7% for the 2019 cohort</div></div>
            <div className="stat dark"><div className="v">$15B</div><div className="l">Committed dry powder across Africa focused tech funds, mid 2026</div></div>
            <div className="stat"><div className="v">1.52x</div><div className="l">Median simulated gross MOIC, base case 25 position seed fund</div></div>
          </div>

          <h2 className="sec"><span className="num">01</span>Introduction and background</h2>
          <p>I have sat on the fund facing side of exactly this problem, building investor pipelines, preparing board and LP materials, and working through how a debt facility gets structured to plug a working capital gap a pure equity vehicle cannot reach. This report is the analysis I wish I had assembled in one place when doing that work: the LP landscape, the return math and a model a reader can actually stress test a fund strategy against.</p>
          <p>The first report in this series, <Link href="/publications/broken-ladder-2014-baseline">The Broken Ladder</Link>, diagnosed a 2014 baseline in which African startups were funded fast but almost never funded twice. <Link href="/publications/frontier-to-market-2014-2026">From Frontier to Market</Link> measured what changed by 2026, and <Link href="/publications/continent-heading-2026-2030">Where the Continent Is Heading</Link> built bear, base and bull scenarios to 2030. This report treats those three as the demand side of the market and asks the supply side question they leave open: who funds the funds, and what does the evidence say about how to build a portfolio well.</p>

          <h2 className="sec"><span className="num">02</span>Objectives and research questions</h2>
          <p>Four objectives. First, characterise the 2025 to 2026 shift in who supplies capital to African VC funds, DFIs, corporates, local and pension capital. Second, map the active GP landscape by fund size, cheque size and stage, to identify where capital is structurally thin. Third, update the seed to Series A graduation evidence by cohort year, since that single number drives every reserve and portfolio sizing decision a fund makes. Fourth, build and validate a portfolio construction model that turns all of the above into a decision tool, then use it to test concrete strategy choices against the bear, base and bull scenarios from Report 3.</p>

          <h2 className="sec"><span className="num">03</span>Data and methodology</h2>
          <h3 className="sub">3.1 Sources</h3>
          <p>Sections 4.1 through 4.5 compile figures on LP composition, named GP fund sizes, deployment activity, dry powder and pension fund headroom from press coverage and firm disclosures current as of mid 2026, principally AVCA&apos;s 2025 African Private Capital Activity Report, Launch Base Africa&apos;s fund tracking, TechCabal, TechCrunch and named firm sources. Every figure is cited at first use and the complete source list appears in the footer references. Several named funds and their fundraising status will have moved by the time this is read.</p>
          <h3 className="sub">3.2 The portfolio simulator</h3>
          <p>Sections 4.7 through 4.11 build a Monte Carlo fund simulator in Python (numpy), calibrated to two external datasets: Correlation Ventures&apos; published distribution of roughly 21,000 to 27,000 venture financings from 2004 to 2018 (the return shape) and this series&apos; own seed to Series A cohort data (the graduation probability). The simulator&apos;s code is reproduced in full in Annexure A so every design choice can be checked or substituted. All model figures in this report were generated by an independent re run of that simulator for this publication, not transcribed from an earlier draft.</p>
          <h3 className="sub">3.3 Data protection and ethics</h3>
          <p>The analysis processes no personal data. All figures are aggregated, publicly disclosed, fund or company level information. No personally identifiable information about founders, LPs or fund principals was collected, processed or stored. A full statement appears in Annexure B.</p>

          <h2 className="sec"><span className="num">04</span>Findings and analysis</h2>

          <h3 className="sub">4.1 The 2026 LP earthquake</h3>
          <p>For three decades, development finance institutions such as IFC, British International Investment, Proparco, DEG, the EIB and the African Development Bank were the backbone of startup investing on the continent. In 2025 that backbone shifted faster than at any point in the ecosystem&apos;s history. Comparing the 2022 to 2024 average against 2025 alone: DFI commitments fell from 45% to 27% of LP capital, European VC and DFI commitments fell from 70% to 21%, African corporate commitments rose from 7% to 41% and African or local LP commitments rose from roughly 18% to roughly 25%.</p>
          <Figure n={1} data={r4fig1 as FigureData} />
          <p>Total fund manager fundraising collapsed alongside the mix shift: just $107M closed across six funds in 2025, an 87% year on year decline, and for the first time since 2021 no Africa focused fund reached a $100M final close. Meanwhile roughly 45% of 2025&apos;s final close capital was mobilised locally, the clearest evidence yet of a domestic capital formation trend. One catalytic vehicle is already testing whether this gap can be bridged: the Africa Finance Corporation&apos;s $100M fund for Africa focused tech fund managers has committed its first $40M to Future Africa and LightRock Africa, positioned explicitly to mobilise further co investment rather than substitute for it.</p>

          <h3 className="sub">4.2 Who is actually investing: the GP landscape</h3>
          <p>Names and numbers matter here. An investor deciding where to position a new fund needs to know who else is in the market and where. The table below compiles the most cited active Africa focused GPs as of mid 2026 by fund size, typical cheque and stage focus.</p>
          <div className="tblwrap">
            <p className="tblcap">Table 1: Active Africa focused GPs by fund size, cheque range and stage, mid 2026.</p>
            <table>
              <thead><tr><th>Fund</th><th className="num">Fund size</th><th className="num">Cheque range</th><th>Stage focus</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Partech Africa</td><td className="num hl">$300M</td><td className="num">$0.5M to $20M</td><td>Seed to Series C</td></tr>
                <tr><td className="metric-col">TLcom Capital (TIDE II + TAPSI)</td><td className="num hl">$159M</td><td className="num">$0.1M to $3M</td><td>Pre seed to Series B</td></tr>
                <tr><td className="metric-col">Novastar Ventures (Fund III)</td><td className="num hl">$147M</td><td className="num">$1M to $8M</td><td>Pre A to Series B</td></tr>
                <tr><td className="metric-col">Norrsken22</td><td className="num hl">$205M</td><td className="num">$10M to $60M</td><td>Series A to C, growth</td></tr>
                <tr><td className="metric-col">Founders Factory Africa / 54 Collective</td><td className="num hl">$40M</td><td className="num">$0.15M to $0.25M</td><td>Pre seed and seed</td></tr>
                <tr><td className="metric-col">4DX Ventures</td><td className="num hl">$80M</td><td className="num">$0.3M to $0.5M</td><td>Pre seed to Series A</td></tr>
                <tr><td className="metric-col">Ingressive Capital (Fund II)</td><td className="num hl">$50M</td><td className="num">$0.05M to $0.5M</td><td>Pre seed and seed</td></tr>
                <tr><td className="metric-col">Launch Africa Ventures</td><td className="num hl">$36M</td><td className="num">$0.05M to $0.25M</td><td>Pre seed and seed</td></tr>
                <tr><td className="metric-col">Ventures Platform</td><td className="num hl">$46M</td><td className="num">$0.1M to $1.5M</td><td>Seed to Series A</td></tr>
              </tbody>
            </table>
          </div>
          <Figure n={2} data={r4fig2 as FigureData} />
          <p>Every fund in the table clusters at one of two poles: sub $1M seed cheques or $10M plus growth cheques. The $2M to $10M Series A range is visibly thin. Only Partech, Novastar and Ventures Platform reach into it at all, and each treats it as the top of its range rather than a core focus. This is the same missing middle the 2014 dataset first surfaced, now visible directly in how capital is organised rather than only in how it is deployed.</p>

          <h3 className="sub">4.3 The deployment slowdown: 2025 versus H1 2026</h3>
          <p>Dry powder sitting uninvested is its own signal. Africa based investor deal appearances fell from 295 in full year 2025 to an annualised 235 in H1 2026, a 21% decline, a steeper regional pullback than North America (6%) or Asia (1%), though gentler than Europe&apos;s 35%. Named funds absent from 2026 deal flow include All On, Aruwa Capital, E Squared Investments, ANZA Capital, Knife Capital, Verod-Kepple Africa Ventures and AfricInvest. Funds that stayed active include Partech, FMO, British International Investment, IFC, Norrsken22, Enza Capital and Ventures Platform.</p>
          <Figure n={3} data={r4fig3 as FigureData} />
          <p>Three cited reasons explain why funds went quiet. Many 2020 to 2022 vintage funds are now fully deployed and their successor fundraising has slowed, exactly the fundraising collapse quantified in Section 4.1. Currency volatility in Nigeria and Egypt complicates dollar denominated return modelling, the same foreign exchange lesson Report 2 drew from Nigeria&apos;s 2023 to 2025 slide. And a rising rate environment has pushed some capital toward debt instruments instead of equity. Fintech and clean energy, the two sectors that relied most on broad coalitions of local co investors, saw the steepest pullback.</p>

          <h3 className="sub">4.4 The dry powder puzzle: $15B committed, and where it does not reach</h3>
          <p>A March 2026 survey of the current fund landscape puts total committed capital across Africa focused tech funds at $15B and identifies eight structural trends in how it is organised. Read together, they describe an asset class that has scaled its capital base faster than it has solved its structural gaps.</p>
          <div className="tblwrap">
            <p className="tblcap">Table 2: Eight structural trends in Africa&apos;s $15B tech fund dry powder, March 2026.</p>
            <table>
              <thead><tr><th>Trend</th><th>What it means</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">1. Missing Series A layer</td><td>Capital clusters at sub $500K seed and $20M plus growth; the $2M to $10M range is thin</td></tr>
                <tr><td className="metric-col">2. Climate capital concentration</td><td>30 plus vehicles now carry explicit climate mandates</td></tr>
                <tr><td className="metric-col">3. Capital mandate mismatch</td><td>Median fund $30M to $60M: too small for growth, too diffuse for pure seed</td></tr>
                <tr><td className="metric-col">4. Abidjan&apos;s regional hub growth</td><td>Saviu and Ring Capital establish presence; deployment has not followed yet</td></tr>
                <tr><td className="metric-col">5. Francophone Africa, foreign or state led</td><td>Partech, Saviu and Digital Africa dominate; Morocco ties VC to industrial policy</td></tr>
                <tr><td className="metric-col">6. Thicker debt layer emerging</td><td>Non dilutive vehicles such as the Verdant Capital Hybrid Fund are gaining share</td></tr>
                <tr><td className="metric-col">7. Japanese corporate capital</td><td>Sector focused vehicles such as Uncovered-Monex and Sony Innovation Fund seek market intelligence</td></tr>
                <tr><td className="metric-col">8. Gender lens funding marginal</td><td>Fewer than ten funds carry explicit gender mandates; combined capital under $100M</td></tr>
              </tbody>
            </table>
          </div>
          <Figure n={4} data={r4fig4 as FigureData} />

          <h3 className="sub">4.5 The local capital opportunity: pension fund headroom</h3>
          <p>The most consequential structural number in this report may be the smallest in absolute terms today. Kenya&apos;s pension industry holds roughly KES 2.81 trillion in assets, of which the Retirement Benefits Authority and recent industry reporting put current private equity and venture capital allocation at close to 1%, well under the 10% regulatory cap. Nigeria tells a similar story at larger scale: pension assets are approaching NGN 29.5 trillion, current private equity allocation is reported as barely 1% of net asset value, and regulators raised the private equity allocation cap for pension fund administrators from 5% to 10% (up to 15% for some funds) in a September 2025 regulation. A separate policy change letting the Nigerian diaspora contribute to pensions in foreign currency could channel up to $600M into Nigerian private equity on its own, per reporting on the rule change.</p>
          <Figure n={5} data={r4fig5 as FigureData} />
          <p>Two vehicles already show this can be mobilised at scale. The Kenya Pension Funds Investment Consortium, established in 2020, has pooled $113M from 24 member pension funds. Kuramo Capital&apos;s most recent Africa focused raise drew commitments from both Kenyan and Nigerian pension funds alongside the African Development Bank and Nigeria&apos;s Bank of Industry. This is the structural answer to the DFI retreat in Section 4.1: the headroom to replace foreign development capital with domestic institutional capital exists on paper. The constraint is mobilisation vehicles and risk mandates, not money.</p>
          <p className="note">A note on precision. An earlier version of this pension calculation, drawn from the source notebook behind this report, stated Kenya&apos;s current private equity allocation as both 1.07% and KES 299B of a KES 2.81T total. Those two figures are inconsistent: 1.07% of KES 2.81T is approximately KES 30B, not KES 299B, and KES 299B would in fact be roughly 10.7%, near the regulatory cap itself. The figures in this report use the smaller, arithmetically consistent estimate (approximately 1% allocated, in the range Cytonn Investments&apos; Q1 2026 reporting describes as under 2%), which materially lowers the implied headroom from the source notebook&apos;s original figure. Treat both the Kenya and Nigeria headroom estimates here as order of magnitude, not audited figures.</p>

          <h3 className="sub">4.6 The graduation crisis, updated: seed to Series A by cohort</h3>
          <p>This is the number that ties this report directly back to the rest of the series. The 2014 dataset in Report 1 found a 5.1% seed to Series A conversion rate for African startups, already a third of North America&apos;s 15.6%. Partech&apos;s 2025 Africa Tech VC Report now publishes this by cohort year and the trend is unambiguous: the 2019 cohort converted at 12.7% within about eighteen months, the 2021 cohort at 5.1%, and the 2022 cohort at just 4.2%, taking twenty nine months to get there. The seed to Series A pipeline ratio, seed deals per eventual Series A, also tightened, from 3.8 to 1 in 2022 to 2.2 to 1 in 2024 to 2025. Reporting is explicit this reflects a thinner seed pipeline, not stronger conversion: only 42 seed rounds closed in 2025 versus over 100 in 2022, so a smaller, more selectively funded cohort is converting at a similar or worse rate over a longer timeline.</p>
          <Figure n={6} data={r4fig6 as FigureData} />
          <p>The implication for portfolio construction, developed through the rest of this report, is direct. The graduation probability a fund should underwrite for a 2025 to 2026 vintage African seed investment is closer to 4% to 7% within two years, not the 10% plus investors may still be assuming from 2019 era pattern matching, and the timeline to that outcome has grown by more than half. Both facts change the reserve ratio math.</p>

          <h3 className="sub">4.7 Portfolio construction theory: the power law and what reserves are for</h3>
          <p>Two global facts every VC portfolio model rests on, before anything Africa specific is added. First, venture returns follow a power law, not a normal distribution. Correlation Ventures&apos; analysis of roughly 21,000 to 27,000 venture financings from 2004 to 2018 found that 65% of deals return less than 1x capital, only the top 4% return more than 10x, and just the top 0.4% return more than 50x. Those tail outcomes, not the median deal, are what a fund&apos;s return depends on. Horsley Bridge&apos;s review of roughly 7,000 investments from 1985 to 2014 found the same shape from a different data source: 6% of deals produced 60% of all returns.</p>
          <Figure n={7} data={r4fig7 as FigureData} />
          <p>Second, reserves exist to double down on the signal, not to average down risk. Standard guidance holds that early stage funds reserve 40% to 60% of committable capital for follow on, deployed selectively into the portfolio companies that clear the next round. That selective deployment is the entire mechanism by which a fund captures the power law tail instead of spreading capital evenly across winners and losers alike. A fund that reserves nothing is betting entirely on its initial cheque selection; a fund that reserves too much and holds too few initial positions may not see enough of the tail to hit it at all.</p>

          <h3 className="sub">4.8 Building and validating the Monte Carlo model</h3>
          <p>The model takes a fund&apos;s design choices, size, number of initial positions and reserve ratio, and produces a distribution of fund level outcomes. Design choices, stated explicitly so every one can be substituted: fund size $30M, the reported median for Africa focused vehicles today; fee and expense drag 15% of committed capital, leaving 85% investable; outcome per initial position drawn from the Correlation Ventures calibrated distribution above, a global rather than Africa specific distribution, used because no public Africa specific deal level return dataset of comparable size exists; graduation probability drawn from Section 4.6&apos;s cohort data (4.2% bear, 7% base, 12.7% bull), correlated with a company&apos;s eventual outcome bucket so that reserves capture genuine selection signal rather than a randomly concentrated bet; and a reserve mechanism sized as a fixed follow on multiple of the initial cheque (the industry&apos;s own two for one heuristic) rather than a lump pool, with unspent reserve returning at a conservative 1.0x.</p>
          <p>Base case: 25 initial positions, a 40% reserve share, a two for one follow on multiple and a 7% graduation probability, run for 20,000 simulations. Median simulated gross MOIC 1.52x, mean 1.87x, 17% of simulations lose money and 11% clear 3x or better.</p>
          <Figure n={8} data={r4fig8 as FigureData} />
          <p>The distribution is sharply right skewed exactly as theory predicts, most simulations cluster between 1x and 2x, and it is the top decile, near 3.1x, that approaches the benchmark top quartile funds report, 3x or better TVPI with 25% plus net IRR at year seven or later, according to current Carta, PitchBook and Cambridge Associates fund performance reporting. The median across all funds, not just top quartile ones, sits far lower, typically 1.5x to 1.8x TVPI with 12% to 15% net IRR, which is the right relationship for a fully realised simulated multiple compared against a still maturing, in progress benchmark set. This is not a precise forecast for any real fund. It is a defensible tool for comparing strategies against each other, which is what the rest of this section does.</p>

          <h3 className="sub">4.9 Applying the model: portfolio size and follow on discipline</h3>
          <p>Two questions a fund manager actually has to answer, run through the simulator at the industry standard 40% reserve share: how many initial positions to hold (15 concentrated, 25 standard, 40 spray), and how hard to double down on graduates, the follow on multiple k, where 0 means no follow on at all and 3 means a three for one ratio on top of the initial cheque.</p>
          <Figure n={9} data={r4fig9 as FigureData} />
          <p>Both levers help, but in different ways. More initial positions lowers loss probability sharply, from roughly 31% at fifteen positions to about 12% at forty, simply by buying more tickets against the power law tail. Raising the follow on multiple lifts the median at every portfolio size while barely moving loss probability, because follow on dollars only ever chase companies that already showed graduation signal, so more aggressive doubling down concentrates upside without adding fresh downside. The two levers are complementary, not substitutes: more initial bets manages the risk of missing the tail entirely; a higher follow on multiple raises what a fund captures once it finds it.</p>
          <Figure n={10} data={r4fig10 as FigureData} />
          <p>A companion check answers a related question: does over reserving relative to a realistic graduation rate waste capital? Reserving 80% of a fund when only about 7% of positions will ever graduate leaves most of that capital idle, parked at a 1.0x placeholder because there is nothing left to deploy it into, which drags the median down, not up. A reserve strategy has to be sized to a realistic graduation rate, not to an industry rule of thumb percentage in isolation.</p>

          <h3 className="sub">4.10 Scenario testing: bear, base and bull for 2030</h3>
          <p>Running the base configuration, 25 positions, 40% reserve, two for one follow on, across Report 3&apos;s bear, base and bull graduation probabilities (4.2%, 7% and 12.7%) shows a scenario gap that is real but smaller than intuition suggests.</p>
          <Figure n={11} data={r4fig11 as FigureData} />
          <p>Going from bear to bull graduation odds, a threefold difference, moves the median fund outcome from roughly 1.45x to 1.73x, meaningful but not transformative, because most of a fund&apos;s return still comes from the initial cheque power law tail, not the reserve mechanism alone. This is the model&apos;s most important strategic implication: manager selection at the initial cheque, picking better companies rather than just reserving more capital for whoever survives, is still the dominant lever, exactly as the machine learning finding in Report 1 suggested. Reserves amplify a good initial portfolio. They do not rescue a weak one.</p>

          <h3 className="sub">4.11 Sizing the missing Series A opportunity</h3>
          <p>Section 4.2 showed the $2M to $10M Series A band is the thinnest part of the fund landscape. Section 4.6 showed why: fewer, more selectively funded seed cohorts are still converting at only 4% to 7%. Combining the two: what would a dedicated Series A vehicle, buying into companies that have already graduated from seed rather than blind seed bets, look like in this model? The entry distribution for that specialist configuration is derived formally via Bayes&apos; rule from the graduation data in Section 4.8, not assumed by fiat.</p>
          <Figure n={12} data={r4fig12 as FigureData} />
          <p>Read the magnitude with real caution but treat the direction as the finding. The uplift shown, from a 1.52x median for a standard blind seed fund to a 5.05x median for a fifteen position Series A specialist, with loss probability falling from 17% to under 1%, is driven almost entirely by a stated judgement call about how strongly graduation correlates with quality, not a fitted parameter, since no public dataset splits African deal level returns by prior graduation status. What survives any reasonable version of that assumption is the direction: buying into companies that have already cleared one real market test concentrates a portfolio into a visibly better conditioned outcome distribution, and that segment is exactly what Section 4.2&apos;s landscape map shows almost nobody is positioned to do at scale. If there is one actionable takeaway in this report for a new fund being raised in 2026, this is it, and it echoes the very first lesson the 2014 dataset produced: the constraint was never capital entering the ecosystem. It was capital following through.</p>

          <h3 className="sub">4.12 The gender lens case, quantified</h3>
          <p>Gender lens capital sits under $100M of the $15B dry powder total, under 1%. Layered against demand side numbers: female CEO African startups raised 2.2% of 2025 funding and women only founding teams raised just 0.9%. Named vehicles doing this work at any scale are genuinely rare. Alitheia IDF&apos;s $100M fund is the single largest gender lens private equity fund on the continent. Janngo Capital, led by Fatoumata Bâ, reports 56% of its portfolio companies are women led. First Circle Capital is raising a $25M Africa Fund I targeting pre seed and seed fintech founded or led by women. At the blended finance layer, the G7 backed AFAWA initiative carries a $618M guarantee facility aiming to unlock up to $5B for women led businesses by 2026.</p>
          <Figure n={13} data={r4fig13 as FigureData} />
          <p>This documents a capital allocation gap, not a proven return differential. No African deal level return data split by founder gender exists publicly, and this report will not manufacture a number that does not exist. What the evidence does support is a straightforward under competition argument: when 97% to 98% of capital chases the same pool of male led deal flow, founders outside that pool face measurably less competition for term sheets, in a market where initial cheque selection quality is the dominant driver of fund returns per Section 4.10. For a new entrant fund manager without Partech or TLcom scale brand or deal flow access, this segment is one of the few places left to build a differentiated pipeline rather than compete head on for the same deals as the incumbents.</p>

          <h2 className="sec"><span className="num">05</span>The playbook</h2>
          <p>If I were advising a fund manager raising a $20M to $40M Africa focused vehicle in the second half of 2026, or an LP deciding how to allocate into one, here is what this report&apos;s evidence actually supports.</p>
          <h3 className="sub">For GPs</h3>
          <ol className="recs">
            <li><b>Do not launch another undifferentiated blind seed fund.</b><p>Section 4.2 shows that segment is already crowded and Section 4.6 shows its graduation odds have gotten worse, not better, since 2019. The $2M to $10M post graduation band is genuinely under capitalised and, per Section 4.11, structurally the stronger risk adjusted bet for fresh capital.</p></li>
            <li><b>Size the reserve ratio to a realistic graduation rate, not to the industry&apos;s 40% to 60% rule of thumb alone.</b><p>Section 4.9 shows both directions of this mistake: under reserving forgoes the model&apos;s cleanest lever, while over reserving beyond what actual graduation odds can deploy just parks capital at breakeven.</p></li>
            <li><b>Underwrite graduation odds at 2022 cohort reality, 4% to 7%, not 2019 cohort nostalgia at 12.7%.</b><p>Using stale conversion assumptions in a model like this one is how funds over promise DPI to LPs.</p></li>
            <li><b>Go where the LP money is actually moving.</b><p>Section 4.1&apos;s mix shift is not a footnote. Corporate LPs are now 41% of commitments and local African LPs are approaching 25%. A fundraising strategy built primarily around DFI relationships is fundraising into a shrinking pool; a strategy that can also speak to corporate strategic value or to pension fund mandates is fundraising into a growing one.</p></li>
            <li><b>Treat gender lens positioning as a sourcing edge, not only an impact mandate.</b><p>Section 4.12&apos;s under competition argument holds regardless of a fund&apos;s impact thesis.</p></li>
          </ol>
          <h3 className="sub">For LPs: DFIs, corporates, pension funds and family offices</h3>
          <ol className="recs">
            <li><b>Watch how the catalytic capital model performs in real time.</b><p>The Africa Finance Corporation&apos;s $100M vehicle, positioned explicitly as a catalytic layer meant to mobilise further co investment, is a template other DFIs retreating from direct commitments should study rather than simply cutting back.</p></li>
            <li><b>Pension funds have room before they have exposure.</b><p>Section 4.5&apos;s headroom is large enough that even a cautious, single digit reallocation would materially change the LP mix in Section 4.1, and precedent to copy already exists in the Kenya Pension Funds Investment Consortium and Kuramo&apos;s local pension participation.</p></li>
            <li><b>Ask a GP for its reserve ratio and graduation probability assumption before its pitch deck&apos;s headline IRR.</b><p>Section 4.9 shows how much fund outcomes hinge on both; a headline return assumption is only as credible as the two numbers behind it.</p></li>
          </ol>

          <h2 className="sec"><span className="num">06</span>Limitations</h2>
          <ul className="limits">
            <li>The base return distribution used in the model, Correlation Ventures, is US and global, not Africa specific, since no public deal level African venture return dataset of comparable size exists. Every model number in Sections 4.8 through 4.11 should be read as a relative comparison between strategies, not an absolute return forecast for any real African fund.</li>
            <li>Graduation probability is modelled as correlated with eventual outcome bucket, better companies graduate more often, via a stated judgement call about the strength of that correlation, not a fitted parameter. The Section 4.11 specialist uplift is the number most sensitive to this assumption; its direction is more robust than its exact size.</li>
            <li>Follow on cheques are sized as a fixed multiple of the initial cheque and assumed to earn the same multiple as that company&apos;s initial cheque; real follow on rounds usually price at a step up, so this is a conservative simplification. Fee drag, fund size and check count ranges are stated assumptions, not fitted parameters.</li>
            <li>Figures on LP composition, fund sizes and dry powder are compiled from press coverage and firm disclosures current as of mid 2026 and will move quickly. Pension fund USD equivalent figures in Section 4.5 use approximate July 2026 FX rates, and this report corrected a units inconsistency found in the source calculation, as noted in Section 4.5; treat both country estimates as order of magnitude.</li>
          </ul>

          <h2 className="sec"><span className="num">07</span>Conclusion</h2>
          <p className="lede">The capital supply behind African VC rebuilt itself in 2025 faster than at any point this series has measured, and the evidence on what that capital should fund is more precise than it has ever been. Development finance retreated, corporate and local capital surged to fill the gap, and the graduation math that determines whether a seed cheque is worth writing got harder, not easier, than the 2019 era pattern most reserve ratios still assume. The portfolio model built in this report says the response is not to write fewer cheques out of caution. It is to underwrite graduation honestly, size reserves to match it, and go looking specifically for the post graduation, Series A segment almost nobody in the current landscape is positioned to serve. That constraint, unlike geography, is investable.</p>

          <h2 className="sec"><span className="num">A</span>Annexure A: Model specification</h2>
          <p><b>Simulator.</b> Monte Carlo, numpy, 15,000 to 20,000 simulations per configuration, random seed 42. Fund size $30M, fee and expense drag 15% of committed capital. Initial cheque size equals investable capital times (1 minus reserve share) divided by the number of initial positions. Each initial position draws an outcome multiple from the calibrated distribution: 0.2x with probability 0.65, 2.5x with probability 0.24, 7.0x with probability 0.07, 22.0x with probability 0.036 and 75.0x with probability 0.004 (Correlation Ventures shares, Section 4.7). Each position graduates independently with a probability drawn from an overall graduation rate, scaled per outcome bucket by fixed relative weights of 1, 1.5, 3, 5 and 7 so that better performing buckets graduate more often, a stated assumption rather than a fitted one. Graduating companies receive a follow on cheque equal to a fixed multiple of their initial cheque, funded from a reserve budget that scales down pro rata if realised graduations exceed what the budget can fund at that multiple; unspent reserve returns at 1.0x. Fund level gross MOIC equals total proceeds, initial plus follow on plus unspent reserve, divided by fund size.</p>
          <p><b>Validation.</b> The simulated distribution is checked for the expected right skew shape and benchmarked in level against current Carta, PitchBook and Cambridge Associates fund performance reporting (top quartile funds at 3x plus TVPI and 25% plus net IRR at year seven or later; median fund 1.5x to 1.8x TVPI and 12% to 15% net IRR). The base case simulation places its top decile, not its median, near the top quartile benchmark, the expected relationship between a fully realised simulated multiple and a still maturing reported benchmark.</p>

          <h2 className="sec"><span className="num">B</span>Annexure B: Data protection and ethics</h2>
          <p>This report processes aggregated, publicly disclosed fund, firm and market level information only. No personally identifiable information about founders, limited partners or fund principals was collected, processed or stored. The analysis is consistent with the data minimisation and lawful processing principles of the Kenya Data Protection Act (2019) and the EU General Data Protection Regulation. No automated decision making affecting individuals is performed; model outputs concern funds and portfolio configurations, not persons.</p>

          <div className="series">
            <Link href="/publications/broken-ladder-2014-baseline"><div className="k">Report 1 of the series</div><div className="t">The Broken Ladder: a global baseline diagnosis of African startup investment →</div></Link>
            <Link href="/publications/continent-heading-2026-2030"><div className="k">Report 3 of the series</div><div className="t">Where the Continent Is Heading: validated scenarios for 2026 to 2030 →</div></Link>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <h4>References</h4>
          <ol>
            <li>AVCA, 2025 African Private Capital Activity Report. <a href="https://www.avca.africa/data-intelligence/research-publications/2025-african-private-capital-activity-report/" target="_blank" rel="noopener">avca.africa</a></li>
            <li>TechCabal, DFIs scale back as Africa&apos;s VC fundraising falls to a four year low (Feb 2026). <a href="https://techcabal.com/2026/02/23/development-capital-financed-africas-venture-boom-its-now-slowing/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>TechCabal, AFC commits $100M to Future Africa and LightRock Africa funds (May 2026). <a href="https://techcabal.com/2026/05/18/afc-100-million/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>TechCabal, Novastar Ventures closes $147M fund for African startups (Mar 2026). <a href="https://techcabal.com/2026/03/31/novastar-ventures-closes-147-million-fund-for-african-startups/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>TechCabal, Why Launch Africa is doubling down on early stage startups now (Jul 2026). <a href="https://techcabal.com/2026/07/20/launch-africa-h1-2026/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>TechCrunch, Norrsken22&apos;s debut fund closes at $205M. <a href="https://techcrunch.com/2023/11/02/norrsken22s-debut-fund-closes-at-205m-to-back-growth-stage-startups-in-africa/" target="_blank" rel="noopener">techcrunch.com</a></li>
            <li>TechCrunch, Founders Factory Africa to deploy $114M. <a href="https://techcrunch.com/2023/08/16/founders-factory-africa-to-deploy-114m-using-learnings-from-past-programs/" target="_blank" rel="noopener">techcrunch.com</a></li>
            <li>IFC, invests in new 4DX Ventures fund. <a href="https://www.ifc.org/en/pressroom/2024/ifc-invests-in-new-4dx-ventures-fund-to-support-tech-startups-in-africa" target="_blank" rel="noopener">ifc.org</a></li>
            <li>Launch Base Africa, local VCs are quietly retreating from African startup cap tables (Jun 2026). <a href="https://launchbaseafrica.com/2026/06/03/local-vcs-are-quietly-retreating-from-african-startup-cap-tables/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>Launch Base Africa, $15bn in dry powder, 8 structural trends currently defining Africa&apos;s new wave of tech funds (Mar 2026). <a href="https://launchbaseafrica.com/2026/03/18/15bn-in-dry-powder-8-structural-trends-currently-defining-africas-new-wave-of-tech-funds/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>Oraro and Company Advocates, investment options in private equity and venture capital firms for pension schemes in Kenya. <a href="https://www.oraro.co.ke/a-hand-full-of-aces-investment-options-in-private-equity-and-venture-capital-firms-for-pension-schemes-in-kenya/" target="_blank" rel="noopener">oraro.co.ke</a></li>
            <li>Retirement Benefits Authority, Kenya&apos;s pension assets rise to KSh 2.81 trillion in 2025. <a href="https://www.rba.go.ke/kenyas-pension-assets-rise-to-ksh2-81-trillion-in-2025/" target="_blank" rel="noopener">rba.go.ke</a></li>
            <li>Business Daily Africa, Kenyan pension funds back Kuramo&apos;s Sh64.5bn fundraising. <a href="https://www.businessdailyafrica.com/bd/corporate/companies/kenyan-pension-funds-back-kuramo-s-sh64-5bn-fundraising-5519472" target="_blank" rel="noopener">businessdailyafrica.com</a></li>
            <li>Nairametrics, PenCom raises equity investment limits for RSA funds to ease liquidity pressure (Feb 2026). <a href="https://nairametrics.com/2026/02/10/pencom-raises-equity-investment-limits-for-rsa-funds-to-ease-liquidity-pressure/" target="_blank" rel="noopener">nairametrics.com</a></li>
            <li>The Condia, Nigeria to loosen pension rules, unlock billions for infrastructure and private equity. <a href="https://thecondia.com/nigeria-pension-rules-private-equity/" target="_blank" rel="noopener">thecondia.com</a></li>
            <li>Tech In Africa, African startups are raising bigger rounds but few make it to Series A. <a href="https://www.techinafrica.com/african-startups-are-raising-bigger-rounds-but-few-make-it-to-series-a/" target="_blank" rel="noopener">techinafrica.com</a></li>
            <li>The Condia, what changed about raising a Series A in Africa. <a href="https://thecondia.com/what-changed-raising-series-a-africa/" target="_blank" rel="noopener">thecondia.com</a></li>
            <li>Correlation Ventures data, as summarised by Nicola Wealth, the power law in venture capital. <a href="https://nicolawealth.com/insights/the-power-law-in-venture-capital" target="_blank" rel="noopener">nicolawealth.com</a></li>
            <li>VC Beast, the venture capital power law explained; what is a reserve strategy in VC. <a href="https://vcbeast.com/venture-capital-power-law-explained" target="_blank" rel="noopener">vcbeast.com</a></li>
            <li>MaC Venture Capital (Michael Palank), follow on in venture capital. <a href="https://medium.com/mac-venture-capital/follow-on-in-venture-capital-2a60291c2f13" target="_blank" rel="noopener">medium.com</a></li>
            <li>Carta, Q4 2025 VC Fund Performance, and Value Add VC, VC fund performance 2025 top quartile IRR, TVPI and DPI benchmarks by vintage year. <a href="https://carta.com/data/vc-fund-performance-q4-2025/" target="_blank" rel="noopener">carta.com</a></li>
            <li>TechCabal, Africa&apos;s gender funding gap persists (Sept 2025). <a href="https://techcabal.com/2025/09/16/africas-gender-funding-gap/" target="_blank" rel="noopener">techcabal.com</a></li>
            <li>Fintech News Africa, IFC commits to First Circle Capital&apos;s Africa fintech fund. <a href="https://fintechnews.africa/45306/fintech-uganda/ifc-invests-in-first-circle-capital-africa-fintech/" target="_blank" rel="noopener">fintechnews.africa</a></li>
            <li>Launch Base Africa, meet 30 leading Africa focused VC firms led by female managers. <a href="https://launchbaseafrica.com/2025/10/15/meet-30-leading-africa-focused-vc-firms-led-by-female-managers/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>Companion notebook: African_VC_Investor_Portfolio_Layer.ipynb (M. Omega, 2026), full reproducible analysis and simulator source.</li>
            <li>Kenya Data Protection Act, 2019 (compliance reference). <a href="http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/TheDataProtectionAct__No24of2019.pdf" target="_blank" rel="noopener">kenyalaw.org</a></li>
            <li>EU General Data Protection Regulation (compliance reference). <a href="https://gdpr-info.eu/" target="_blank" rel="noopener">gdpr-info.eu</a></li>
          </ol>
          <p className="ethics"><b style={{ color: 'var(--cream)' }}>Annexure B: Data protection and ethics.</b> This report processes aggregated, publicly disclosed fund and market level information only. No personally identifiable information about founders, limited partners or fund principals was collected, processed or stored. The analysis is consistent with the data minimisation and lawful processing principles of the Kenya Data Protection Act (2019) and the EU General Data Protection Regulation. No automated decision making affecting individuals is performed.</p>
          <Link className="backlink" href="/publications">← Back to all publications</Link>
        </div>
      </footer>
    </>
  )
}
