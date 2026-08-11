import { useMemo, useState } from "react"
import { Download, Lock } from "lucide-react"
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
    <div className="grid gap-3 sm:grid-cols-[11rem_1fr] sm:gap-6 py-5 border-b" style={{ borderColor: "var(--surface-border)" }}>
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
  const [downloading, setDownloading] = useState(false)

  const handlePdf = async () => {
    setDownloading(true)
    try {
      const { exportMeetingPaperPDF } = await import("../utils/meetingPaperPdf")
      await exportMeetingPaperPDF(paper, person.name)
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="system-badge system-badge--dark">Meeting Paper</p>
          <h2 className="mt-2 text-3xl font-bold" style={{ color: NAVY, letterSpacing: "-0.02em" }}>
            {person.name}
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            {meetingType} · {company.name}
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

      <article className="bg-white px-6 sm:px-10 py-8 sm:py-10" style={{ border: "1px solid var(--surface-border)" }}>
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

        <Section label="Customer">
          <p style={{ color: NAVY }} className="font-medium">
            {paper.customer.name} — {paper.customer.title}
          </p>
        </Section>

        <Section label="Salutation">
          <p>
            <span className="font-medium" style={{ color: NAVY }}>{paper.customer.salutation}</span>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}> [{paper.customer.phonetic}]</span>
          </p>
        </Section>

        <Section label="Customer RAA">
          <p>{paper.customer.raa}</p>
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
                  <p className="mt-1 ml-8 text-sm" style={{ color: "var(--text-muted)" }}>
                    Note: {km.note}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Section>

        {paper.agendaLogistics ? (
          <Section label="Agenda / logistics">
            <p>{paper.agendaLogistics}</p>
          </Section>
        ) : (
          <Section label="Agenda / logistics">
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              Deleted for air-show / bilateral meetings.
            </p>
          </Section>
        )}

        <Section label="Campaign background">
          <p>{paper.campaignBackground}</p>
          {paper.countryPaperBlurb && (
            <p className="mt-3 text-sm" style={{ color: "var(--text-muted)" }}>
              Further detail lives in the country paper.
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
                alt=""
                className="w-24 h-28 object-cover shrink-0"
                style={{ border: "1px solid var(--surface-border)" }}
              />
            )}
            <div>
              <p className="font-semibold" style={{ color: NAVY }}>{paper.biography.name}</p>
              <p className="text-sm mb-2">{paper.biography.title}</p>
              <p>{paper.biography.text}</p>
            </div>
          </div>
        </Section>

        <p className="pt-8 text-center text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
          Boeing Proprietary
        </p>
      </article>

      {internalNotes && (
        <div className="px-5 py-4 text-sm" style={{ background: "var(--bg-muted)", color: "var(--text-secondary)" }}>
          <p className="font-semibold text-xs uppercase tracking-wider mb-2" style={{ color: NAVY }}>Internal only — not on the paper</p>
          <p className="whitespace-pre-wrap">{internalNotes}</p>
        </div>
      )}

      <div className="flex gap-3 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        <Lock size={14} color={BLUE} className="mt-0.5 shrink-0" />
        <p>
          In-country owns wording on objectives, RAA, and key messages. CTL drafts messages; integrator supplies agenda only when it applies.
        </p>
      </div>
    </div>
  )
}
