export type ResearchLane = "company" | "industry" | "country"

export type SourceKind =
  | "article"
  | "press"
  | "internal"
  | "website"
  | "report"
  | "speech"
  | "linkedin"
  | "metric"
  | "briefing"

export type CitationStance = "supporting" | "disputing" | "mentioning"

export type FindingConfidence = "high" | "medium" | "low"

export interface ResearchModel {
  id: ResearchLane
  name: string
  shortName: string
  description: string
  method: string
}

export interface StanceCounts {
  supporting: number
  disputing: number
  mentioning: number
}

export interface AuditSource {
  id: string
  citeIndex: number
  title: string
  url?: string
  kind: SourceKind
  publisher: string
  authors: string
  year: number
  date?: string
  snippet: string
  excerpt: string
  lanes: ResearchLane[]
  modelIds: ResearchLane[]
  stanceCounts: StanceCounts
  citedBy: number
  findingIds: string[]
  classification?: "open" | "internal"
}

export interface AuditFinding {
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

export interface GroundedParagraph {
  id: string
  lane: ResearchLane
  modelId: ResearchLane
  heading?: string
  text: string
  citations: { n: number; sourceId: string; findingId: string }[]
}

export interface ResearchAudit {
  generatedAt: string
  subject: {
    personName: string
    personTitle: string
    companyName: string
    companyDomain?: string
    countryName?: string
    meetingType: string
  }
  models: ResearchModel[]
  sources: AuditSource[]
  findings: AuditFinding[]
  grounded: GroundedParagraph[]
  indices: {
    sources: number
    findings: number
    highConfidence: number
    supporting: number
    disputing: number
    mentioning: number
    internal: number
    open: number
  }
}
