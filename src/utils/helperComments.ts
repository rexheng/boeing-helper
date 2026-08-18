import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import type { ReviewComment } from "./meetingPaperGenerator"

function clip(text: string, n: number) {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= n) return t
  return t.slice(0, n - 1).trimEnd() + "…"
}

/**
 * Boeing Helper comments — missing context only.
 * One short topic + a 1–2 sentence question. No opinions, no Key messages.
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

function gap(id: string, anchor: string, topic: string, text: string): ReviewComment {
  return {
    id,
    anchor,
    topic,
    sectionLabel: topic,
    severity: "ask",
    text,
  }
}

const PHONE = gap(
  "rc-phone",
  "contact",
  "Integrator phone number",
  "What is Rex Heng’s in-country mobile? The field is still a placeholder.",
)

function flagshipComments(person: Person, company: Company): ReviewComment[] | null {
  const byPerson: Record<string, ReviewComment[]> = {
    "chan-chun-sing": chanComments(),
    "kelvin-fan": fanComments(),
    "aaron-beng": mindefFallback(),
    "ng-chad-son": ngComments(),
    "goh-choon-phong": gohComments(),
    "lee-lik-hsin": siaFallback(),
    "tan-kai-ping": tanComments(),
    "chin-yau-seng": chinComments(),
    "glenny-kairupan": glennyComments(),
    "rosan-roeslani": rosanComments(),
    "rohan-hafas": rohanComments(),
    "andi-fahrurrozi": andiComments(),
    "sjafrie-sjamsoeddin": sjafrieComments(),
    "tonny-harjono": tonnyComments(),
    "rico-sirait": kemhanFallback(),
    "donny-ermawan": donnyComments(),
    "robert-isom": isomComments(),
    "david-seymour": seymourComments(),
    "devon-may": mayComments(),
    "nat-pieper": pieperComments(),
    "ed-bastian": bastianComments(),
    "peter-carter": carterComments(),
    "dan-janki": jankiComments(),
    "alain-bellemare": bellemareComments(),
  }
  if (byPerson[person.id]) return byPerson[person.id]

  const byCompany: Record<string, () => ReviewComment[]> = {
    "mindef-sg": mindefFallback,
    sia: siaFallback,
    garuda: garudaFallback,
    "mod-id": kemhanFallback,
    american: americanFallback,
    delta: deltaFallback,
  }
  return byCompany[company.id]?.() ?? null
}

function chanComments(): ReviewComment[] {
  return [
    gap(
      "rc-schedule",
      "objectives",
      "P-8A delivery dates",
      "What is the contractual P-8A delivery date, or is the paper still using a target?",
    ),
    gap(
      "rc-steng",
      "objectives",
      "ST Engineering workshare",
      "What sustainment workshare for ST Engineering and DSTA goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who is the Singapore-side owner for the next written ask, and by what date?",
    ),
    gap(
      "rc-fan",
      "engagement_background",
      "Fan CNA meeting",
      "Who from Boeing was in the February 2026 CNA conversation with MG Fan, and what is still open?",
    ),
    gap(
      "rc-sat",
      "cust_sat",
      "Apache Chinook readiness",
      "What AH-64D / CH-47 readiness or depot-turnaround number is on this paper?",
    ),
    PHONE,
  ]
}

function fanComments(): ReviewComment[] {
  return [
    gap(
      "rc-p8",
      "objectives",
      "P-8A induction date",
      "What P-8A induction date and training pathway go on this paper?",
    ),
    gap(
      "rc-rotor",
      "cust_sat",
      "Apache Chinook numbers",
      "What AH-64D / CH-47 availability or depot-turnaround number is on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who on the RSAF side owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function ngComments(): ReviewComment[] {
  return [
    gap(
      "rc-dsta",
      "objectives",
      "Next written artefact",
      "What is the next written item for DSTA / MINDEF — spec, cost model, or workshare letter — and who owns it?",
    ),
    gap(
      "rc-steng",
      "objectives",
      "ST Engineering workshare",
      "What ST Engineering workshare sentence goes on this paper?",
    ),
    PHONE,
  ]
}

function gohComments(): ReviewComment[] {
  return [
    gap(
      "rc-7779",
      "objectives",
      "777-9 delivery date",
      "What dated 777-9 delivery, with the new cabin installed, goes on this paper?",
    ),
    gap(
      "rc-slots",
      "objectives",
      "Next-order slot picture",
      "What delivery slots for the next widebody order are we putting in writing?",
    ),
    gap(
      "rc-extension",
      "cust_sat",
      "777-300ER delay cost",
      "What cost figure for extending the 777-300ERs is on this paper?",
    ),
    gap(
      "rc-mro",
      "objectives",
      "SIAEC JV capacity",
      "What 787 / 777-9 heavy-check capacity or workshare for the SIA Engineering JV goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at SIA owns the next written ask, and by what date?",
    ),
    gap(
      "rc-press",
      "engagement_background",
      "Last Boeing attendees",
      "Who from Boeing last discussed the May 2026 Aviation Week fleet-plan item with Goh, and what was left in writing?",
    ),
    PHONE,
  ]
}

function tanComments(): ReviewComment[] {
  return [
    gap(
      "rc-ops",
      "objectives",
      "777-9 induction plan",
      "What dated 777-9 induction plan for operations goes on this paper?",
    ),
    gap(
      "rc-cabin",
      "cust_sat",
      "Cabin install path",
      "Is interiors supply on Boeing’s critical path for the first 777-9s, and who owns it?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who in SIA operations owns the next written item, and by what date?",
    ),
    PHONE,
  ]
}

function chinComments(): ReviewComment[] {
  return [
    gap(
      "rc-mro",
      "objectives",
      "Heavy-check capacity",
      "What 787 / 777-9 heavy-check slot or JV workshare for SIAEC goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at SIAEC owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function glennyComments(): ReviewComment[] {
  return [
    gap(
      "rc-tat",
      "cust_sat",
      "Engine turnaround time",
      "What engine / APU / landing-gear turnaround number for the 737-800NG and 777-300ER is on this paper?",
    ),
    gap(
      "rc-gmf",
      "objectives",
      "GMF workshare",
      "What GMF AeroAsia workshare goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at Garuda owns the next written ask, and by what date?",
    ),
    gap(
      "rc-press",
      "engagement_background",
      "Last Boeing attendees",
      "Who from Boeing last walked the 68-aircraft heavy-check programme, and what is still open?",
    ),
    PHONE,
  ]
}

function rosanComments(): ReviewComment[] {
  return [
    gap(
      "rc-slots",
      "objectives",
      "50-jet delivery slots",
      "What dated delivery slot for the 50-aircraft commitment goes on this paper?",
    ),
    gap(
      "rc-finance",
      "cust_sat",
      "Financing structure",
      "Is financing an injection, a lease, or export credit, and who has the term sheet?",
    ),
    gap(
      "rc-industry",
      "objectives",
      "Industrial return items",
      "What GMF, training, or supply-chain items go on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at Danantara owns the next written item, and by what date?",
    ),
    gap(
      "rc-press",
      "engagement_background",
      "Last Boeing attendees",
      "Who from Boeing last sat with Minister Rosan on the 50-aircraft commitment, and what was left in writing?",
    ),
    PHONE,
  ]
}

function rohanComments(): ReviewComment[] {
  return [
    gap(
      "rc-slots",
      "objectives",
      "Delivery slot date",
      "What delivery slot, earlier than the seven-year queue, goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at Danantara owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function andiComments(): ReviewComment[] {
  return [
    gap(
      "rc-gmf",
      "objectives",
      "GMF hangar volume",
      "What third-party 737 or widebody heavy-check volume for GMF goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at GMF owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function sjafrieComments(): ReviewComment[] {
  return [
    gap(
      "rc-apache",
      "cust_sat",
      "Apache readiness number",
      "What AH-64E readiness or spares number is on this paper?",
    ),
    gap(
      "rc-offset",
      "objectives",
      "PTDI local content",
      "What local-content / PTDI sentence goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at Kemhan owns the next written ask, and by what date?",
    ),
    gap(
      "rc-press",
      "engagement_background",
      "Last Boeing attendees",
      "Who from Boeing last sat with the ministry after the February 2026 F-15EX notice?",
    ),
    PHONE,
  ]
}

function tonnyComments(): ReviewComment[] {
  return [
    gap(
      "rc-apache",
      "cust_sat",
      "Apache readiness number",
      "What AH-64E availability or spares-turnaround number is on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at TNI-AU owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function donnyComments(): ReviewComment[] {
  return [
    gap(
      "rc-offset",
      "objectives",
      "Offset and financing",
      "What PTDI / local-content sentence and financing terms go on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who in the deputy minister’s office owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function mindefFallback(): ReviewComment[] {
  return [
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who is the Singapore-side owner for the next written ask, and by what date?",
    ),
    gap(
      "rc-sat",
      "cust_sat",
      "Apache Chinook numbers",
      "What AH-64D / CH-47 readiness number is on this paper?",
    ),
    PHONE,
  ]
}

function siaFallback(): ReviewComment[] {
  return [
    gap(
      "rc-7779",
      "objectives",
      "777-9 delivery date",
      "What dated 777-9 delivery, with cabin installed, goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at SIA owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function garudaFallback(): ReviewComment[] {
  return [
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who owns the next written ask to Boeing, and by what date?",
    ),
    PHONE,
  ]
}

function kemhanFallback(): ReviewComment[] {
  return [
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at Kemhan owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function isomComments(): ReviewComment[] {
  return [
    gap(
      "rc-max8",
      "objectives",
      "737-8 MAX reliability",
      "What 737-8 MAX first-90-day reliability or AOG figure (89 in service per the 10-K) goes on this paper?",
    ),
    gap(
      "rc-787",
      "objectives",
      "787-9 Flagship calendar",
      "What dated 787-9 / Flagship Suite install calendar matches the newsroom product claim?",
    ),
    gap(
      "rc-max10",
      "cust_sat",
      "MAX 10 certification date",
      "What MAX 10 certification date is on this paper, given 115 737-family aircraft sit in 2029 and thereafter on the 10-K?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at American owns the next written ask, and by what date?",
    ),
    gap(
      "rc-press",
      "engagement_background",
      "Last Boeing attendees",
      "Who from Boeing last discussed the 27 January 2026 newsroom earnings release with Isom, and what was left in writing?",
    ),
    PHONE,
  ]
}

function seymourComments(): ReviewComment[] {
  return [
    gap(
      "rc-ops",
      "objectives",
      "MAX induction plan",
      "What 737-8 MAX spares and AOG plan for the DFW 13-bank goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who in American operations owns the next written item, and by what date?",
    ),
    PHONE,
  ]
}

function mayComments(): ReviewComment[] {
  return [
    gap(
      "rc-capex",
      "objectives",
      "PDP if certification moves",
      "What happens to pre-delivery payments if MAX 10 certification moves — is that in writing?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who in American finance owns the next written artefact, and by what date?",
    ),
    PHONE,
  ]
}

function pieperComments(): ReviewComment[] {
  return [
    gap(
      "rc-cabin",
      "objectives",
      "Premium-seat calendar",
      "What premium-seat delivery calendar for 787-9 Flagship Suite and 777 retrofit goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who on the commercial side owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function americanFallback(): ReviewComment[] {
  return [
    gap(
      "rc-max10",
      "objectives",
      "MAX 10 date",
      "What MAX 10 certification date goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at American owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function bastianComments(): ReviewComment[] {
  return [
    gap(
      "rc-73710",
      "objectives",
      "737-10 EIS date",
      "What dated 737-10 EIS (10-K: 27 aircraft in 2027, none in 2026) goes on this paper?",
    ),
    gap(
      "rc-787",
      "objectives",
      "787-10 working group",
      "What 787-10 cabin / GEnx working-group charter is in writing for the 2031 stream?",
    ),
    gap(
      "rc-techops",
      "objectives",
      "TechOps workshare",
      "What LEAP-1B / GEnx TechOps workshare goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at Delta owns the next written ask, and by what date?",
    ),
    gap(
      "rc-press",
      "engagement_background",
      "Last Boeing attendees",
      "Who from Boeing last discussed the 12 January 2026 787-10 8-K with Bastian, and what was left in writing?",
    ),
    PHONE,
  ]
}

function carterComments(): ReviewComment[] {
  return [
    gap(
      "rc-cabin",
      "objectives",
      "787 vs A350 product",
      "What 787-10 cabin specification sits in the same product family as the A350?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who in the President’s office owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function jankiComments(): ReviewComment[] {
  return [
    gap(
      "rc-eis",
      "objectives",
      "737-10 training plan",
      "What 737-10 training, spares and maintenance-programme plan assumes 2027 — and what is the written cost if that date moves?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who in Delta operations owns the next written item, and by what date?",
    ),
    PHONE,
  ]
}

function bellemareComments(): ReviewComment[] {
  return [
    gap(
      "rc-mro",
      "objectives",
      "LEAP-1B / GEnx shop",
      "What TechOps LEAP-1B workshare, and GEnx path for 787-10, goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at TechOps owns the next written artefact, and by what date?",
    ),
    PHONE,
  ]
}

function deltaFallback(): ReviewComment[] {
  return [
    gap(
      "rc-73710",
      "objectives",
      "737-10 EIS date",
      "What dated 737-10 EIS goes on this paper?",
    ),
    gap(
      "rc-owner",
      "objectives",
      "Next-action owner",
      "Who at Delta owns the next written ask, and by what date?",
    ),
    PHONE,
  ]
}

function genericComments(
  research: ResearchResult,
  company: Company,
  _person: Person,
  meetingType: string,
): ReviewComment[] {
  const comments: ReviewComment[] = [
    gap(
      "rc-objective-owner",
      "objectives",
      "Next-action owner",
      `Who at ${company.name} owns the next written ask after this ${meetingType}, and by what date?`,
    ),
  ]

  const news = research.company.recent_news[0]
  if (news) {
    comments.push(
      gap(
        "rc-press",
        "engagement_background",
        "Last Boeing attendees",
        `Who from Boeing last discussed “${clip(news.headline, 80)}” (${news.source}${news.date ? `, ${news.date}` : ""}), and what was left in writing?`,
      ),
    )
  }

  const metric = research.company.key_metrics[0]
  if (metric) {
    comments.push(
      gap(
        "rc-metric",
        "campaign_background",
        "Metric source date",
        `${metric.label} is listed as ${metric.value}. What is the source, and is it current as of this week?`,
      ),
    )
  }

  comments.push(
    gap(
      "rc-phone",
      "contact",
      "Integrator phone number",
      "What is the Regional Integrator’s in-country number? Verify it before travel.",
    ),
  )

  return comments
}
