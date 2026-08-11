import { useMemo, useState } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import { generateMeetingPaper } from "../utils/meetingPaperGenerator"
import { jsPDF } from "jspdf"

interface MeetingReportViewProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  onFinish: () => void
}

const NAVY = "#0A2240"
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

  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null)

  const engagementTitle = `${meetingType}: ${person.title}`
  const regionLabel = "ASIA PACIFIC REGION"

  const handleDocx = async () => {
    setBusy("docx")
    try {
      const { exportAirshowReportDocx } = await import("../utils/templateExport")
      await exportAirshowReportDocx({
        showName,
        executiveSummary: summary,
        regionLabel,
        engagementTitle,
        engagementBody: notes,
      })
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
      const boxH = Math.max(noteLines.length * 4.5 + 6, 20)

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
      const titleLines = doc.splitTextToSize(engagementTitle, leftW - 4)
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

  return (
    <div className="space-y-6 pb-12 max-w-3xl mx-auto">
      <div className="text-center">
        <p className="system-badge system-badge--dark mb-3">Air show report</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Summary report
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          Format matches the Boeing Air Show Report example — executive summary plus engagement notes.
        </p>
      </div>

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
          rows={5}
          className="w-full text-[10.5px] leading-relaxed px-2 py-2 mb-6"
          style={{ border: "1px solid var(--surface-border)", color: "#000" }}
        />

        <p className="font-bold text-[10px] mb-2">Engagement Report</p>
        <p className="font-bold text-[10px] mb-3">{regionLabel}</p>

        <div className="grid grid-cols-[9rem_1fr]" style={{ border: "1px solid #000" }}>
          <div className="px-2 py-2 font-bold text-[10px]" style={{ borderRight: "1px solid #000" }}>
            {engagementTitle}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            className="px-2 py-2 text-[10.5px] leading-relaxed w-full"
            style={{ color: "#000", border: "none", outline: "none", resize: "vertical" }}
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
