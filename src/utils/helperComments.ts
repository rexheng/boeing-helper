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

/**
 * Boeing Helper review comments — the selling point.
 * Paper body stays scaffolding. These are the follow-up questions a campaign
 * lead would write in the Word Review pane before freeze.
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
  if (person.id !== "chan-chun-sing" && company.id !== "mindef-sg") return null
  return [
    {
      id: "rc-lane",
      anchor: "objectives",
      sectionLabel: "Objectives",
      severity: "caution",
      text: "He owns P-8A induction, Apache life-extension and Chinook sustainment — not the fighter. If objective 1 still reads like a platform pitch, rewrite it around dated induction timing and cost-per-flight-hour. A fighter-adjacent open will get discounted in the first minute.",
    },
    {
      id: "rc-schedule",
      anchor: "key_messages",
      sectionLabel: "Key messages",
      severity: "ask",
      text: "Delivery credibility is the live nerve after F-35 and 777-9 slips. Do we have contractual dates for P-8A, or are we still using targets? He will ask. If we cannot name a date we are willing to put in writing, do not lead with schedule language.",
    },
    {
      id: "rc-china",
      anchor: "key_messages",
      sectionLabel: "Key messages",
      severity: "caution",
      text: "Confirm the room script does not imply Singapore is choosing sides. He is consistent that purchases are self-defence, not alignment. Strike any US-versus-China framing before this paper leaves the building.",
    },
    {
      id: "rc-steng",
      anchor: "objectives",
      sectionLabel: "Objectives",
      severity: "ask",
      text: "Who names ST Engineering and DSTA in the room, and with what sustainment workshare? Local industry participation is a decision criterion, not a follow-up slide. Lock the sentence we will actually say.",
    },
    {
      id: "rc-owner",
      anchor: "objectives",
      sectionLabel: "Objectives",
      severity: "ask",
      text: "Name the Singapore-side owner for the next written ask before freeze. “Agree owners” is not an objective unless the name is on this paper. Who walks out holding the action?",
    },
    {
      id: "rc-fan",
      anchor: "engagement_background",
      sectionLabel: "Engagement background",
      severity: "verify",
      text: "Public marker is MG Fan, Feb 2026, CNA — F-35 and P-8A as game-changers. Who from Boeing was in that conversation, and what is still open? If we cannot answer, the engagement block is a press clipping, not a campaign record.",
    },
    {
      id: "rc-sat",
      anchor: "cust_sat",
      sectionLabel: "Customer satisfaction",
      severity: "ask",
      text: "Spares and depot turnaround on AH-64D / CH-47 will be weighted above flyaway price. Which readiness number are we prepared to defend in the room? If we do not have it, cut the claim rather than bluff lifecycle cost.",
    },
    {
      id: "rc-bio",
      anchor: "biography",
      sectionLabel: "Biography",
      severity: "caution",
      text: "The Fort Worth visit was a Lockheed line, not ours. Do not lead the bio or the opener with fighter adjacency. Productive ground is P-8A, Apache LE and Chinook — existing programmes where reliability beats a new pitch.",
    },
    {
      id: "rc-phone",
      anchor: "contact",
      sectionLabel: "Contact",
      severity: "verify",
      text: "Rex Heng’s in-country mobile is still a placeholder. Verify before travel and update the phone field — a meeting paper that cannot reach the integrator is not frozen.",
    },
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

  comments.push({
    id: "rc-objective-owner",
    anchor: "objectives",
    sectionLabel: "Objectives",
    severity: "ask",
    text: `Who walks out of this ${meetingType} with ${company.name} holding the next written ask to Boeing, and by when? “Agree owners” is scaffolding until a name and a date are on the paper.`,
  })

  if (priority) {
    comments.push({
      id: "rc-priority",
      anchor: "objectives",
      sectionLabel: "Objectives",
      severity: "ask",
      text: `Their stated priority is “${clip(priority, 140)}.” Is that actually on today’s agenda, or are we projecting it? If it is not in the room, cut it from objective 1 rather than brief a ghost conversation.`,
    })
  }

  if (read) {
    comments.push({
      id: "rc-read",
      anchor: "key_messages",
      sectionLabel: "Key messages",
      severity: "caution",
      text: `Read on ${person.name}: ${clip(firstSentence(read), 180)} If a key message fights that read, it will be discounted. Rewrite the opener to match how this counterpart actually decides.`,
    })
  }

  if (concern) {
    comments.push({
      id: "rc-concern",
      anchor: "cust_sat",
      sectionLabel: "Customer satisfaction",
      severity: "caution",
      text: `Live sensitivity: ${clip(concern, 160)} Do we have programme evidence for the room, or only a talking point? If we cannot defend it, put the gap on the paper as an open item — do not bluff.`,
    })
  }

  if (disputed) {
    comments.push({
      id: "rc-press",
      anchor: "engagement_background",
      sectionLabel: "Engagement background",
      severity: "ask",
      text: `Press will be in the room whether we raise it or not: “${clip(disputed.headline, 140)}” (${disputed.source}${disputed.date ? `, ${disputed.date}` : ""}). Who answers it, and with what dated fact? Silence reads as confirmation.`,
    })
  } else if (news[0]) {
    comments.push({
      id: "rc-press",
      anchor: "engagement_background",
      sectionLabel: "Engagement background",
      severity: "verify",
      text: `Public marker: “${clip(news[0].headline, 140)}” (${news[0].source}${news[0].date ? `, ${news[0].date}` : ""}). Confirm this is still the latest Boeing-side reading, and add who attended the last touchpoint.`,
    })
  }

  if (metric) {
    comments.push({
      id: "rc-metric",
      anchor: "campaign_background",
      sectionLabel: "Campaign background",
      severity: "verify",
      text: `${metric.label} is on the paper as ${metric.value}. Is that still current as of this week, and what is the source? A stale metric in the campaign block is worse than a blank.`,
    })
  }

  comments.push({
    id: "rc-phone",
    anchor: "contact",
    sectionLabel: "Contact",
    severity: "verify",
    text: "Verify the Regional Integrator’s in-country number before travel. A meeting paper that cannot reach the integrator is not frozen.",
  })

  comments.push({
    id: "rc-phonetic",
    anchor: "customer",
    sectionLabel: "Customer",
    severity: "verify",
    text: `Validate phonetic pronunciation for ${person.name} with the in-country team. The salutation line is what gets said out loud — lock it.`,
  })

  return comments
}
