# Manusman Demo Flow — Technical Description

## Overview
A 7-step interactive demo simulating an AI-powered meeting prep platform. React 18 + TypeScript + Vite frontend, Express backend. State managed via `useState` hooks in `DemoFlow.tsx`, passed down as props.

## Step 1: Company Select (`CompanySelect.tsx`)
User picks from 9 hardcoded companies (Blackstone, Hasbro, Tetra Pak, 10 Downing Street, McKinsey, JPMorgan, Meta, LSE, Y Combinator) in a 3-column grid. Below: search bar (`CompanySearch.tsx`) that calls `/api/company-search` via SSE — shows live agent trace messages as the Manus AI agent searches.

**When a custom company is selected:** Apollo contact lookup (`/api/company-contacts`) fires immediately in the background from `DemoFlow.tsx` so contacts are ready by step 2.

## Step 2: Person Select (`PersonSelect.tsx`)
For hardcoded companies: shows 3-5 real executives with verified headshot photos (from blackstone.com, The Org, Wikimedia Commons), titles, LinkedIn links, and seniority badges. For custom companies: shows Apollo-sourced contacts (prefetched from step 1) or manual name/title entry form. Supports file upload for internal documents (PDFs, notes). Hidden search bar fuzzy-matches against judge profiles in `src/data/research/judges.ts`.

**When a person is selected for a custom company:** Research API call (`/api/research`) starts in the background immediately, running while user is on steps 2-3.

## Step 3: Meeting Type (`MeetingContext.tsx`)
7 consulting-specific meeting types with Lucide icons: Discovery Call, Pitch/Proposal, Negotiation, Project Kickoff, Steering Committee, QBR/Account Review, plus "Other" with free text. Selection determines agenda/question templates in `src/utils/briefingGenerator.ts`.

## Step 4: Agent Research (`AgentResearch.tsx`)
Shows 3 parallel agent trace panels (Company Research, Industry Research, Internal Documents) with animated spans.

**Demo realism features:**
- **Two-phase span labels:** Each span shows an action verb while running ("Scanning recent press coverage...") and only reveals findings on completion ("Found: Blackstone closes $18.3B Hologic take-private"). `TraceSpan` has `label` (pending/running) and `completeLabel` (revealed on complete).
- **Timing:** Hardcoded companies simulate ~27 seconds with random jitter (±500ms). Agents complete staggered: Company ~20s, Industry ~26s, Internal ~27s.
- **Data-specific logs:** Messages reference actual research data (metrics, headlines, LinkedIn excerpts).

For custom companies: picks up prefetched result or streams live from Manus SSE. Server polls every 1.5s, caches to `.cache/research/`.

Internal Notes section: textarea + file upload for user documents.

## Step 5: Research Results (`ResearchResults.tsx`)
**CTA buttons at top AND bottom:** Start Meeting + Download PDF (styled as matching blue CTAs) appear under the heading and again at the bottom.

Full briefing with fade-in sections:
1. **Meeting Briefing** — summary, agenda (4 items), key questions (3, meeting-type-specific)
2. **Person Profile** — photo, background, LinkedIn posts
3. **Company Overview** — overview, news, key metrics grid
4. **Financial Press** — live news from `/api/news`
5. **Industry Landscape** — trend tags, competitive context
6. **Strategic Frameworks** — SWOT + Porter's Five Forces via `/api/frameworks` (Groq). Shows error message if Groq fails.
7. **Internal Notes** — user's notes from step 4
8. **GitHub Setup Guide** — collapsible card with clone/install/env var instructions + keyboard shortcuts

## Step 6: Meeting Simulation (`MeetingSimulation.tsx`)
Full-screen Google Meet-style UI:
- **Main video area** — YouTube embed (muted, autoplay, no controls) for people with `videoId`, photo fallback otherwise. Person name badge bottom-left.
- **Webcam PiP** — bottom-right via `react-webcam` (`z-20` to render above iframe)
- **Live transcription** — real-time transcript captured during the meeting, passed to step 7
- **Top bar** — 6 keybind buttons + Research sidebar toggle
- **Bottom bar** — mic, video, more, hang up (ends meeting → step 7)
- **Research sidebar** (right, 320px) — scrollable brief with all research data + internal notes

