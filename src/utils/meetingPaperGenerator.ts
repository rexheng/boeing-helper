import type { ResearchResult } from "../types/research"
import type { Company } from "../data/companies"
import { personSurname, type Person } from "../data/people"
import { buildHelperComments } from "./helperComments"

export interface ReviewComment {
  /** Stable id for Word comment anchoring */
  id: string
  /** Field / section this guidance applies to */
  anchor: string
  /** Section label shown in the on-screen Helper rail */
  sectionLabel: string
  /** Short 4–5 word gap title, e.g. "P-8A delivery dates" */
  topic: string
  /** 1–2 sentence question — missing context only, no opinion */
  text: string
  severity: "ask" | "caution" | "verify"
  /** Distinctive paper-body text used to pin the Word comment and on-screen highlight */
  quote?: string
}

export interface MeetingPaper {
  dateLabel: string
  meetingTitle: string
  subtitle: string
  locationOrEvent: string
  contact: {
    name: string
    title: string
    phone: string
  }
  customer: {
    name: string
    title: string
    salutation: string
    phonetic: string
    raa: string
  }
  objectives: string[]
  keyMessages: { message: string; note?: string }[]
  agendaLogistics: string | null
  campaignBackground: string
  customerSatIssues: string[]
  engagementBackground: string
  biography: {
    name: string
    title: string
    text: string
    photoUrl?: string
  }
  countryPaperBlurb?: string
  /** Boeing Helper Word comments — also shown in the paper UI rail */
  reviewComments: ReviewComment[]
}

const INTEGRATOR = {
  name: "Rex Heng",
  title: "Office of President Boeing Southeast Asia & Taiwan",
  phone: "+65 8xxx xxxx",
} as const

const AMERICAS_INTEGRATOR = {
  name: "Rex Heng",
  title: "Boeing Commercial Airplanes · Americas Airline Accounts",
  phone: "+1 206 xxx xxxx",
} as const

function truncate(s: string, n: number) {
  if (s.length <= n) return s
  return s.slice(0, n - 1).trimEnd() + "…"
}

function inferSalutation(person: Person): string {
  const t = person.title.toLowerCase()
  const surname = personSurname(person)
  if (t.includes("minister") || t.includes("secretary")) return `Minister ${surname}`
  if (t.includes("general") || t.includes("admiral")) return person.name
  if (t.includes("dr") || t.includes("doctor")) return `Dr. ${surname}`
  // Prefer curated surname for the short address form on the paper header
  return surname
}

/** Flagship demo overrides — short official scaffolding. Intelligence lives in Helper comments. */
function flagshipOverrides(person: Person, company: Company): Partial<MeetingPaper> | null {
  if (person.id === "chan-chun-sing") return chanPaper(person)
  if (company.id === "mindef-sg") return mindefPaper(person)
  if (person.id === "goh-choon-phong" || company.id === "sia") return siaPaper(person)
  if (person.id === "rosan-roeslani") return rosanPaper(person)
  if (company.id === "garuda") return garudaPaper(person)
  if (person.id === "sjafrie-sjamsoeddin" || company.id === "mod-id") return kemhanPaper(person)
  if (person.id === "robert-isom" || company.id === "american") return americanPaper(person)
  if (person.id === "ed-bastian" || company.id === "delta") return deltaPaper(person)
  return null
}

function chanPaper(person: Person): Partial<MeetingPaper> {
  return {
    contact: { ...INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: "Minister Chan",
      phonetic: "chahn chun sing",
      raa: "Responsible for defence policy and RSAF acquisition decisions affecting P-8A, AH-64, and Chinook programmes.",
    },
    objectives: [
      "Customer commits to a follow-on technical session on P-8A induction timing.",
      "Align on AH-64D life-extension and Chinook sustainment open items before the next programme review.",
      "Name the Singapore-side owner for the next written ask to Boeing.",
    ],
    keyMessages: [
      {
        message: "P-8A delivery and training pathway is the near-term conversation — schedule reliability over new platform pitches.",
        note: "RSAF has called F-35 and P-8A the force’s game-changers.",
      },
      {
        message: "AH-64D and CH-47 sustainment economics matter as much as unit price; bring cost-per-flight-hour evidence.",
      },
      {
        message: "Local industry participation through ST Engineering and DSTA should be named in the room, not left to follow-up.",
      },
    ],
    customerSatIssues: [
      "Delivery credibility after F-35 and commercial schedule slips",
      "Lifecycle and sustainment cost versus acquisition price",
      "Spare parts and training pipeline for Apache and Chinook fleets",
      "Offset / local industry expectations on maritime patrol induction",
    ],
    engagementBackground:
      "Public marker Feb 2026: Chief of Air Force framed F-35 and P-8A as RSAF game-changers (CNA). Prior programme touchpoints cover Apache life extension and Chinook sustainment with the Singapore in-country team.",
    campaignBackground:
      "MINDEF / RSAF: P-8A to replace Fokker 50 MPA; AH-64D life-extension and CH-47 sustainment are the live Boeing programmes. Fighter lane is Lockheed.",
  }
}

