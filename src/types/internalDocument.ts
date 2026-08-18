import type { ResearchLane, ResearchSource } from "./research"

/** Fields shown in the extraction theatre and written onto the prior paper. */
export type ExtractedFieldKind =
  | "date"
  | "event"
  | "counterpart"
  | "objective"
  | "message"
  | "open"
  | "commitment"
  | "sat"

export interface ExtractedField {
  id: string
  label: string
  value: string
  kind: ExtractedFieldKind
  lane: ResearchLane
}

export interface PriorMeetingPaper {
  fileName: string
  dateLabel: string
  dateIso: string
  meetingTitle: string
  subtitle: string
  locationOrEvent: string
  classification: string
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
  campaignBackground: string
  customerSatIssues: string[]
  engagementBackground: string
  biography: {
    name: string
    title: string
    text: string
  }
  /** Unclosed items that seed the next paper / brief. */
  openItems: string[]
  commitments: string[]
}

export interface PriorEngagement {
  fileName: string
  dateLabel: string
  event: string
  meetingTitle: string
  summary: string
  objectives: string[]
  openItems: string[]
  commitments: string[]
  keyMessages: string[]
  customerSatIssues: string[]
}

export interface ExtractedInternalDocument {
  fileName: string
  fileSize: number
  mimeType: string
  paper: PriorMeetingPaper
  fields: ExtractedField[]
  notesText: string
  source: ResearchSource
  engagement: PriorEngagement
}
