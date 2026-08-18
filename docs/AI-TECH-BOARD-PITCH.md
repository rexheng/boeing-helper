# Boeing Helper — AI Technical Board pitch

Short answers for the board questions. Status: **proof of concept** (SEA air-show / IBD trip-book demo). Items marked **TBD** need a named owner before a production gate.

---

## What is the problem, who is the user, and why is AI needed?

**Problem.** IBD meeting papers and biographies are assembled by hand across a 12-step chain (customer list → integrator skeleton → regional updates → Gov Ops / CTL → RD → edits → IBD VP → BD&S LT → integrator → trip book). A late counterpart or fact change restarts RD review. Air-show calendars are high-volume and unstable.

**User.** Regional Integrators and the people they support: campaign / capture leads, country directors, programme managers, Gov Ops / CTL, RD, IBD VP, BD&S LT. First scenario: Southeast Asia air-show bilaterals (ministers, air-force leadership, airline CEOs).

**Why AI.** The work is synthesis under time pressure: organisation + biography + programme + country context from uploads, internal records, and published sources. Humans cannot re-assemble a consistent, source-labelled pack for every late change. AI is the collector and first drafter; the integrator remains the reviewer.

---

## How will the new automation / AI change how the user does their job?

Today: 12 handoffs, one restart loop per change, inconsistent papers across RD / IBD / field.

With Helper: **select counterpart → run research → review & export.** One shared briefing (PDF / Word / Excel) for RD, IBD VP, and the trip book. Late updates regenerate the pack without restarting the chain. The job shifts from assembling to **checking claims, filling missing context (Helper comments), and locking the paper.**

---

## Components — reuse / buy / adapt / build / collaborate

| Lane | What |
| --- | --- |
| **Reuse** | Boeing meeting-paper / invitation templates; trip-book PDF workflow; campaign packs and account records as first-authority sources; existing IBD / RD review roles. |
| **Buy** | Boeing-approved LLM / AI Gateway (not a public demo key); enterprise search / RAG over internal knowledge; identity (SSO); document store. External contact enrichment only if Legal / ITAR-cleared (Apollo-class tools are PoC-only). |
| **Adapt** | Official Word templates (paper is scaffolding; Helper comments carry missing intel); attendee dashboard / Excel twin; citation precedence (uploads → internal → published); FMS cheat-sheet pack using the same pipeline. |
| **Build** | Orchestration UI; three research lanes (company / industry / country); grounded brief with inspector; meeting-paper + Word comments; attendee / report update review; PDF / Word / Excel export. |
| **Collaborate** | IBD SEA + Regional Integrators; RD / Gov Ops / CTL; BD&S; IT Business Partners; Human Factors Engineering; AI Innovation Lab; AI Technical Board; Legal / Export / Security for classification and ITAR. |

---

## Can this solution be re-used in the future?

Yes. The object is not “MSPO 2026” — it is **counterpart + meeting type + sourced brief + official template**. Same system covers other air shows, government / ministry engagements, airline account reviews, FMS cheat sheets, and other regions already modelled (Northeast Asia, India, ANZ, Middle East). New events are new data and templates, not a new product.

---

## Bigger challenges — how the Boeing AI Technical Board can help

**Challenges**

1. **Grounding.** Executive-facing numbers (fleet, orders, offsets) cannot hallucinate. Need approved RAG, citation enforcement, and a “no source → no claim” rule.
2. **Classification / ITAR / CUI.** Mixing campaign packs with open web. Need data-boundary design, not a public SaaS pattern.
3. **System of record.** PoC is seeded + agents. Scale needs Boeing knowledge systems, not a parallel wiki.
4. **Human trust.** Integrators will not ship a paper they cannot inspect. The inspector and Helper comments are the product, not the raw model text.
5. **Identity and hosting.** PoC is external preview; production must sit on Boeing-approved infra (Innovation Lab → enterprise).

**Ask of the Board**

- Name the **approved model / gateway** and RAG pattern for internal + published sources.
- Path for **AI risk assessment**, data classification, and export-control review.
- Slot in the **AI Innovation Lab** for a SEA pilot (one event, one integrator team).
- Introductions to **IT BPs, HFE, and a Technical Fellow** for grounded generation + human review.
- Guidance on what must be **on-prem / VPC** vs. allowed gateway inference.

---

## If this works — own / sustain / deploy, and the biggest blocker

| Role | Proposed |
| --- | --- |
| **Own (functional)** | IBD / BD&S (trip-book and bilateral quality). |
| **Sustain** | IT application owner + IBD process owner (templates, corpus, review SLAs). |
| **Deploy** | IT + AI Innovation Lab, then enterprise hosting behind SSO. |

**Biggest blocker to transition / scale:** connecting to **authoritative internal data** (account, programme, prior papers) under the right classification — not the UI. Second: a named **exec sponsor + FCE** so this is an IBD process tool, not a demo.

---

## Data strategies & approaches

