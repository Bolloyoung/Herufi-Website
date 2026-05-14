export type ProjectStatus = 'Live' | 'In Progress' | 'Coming Soon'

export type Project = {
  id: string
  title: string
  category: string
  problem: string
  approach: string
  output: string
  tools: string[]
  sector: string
  status: ProjectStatus
}

export const projects: Project[] = [
  {
    id: 'african-climate-vc-map',
    title: 'African Climate Venture Capital Map',
    category: 'Market Maps',
    problem: 'Limited visibility into which climate sectors and geographies are attracting venture capital in Africa.',
    approach: 'Aggregated deal data, fund mandates, and sector activity across 12 African markets. Mapped funding flows against sector opportunity.',
    output: 'Interactive map with deal data, fund profiles, sector filters, and opportunity scores.',
    tools: ['Python', 'Pandas', 'Next.js', 'Tailwind CSS'],
    sector: 'Climate & Energy',
    status: 'In Progress',
  },
  {
    id: 'football-recruitment-dashboard',
    title: 'Football Recruitment Intelligence Dashboard',
    category: 'Dashboards',
    problem: 'Football clubs making recruitment decisions without structured performance and value data.',
    approach: 'Built player scoring model using position-adjusted performance metrics combined with market value analysis and African market filters.',
    output: 'Dashboard with player search, comparison, positional filters, and value scoring.',
    tools: ['Python', 'Pandas', 'Next.js', 'Chart.js'],
    sector: 'Sports Business',
    status: 'In Progress',
  },
  {
    id: 'investment-readiness-tool',
    title: 'Investment Readiness Diagnostic Tool',
    category: 'Venture Diagnostics',
    problem: 'Early-stage startups unclear on what institutional investors actually assess before a deal.',
    approach: 'Built a structured scoring framework across 8 dimensions: team, market, product, traction, financials, narrative, operational maturity, and investor fit.',
    output: 'Self-assessment tool with scores, gap analysis, and recommended actions.',
    tools: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    sector: 'Venture Strategy',
    status: 'Coming Soon',
  },
  {
    id: 'african-mobility-map',
    title: 'African Mobility Opportunity Map',
    category: 'Market Maps',
    problem: 'Investors and founders lack a structured view of where mobility and energy-access opportunities are emerging.',
    approach: 'Combined infrastructure data, urbanisation rates, energy access indicators, and startup activity across 15 African cities.',
    output: 'City-level opportunity map with sector overlays and investment signal scoring.',
    tools: ['Python', 'GeoJSON', 'D3.js', 'Next.js'],
    sector: 'Climate & Energy',
    status: 'Coming Soon',
  },
  {
    id: 'aid-contraction-brief',
    title: 'Aid Contraction & Private Capital Brief',
    category: 'Research Reports',
    problem: 'Development sector needs clear analysis of how aid contraction affects capital flows and what private capital can and cannot replace.',
    approach: 'Structured analysis of ODA trends, DFI mandates, blended finance instruments, and private capital appetite by sector.',
    output: 'Research brief with data visualisations, scenario analysis, and strategic implications.',
    tools: ['Python', 'Pandas', 'Matplotlib'],
    sector: 'Impact & Development',
    status: 'In Progress',
  },
  {
    id: 'academy-talent-pipeline',
    title: 'Academy Talent Pipeline Model',
    category: 'Sports Intelligence Tools',
    problem: 'Football academies unable to quantify the economic value of their talent development pipeline.',
    approach: 'Built a cohort-based model tracking progression rates, transfer market comparables, and academy cost structures across three market tiers.',
    output: 'Model with configurable assumptions, 5-year pipeline projections, and ROI calculations.',
    tools: ['Python', 'Excel', 'Next.js'],
    sector: 'Sports Business',
    status: 'Coming Soon',
  },
  {
    id: 'venture-studio-framework',
    title: 'Venture Studio Portfolio Support Framework',
    category: 'Impact Frameworks',
    problem: 'Venture studios lack consistent diagnostic tools for supporting portfolio companies post-investment.',
    approach: 'Developed a staged-support framework with intervention triggers, resource allocation logic, and progress tracking.',
    output: 'Framework document with templates, decision trees, and tracking dashboards.',
    tools: ['Notion', 'Miro', 'Python'],
    sector: 'Venture Strategy',
    status: 'Live',
  },
]
