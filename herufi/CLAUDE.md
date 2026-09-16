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
| Animation | `motion` (`motion/react`): hero parallax and scroll reveals only |
| Charts | ECharts via `echarts-for-react` (publication and blog figures) |
| Auth/DB | Supabase |
| Content | Markdown (gray-matter) |
| Icons | Lucide React |
| Deployment | Vercel |

### Content Pipeline

Two content sources, both rendered server-side at build time:

1. **`data/*.ts`** — TypeScript arrays for pillars, publications, navigation.
2. **`content/blog/*.md`** — Markdown blog posts with gray-matter frontmatter. Parsed by `lib/content.ts`. Rendered via `lib/markdown.ts`.

Blogs link to publications: a blog's optional `publication` frontmatter field references an `id` in `data/publications.ts`, which renders a "Full Publication" card on the post.

### Page Map

Five-tab site structure: **Home, Blogs, Publications, About Us, Contact Us.**

```
/                    → Home (photo hero + featured publication + pillars + latest blogs)
/blogs               → Blog listing with search + pillar filter (?pillar=<id>)
/blogs/[slug]        → Individual blog posts with Comments (Giscus)
/publications        → Detailed long form reports (data/publications.ts)
/about               → About Us + founder profiles + platform approach
/contact             → Contact Us form
/login               → Magic link authentication (Supabase)
/dashboard           → Member portal (authenticated users only)
/auth/callback       → Supabase auth callback handler
/sitemap.xml         → Auto-generated sitemap
```

Old routes (`/our-work`, `/research`, `/research/:slug`, `/analytics`, `/frameworks`, `/services`, `/platform`, `/data-lab`, `/reports`, `/projects`) permanently redirect via `next.config.js`.

**Copy style:** site copy avoids hyphens and dashes entirely (no em dashes, no hyphenated compounds like "evidence-backed"). Rephrase instead. No serial/Oxford comma before "and" in lists either. Sports content was removed from the site; there are four research pillars (the climate, energy, food and infrastructure pillar was removed).

**Page heroes:** every top level tab (Home, Blogs, Publications, About, Contact) opens with `components/PhotoHero.tsx`: a full bleed illustration from `public/heroes/` (engraved style figures on Herufi blue `#02448B` with a dotted Africa map), parallax on scroll, copy set directly on the artwork with a soft text shadow, and a dissolve into the cream page background along the bottom edge. Each file is a 1:1 frame; PhotoHero anchors it to the right edge with `object-contain`, paints the same blue across the section and feathers the join with a CSS gradient, so the copy always sits on flat colour and a replacement only needs to be a square frame on that blue. The artwork for each page is chosen in `data/heroes.ts` (with `spareHeroImages` for future pages). Section content below the hero is wrapped in `components/Reveal.tsx`, which lifts it into view once on scroll. Both collapse to static under `prefers-reduced-motion`. The earlier Spline 3D hero and its `@splinetool/*` packages were removed; if a 3D scene is ever wanted again, note that `@splinetool/react-spline` 4.x is ESM only and breaks the Next 14 webpack build (2.2.6 was the last version that worked).

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
| `Navbar.tsx` | Fixed 64px header; active tab via `startsWith`, closes on route change. `<main>` carries the matching `pt-16`, so pages do not add their own top offset |
| `PhotoHero.tsx` | Full bleed illustrated hero with parallax (client leaf); `size="tall"` on the home page |
| `Reveal.tsx` | Scroll reveal wrapper for sections below a hero |
| `FeaturedPublication.tsx` | Dark panel under the home hero: latest report plus one headline stat |
| `SectionHeader.tsx` | Serif section titles. No eyebrow labels: the site uses at most one small uppercase kicker per few sections |
| `Tag.tsx` | Typographic category label (uppercase text, no pill background) |
| `Comments.tsx` | Giscus GitHub Discussions comments embed |

### Styling

