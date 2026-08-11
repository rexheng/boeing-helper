import { Button } from "../components/Button"

interface HandoffScreenProps {
  personName: string
  companyName: string
  meetingType: string
  onContinue: () => void
}

const BLUE = "#0033A1"
const NAVY = "#0A2240"

const pack = [
  "Meeting paper (PDF)",
  "Invitation letter draft",
  "Attendee-list line (BDS / IBD)",
]

const nextReview = [
  { role: "Regional Director", action: "Review / edit, release to division leads" },
  { role: "Division BD / CoS", action: "Return feedback on draft" },
  { role: "VPGM", action: "Executive review gate" },
  { role: "IBD VP", action: "Final clearance; late attendee adds" },
]

export function HandoffScreen({ personName, companyName, meetingType, onContinue }: HandoffScreenProps) {
  return (
    <div className="space-y-8 pb-12 max-w-2xl mx-auto">
      <div className="text-center">
        <p className="system-badge system-badge--dark mb-3">Handoff</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Package ready for RD review
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          {meetingType} with {personName} · {companyName}
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8" style={{ border: "1px solid var(--surface-border)" }}>
        <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: BLUE }}>
          Package contents
        </p>
        <ul className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          {pack.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-px w-3 shrink-0" style={{ background: BLUE }} />
              {item}
            </li>
          ))}
        </ul>

        <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] mt-8 mb-4" style={{ color: BLUE }}>
          Next reviewer
        </p>
        <p className="font-semibold" style={{ color: NAVY }}>Regional Director</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Status: Ready for RD review. After RD release: Division BD → VPGM → IBD VP.
        </p>

        <ol className="mt-6 space-y-3">
          {nextReview.map((step, i) => (
            <li key={step.role} className="flex gap-3 text-sm">
              <span className="font-mono text-xs tabular-nums pt-0.5" style={{ color: "var(--boeing-cyan)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="font-medium" style={{ color: NAVY }}>{step.role}</span>
                <span style={{ color: "var(--text-secondary)" }}> — {step.action}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        Inputs typically from CTLs, Division BD CoS, BGS-G, GovOps, GovOps CoS, integrators, ISP, and ISP CoS. The tool does not invent new approvers.
      </p>

      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue to meeting report</Button>
      </div>
    </div>
  )
}
