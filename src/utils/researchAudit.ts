import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import type {
  AuditFinding,
  AuditSource,
  CitationStance,
  FindingConfidence,
  GroundedParagraph,
  ResearchAudit,
  ResearchLane,
  ResearchModel,
  SourceKind,
} from "../types/researchAudit"

export const RESEARCH_MODELS: ResearchModel[] = [
  {
    id: "company",
    name: "Internal & Company Research",
    shortName: "Company",
    description: "Boeing internal index (RAG) plus corporate records, fleet status and press coverage.",
    method: "Secured vector retrieval + open-web programme scan",
  },
  {
    id: "industry",
    name: "Industry Research",
    shortName: "Industry",
    description: "Sector trends, competitive landscape and the counterpart’s public remarks.",
    method: "Market intelligence + public-figure activity scan",
  },
  {
    id: "country",
    name: "Country Research",
    shortName: "Country",
    description: "National priorities, bilateral aerospace agenda and counterpart concerns.",
    method: "Country brief + ministry and air-show talking-point extraction",
  },
]

const DISPUTE_RE =
  /\b(delay|slip|mismatch|rather than|cancel|fail|cost|sceptic|skeptic|no longer|not convert|unresolved|drag|shrink|withdraw|price|queue|grounded)\b/i
const SUPPORT_RE =
  /\b(confirm|order|deliver|sign|enhance|on order|game-changer|induct|upgrade|commit|launch|agree|expand)\b/i

function parseYear(date?: string): number {
  const m = date?.match(/(20\d{2})/)
  return m ? Number(m[1]) : 2026
}

function clip(text: string, max = 220): string {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + "…"
}

function firstSentence(text: string): string {
  const t = text.trim()
  const m = t.match(/^(.+?[.!?])(\s|$)/)
  return (m?.[1] || t).trim()
}

function headlineStance(headline: string): CitationStance {
  if (DISPUTE_RE.test(headline)) return "disputing"
  if (SUPPORT_RE.test(headline)) return "supporting"
  return "mentioning"
}

const PUBLISHER_QUERY: { match: RegExp; site: string }[] = [
  { match: /cna|channel newsasia/i, site: "channelnewsasia.com" },
  { match: /flightglobal/i, site: "flightglobal.com" },
  { match: /asian military/i, site: "asianmilitaryreview.com" },
  { match: /mindef/i, site: "mindef.gov.sg" },
  { match: /aviation week/i, site: "aviationweek.com" },
  { match: /reuters/i, site: "reuters.com" },
  { match: /business times/i, site: "businesstimes.com.sg" },
  { match: /mainly miles/i, site: "mainlymiles.com" },
  { match: /tempo/i, site: "tempo.co" },
  { match: /antara/i, site: "antaranews.com" },
  { match: /ch-aviation/i, site: "ch-aviation.com" },
  { match: /janes/i, site: "janes.com" },
  { match: /jakarta post/i, site: "thejakartapost.com" },
  { match: /defense news/i, site: "defensenews.com" },
  { match: /kemhan|rri/i, site: "kemhan.go.id" },
  { match: /khaosod/i, site: "khaosodenglish.com" },
  { match: /the nation/i, site: "nationthailand.com" },
  { match: /thai mfa/i, site: "mfa.go.th" },
  { match: /linkedin/i, site: "linkedin.com" },
]

