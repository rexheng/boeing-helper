import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { Download, Minus, Plus } from "lucide-react"
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
import { buildAirshowReportDocx, type AirshowReportData } from "../utils/templateExport"

const ReportDocxEditor = lazy(() =>
  import("./ReportDocxEditor").then((m) => ({ default: m.ReportDocxEditor })),
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

const ZOOM_MIN = 0.75
const ZOOM_MAX = 1.5
const ZOOM_STEP = 0.1

function downloadBuffer(buf: ArrayBuffer, filename: string) {
  const blob = new Blob([new Uint8Array(buf)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
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

  const defaultShowName = /singapore/i.test(research.country?.name || "")
    ? "Singapore Airshow 2026"
    : `${research.country?.name || company.name} Air Show`

  const [showName, setShowName] = useState(defaultShowName)

  const [summary, setSummary] = useState(
    `The ${defaultShowName} provided Boeing with opportunities to engage with customers, industry partners, and media across the region. Highlights included bilateral meetings on programme status, sustainment, and next decision points. This pack captures the engagement with ${person.name} (${person.title}, ${company.name}).`,
  )

  const [notes, setNotes] = useState(
    `Boeing regional team met with ${person.name}, ${person.title}. Discussed ${paper.objectives[0] || "programme priorities"}. Customer raised: ${paper.customerSatIssues.slice(0, 2).join("; ")}.\n\nACTION: Integrator — send follow-up pack within 5 business days\nACTION: CTL — update campaign background with sat issues raised\nACTION: In-country — confirm next bilateral window`,
  )

  const [engagementTitle, setEngagementTitle] = useState(`${meetingType}: ${person.title}`)
  const [regionLabel, setRegionLabel] = useState("ASIA PACIFIC REGION")
  const [reloadKey, setReloadKey] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [highlightPaths, setHighlightPaths] = useState<string[]>([])
  const [appliedFlash, setAppliedFlash] = useState<string[]>([])
  const [exportBusy, setExportBusy] = useState(false)

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

  const applyDoc = useCallback((next: AirshowReportData) => {
    setShowName(next.showName)
    setSummary(next.executiveSummary)
    setNotes(next.engagementBody)
    setEngagementTitle(next.engagementTitle)
    setRegionLabel(next.regionLabel)
  }, [])

  const onHighlightPaths = useCallback((paths: string[]) => {
    setHighlightPaths(paths)
  }, [])

  const bumpZoom = (dir: 1 | -1) => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + dir * ZOOM_STEP) * 100) / 100)))
  }

  const handleWordExport = async () => {
    setExportBusy(true)
    try {
      const buf = await buildAirshowReportDocx(reportDoc)
      downloadBuffer(buf, `${reportDoc.showName.replace(/\s+/g, "-")}-Summary-Report.docx`)
    } catch (err) {
      console.error(err)
    } finally {
      setExportBusy(false)
    }
  }

  return (
    <div className="pb-12 space-y-4 docked-attendee-page docked-report-page">
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
            applyDoc(next)
            const anchors = hunks.map((h) => h.anchor || fieldKeyFromLabel(h.field)).filter(Boolean) as string[]
            setAppliedFlash(anchors)
            setHighlightPaths([])
            window.setTimeout(() => setAppliedFlash([]), 2200)
            recordAccept({
              source: "llm",
              target: "report",
              summary: llmSummary,
              hunks,
              debriefSnapshot: debrief,
            })
            setReloadKey((k) => k + 1)
          }}
          onRejectAll={() => {
            setHighlightPaths([])
            setAppliedFlash([])
          }}
        />

        <div className="docked-workspace__sheet">
          <div className="docked-workspace__toolbar">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold m-0" style={{ color: NAVY }}>
                Air Show Summary Report
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center" style={{ border: `1px solid ${GRID}` }}>
                <button type="button" aria-label="Zoom out" onClick={() => bumpZoom(-1)} className="cursor-pointer px-2 py-1.5" style={{ color: NAVY }}>
                  <Minus size={12} />
                </button>
                <span className="px-2 text-[11px] font-semibold tabular-nums" style={{ color: NAVY, borderLeft: `1px solid ${GRID}`, borderRight: `1px solid ${GRID}` }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button type="button" aria-label="Zoom in" onClick={() => bumpZoom(1)} className="cursor-pointer px-2 py-1.5" style={{ color: NAVY }}>
                  <Plus size={12} />
                </button>
              </div>

              <ChangelogDrawer
                entries={entries}
                open={changelogOpen}
                onOpen={() => setChangelogOpen(true)}
                onClose={() => setChangelogOpen(false)}
              />

              <button
                type="button"
                onClick={handleWordExport}
                disabled={exportBusy}
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] disabled:opacity-60"
                style={{ background: "#fff", color: BLUE, border: `1px solid ${BLUE}` }}
              >
                <Download size={13} />
                Export
              </button>
            </div>
          </div>

          <div className="docked-workspace__sheet-body">
            <div style={{ zoom }}>
              <Suspense
                fallback={
                  <div className="py-16 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                    Loading Word editor…
                  </div>
                }
              >
                <ReportDocxEditor
                  data={reportDoc}
                  reloadKey={reloadKey}
                  embedded
                  highlightField={highlightPaths[0] || appliedFlash[0]}
                  highlightMode={highlightPaths.length ? "focus" : appliedFlash.length ? "applied" : undefined}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3 px-1">
        <Button onClick={onFinish}>Finish demo</Button>
      </div>
    </div>
  )
}

function fieldKeyFromLabel(field: string): string | null {
  if (field === "Executive Summary") return "executiveSummary"
  if (field === "Engagement Title") return "engagementTitle"
  if (field === "Engagement Body") return "engagementBody"
  if (field === "Region") return "regionLabel"
  if (field === "Show") return "showName"
  return null
}
