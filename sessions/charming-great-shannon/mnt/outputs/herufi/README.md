# Herufi — Research & Analytics Platform

A professional Next.js website for [herufi.org](https://herufi.org) — a research and analytics platform producing structured intelligence for investors, founders, institutions, and sports organisations working across African markets.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Content | Markdown (gray-matter) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Folder Structure

```
herufi/
├── app/                    ← All pages (Next.js App Router)
│   ├── layout.tsx          ← Root layout (Navbar + Footer)
│   ├── page.tsx            ← Home page
│   ├── about/page.tsx
│   ├── research/
│   │   ├── page.tsx        ← Research hub
│   │   └── [slug]/page.tsx ← Individual articles
│   ├── frameworks/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── services/page.tsx
│   ├── projects/page.tsx
│   ├── data-lab/page.tsx
│   ├── reports/page.tsx
│   └── contact/page.tsx
│
├── components/             ← Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── CTASection.tsx
│   ├── NewsletterSignup.tsx
│   ├── ContactForm.tsx
│   ├── PillarCard.tsx
│   ├── ResearchCard.tsx
│   ├── FrameworkCard.tsx
│   ├── ServiceCard.tsx
│   ├── ProjectCard.tsx
│   ├── ReportCard.tsx
│   ├── ToolCard.tsx
│   ├── Tag.tsx
│   ├── PageHeader.tsx
│   ├── SectionHeader.tsx
│   └── EmptyState.tsx
│
├── data/                   ← Static data (edit to update site content)
│   ├── navigation.ts       ← Nav links
│   ├── pillars.ts          ← 6 research pillars
│   ├── services.ts         ← 5 service lines
│   ├── projects.ts         ← Project portfolio
│   ├── frameworks.ts       ← Analytical frameworks
│   ├── tools.ts            ← Data Lab tools
│   └── reports.ts          ← Downloadable reports
│
├── content/                ← Markdown content (add articles here)
│   └── research/           ← Research articles (.md files)
│
├── lib/
│   └── content.ts          ← Markdown file reader utilities
│
├── public/                 ← Static assets (images, favicons)
│
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Running Locally

### Step 1: Install dependencies

```bash
npm install
```

### Step 2: Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 3: Build for production (to test before deploying)

```bash
npm run build
npm start
```

---

## Adding Content

### Add a new research article

1. Create a new file in `content/research/` named `your-article-slug.md`
2. Copy this frontmatter template at the top:

```markdown
---
title: "Your Article Title"
slug: "your-article-slug"
date: "2025-04-01"
category: "Analysis"
pillar: "Venture Strategy & Capital Intelligence"
summary: "A one or two sentence summary of the article."
readingTime: "6 min read"
author: "Herufi Research"
tags: ["Tag One", "Tag Two", "Tag Three"]
---

Your article content goes here in Markdown.

## Section heading

Paragraph text...
```

3. Save the file. The article will appear automatically on the Research page.

**Pillar options** (use exactly as written):
- `Venture Strategy & Capital Intelligence`
- `Markets, Systems & African Economies`
- `Climate, Energy, Food & Infrastructure`
- `Data, Predictive Analytics & Decision Intelligence`
- `Sports Business Intelligence`
- `Culture, Context & Intelligence Notes`

---

### Edit a service

Open `data/services.ts` and edit the relevant service object. Each service has:
- `title` — service name
- `tagline` — short description
- `audience` — who it is for (array of strings)
- `deliverables` — list of outputs
- `questions` — example questions Herufi can answer

---

### Edit a project

Open `data/projects.ts` and edit or add a project object:

```typescript
{
  id: 'project-slug',
  title: 'Project Title',
  category: 'Research Reports',      // Category for grouping
  problem: 'What problem it solves',
  approach: 'How Herufi approached it',
  output: 'What was produced',
  tools: ['Python', 'Next.js'],
  sector: 'Climate & Energy',
  status: 'Live',                    // 'Live' | 'In Progress' | 'Coming Soon'
}
```

---

### Add a report

Open `data/reports.ts` and add a report object:

```typescript
{
  id: 'report-slug',
  title: 'Report Title',
  category: 'Market Reports',
  summary: 'What the report covers.',
  date: '2025-Q2',
  format: 'PDF',
  fileUrl: '/reports/your-report.pdf',   // Place PDF in public/reports/
  tags: ['Tag One', 'Tag Two'],
}
```

To make a report downloadable: place the PDF in `public/reports/` and set `fileUrl` to `/reports/your-file.pdf`.

---

### Add a framework

Open `data/frameworks.ts` and add a framework object. Then optionally create a detail page content in `content/frameworks/your-framework.md`.

---

## Deploying to Vercel

### Step 1: Create a GitHub repository

```bash
cd herufi
git init
git add .
git commit -m "Initial commit — Herufi website"
```

Go to [github.com](https://github.com) → New repository → name it `herufi` → Create.

```bash
git remote add origin https://github.com/YOUR_USERNAME/herufi.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use your GitHub account)
2. Click **Add New → Project**
3. Select your `herufi` repository
4. Vercel will detect Next.js automatically — leave all settings as default
5. Click **Deploy**

Your site will be live at a Vercel URL (e.g. `herufi.vercel.app`) in about 2 minutes.

---

## Connecting herufi.org

### Step 1: Add your domain in Vercel

1. In your Vercel project dashboard, go to **Settings → Domains**
2. Click **Add Domain**
3. Type `herufi.org` and click **Add**
4. Also add `www.herufi.org` if you want the www version to work

Vercel will show you two DNS records to add.

### Step 2: Update your DNS

Log in to wherever you registered `herufi.org` (GoDaddy, Namecheap, Google Domains, etc.).

Go to the DNS management section and add the following records:

**For herufi.org (root domain):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www.herufi.org:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

> Note: Vercel will show you the exact values — use those if they differ from above.

### Step 3: Wait for DNS propagation

DNS changes take 5 minutes to 48 hours to propagate globally. Usually it is under 30 minutes.

Once done, visit [https://herufi.org](https://herufi.org) — it will be live with automatic HTTPS.

### Step 4: Set up automatic deploys

Every time you push to the `main` branch on GitHub, Vercel will automatically rebuild and redeploy the site. No manual steps needed.

```bash
# Make a change, then:
git add .
git commit -m "Updated research article"
git push
# Site will be live in ~1 minute
```

---

## Setting Up a Contact Form Backend (Optional)

The contact form currently shows a success state on submission but does not send emails. To receive contact submissions:

**Option A: Formspree (free, easiest)**
1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form — you'll get a form ID (e.g. `xpzgdkqr`)
3. In `components/ContactForm.tsx`, replace the `handleSubmit` function:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  setSubmitted(true)
}
```

**Option B: Resend API**
Use the Resend SDK to send emails via a Next.js API Route. See [resend.com/docs](https://resend.com/docs).

---

## Setting Up Newsletter (Optional)

The newsletter signup currently shows a success state. To connect it to a real list:

1. Create a free account at [Mailchimp](https://mailchimp.com), [Loops](https://loops.so), or [ConvertKit](https://convertkit.com)
2. Get your API key and list/audience ID
3. Create a file `app/api/newsletter/route.ts` with a POST handler that calls the provider API
4. Update `components/NewsletterSignup.tsx` to POST to `/api/newsletter`

---

## Common Issues

**`npm install` fails**
Make sure you have Node.js 18+ installed. Check with: `node -v`
Download from [nodejs.org](https://nodejs.org) if needed.

**Build fails with TypeScript errors**
Run `npm run build` and read the error. Most TypeScript errors are type mismatches in data files — the error message will tell you exactly which file and line.

**Fonts not loading**
The site uses Google Fonts loaded via CSS `@import`. You need an internet connection when building. Fonts are not bundled.

**Images not showing**
Place all images in the `public/` folder. Reference them as `/your-image.jpg` (not `./public/your-image.jpg`).

**Vercel deploy fails**
Check the build log in the Vercel dashboard. 99% of deploy failures are TypeScript or import errors visible in the log.

---

## Development Notes

- All data files in `data/` are TypeScript — they give you autocomplete and type checking
- Research articles are plain Markdown — no special syntax needed
- The site is fully static-friendly (no database, no server required)
- Tailwind CSS classes are used throughout — no separate CSS files needed for styling
- The `cream` background colour is `#FAFAF8`, `forest` green is `#1B4332`, `gold` is `#C9A84C`

---

## Contact & Support

For questions about the codebase: [hello@herufi.org](mailto:hello@herufi.org)
