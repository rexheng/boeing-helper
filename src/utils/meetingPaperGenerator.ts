import type { ResearchResult } from "../types/research"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"

export interface ReviewComment {
  /** Stable id for Word comment anchoring */
  id: string
  /** Field / section this guidance applies to */
  anchor: string
  /** Meta guidance for human review — not printed in body text */
  text: string
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
  /** Word-only review comments — never shown in on-screen body copy */
  reviewComments: ReviewComment[]
}

const INTEGRATOR = {
  name: "Rex Heng",
  title: "Regional Integrator, International Business Development",
  phone: "+65 6xxx xxxx",
} as const

function truncate(s: string, n: number) {
  if (s.length <= n) return s
  return s.slice(0, n - 1).trimEnd() + "…"
}

function inferSalutation(name: string, title: string): string {
  const t = title.toLowerCase()
  if (t.includes("minister") || t.includes("secretary")) return `Minister ${name.split(" ").slice(-1)[0]}`
  if (t.includes("general") || t.includes("admiral")) return name
  if (t.includes("dr") || t.includes("doctor")) return `Dr. ${name.split(" ").slice(-1)[0]}`
  return name.split(" ")[0]
}

/** Flagship demo overrides — programme-true language for leadership pitch */
function flagshipOverrides(person: Person, company: Company): Partial<MeetingPaper> | null {
  if (person.id !== "chan-chun-sing" && company.id !== "mindef-sg") return null
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
    reviewComments: [
      {
        id: "rc-phone",
        anchor: "contact",
        text: "Reviewer: verify Rex Heng’s in-country mobile before travel and update the phone field.",
      },
      {
        id: "rc-owner",
        anchor: "objectives",
        text: "Reviewer: lock the Singapore-side owner for the next written ask before paper freeze.",
      },
      {
        id: "rc-engagement",
        anchor: "engagement_background",
        text: "Reviewer: add date, attendees, and open actions from the last Boeing bilateral with Singapore.",
      },
    ],
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

  const bioText =
    research.person.background.length > 420
      ? truncate(research.person.background, 420)
      : research.person.background

  const defaultComments: ReviewComment[] = [
    {
      id: "rc-phone",
      anchor: "contact",
      text: "Reviewer: verify the Regional Integrator’s in-country number before travel.",
    },
    {
      id: "rc-phonetic",
      anchor: "customer",
      text: "Reviewer: validate phonetic pronunciation with the in-country team before the paper locks.",
    },
    {
      id: "rc-engagement",
      anchor: "engagement_background",
      text: "Reviewer: add the date of the last engagement, who attended, and open actions before freeze.",
    },
  ]

  if (!isAirShow) {
    defaultComments.push({
      id: "rc-agenda",
      anchor: "agenda",
      text: "Reviewer: gift / photographer arrangements — coordinate with the integrator; delete this block for air-show bilaterals.",
    })
  }

  return {
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
      salutation: inferSalutation(person.name, person.title),
      phonetic: "—",
      raa:
        research.person.profile_overview?.slice(0, 180) ||
        `Responsible for decisions affecting ${company.name} engagement with Boeing.`,
    },
    objectives: objectives.slice(0, 4),
    keyMessages: keyMessages.slice(0, 4),
    agendaLogistics: isAirShow
      ? null
      : "11:00 Welcome · 11:15 Programme brief · 12:00 Discussion · Gift / photographer: coordinate with integrator.",
    campaignBackground: truncate(
      [research.company.overview, country?.bilateral_context].filter(Boolean).join(" "),
      380,
    ),
    customerSatIssues: satIssues,
    engagementBackground:
      flagship?.engagementBackground ??
      (research.company.recent_news[0]
        ? `Public marker: "${research.company.recent_news[0].headline}" (${research.company.recent_news[0].source}, ${research.company.recent_news[0].date}).`
        : "Prior engagement history to be completed by the in-country team."),
    biography: {
      name: person.name,
      title: person.title,
      text: bioText,
      photoUrl: person.photoUrl,
    },
    countryPaperBlurb: country
      ? truncate(`${country.overview} Priorities: ${country.priorities.slice(0, 2).join("; ")}.`, 280)
      : undefined,
    reviewComments: flagship?.reviewComments ?? defaultComments,
  }
}
