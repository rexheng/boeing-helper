import { useMemo, useState } from "react"
import type { CSSProperties } from "react"
import { Download, FileText } from "lucide-react"
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
import type { AirshowReportData } from "../utils/templateExport"
import { jsPDF } from "jspdf"

interface MeetingReportViewProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  onFinish: () => void
}

const BLUE = "#0033A1"

const inlineField: CSSProperties = {
  width: "100%",
  border: "1px dashed transparent",
  background: "transparent",
  outline: "none",
  font: "inherit",
  color: "inherit",
  resize: "vertical" as const,
  padding: "2px 4px",
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
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null)
  const [showLlm, setShowLlm] = useState(false)
  const [focusField, setFocusField] = useState<string | null>(null)

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

  const handleDocx = async () => {
    setBusy("docx")
    try {
      const { exportAirshowReportDocx } = await import("../utils/templateExport")
      await exportAirshowReportDocx(reportDoc)
    } catch (err) {
      console.error(err)
      alert("Word export failed. Try PDF, or refresh and retry.")
    } finally {
      setBusy(null)
    }
  }

  const handlePdf = async () => {
    setBusy("pdf")
    try {
      const doc = new jsPDF({ unit: "mm", format: "letter" })
      const W = 215.9
      const ML = 25.4
      const MR = 25.4
      const contentW = W - ML - MR
      let y = 25.4

      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("BOEING", W - MR, 18, { align: "right" })

      doc.setFontSize(10)
      doc.text(`${showName} Summary Report`, W / 2, y, { align: "center" })
      y += 12

      doc.setFont("helvetica", "bold")
      doc.text("Executive Summary", ML, y)
      y += 6
      doc.setFont("helvetica", "normal")
      const sumLines = doc.splitTextToSize(summary, contentW)
      doc.text(sumLines, ML, y)
      y += sumLines.length * 5 + 8

      doc.setFont("helvetica", "bold")
      doc.text("Engagement Report", ML, y)
      y += 7
      doc.text(regionLabel, ML, y)
      y += 6

      const leftW = 40
      const rightW = contentW - leftW
      const noteLines = doc.splitTextToSize(notes, rightW - 4)
      const titleLines = doc.splitTextToSize(engagementTitle, leftW - 4)
      const boxH = Math.max(noteLines.length * 4.5 + 6, titleLines.length * 4.5 + 6, 20)

      if (y + boxH > 260) {
        doc.addPage()
        y = 25
      }

      doc.setDrawColor(0)
      doc.setLineWidth(0.25)
      doc.rect(ML, y, leftW, boxH)
      doc.rect(ML + leftW, y, rightW, boxH)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.text(titleLines, ML + 2, y + 5)
      doc.setFont("helvetica", "normal")
      doc.text(noteLines, ML + leftW + 2, y + 5)

      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.text("BOEING PROPRIETARY", W / 2, 270, { align: "center" })

      doc.save(`${showName.replace(/\s+/g, "-")}-Summary-Report.pdf`)
    } finally {
      setBusy(null)
    }
  }

  const fieldStyle = (id: string): CSSProperties => ({
    ...inlineField,
    borderColor: focusField === id ? BLUE : "transparent",
    background: focusField === id ? "rgba(0,51,161,0.04)" : "transparent",
  })

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div className="text-center">
        <p className="system-badge system-badge--dark mb-3">Air show report</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Summary report
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          Click any section to edit. Paste notes for a Groq debrief, then approve track-changes before they apply.
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
            const next = hunks.length
              ? applyReportHunks(reportDoc, hunks)
              : proposed
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
            setShowLlm(false)
          }}
        />
      )}

      <article
        className="bg-white p-8"
        style={{ border: "1px solid var(--surface-border)", fontFamily: "'Arial Narrow', Arial, sans-serif" }}
      >
        <div className="flex justify-end mb-4">
          <img src="/templates/boeing-logo-doc.png" alt="Boeing" className="h-7 object-contain" />
        </div>

        <h3 className="text-center font-bold text-[10px] mb-8" style={{ color: "#000" }}>
          {showName} Summary Report
        </h3>

        <p className="font-bold text-[10px] mb-2">Executive Summary</p>
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          onFocus={() => setFocusField("summary")}
          onBlur={() => setFocusField(null)}
          rows={5}
          className="w-full text-[10.5px] leading-relaxed mb-6"
          style={fieldStyle("summary")}
          aria-label="Executive summary"
        />

        <p className="font-bold text-[10px] mb-2">Engagement Report</p>
        <input
          value={regionLabel}
          onChange={(e) => setRegionLabel(e.target.value)}
          onFocus={() => setFocusField("region")}
          onBlur={() => setFocusField(null)}
          className="font-bold text-[10px] mb-3 w-full"
          style={fieldStyle("region")}
          aria-label="Region label"
        />

        <div className="grid grid-cols-[9rem_1fr]" style={{ border: "1px solid #000" }}>
          <textarea
            value={engagementTitle}
            onChange={(e) => setEngagementTitle(e.target.value)}
            onFocus={() => setFocusField("title")}
            onBlur={() => setFocusField(null)}
            rows={4}
            className="px-2 py-2 font-bold text-[10px]"
            style={{ ...fieldStyle("title"), borderRight: "1px solid #000", borderRadius: 0 }}
            aria-label="Engagement title"
          />
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onFocus={() => setFocusField("notes")}
            onBlur={() => setFocusField(null)}
            rows={8}
            className="px-2 py-2 text-[10.5px] leading-relaxed w-full"
            style={{ ...fieldStyle("notes"), borderRadius: 0 }}
            aria-label="Engagement notes"
          />
        </div>

        <p className="mt-8 text-center text-[10px] font-bold">BOEING PROPRIETARY</p>
      </article>

      <div className="flex flex-wrap justify-end gap-3">
        <button onClick={handleDocx} disabled={!!busy} className="btn-secondary">
          <FileText size={16} />
          {busy === "docx" ? "Generating…" : "Download Word"}
        </button>
        <button onClick={handlePdf} disabled={!!busy} className="btn-secondary">
          <Download size={16} />
          {busy === "pdf" ? "Generating…" : "Download PDF"}
        </button>
        <Button onClick={onFinish}>Finish demo</Button>
      </div>
    </div>
  )
}
