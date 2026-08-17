import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import type { ReviewComment } from "./meetingPaperGenerator"

function clip(text: string, n: number) {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= n) return t
  return t.slice(0, n - 1).trimEnd() + "…"
}

function firstSentence(text: string) {
  const t = text.trim()
  const m = t.match(/^(.+?[.!?])(\s|$)/)
  return (m?.[1] || t).trim()
}

const DISPUTE_RE =
  /\b(delay|slip|mismatch|rather than|cancel|fail|cost|sceptic|skeptic|no longer|unresolved|drag|withdraw|queue|grounded)\b/i

function c(
  id: string,
  anchor: ReviewComment["anchor"],
  sectionLabel: string,
  severity: ReviewComment["severity"],
  text: string,
  quote?: string,
): ReviewComment {
  return { id, anchor, sectionLabel, severity, text, quote }
}

/**
 * Boeing Helper review comments — the selling point.
 * Paper body stays scaffolding. These are the freeze questions a campaign
 * lead would write in the Word Review pane before the paper leaves the building.
 */
export function buildHelperComments(
  research: ResearchResult,
  company: Company,
  person: Person,
  meetingType: string,
): ReviewComment[] {
  const flagged = flagshipComments(person, company)
  if (flagged) return flagged
  return genericComments(research, company, person, meetingType)
}

function flagshipComments(person: Person, company: Company): ReviewComment[] | null {
  const byPerson: Record<string, ReviewComment[]> = {
    "chan-chun-sing": chanComments(),
    "kelvin-fan": fanComments(),
    "aaron-beng": bengComments(),
    "ng-chad-son": ngComments(),
    "goh-choon-phong": gohComments(),
    "lee-lik-hsin": leeComments(),
    "tan-kai-ping": tanComments(),
    "chin-yau-seng": chinComments(),
    "glenny-kairupan": glennyComments(),
    "rosan-roeslani": rosanComments(),
    "rohan-hafas": rohanComments(),
    "andi-fahrurrozi": andiComments(),
    "sjafrie-sjamsoeddin": sjafrieComments(),
    "tonny-harjono": tonnyComments(),
    "rico-sirait": ricoComments(),
    "donny-ermawan": donnyComments(),
  }
  if (byPerson[person.id]) return byPerson[person.id]

  const byCompany: Record<string, ReviewComment[]> = {
    "mindef-sg": mindefFallback(person),
    sia: siaFallback(person),
    garuda: garudaFallback(person),
    "mod-id": kemhanFallback(person),
  }
  return byCompany[company.id] ?? null
}

function chanComments(): ReviewComment[] {
  return [
    c(
      "rc-lane",
      "objectives",
      "Objectives",
      "caution",
      "He owns P-8A induction, Apache life-extension and Chinook sustainment — not the fighter. If objective 1 still reads like a platform pitch, rewrite it around dated induction timing and cost-per-flight-hour. A fighter-adjacent open will get discounted in the first minute.",
    ),
    c(
      "rc-schedule",
      "key_messages",
      "Key messages",
      "ask",
      "Delivery credibility is the live nerve after F-35 and 777-9 slips. Do we have contractual dates for P-8A, or are we still using targets? He will ask. If we cannot name a date we are willing to put in writing, do not lead with schedule language.",
    ),
    c(
      "rc-china",
      "key_messages",
      "Key messages",
      "caution",
      "Confirm the room script does not imply Singapore is choosing sides. He is consistent that purchases are self-defence, not alignment. Strike any US-versus-China framing before this paper leaves the building.",
    ),
    c(
      "rc-steng",
      "objectives",
      "Objectives",
      "ask",
      "Who names ST Engineering and DSTA in the room, and with what sustainment workshare? Local industry participation is a decision criterion, not a follow-up slide. Lock the sentence we will actually say.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the Singapore-side owner for the next written ask before freeze. “Agree owners” is not an objective unless the name is on this paper. Who walks out holding the action?",
    ),
    c(
      "rc-fan",
      "engagement_background",
      "Engagement background",
      "verify",
      "Public marker is MG Fan, Feb 2026, CNA — F-35 and P-8A as game-changers. Who from Boeing was in that conversation, and what is still open? If we cannot answer, the engagement block is a press clipping, not a campaign record.",
    ),
    c(
      "rc-sat",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "Spares and depot turnaround on AH-64D / CH-47 will be weighted above flyaway price. Which readiness number are we prepared to defend in the room? If we do not have it, cut the claim rather than bluff lifecycle cost.",
    ),
    c(
      "rc-bio",
      "biography",
      "Biography",
      "caution",
      "The Fort Worth visit was a Lockheed line, not ours. Do not lead the bio or the opener with fighter adjacency. Productive ground is P-8A, Apache LE and Chinook — existing programmes where reliability beats a new pitch.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel and update the phone field — a meeting paper that cannot reach the integrator is not frozen.",
    ),
  ]
}

