import { useMemo, useState } from "react"
import { Download, Lock } from "lucide-react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import { generateMeetingPaper } from "../utils/meetingPaperGenerator"
import { generateBriefing } from "../utils/briefingGenerator"

interface MeetingPaperViewProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  internalNotes?: string
  onContinue: () => void
}

const BLUE = "#0033A1"
const NAVY = "#0A2240"

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-[10rem_1fr] sm:gap-6 py-5 border-b" style={{ borderColor: "var(--surface-border)" }}>
      <p
        className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] pt-0.5"
        style={{ color: BLUE }}
      >
        {label}
      </p>
      <div className="min-w-0 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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
  const briefing = useMemo(() => generateBriefing(research, meetingType), [research, meetingType])
  const [downloading, setDownloading] = useState(false)

  const handlePdf = async () => {
    setDownloading(true)
    try {
      const { exportBriefingPDF } = await import("../utils/pdfExport")
      await exportBriefingPDF(document.createElement("div"), person.name, {
        personName: person.name,
        personTitle: person.title,
        companyName: company.name,
        meetingType,
        research,
        briefing,
        internalNotes,
      })
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="bh-panel overflow-hidden">
        <div style={{ height: "4px", background: BLUE }} />
        <div className="px-6 sm:px-8 py-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="system-badge system-badge--dark">Meeting Paper</p>
            <h2 className="mt-2 text-3xl font-bold" style={{ color: NAVY, letterSpacing: "-0.02em" }}>
              Paper ready for review
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
              {meetingType} · {person.name}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {company.name}
              {research.country?.name ? ` · ${research.country.name}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handlePdf} disabled={downloading} className="btn-secondary">
              <Download size={16} />
              {downloading ? "Generating…" : "Download PDF"}
            </button>
            <Button onClick={onContinue}>Continue to materials</Button>
          </div>
        </div>
      </div>

      <article className="bh-card px-6 sm:px-10 py-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between pb-8 border-b" style={{ borderColor: "var(--surface-border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{paper.dateLabel}</p>
          <div className="text-center sm:flex-1">
            <p className="text-lg font-bold tracking-wide" style={{ color: BLUE }}>{paper.meetingTitle}</p>
            <p className="mt-1 text-sm font-medium" style={{ color: BLUE }}>{paper.subtitle}</p>
            <p className="mt-1 text-sm" style={{ color: BLUE }}>{paper.locationOrEvent}</p>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] sm:text-right" style={{ color: NAVY }}>
            Boeing
          </p>
        </div>

        <Section label="Contact">
          <p style={{ color: NAVY }} className="font-medium">{paper.contact.name}</p>
          <p>{paper.contact.title}</p>
          <p className="text-sm mt-1">{paper.contact.phone}</p>
        </Section>

        <Section label="Customer · Salutation · RAA">
          <p style={{ color: NAVY }} className="font-medium">
            {paper.customer.name} — {paper.customer.title}
          </p>
          <p className="mt-2">
            Salutation: <span className="font-medium" style={{ color: NAVY }}>{paper.customer.salutation}</span>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}> · {paper.customer.phonetic}</span>
          </p>
          <p className="mt-2"><span className="font-medium" style={{ color: NAVY }}>RAA:</span> {paper.customer.raa}</p>
        </Section>

        <Section label="Objectives">
          <ol className="space-y-2">
            {paper.objectives.map((o, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-mono text-xs tabular-nums pt-1" style={{ color: "var(--boeing-cyan)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{o}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section label="Key messages">
          <ol className="space-y-4">
            {paper.keyMessages.map((km, i) => (
              <li key={i}>
                <p className="flex gap-3">
                  <span className="font-mono text-xs tabular-nums pt-1" style={{ color: "var(--boeing-cyan)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{km.message}</span>
                </p>
                {km.note && (
                  <p className="mt-1 ml-8 text-sm italic" style={{ color: "var(--text-muted)" }}>
                    Note: {km.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Section>

        {paper.agendaLogistics && (
          <Section label="Agenda / logistics">
            <p>{paper.agendaLogistics}</p>
          </Section>
        )}

        <Section label="Campaign background">
          <p>{paper.campaignBackground}</p>
          {paper.countryPaperBlurb && (
            <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
              Detail lives in the country paper: {paper.countryPaperBlurb}
            </p>
          )}
        </Section>

        <Section label="Potential cust sat issues">
          <ul className="space-y-2">
            {paper.customerSatIssues.map((issue) => (
              <li key={issue} className="flex gap-3">
                <span className="mt-2 h-px w-3 shrink-0" style={{ background: BLUE }} />
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Engagement background">
          <p>{paper.engagementBackground}</p>
        </Section>

        <Section label="Biography">
          <div className="flex flex-col sm:flex-row gap-5">
            {paper.biography.photoUrl && (
              <img
                src={paper.biography.photoUrl}
                alt={paper.biography.name}
                className="w-24 h-28 object-cover shrink-0"
                style={{ borderRadius: "var(--radius-sm)", border: "1px solid var(--surface-border)" }}
              />
            )}
            <div>
              <p className="font-semibold" style={{ color: NAVY }}>{paper.biography.name}</p>
              <p className="text-sm mb-2">{paper.biography.title}</p>
              <p>{paper.biography.text}</p>
            </div>
          </div>
        </Section>

        {internalNotes && (
          <Section label="Internal notes">
            <p className="whitespace-pre-wrap">{internalNotes}</p>
          </Section>
        )}

        <p className="pt-8 text-center text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
          Boeing Proprietary
        </p>
      </article>

      <div className="rounded border p-5 flex gap-3" style={{ background: "var(--bg-muted)", borderColor: "var(--surface-border)" }}>
        <Lock size={16} color={BLUE} className="mt-0.5 shrink-0" />
        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Objectives and key-message wording stay with the in-country team. CTL drafts messages; integrator supplies agenda only when it applies. Confirm export-controlled detail with your regional campaign lead before this paper leaves the tool.
        </p>
      </div>

      <div className="bh-panel px-6 sm:px-8 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold" style={{ color: NAVY }}>Next: invitation and attendee line</p>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Generate the invite letter and place this counterpart on the show attendee list.
          </p>
        </div>
        <Button onClick={onContinue}>Continue to materials</Button>
      </div>
    </div>
  )
}
