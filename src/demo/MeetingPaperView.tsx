import { useMemo, useState } from "react"
import { Download, FileText } from "lucide-react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import { generateMeetingPaper } from "../utils/meetingPaperGenerator"

interface MeetingPaperViewProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  internalNotes?: string
  onContinue: () => void
}

const BLUE = "#0000FF"
const NAVY = "#0A2240"

function Row({
  label,
  labelLines,
  children,
}: {
  label: string
  labelLines?: string[]
  children: React.ReactNode
}) {
  return (
    <div
      className="grid grid-cols-[7.5rem_1fr] md:grid-cols-[8.5rem_1fr]"
      style={{ border: "1px solid #000", borderTop: "none" }}
    >
      <div className="px-2 py-2 font-bold text-[10.5px] leading-snug" style={{ fontFamily: "'Arial Narrow', Arial, sans-serif", borderRight: "1px solid #000", color: "#000" }}>
        <div>{label}</div>
        {labelLines?.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>
      <div className="px-2 py-2 text-[10.5px] leading-snug whitespace-pre-wrap" style={{ fontFamily: "'Arial Narrow', Arial, sans-serif", color: "#000" }}>
        {children}
      </div>
    </div>
  )
}

export function MeetingPaperView({
  company,
  person,
  research,
  meetingType,
  internalNotes,
  onContinue,
}: MeetingPaperViewProps) {
  const paper = useMemo(
    () => generateMeetingPaper(research, company, person, meetingType),
    [research, company, person, meetingType],
  )
  const [busy, setBusy] = useState<"pdf" | "docx" | null>(null)
  const isAirShow = /air show|airshow|bilateral|chalet|mspo/i.test(meetingType)

  const handlePdf = async () => {
    setBusy("pdf")
    try {
      const { exportMeetingPaperPDF } = await import("../utils/meetingPaperPdf")
      await exportMeetingPaperPDF(paper, person.name)
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(null)
    }
  }

  const handleDocx = async () => {
    setBusy("docx")
    try {
      const { exportMeetingPaperDocx } = await import("../utils/templateExport")
      await exportMeetingPaperDocx(paper)
    } catch (err) {
      console.error(err)
      alert("Word export failed. Try PDF, or refresh and retry.")
    } finally {
      setBusy(null)
    }
  }

  const title = paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With ")

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="system-badge system-badge--dark">Meeting Paper</p>
          <h2 className="mt-2 text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>
            Meeting paper
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            Boeing Meeting Paper template. Export Word or PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDocx} disabled={!!busy} className="btn-secondary">
            <FileText size={16} />
            {busy === "docx" ? "Generating…" : "Download Word"}
          </button>
          <button onClick={handlePdf} disabled={!!busy} className="btn-secondary">
            <Download size={16} />
            {busy === "pdf" ? "Generating…" : "Download PDF"}
          </button>
          <Button onClick={onContinue}>Continue to materials</Button>
        </div>
      </div>

      {/* On-screen preview mirroring Word */}
      <article
        className="bg-white mx-auto max-w-[8.5in] shadow-sm"
        style={{ border: "1px solid var(--surface-border)", fontFamily: "'Arial Narrow', Arial, sans-serif" }}
      >
        <div className="px-8 pt-6 pb-2 flex items-center justify-between text-[11px]">
          <span>{paper.dateLabel}</span>
          <img src="/templates/boeing-logo-doc.png" alt="Boeing" className="h-7 object-contain" />
        </div>

        <div className="px-8 text-center pb-4">
          <p className="font-bold text-[10.5px]" style={{ color: BLUE }}>{title}</p>
          <p className="font-bold text-[10.5px]" style={{ color: BLUE }}>{paper.subtitle}</p>
          <p className="font-bold text-[10.5px]" style={{ color: BLUE }}>{paper.locationOrEvent}</p>
        </div>

        <div className="px-6 pb-6">
          <div style={{ borderTop: "1px solid #000" }}>
            <Row label="Contact">
              {paper.contact.name}, {paper.contact.title}, {paper.contact.phone}
            </Row>
            <Row label="Customer(s) Salutation & Customer RAA">
              {paper.customer.name}, {paper.customer.title}
              {"\n"}“{paper.customer.salutation}” [{paper.customer.phonetic}]
              {"\n"}RAA: “{paper.customer.raa}”
            </Row>
            <Row label="Objectives">
              {paper.objectives.join("\n")}
            </Row>
            <Row label="Key Messages">
              {paper.keyMessages.map((km) => (km.note ? `${km.message}\nNote: ${km.note}` : km.message)).join("\n")}
            </Row>
            {!isAirShow && paper.agendaLogistics && (
              <Row label="Agenda/" labelLines={["Logistics"]}>
                {paper.agendaLogistics}
              </Row>
            )}
            <Row label="Campaign Background">{paper.campaignBackground}</Row>
            <Row label="Potential Customer Sat" labelLines={["Issues"]}>
              {paper.customerSatIssues.join("\n")}
            </Row>
            <Row label="Engagement Background">{paper.engagementBackground}</Row>
            <Row label="Biography">
              <span className="font-bold">{paper.biography.name}, {paper.biography.title}</span>
              {"\n"}
              {paper.biography.text}
            </Row>
          </div>
        </div>

        <p className="pb-6 text-center text-[10px] font-bold tracking-wide">BOEING PROPRIETARY</p>
      </article>

      {internalNotes && (
        <div className="px-5 py-4 text-sm" style={{ background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
          <p className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: NAVY }}>Internal only — not on the paper</p>
          <p className="whitespace-pre-wrap">{internalNotes}</p>
        </div>
      )}
    </div>
  )
}
