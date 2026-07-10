# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev server at localhost:3000
npm run build    # Production build (also type-checks)
npm run lint     # ESLint
npm start        # Serve production build
```

All commands run from the `herufi/` subdirectory (the actual Next.js project root).

## Platform Vision

Herufi is a **Research Intelligence Platform** — a hybrid of:
- Research institution (structured, long shelf-life analysis)
- Venture intelligence platform (investment readiness, due diligence)
- Analytics laboratory (quantitative models, forecasting, ML)
- Economic strategy engine (African market systems analysis)
- Policy research hub (development finance, climate policy)
- Mixed methods research system (qualitative + quantitative)
- Interactive intelligence platform (dashboards, tools)

Design inspiration: Bloomberg, Financial Times, Stripe, Linear, McKinsey Insights, Our World In Data, The Economist.

Core principles: **depth over speed, evidence over opinion, reproducibility over aesthetics, African context first.**

## Architecture

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Charts | Recharts |
| Auth/DB | Supabase |
| Content | Markdown (gray-matter) |
| Icons | Lucide React |
| Deployment | Vercel |

### Content Pipeline

Two content sources, both rendered server-side at build time:

1. **`data/*.ts`** — TypeScript arrays for services, projects, frameworks, tools, reports, pillars, navigation.
2. **`content/research/*.md`** — Markdown articles with gray-matter frontmatter. Parsed by `lib/content.ts`. Rendered via `lib/markdown.ts`.

### Page Map

Four-tab site structure: **Home, Our Work, About Us, Contact Us.**

```
/                    → Home (Spline 3D hero + domains + latest publications)
/our-work            → Publications + reports + pillar filter + interactive analytics
/about               → About Us + founder profile + platform approach
/contact             → Contact Us form
/login               → Magic link authentication (Supabase)
/dashboard           → Member portal (authenticated users only)
/auth/callback       → Supabase auth callback handler
/research/[slug]     → Individual research articles with Comments (Giscus)
/sitemap.xml         → Auto-generated sitemap
```

Old routes (`/research`, `/analytics`, `/frameworks`, `/services`, `/platform`, `/data-lab`, `/reports`, `/projects`) permanently redirect via `next.config.js`. Article pages remain at `/research/[slug]`.

**Spline note:** `@splinetool/react-spline` is pinned to `2.2.6` — 4.x is ESM-only and breaks the Next 14 webpack build. The 3D hero lives in `components/SplineHero.tsx` (loaded client-side via `next/dynamic`, `ssr: false`).

### Tiered Access Model

| Role | Access |
|------|--------|
| Public | Summaries, simplified dashboards, public research pages |
| Member | Full dashboards, source data, methodology appendices, drilldowns |
| Admin | Publishing controls, member management (email: NEXT_PUBLIC_ADMIN_EMAIL) |

Authentication uses Supabase magic links (email OTP). No passwords.

### Key Components

| Component | Purpose |
|-----------|---------|
| `Logo.tsx` | SVG H-mark logo, accepts `variant` (dark/light) and `size` props |
| `Navbar.tsx` | Active tab via `startsWith`, closes on route change |
| `SportsAnalyticsDashboard.tsx` | Recharts-powered 4-tab interactive dashboard |
| `AnimatedSection.tsx` | Framer Motion scroll-triggered fade-in wrapper |
| `AnimatedCounter.tsx` | Framer Motion number counter on scroll-in |
| `MemberGate.tsx` | Content gating — shows lock UI if not authenticated |
| `Comments.tsx` | Giscus GitHub Discussions comments embed |

### Styling

Custom Tailwind palette in `tailwind.config.ts`:
- `charcoal` (#1C1C1E) — primary text
- `forest` (#1B4332) / `forest-light` (#2D6A4F) — brand green
- `gold` (#C9A84C) / `gold-light` (#E8C96A) — accent
- `cream` (#FAFAF8) — background

Fonts: `font-sans` → Inter, `font-serif` → Merriweather.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=         # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # From Supabase project settings
NEXT_PUBLIC_ADMIN_EMAIL=          # hello@herufi.org
NEXT_PUBLIC_SITE_URL=             # https://herufi.org
```

## Planned / In Development

### Backend Infrastructure (requires Railway/Render deployment)
- Python/FastAPI research orchestration engine
- Automated data acquisition (World Bank, IMF, UNData, Kaggle, FBRef)
- Qualitative analysis engine (BERTopic, LDA, NLP)
- Quantitative engine (scikit-learn, statsmodels, Prophet, ARIMA)
- PostgreSQL + pgvector database
- Elasticsearch/Typesense search

### Frontend (in scope for Next.js)
- Recharts/D3.js enhanced dashboards on analytics page
- Research Studio page (upload datasets, PDFs, connect APIs)
- Confidence level badges on research articles
- Source transparency panel on article pages
- Admin publishing dashboard

## Adding Research Articles

Create `content/research/<slug>.md` with this frontmatter:

```markdown
---
title: "Article Title"
excerpt: "One-sentence summary"
author: "Author Name"
date: "2025-01-15"
readingTime: "8 min read"
pillar: "venture-capital"   # one of: venture-capital | climate-resilience | sport-intelligence | data-decision-intelligence | context-strategy | informal-markets
tags: ["tag1", "tag2"]
featured: true
---
```

## Founder

**Michael Omega** — Founder, Herufi
LinkedIn: https://www.linkedin.com/in/michael-omega-a179b3195/
Email: hello@herufi.org

## Wiring Up Pending Features

**Comments (Giscus):** Replace `REPO_ID_PLACEHOLDER` and `CATEGORY_ID_PLACEHOLDER` in `components/Comments.tsx` with values from [giscus.app](https://giscus.app) after enabling GitHub Discussions on the repo.

**Supabase Auth:** Create a Supabase project, copy URL + anon key to `.env.local`, enable Email OTP auth in Supabase dashboard. Create an `approved_members` table with an `email` column for allowlist.

**Hero image:** The home page uses an Unsplash placeholder. Replace `imageSrc` in `app/page.tsx` with `/founder.jpg` (or another image in `public/`) when ready.