Custom Tailwind palette in `tailwind.config.ts`:
- `charcoal` (#1C1C1E) — primary text
- `forest` (#1B4332) / `forest-light` (#2D6A4F) — brand green
- `gold` (#C9A84C) / `gold-light` (#E8C96A) — accent
- `cream` (#FAFAF8) — background

Fonts: `font-sans` → Inter, `font-serif` → Merriweather, both loaded with `next/font/google` in `app/layout.tsx` (no Google Fonts `<link>`/`@import`). Marketing pages set page and section titles in Merriweather at regular weight; UI, cards and body copy stay in Inter. `lib/format.ts` formats ISO dates for bylines.

Shared primitives live in `app/globals.css` under `@layer components`: `.btn-primary` / `.btn-secondary` (and `-inverse` variants for dark surfaces), `.field` / `.field-label` for inputs, `.kicker` and `.text-link`. One radius scale site wide: buttons, inputs and filter chips are `rounded-md` (6px), panels and cards are `rounded-lg` (8px), avatars are circles. Motion is limited to the hero parallax and entrance, the section reveal wrapper, and hover and `:active` states; no raw scroll listeners or hover lifts. Icons come from `lucide-react` at `strokeWidth={1.5}`; do not hand roll SVG icons. Gold is reserved for the logo mark and the featured publication kicker.

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=         # From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # From Supabase project settings
NEXT_PUBLIC_ADMIN_EMAIL=          # hello@herufi.org
NEXT_PUBLIC_SITE_URL=             # https://herufi.org
RESEND_API_KEY=                   # From resend.com, herufi.org domain verified there
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
- Enhanced dashboards on the member portal (ECharts is already a dependency)
- Research Studio page (upload datasets, PDFs, connect APIs)
- Confidence level badges on research articles
- Source transparency panel on article pages
- Admin publishing dashboard

## Adding Blog Posts

Create `content/blog/<slug>.md` with this frontmatter:

```markdown
---
title: "Post Title"
slug: "post-title"
summary: "One sentence summary"
category: "Analysis"
author: "Michael Omega"
date: "2026-07-16"
readingTime: "8 min read"
pillar: "Venture Strategy and Capital Intelligence"
tags: ["tag1", "tag2"]
publication: "publication-id"   # optional, matches an id in data/publications.ts
---
```

`pillar` must exactly match one of the four titles in `data/pillars.ts`:
Venture Strategy and Capital Intelligence | Markets, Systems and African Economies | Data, Predictive Analytics and Decision Intelligence | Culture, Context and Intelligence Notes

## Adding Publications

Add an entry to the `publications` array in `data/publications.ts` (id, title, category, summary, date, format, fileUrl, tags). For a PDF, host the file and point `fileUrl` at it. For a full interactive report (the current five-part African Startup Investment series), `fileUrl` instead points at an internal `/publications/<id>` route — see below.

## Series reports and chart pipeline (pyecharts → JSON → ECharts)

All five reports (`The Broken Ladder`, `From Frontier to Market`, `Where the Continent Is Heading`, `Who Is Actually Writing the Cheques`, `Filling the Missing Middle`) are real Next.js routes, not static HTML:

- `scripts/generate_charts.py` (pyecharts, run via `python3 scripts/generate_charts.py`) builds every figure's ECharts option JSON (16 trilogy figures, 13 R4 figures, 9 R5 figures) from the source data and writes one file per figure to `data/charts/<fig_id>.json` (`{ id, title, caption, panels: [{ title, option }] }`).
- `components/charts/EChart.tsx` renders one panel's raw option via `echarts-for-react`; `components/charts/Figure.tsx` (publications) and `BlogFigure.tsx` (blogs) lay out a figure's panels in a responsive grid with the report's callout box styling.
- `app/publications/[slug]/page.tsx` and `app/blogs/[slug]/page.tsx` map a slug to a content module in `content/publications/` / `content/blogs/` — hand-ported JSX bodies (1:1 with the original report copy) that import the chart JSON and render `<Figure>`/`<BlogFigure>` in place of what used to be static `<img>` figures. Shared visual design lives in `app/publications/report.css` and `app/blogs/explainer.css` (scoped under `.report-doc` / `.explainer-doc`, ported from the former inline `<style>` blocks).
- The r1_fig3 Africa bubble map registers a world GeoJSON basemap (`data/geo/world.json`) client-side via `components/charts/geoWorldMap.ts`.

To regenerate charts after a data change: edit `scripts/generate_charts.py`, re-run it, and the updated JSON is picked up automatically (no code changes needed in the content modules).

## Founders

**Michael Omega** — Founder, Herufi
LinkedIn: https://www.linkedin.com/in/michael-omega-a179b3195/
Email: hello@herufi.org

**Kevin Wanjala** — Co-Founder, Herufi. Applied public policy researcher (trade policy, global value chains, SME finance) from Kenya's public policy research community; co-author of the three KIPPRA papers curated under Publications (see "Adding Publications" above).
Email: hello@herufi.org

## Wiring Up Pending Features

**Comments (Giscus):** Wired to `Bolloyoung/Herufi-Website` GitHub Discussions ("Announcements" category). Discussions is enabled on the repo. The giscus GitHub App must be installed on the repo (https://github.com/apps/giscus) for the embed to work.

**Supabase Auth:** Create a Supabase project, copy URL + anon key to `.env.local`, enable Email OTP auth in Supabase dashboard. Create an `approved_members` table with an `email` column for allowlist.

**Featured publication:** `app/page.tsx` pins `FEATURED_PUBLICATION_ID` and the headline stat shown in the panel under the home hero. Update both when a new report is published.

**Contact form (Resend):** `components/ContactForm.tsx` posts to `app/api/contact/route.ts`, which sends an email via Resend to hello@herufi.org (reply-to set to the submitter's address). Requires `RESEND_API_KEY` in the environment and the herufi.org domain verified in the Resend dashboard.

**Newsletter signup:** `components/NewsletterSignup.tsx` (used on the home and about pages) inserts into a `newsletter_subscribers` table via the existing Supabase client. Create the table once in the Supabase SQL editor:

```sql
create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Allow public insert" on newsletter_subscribers
  for insert to anon
  with check (true);
```

No select policy is added, so the subscriber list is not publicly readable — view it from the Supabase dashboard's table editor.
