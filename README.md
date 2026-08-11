# Boeing Helper

Internal briefing-materials preparer for Boeing — meeting papers, invitations, attendee lists, and post-meeting reports for show-cycle engagements.

## Demo flow

1. Select a counterpart organization (SEA air-show theme)
2. Choose a contact
3. Set engagement context
4. Watch research agents run
5. Review the meeting paper (PDF export)
6. Prepare invitation letter and attendee-list line
7. Hand off along the RD → Division BD → VPGM / IBD VP path
8. Capture a post-meeting report

## Stack

- React 18 + TypeScript + Vite 6
- Tailwind CSS
- Express API (Vercel serverless via `api/index.ts`)
- Optional: Manus AI, Apollo.io, Groq (frameworks)

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
- `GROQ_API_KEY` — strategic frameworks

## Deploy

Linked to Vercel as a standalone project.