function mindefPaper(person: Person): Partial<MeetingPaper> {
  return {
    contact: { ...INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: inferSalutation(person),
      phonetic: "—",
      raa: "RSAF / MINDEF counterpart on P-8A, Apache and Chinook programmes.",
    },
    objectives: [
      "Align on P-8A induction timing and training pathway with dated language.",
      "Lock AH-64D / CH-47 sustainment open items before the next programme review.",
      "Name the Singapore-side owner for the next written ask to Boeing.",
    ],
    keyMessages: [
      { message: "Stay on maritime patrol and rotorcraft — not the fighter." },
      { message: "Local industry through ST Engineering should be named, not implied." },
    ],
    customerSatIssues: [
      "Delivery credibility on manufacturer timelines",
      "Apache / Chinook spares and depot turnaround",
      "Local industry participation",
    ],
    engagementBackground: "Prior in-country programme touchpoints on Apache LE, Chinook and P-8A. Confirm last Boeing attendees before freeze.",
    campaignBackground: "Boeing’s live Singapore defence programmes are P-8A, AH-64D and CH-47. F-35 is not ours to brief.",
  }
}

function siaPaper(person: Person): Partial<MeetingPaper> {
  const isGoh = person.id === "goh-choon-phong"
  return {
    contact: { ...INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: isGoh ? "Mr Goh" : inferSalutation(person),
      phonetic: isGoh ? "goh choon fong" : "—",
      raa: "SIA fleet, network and MRO decisions affecting 777-9 induction and the next widebody contest.",
    },
    objectives: [
      "Customer confirms a dated 777-9 delivery profile with the new cabin installed, or agrees schedule language comes off this paper.",
      "Align on slot availability for the next widebody contest — not discounting.",
      "Name the SIA-side owner for the next written ask to Boeing.",
    ],
    keyMessages: [
      { message: "Delivery credibility is the live nerve; 777-300ERs are being extended because dates slipped." },
      { message: "The next 50-widebody contest will turn on slots. The A350F freighter contest is closed." },
      { message: "SIA Engineering / Boeing JV capacity should be named if MRO is in the room." },
    ],
    customerSatIssues: [
      "777-9 certification and delivery credibility (no aircraft in FY27 fleet plan)",
      "Cost of extending 777-300ERs and resequencing cabin retrofit",
      "Cabin product installed on first aircraft",
      "Slot picture for the next widebody order",
    ],
    engagementBackground:
      "Public marker May 2026 (Aviation Week): no 777-9 deliveries in SIA’s fleet plan through 31 March 2027. Confirm last Boeing attendees and what was left in writing.",
    campaignBackground:
      "SIA: 31× 777-9 on order; 26× 787-10 (launch customer). Next contest is 50+ widebodies. Temasek-owned premium hub carrier — schedule failures read as a breach of trust.",
  }
}

