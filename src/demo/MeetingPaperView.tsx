import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { Library } from "lucide-react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import { generateMeetingPaper } from "../utils/meetingPaperGenerator"
import { buildMeetingPaperDocx } from "../utils/templateExport"
import { HelperCommentsRail } from "./HelperCommentsRail"

const DocxTemplateEditor = lazy(() =>
  import("./DocxTemplateEditor").then((m) => ({ default: m.DocxTemplateEditor })),
)

interface MeetingPaperViewProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  internalNotes?: string
  onContinue: () => void
  onBackToResearch?: () => void
}

const NAVY = "#0A2240"

export function MeetingPaperView({
  company,
  person,
  research,
  meetingType,
  internalNotes,
  onContinue,
  onBackToResearch,
}: MeetingPaperViewProps) {
  const paper = useMemo(
    () => generateMeetingPaper(research, company, person, meetingType),
    [research, company, person, meetingType],
  )
  const [reloadKey] = useState(0)
  const [activeComment, setActiveComment] = useState<string | null>(paper.reviewComments[0]?.id ?? null)

  const buildDocument = useCallback(() => buildMeetingPaperDocx(paper), [paper])
  const title = paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With ")
  const fileStem = `Meeting-Paper-${person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
  const pdfFallback = [
    title,
    paper.subtitle,
    paper.locationOrEvent,
    "",
    `Contact: ${paper.contact.name}, ${paper.contact.title}, ${paper.contact.phone}`,
    `Customer: ${paper.customer.name}, ${paper.customer.title}`,
    "",
    "Objectives",
    ...paper.objectives,
    "",
    "Key Messages",
    ...paper.keyMessages.map((km) => km.message),
    "",
    "Campaign Background",
    paper.campaignBackground,
    "",
    "Biography",
    `${paper.biography.name}, ${paper.biography.title}`,
    paper.biography.text,
  ].join("\n")

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="system-badge system-badge--dark">Meeting Paper</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>
            Meeting paper
          </h2>
          <p className="mt-2 text-sm max-w-2xl" style={{ color: "var(--text-secondary)" }}>
            The paper is scaffolding from the official template. Boeing Helper’s value is the review
            comments — the questions to lock before freeze. They travel with the Word file.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onBackToResearch && (
            <button type="button" onClick={onBackToResearch} className="btn-secondary">
              <Library size={16} />
              Research library
            </button>
          )}
          <Button onClick={onContinue}>Continue to materials</Button>
        </div>
      </div>

      <div className="paper-with-comments">
        <Suspense
          fallback={
            <div className="py-16 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
              Loading Word editor…
            </div>
          }
        >
          <DocxTemplateEditor
            buildDocument={buildDocument}
            title={title}
            fileStem={fileStem}
            pdfFallbackText={pdfFallback}
            reloadKey={reloadKey}
            loadingLabel="Building meeting paper…"
          />
        </Suspense>

        <HelperCommentsRail
          comments={paper.reviewComments}
          activeId={activeComment}
          onSelect={setActiveComment}
        />
      </div>

      {internalNotes && (
        <div className="px-5 py-4 text-sm" style={{ background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
          <p className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: NAVY }}>
            Internal only — not on the paper
          </p>
          <p className="whitespace-pre-wrap">{internalNotes}</p>
        </div>
      )}
    </div>
  )
}