function fanComments(): ReviewComment[] {
  return [
    c(
      "rc-p8",
      "objectives",
      "Objectives",
      "ask",
      "He has already called P-8A a game-changer in public. The freeze question is induction timing and training pathway, not whether the type matters. Dated P-8A language, or take schedule off objective 1.",
    ),
    c(
      "rc-rotor",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "AH-64D life-extension and CH-47 sustainment are his fleet, not a side conversation. Which availability or depot-turnaround number do we defend? No number, no claim.",
    ),
    c(
      "rc-f35",
      "key_messages",
      "Key messages",
      "caution",
      "F-35 is Lockheed. If a key message still leans fighter, he will hear a vendor who has not read his own remarks. Stay on maritime patrol, rotorcraft and C4 adjacency.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the RSAF-side owner for the next written ask. CAF meetings that end in “we will follow up” are not frozen.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function bengComments(): ReviewComment[] {
  return [
    c(
      "rc-joint",
      "objectives",
      "Objectives",
      "ask",
      "He is joint-force, not a platform customer. If the objective is a type sale, rewrite it around drones, counter-UAS or readiness lessons he has already flagged from Ukraine and the Red Sea.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Who on the SAF side owns the next written ask? Joint-force meetings die in the gap between service chiefs unless a name is on this paper.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function ngComments(): ReviewComment[] {
  return [
    c(
      "rc-dsta",
      "objectives",
      "Objectives",
      "ask",
      "He is the acquisition and technology gate. Name the DSTA / MINDEF owner and the next written artefact (spec, cost model, or workshare letter) — not a courtesy follow-up.",
    ),
    c(
      "rc-steng",
      "key_messages",
      "Key messages",
      "ask",
      "Local industry through ST Engineering is a decision criterion for him. Lock the workshare sentence we will say, or cut it.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function gohComments(): ReviewComment[] {
  return [
    c(
      "rc-7779",
      "objectives",
      "Objectives",
      "ask",
      "He will not freeze a 777-9 conversation on reassurance. Do we have a dated delivery profile with the new First and Business cabin already installed? If not, objective 1 cannot lead with schedule.",
    ),
    c(
      "rc-slots",
      "key_messages",
      "Key messages",
      "ask",
      "The next contest is at least 50 widebodies — 777X versus A350-1000 — and it will turn on slots, not discount. What slot picture are we willing to put in writing? If none, do not brief it as an open campaign.",
    ),
    c(
      "rc-a350f",
      "key_messages",
      "Key messages",
      "caution",
      "The A350F already won the freighter contest on timeline. Do not reopen it as a live ask. Treat it as evidence of how SIA scores Boeing, not as unfinished business.",
    ),
    c(
      "rc-extension",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "SIA is extending 777-300ERs because we slipped. Which delay-cost number are we prepared to put against that? If we do not have it, say so on the paper rather than bluff “flexibility.”",
    ),
    c(
      "rc-mro",
      "objectives",
      "Objectives",
      "ask",
      "Who names the SIA Engineering / Boeing JV in the room, and with what 787 / 777-9 heavy-check capacity? MRO is part of the relationship, not a leftover slide.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the SIA-side owner for the next written ask. “Agree owners” is scaffolding until a name and a date are on this paper.",
    ),
    c(
      "rc-press",
      "engagement_background",
      "Engagement background",
      "verify",
      "Public marker is Aviation Week, May 2026: no 777-9 in the fleet plan through 31 March 2027. Who from Boeing last walked that with Goh, and what did we leave in writing? A press line is not an engagement record.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel — this paper is not frozen while the integrator is unreachable.",
    ),
  ]
}

function leeComments(): ReviewComment[] {
  return [
    c(
      "rc-network",
      "objectives",
      "Objectives",
      "ask",
      "He converts fleet into network and yield. Bring seat-mile cost, cabin count and cargo capability — or this is a courtesy call. What commercial number are we defending?",
    ),
    c(
      "rc-7779",
      "key_messages",
      "Key messages",
      "caution",
      "He is planning routes around aircraft that may not arrive. Do not sell a 777-9 cabin story without a date he can put in a network model.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the SIA commercial owner for the next written ask, and by when.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function tanComments(): ReviewComment[] {
  return [
    c(
      "rc-ops",
      "objectives",
      "Objectives",
      "ask",
      "He is absorbing 777-9 slippage in operations — extending 777-300ERs and resequencing cabin retrofit. The freeze question is a dated induction plan that operations can actually crew and maintain.",
    ),
    c(
      "rc-cabin",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "First 777-9s must arrive with the new cabin installed. Is interiors supply on our critical path, or are we still treating it as the airline’s problem?",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the SIA operations owner for the next written artefact.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function chinComments(): ReviewComment[] {
  return [
    c(
      "rc-mro",
      "objectives",
      "Objectives",
      "ask",
      "He runs Changi’s MRO anchor. The live ask is 787 and future 777-9 heavy-check capacity — name the slot or the JV workshare, or cut MRO from the objective.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the SIAEC-side owner for the next written ask.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function glennyComments(): ReviewComment[] {
  return [
    c(
      "rc-serviceability",
      "objectives",
      "Objectives",
      "caution",
      "He has said serviceability is the number that decides everything else — 68 Garuda aircraft by end-2026. If objective 1 still leads with the 50-jet order, rewrite it around spares, engine TAT and heavy-check support. New metal is politically real and operationally second.",
    ),
    c(
      "rc-tat",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "Which engine / APU / landing-gear turnaround number are we prepared to defend for the 737-800NG and 777-300ER fleets? If we do not have it, cut the aftermarket claim.",
    ),
    c(
      "rc-gmf",
      "objectives",
      "Objectives",
      "ask",
      "Who names GMF AeroAsia in the room, and with what workshare? Routing maintenance inside Indonesia is a decision criterion, not a follow-up.",
    ),
    c(
      "rc-max",
      "key_messages",
      "Key messages",
      "caution",
      "Do not raise the 737 MAX unless he does. Lion Air 610 is Indonesian; a state carrier will not thank us for putting the type on the table unasked.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the Garuda-side owner for the next written ask. Turnaround meetings that end without a name are not frozen.",
    ),
    c(
      "rc-press",
      "engagement_background",
      "Engagement background",
      "verify",
      "Public marker is Tempo, March 2026 — 68 serviceable aircraft. Who from Boeing last walked the heavy-check programme with him, and what is still open?",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function rosanComments(): ReviewComment[] {
  return [
    c(
      "rc-trade",
      "objectives",
      "Objectives",
      "ask",
      "This is a trade deliverable, not an airline ops meeting. The 50-aircraft Boeing commitment sits inside the US–Indonesia tariff package. What dated slot and financing structure are we willing to put in writing, or is this still a headline?",
    ),
    c(
      "rc-queue",
      "key_messages",
      "Key messages",
      "ask",
      "Danantara has said the seven-year queue is why the commitment has not converted. If we cannot move a slot, do not brief conversion as this meeting’s objective.",
    ),
    c(
      "rc-finance",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "Financing is unresolved — injection, lease, or export credit. Who answers that in the room, with what term sheet? Silence reads as we expected the state to just pay.",
    ),
    c(
      "rc-industry",
      "objectives",
      "Objectives",
      "ask",
      "He scores national return: GMF, training, supply-chain participation. Lock the industrial sentence we will actually say. Vague “partnership” language will not survive him.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the Danantara-side owner for the next written artefact. He holds the capital; an airline-only owner is the wrong name.",
    ),
    c(
      "rc-press",
      "engagement_background",
      "Engagement background",
      "verify",
      "Public marker is Tempo / Antara, Feb 2026 — ready to buy 50, queue and financing unresolved. Who from Boeing last sat with him, and what did we leave in writing?",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function rohanComments(): ReviewComment[] {
  return [
    c(
      "rc-slots",
      "objectives",
      "Objectives",
      "ask",
      "He has already said the seven-year delivery queue is the blocker. Bring a slot, not a brochure. If we cannot name one, this meeting has no objective.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the Danantara stakeholder-management owner for the next written ask.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function andiComments(): ReviewComment[] {
  return [
    c(
      "rc-gmf",
      "objectives",
      "Objectives",
      "ask",
      "He runs GMF. The freeze question is third-party 737 and widebody heavy-check volume Boeing will actually route — name a number or a hangar slot, or cut the MRO objective.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the GMF-side owner for the next written ask.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function sjafrieComments(): ReviewComment[] {
  return [
    c(
      "rc-f15",
      "objectives",
      "Objectives",
      "caution",
      "The F-15EX campaign is closed. Boeing said so at the Singapore Airshow; Jakarta framed it as price, not policy. If objective 1 still reads like a fighter reopen, cut it. Constructive ground is Apache sustainment, ScanEagle / ISR, and the commercial 50-jet trade track we do not own but can spoil.",
    ),
    c(
      "rc-price",
      "key_messages",
      "Key messages",
      "ask",
      "He will walk away from a platform he considers overpriced — he already did. Any live offer needs a financing structure, not a capability brief. If we cannot table terms, we should not table a type.",
    ),
    c(
      "rc-offset",
      "objectives",
      "Objectives",
      "ask",
      "Offset through PTDI / Pindad / PAL is statutory (Law 16/2012), not a nice-to-have. Who names the local-content sentence in the room? Vague industrial language is non-responsive.",
    ),
    c(
      "rc-apache",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "Eight AH-64Es are the installed base. Which readiness or spares number do we defend? Existing programmes are how this relationship survives the fighter exit.",
    ),
    c(
      "rc-align",
      "key_messages",
      "Key messages",
      "caution",
      "Do not frame this as choosing sides. Bebas aktif is identity, not a talking point. Strike any US-versus-China line before freeze.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the Kemhan-side owner for the next written ask. Nothing significant moves without him — an air-force-only name is the wrong owner.",
    ),
    c(
      "rc-press",
      "engagement_background",
      "Engagement background",
      "verify",
      "Public marker is Janes / Jakarta Post, Feb 2026 — no active F-15EX campaign. Confirm the room script matches that, and who from Boeing last sat with the ministry after the exit.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function tonnyComments(): ReviewComment[] {
  return [
    c(
      "rc-radar",
      "objectives",
      "Objectives",
      "ask",
      "His public priority is radar coverage and readiness across the archipelago, not a new fighter. If the objective is still F-15EX-adjacent, rewrite it around Apache availability, ScanEagle / ISR, or a concrete contribution to the surveillance picture.",
    ),
    c(
      "rc-apache",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "He will engage on availability data and spares turnaround in specifics. Which AH-64E number do we defend? Generalities about partnership will not hold.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the TNI-AU owner for the next written ask.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function ricoComments(): ReviewComment[] {
  return [
    c(
      "rc-mismatch",
      "key_messages",
      "Key messages",
      "caution",
      "He is the public voice who framed the F-15EX exit as a price mismatch, not a policy shift. Confirm our talking points match that line. Re-litigating capability in his presence is a miss.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name who on the Boeing side answers the next public question, and with what approved sentence.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function donnyComments(): ReviewComment[] {
  return [
    c(
      "rc-offset",
      "objectives",
      "Objectives",
      "ask",
      "He scores offset and local content. Lock the PTDI / industrial sentence and the financing tail — or this meeting has no artefact.",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the deputy-minister-side owner for the next written ask.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function mindefFallback(person: Person): ReviewComment[] {
  return [
    c(
      "rc-lane",
      "objectives",
      "Objectives",
      "caution",
      `Productive ground with ${person.name} is P-8A, Apache life-extension and Chinook sustainment — not the fighter. If objective 1 still reads like a platform pitch, rewrite it.`,
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the Singapore-side owner for the next written ask. “Agree owners” is not an objective unless the name is on this paper.",
    ),
    c(
      "rc-sat",
      "cust_sat",
      "Customer satisfaction",
      "ask",
      "Which AH-64D / CH-47 readiness number are we prepared to defend? If we do not have it, cut the lifecycle claim.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function siaFallback(person: Person): ReviewComment[] {
  return [
    c(
      "rc-7779",
      "objectives",
      "Objectives",
      "ask",
      `With ${person.name}: dated 777-9 delivery with cabin installed, or take schedule off the objective. Reassurance will not freeze this paper.`,
    ),
    c(
      "rc-slots",
      "key_messages",
      "Key messages",
      "ask",
      "The next widebody contest turns on slots. What picture are we willing to put in writing?",
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the SIA-side owner for the next written ask, and by when.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function garudaFallback(person: Person): ReviewComment[] {
  return [
    c(
      "rc-serviceability",
      "objectives",
      "Objectives",
      "caution",
      `Do not lead ${person.name} with the 50-jet order unless they are Danantara. Operational freeze questions are serviceability, spares and GMF workshare.`,
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name who walks out holding the next written ask to Boeing, and by when.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function kemhanFallback(person: Person): ReviewComment[] {
  return [
    c(
      "rc-f15",
      "objectives",
      "Objectives",
      "caution",
      `F-15EX is closed. With ${person.name}, stay on Apache, ISR / ScanEagle, offset and financing — or this paper is a reopen he did not ask for.`,
    ),
    c(
      "rc-owner",
      "objectives",
      "Objectives",
      "ask",
      "Name the Kemhan-side owner for the next written ask.",
    ),
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Rex Heng’s in-country mobile is still a placeholder. Verify before travel.",
    ),
  ]
}

function genericComments(
  research: ResearchResult,
  company: Company,
  person: Person,
  meetingType: string,
): ReviewComment[] {
  const comments: ReviewComment[] = []
  const country = research.country
  const news = research.company.recent_news
  const disputed = news.find((n) => DISPUTE_RE.test(n.headline))
  const metric = research.company.key_metrics[0]
  const concern = country?.concerns?.[0]
  const priority = country?.priorities?.[0]
  const read = research.person.profile_overview

  comments.push(
    c(
      "rc-objective-owner",
      "objectives",
      "Objectives",
      "ask",
      `Who walks out of this ${meetingType} with ${company.name} holding the next written ask to Boeing, and by when? “Agree owners” is scaffolding until a name and a date are on the paper.`,
    ),
  )

  if (priority) {
    comments.push(
      c(
        "rc-priority",
        "objectives",
        "Objectives",
        "ask",
        `Their stated priority is “${clip(priority, 140)}.” Is that actually on today’s agenda, or are we projecting it? If it is not in the room, cut it from objective 1 rather than brief a ghost conversation.`,
      ),
    )
  }

  if (read) {
    comments.push(
      c(
        "rc-read",
        "key_messages",
        "Key messages",
        "caution",
        `Read on ${person.name}: ${clip(firstSentence(read), 180)} If a key message fights that read, it will be discounted. Rewrite the opener to match how this counterpart actually decides.`,
      ),
    )
  }

  if (concern) {
    comments.push(
      c(
        "rc-concern",
        "cust_sat",
        "Customer satisfaction",
        "caution",
        `Live sensitivity: ${clip(concern, 160)} Do we have programme evidence for the room, or only a talking point? If we cannot defend it, put the gap on the paper as an open item — do not bluff.`,
      ),
    )
  }

  if (disputed) {
    comments.push(
      c(
        "rc-press",
        "engagement_background",
        "Engagement background",
        "ask",
        `Press will be in the room whether we raise it or not: “${clip(disputed.headline, 140)}” (${disputed.source}${disputed.date ? `, ${disputed.date}` : ""}). Who answers it, and with what dated fact? Silence reads as confirmation.`,
      ),
    )
  } else if (news[0]) {
    comments.push(
      c(
        "rc-press",
        "engagement_background",
        "Engagement background",
        "verify",
        `Public marker: “${clip(news[0].headline, 140)}” (${news[0].source}${news[0].date ? `, ${news[0].date}` : ""}). Confirm this is still the latest Boeing-side reading, and add who attended the last touchpoint.`,
      ),
    )
  }

  if (metric) {
    comments.push(
      c(
        "rc-metric",
        "campaign_background",
        "Campaign background",
        "verify",
        `${metric.label} is on the paper as ${metric.value}. Is that still current as of this week, and what is the source? A stale metric in the campaign block is worse than a blank.`,
      ),
    )
  }

  comments.push(
    c(
      "rc-phone",
      "contact",
      "Contact",
      "verify",
      "Verify the Regional Integrator’s in-country number before travel. A meeting paper that cannot reach the integrator is not frozen.",
    ),
  )

  return comments
}
