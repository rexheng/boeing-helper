import { lazy, Suspense, useCallback, useMemo, useState } from "react"
import { FileText, List } from "lucide-react"
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
import type { AirshowReportData } from "../utils/templateExport"
import { ReportOutlineSheet } from "./ReportOutlineSheet"

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

const NAVY = "#0A2240"
const GRID = "#9AA3AD"

type ReportView = "word" | "outline"

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
  const [reportView, setReportView] = useState<ReportView>("outline")
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

  const applyDoc = useCallback((next: AirshowReportData) => {
    setShowName(next.showName)
    setSummary(next.executiveSummary)
    setNotes(next.engagementBody)
    setEngagementTitle(next.engagementTitle)
    setRegionLabel(next.regionLabel)
  }, [])

  const onManualChange = useCallback(
    (next: AirshowReportData) => {
      applyDoc(next)
      setReloadKey((k) => k + 1)
      recordAccept({
        source: "manual",
        target: "report",
        summary: "Manual report edit",
        hunks: [],
      })
    },
    [applyDoc, recordAccept],
  )

  const onHighlightPaths = useCallback((paths: string[]) => {
    setHighlightPaths(paths)
    if (paths.length) setReportView("outline")
  }, [])

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
            setReportView("outline")
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
              <div className="inline-flex" style={{ border: `1px solid ${GRID}` }} role="tablist" aria-label="Report display">
                {(
                  [
                    { id: "outline" as const, label: "Outline", icon: List },
                    { id: "word" as const, label: "Word", icon: FileText },
                  ] as const
                ).map((v, i) => {
                  const Icon = v.icon
                  const active = reportView === v.id
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
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
            </div>
          </div>

          <div className="docked-workspace__sheet-body">
            {reportView === "outline" ? (
              <ReportOutlineSheet
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
                <ReportDocxEditor
                  data={reportDoc}
                  reloadKey={reloadKey}
                  embedded
                  highlightField={highlightPaths[0] || appliedFlash[0]}
                  highlightMode={highlightPaths.length ? "focus" : appliedFlash.length ? "applied" : undefined}
                />
              </Suspense>
            )}
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
