import { useState } from "react"
import { Button } from "../components/Button"

interface MeetingReportViewProps {
  personName: string
  personTitle: string
  companyName: string
  meetingType: string
  onFinish: () => void
}

const NAVY = "#0A2240"
const BLUE = "#0033A1"

export function MeetingReportView({
  personName,
  personTitle,
  companyName,
  meetingType,
  onFinish,
}: MeetingReportViewProps) {
  const [outcome, setOutcome] = useState(
    `Discussed programme status and next decision timing with ${personName}. Customer asked for a written follow-up on sustainment cost and delivery window.`,
  )
  const [actions, setActions] = useState(
    `1. Integrator — send follow-up pack within 5 business days\n2. CTL — update campaign background with sat issues raised\n3. In-country — confirm next bilateral window`,
  )

  return (
    <div className="space-y-6 pb-12 max-w-2xl mx-auto">
      <div className="text-center">
        <p className="system-badge system-badge--dark mb-3">Meeting report</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Post-meeting notes
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          Stakeholder tracking after the room — feeds the next engagement background.
        </p>
      </div>

      <article className="bh-card p-6 sm:p-8 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Engagement</p>
          <p className="mt-2 font-semibold" style={{ color: NAVY }}>{meetingType}</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {personName} · {personTitle} · {companyName}
          </p>
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Outcomes vs objectives</span>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            rows={4}
            className="mt-2 w-full px-3 py-2 text-sm rounded-sm leading-relaxed"
            style={{ border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Actions · owners · dates</span>
          <textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            rows={4}
            className="mt-2 w-full px-3 py-2 text-sm rounded-sm leading-relaxed font-mono"
            style={{ border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}
          />
        </label>

        <div
          className="p-4 text-sm"
          style={{ background: "var(--bg-muted)", color: "var(--text-secondary)" }}
        >
          Next paper’s engagement background should cite this report: date, attendees, and open actions.
        </div>
      </article>

      <div className="flex justify-end">
        <Button onClick={onFinish}>Finish demo</Button>
      </div>
    </div>
  )
}