function sourceUrl(publisher: string, title: string, kind: SourceKind, domain?: string): string | undefined {
  if (kind === "website" && domain) {
    const host = domain.replace(/^https?:\/\//, "").replace(/\/$/, "")
    return `https://${host}`
  }
  if (kind !== "article" && kind !== "press") return undefined
  const hit = PUBLISHER_QUERY.find((p) => p.match.test(publisher))
  const q = hit ? `"${title}" site:${hit.site}` : `"${title}" ${publisher}`
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`
}

function kindLabel(_kind: SourceKind): string {
  return _kind
}

export function sourceKindLabel(kind: SourceKind): string {
  const map: Record<SourceKind, string> = {
    article: "Article",
    press: "Press",
    internal: "Internal",
    website: "Website",
    report: "Report",
    speech: "Remarks",
    linkedin: "Public post",
    metric: "Programme record",
    briefing: "Briefing",
  }
  return map[kind]
}

export function laneLabel(lane: ResearchLane): string {
  return RESEARCH_MODELS.find((m) => m.id === lane)?.name ?? lane
}

interface SourceDraft {
  id: string
  title: string
  kind: SourceKind
  publisher: string
  authors: string
  year: number
  date?: string
  snippet: string
  excerpt: string
  lanes: ResearchLane[]
  modelIds: ResearchLane[]
  primaryStance: CitationStance
  classification?: "open" | "internal" | "synthesized"
  url?: string
}

interface FindingDraft {
  id: string
  claim: string
  lane: ResearchLane
  modelId: ResearchLane
  sourceIds: string[]
  stance: CitationStance
  excerpt: string
  confidence: FindingConfidence
  tags: string[]
  field: string
}

export function buildResearchAudit(
  research: ResearchResult,
  company: Company,
  person: Person,
  meetingType: string,
): ResearchAudit {
  const sources: SourceDraft[] = []
  const findings: FindingDraft[] = []
  const countryName = research.country?.name || company.countryName
  const domain = company.domain

  const pushSource = (s: SourceDraft) => {
    sources.push({
      ...s,
      classification: s.classification ?? (s.kind === "internal" ? "internal" : "open"),
      url: s.url ?? sourceUrl(s.publisher, s.title, s.kind, domain),
    })
  }

  // --- Company lane ---
  pushSource({
    id: "src-site",
    title: `${company.name} — organisation profile`,
    kind: "website",
    publisher: domain || company.name,
    authors: company.name,
    year: 2026,
    snippet: clip(research.company.overview || company.overview || company.tagline),
    excerpt: research.company.overview || company.overview || company.tagline,
    lanes: ["company"],
    modelIds: ["company"],
    primaryStance: "supporting",
  })

  pushSource({
    id: "src-internal-memo",
    title: `Campaign memo — ${company.name}`,
    kind: "internal",
    publisher: "Boeing SEA Campaign Archive",
    authors: "Boeing SEA Account Archive",
    year: 2026,
    date: "2026",
    snippet: `Simulated RAG in this environment: campaign framing for ${company.name}. Programme posture and open items for ${meetingType}.`,
    excerpt: `Internal campaign memo retrieved via RAG for ${company.name}. ${firstSentence(research.company.overview || company.tagline)} Account team notes flag sustainment, schedule credibility and local-industry participation as the live issues for ${meetingType}.`,
    lanes: ["company"],
    modelIds: ["company"],
    primaryStance: "supporting",
    classification: "internal",
  })

  pushSource({
    id: "src-internal-notes",
    title: `Prior meeting notes — ${person.name}`,
    kind: "internal",
    publisher: "Boeing SEA Account Archive",
    authors: "Boeing SEA Account Archive",
    year: 2026,
    snippet: `Simulated RAG match for ${person.name}, ${person.title}. Internal record search is simulated in this environment.`,
    excerpt: `Secured index match for ${person.name} (${person.title}). ${clip(research.person.profile_overview || research.person.background, 400)}`,
    lanes: ["company"],
    modelIds: ["company"],
    primaryStance: "mentioning",
    classification: "internal",
  })

  pushSource({
    id: "src-internal-history",
    title: `Account history — ${company.name} / Boeing installed base`,
    kind: "internal",
    publisher: "Boeing Customer Support · SEA",
    authors: "Boeing SEA Account Archive",
    year: 2026,
    snippet: "Simulated installed-base extract — not reachable from open web search. Internal record search is simulated here.",
    excerpt: `Internal installed-base extract for ${company.name}. ${research.company.key_metrics.map((m) => `${m.label}: ${m.value}`).join("; ") || firstSentence(research.company.overview)}`,
    lanes: ["company"],
    modelIds: ["company"],
    primaryStance: "supporting",
    classification: "internal",
  })

  if (research.company.overview) {
    findings.push({
      id: "f-company-overview",
      claim: firstSentence(research.company.overview),
      lane: "company",
      modelId: "company",
      sourceIds: ["src-site", "src-internal-memo"],
      stance: "supporting",
      excerpt: clip(research.company.overview, 360),
      confidence: "high",
      tags: ["organisation", "overview"],
      field: "company.overview",
    })
  }

  research.company.recent_news.forEach((item, i) => {
    const id = `src-news-${i}`
    const stance = headlineStance(item.headline)
    pushSource({
      id,
      title: item.headline,
      kind: i === 0 ? "article" : "press",
      publisher: item.source,
      authors: `${item.source} staff`,
      year: parseYear(item.date),
      date: item.date,
      snippet: `${item.source}${item.date ? ` · ${item.date}` : ""} — open-source coverage used by the company-research model.`,
      excerpt: item.headline,
      lanes: ["company"],
      modelIds: ["company"],
      primaryStance: stance,
    })
    findings.push({
      id: `f-news-${i}`,
      claim: item.headline,
      lane: "company",
      modelId: "company",
      sourceIds: [id, "src-internal-memo"],
      stance,
      excerpt: `${item.headline} (${item.source}${item.date ? `, ${item.date}` : ""}).`,
      confidence: stance === "disputing" ? "high" : "medium",
      tags: ["press", item.source],
      field: `company.recent_news[${i}]`,
    })
  })

  research.company.key_metrics.forEach((metric, i) => {
    const id = `src-metric-${i}`
    pushSource({
      id,
      title: `${metric.label} — ${company.name}`,
      kind: "metric",
      publisher: company.name,
      authors: company.name,
      year: 2026,
      snippet: `${metric.label}: ${metric.value}`,
      excerpt: `Extracted programme metric for ${company.name}. ${metric.label} is recorded as ${metric.value}. Cross-checked against internal account history and open reporting.`,
      lanes: ["company"],
      modelIds: ["company"],
      primaryStance: "supporting",
      classification: "synthesized",
    })
    findings.push({
      id: `f-metric-${i}`,
      claim: `${metric.label}: ${metric.value}`,
      lane: "company",
      modelId: "company",
      sourceIds: [id, "src-internal-history", "src-site"],
      stance: "supporting",
      excerpt: `${metric.label} for ${company.name} is ${metric.value}.`,
      confidence: "high",
      tags: ["metric", metric.label],
      field: `company.key_metrics[${i}]`,
    })
  })

  // --- Industry lane ---
  pushSource({
    id: "src-industry-brief",
    title: `Sector intelligence brief — ${company.industry || countryName} aerospace`,
    kind: "report",
    publisher: `${countryName} aerospace reporting`,
    authors: "Open-source compilation",
    year: 2026,
    snippet: clip(research.industry.competitive_context),
    excerpt: research.industry.competitive_context,
    lanes: ["industry"],
    modelIds: ["industry"],
    primaryStance: "mentioning",
    classification: "synthesized",
    url: undefined,
  })

  if (research.industry.competitive_context) {
    findings.push({
      id: "f-competitive",
      claim: firstSentence(research.industry.competitive_context),
      lane: "industry",
      modelId: "industry",
      sourceIds: ["src-industry-brief", "src-internal-memo"],
      stance: "mentioning",
      excerpt: clip(research.industry.competitive_context, 360),
      confidence: "high",
      tags: ["competition", "sector"],
      field: "industry.competitive_context",
    })
  }

  research.industry.trends.forEach((trend, i) => {
    const id = `src-trend-${i}`
    pushSource({
      id,
      title: `Industry trend ${i + 1}: ${clip(trend, 88)}`,
      kind: "report",
      publisher: `${countryName} aerospace reporting`,
      authors: "Open-source compilation",
      year: 2026,
      snippet: clip(trend),
      excerpt: trend,
      lanes: ["industry"],
      modelIds: ["industry"],
      primaryStance: DISPUTE_RE.test(trend) ? "disputing" : "mentioning",
      classification: "synthesized",
      url: undefined,
    })
    findings.push({
      id: `f-trend-${i}`,
      claim: firstSentence(trend),
      lane: "industry",
      modelId: "industry",
      sourceIds: [id, "src-industry-brief"],
      stance: DISPUTE_RE.test(trend) ? "disputing" : "mentioning",
      excerpt: clip(trend, 360),
      confidence: "medium",
      tags: ["trend"],
      field: `industry.trends[${i}]`,
    })
  })

  if (research.person.background) {
    pushSource({
      id: "src-bio",
      title: `Biography — ${person.name}`,
      kind: "briefing",
      publisher: company.name,
      authors: company.name,
      year: parseYear(research.person.linkedin_posts[0]?.date) || 2026,
      snippet: clip(research.person.background),
      excerpt: research.person.background,
      lanes: ["industry"],
      modelIds: ["industry"],
      primaryStance: "supporting",
      classification: "synthesized",
    })
    findings.push({
      id: "f-bio",
      claim: firstSentence(research.person.background),
      lane: "industry",
      modelId: "industry",
      sourceIds: ["src-bio", "src-internal-notes"],
      stance: "supporting",
      excerpt: clip(research.person.background, 360),
      confidence: "high",
      tags: ["counterpart", "biography"],
      field: "person.background",
    })
  }

  if (research.person.profile_overview) {
    findings.push({
      id: "f-read",
      claim: firstSentence(research.person.profile_overview),
      lane: "industry",
      modelId: "industry",
      sourceIds: ["src-bio", "src-internal-notes", "src-internal-memo"],
      stance: "supporting",
      excerpt: clip(research.person.profile_overview, 360),
      confidence: "high",
      tags: ["read", "counterpart"],
      field: "person.profile_overview",
    })
  }

  research.person.linkedin_posts.forEach((post, i) => {
    const id = `src-post-${i}`
    const stance = headlineStance(post.text)
    pushSource({
      id,
      title: `Public remarks — ${person.name}${post.date ? ` (${post.date})` : ""}`,
      kind: i === 0 ? "speech" : "linkedin",
      publisher: post.date ? `Public remarks · ${post.date}` : "Public remarks",
      authors: person.name,
      year: parseYear(post.date),
      date: post.date,
      snippet: clip(post.text),
      excerpt: post.text,
      lanes: ["industry"],
      modelIds: ["industry"],
      primaryStance: stance,
      url: person.linkedinUrl,
    })
    findings.push({
      id: `f-post-${i}`,
      claim: clip(post.text, 160),
      lane: "industry",
      modelId: "industry",
      sourceIds: [id, "src-bio"],
      stance,
      excerpt: post.text,
      confidence: "medium",
      tags: ["remarks", post.date || "undated"],
      field: `person.linkedin_posts[${i}]`,
    })
  })

  // --- Country lane ---
  if (research.country) {
    pushSource({
      id: "src-country-brief",
      title: `Country brief — ${countryName}`,
      kind: "briefing",
      publisher: `${countryName} open-source brief`,
      authors: "Open-source compilation",
      year: 2026,
      snippet: clip(research.country.overview),
      excerpt: research.country.overview,
      lanes: ["country"],
      modelIds: ["country"],
      primaryStance: "mentioning",
      classification: "synthesized",
    })

    if (research.country.overview) {
      findings.push({
        id: "f-country-overview",
        claim: firstSentence(research.country.overview),
        lane: "country",
        modelId: "country",
        sourceIds: ["src-country-brief"],
        stance: "mentioning",
        excerpt: clip(research.country.overview, 360),
        confidence: "high",
        tags: ["country", countryName],
        field: "country.overview",
      })
    }

    if (research.country.bilateral_context) {
      pushSource({
        id: "src-bilateral",
        title: `Bilateral aerospace agenda — US / ${countryName}`,
        kind: "briefing",
        publisher: `${countryName} bilateral brief`,
        authors: "Open-source compilation",
        year: 2026,
        snippet: clip(research.country.bilateral_context),
        excerpt: research.country.bilateral_context,
        lanes: ["country"],
        modelIds: ["country"],
        primaryStance: "supporting",
        classification: "synthesized",
      })
      findings.push({
        id: "f-bilateral",
        claim: firstSentence(research.country.bilateral_context),
        lane: "country",
        modelId: "country",
        sourceIds: ["src-bilateral", "src-internal-memo"],
        stance: "supporting",
        excerpt: clip(research.country.bilateral_context, 360),
        confidence: "high",
        tags: ["bilateral", countryName],
        field: "country.bilateral_context",
      })
    }

    research.country.priorities.forEach((item, i) => {
      const id = `src-priority-${i}`
      pushSource({
        id,
        title: `National priority ${i + 1} — ${countryName}`,
        kind: "briefing",
        publisher: `${countryName} defence / aviation agenda`,
        authors: "Open-source compilation",
        year: 2026,
        snippet: clip(item),
        excerpt: item,
        lanes: ["country"],
        modelIds: ["country"],
        primaryStance: "supporting",
        classification: "synthesized",
      })
      findings.push({
        id: `f-priority-${i}`,
        claim: item,
        lane: "country",
        modelId: "country",
        sourceIds: [id, "src-country-brief"],
        stance: "supporting",
        excerpt: item,
        confidence: "high",
        tags: ["priority"],
        field: `country.priorities[${i}]`,
      })
    })

    research.country.concerns.forEach((item, i) => {
      const id = `src-concern-${i}`
      pushSource({
        id,
        title: `Counterpart concern ${i + 1} — ${person.name}`,
        kind: "briefing",
        publisher: `${countryName} counterpart brief`,
        authors: "Open-source compilation",
        year: 2026,
        snippet: clip(item),
        excerpt: item,
        lanes: ["country"],
        modelIds: ["country"],
        primaryStance: "disputing",
        classification: "synthesized",
      })
      findings.push({
        id: `f-concern-${i}`,
        claim: item,
        lane: "country",
        modelId: "country",
        sourceIds: [id, "src-internal-notes"],
        stance: "disputing",
        excerpt: item,
        confidence: "high",
        tags: ["concern", "sensitivity"],
        field: `country.concerns[${i}]`,
      })
    })
  }

  // Assign cite indices in stable lane order
  const laneOrder: ResearchLane[] = ["company", "industry", "country"]
  const sortedDrafts = [...sources].sort((a, b) => {
    const la = laneOrder.indexOf(a.lanes[0])
    const lb = laneOrder.indexOf(b.lanes[0])
    if (la !== lb) return la - lb
    return a.title.localeCompare(b.title)
  })

  const citeMap = new Map<string, number>()
  sortedDrafts.forEach((s, i) => citeMap.set(s.id, i + 1))

  const finalFindings: AuditFinding[] = findings.map((f) => ({
    id: f.id,
    claim: f.claim,
    lane: f.lane,
    modelId: f.modelId,
    sourceIds: f.sourceIds.filter((id) => sources.some((s) => s.id === id)),
    stance: f.stance,
    excerpt: f.excerpt,
    confidence: f.confidence,
    tags: f.tags,
    field: f.field,
  }))

  const finalSources: AuditSource[] = sources.map((s) => {
    const citing = finalFindings.filter((f) => f.sourceIds.includes(s.id))
    const counts = {
      supporting: citing.filter((f) => f.stance === "supporting").length,
      disputing: citing.filter((f) => f.stance === "disputing").length,
      mentioning: citing.filter((f) => f.stance === "mentioning").length,
    }
    return {
      id: s.id,
      citeIndex: citeMap.get(s.id) ?? 0,
      title: s.title,
      url: s.url,
      kind: s.kind,
      publisher: s.publisher,
      authors: s.authors,
      year: s.year,
      date: s.date,
      snippet: s.snippet,
      excerpt: s.excerpt,
      lanes: s.lanes,
      modelIds: s.modelIds,
      stanceCounts: counts,
      citedBy: citing.length,
      findingIds: citing.map((f) => f.id),
      classification: s.classification,
    }
  })

  const sourceById = new Map(finalSources.map((s) => [s.id, s]))

  const grounded: GroundedParagraph[] = []
  const addGrounded = (
    id: string,
    lane: ResearchLane,
    heading: string,
    text: string,
    findingIds: string[],
  ) => {
    const citations: GroundedParagraph["citations"] = []
    const seen = new Set<string>()
    for (const fid of findingIds) {
      const finding = finalFindings.find((f) => f.id === fid)
      if (!finding) continue
      for (const sid of finding.sourceIds) {
        if (seen.has(sid)) continue
        const src = sourceById.get(sid)
        if (!src) continue
        seen.add(sid)
        citations.push({ n: src.citeIndex, sourceId: sid, findingId: fid })
      }
    }
    citations.sort((a, b) => a.n - b.n)
    grounded.push({ id, lane, modelId: lane, heading, text, citations })
  }

  if (research.company.overview) {
    addGrounded(
      "g-company",
      "company",
      "Organisation",
      research.company.overview,
      ["f-company-overview", ...research.company.recent_news.map((_, i) => `f-news-${i}`)],
    )
  }
  if (research.company.key_metrics.length) {
    addGrounded(
      "g-metrics",
      "company",
      "Programme metrics",
      research.company.key_metrics.map((m) => `${m.label}: ${m.value}`).join(". ") + ".",
      research.company.key_metrics.map((_, i) => `f-metric-${i}`),
    )
  }
  if (research.industry.competitive_context) {
    addGrounded(
      "g-industry",
      "industry",
      "Industry landscape",
      `${research.industry.competitive_context} ${research.industry.trends.slice(0, 2).join(" ")}`.trim(),
      ["f-competitive", ...research.industry.trends.map((_, i) => `f-trend-${i}`)],
    )
  }
  if (research.person.profile_overview) {
    addGrounded(
      "g-person",
      "industry",
      "Read on the counterpart",
      research.person.profile_overview,
      ["f-read", "f-bio", ...research.person.linkedin_posts.map((_, i) => `f-post-${i}`)],
    )
  }
  if (research.country?.overview) {
    addGrounded(
      "g-country",
      "country",
      countryName,
      `${research.country.overview} ${research.country.bilateral_context}`.trim(),
      ["f-country-overview", "f-bilateral"],
    )
  }
  if (research.country?.priorities.length) {
    addGrounded(
      "g-priorities",
      "country",
      "National priorities",
      research.country.priorities.join(" "),
      research.country.priorities.map((_, i) => `f-priority-${i}`),
    )
  }
  if (research.country?.concerns.length) {
    addGrounded(
      "g-concerns",
      "country",
      "Sensitivities",
      research.country.concerns.join(" "),
      research.country.concerns.map((_, i) => `f-concern-${i}`),
    )
  }

  const supporting = finalFindings.filter((f) => f.stance === "supporting").length
  const disputing = finalFindings.filter((f) => f.stance === "disputing").length
  const mentioning = finalFindings.filter((f) => f.stance === "mentioning").length

  return {
    generatedAt: new Date().toISOString(),
    subject: {
      personName: person.name,
      personTitle: person.title,
      companyName: company.name,
      companyDomain: domain,
      countryName,
      meetingType,
    },
    models: RESEARCH_MODELS,
    sources: finalSources.sort((a, b) => a.citeIndex - b.citeIndex),
    findings: finalFindings,
    grounded,
    indices: {
      sources: finalSources.length,
      findings: finalFindings.length,
      highConfidence: finalFindings.filter((f) => f.confidence === "high").length,
      supporting,
      disputing,
      mentioning,
      internal: finalSources.filter((s) => s.classification === "internal").length,
      open: finalSources.filter((s) => s.classification === "open" || !s.classification).length,
    },
  }
}

export function auditToCsv(audit: ResearchAudit): string {
  const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`
  const header = [
    "Cite",
    "Title",
    "Year",
    "Authors",
    "Publisher",
    "Kind",
    "Models",
    "Supporting",
    "Disputing",
    "Mentioning",
    "CitedBy",
    "Classification",
    "URL",
  ]
  const rows = audit.sources.map((s) =>
    [
      s.citeIndex,
      s.title,
      s.year,
      s.authors,
      s.publisher,
      kindLabel(s.kind),
      s.modelIds.join("; "),
      s.stanceCounts.supporting,
      s.stanceCounts.disputing,
      s.stanceCounts.mentioning,
      s.citedBy,
      s.classification ?? "open",
      s.url ?? "",
    ].map(esc).join(","),
  )
  return [header.join(","), ...rows].join("\n")
}

export function downloadTextFile(filename: string, contents: string, mime: string) {
  const blob = new Blob([contents], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