### Overlay card system (keys 1-6)
One card at a time. New key replaces current. Same key toggles off. `slideInLeft` animation. Auto-dismiss 20s.

- `1` **Company Snapshot** — overview + metrics + news
- `2` **Rapport Builder** — conversation starters from LinkedIn posts
- `3` **Meeting Prep** — agenda + key questions
- `4` **Quick Lookup** — key facts table, competitive landscape, trends
- `5` **AI Copilot** — Groq-powered chat (`llama-3.3-70b-versatile`). Full research context as system prompt. SSE streaming from `/api/copilot-chat`. Quick-suggestion buttons. `stopPropagation` on input.
- `6` **Strategic Frameworks** — SWOT + Porter's (if generated)

Keys 1-4/6 close copilot. Key 5 closes overlay cards. Escape exits meeting.

## Step 7: Post-Meeting Summary (`MeetingSummary.tsx`)
Full-screen AI-generated meeting debrief. Receives transcript + meeting duration from step 6 via `onMeetingEnd` callback. Calls `/api/meeting-summary` (Groq) to generate:

- **Meeting score ring** — visual score out of 100
- **Sentiment analysis** — Excellent / Positive / Neutral / Needs Follow-up
- **Key takeaways** — bulleted summary of what happened
- **Action items** — prioritized (High/Medium/Low) with owners
- **Follow-up recommendations** — next steps
- **Download** — export summary as PDF

## Landing Page Sections
| Section | File | Description |
|---------|------|-------------|
| Hero | `sections/Hero.tsx` | Headline, subtitle, CTA button |
| Tool Showcase | `sections/ToolShowcase.tsx` | Auto-rotating mini-demo panels showing overlay cards |
| Demo Video | `sections/DemoVideo.tsx` | YouTube embed with CTA |
| Use Cases | `sections/UseCases.tsx` | Numbered feature blocks |
| Testimonials | `sections/Testimonials.tsx` | Headshots and quotes |
| Security | `sections/Security.tsx` | Trust points and architecture diagram |
| Pricing | `sections/Pricing.tsx` | Silver/Gold/Platinum tiers |
| FAQ | `sections/FAQ.tsx` | Accordion |
| Footer | `sections/Footer.tsx` | Links and copyright |

## Key Architecture Details
- **Data flow:** `DemoFlow.tsx` owns all state (company, person, meetingType, research, internalNotes, frameworksData, transcript, meetingDuration) and passes down as props
- **Hardcoded research:** `src/data/research/{blackstone,hasbro,tetrapak,downing,mckinsey,jpmorgan,meta,lse,ycombinator,judges}.ts` — verified against real 2025-2026 sources
- **Custom company pipeline:** Company search (Manus SSE) → Contact lookup (Apollo, prefetched) → Research (Manus SSE, prefetched) → results. Server caches to disk.
- **Background prefetch:** Contacts start at step 1. Research starts at step 2. `prefetchInProgress` flag prevents duplicate API calls.
- **Video embeds:** `Person.videoId` (YouTube ID) + `Person.videoStart` (seconds). Renders as muted autoplay iframe, falls back to photo.
- **Env vars:** `MANUS_API_KEY` (required), `GROQ_API_KEY` (optional — copilot, frameworks, meeting summary), `APOLLO_API_KEY` (optional — contact lookup). Demo companies work with zero API keys.
- **Design system:** Dark glass-morphism theme. CSS variables. `glass-card`, `glass-panel`, `system-badge` classes. JetBrains Mono for code, Open Sans for body.

## Server Endpoints
| Route | Handler | Purpose |
|-------|---------|---------|
| `POST /api/company-search` | `companySearch.ts` | SSE — Manus agent searches for company info |
| `POST /api/research` | `manus.ts` | SSE — Manus agent generates full research briefing |
| `POST /api/company-contacts` | `apollo.ts` | Apollo.io contact lookup |
| `POST /api/copilot-chat` | `groqChat.ts` | SSE — Groq streaming chat for meeting copilot |
| `POST /api/frameworks` | `frameworks.ts` | Groq generates SWOT + Porter's Five Forces |
| `GET /api/news` | `news.ts` | Live financial press for company |
| `POST /api/meeting-summary` | `meetingSummary.ts` | Groq generates post-meeting AI summary |
