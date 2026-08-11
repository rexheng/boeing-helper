import type { ResearchResult } from "../types/research"

export interface MeetingBriefing {
  summary: string
  agenda: string[]
  questions: string[]
}

const agendaTemplates: Record<string, (r: ResearchResult) => string[]> = {
  "Air Show Briefing": (r) => [
    `Welcome the delegation — reference ${r.person.linkedin_posts.length > 0 ? `their recent remarks on "${extractTopic(r.person.linkedin_posts[0].text)}"` : `their role as ${r.person.title}`}`,
    r.company.key_metrics.length > 0
      ? `Confirm programme status where it matters to them — ${r.company.key_metrics[0].label} (${r.company.key_metrics[0].value})`
      : "Confirm where each live programme stands before they ask",
    firstPriority(r)
      ? `Position the capability against their stated priority: ${truncate(firstPriority(r)!, 70)}`
      : "Position capability against their stated modernisation priorities",
    firstConcern(r)
      ? `Get ahead of the objection: ${truncate(firstConcern(r)!, 70)}`
      : "Get ahead of the delivery and sustainment questions before they raise them",
    "Close with what Boeing will send after the show, and by when",
  ],
  "First Call / Introduction": (r) => [
    `Introduce the Boeing team and how it supports ${r.country?.name || "the customer"}`,
    "Understand the current fleet, standing commitments and where the pressure is",
    firstPriority(r)
      ? `Test our read on their priorities, starting with: ${truncate(firstPriority(r)!, 70)}`
      : "Identify the two or three priorities driving their planning cycle",
    "Agree the right cadence and who else should be in the room next time",
  ],
  "Follow-up Meeting": (r) => [
    "Recap what was committed at the last engagement and close it out",
    r.company.recent_news.length > 0
      ? `Address what has changed since: "${truncate(r.company.recent_news[0].headline, 60)}"`
      : "Address anything that has changed on their side since we last met",
    "Answer the questions left open, with the detail they asked for",
    "Agree the next decision point and the date it needs to happen by",
  ],
  "Progress Check-in": (r) => [
    r.company.key_metrics.length > 0
      ? `Programme status — deliveries, sustainment and support against ${r.company.key_metrics[0].label}`
      : "Programme status — deliveries, sustainment and support",
    "Surface risks and schedule pressure early rather than at the review",
    firstConcern(r)
      ? `Confirm we are managing their standing concern: ${truncate(firstConcern(r)!, 70)}`
      : "Confirm we are managing their standing concerns on cost and availability",
    "Confirm what they need from Boeing before the next milestone",
  ],
  "Quarterly Review": (r) => [
    "Performance against commitments made last quarter",
    r.company.key_metrics.length > 0
      ? `Benchmark: ${r.company.key_metrics[0].label} at ${r.company.key_metrics[0].value} — on track?`
      : "Benchmark delivery, availability and support performance",
    r.industry.trends.length > 0
      ? `Sector context: how "${truncate(r.industry.trends[0], 60)}" is shifting their planning`
      : "Sector context and how it is shifting their planning",
    "Their asks for next quarter, and what Boeing commits to in return",
  ],
}

function generateAgenda(research: ResearchResult, meetingType: string): string[] {
  const generator = agendaTemplates[meetingType]
  if (generator) return generator(research)

  // Fallback for custom meeting types
  return [
    `Open with the objective for the meeting and confirm ${research.person.name} agrees it is the right one`,
    research.company.recent_news.length > 0
      ? `Address recent developments: "${truncate(research.company.recent_news[0].headline, 70)}"`
      : `Review what is currently on ${research.person.title}'s desk`,
    firstPriority(research)
      ? `Connect the discussion to their priority: ${truncate(firstPriority(research)!, 70)}`
      : "Connect the discussion to their stated priorities",
    "Agree follow-ups, owners and dates",
  ]
}

