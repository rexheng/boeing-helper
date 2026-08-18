import PizZip from "pizzip"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ExtractedInternalDocument, PriorMeetingPaper } from "../types/internalDocument"
import type { ResearchResult, ResearchSource } from "../types/research"
import { extractionFields, generatePriorMeetingPaper } from "./pastMeetingPaper"

const PRIOR_SOURCE_ID = "src-prior-paper"

function notesFromPaper(paper: PriorMeetingPaper): string {
  const lines = [
    `PRIOR MEETING PAPER — ${paper.dateLabel}`,
    `${paper.locationOrEvent} · ${paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting with ")}`,
    "",
    "Open items carried forward:",
    ...paper.openItems.map((item) => `• ${item}`),
    "",
    "Commitments from that meeting:",
    ...paper.commitments.map((item) => `• ${item}`),
  ]
  return lines.join("\n")
}

function sourceFromPaper(paper: PriorMeetingPaper): ResearchSource {
  const excerpt = [
    `${paper.dateLabel} · ${paper.locationOrEvent}.`,
    paper.openItems[0] ? `Open: ${paper.openItems[0]}` : "",
    paper.commitments[0] ? `Recorded: ${paper.commitments[0]}` : "",
    paper.engagementBackground,
  ]
    .filter(Boolean)
    .join(" ")

  return {
    id: PRIOR_SOURCE_ID,
    title: `${paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting paper — ")} (${paper.dateLabel})`,
    publisher: "Boeing Helper · Internal meeting paper",
    authors: paper.contact.name,
    kind: "internal",
    classification: "internal",
    date: paper.dateLabel,
    snippet: `Prior meeting paper, ${paper.dateLabel}. ${paper.openItems[0] ?? paper.objectives[0] ?? ""}`,
    excerpt,
    lanes: ["company"],
  }
}

export async function extractDocxPlainText(file: File): Promise<string> {
  const buf = await file.arrayBuffer()
  const zip = new PizZip(buf)
  const xml = zip.file("word/document.xml")?.asText() ?? ""
  return xml
    .replace(/<w:tab\/>/g, "\t")
    .replace(/<w:br\/>/g, "\n")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim()
}

export function paperMatchedTemplate(text: string, paper: PriorMeetingPaper): boolean {
  if (!text) return false
  const hay = text.toLowerCase()
  return (
    hay.includes(paper.dateLabel.toLowerCase()) ||
    hay.includes(paper.dateIso) ||
    hay.includes(paper.customer.name.toLowerCase()) ||
    hay.includes("meeting paper")
  )
}

export async function extractInternalDocument(
  file: File,
  company: Company,
  person: Person,
  meetingType: string,
  research?: ResearchResult | null,
): Promise<ExtractedInternalDocument> {
  const paper = generatePriorMeetingPaper(company, person, meetingType, research)
  let parsed = ""
  const isDocx = /\.docx$/i.test(file.name) || file.type.includes("wordprocessingml")
  const isText = /\.txt$/i.test(file.name) || file.type.startsWith("text/")
  try {
    if (isDocx) parsed = await extractDocxPlainText(file)
    else if (isText) parsed = await file.text()
  } catch {
    parsed = ""
  }

  const fields = extractionFields(paper)
  const source = sourceFromPaper(paper)
  if (parsed && paperMatchedTemplate(parsed, paper)) {
    source.snippet = `Template fields recognised in ${file.name}. ${source.snippet}`
  }

  return {
    fileName: file.name || paper.fileName,
    fileSize: file.size,
    mimeType: file.type || "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    paper,
    fields,
    notesText: notesFromPaper(paper),
    source,
    engagement: {
      fileName: file.name || paper.fileName,
      dateLabel: paper.dateLabel,
      event: paper.locationOrEvent,
      meetingTitle: paper.meetingTitle,
      summary: `${paper.dateLabel} ${paper.locationOrEvent}: ${paper.openItems[0] ?? paper.objectives[0] ?? "Prior paper ingested."}`,
      objectives: paper.objectives,
      openItems: paper.openItems,
      commitments: paper.commitments,
      keyMessages: paper.keyMessages.map((km) => km.message),
      customerSatIssues: paper.customerSatIssues,
    },
  }
}

export function mergePriorEngagement(
  research: ResearchResult,
  extracted: ExtractedInternalDocument,
): ResearchResult {
  const existing = research.company.sources ?? []
  const sources = [extracted.source, ...existing.filter((s) => s.id !== extracted.source.id)]
  return {
    ...research,
    priorEngagement: extracted.engagement,
    company: {
      ...research.company,
      sources,
    },
  }
}

export { PRIOR_SOURCE_ID }
