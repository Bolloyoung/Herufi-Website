export type BlogPost = {
  id: string
  title: string
  category: string
  pillar: string
  summary: string
  date: string
  readingTime: string
  fileUrl: string
  tags: string[]
  /** Id of the related publication in data/publications.ts. */
  publication: string
  /** Id of the series in `blogSeries` below. */
  series: string
}

export type BlogSeries = {
  id: string
  title: string
  description: string
}

// Each series renders as its own section on /blogs, in this order.
export const blogSeries: BlogSeries[] = [
  {
    id: 'african-startup-investment',
    title: 'The African Startup Investment Series',
    description:
      'Five explainers on one question: African startups raise a first cheque and then run out of road. Traced from a 2014 baseline through to the instruments that could fix it.',
  },
  {
    id: 'agricultural-capital',
    title: 'The Agricultural Capital Series',
    description:
      'Three explainers on why agriculture receives the wrong capital, built on one open model and the only decomposed loan level dataset in African agricultural finance.',
  },
]

// Standalone explainers that tease a full publication. Rendered as real
// Next.js routes at app/blogs/[slug]/page.tsx (each links back here and to
// its publication).
export const blogPosts: BlogPost[] = [
  {
    id: 'why-african-startups-stall',
    title: 'Why African Startups Stall After Their First Cheque',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'This report analysed 49,000 companies worldwide to find out what really holds African startups back. The answer is not talent, sectors or geography. It is the size and shape of the money.',
    date: '2026-07-16',
    readingTime: '4 min read',
    fileUrl: '/blogs/why-african-startups-stall',
    tags: ['Startup Funding', 'Venture Capital', 'Seed Stage', 'Africa'],
    publication: 'broken-ladder-2014-baseline',
    series: 'african-startup-investment',
  },
  {
    id: 'real-story-african-startup-growth',
    title: 'African Startups Raise 10x More Than a Decade Ago. That Is Not the Real Story.',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'One modern year of African startup funding now beats everything recorded up to 2014, twice over. But the numbers that matter most are not the big ones.',
    date: '2026-07-15',
    readingTime: '5 min read',
    fileUrl: '/blogs/real-story-african-startup-growth',
    tags: ['Startup Funding', 'Venture Capital', 'Exits', 'Debt Financing'],
    publication: 'frontier-to-market-2014-2026',
    series: 'african-startup-investment',
  },
  {
    id: 'africa-2030-better-than-the-hype',
    title: 'Africa 2030: The $5.5 Billion Story That Beats the Hype',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'Forecasts of $60 to $90 billion make headlines. The math says something more modest and more useful. Here is where African startup funding is actually heading.',
    date: '2026-07-14',
    readingTime: '4 min read',
    fileUrl: '/blogs/africa-2030-better-than-the-hype',
    tags: ['Forecasting', 'Venture Capital', 'Scenarios', 'Exits'],
    publication: 'continent-heading-2026-2030',
    series: 'african-startup-investment',
  },
  {
    id: 'who-writes-the-cheques-african-vc',
    title: "Who Is Actually Writing Africa's VC Cheques Now",
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'Development finance pulled back harder than ever in 2025 and local capital surged to fill the gap. Here is what that shift, and a portfolio model built on it, mean for how a fund should actually be built.',
    date: '2026-07-24',
    readingTime: '7 min read',
    fileUrl: '/blogs/who-writes-the-cheques-african-vc',
    tags: ['Venture Capital', 'LP Capital', 'Portfolio Construction', 'Fund Strategy'],
    publication: 'writing-the-cheques-2026',
    series: 'african-startup-investment',
  },
  {
    id: 'how-to-fill-africas-missing-middle',
    title: "Four Ways to Fill Africa's Missing Middle, and What Each One Really Costs",
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'African startups get funded once and then stall. Four financing tools already used on the continent could change that. This is what the math says each one earns, costs and can realistically deliver.',
    date: '2026-07-25',
    readingTime: '7 min read',
    fileUrl: '/blogs/how-to-fill-africas-missing-middle',
    tags: ['Venture Capital', 'Venture Debt', 'Blended Finance', 'Series A'],
    publication: 'filling-the-missing-middle-2026',
    series: 'african-startup-investment',
  },
  {
    id: 'why-banks-turn-down-farm-loans',
    title: 'Why Banks Turn Down Farm Loans They Expect to Be Repaid',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary:
      'Africa\'s agricultural finance problem is almost always described as a risk problem. Data covering 32,000 loans says something different. Small farm loans fail because they cost too much to make, not because borrowers fail to pay. That one distinction changes which tools can work.',
    date: '2026-10-28',
    readingTime: '9 min read',
    fileUrl: '/blogs/why-banks-turn-down-farm-loans',
    tags: ['Agricultural Finance', 'Credit Risk', 'Blended Finance', 'Smallholder Farmers'],
    publication: 'cost-of-a-small-loan-2026',
    series: 'agricultural-capital',
  },
  {
    id: 'good-business-wrong-money',
    title: 'Good Business, Wrong Money',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary:
      'Equity funding for African agricultural technology fell by roughly three quarters in three years. That is usually read as investors losing faith. The balance sheets suggest something else: capital finally finding the instrument these businesses can actually service.',
    date: '2026-10-28',
    readingTime: '11 min read',
    fileUrl: '/blogs/good-business-wrong-money',
    tags: ['Agritech', 'Venture Capital', 'Working Capital', 'Debt Financing'],
    publication: 'matching-business-to-instrument-2026',
    series: 'agricultural-capital',
  },
  {
    id: 'spend-the-same-money-differently',
    title: 'Spend the Same Money Differently',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary:
      'A model tests African agricultural lending under five futures. The result was not the one the research set out to prove. Moving donor money from guarantees to the cost of lending barely changes how much gets lent. It changes who gets it, and that turns out to be the more useful finding.',
    date: '2026-10-28',
    readingTime: '11 min read',
    fileUrl: '/blogs/spend-the-same-money-differently',
    tags: ['Blended Finance', 'Development Finance', 'Scenario Analysis', 'Agricultural Finance'],
    publication: 'same-budget-different-result-2026',
    series: 'agricultural-capital',
  },
]
