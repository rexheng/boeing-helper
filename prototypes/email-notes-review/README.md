# Elevate “Update from email / notes” — discussion & prototypes

Static prototypes only. No product UI changes yet.

## Open in browser

`prototypes/email-notes-review/index.html`

## What’s in the prototype

1. **Centrepiece intake** — hero paste band (not a toolbar toggle / collapsible)
2. **Extraction wow beat** — scan line + cascading chips (people / travel / ops)
3. **Synthetic SEA email** — Priya → Rex attendee-list delta (copyable)
4. **Four review layouts**
   - **A** Changes | Document split
   - **B** Docked composer ★ (recommended)
   - **C** Triptych: Source | Changes | Document
   - **D** Floating review over full-bleed sheet

## Recommendation

**Hybrid B → A:** docked paste beside the sheet for intake; after Propose, left rail swaps to hunk list with sticky Accept; sheet cells pulse on hunk hover/focus. No Groq/API mention in subtitle.

## Ask

Confirm layout (B, A, C, D, or hybrid) and wow budget (chips+pulse vs source-span linking) before implementation on top of PR #3’s ReviewPanel path.
