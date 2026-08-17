# Handoff — Research library inspector + Meeting Paper Helper comments

**Repo:** `rexheng/boeing-helper`  
**Branch:** `cursor/auditable-research-workspace-5276`  
**PR:** https://github.com/rexheng/boeing-helper/pull/24  
**Preview:** `https://boeing-helper-git-cursor-auditabl-bd223d-rexs-projects-82a3a5df.vercel.app?step=4`  
Paper: same URL with `?step=5`

This session built the auditable Research library (Scholar / NotebookLM). Two follow-ups were started; finish them to 10/10.

---

## 1. Inspector must stay in view (started)

**Bug:** In Grounded brief, scrolling the page then clicking a citation showed the Inspector off-screen (user had to scroll up).

**Cause:** `.audit-grid` used `min-height` only. Grid items have `min-height: auto`, so the middle pane grew with the brief. The page (`demo-shell`) scrolled. Inspector lived at the top of a tall third column.

**Fix landed:**
- `.audit-workspace` is a flex column with `height: calc(100vh - 9rem)`
- `.audit-grid` is `flex: 1; min-height: 0; overflow: hidden`
- Panes `min-height: 0; overflow: hidden` so Grounded brief scrolls **inside** the middle pane
- Inspector body scrolls to top on source change
- Compact header so the 3-pane stage fits under demo chrome
- Mobile (`max-width: 860px`): height auto again; overlay inspector already used below 1180px

**Verify:** `?step=4` → Grounded brief → scroll the **middle pane** (not the page) → click a superscript. Inspector (right column) must still be fully visible and show that source.

**If still broken:**
- Demo chrome height may not be 9rem — tune `calc(100vh - 9rem)`
- Corpus overlay (`audit-grid--corpus`) is `position: fixed`; grounded is **not** overlay. If sticky/lock fails, reuse overlay for grounded/models too (`view !== "grounded"` currently only corpus).
- `demo-shell` is `overflow-y-auto` on the whole overlay — if workspace still overflows, page-scroll returns.

Files: `src/index.css` (audit-*), `src/demo/researchAudit/ResearchAuditWorkspace.tsx`, `src/demo/researchAudit/Inspector.tsx`

---

## 2. Meeting paper = scaffolding; Boeing Helper comments = the product (started)

**Intent (user):** Do **not** autonomously dump all research into the paper body. The official Meeting Paper is a template (scaffolding). The selling point is **Boeing Helper comments on the Word document** — the *right* follow-up questions a campaign lead would ask before freeze. Those comments must be visible in the UI, not only inside the downloaded .docx.

**What landed:**
- `src/utils/helperComments.ts` — `buildHelperComments(research, company, person, meetingType)`
  - Flagship (Chan Chun Sing / MINDEF): 9 sharp comments (fighter-lane caution, P-8A dates vs targets, no US–China framing, ST Engineering workshare, named owner, Fan/CNA marker, Apache/Chinook readiness number, Fort Worth is Lockheed, phone placeholder)
  - Generic path: derived from priority, profile_overview, concern, disputing news, first metric
  - Severities: `ask` | `caution` | `verify`
- Paper generator now always uses `buildHelperComments` (`src/utils/meetingPaperGenerator.ts`)
- Word anchors expanded (`key_messages`, `campaign_background`, `cust_sat`, `biography`) in `src/utils/wordComments.ts`
- UI: `src/demo/HelperCommentsRail.tsx` — yellow Word-style cards, BH avatar, section + severity, copy that comments travel with the .docx
- `MeetingPaperView` two-column layout (editor + rail); step 5 widened to `max-w-[96rem]`

**Still not 10/10 — do this next:**

1. **Comments in the in-browser Word editor.** Today comments inject into the downloaded docx (`injectWordComments`) but `@docx-editor.dev` likely does not render Word comments. Options: highlight matching template fields when a rail card is clicked; or balloon overlays on the editor. Clicking a Helper card should feel like clicking a Word comment.
2. **Smarter scaffolding, not a research dump.** `generateMeetingPaper` still truncates overview/bilateral into campaign background and clips bio. Keep body short; put missing points in comments. Per-company flagship overrides only exist for MINDEF/Chan — add SIA / Garuda / Kemhan gold comments the same way.
3. **Right questions.** Stress-test each comment: would a Boeing SEA campaign lead actually ask this before freeze? Kill generic “verify pronunciation” if the flagship already has sharper asks. Every comment should force a decision (name, date, number, or cut the claim).
4. **Wire comments to research audit.** Optional: each comment cites `sourceIds` from `buildResearchAudit` so the paper rail can jump back to Research library inspector.
5. **Download path.** Confirm Word Review pane shows BH comments with initials, anchored on the right section (not all dumped at end of body). Test air-show vs standard templates.

Files: `src/utils/helperComments.ts`, `src/utils/meetingPaperGenerator.ts`, `src/utils/wordComments.ts`, `src/utils/templateExport.ts`, `src/demo/MeetingPaperView.tsx`, `src/demo/HelperCommentsRail.tsx`, `src/index.css` (`.helper-comments*`, `.paper-with-comments`)

---

## Research library (already on this PR)

Step 4 after models finish: NotebookLM grounded brief (default) + By model + Scholar corpus. Sources rail, inspector, skip vs compose. Honest cite counts (findings per source). Internal RAG labeled simulated.

Deep link: `?step=4` seeds MINDEF / Chan Chun Sing and skips the 25s trace.

---

## Prompt for the next window

Paste this:

```
You are continuing Boeing Helper (rexheng/boeing-helper), branch cursor/auditable-research-workspace-5276, PR 24.

Read HANDOFF.md at the repo root first. Then:

1) Verify the Grounded brief inspector stays on screen when you scroll the brief and click superscript citations. If the page still scrolls, lock the research workspace to the viewport or use the same fixed overlay inspector as the Corpus tab. Do not tell the user to open localhost — use the Vercel preview (?step=4).

2) Finish the selling point: Boeing Helper Word comments. The meeting paper body is scaffolding (official template). Do not dump the full research brief into the paper. The intelligence is BH review comments that ask the RIGHT freeze questions (named owner, dated commitment, number we will defend, claims to cut). They must be obvious in the UI (rail is started) AND in the downloaded Word Review pane, anchored on the correct section. Clicking a comment in the rail should highlight the matching field in the on-screen paper.

3) Expand flagship comments beyond Chan/MINDEF (SIA 777-9 credibility, Garuda/Danantara slots, Kemhan F-15EX exit) so every seeded partner gets campaign-true asks.

4) Keep Boeing light institutional design (#0033A1, #0A2240, IBM Plex). No dark glass SaaS.

Commit, push, update PR 24. Give the Vercel preview URL with ?step=4 and ?step=5.
```
