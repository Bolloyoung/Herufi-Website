import Link from 'next/link'
import Figure from '@/components/charts/Figure'
import type { FigureData } from '@/components/charts/types'
import r5fig1 from '@/data/charts/r5_fig1.json'
import r5fig2 from '@/data/charts/r5_fig2.json'
import r5fig3 from '@/data/charts/r5_fig3.json'
import r5fig4 from '@/data/charts/r5_fig4.json'
import r5fig5 from '@/data/charts/r5_fig5.json'
import r5fig6 from '@/data/charts/r5_fig6.json'
import r5fig7 from '@/data/charts/r5_fig7.json'
import r5fig8 from '@/data/charts/r5_fig8.json'
import r5fig9 from '@/data/charts/r5_fig9.json'

export default function FillingTheMissingMiddle2026() {
  return (
    <>
      <header className="hero">
        <div className="wrap">
          <div className="topbar">
            <span className="brand">Herufi</span>
            <Link href="/publications">All publications →</Link>
          </div>
          <p className="eyebrow">African Startup Investment Series · Report 5</p>
          <h1>Filling the Missing Middle</h1>
          <p className="sub">Return math for Africa&apos;s Series A and B gap. Four financing mechanisms already operating on the continent, priced instrument by instrument, and sized against the gap they would have to close.</p>
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
            <p>Four reports into this series, one bottleneck has refused to move. The 2014 baseline found a 5.1% seed to Series A conversion rate. The 2014 to 2026 comparison found no structural improvement. The 2026 to 2030 forecast flagged a thinning seed pipeline as the era&apos;s biggest risk. Report 4 mapped the fund landscape and found the $2M to $10M Series A band empty of capital by design rather than by accident. Every one of those reports measured the gap. None asked the harder question this report takes on: what specifically could fill it, and what does the return math for each option actually look like.</p>
            <p>Four mechanisms qualify, because all four already operate somewhere on the continent, backed by named and currently active vehicles. Venture debt supplies non dilutive credit against revenue or assets. Revenue based financing supplies capital repaid as a capped share of revenue. Blended and first loss capital supplies a junior tranche that absorbs early losses so that senior capital can enter. Syndication vehicles aggregate many small cheques into one round sized cheque. This report builds the return math for each one: the lender or investor return, the cost to the company, the dilution avoided and, where the mechanism works at portfolio rather than company level, the leverage it generates.</p>
            <p>Section 4.7 combines all four into a single blended $5M Series A round. Section 4.9 sizes what each mechanism could realistically mobilise by 2030 against the gap. The honest headline: no single mechanism closes this gap alone. Blended capital and a scaled venture debt market together could plausibly reach $250M to $550M a year against an illustrative $300M to $750M gap. Revenue based financing, the one instrument with an obvious fit to African fintech&apos;s revenue profile, has essentially no dedicated capital behind it, which makes it the clearest open lane of the four.</p>
          </div>

          <div className="stats">
            <div className="stat"><div className="v">$300M to $750M</div><div className="l">Illustrative unmet annual Series A financing demand</div></div>
            <div className="stat gold"><div className="v">27%</div><div className="l">Venture debt lender return when a facility is repaid on schedule, against a 15% headline coupon</div></div>
            <div className="stat dark"><div className="v">11.4% to 6.3%</div><div className="l">Senior loss probability, before and after a junior tranche of 15% of the pool</div></div>
            <div className="stat"><div className="v">$0</div><div className="l">Capital in dedicated African revenue based financing vehicles at scale today</div></div>
          </div>

          <h2 className="sec"><span className="num">01</span>Introduction and background</h2>
          <p>This report grew out of one structuring conversation. Designing a debt facility to plug a working capital gap that a pure equity term sheet could not reach forces a specific question into the open: what does this instrument actually cost, for the lender and for the company, once fees and warrants and default risk are priced rather than assumed away. Most writing on blended finance in Africa asserts that it helps. Very little of it shows the arithmetic. This report shows the arithmetic.</p>
          <p><Link href="/publications/broken-ladder-2014-baseline">The Broken Ladder</Link> diagnosed a 2014 baseline in which African startups were funded fast but almost never funded twice. <Link href="/publications/frontier-to-market-2014-2026">From Frontier to Market</Link> measured what changed by 2026. <Link href="/publications/continent-heading-2026-2030">Where the Continent Is Heading</Link> built scenarios to 2030. <Link href="/publications/writing-the-cheques-2026">Who Is Actually Writing the Cheques</Link> mapped the capital supply layer and built a portfolio model on top of it. This report is the narrowest of the five and the most practical: it takes the gap those four established as given, and prices the instruments that could close it.</p>

          <h2 className="sec"><span className="num">02</span>Objectives and research questions</h2>
          <p>Four objectives. First, restate the Series A gap precisely enough to serve as a model input rather than a conclusion. Second, build the return math for each of the four fill mechanisms, calibrated to real terms and named vehicles active in Africa today. Third, combine the four into one blended capital stack for a representative Series A round and compute the founder&apos;s true cost. Fourth, size what each mechanism could realistically contribute against the gap by 2030, and say plainly which of them the evidence favours.</p>

          <h2 className="sec"><span className="num">03</span>Data and methodology</h2>
          <h3 className="sub">3.1 Sources and calibration</h3>
          <p>Each mechanism model is calibrated to published terms rather than to invented assumptions. Venture debt terms come from LumiBrief, Techpoint Africa and Venture Debt Hub, cross checked against named African facilities. Revenue based financing terms come from re-cap.com and Qubit Capital, since no African vehicle publishes terms at scale. Blended finance leverage ratios come from GuarantCo&apos;s reporting on the African Guarantee Fund and from MIGA&apos;s 2025 mobilisation figures. Syndication economics come from AngelList&apos;s published Future Africa syndicate terms and from VC4Africa. Every figure is cited at first use and the complete list appears in the footer references.</p>
          <h3 className="sub">3.2 The models</h3>
          <p>Four models run in Python. The venture debt model solves the lender&apos;s internal rate of return across a full repayment path and a default path, then blends the two by a stated default probability. The revenue based financing model runs a monthly repayment schedule until the cap binds and solves the investor&apos;s annualised return. The first loss model simulates a pool of Series A stage companies 30,000 times and splits the proceeds between a junior and a senior tranche. The syndication model computes aggregation counts and carry drag arithmetically. All four figures in Sections 4.2 through 4.5 come from an independent re run of these models for this publication, not from transcribed notebook output. Annexure A specifies every parameter.</p>
          <h3 className="sub">3.3 Data protection and ethics</h3>
          <p>The analysis processes no personal data. All figures are aggregated, publicly disclosed instrument, fund or market level information. No personally identifiable information about founders, lenders or fund principals was collected, processed or stored. A full statement appears in Annexure B.</p>

          <h2 className="sec"><span className="num">04</span>Findings and analysis</h2>

          <h3 className="sub">4.1 The gap, quantified one more time</h3>
          <p>Three numbers from the earlier reports set up everything that follows. The 2022 seed cohort converted to Series A at 4.2%, down from 12.7% for the 2019 cohort, over a timeline that stretched from about eighteen months to twenty nine. The median Africa focused fund holds $30M to $60M and clusters at sub $500K seed cheques or $20M plus growth cheques, leaving the $2M to $10M band visibly thin inside a $15B dry powder landscape. Africa recorded roughly 500 to 530 disclosed deals at or above $100K in 2025, while seed rounds specifically fell from over 100 in 2022 to 42 in 2025.</p>
          <p>Chaining those together gives a dollar figure. If roughly 40 to 50 companies a year reach genuine Series A readiness but only 4% to 7% of a seed cohort converts, then somewhere near 100 to 150 companies a year sit in the unfunded but fundable zone. At a typical $3M to $5M Series A cheque, that implies unmet annual demand on the order of $300M to $750M, concentrated at exactly one stage and equal to a meaningful fraction of the continent&apos;s entire 2025 funding total.</p>
          <Figure n={1} data={r5fig1 as FigureData} />
          <p className="note">A note on precision. This chain compounds several approximations from Report 4 and should be read as an order of magnitude, not a number to underwrite against. It is presented here because every sizing exercise in Section 4.9 needs a denominator, and an explicit, checkable estimate serves that purpose better than an unstated one.</p>

          <h3 className="sub">4.2 Why these four mechanisms</h3>
          <p>The selection criterion is deliberately narrow: each mechanism must already exist in Africa, operated by a named vehicle, as of 2026. This is not a theoretical menu.</p>
          <div className="tblwrap">
            <p className="tblcap">Table 1: The four fill mechanisms, their active African vehicles and what each one requires to work.</p>
            <table>
              <thead><tr><th>Mechanism</th><th>Active African examples, 2024 to 2026</th><th>What it needs to work</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Venture debt</td><td>Cauris Finance ($40M fintech debt facility, Dec 2024), Lendable, Verdant Capital</td><td>Predictable revenue or hard collateral such as assets or a loan book</td></tr>
                <tr><td className="metric-col">Revenue based financing</td><td>Nascent. No dedicated African vehicle at scale; modelled here on global terms</td><td>Recurring revenue, ideally above $500K ARR with high predictability</td></tr>
                <tr><td className="metric-col">Blended and first loss capital</td><td>I&amp;P Growth Stage Fund (€7M junior tranche from FISEA and EU EFSD+), Catalyst Fund ($30M, junior tranche from FASA), African Guarantee Fund</td><td>A patient, loss tolerant capital source willing to sit junior to commercial capital</td></tr>
                <tr><td className="metric-col">Syndication vehicles</td><td>Future Africa (AngelList syndicate), iHub, VC4Africa</td><td>A large enough angel or diaspora base and a credible lead investor</td></tr>
              </tbody>
            </table>
          </div>
          <p>All four models share one company outcome engine, the same power law distribution Report 4 used for its fund simulator. Holding that constant keeps every mechanism comparable on one footing.</p>
          <Figure n={2} data={r5fig2 as FigureData} />

          <h3 className="sub">4.3 Mechanism one, venture debt</h3>
          <p>African venture debt runs at 12% to 18% interest, well above the 8% to 12% typical in developed markets, and that spread prices currency and regulatory risk. On top of the coupon sit upfront fees of 1% to 2%, end of term success fees of 3% to 6% and warrant coverage of roughly 0.5% to 2% of company equity. Facilities typically run two to four years, often interest only for the first six to twelve months. This is the instrument behind the 2025 and 2026 asset backed debt wave: Spiro, MNT-Halan, valU, SolarAfrica and MAX all borrowed at scale because their businesses own things that can secure a loan. Cauris Finance&apos;s $40M facility for African fintechs and its $5M senior secured term loan refinancing Lendable&apos;s position in Uganda&apos;s Numida are two current examples operating at Series A adjacent scale.</p>
          <p>Pricing the whole structure rather than the headline coupon changes the picture substantially. On a $1 loan at a 15% coupon over three years with a 1.5% upfront fee, a 4% success fee and 1% warrant coverage, a lender repaid on schedule earns 27%, not 15%. Fees and the warrant kicker, not the interest rate, account for most of the difference. Weighting that against a default path where the company fails to refinance at maturity and returns half the principal, at a 15% default probability the lender&apos;s expected return lands at 23%.</p>
          <Figure n={3} data={r5fig3 as FigureData} />
          <p>The sensitivity curve carries the more interesting finding. The structure only stops paying at an assumed default rate of 83%, far beyond anything a real African venture debt book experiences. The 50% recovery assumption, not the coupon, provides most of the lender&apos;s downside protection, which is precisely why the instrument concentrates among borrowers with hard assets or a collectable loan book.</p>
          <p>The founder faces the mirror image of the same structure. Debt costs far less equity than a priced round: warrant coverage of 0.5% to 2% is a rounding error next to the 15% to 25% a Series A would take. But the lender&apos;s 23% to 27% expected return is a fixed obligation regardless of how the business performs, while equity only pays out on success. Repayment usually falls due whether or not the next round materialises. Debt fits companies with the revenue predictability or collateral to service that obligation, and fits pre revenue or volatile revenue companies badly, which is exactly the asset backed pattern already visible in who borrows today.</p>

          <h3 className="sub">4.4 Mechanism two, revenue based financing</h3>
          <p>The structure is simple. An investor advances capital and takes a fixed percentage of monthly revenue until a repayment cap, a fixed multiple of the advance, is reached. Global terms cluster at a cap of 1.2x to 1.5x and a revenue share of 5% to 15% a month. Industry guidance is explicit about fit: below roughly $500K in annual recurring revenue, or with revenue predictability under about 70%, the instrument does not work for either side.</p>
          <p>One mechanic drives everything. Because the total payout is capped, faster revenue growth means the cap binds sooner, which raises the investor&apos;s annualised return even though the absolute multiple never changes. Running a $1 advance at 8% of monthly revenue against a 1.4x cap across three growth paths makes the trade off concrete.</p>
          <Figure n={4} data={r5fig4 as FigureData} />
          <p>A slow growing company takes the full sixty month horizon and still repays only 70% of the cap, leaving the investor slightly below breakeven. A moderately growing company clears the cap in fifty one months at 13.9% annualised. A fast growing company clears it in thirty six months and hands the investor 18.8%. Read from the company&apos;s side, that ranking inverts: revenue based financing is cheapest, in annualised terms, for steady and predictable businesses, and most expensive for the fastest growing ones. A fast growing company can end up paying an effective annualised cost comparable to venture debt for a fixed 1.4x multiple, regardless of how much value the capital helped create.</p>
          <p>That inversion probably explains why the instrument has not taken root in Africa. The continent&apos;s standout companies are disproportionately the fast growing kind, and they are precisely the profile for whom revenue based financing is the least favourable use of capital. The instrument suits the large, unglamorous middle of predictable revenue businesses, which is a segment almost no African capital provider currently serves.</p>

          <h3 className="sub">4.5 Mechanism three, blended and first loss capital</h3>
          <p>This mechanism has the clearest precedent at scale. MIGA&apos;s guarantee capacity mobilised $8.40 of private investment per $1 of capacity in 2025, against $3.20 for concessional loans. Closer to venture, the African Guarantee Fund turned $4M of its own capital into $45M of guarantee capacity through a second loss re guarantee facility with GuarantCo, roughly 11x leverage, and targets $500M by 2028 to unlock a further $5B in SME financing. At the Series A and B stage directly, I&amp;P&apos;s Growth Stage Fund uses a €7M junior catalytic tranche from FISEA to unlock capital for 15 to 20 SME investments across West Africa and Madagascar, and the Catalyst Fund&apos;s climate adaptation vehicle uses a $5M junior tranche from FASA to de risk a $30M pool.</p>
          <p>Modelling this means simulating a pool of 20 Series A stage companies 30,000 times, splitting the proceeds between a junior tranche that absorbs losses first and a senior tranche capped at a 1.08x preferred claim, then varying the junior tranche size.</p>
          <Figure n={5} data={r5fig5 as FigureData} />
          <p>At the leverage ratios AGF and MIGA actually report, roughly 8x to 11x senior capital per junior dollar, the model puts senior loss probability near 10%. That is a plausible match to how these programmes describe themselves. They do not promise senior investors zero risk. They promise a meaningfully de risked position, and the model reproduces exactly that.</p>
          <Figure n={6} data={r5fig6 as FigureData} />
          <p>The comparison across discrete tranche sizes states the value proposition in one line. A junior tranche worth 15% of the pool cuts senior loss probability from 11.4% to 6.3%, roughly half, for a first loss commitment of one dollar in seven. That is the risk transformation Report 4 identified as the missing precondition for local institutional capital: Kenyan and Nigerian pension funds hold enormous headroom against their private equity caps, and their constraint is a risk mandate, not money. A senior tranche sitting behind a junior cushion is a structure a pension trustee can actually approve.</p>
          <p>The junior side is not charity, and the model is clear about that too. Junior capital sits behind the senior claim and keeps everything above it, so its median outcome is high and its own loss probability is the price of that position. Development finance institutions taking junior positions are buying mobilisation, not making grants.</p>

          <h3 className="sub">4.6 Mechanism four, syndication vehicles</h3>
          <p>Future Africa&apos;s AngelList syndicate writes a standard $50,000 cheque for 1% to 10% equity with pro rata rights, aggregating capital from individual backers behind a single lead. The firm reports its portfolio has grown eightfold to $12M in assets under management at a 51.6% internal rate of return since 2014, with early money into Andela, Flutterwave, 54Gene, Kobo360 and Lori Systems. iHub&apos;s syndicate writes $20,000 to $250,000 per deal across a roughly 1,000 investor network. The economics are standard: a syndicate lead typically takes about 20% carry on profit, the platform adds roughly 5%, and there is no management fee because capital deploys deal by deal rather than into a blind pool.</p>
          <Figure n={7} data={r5fig7 as FigureData} />
          <p>The arithmetic sets the boundary of what syndication can do. Filling a $5M round at Future Africa&apos;s $50,000 standard cheque takes 100 backers. At iHub&apos;s low end it takes 250. The cost of that aggregation is roughly a quarter of the upside, so a 5x company returns 4.0x to a backer and a 10x returns 7.75x, plus real coordination overhead in the form of a cap table with a hundred line items instead of five.</p>
          <p>Syndication creates no new capital. It manufactures a round sized cheque out of capital that had no path into the round at all, since a $40,000 angel cheque cannot enter a $5M round on its own. Africa&apos;s organised angel base deployed just $4.4M in 2025 across 5,000 or so angels and 75 or more networks, and that number is the ceiling on what aggregation can currently reach. For a company with a genuine diaspora or local angel network but no access to a dedicated Series A fund, this is a real bridge. It is not a substitute for the capital this series has spent five reports showing is missing.</p>

          <h3 className="sub">4.7 The blended capital stack: filling a $5M Series A</h3>
          <p>No single mechanism fills the gap alone, and in practice well structured rounds increasingly blend two or three. Taking a representative $5M Series A for an asset light, recurring revenue fintech and splitting it across all four instruments, with each slice priced directly from the models above, produces a stack that can be checked rather than asserted.</p>
          <Figure n={8} data={r5fig8 as FigureData} />
          <p>The weighted average cost of capital across the stack comes to 9.7%, and the founder gives up 25.8% of the company in total, against roughly 25% for the same $5M raised as pure equity at a comparable valuation. That result deserves a blunt reading: blending is not automatically a dilution discount. The two figures are close. What the blend actually buys is a cost structure where a market rate is paid only on the slice of the round that needs it, and a round whose risk is distributed across capital providers with genuinely different return requirements. That is closer to how growth stage rounds are structured globally, and closer to what Africa&apos;s Series A and B stage needs more of.</p>

          <h3 className="sub">4.8 Which mechanism fits which company</h3>
          <p>Fit depends on business model, not ambition. The maturity column matters as much as the fit column, because a mechanism that suits a company perfectly is useless if no vehicle in Africa offers it.</p>
          <div className="tblwrap">
            <p className="tblcap">Table 2: Mechanism fit by company profile, with current African maturity.</p>
            <table>
              <thead><tr><th>Company profile</th><th>Best fit mechanism</th><th>African maturity</th><th>Why</th></tr></thead>
              <tbody>
                <tr><td className="metric-col">Asset heavy: solar, e mobility, POS hardware</td><td>Venture debt</td><td className="num hl">High</td><td>Hard collateral directly supports loan security</td></tr>
                <tr><td className="metric-col">Lending fintech and BNPL</td><td>Venture debt or revenue based financing</td><td className="num hl">High</td><td>The loan book is itself the collateral or the revenue stream</td></tr>
                <tr><td className="metric-col">Subscription software and recurring fee platforms</td><td>Revenue based financing</td><td className="num">Low</td><td>Predictable monthly revenue fits the mechanics, but no African vehicle offers it at scale</td></tr>
                <tr><td className="metric-col">Early stage, pre revenue, high uncertainty</td><td>First loss backed equity, or syndication</td><td className="num">Medium</td><td>Needs loss tolerant or diversified capital, not fixed obligation instruments</td></tr>
                <tr><td className="metric-col">Strong local or diaspora network, thin institutional access</td><td>Syndication</td><td className="num hl">Medium to high</td><td>Aggregates capital that has no other path into the round</td></tr>
              </tbody>
            </table>
          </div>
          <p>The maturity gap is uneven, and that unevenness is itself a finding. Venture debt and first loss structures are the most developed of the four, each with multiple named vehicles operating at real scale. Syndication is moderately developed and constrained mainly by the small absolute size of Africa&apos;s organised angel base. Revenue based financing is the least mature by a wide margin. No Africa dedicated vehicle operates at scale, despite the continent hosting exactly the predictable revenue fintech and subscription businesses the instrument was built for.</p>

          <h3 className="sub">4.9 Sizing what each mechanism could contribute by 2030</h3>
          <p>Combining Section 4.1&apos;s $300M to $750M annual gap with what each mechanism could plausibly mobilise, anchored on the real vehicles and ratios cited above, produces the report&apos;s summary judgement.</p>
          <Figure n={9} data={r5fig9 as FigureData} />
          <p>Debt already accounts for 41% of all 2025 African funding, roughly $1.64B, so a modest reallocation toward Series A stage borrowers makes $150M to $300M a year plausible at current growth. Blended and first loss capital could unlock $100M to $250M a year of senior capital if two or three more vehicles reach the scale AGF already operates at. Syndication stays structurally small, under $50M a year, unless Africa&apos;s organised angel base grows by an order of magnitude. Revenue based financing contributes nothing today, because nothing exists to contribute.</p>
          <p>Together the two most mature mechanisms could plausibly mobilise $250M to $550M a year by 2030 against an illustrative $300M to $750M gap. That is meaningful and it is not a clean solve, and it depends on vehicles that do not yet exist reaching scale on a timeline nobody controls.</p>

          <h2 className="sec"><span className="num">05</span>The playbook</h2>
          <p>What follows is what the return math above supports, for a founder structuring a Series A or B round and for an investor or development finance institution deciding where to place catalytic capital against this specific gap.</p>
          <h3 className="sub">For founders</h3>
          <ol className="recs">
            <li><b>Match the instrument to the balance sheet, not the ambition.</b><p>Sections 4.3 and 4.4 both show fixed obligations. Debt and revenue based financing fit companies with hard assets or predictable recurring revenue and punish pre revenue or volatile revenue companies regardless of how good the story is. Where the fit is real, blending $1M to $2M of debt or revenue based financing into a round saves meaningful dilution at a lower total cost than most founders assume once fees and warrants are priced.</p></li>
            <li><b>Run the numbers before assuming a blend is cheaper.</b><p>Section 4.7&apos;s stack diluted the founder by roughly the same amount as a pure equity raise. The genuine win was distributing the round across providers with different risk appetites, not a guaranteed discount. Any founder told a blend automatically saves equity should ask to see the arithmetic.</p></li>
            <li><b>Price the whole debt structure, not the coupon.</b><p>Section 4.3 shows a 15% headline coupon costing 27% all in once fees and warrants land. That is the number to compare against an equity round, and it is the number a term sheet will not present in one place.</p></li>
            <li><b>Treat a real angel or diaspora network as a legitimate bridge.</b><p>Syndication converts otherwise unreachable $20,000 to $50,000 cheques into round filling capital at a bounded cost of about 25% of the upside. It is not a substitute for a dedicated Series A investor, and for a company that cannot yet clear that bar it is a genuinely available option.</p></li>
          </ol>
          <h3 className="sub">For investors, development finance institutions and fund managers</h3>
          <ol className="recs">
            <li><b>Put catalytic dollars into first loss positions first.</b><p>Section 4.5 shows a junior tranche of 10% to 15% of a pool cutting senior loss probability by roughly half, cross checked against the mobilisation ratios AGF and MIGA already report. Of the four mechanisms modelled here, this is the highest leverage use of scarce catalytic capital, and it is the one that unlocks the local pension capital Report 4 identified as the largest untapped pool on the continent.</p></li>
            <li><b>Revenue based financing is the open lane.</b><p>Section 4.8 found no dedicated African vehicle at scale despite an obvious fit to the continent&apos;s recurring revenue fintech base. A first mover here competes with nobody, which is not true of the crowded blind seed and growth equity segments this series has already flagged as saturated.</p></li>
            <li><b>Price venture debt default risk by sector, not by continent.</b><p>Section 4.3&apos;s sensitivity curve shows how much lender returns depend on the assumed default rate. That rate should differ between an asset backed lending book and unsecured recurring revenue credit, rather than being applied as one continent wide number.</p></li>
            <li><b>Treat syndication as a complement, not a strategy.</b><p>Section 4.6 shows it extending reach into diaspora and local angel capital usefully. Section 4.9 shows it cannot move the dollar sized gap on its own while the organised angel base sits near $4.4M a year.</p></li>
          </ol>
          <p className="lede">Read alongside Report 4&apos;s playbook, the picture is consistent. The missing middle is not missing for lack of an idea about how to fill it. Every mechanism in this report already exists and already works on its own terms. It is missing because none of the four has been deployed at the scale the gap actually requires.</p>

          <h2 className="sec"><span className="num">06</span>Limitations</h2>
          <ul className="limits">
            <li>All four mechanisms are calibrated on global or general market terms applied to an African context, not on an African deal level dataset, because no public dataset of comparable depth exists for any of these instruments. Every specific number in this report, including the 23% to 27% lender return, the $300M to $750M gap and the blended stack&apos;s dilution figure, is illustrative of magnitude and direction rather than a precise forecast for any real transaction.</li>
            <li>The venture debt and first loss models both reuse the Correlation Ventures power law distribution from Report 4. That distribution is US and global, used because no African equivalent of comparable size exists, and every conclusion drawn from it inherits that limitation.</li>
            <li>Default and recovery rates in Section 4.3, and the junior tranche calibration in Section 4.5, are stated judgement calls rather than fitted parameters. The sensitivity charts exist precisely so a reader can substitute different assumptions and watch the conclusions move.</li>
            <li>Section 4.1&apos;s gap sizing compounds several approximations from Report 4. Section 4.9&apos;s mobilisation estimates are judgement based scaling from named vehicles, not forecasts. Both should be read as orders of magnitude.</li>
          </ul>

          <h2 className="sec"><span className="num">07</span>Conclusion</h2>
          <p className="lede">Five reports in, the diagnosis has not changed and the prescription is finally specific. African startups do not fail to reach Series A because the instruments to fund them have not been invented. Venture debt already runs at scale on the continent. First loss structures already mobilise ten dollars for every one committed. Syndicates already assemble round sized cheques from angel capital that had no other route in. Only revenue based financing is genuinely absent, and its absence is an opportunity rather than an obstacle. What the arithmetic in this report shows is that each mechanism has a shape, a cost and a boundary, and that matching a company to the right one is a technical exercise rather than an act of faith. The gap will close when enough capital providers do that exercise honestly and then deploy at the scale the numbers call for. That is a solvable problem, which is more than could be said of it five reports ago.</p>

          <h2 className="sec"><span className="num">A</span>Annexure A: Model specification</h2>
          <p><b>Venture debt.</b> A $1 principal at a 15% annual coupon over a three year term, interest only with bullet repayment at maturity, a 1.5% upfront fee netted off the amount funded, a 4% end of term success fee and 1% warrant coverage on a $20M entry valuation exiting at a 3x multiple. The default path pays interest until maturity and returns 50% of principal. Expected return blends the two paths at a stated default probability, and the breakeven default rate is solved directly on the blended cash flow schedule.</p>
          <p><b>Revenue based financing.</b> A $1 advance against a 1.4x repayment cap, an 8% monthly revenue share, an opening monthly revenue of $0.15 and a sixty month maximum horizon. Revenue compounds at the scenario&apos;s monthly growth rate, which is 1%, 3% and 6% a month for the slow, moderate and fast paths. The investor&apos;s monthly internal rate of return is solved on the resulting schedule and annualised.</p>
          <p><b>Blended and first loss.</b> A pool of 20 companies at a $1 cheque each, 30,000 simulations, company outcomes drawn from the Correlation Ventures distribution: 0.2x at probability 0.65, 2.5x at 0.24, 7.0x at 0.07, 22.0x at 0.036 and 75.0x at 0.004. The senior tranche holds a 1.08x preferred claim on pool proceeds and the junior tranche takes the residual, so the junior absorbs losses first and keeps the upside above the senior claim. Random seed 42.</p>
          <p><b>Syndication.</b> Backer counts are the round size divided by the average cheque. Carry drag applies a combined 25% carry, 20% to the lead and 5% to the platform, to profit only, leaving principal untouched.</p>
          <p><b>Reproduction.</b> All four models are re implemented in the site&apos;s chart pipeline and re run independently for this publication, so every figure reflects a reproduced run rather than a transcription of the source notebook&apos;s printed output.</p>

          <h2 className="sec"><span className="num">B</span>Annexure B: Data protection and ethics</h2>
          <p>This report processes aggregated, publicly disclosed instrument, fund and market level information only. No personally identifiable information about founders, limited partners, lenders or fund principals was collected, processed or stored. The analysis is consistent with the data minimisation and lawful processing principles of the Kenya Data Protection Act (2019) and the EU General Data Protection Regulation. No automated decision making affecting individuals is performed; model outputs concern instruments and capital structures, not persons.</p>

          <div className="series">
            <Link href="/publications/writing-the-cheques-2026"><div className="k">Report 4 of the series</div><div className="t">Who Is Actually Writing the Cheques: the capital supply layer and portfolio construction →</div></Link>
            <Link href="/publications/broken-ladder-2014-baseline"><div className="k">Report 1 of the series</div><div className="t">The Broken Ladder: a global baseline diagnosis of African startup investment →</div></Link>
          </div>
        </div>
      </main>

      <footer>
        <div className="wrap">
          <h4>References</h4>
          <ol>
            <li>LumiBrief, the rise of venture debt in African startups. <a href="https://www.lumibrief.com/p/the-rise-of-venture-debt-in-african" target="_blank" rel="noopener">lumibrief.com</a></li>
            <li>Techpoint Africa, what are venture debt and warrants (Dec 2024). <a href="https://techpoint.africa/2024/12/27/what-are-venture-debt-and-warrants/" target="_blank" rel="noopener">techpoint.africa</a></li>
            <li>Venture Debt Hub, venture debt benchmarks (2026). <a href="https://www.venturedebthub.com/post/venture-debt-benchmarks" target="_blank" rel="noopener">venturedebthub.com</a></li>
            <li>WeeTracker, Cauris Finance secures $40M debt facility for African fintechs (Dec 2024). <a href="https://weetracker.com/2024/12/12/africa-cauris-finance-secures-40m-debt-facility/" target="_blank" rel="noopener">weetracker.com</a></li>
            <li>Launch Base Africa, Cauris Finance lands $40M to fund Africa&apos;s fintech ecosystem (Dec 2024). <a href="https://launchbaseafrica.com/2024/12/04/cauris-finance-lands-40m-to-fund-africas-fintech-ecosystem/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>Semafor, African tech companies are normalizing debt as a capital source (Jan 2026). <a href="https://www.semafor.com/article/01/30/2026/african-tech-companies-are-normalizing-debt-as-a-capital-source" target="_blank" rel="noopener">semafor.com</a></li>
            <li>Newtown Partners, credit but make it venture: rethinking debt in Africa. <a href="https://www.newtownpartners.com/credit-but-make-it-venture-how-were-rethinking-debt-in-africa/" target="_blank" rel="noopener">newtownpartners.com</a></li>
            <li>re-cap.com, revenue based financing terms, cost and guide (2026). <a href="https://www.re-cap.com/financing-instruments/revenue-based-financing" target="_blank" rel="noopener">re-cap.com</a></li>
            <li>Qubit Capital, revenue based financing: flexible business loans and lenders explained. <a href="https://qubit.capital/blog/revenue-based-financing" target="_blank" rel="noopener">qubit.capital</a></li>
            <li>Sustainability Atlas, trend watch: blended finance and catalytic capital in 2026. <a href="https://sustainableatlas.org/post/trend-watch-blended-finance-catalytic-capital-in-2026-signals-winners-and-red-fl-2561" target="_blank" rel="noopener">sustainableatlas.org</a></li>
            <li>GuarantCo, African Guarantee Fund portfolio. <a href="https://guarantco.com/our-portfolio/african-guarantee-fund/" target="_blank" rel="noopener">guarantco.com</a></li>
            <li>TechBuild Africa, I&amp;P&apos;s Growth Stage Fund €41M first close. <a href="https://techbuild.africa/africas-growth-stage-capital-investisseurs-e41m/" target="_blank" rel="noopener">techbuild.africa</a></li>
            <li>Launch Base Africa, Catalyst Fund raises $30M in second close for its African climate adaptation vehicle (Jul 2026). <a href="https://launchbaseafrica.com/2026/07/02/catalyst-fund-raises-30-million-in-second-close-for-african-climate-adaptation-vehicle/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>PR Newswire, FSD Africa Investments and Allied Climate Partners commit $50M in catalytic capital to anchor ATAF. <a href="https://www.prnewswire.com/news-releases/fsd-africa-investments-and-allied-climate-partners-commit-50-million-in-catalytic-capital-to-anchor-the-african-transition-acceleration-fund-ataf-302711835.html" target="_blank" rel="noopener">prnewswire.com</a></li>
            <li>UNCDF, scaling up mobilization and impact of private investments in Africa. <a href="https://www.uncdf.org/article/8966/ticad-9-scaling-up-mobilization-and-impact-of-private-investments-in-africa" target="_blank" rel="noopener">uncdf.org</a></li>
            <li>AngelList, invest with Future Africa&apos;s syndicate. <a href="https://venture.angellist.com/future-africa/syndicate" target="_blank" rel="noopener">angellist.com</a></li>
            <li>TechCrunch, Nigerian founders turned investors are now running syndicate funds. <a href="https://techcrunch.com/2021/03/02/nigerian-founders-turn-investors-are-now-running-syndicate-funds/" target="_blank" rel="noopener">techcrunch.com</a></li>
            <li>The Condia, 11 investors shaping Africa&apos;s startup ecosystem in 2026. <a href="https://thecondia.com/investors-african-startup-ecosystem/" target="_blank" rel="noopener">thecondia.com</a></li>
            <li>VC4A, syndicate investments with VC4Africa. <a href="https://vc4a.com/investor-syndicate/" target="_blank" rel="noopener">vc4a.com</a></li>
            <li>Correlation Ventures data, as summarised by Nicola Wealth, the power law in venture capital. <a href="https://nicolawealth.com/insights/the-power-law-in-venture-capital" target="_blank" rel="noopener">nicolawealth.com</a></li>
            <li>Partech, 2025 Africa Tech VC Report, via Tech In Africa and The Condia (seed to Series A cohort conversion). <a href="https://thecondia.com/what-changed-raising-series-a-africa/" target="_blank" rel="noopener">thecondia.com</a></li>
            <li>Launch Base Africa, $15bn in dry powder and the structural trends defining Africa&apos;s new wave of tech funds (Mar 2026). <a href="https://launchbaseafrica.com/2026/03/18/15bn-in-dry-powder-8-structural-trends-currently-defining-africas-new-wave-of-tech-funds/" target="_blank" rel="noopener">launchbaseafrica.com</a></li>
            <li>Companion notebook: African_Missing_Middle_Fill_Mechanisms.ipynb (M. Omega, 2026), full reproducible analysis and model source.</li>
            <li>Kenya Data Protection Act, 2019 (compliance reference). <a href="http://kenyalaw.org/kl/fileadmin/pdfdownloads/Acts/2019/TheDataProtectionAct__No24of2019.pdf" target="_blank" rel="noopener">kenyalaw.org</a></li>
            <li>EU General Data Protection Regulation (compliance reference). <a href="https://gdpr-info.eu/" target="_blank" rel="noopener">gdpr-info.eu</a></li>
          </ol>
          <p className="ethics"><b style={{ color: 'var(--cream)' }}>Annexure B: Data protection and ethics.</b> This report processes aggregated, publicly disclosed instrument, fund and market level information only. No personally identifiable information about founders, limited partners, lenders or fund principals was collected, processed or stored. The analysis is consistent with the data minimisation and lawful processing principles of the Kenya Data Protection Act (2019) and the EU General Data Protection Regulation. No automated decision making affecting individuals is performed.</p>
          <Link className="backlink" href="/publications">← Back to all publications</Link>
        </div>
      </footer>
    </>
  )
}
