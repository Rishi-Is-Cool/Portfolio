# Rishikesh Patil — Applied AI / GenAI Engineer

Portfolio site: systems, research and experience, with a retrieval-grounded
assistant that answers questions about the work using only what the site
publishes.

**Live:** https://rishikesh-portfolio-2025.vercel.app/

## Stack

| Area | Choice |
| :--- | :--- |
| Framework | Next.js 15 (App Router, Server Components by default) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 — two colours: a green shade and a black shade |
| Motion | CSS transitions + IntersectionObserver (no animation library) |
| Portrait | Canvas 2D — edge-derived point cloud, click to resolve into the photo |
| Assistant | Groq (primary) → Gemini (fallback), plain REST, behind `/api/ask` |
| Hosting | Vercel |

## Structure

```
app/
  page.tsx                  Home — composes every section
  layout.tsx                Metadata, fonts, JSON-LD, analytics
  globals.css               Design tokens and base styles
  api/ask/route.ts          Assistant: validation, rate limit, retrieval, model

  systems/[slug]/page.tsx   Case studies (FinGuard, ACE-SER)
  opengraph-image.tsx       Generated OG card
  sitemap.ts, robots.ts     SEO
components/                 Section and UI components
lib/
  content.ts                Single source of truth for every published fact
  knowledge.ts              Retrieval corpus + BM25 scoring, derived from content
  llm.ts                    Groq → Gemini provider chain, fails over silently
  github.ts                 Cached GitHub fetch, fails soft
public/                     Resume, certificates, portrait source
```

### Editing content

Everything the site states lives in [`lib/content.ts`](lib/content.ts) — profile,
proof strip, systems, research, experience, stack, credentials. Change it there
and the page, the case studies and the assistant's knowledge all follow.

Each entry must be traceable to a verified source (the resume in `public/`, a
public repository, or a document shipped in `public/`). No estimated numbers, no
inferred project links.

### Swapping the portrait

Replace `public/portrait.jpg` and, if the framing differs, adjust `CROP` at the
top of [`components/Portrait.tsx`](components/Portrait.tsx). Nothing else in the
component is specific to the image.

## Local development

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run lint     # ESLint
npm run build    # production build
npm start        # serve the production build
```

Note: don't run `npm run build` while `npm run dev` is running — they share
`.next` and the dev server will break until restarted.

## Environment variables

Copy `.env.example` to `.env.local`. Every variable is optional; the site
degrades gracefully without them.

| Variable | Purpose | Without it |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | Primary provider for `/api/ask` ([console.groq.com/keys](https://console.groq.com/keys)) | Falls through to Gemini |
| `GEMINI_API_KEY` | Fallback provider ([aistudio.google.com/apikey](https://aistudio.google.com/apikey)) | Groq only |
| `GROQ_MODEL` | Override (default `openai/gpt-oss-120b`) | Uses the default |
| `GEMINI_MODEL` | Override (default `gemini-3.6-flash`) | Uses the default |
| `GITHUB_TOKEN` | Raises the GitHub API rate limit | Unauthenticated requests; section hides on failure |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata and sitemap | Falls back to the Vercel URL |

With neither LLM key set, the assistant still runs its retrieval step and returns
a clear "offline" message instead of failing.

No key is ever exposed to the browser — the assistant runs entirely in the route
handler.

## Deploying to Vercel

1. Push to GitHub and import the repository in Vercel (framework auto-detected).
2. Add `GROQ_API_KEY` and `GEMINI_API_KEY` (and optionally `GITHUB_TOKEN`,
   `NEXT_PUBLIC_SITE_URL`) under Project → Settings → Environment Variables.
3. Deploy. The GitHub section revalidates hourly; everything else is static.
