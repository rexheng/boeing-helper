export type ReviewTarget = "attendees" | "report"

export type HunkOp = "update" | "add" | "remove"

export interface ReviewHunk {
  id: string
  path: string
  field: string
  before: string
  after: string
  op: HunkOp
  /** Optional sheet anchor (attendee row id) for highlight sync */
  anchor?: string
}

export interface DebriefPerson {
  name: string
  role?: string
  organization?: string
  travel?: "I" | "D" | "L" | ""
}

export interface DocumentDebrief {
  sentiment?: string
  score?: number
  outcomes?: string[]
  actions?: string[]
  people?: DebriefPerson[]
  narrativeBullets?: string[]
}

export interface DocumentUpdateResponse {
  debrief: DocumentDebrief
  proposedDocument: unknown
  hunks: ReviewHunk[]
  summary: string
}

export interface ChangelogEntry {
  id: string
  at: string
  source: "manual" | "llm"
  target: ReviewTarget
  summary: string
  debriefSnapshot?: DocumentDebrief
  hunks: ReviewHunk[]
}
