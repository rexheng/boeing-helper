import { useMemo, useState } from "react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import { generateMeetingPaper } from "../utils/meetingPaperGenerator"

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

  const [outcome, setOutcome] = useState(
    paper.objectives.map((o, i) => `${i + 1}. Partial — discuss in room: ${o}`).join("\n"),
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
          Outcomes against this paper’s objectives — feeds the next engagement background.
        </p>
      </div>

      <article className="bg-white p-6 sm:p-8 space-y-6" style={{ border: "1px solid var(--surface-border)" }}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Engagement</p>
          <p className="mt-2 font-semibold" style={{ color: NAVY }}>{meetingType}</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {person.name} · {person.title} · {company.name}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: BLUE }}>
            Paper objectives
          </p>
          <ol className="space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            {paper.objectives.map((o, i) => (
              <li key={i}>{i + 1}. {o}</li>
            ))}
          </ol>
        </div>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Outcomes vs objectives</span>
          <textarea
            value={outcome}
            onChange={(e) => setOutcome(e.target.value)}
            rows={5}
            className="mt-2 w-full px-3 py-2 text-sm leading-relaxed"
            style={{ border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>Actions · owners · dates</span>
          <textarea
            value={actions}
            onChange={(e) => setActions(e.target.value)}
            rows={4}
            className="mt-2 w-full px-3 py-2 text-sm leading-relaxed font-mono"
            style={{ border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}
          />
        </label>
      </article>

      <div className="flex justify-end">
        <Button onClick={onFinish}>Finish demo</Button>
      </div>
    </div>
  )
}
