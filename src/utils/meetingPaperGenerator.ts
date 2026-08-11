import type { ResearchResult } from "../types/research"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"

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
  /** Supporting intel kept behind the walk-in paper */
  countryPaperBlurb?: string
}

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

export function generateMeetingPaper(
  research: ResearchResult,
  company: Company,
  person: Person,
  meetingType: string,
): MeetingPaper {
  const country = research.country
  const isAirShow = /air show|airshow|mspo|chalet|bilateral/i.test(meetingType)

  const objectives: string[] = []
  if (country?.priorities?.[0]) {
    objectives.push(`Customer confirms interest in a follow-on discussion on: ${truncate(country.priorities[0], 90)}.`)
  }
  if (research.company.key_metrics[0]) {
    objectives.push(
      `Align on status for ${research.company.key_metrics[0].label} (${research.company.key_metrics[0].value}) and any open Boeing asks.`,
    )
  }
  objectives.push("Agree owners and dates for the next deliverable before leaving the room.")
  if (objectives.length < 3 && country?.priorities?.[1]) {
    objectives.push(`Test readiness to advance: ${truncate(country.priorities[1], 90)}.`)
  }

  const keyMessages: { message: string; note?: string }[] = []
  if (research.company.key_metrics[0]) {
    keyMessages.push({
      message: `${research.company.key_metrics[0].label} stands at ${research.company.key_metrics[0].value} — Boeing can speak to schedule and sustainment with programme detail.`,
      note: research.company.recent_news[0]
        ? `Recent: ${truncate(research.company.recent_news[0].headline, 100)}`
        : undefined,
    })
  }
  if (country?.priorities?.[0]) {
    keyMessages.push({
      message: `Boeing’s near-term offer maps to their stated priority: ${truncate(country.priorities[0], 100)}.`,
    })
  }
  if (country?.concerns?.[0]) {
    keyMessages.push({
      message: `Address ${truncate(country.concerns[0], 80)} with evidence, not reassurance language.`,
    })
  }
  if (keyMessages.length < 3) {
    keyMessages.push({
      message: `Keep the discussion on programme performance and decision timing — not partnership platitudes.`,
    })
  }

  const satIssues =
    country?.concerns?.slice(0, 4) ??
    [
      "Cost and affordability pressure on the next tranche",
      "Delivery timing credibility after recent programme slips",
      "Local industry participation and offset expectations",
    ]

  const lastNews = research.company.recent_news[0]
  const engagementBackground = lastNews
    ? `Last public marker: "${lastNews.headline}" (${lastNews.source}, ${lastNews.date}). Confirm the last Boeing bilateral date, attendees, and open actions with the in-country team before the paper locks.`
    : `Confirm the date of the last engagement, who attended, and what was discussed with the in-country team before the paper locks.`

  const bioText =
    research.person.background.length > 420
      ? truncate(research.person.background, 420)
      : research.person.background

  return {
    dateLabel: new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    meetingTitle: `MEETING WITH ${person.name.toUpperCase()}`,
    subtitle: `${person.title}${country?.name ? `, ${country.name}` : ""}`,
    locationOrEvent: meetingType,
    contact: {
      name: "Regional Integrator (demo)",
      title: "International Business Development",
      phone: "+1 · confirm in-country number",
    },
    customer: {
      name: person.name,
      title: person.title,
      salutation: inferSalutation(person.name, person.title),
      phonetic: "[confirm phonetic with in-country]",
      raa:
        research.person.profile_overview?.slice(0, 160) ||
        `Responsible for decisions affecting ${company.name} engagement with Boeing.`,
    },
    objectives: objectives.slice(0, 4),
    keyMessages: keyMessages.slice(0, 4),
    agendaLogistics: isAirShow
      ? null
      : "Add timed agenda, gift, and photographer/media only when applicable. Delete this block for air-show bilaterals.",
    campaignBackground: truncate(
      [
        research.company.overview,
        country?.bilateral_context,
      ]
        .filter(Boolean)
        .join(" "),
      380,
    ),
    customerSatIssues: satIssues,
    engagementBackground,
    biography: {
      name: person.name,
      title: person.title,
      text: bioText,
      photoUrl: person.photoUrl,
    },
    countryPaperBlurb: country
      ? truncate(
          `${country.overview} Priorities: ${country.priorities.slice(0, 2).join("; ")}.`,
          280,
        )
      : undefined,
  }
}
