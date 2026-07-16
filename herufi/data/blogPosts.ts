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
}

// Standalone HTML explainers that tease a full publication. Hosted as static
// pages in public/blogs/ (each links back here and to its publication).
export const blogPosts: BlogPost[] = [
  {
    id: 'why-african-startups-stall',
    title: 'Why African Startups Stall After Their First Cheque',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'We analysed 49,000 companies worldwide to find out what really holds African startups back. The answer is not talent, sectors or geography. It is the size and shape of the money.',
    date: '2026-07-16',
    readingTime: '6 min read',
    fileUrl: '/blogs/why-african-startups-stall.html',
    tags: ['Startup Funding', 'Venture Capital', 'Seed Stage', 'Africa'],
    publication: 'broken-ladder-2014-baseline',
  },
  {
    id: 'real-story-african-startup-growth',
    title: 'African Startups Raise 10x More Than a Decade Ago. That Is Not the Real Story.',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'One modern year of African startup funding now beats everything recorded up to 2014, twice over. But the numbers that matter most are not the big ones.',
    date: '2026-07-15',
    readingTime: '6 min read',
    fileUrl: '/blogs/real-story-african-startup-growth.html',
    tags: ['Startup Funding', 'Venture Capital', 'Exits', 'Debt Financing'],
    publication: 'frontier-to-market-2014-2026',
  },
  {
    id: 'africa-2030-better-than-the-hype',
    title: 'Africa 2030: The $5.5 Billion Story That Beats the Hype',
    category: 'Explainer',
    pillar: 'Venture Strategy and Capital Intelligence',
    summary: 'Forecasts of $60 to $90 billion make headlines. The math says something more modest and more useful. Here is where African startup funding is actually heading.',
    date: '2026-07-14',
    readingTime: '6 min read',
    fileUrl: '/blogs/africa-2030-better-than-the-hype.html',
    tags: ['Forecasting', 'Venture Capital', 'Scenarios', 'Exits'],
    publication: 'continent-heading-2026-2030',
  },
]
