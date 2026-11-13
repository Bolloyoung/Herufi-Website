import Link from 'next/link'
import BlogFigure from '@/components/charts/BlogFigure'
import type { FigureData } from '@/components/charts/types'
import ag_fig2 from '@/data/charts/ag_fig2.json'
import ag_fig3 from '@/data/charts/ag_fig3.json'
import ag_fig4 from '@/data/charts/ag_fig4.json'
import ag_fig5 from '@/data/charts/ag_fig5.json'

export default function WhyBanksTurnDownFarmLoans() {
  return (
    <article className="article">
      <Link className="back" href="/blogs">&larr; Back to blogs</Link>
      <div className="chips"><span className="pill green">Venture Strategy and Capital Intelligence</span><span className="pill outline">Explainer</span></div>
      <h1>Why Banks Turn Down Farm Loans They Expect to Be Repaid</h1>
      <p className="summary">Africa&apos;s agricultural finance problem is almost always described as a risk problem. Data covering 32,000 loans says something different. Small farm loans fail because they cost too much to make, not because borrowers fail to pay. That one distinction changes which tools can work.</p>
      <div className="meta"><span>Michael Omega</span><span>28 October 2026</span><span>11 min read</span></div>
      <div className="prose">
        <p>Picture a maize trader. They buy grain from farmers nearby, store it, and sell it to a mill they have dealt with for years. They know which farmers deliver and which ones disappoint. They have an order in hand. The only thing they do not have is the cash to pay the farmers in the weeks before the mill pays them.</p>
        <p>So they go to the bank, and the bank says no. Not because it expects to lose the money. It agrees the loan will probably be repaid. It says no anyway.</p>
        <p>That looks like a mistake, or like prejudice. It is neither. It is arithmetic.</p>
        <p>The bank ran two tests, not one. The first was whether the trader will pay the money back. The second was whether making the loan is worth what it costs the bank to make it. Almost everything written about agricultural finance assumes businesses like this fail the first test. The evidence says they usually pass it, and fail the second.</p>
        <p><strong>The binding constraint on small farm lending in Africa is the cost of making the loan, not the risk of losing it.</strong> The two sound close enough to be interchangeable. They are not, and the instruments built for one are close to useless against the other.</p>
        <hr />
        <h2>Credit losses barely move across loan sizes. Costs move enormously.</h2>
        <p>Testing a claim like this needs a rare kind of data. It has to show, loan by loan, not only whether borrowers repaid but what each loan earned and what each loan cost the lender to produce. Banks almost never publish that.</p>
        <p>Aceli Africa does. It is a market facility that pays lenders to make agricultural loans they would otherwise skip. As part of that work it publishes a full profit and loss breakdown: roughly 32,000 agricultural business loans worth about 2 billion dollars, from 41 lenders in five countries.</p>
        <p>That sets two explanations against each other. The risk explanation says small farm loans go bad more often, so expected losses should climb as loans get smaller. The cost explanation says small farm loans are simply too expensive to produce, so losses should stay flat while costs climb.</p>
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
        <p>Read the losses column first, because the entire risk argument rests on it. It barely moves, and it does not even move in the direction the risk story needs: the largest loans carry slightly more expected loss than the smallest. Across the whole range, expected losses vary by four tenths of a percentage point.</p>
        <p>Now read the cost column. It runs 16.4 down to 0.9, a swing of 15.5 points. That is roughly 39 times the variation in losses.</p>
        <BlogFigure data={ag_fig2 as FigureData} />
        <blockquote>Figure 1: Each pair of circles is one loan size band, with circle area showing how much is lent in it.</blockquote>
        <p>The reason is almost dull once stated. Checking a business, visiting the site, writing the credit file and chasing repayment cost roughly the same whether the loan is 15,000 dollars or 1.5 million. The work is fixed. The income is not. A small loan carries the same workload on a fraction of the interest.</p>
        <p>A fair objection is that lenders could charge more for the small ones. They already do. The smallest loans carry 4.6 percentage points more interest and fees than the largest. The pricing is not the failure. It is still not enough, because as loans get larger, cost falls about nine times faster than price does. A lender pricing rationally cannot catch up.</p>
        <p>So the sentence to retire is that agriculture is too risky to lend to in small amounts. The accurate sentence is that agriculture is too expensive to assess in small amounts. They sound alike. They point at completely different solutions.</p>
        <hr />
        <h2>A guarantee covering every shilling of expected loss still leaves the smallest loans under water</h2>
        <p>The standard instrument in development finance is the credit guarantee: a promise to cover some of a lender&apos;s losses when borrowers default. It makes a risky loan safer. It does nothing about what the loan costs to produce.</p>
        <p>Follow one loan through. A bank expects to earn 15,000 shillings on it, and to lose 1,000 to default. It spends 18,000 finding the borrower, assessing the business and collecting the money. The bank is down 4,000 shillings.</p>
        <p>Now hand it a perfect guarantee. A donor covers the whole 1,000 shilling expected loss, free and instantly. The bank is down 3,000 instead of 4,000. The loan still loses money. It still does not get made.</p>
        <p>Run that calculation across the real data and the smallest loan band moves from minus 2.2 per cent to minus 1.5 per cent. Still a loss. There is a ceiling on what any guarantee can achieve, and the ceiling is the size of the loss it covers.</p>
        <BlogFigure data={ag_fig3 as FigureData} />
        <blockquote>Figure 2: The bar is what a lender keeps today. The gold diamond is the same loan with every expected shilling of loss covered free.</blockquote>
        <p>The lenders doing this work say the same thing with their behaviour. Aceli offers them two kinds of support: cover against losses, and payments that defray the cost of finding and assessing borrowers. Ninety per cent report that the cost support changed what they did. Seventy three per cent say that about the loss cover.</p>
        <p>None of which makes guarantees useless. On a 300,000 dollar loan, a recovered percentage point against a cost base of 2.5 per cent is a meaningful gift, often enough to tip a marginal credit into a yes. The claim here is narrower than the one guarantee sceptics usually make. Protecting a bank against losses is one thing. Paying for the work of reaching a borrower is another. Only the second binds at the bottom of the market.</p>
        <hr />
        <h2>Agriculture is not competing against nothing. It is competing against a government bond.</h2>
        <p>A bank never chooses between lending to a farm business and leaving the money in a drawer. It chooses between that loan and every other thing it could do with the same shilling.</p>
        <p>Lending to farm businesses earned these banks an average of 3.5 per cent. Government bonds paid 16.2 per cent. The loan book as a whole returned 28.3 per cent. So a treasury bond pays more than four times what a farm loan pays, and asks nothing in return. No field visits, no harvest, no weather. Concessional support lifts farm lending to around 6.5 per cent, still well under half the risk free alternative.</p>
        <p>That carries a consequence agricultural strategy documents almost never mention. <strong>A high government borrowing rate is an agricultural finance problem.</strong> Every rise in what a government pays to borrow widens the gap a subsidy has to close.</p>
        <p>Uganda ran that experiment in public this year. On 14 October the Bank of Uganda raised its policy rate from 9.75 per cent to 12 per cent to defend a falling shilling, and raised the share of deposits banks must hold in reserve. Read that from a treasurer&apos;s desk. Lending to the government just got better paid, holding deposits just got more expensive, and nothing whatsoever changed about the maize trader.</p>
        <hr />
        <h2>The money that buys the harvest is not the money that transforms the farm</h2>
        <p>This looks like one gap. It is three. A farmer buying fertiliser needs cash for one season. A processor buying maize needs it for a few months. A business installing irrigation needs it for years. ISF Advisors puts the annual need for Africa south of the Sahara at about 78 billion dollars, divided by purpose like this.</p>
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
        <blockquote>Figure 3: The full need drawn to scale, divided by purpose and then by whether it is supplied.</blockquote>
        <p>Short term lending works better for a reason anyone can picture. It repays itself out of the thing it buys. The harvest repays the fertiliser loan. The sale repays the loan that bought the maize. Long term lending has no such mechanism. An irrigation system does not produce cash next month, and most lenders are funded with deposits that cannot wait.</p>
        <p>That recasts the much discussed shift toward working capital. It is sensible, because short term lending is the part that can be solved commercially. It is also incomplete. Short term money keeps the season going. Long term money makes the next season better. Africa needs both and is getting one.</p>
        <hr />
        <h2>The biggest lender to African farmers is not a bank</h2>
        <p>If formal lenders supply so little, somebody else is doing the work. It is the company that buys the crop.</p>
        <p>Think of a firm buying coffee, milk or avocados from thousands of farmers. It hands out seed and fertiliser before planting and advances cash against the coming harvest. None of that is described as lending, and all of it is lending.</p>
        <BlogFigure data={ag_fig5 as FigureData} />
        <blockquote>Figure 4: Annual flow of finance to smallholder farmers worldwide, by the kind of institution supplying it.</blockquote>
        <p>Crop buyers, traders, processors and input suppliers together supply 43 billion dollars a year, about 45 per cent of all smallholder finance in the world. Informal lenders and savings groups supply 25 billion. Commercial banks, which hold everybody&apos;s deposits, supply about 2 billion. Venture backed agricultural technology companies supply about 0.9 billion, less than a fortieth of the buyer channel they are often described as disrupting.</p>
        <p>Buyers lend cheaply because they already paid the cost that defeats the bank. A buyer knows how much a farmer delivers, how reliably, and how they did last season. That history is the credit file, and it arrived free with the trading relationship. The buyer also holds a collection mechanism nobody else has: the next purchase.</p>
        <p>So the instinct to build a new digital channel straight to the farmer is usually the expensive path. The cheaper one is to plug into the channel already reaching them.</p>
        <hr />
        <h2>What this establishes</h2>
        <p>A borrower can be entirely creditworthy and the loan can still be a bad deal for the bank. Separating those two ideas is the whole move.</p>
        <p>Expected losses vary by 0.4 percentage points across loan sizes. Costs vary by 15.5. A guarantee can only return the loss it covers, which at the bottom of the market is far smaller than the shortfall. And the biggest lender to farmers is the buyer, which solved the cost problem commercially rather than financially.</p>
        <p>So if the problem is not that these businesses are dangerous, what exactly is wrong with the money they have been offered? That is the subject of the next article.</p>
        <hr />
        <h2>Sources</h2>
        <p>Every figure in this article traces to one of these. The full bibliography, with page references and the notes on where sources disagree, is in SOURCES.md. The complete tables and the method are in the publication behind this piece.</p>
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
        <p><em>First of three pieces from the Agri Capital Matching research project. The data, model, notebooks and interactive figures are open, and every number cites the document it came from. This builds on earlier Herufi work, in particular <Link href="/blogs/how-to-fill-africas-missing-middle">Filling the Missing Middle</Link>, which first noted that agricultural technology had fallen below the reporting threshold of Africa&apos;s main venture funding report.</em></p>
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
