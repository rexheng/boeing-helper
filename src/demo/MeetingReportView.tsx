import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { Button } from "../components/Button"
import { ChangelogDrawer } from "../components/review/ChangelogDrawer"
import { ReviewPanel } from "../components/review/ReviewPanel"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import { useDocumentReview } from "../hooks/useDocumentReview"
import type { ResearchResult } from "../types/research"
import { applyReportHunks } from "../utils/applyReviewHunks"
import { changelogScope } from "../utils/changelogStorage"
import { generateMeetingPaper } from "../utils/meetingPaperGenerator"
import { buildAirshowReportDocx, type AirshowReportData } from "../utils/templateExport"

const DocxTemplateEditor = lazy(() =>
  import("./DocxTemplateEditor").then((m) => ({ default: m.DocxTemplateEditor })),
)

interface MeetingReportViewProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  onFinish: () => void
}

const BLUE = "#0033A1"

export function MeetingReportView({
  company,
  person,
  research,
  meetingType,
  onFinish,
}: MeetingReportViewProps) {
  const paper = useMemo(
    () => generateMeetingPaper(research, company, person, meetingType),
    [research, company, person, meetingType],
  )

  const showName = /singapore/i.test(research.country?.name || "")
    ? "Singapore Airshow 2026"
    : `${research.country?.name || company.name} Air Show`

  const [summary, setSummary] = useState(
    `The ${showName} provided Boeing with opportunities to engage with customers, industry partners, and media across the region. Highlights included bilateral meetings on programme status, sustainment, and next decision points. This pack captures the engagement with ${person.name} (${person.title}, ${company.name}).`,
  )

  const [notes, setNotes] = useState(
    `Boeing regional team met with ${person.name}, ${person.title}. Discussed ${paper.objectives[0] || "programme priorities"}. Customer raised: ${paper.customerSatIssues.slice(0, 2).join("; ")}.\n\nACTION: Integrator — send follow-up pack within 5 business days\nACTION: CTL — update campaign background with sat issues raised\nACTION: In-country — confirm next bilateral window`,
  )

  const [engagementTitle, setEngagementTitle] = useState(`${meetingType}: ${person.title}`)
  const [regionLabel, setRegionLabel] = useState("ASIA PACIFIC REGION")
  const [showLlm, setShowLlm] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const reviewScope = changelogScope({
    companyId: company.id,
    personId: person.id,
    meetingType,
    target: "report",
  })
  const { entries, changelogOpen, setChangelogOpen, recordAccept } = useDocumentReview(reviewScope)

  const reportDoc: AirshowReportData = {
    showName,
    executiveSummary: summary,
    regionLabel,
    engagementTitle,
    engagementBody: notes,
  }

  const buildDocument = useCallback(() => buildAirshowReportDocx(reportDoc), [reportDoc])
  const fileStem = `${showName.replace(/\s+/g, "-")}-Summary-Report`
  const pdfFallback = `Executive Summary\n${summary}\n\n${regionLabel}\n${engagementTitle}\n${notes}`

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      <div className="text-center">
        <p className="system-badge system-badge--dark mb-3">Air show report</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Summary report
        </h2>
        <p className="mt-3 max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Edit in a real Word document in the browser (Ctrl/Cmd+B and friends). Paste notes for a Groq debrief, review track-changes, then download.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          onClick={() => setShowLlm((s) => !s)}
          className="cursor-pointer px-3 py-1.5 text-[11px] font-semibold"
          style={{
            background: showLlm ? "var(--boeing-ice)" : "#fff",
            color: BLUE,
            border: `1px solid ${BLUE}`,
          }}
        >
          Update from email / notes
        </button>
        <ChangelogDrawer
          entries={entries}
          open={changelogOpen}
          onOpen={() => setChangelogOpen(true)}
          onClose={() => setChangelogOpen(false)}
        />
      </div>

      {showLlm && (
        <ReviewPanel
          target="report"
          currentDocument={reportDoc}
          context={{
            companyName: company.name,
            personName: person.name,
            personTitle: person.title,
            meetingType,
            showName,
          }}
          onAccept={({ proposedDocument, hunks, debrief, summary: llmSummary }) => {
            const proposed = proposedDocument as AirshowReportData
            const next = hunks.length ? applyReportHunks(reportDoc, hunks) : proposed
            setSummary(next.executiveSummary)
            setNotes(next.engagementBody)
            setEngagementTitle(next.engagementTitle)
            setRegionLabel(next.regionLabel)
            recordAccept({
              source: "llm",
              target: "report",
              summary: llmSummary,
              hunks,
              debriefSnapshot: debrief,
            })
            setReloadKey((k) => k + 1)
            setShowLlm(false)
          }}
        />
      )}

      <Suspense
        fallback={
          <div className="py-16 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
            Loading Word editor…
          </div>
        }
      >
        <DocxTemplateEditor
          buildDocument={buildDocument}
          title={`${showName} Summary Report`}
          fileStem={fileStem}
          pdfFallbackText={pdfFallback}
          reloadKey={reloadKey}
          loadingLabel="Building report document…"
        />
      </Suspense>

      <div className="flex flex-wrap justify-end gap-3">
        <Button onClick={onFinish}>Finish demo</Button>
      </div>
    </div>
  )
}