- **Three-lane collect:** uploads (campaign pack) · internal knowledge · published research — in parallel.
- **Precedence:** uploads beat internal beat press. Conflicts stay labelled, not silently merged.
- **Grounding:** every figure is citable; inspector opens the excerpt; PDF/Word export carries the same labels.
- **Human freeze:** paper body stays short official language; Helper comments flag missing name / date / number / over-claim for the integrator.
- **PoC vs production:** demo uses a curated SEA corpus + optional live agents. Production = RAG over approved corpora, no public-web free-for-all on CUI.

---

## Valuation — estimated business value

Value creation is **cycle time + consistency + risk**, then **capture enablement**.

| Lever | Evidence / estimate |
| --- | --- |
| Process compression | **12 handoffs → 3 steps** (product workflow). Removes the RD restart loop on late changes. |
| Air-show volume | One show = many bilaterals, often re-cut the night before. Saving even **2–4 hours per paper** across a delegation is the operational win. |
| Quality / risk | Source-labelled fleet, order, and offset facts; uploads win over trade press. Fewer wrong numbers in front of a minister. |
| Reuse | Same pipeline for FMS cheat sheet and non-SEA regions — value compounds after the first event. |
| Revenue | Indirect: better-prepared IBD engagements. Do **not** claim a $ win until a sponsor signs a baseline (papers per show × hours × loaded rate). |

**Suggested baseline to quantify with IBD (one workshop):** papers per event × hours today × fully loaded integrator/RD time × events per year. Helper does not replace reviewers; it removes assembly and rework.

---

## RoM cost — funding source and cost type

| Phase | RoM | Cost type | Funding (proposed) |
| --- | --- | --- | --- |
| **PoC (now)** | Already built (demo). Inference optional. | OPEX, innovation | Existing demo / lab time |
| **Pilot (1 region, 1 event)** | **$150k–$400k** — approved gateway, RAG spike, SSO, HFE pass, security/risk, integrator time | OPEX; some integration CAPEX | AI Innovation Lab + IBD SEA |
| **Scale (multi-region, systems of record)** | **$0.8M–$2M** first year — knowledge connectors, classification, sustainment, template ops | Mix: integration project + run-rate inference / support | BU (BD&S / IBD) with IT sustainment |

Figures are order-of-magnitude for board discussion, not a bid. Largest cost is **integration and compliance**, not the model call.

---

## Exec sponsor / functional owner / FCE / BU partner

| Seat | Status |
| --- | --- |
| **Exec sponsor** | **TBD** — proposed: IBD VP (papers already route here). |
| **Functional owner** | **TBD** — proposed: Regional Integrator / IBD SEA process owner. |
| **FCE** | **TBD** — need Board / IT to name. |
| **BU partner** | BD&S (trip book, FMS cheat sheet, LT / VPGM review). |

Do not proceed past pilot without the sponsor and FCE named.

---

## Have you completed the AI risk assessment?

**No.** PoC only. Required before any live Boeing data or production users. Scope: hallucination on programme facts, CUI/ITAR mixing, third-party APIs, recording/meeting copilot (if retained), and export of papers.

---

## What design practices apply?

- Human-in-the-loop: integrator reviews before the room.
- Grounded generation + citation; no unsourced numeric claims.
- Source precedence and conflict visibility.
- Official templates (do not invent a parallel paper format).
- Helper comments as the freeze mechanism (ask, don’t silently fill).
- Least privilege / SSO; no training on customer CUI without policy.
- Evaluation set: SEA gold briefs vs. model output (fleet, orders, titles).
- Boeing brand / institutional UI — not consumer AI chrome.

---

## Have you worked with IT Business Partners?

**Not yet (PoC).** Plan: IT BP for identity, hosting (Innovation Lab → enterprise), knowledge-system connectors, and API/gateway standards. Required for pilot.

---

## Have you worked with Human Factors Engineering?

**Not yet (PoC).** The demo already treats review as the product (inspector, Word-style comment rail, field highlight). **Engage HFE** on: paper-in-template workflow, comment vs. body, attendee dashboard, and time-to-trust before a bilateral.

---

## Current and future infrastructure needs

*(Reference: AI Innovation Lab)*

| Now (PoC) | Next (Lab pilot) | Later (enterprise) |
| --- | --- | --- |
| Vite/React demo, Express API, seeded SEA corpus, optional LLM + research agents, Vercel preview | Approved AI Gateway, RAG over a classified-appropriate corpus, SSO, audit logs, Innovation Lab hosting | Boeing knowledge / document systems, SharePoint or equivalent for papers, CRM/account data, enterprise secrets, monitoring, DR |

No production dependency on public preview hosting or uncleared third-party contact APIs.

---

## SMEs, TFs, BDEs — engaged or planned

| Who | Status |
| --- | --- |
| Regional Integrators (SEA first) | **Planned** — primary users; attendee roles already modelled |
| Gov Ops / CTL, RD, IBD VP staff | **Planned** — current review chain |
| Campaign / capture, country directors, programme managers | **Planned** — FAQ user set |
| Technical Fellow — NLP / grounded RAG | **Planned** — Board intro |
| BDE — BD&S / commercial or defence capture | **Planned** — value baseline + FMS cheat sheet |
| HFE, Security / Export, IT BP | **Planned** — see above |
| Air-show / Show Ops | **Planned** — late roster and report updates |

**Engaged today:** product/engineering on the PoC only. Named SME list is the first ask after this pitch.