function garudaPaper(person: Person): Partial<MeetingPaper> {
  return {
    contact: { ...INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: inferSalutation(person),
      phonetic: "—",
      raa: "Garuda / Danantara counterpart on fleet serviceability and the 50-aircraft Boeing commitment.",
    },
    objectives: [
      "Align on heavy-check, engine and component support against the 68-aircraft serviceability target.",
      "Name GMF workshare for the next written ask.",
      "Name the Garuda-side owner for the next artefact.",
    ],
    keyMessages: [
      { message: "Serviceability beats new metal in the near term — spares and TAT before a 50-jet pitch." },
      { message: "Local MRO through GMF AeroAsia should be named in the room." },
    ],
    customerSatIssues: [
      "Engine, APU and landing-gear turnaround on 737-800NG and 777-300ER",
      "Heavy-check duration versus the 68-aircraft target",
      "GMF participation versus overseas MRO",
    ],
    engagementBackground:
      "Public marker March 2026 (Tempo): 68 serviceable Garuda aircraft by end-2026. Confirm last Boeing aftermarket attendees.",
    campaignBackground:
      "Garuda is in a Danantara-backed turnaround. The 50-jet Boeing commitment is politically real; operational priority is returning grounded aircraft to service.",
  }
}

function rosanPaper(person: Person): Partial<MeetingPaper> {
  return {
    contact: { ...INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: "Minister Rosan",
      phonetic: "roh-sahn",
      raa: "Owns Danantara capital and the political mandate for the 50-aircraft Boeing commitment under the US–Indonesia trade package.",
    },
    objectives: [
      "Customer signals a dated slot and financing path that would convert the 50-aircraft commitment, or agrees conversion is not this meeting’s objective.",
      "Lock the industrial-return sentence (GMF, training, supply chain) we will actually say.",
      "Name the Danantara-side owner for the next written artefact.",
    ],
    keyMessages: [
      { message: "This is a trade deliverable. The seven-year queue is the publicly stated blocker — slots before discounts." },
      { message: "Financing is unresolved; come with a structure that does not assume a further state injection." },
      { message: "National return — MRO, training, supply chain — is how he scores the relationship." },
    ],
    customerSatIssues: [
      "Seven-year delivery queue versus fleet gap now",
      "Financing scheme still open",
      "Industrial participation that can be defended in Jakarta",
    ],
    engagementBackground:
      "Public marker Feb 2026 (Tempo / Antara): Danantara ready to buy 50 Boeing aircraft; queue and financing unresolved. Confirm last Boeing attendees.",
    campaignBackground:
      "The 50-aircraft commitment is embedded in the US–Indonesia tariff agreement (~$13.5B). Conversion is a political deliverable; slots and financing are the live constraints.",
  }
}

function kemhanPaper(person: Person): Partial<MeetingPaper> {
  const isMinister = person.id === "sjafrie-sjamsoeddin"
  return {
    contact: { ...INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: isMinister ? "Minister Sjafrie" : inferSalutation(person),
      phonetic: "—",
      raa: "Kemhan / TNI-AU counterpart. F-15EX campaign is closed; live Boeing programmes are AH-64E and ScanEagle.",
    },
    objectives: [
      "Align on AH-64E sustainment and ScanEagle / ISR support — not a fighter reopen.",
      "Lock the PTDI / local-content sentence required under Law 16/2012.",
      "Name the Kemhan-side owner for the next written ask.",
    ],
    keyMessages: [
      { message: "F-15EX is closed; price mismatch, not policy. Do not reopen unless Jakarta does." },
      { message: "Installed base — eight Apaches and ScanEagle — is how the relationship continues." },
      { message: "Offset and financing are decision criteria, not follow-up slides." },
    ],
    customerSatIssues: [
      "AH-64E readiness and spares",
      "Offset / local-content compliance",
      "Financing structure on any future offer",
    ],
    engagementBackground:
      "Public marker Feb 2026 (Janes / Jakarta Post): no active Indonesia F-15EX campaign. Confirm the room script matches that exit.",
    campaignBackground:
      "Kemhan: Rafale induction underway; F-15EX withdrawn on price. Boeing’s remaining defence position is Apache, ScanEagle and the commercial 50-jet trade track.",
  }
}

