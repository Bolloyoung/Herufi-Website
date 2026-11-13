import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import ag_fig1 from '@/data/charts/ag_fig1.json'
import ag_fig2 from '@/data/charts/ag_fig2.json'
import ag_fig3 from '@/data/charts/ag_fig3.json'
import ag_fig4 from '@/data/charts/ag_fig4.json'
import ag_fig5 from '@/data/charts/ag_fig5.json'
import ag_fig6 from '@/data/charts/ag_fig6.json'

export default function WhyBanksTurnDownFarmLoans() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">&larr; Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Why Banks Turn Down Farm Loans They Expect to Be Repaid</h1>
      <p className="summary">Africa&apos;s agricultural finance problem is almost always described as a risk problem. Data covering 32,000 loans says something different. Small farm loans fail because they cost too much to make, not because borrowers fail to pay. That one distinction changes which tools can work.</p>
      <div className="meta"><span>Michael Omega</span><span>28 October 2026</span><span>15 min read</span></div>
      <div className="prose">
        <p>Picture a maize trader. They buy grain from farmers nearby, store it, and sell it to a mill they have dealt with for years. They know which farmers deliver and which ones disappoint. They have an order in hand. The only thing they do not have is the cash to pay the farmers in the weeks before the mill pays them.</p>
        <p>So they go to the bank, and the bank says no. Not because it expects to lose the money. It agrees the loan will probably be repaid. It says no anyway.</p>
        <p>That looks like a mistake, or like prejudice. It is neither. It is arithmetic. And once the arithmetic is visible, a surprising amount of what the development world believes about agricultural finance in Africa stops holding together.</p>
        <p>The bank ran two tests, not one. The first was whether the trader will pay the money back. The second was whether making the loan at all is worth what it costs the bank to make it. Almost everything written about agricultural finance assumes businesses like this fail the first test. The evidence says they usually pass it, and fail the second.</p>
        <p><strong>This article argues that the binding constraint on small farm lending in Africa is the cost of making the loan, not the risk of losing it.</strong> The two sound close enough to be interchangeable. They are not, and the instruments built for one are close to useless against the other. The two articles that follow build on this one. The second asks what kind of money agricultural businesses actually need. The third asks what changes if development money is spent differently.</p>
        <hr />
        <h2>Credit losses barely move across loan sizes. Costs move enormously.</h2>
        <p>Testing a claim like this needs a rare kind of data. You need to know, loan by loan, not only whether borrowers repaid but what each loan earned and what each loan cost the lender to produce. Banks almost never publish that.</p>
        <p>Aceli Africa does. Aceli is a market facility that pays lenders to make agricultural loans they would otherwise skip. As part of that work it publishes a full profit and loss breakdown covering roughly 32,000 agricultural business loans worth about 2 billion dollars, from 41 lenders in Kenya, Rwanda, Tanzania, Uganda and Zambia. As far as I can establish it is the only decomposed loan level dataset of its kind for African agriculture.</p>
        <p>That lets us set two explanations against each other and watch which one the numbers support.</p>
        <p>The risk explanation says small farm loans go bad more often, so lenders avoid them. If that is right, expected losses should climb as loans get smaller. The cost explanation says small farm loans are simply too expensive to produce. If that is right, losses should stay flat while costs climb.</p>
        <p>The numbers are not close.</p>
        <div className="tablewrap"><table><thead><tr>
        <th>Loan size</th>
        <th>Expected credit loss</th>
        <th>Cost of making and managing the loan</th>
        </tr></thead><tbody>
        <tr><td>10,000 to 25,000 dollars</td><td className="num">0.7%</td><td className="num">16.4%</td></tr>
        <tr><td>25,000 to 50,000 dollars</td><td className="num">0.9%</td><td className="num">11.5%</td></tr>
        <tr><td>50,000 to 200,000 dollars</td><td className="num">1.1%</td><td className="num">5.9%</td></tr>
        <tr><td>200,000 to 500,000 dollars</td><td className="num">1.0%</td><td className="num">2.5%</td></tr>
        <tr><td>500,000 to 2 million dollars</td><td className="num">0.8%</td><td className="num">0.9%</td></tr>
        </tbody></table></div>
        <p className="srcnote">All figures are a percentage of the loan, over the life of the loan. Source: Aceli Africa, 2025 Financial Benchmarking Report.</p>
        <p>Read the losses column first, because the entire risk argument rests on it. It runs 0.7, 0.9, 1.1, 1.0, 0.8. It barely moves. It does not even move in the direction the risk story needs, since the largest loans carry slightly more expected loss than the smallest. Across the whole range, expected losses vary by four tenths of a single percentage point.</p>
        <p>Now read the cost column. It runs 16.4, 11.5, 5.9, 2.5, 0.9. Costs vary by 15.5 points, roughly 39 times the variation in losses.</p>
        <BlogFigure data={ag_fig2 as FigureData} />
        <blockquote>Figure 1: Each pair of circles is one loan size band, with circle area showing how much is lent in it.</blockquote>
        <p>The reason is almost dull once stated. Checking a business, visiting the site, writing the credit file and chasing repayment cost roughly the same whether the loan is 15,000 dollars or 1.5 million. The work is fixed. The income is not. A small loan carries the same workload on a fraction of the interest.</p>
        <p>Put money on it. Suppose assessing and managing a loan costs a bank 180,000 shillings in staff time, travel and paperwork. On a 10 million shilling loan that is a rounding error. On a 1 million shilling loan it eats the margin whole. Same work, same cost, one tenth the income.</p>
        <p>A fair objection at this point is that lenders could simply charge more for the small ones. They already do. The smallest loans carry 4.6 percentage points more interest and fees than the largest, which is exactly what you would expect from a market that understands what it is dealing with. The pricing is not the failure. It is still not enough, because for every 1 per cent increase in loan size, cost falls about nine times faster than price does. A lender pricing rationally still cannot catch up.</p>
        <BlogFigure data={ag_fig1 as FigureData} />
        <blockquote>Figure 2: Where the money goes on a loan of 10,000 to 25,000 dollars.</blockquote>
        <p>So the sentence to retire is that agriculture is too risky to lend to in small amounts. The accurate sentence is that agriculture is too expensive to assess in small amounts. They sound alike. They point at completely different solutions.</p>
        <hr />
        <h2>A guarantee covering every shilling of expected loss still leaves the smallest loans under water</h2>
        <p>The standard instrument in development finance is the credit guarantee: a promise by a donor or a development bank to cover some of a lender&apos;s losses when borrowers default. It makes a risky loan safer. It does nothing at all about what the loan costs to produce.</p>
        <p>Follow one loan through. A bank expects to earn 15,000 shillings on it. It expects to lose 1,000 shillings to default. It spends 18,000 shillings finding the borrower, assessing the business and collecting the money. The bank is down 4,000 shillings.</p>
        <p>Now hand it a perfect guarantee. A donor covers the entire 1,000 shilling expected loss, immediately, free, with no paperwork and no argument. The bank is now down 3,000 shillings instead of 4,000. The loan still loses money. The loan still does not get made.</p>
        <p>That is not a thought experiment. Run the same calculation across the real data and the smallest loan band moves from minus 2.2 per cent to minus 1.5 per cent. Still a loss. There is a ceiling on what any guarantee can achieve, and the ceiling is the size of the loss it covers.</p>
        <BlogFigure data={ag_fig3 as FigureData} />
        <blockquote>Figure 3: The bar is what a lender keeps today. The gold diamond is the same loan with every expected shilling of loss covered free.</blockquote>
        <p>The lenders doing this work say the same thing with their behaviour. Aceli offers partner lenders two kinds of support: cover against losses, and payments that defray the cost of finding and assessing borrowers. Ninety per cent of partner lenders report that the cost support changed what they did. Seventy three per cent say that about the loss cover. When people paid to be careful with money tell you which subsidy actually moved them, that is worth more than most survey evidence.</p>
        <p>None of which makes guarantees useless. They work, and they work where the arithmetic says they should. On a 300,000 dollar loan, a full percentage point of recovered loss against a cost base of 2.5 per cent is a meaningful gift, and often enough to tip a marginal credit into a yes. Guarantees also give a nervous credit committee a reason to approve something unfamiliar, which matters more than economists usually allow.</p>
        <p>The claim here is narrower than the one guarantee sceptics usually make. Protecting a bank against losses is one thing. Paying for the work of reaching a borrower is a different thing. Only the second one binds at the bottom of the market.</p>
        <hr />
        <h2>Agriculture is not competing against nothing. It is competing against a government bond.</h2>
        <p>There is a further reason the subsidy has to be larger than people expect, and it has almost nothing to do with farming.</p>
        <p>A bank never chooses between lending to a farm business and leaving the money in a drawer. It chooses between that loan and every other thing it could do with the same shilling. That comparison, not the loan&apos;s own merits, is what decides the outcome.</p>
        <BlogFigure data={ag_fig6 as FigureData} />
        <blockquote>Figure 4: Average returns available to a commercial bank across the five countries studied.</blockquote>
        <p>Lending to farm businesses earned these banks an average of 3.5 per cent. Government bonds paid 16.2 per cent. The bank&apos;s loan book as a whole returned 28.3 per cent. A treasury bond pays more than four times what a farm loan pays and asks nothing in return: no field visits, no harvest, no weather, no chasing a borrower through a bad season. For a treasurer that is not a difficult decision.</p>
        <p>Concessional support helps. It lifts agricultural lending by roughly three percentage points, to around 6.5 per cent. That is real money, and it still leaves the return at well under half of the risk free alternative.</p>
        <p>This carries a consequence that agricultural strategy documents almost never mention. <strong>A high government borrowing rate is an agricultural finance problem.</strong> Every time a government borrows more at higher rates, the gap any subsidy has to close gets wider. A programme designed when treasury bills paid 10 per cent is quietly underpowered when they pay 16, and nobody goes back to rewrite the business case.</p>
        <p>Uganda has been running that experiment in public this year. Its shilling fell from about 3,604 to the dollar in March to nearly 4,500 by late October. On 14 October 2026 the Bank of Uganda raised its policy rate from 9.75 per cent to 12 per cent to defend it. It also raised the share of deposits that banks must hold in reserve, from 11 per cent to 13.5 per cent.</p>
        <p>Read that from a bank treasurer&apos;s desk. Lending to the government just got better paid. Holding deposits just got more expensive, because more of each one has to sit at the central bank earning nothing. Nothing whatsoever changed about the maize trader. The loan they wanted in March is harder to justify in November, and no farming decision caused it.</p>
        <p>That is the uncomfortable part of this chapter of the argument. The subsidy needed to make a small farm loan work is set partly in a room the agricultural sector is not in.</p>
        <hr />
        <h2>The money that buys the harvest is not the money that transforms the farm</h2>
        <p>So far this has been one gap. It is not one gap. Split the need by what the money is actually for and it becomes three different problems with three different prospects.</p>
        <p>A farmer buying fertiliser needs cash for one season. A processor buying maize at harvest needs cash for a few months. A business installing irrigation needs money for years. ISF Advisors estimates that smallholder farmers worldwide need about 323 billion dollars a year and receive about 95 billion. For Africa south of the Sahara the annual need is about 78 billion dollars. Divided by purpose, it looks like this.</p>
        <div className="tablewrap"><table><thead><tr>
        <th>What the money is for</th>
        <th>Supplied</th>
        <th>Needed</th>
        <th>Share met</th>
        </tr></thead><tbody>
        <tr><td>Short term: inputs, crop purchases</td><td className="num">10.0bn</td><td className="num">33.0bn</td><td className="num"><strong>30%</strong></td></tr>
        <tr><td>Long term: irrigation, storage, processing, machinery</td><td className="num">0.1bn</td><td className="num">27.1bn</td><td className="num"><strong>0.4%</strong></td></tr>
        <tr><td>Household needs outside farming</td><td className="num">9.0bn</td><td className="num">18.0bn</td><td className="num"><strong>50%</strong></td></tr>
        </tbody></table></div>
        <p className="srcnote">Source: ISF Advisors, Beyond the Frontier, October 2025.</p>
        <p>One hundred million dollars supplied against twenty seven billion needed. <strong>Long term agricultural finance in Africa south of the Sahara is 99.6 per cent unserved.</strong> That is not a gap. It is an absence.</p>
        <BlogFigure data={ag_fig4 as FigureData} />
        <blockquote>Figure 5: The full need drawn to scale, divided by purpose and then by whether it is supplied.</blockquote>
        <p>Short term lending works better for a reason you can hold in your hand. It repays itself out of the thing it buys. Lend for fertiliser and the harvest pays you back. Lend a crop buyer the money to purchase maize and the sale repays you. Better still, the buyer can deduct the loan from what it pays the farmer next time. The repayment mechanism is built into the transaction.</p>
        <p>Long term lending has no such mechanism. An irrigation system does not produce cash next month. A warehouse takes years to earn back its cost. A tractor pays for itself over many seasons, if the seasons cooperate. The lender has to wait, and most lenders are funded with deposits that cannot wait.</p>
        <p>This should change how we read the much discussed shift from equity toward working capital and trade finance. That shift is sensible, because short term lending is the part of the problem that can actually be solved commercially. It is also incomplete, because the part that is 99.6 per cent unserved is precisely the part that makes farms more productive rather than merely keeping the current season moving. Short term money keeps the season going. Long term money makes the next season better. Africa needs both and is getting one.</p>
        <hr />
        <h2>The biggest lender to African farmers is not a bank</h2>
        <p>If formal lenders supply so little, somebody else is doing the work. Somebody is, and it is the company that buys the crop.</p>
        <p>Think of a firm buying coffee, milk or avocados from thousands of farmers. It hands out seed and fertiliser before planting. It advances cash against the coming harvest. It contracts to buy whatever comes in. None of that is described as lending, and all of it is lending.</p>
        <BlogFigure data={ag_fig5 as FigureData} />
        <blockquote>Figure 6: Annual flow of finance to smallholder farmers worldwide, by the kind of institution supplying it.</blockquote>
        <p>Crop buyers, traders, processors and input suppliers together supply 43 billion dollars a year, which is about 45 per cent of all smallholder finance in the world. Informal lenders and savings groups supply 25 billion. Commercial banks, which hold everybody&apos;s deposits, supply about 2 billion. Venture backed agricultural technology companies supply about 0.9 billion, less than a fortieth of the buyer channel they are frequently described as disrupting.</p>
        <p>Buyers can lend cheaply because they already paid the cost that defeats the bank. The buyer knows how much a farmer delivers, how reliably, and how they performed last season. That history is the credit file, and it arrived free with the trading relationship. The buyer also has a collection mechanism nobody else has, which is the next purchase.</p>
        <p>That reframes a strategic question for anyone building an agricultural business. The instinct is to build a new digital channel straight to the farmer. The cheaper path is usually to plug into the channel that already reaches them. The better question is not how to lend directly to every farmer. It is how to help the businesses already trading with farmers lend more.</p>
        <hr />
        <h2>What this establishes</h2>
        <p>Four things are now on the table, and the rest of this series rests on them.</p>
        <p>The gap is real and it is not mainly about risk. Expected losses vary by 0.4 percentage points across loan sizes while costs vary by 15.5.</p>
        <p>The standard instrument has a mathematical ceiling. A guarantee can only ever return the loss it covers, and on the smallest loans that loss is far smaller than the shortfall.</p>
        <p>Agriculture competes against a 16 per cent government bond, so the size of the subsidy required is set partly by the wider economy rather than by farming alone.</p>
        <p>And the biggest lender to farmers is the buyer, which solved the cost problem commercially rather than financially, and which most capital strategies still treat as background scenery.</p>
        <p>A borrower can be entirely creditworthy and the loan can still be a bad deal for the bank. Separating those two ideas is the whole move. Once they are separate the next question asks itself. If the problem is not that these businesses are dangerous, what exactly is wrong with the money they have been offered?</p>
        <p>That is the subject of the next article.</p>
        <hr />
        <h2>Sources</h2>
        <p>Every figure in this article traces to one of these. The full bibliography, with page references and the notes on where sources disagree, is in SOURCES.md.</p>
        <h3>Lending economics, the guarantee ceiling and what else a bank could earn</h3>
        <ul><li>Aceli Africa, <a href="https://aceliafrica.org/app/uploads/2025/04/Aceli-2025-Financial-Benchmarking-Report-Final.pdf" target="_blank" rel="noopener noreferrer">Agricultural SME Lending in East and Southern Africa: 2025 Financial Benchmarking Report</a>. Analysis by Dalberg. The loan level profit and loss, the lender survey, and the comparison against bonds.</li><li>Aceli Africa, <a href="https://aceliafrica.org/app/uploads/2026/04/Activating-the-Agri-SME-Finance-Market-Report.pdf" target="_blank" rel="noopener noreferrer">Activating the Agri-SME Finance Market: Learning from 2020 to 2025</a>. The five year results.</li></ul>
        <h3>The finance gap, by purpose and by channel</h3>
        <ul><li>ISF Advisors, <a href="https://isfadvisors.co/wp-content/uploads/2025/10/ISF_AgFinance-SoS-Report-Oct-2025.pdf" target="_blank" rel="noopener noreferrer">Beyond the Frontier: Decoding Viability in Smallholder Finance</a>, October 2025. The regional and tenor tables, and the channel split.</li></ul>
        <h3>Uganda in 2026</h3>
        <ul><li>Ecofin Agency, <a href="https://www.ecofinagency.com/news-finances/2810-60216-uganda-raises-interest-rate-to-12-as-shilling-weakens-against-dollar" target="_blank" rel="noopener noreferrer">Uganda raises interest rate to 12% as shilling weakens against dollar</a>, 28 October 2026.</li><li>Daily Monitor, <a href="https://www.monitor.co.ug/uganda/news/national/bou-takes-action-on-falling-shilling-5633068" target="_blank" rel="noopener noreferrer">BoU takes action on falling shilling</a>, 15 October 2026.</li></ul>
        <h3>Macro denominators</h3>
        <ul><li>World Bank, <a href="https://databank.worldbank.org/source/world-development-indicators" target="_blank" rel="noopener noreferrer">World Development Indicators</a>.</li></ul>
        <h3>Earlier work in this programme</h3>
        <ul><li><Link href="/blogs/how-to-fill-africas-missing-middle">Filling the Missing Middle</Link></li><li><Link href="/blogs/why-african-startups-stall">The Broken Ladder</Link></li><li><Link href="/blogs/who-writes-the-cheques-african-vc">Who Is Actually Writing the Cheques</Link></li></ul>
        <hr />
        <p><em>First of three pieces from the Agri Capital Matching research project. The data, model, notebooks and interactive figures are open, and every number cites the document it came from. This builds on earlier Herufi work, in particular <Link href="/blogs/how-to-fill-africas-missing-middle">Filling the Missing Middle</Link>, which first noted that agricultural technology had fallen below the reporting threshold of Africa&apos;s main venture funding report, and argued that a sector cannot be a third of GDP and below a reporting threshold at the same time without something being structurally wrong.</em></p>
      </div>
      <Link className="nextcard" href="/blogs/good-business-wrong-money">
        <div>
          <span className="eyebrow forest">Next in the series</span>
          <h3>Good Business, Wrong Money</h3>
        </div>
        <span aria-hidden="true">&rarr;</span>
      </Link>
      <Link className="pubcard" href="/publications/cost-of-a-small-loan-2026">
        <span className="eyebrow gold">Full Publication</span>
        <h3>The Cost of a Small Loan</h3>
        <p>Report 1 of the Agricultural Capital series. The full lender cost decomposition, the arithmetic ceiling on a guarantee, the tenor gap, the method and every source.</p>
        <span className="btn">Read the publication</span>
      </Link>
      <div className="tags"><span className="tag">Agricultural Finance</span><span className="tag">Credit Risk</span><span className="tag">Blended Finance</span><span className="tag">Smallholder Farmers</span></div>
    </article>
  )
}