const questionsByMeetingType: Record<string, (r: ResearchResult) => string[]> = {
  "Air Show Briefing": (r) => {
    const qs: string[] = []
    if (r.person.linkedin_posts.length > 0) {
      qs.push(`You spoke recently about ${extractTopic(r.person.linkedin_posts[0].text)} — where has that landed since?`)
    }
    if (firstPriority(r)) {
      qs.push(`On ${truncate(firstPriority(r)!, 60)} — what would have to be true for the timeline to hold?`)
    }
    if (r.company.key_metrics.length > 0) {
      qs.push(`How are you thinking about ${r.company.key_metrics[0].label} over the next planning cycle?`)
    }
    qs.push("What would be most useful for us to bring back to you after the show?")
    return qs.slice(0, 3)
  },

  "First Call / Introduction": (r) => {
    const qs: string[] = []
    qs.push(`What is taking most of your attention as ${r.person.title.split(",")[0]} right now?`)
    if (firstPriority(r)) {
      qs.push(`We read ${truncate(firstPriority(r)!, 60)} as a priority — is that how you would put it?`)
    }
    qs.push("Where has industry been most useful to you, and where has it fallen short?")
    return qs.slice(0, 3)
  },

  "Follow-up Meeting": (r) => {
    const qs: string[] = []
    qs.push("Did what we sent after the last meeting answer the question you actually had?")
    if (r.company.recent_news.length > 0) {
      qs.push(`How has "${truncate(r.company.recent_news[0].headline, 50)}" changed your thinking?`)
    }
    qs.push("What has to happen internally on your side before the next decision point?")
    return qs.slice(0, 3)
  },

  "Progress Check-in": (r) => {
    const qs: string[] = []
    if (r.company.key_metrics.length > 0) {
      qs.push(`Is ${r.company.key_metrics[0].label} tracking the way your staff expected?`)
    }
    qs.push("Where is your team spending time it should not have to spend?")
    if (firstConcern(r)) {
      qs.push(`Is ${truncate(firstConcern(r)!, 60)} still the concern we should be working hardest on?`)
    }
    return qs.slice(0, 3)
  },

  "Quarterly Review": (r) => {
    const qs: string[] = []
    if (r.company.key_metrics.length > 0) {
      qs.push(`${r.company.key_metrics[0].label} stands at ${r.company.key_metrics[0].value} — does that match your internal view of the quarter?`)
    }
    qs.push("What would you want done differently next quarter?")
    if (r.industry.trends.length > 0) {
      qs.push(`With ${truncate(r.industry.trends[0], 50)}, should we be adjusting the plan?`)
    }
    return qs.slice(0, 3)
  },
}

function generateQuestions(research: ResearchResult, meetingType: string): string[] {
  const generator = questionsByMeetingType[meetingType]
  if (generator) return generator(research)

  // Fallback for custom meeting types
  const qs: string[] = []
  if (research.person.linkedin_posts.length > 0) {
    qs.push(`You spoke recently about ${extractTopic(research.person.linkedin_posts[0].text)} — what is the latest there?`)
  }
  if (research.company.recent_news.length > 0) {
    qs.push(`How is "${truncate(research.company.recent_news[0].headline, 50)}" affecting your team?`)
  }
  qs.push(`What is taking most of your attention as ${research.person.title} right now?`)
  return qs.slice(0, 3)
}


function generateSummary(research: ResearchResult, _meetingType: string): string {
  const { person, company } = research

  // Build a clean company descriptor — prefer overview's first sentence, fall back to name
  const overviewSentence = company.overview?.split(".")[0]?.trim()
  const companyDesc = overviewSentence && overviewSentence.length > 10
    ? overviewSentence + "."
    : ""

  // Build a person focus line from their profile overview or title
  const focusLine = person.profile_overview
    ? splitSentences(person.profile_overview).slice(0, 2).join(" ").trim()
    : `${person.name} serves as ${person.title}.`

  // One line of country framing — what the relationship rests on
  const bilateral = research.country?.bilateral_context
  const countryLine = bilateral ? splitSentences(bilateral)[0]?.trim() ?? "" : ""

  return [companyDesc, focusLine, countryLine].filter(Boolean).join(" ")
}

// --- Helpers ---

function firstPriority(r: ResearchResult): string | undefined {
  return r.country?.priorities?.[0]
}

function firstConcern(r: ResearchResult): string | undefined {
  return r.country?.concerns?.[0]
}

function extractTopic(postText: string): string {
  // Take the core subject from a public remark, truncated
  const cleaned = postText
    .replace(/^(excited to announce|proud to share|great discussion|happy to announce|thrilled to)\s*/i, "")
    .split(".")[0]
    .split("—")[0]
    .trim()
  return truncate(cleaned, 50)
}


/** Split text into sentences without breaking on decimals like $1.24 or abbreviations */
function splitSentences(text: string): string[] {
  const placeholder = "\x00"
  // Protect decimal numbers (e.g. $1.24, 3.5%) and common abbreviations (e.g. U.S.)
  const safe = text
    .replace(/(\d)\.(\d)/g, (_, a, b) => a + placeholder + b)
    .replace(/([A-Z])\.([A-Z])/g, (_, a, b) => a + placeholder + b)
  return safe.split(/\.(?:\s|$)/).filter(Boolean).map(
    s => s.replaceAll(placeholder, ".").trim() + "."
  )
}

function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trimEnd() + "..."
}

export function generateBriefing(research: ResearchResult, meetingType: string): MeetingBriefing {
  return {
    summary: generateSummary(research, meetingType),
    agenda: generateAgenda(research, meetingType),
    questions: generateQuestions(research, meetingType),
  }
}