function americanPaper(person: Person): Partial<MeetingPaper> {
  const isCeo = person.id === "robert-isom"
  return {
    contact: { ...AMERICAS_INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: isCeo ? "Mr. Isom" : inferSalutation(person),
      phonetic: "—",
      raa: "American Airlines counterpart on 737-8 MAX induction, remaining 787-9 stream, and MAX 10 certification timing.",
    },
    objectives: [
      "Customer confirms the 737-8 MAX reliability / spares item that goes on this paper (89 aircraft already in service).",
      "Lock a dated 787-9 / Flagship Suite install calendar that matches the newsroom product claim.",
      "Name the American-side owner for the MAX 10 certification watch item — 115 aircraft sit in 2029 and thereafter on the 10-K.",
    ],
    keyMessages: [
      { message: "Do not lead with new metal. Lead with delivery fidelity on 737-8 MAX and 787-9 already on the property." },
      { message: "The MAX 10 block is a date risk American has already disclosed — 14 737-family aircraft in 2026, none in 2027–2028, 115 from 2029." },
      { message: "A321XLR is doing thin transatlantic work; any 787 slip makes that substitution easier to defend." },
    ],
    customerSatIssues: [
      "737-8 MAX first-90-day reliability and AOG/spares",
      "Flagship Suite install quality on 787-9",
      "MAX 10 certification date versus the 2029-and-thereafter remainder",
      "777-200ER replacement timing (average age 25.0 years)",
    ],
    engagementBackground:
      "Public marker 27 Jan 2026 (American Airlines Newsroom): record $54.6B FY2025 revenue; 23 737-8 MAX and 11 787-9 delivered in 2025 (10-K). Confirm last Boeing attendees at DFW.",
    campaignBackground:
      "American: 1,013 mainline aircraft. Boeing remaining firm book 129 737-family and 19 787-family (10-K). Dual-source with A321neo/XLR. Centennial year 2026 — premium product is the public story.",
  }
}

function deltaPaper(person: Person): Partial<MeetingPaper> {
  const isCeo = person.id === "ed-bastian"
  return {
    contact: { ...AMERICAS_INTEGRATOR },
    customer: {
      name: person.name,
      title: person.title,
      salutation: isCeo ? "Mr. Bastian" : inferSalutation(person),
      phonetic: "—",
      raa: "Delta counterpart on 737-10 EIS (first contractual 2027) and 787-10 configuration for 2031.",
    },
    objectives: [
      "Customer confirms the 737-10 EIS date that goes on this paper — 10-K shows 27 aircraft in 2027, none in 2026.",
      "Lock a 787-10 cabin / GEnx working-group charter that can sit next to the A350 product.",
      "Name the TechOps owner for LEAP-1B workshare now and the GEnx path later.",
    ],
    keyMessages: [
      { message: "Do not re-announce the 2022 Farnborough 737-10 order. Put a 2027 EIS plan in writing, including the date if certification moves." },
      { message: "The January 2026 787-10 order is a win; it does not retire MAX 10 date risk or 767 replacement timing." },
      { message: "TechOps LEAP-1B is a public claim on the News Hub — hold ourselves to it." },
    ],
    customerSatIssues: [
      "737-10 certification versus the original 2025 media-kit date",
      "Cost of keeping 737-800 / 717 / 757 flying if 2027 does not hold",
      "787-10 interiors versus A350 product family",
      "GEnx shop path at TechOps",
    ],
    engagementBackground:
      "Public marker 12–13 Jan 2026 (Delta 8-K / News Hub): 30 787-10s firm, options 30, EIS 2031. 737-10 first contractual year 2027 (10-K). Confirm last Boeing attendees in Atlanta.",
    campaignBackground:
      "Delta: 1,314-aircraft fleet. Firm Boeing book 100× 737-10 and 30× 787-10. Current widebodies are Airbus. TechOps is the aftermarket centre of gravity.",
  }
}

