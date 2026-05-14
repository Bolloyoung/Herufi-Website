export type FrameworkStatus = 'Live' | 'Draft' | 'Coming Soon'

export type Framework = {
  id: string
  title: string
  pillar: string
  problem: string
  users: string[]
  method: string
  exampleOutput: string
  status: FrameworkStatus
}

export const frameworks: Framework[] = [
  {
    id: 'venture-readiness-scorecard',
    title: 'Venture Readiness Scorecard',
    pillar: 'Venture Strategy & Capital Intelligence',
    problem: 'Founders and investors lack a consistent method for assessing startup investment readiness across key dimensions.',
    users: ['Founders preparing to fundraise', 'Investors screening early-stage deals', 'Accelerators and venture studios'],
    method: 'Scores a venture across 8 dimensions: team strength, market opportunity, product maturity, traction signals, financial health, investor narrative, operational maturity, and strategic fit. Each dimension is weighted by stage.',
    exampleOutput: 'Readiness score (0–100), dimension breakdown, gap analysis, and recommended priority actions.',
    status: 'Live',
  },
  {
    id: 'african-market-entry-lens',
    title: 'African Market Entry Lens',
    pillar: 'Markets, Systems & African Economies',
    problem: 'Companies entering African markets use generic frameworks that miss the structural realities of informal economies and local trust systems.',
    users: ['Founders expanding to new African markets', 'International investors', 'Multinationals and corporates'],
    method: 'Assesses market entry across 6 lenses: regulatory environment, informal market structure, distribution infrastructure, cultural fit, competitive dynamics, and capital availability.',
    exampleOutput: 'Market entry assessment with traffic-light scoring, risk flags, and a phased entry recommendation.',
    status: 'Live',
  },
  {
    id: 'founder-market-fit',
    title: 'Founder-Market Fit Diagnostic',
    pillar: 'Venture Strategy & Capital Intelligence',
    problem: 'Investment decisions over-index on market size and under-assess whether the founder is actually built for this specific market.',
    users: ['Investors', 'Venture studios', 'Accelerators'],
    method: 'Maps founder background, network, lived experience, and operational style against specific market requirements. Generates a fit profile with flags.',
    exampleOutput: 'Founder-market fit profile, alignment score, risk flags, and specific questions for diligence.',
    status: 'Draft',
  },
  {
    id: 'capital-stack-strategy-map',
    title: 'Capital Stack Strategy Map',
    pillar: 'Venture Strategy & Capital Intelligence',
    problem: 'Founders and fund managers struggle to design capital stacks that match their stage, sector, and risk profile.',
    users: ['Founders', 'Fund managers', 'DFIs', 'Impact investors'],
    method: 'Maps available capital instruments (equity, debt, grants, blended) against venture stage, risk tolerance, impact requirements, and return expectations.',
    exampleOutput: 'Recommended capital stack with instrument types, sequencing logic, and investor target list by tier.',
    status: 'Draft',
  },
  {
    id: 'climate-venture-opportunity-score',
    title: 'Climate Venture Opportunity Score',
    pillar: 'Climate, Energy, Food & Infrastructure',
    problem: 'Investors and founders lack a structured way to score climate opportunity by sector and geography in African markets.',
    users: ['Climate investors', 'DFIs', 'Climate founders', 'Development programs'],
    method: 'Combines climate urgency signals, market readiness indicators, financing availability, policy environment, and commercial model viability into a weighted opportunity score.',
    exampleOutput: 'Sector-by-geography opportunity heatmap with scores, key drivers, and investment signal flags.',
    status: 'Coming Soon',
  },
  {
    id: 'sports-talent-valuation',
    title: 'Sports Talent Valuation Model',
    pillar: 'Sports Business Intelligence',
    problem: 'Football clubs and academies lack a consistent, data-grounded method for valuing talent at different career stages.',
    users: ['Football clubs', 'Academies', 'Sports agents', 'Sports investors'],
    method: 'Combines position-adjusted performance data, age curve projections, contract status, market comparables, and league/tier adjustments into a transfer value estimate.',
    exampleOutput: 'Player valuation range, comparable player benchmarks, and value trajectory projection over 3 years.',
    status: 'Draft',
  },
  {
    id: 'academy-pathway-framework',
    title: 'Academy-to-First-Team Pathway Framework',
    pillar: 'Sports Business Intelligence',
    problem: 'Academies lack structured pathway models that connect development stages to commercial and performance outcomes.',
    users: ['Football academies', 'Club technical directors', 'Sports investors'],
    method: 'Maps academy cohorts through defined development gates, calculates conversion rates by stage, and models commercial value at each transition point.',
    exampleOutput: 'Pathway diagram with stage conversion rates, value accumulation model, and investment-per-player analysis.',
    status: 'Coming Soon',
  },
  {
    id: 'informal-market-lens',
    title: 'Informal Market Intelligence Lens',
    pillar: 'Markets, Systems & African Economies',
    problem: 'Formal research methods miss the informal dynamics that determine whether a business model will actually work in African markets.',
    users: ['Investors', 'Founders', 'Researchers', 'Development programs'],
    method: 'Uses a structured observation and interview framework to surface informal network effects, trust mechanisms, last-mile dynamics, and cash-flow patterns.',
    exampleOutput: 'Informal market profile with key dynamics, structural risks, model fit assessment, and adaptation recommendations.',
    status: 'Live',
  },
  {
    id: 'data-to-decision',
    title: 'Data-to-Decision Workflow',
    pillar: 'Data, Predictive Analytics & Decision Intelligence',
    problem: 'Teams collect data but cannot consistently turn it into structured decisions.',
    users: ['Analytics teams', 'Founders', 'Fund managers', 'Program teams'],
    method: 'A six-step workflow: define the decision, identify required data, clean and structure data, build the analysis, visualise findings, and produce a decision recommendation document.',
    exampleOutput: 'Decision brief with supporting data, scenario analysis, and a ranked recommendation.',
    status: 'Live',
  },
  {
    id: 'impact-income-pathway',
    title: 'Impact & Income Pathway Framework',
    pillar: 'Climate, Energy, Food & Infrastructure',
    problem: 'Impact ventures struggle to balance commercial sustainability with measurable social or environmental outcomes.',
    users: ['Impact founders', 'DFIs', 'Foundations', 'Blended finance vehicles'],
    method: 'Maps the relationship between impact activities, income streams, and outcome measures. Identifies where impact and income reinforce or create tension.',
    exampleOutput: 'Impact-income matrix, tension flags, and recommendations for aligning model design with funder expectations.',
    status: 'Draft',
  },
]
