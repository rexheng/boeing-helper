# Boeing Helper — Design Spec

## Product

**Boeing Helper** is an internal Boeing tool for client-meeting and biography preparation. Primary scenario: executive prep for a Southeast Asia air show — ministers, airline/defense leadership, backgrounds, follow-ups, and concerns.

## Visual system (match boeing.com)

- **Primary:** `#0033A1` (Boeing Blue)
- **Navy:** `#0A2240` (header/footer)
- **Sky:** `#005896` (light display headlines)
- **Cyan:** `#0078B8` / `#82D4F6` (accents)
- **Ice:** `#E3EFFA`
- **Surfaces:** white `#FFFFFF`, muted `#F3F4F5`, border `#E9EBED`
- **Text:** `#253746` / muted `#515F6B`
- **Fonts:** IBM Plex Sans (display/body), Ubuntu (UI chrome)
- **Aesthetic:** light, photography-led, institutional aerospace — NOT dark glass AI SaaS
- **Buttons:** uppercase tracked pills, Boeing blue fill, soft shadow
- **Hero:** full-bleed photography; **Boeing Helper** as hero-level brand lockup

## Landing composition

1. Full-bleed hero (aerospace photo) + brand + one headline + one sentence + CTA
2. Capabilities (meeting prep tools) — photo-backed or editorial, not card clutter
3. Use cases (Air Show / Government / Airline)
4. Trust / security (Boeing internal)
5. Demo CTA
6. FAQ
7. Footer (Boeing Helper · Internal Use)

Remove: SaaS pricing tiers as product pitch, Vanta dark topology, purple/glow, glassmorphism.

## Demo flow (fully functional)

1. Company/org select — SEA air-show counterparts
2. Contact select — ministers, chiefs, airline execs
3. Meeting type — Air Show Briefing / First Call / Follow-up / Check-in / Quarterly Review / Other
4. Three parallel agents:
   - **Internal & Company Research**
   - **Industry Research**
   - **Country Research**
5. Briefing review + PDF export
6. Live meeting overlays
7. Meeting summary

## Demo data theme

Southeast Asia air-show briefing: Singapore MINDEF/RSAF, Indonesia MoD, RTAF Thailand, RMAF Malaysia, Vietnam aviation authorities, Philippine Air Force, Singapore Airlines / Scoot, Garuda, etc. Research must feel real (fleet, procurement, offsets, bilateral concerns).

## Research shape

Extend `ResearchResult` with `country` block (overview, priorities, bilateral_context, concerns) while keeping person/company/industry.

## Progress

Maintain `public/workbench.html` with screenshots and critic notes over time.
