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

## Architecture

**Next.js 14 App Router** static site. No database, no API routes. TypeScript throughout.

### Content Pipeline

Two content sources, both rendered server-side at build time:

1. **`data/*.ts`** — TypeScript arrays for services, projects, frameworks, tools, reports, pillars, navigation. Edit these to update site content that doesn't need long-form prose.
2. **`content/research/*.md`** — Markdown articles with gray-matter frontmatter. Parsed by `lib/content.ts` utilities (`getAllArticles`, `getArticleBySlug`, `getArticlesByPillar`). Rendered via `next-mdx-remote`.

### Pages → Data Flow

```
app/page.tsx              ← imports from data/pillars.ts, data/services.ts, lib/content.ts
app/research/page.tsx     ← lib/content.ts getAllArticles()
app/research/[slug]/      ← lib/content.ts getArticleBySlug()
app/frameworks/[slug]/    ← lib/content.ts getFrameworkBySlug()
app/services/page.tsx     ← data/services.ts
app/projects/page.tsx     ← data/projects.ts
app/data-lab/page.tsx     ← data/tools.ts
app/reports/page.tsx      ← data/reports.ts
```

### Component Conventions

- Card components (`ResearchCard`, `ServiceCard`, etc.) receive strongly-typed props from data files — each card type has a matching TypeScript interface.
- `PageHeader.tsx` / `SectionHeader.tsx` — page-level and section-level headers respectively.
- `Navbar.tsx` drives nav links from `data/navigation.ts`.

### Styling

Custom Tailwind palette defined in `tailwind.config.ts`:
- `charcoal` (#1C1C1E) — primary text
- `forest` (#1B4332) / `forest-light` (#2D6A4F) — brand green
- `gold` (#C9A84C) / `gold-light` (#E8C96A) — accent
- `cream` (#FAFAF8) — background

Fonts: `font-sans` → Inter, `font-serif` → Merriweather (Google Fonts via globals.css).

### Forms

`ContactForm.tsx` and `NewsletterSignup.tsx` are currently frontend-only (show success state). To wire them up: Formspree for contact, Mailchimp/Loops for newsletter. Both would use Next.js API routes under `app/api/`.

### Deployment

Vercel. Pushing to `main` triggers auto-deploy. Domain: herufi.org.

## Planned Work (from roadmap)

The following features are planned but not yet implemented:

- **Navigation restructure**: Home, About, Research, Analytics, Services, Contact (consolidate Research+Reports → Research; Frameworks+Data Lab → Analytics)
- **Logo**: Create and add a Herufi logo
- **Active tab indicator**: Highlight current nav item
- **Landing page hero image**: Add image to hero section
- **Interactive sports analytics dashboard**: Charts/visualisations on the data-lab / analytics page
- **Comments system**: Blog-style comments on research articles
- **Email addresses**: hello@herufi.org (MX records + forwarding)
- **Infographic-heavy Analytics section**: Motion/animation, model explanations, data visualisations
- **Profile page**: Brief founder/team profile
- **Visual improvements**: Replace emoji in tiles with quarter-height cover images; add images to pages
- **Prose cleanup**: Strip `#`, `*`, long dashes, and extraneous punctuation from research markdown

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
