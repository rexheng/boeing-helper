# Handoff — Research inspector + Meeting Paper Helper comments

**Repo:** `rexheng/boeing-helper`  
**Branch:** `cursor/auditable-research-workspace-5276`  
**PR:** https://github.com/rexheng/boeing-helper/pull/24

---

## Done this pass

### 1. Inspector stays in view
Research step (`?step=4`) locks the demo shell to the viewport. The Grounded brief scrolls **inside the middle pane**. The inspector stays in the right column. Citation clicks flash the inspector.

Mobile (`max-width: 860px`) still uses the overlay inspector.

### 2. Paper = scaffolding; Boeing Helper comments = the product
- Flagship freeze comments for Chan/MINDEF, SIA (Goh, Lee, Tan, Chin), Garuda (Glenny, Rosan, Rohan, Andi), Kemhan (Sjafrie, Tonny, Rico, Donny).
- Paper bodies are short official template language. Missing intelligence is in BH comments (name / date / number / cut the claim).
- UI: yellow Word-style rail + sticky banner. Click a comment to highlight the matching field in the on-screen editor.
- Downloaded Word comments still inject as author **Boeing Helper** / initials **BH**, now preferring the field `quote` as the XML anchor.

---

## Still worth checking

1. Click a rail comment — the matching paragraph in `@docx-editor.dev` should highlight yellow. If the editor uses an inaccessible canvas, the banner still states the freeze question.
2. Download Word and confirm comments sit on the right section (Objectives, Key messages, etc.), not dumped at `</w:body>`.
3. Deep-link `?step=4` (inspector) and `?step=5` (paper + comments). Preview may require Vercel SSO.

---

## Prompt if you continue

```
You are continuing Boeing Helper, branch cursor/auditable-research-workspace-5276, PR 24.

Read HANDOFF.md. Verify:

1) ?step=4 Grounded brief: scroll the middle pane, click superscripts — inspector stays on screen.
2) ?step=5: paper is short scaffolding; BH comments are the product. Clicking a rail card highlights the field. Download Word and check Review pane anchors.
3) Keep Boeing light institutional design. Do not tell the user to open localhost — give the Vercel preview URL.
```