export function generateMeetingPaper(
  research: ResearchResult,
  company: Company,
  person: Person,
  meetingType: string,
): MeetingPaper {
  const country = research.country
  const isAirShow = /air show|airshow|mspo|chalet|bilateral/i.test(meetingType)
  const flagship = flagshipOverrides(person, company)

  const objectives: string[] = flagship?.objectives ?? []
  if (!flagship) {
    if (country?.priorities?.[0]) {
      objectives.push(`Customer signals interest in a follow-on discussion on: ${truncate(country.priorities[0], 90)}.`)
    }
    if (research.company.key_metrics[0]) {
      objectives.push(
        `Align on status for ${research.company.key_metrics[0].label} (${research.company.key_metrics[0].value}) and any open Boeing asks.`,
      )
    }
    objectives.push("Agree owners and dates for the next deliverable before leaving the room.")
  }

  const keyMessages = flagship?.keyMessages ?? []
  if (!flagship) {
    if (research.company.key_metrics[0]) {
      keyMessages.push({
        message: `${research.company.key_metrics[0].label} stands at ${research.company.key_metrics[0].value} — speak to schedule and sustainment with programme detail.`,
      })
    }
    if (country?.priorities?.[0]) {
      keyMessages.push({
        message: `Near-term offer maps to their stated priority: ${truncate(country.priorities[0], 100)}.`,
      })
    }
    if (country?.concerns?.[0]) {
      keyMessages.push({
        message: `Address ${truncate(country.concerns[0], 80)} with programme evidence.`,
      })
    }
  }

  const satIssues =
    flagship?.customerSatIssues ??
    country?.concerns?.slice(0, 4) ??
    [
      "Cost and affordability pressure on the next tranche",
      "Delivery timing credibility",
      "Local industry participation expectations",
    ]

  const bioText = truncate(research.person.background, 240)

  const paper: MeetingPaper = {
    dateLabel: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    meetingTitle: `MEETING WITH ${person.name.toUpperCase()}`,
    subtitle: `${person.title}${country?.name ? `, ${country.name}` : ""}`,
    locationOrEvent: meetingType,
    contact: flagship?.contact ?? { ...INTEGRATOR },
    customer: flagship?.customer ?? {
      name: person.name,
      title: person.title,
      salutation: inferSalutation(person),
      phonetic: "—",
      raa:
        research.person.profile_overview?.slice(0, 160) ||
        `Responsible for decisions affecting ${company.name} engagement with Boeing.`,
    },
    objectives: objectives.slice(0, 4),
    keyMessages: keyMessages.slice(0, 4),
    agendaLogistics: isAirShow
      ? null
      : "11:00 Welcome · 11:15 Programme brief · 12:00 Discussion · Gift / photographer: coordinate with integrator.",
    campaignBackground:
      flagship?.campaignBackground ??
      truncate(research.company.overview, 220),
    customerSatIssues: satIssues,
    engagementBackground:
      flagship?.engagementBackground ??
      (research.company.recent_news[0]
        ? `Public marker: "${research.company.recent_news[0].headline}" (${research.company.recent_news[0].source}, ${research.company.recent_news[0].date}). Confirm last Boeing attendees before freeze.`
        : "Prior engagement history to be completed by the in-country team."),
    biography: {
      name: person.name,
      title: person.title,
      text: bioText,
      photoUrl: person.photoUrl,
    },
    countryPaperBlurb: country
      ? truncate(`${country.name} — ${country.priorities.slice(0, 2).join("; ")}.`, 180)
      : undefined,
    reviewComments: [],
  }

  paper.reviewComments = attachCommentQuotes(
    buildHelperComments(research, company, person, meetingType),
    paper,
  )
  return paper
}

/** Pin each Helper comment to distinctive text already on the paper. */
export function attachCommentQuotes(comments: ReviewComment[], paper: MeetingPaper): ReviewComment[] {
  return comments.map((comment) => ({
    ...comment,
    quote: comment.quote || firstNeedle(commentHighlightNeedles(paper, comment)),
  }))
}

export function commentHighlightNeedles(paper: MeetingPaper, comment: ReviewComment): string[] {
  const sectionLabels: Record<string, string[]> = {
    contact: ["Contact", "Rex Heng", paper.contact.phone, paper.contact.name],
    customer: ["Customer", paper.customer.name, paper.customer.salutation],
    objectives: ["Objective", "OBJECTIVES", ...paper.objectives],
    key_messages: ["Key Message", "KEY MESSAGE", ...paper.keyMessages.map((km) => km.message)],
    engagement_background: ["Engagement", paper.engagementBackground],
    campaign_background: ["Campaign", paper.campaignBackground],
    cust_sat: ["Customer Sat", "Satisfaction", ...paper.customerSatIssues],
    biography: ["Biography", paper.biography.name, paper.biography.text],
    agenda: ["Agenda", paper.agendaLogistics ?? "Logistics"],
  }
  const fromAnchor = sectionLabels[comment.anchor] ?? [comment.sectionLabel]
  return [comment.quote, ...fromAnchor].filter((s): s is string => Boolean(s && s.trim().length >= 4))
}

function firstNeedle(needles: string[]): string | undefined {
  return needles.find((n) => n.replace(/\s+/g, " ").trim().length >= 12)
}
