# Boeing Helper

AI-powered stakeholder meeting preparation for Boeing — event briefing, biography prep, and procurement context for every engagement.

## Demo flow

1. Select a counterpart organization (SEA air-show theme)
2. Choose a contact
3. Pick a meeting type
4. Watch three research agents run in parallel
5. Review the synthesized briefing (PDF export)
6. Enter a live meeting simulation with research overlays

## Stack

- React 18 + TypeScript + Vite 6
- Tailwind CSS
- Express API (Vercel serverless via `api/index.ts`)
- Optional: Manus AI, Apollo.io, meeting AI (via `GROQ_API_KEY`)

## Commands

```bash
npm install
npm run dev      # Vite + Express
npm run build    # Production frontend build
```

## Environment

Copy `.env.example` to `.env` (all keys optional — demo companies use hardcoded research):

- `MANUS_API_KEY` — custom-company research
- `APOLLO_API_KEY` — contact lookup
- `GROQ_API_KEY` — meeting AI (copilot, frameworks, summary)

## Deploy

Linked to Vercel as a standalone project (separate from Manusman).
