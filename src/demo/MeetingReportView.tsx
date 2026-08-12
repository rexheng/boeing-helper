import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { FileText, LayoutTemplate, Type } from "lucide-react"
import { Button } from "../components/Button"
import { ChangelogDrawer } from "../components/review/ChangelogDrawer"
import { DockedComposer } from "../components/review/DockedComposer"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import { useDocumentReview } from "../hooks/useDocumentReview"
import type { ResearchResult } from "../types/research"
import { applyReportHunks } from "../utils/applyReviewHunks"
import { changelogScope } from "../utils/changelogStorage"
import { generateMeetingPaper } from "../utils/meetingPaperGenerator"
import {
  buildAirshowReportDocx,
  exportAirshowReportDocx,
  type AirshowReportData,
} from "../utils/templateExport"
import { ReportFieldSheet } from "./ReportFieldSheet"
import { reportHunkAnchor } from "../utils/reportSectionAnchor"

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
const NAVY = "#0A2240"
const GRID = "#9AA3AD"

type ReportView = "sheet" | "word"

const PANEL_IDS: Record<ReportView, string> = {
  sheet: "report-panel-sheet",
  word: "report-panel-word",
}

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
  const [reloadKey, setReloadKey] = useState(0)
  const [reportView, setReportView] = useState<ReportView>("sheet")
  const [highlightPaths, setHighlightPaths] = useState<string[]>([])
  const [appliedFlash, setAppliedFlash] = useState<string[]>([])

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

  const onHighlightPaths = useCallback((paths: string[]) => {
    const next = paths.map((p) => reportHunkAnchor({ anchor: p, path: p, field: p })).filter(Boolean)
    setHighlightPaths(next)
    if (next.length > 0) setReportView("sheet")
  }, [])

  const onManualChange = useCallback((next: AirshowReportData) => {
    setSummary(next.executiveSummary)
    setNotes(next.engagementBody)
    setEngagementTitle(next.engagementTitle)
    setRegionLabel(next.regionLabel)
  }, [])

  const handleWordExport = async () => {
    await exportAirshowReportDocx(reportDoc)
  }

  return (
    <div className="pb-12 space-y-8 docked-report-page">
      <div className="text-center max-w-3xl mx-auto">
        <p className="system-badge system-badge--dark mb-3">Air show report</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Summary report
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          Paste an email or freeform debrief. Reading paste proposes changes you click to spotlight on the live report sheet — then apply and Export Word.
        </p>
      </div>

      <div className={`docked-workspace ${highlightPaths.length > 0 ? "is-reviewing" : ""}`}>
        <DockedComposer
          target="report"
          currentDocument={reportDoc}
          context={{
            companyName: company.name,
            personName: person.name,
            personTitle: person.title,
            meetingType,
            showName,
          }}
          onHighlightPaths={onHighlightPaths}
          onAccept={({ proposedDocument, hunks, debrief, summary: llmSummary }) => {
            const proposed = proposedDocument as AirshowReportData
            const next = hunks.length ? applyReportHunks(reportDoc, hunks) : proposed
            setSummary(next.executiveSummary)
            setNotes(next.engagementBody)
            setEngagementTitle(next.engagementTitle)
            setRegionLabel(next.regionLabel)
            const anchors = hunks.map((h) => reportHunkAnchor(h)).filter(Boolean)
            setAppliedFlash(anchors)
            setHighlightPaths([])
            setReportView("sheet")
            window.setTimeout(() => setAppliedFlash([]), 1800)
            recordAccept({
              source: "llm",
              target: "report",
              summary: llmSummary,
              hunks,
              debriefSnapshot: debrief,
            })
            setReloadKey((k) => k + 1)
          }}
        />

        <div className="docked-workspace__sheet">
          <div className="docked-workspace__toolbar">
            <div className="flex flex-wrap items-center gap-2">
              <div
                className="inline-flex"
                style={{ border: `1px solid ${GRID}` }}
                role="tablist"
                aria-label="Report display"
              >
                {(
                  [
                    { id: "sheet" as const, label: "Report", icon: LayoutTemplate },
                    { id: "word" as const, label: "Word", icon: Type },
                  ] as const
                ).map((v, i) => {
                  const Icon = v.icon
                  const active = reportView === v.id
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="tab"
                      id={`report-tab-${v.id}`}
                      aria-selected={active}
                      aria-controls={PANEL_IDS[v.id]}
                      onClick={() => setReportView(v.id)}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold"
                      style={{
                        background: active ? NAVY : "#fff",
                        color: active ? "#fff" : NAVY,
                        borderLeft: i === 0 ? "none" : `1px solid ${GRID}`,
                      }}
                    >
                      <Icon size={12} />
                      {v.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ChangelogDrawer
                entries={entries}
                open={changelogOpen}
                onOpen={() => setChangelogOpen(true)}
                onClose={() => setChangelogOpen(false)}
              />

              <button
                type="button"
                onClick={() => setReportView("word")}
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ background: "#fff", color: BLUE, border: `1px solid ${BLUE}` }}
              >
                <Type size={13} />
                Word editor
              </button>
              <button
                type="button"
                onClick={handleWordExport}
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ background: BLUE, color: "#fff", border: `1px solid ${BLUE}` }}
              >
                <FileText size={13} />
                Export Word
              </button>
            </div>
          </div>

          <div
            className="docked-workspace__sheet-body"
            role="tabpanel"
            id={PANEL_IDS[reportView]}
            aria-labelledby={`report-tab-${reportView}`}
          >
            {reportView === "sheet" ? (
              <ReportFieldSheet
                data={reportDoc}
                onChange={onManualChange}
                highlightPaths={highlightPaths.length ? highlightPaths : appliedFlash}
                highlightMode={highlightPaths.length ? "focus" : appliedFlash.length ? "applied" : undefined}
              />
            ) : (
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
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button onClick={onFinish}>Finish demo</Button>
      </div>
    </div>
  )
}
