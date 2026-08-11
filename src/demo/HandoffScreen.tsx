import { Button } from "../components/Button"

interface HandoffScreenProps {
  personName: string
  companyName: string
  meetingType: string
  onContinue: () => void
}

const BLUE = "#0033A1"
const NAVY = "#0A2240"

const path = [
  { role: "Integrator / CTL", action: "Draft meeting paper, invite, and attendee line" },
  { role: "In-country team", action: "Owns wording on objectives, RAA, and key messages" },
  { role: "Regional Director", action: "Review and release to division leads" },
  { role: "Division BD / CoS", action: "Return feedback on draft" },
  { role: "VPGM / Division BD", action: "Executive review gates" },
  { role: "IBD VP", action: "Final clearance; late additions need approval" },
]

export function HandoffScreen({ personName, companyName, meetingType, onContinue }: HandoffScreenProps) {
  return (
    <div className="space-y-8 pb-12 max-w-2xl mx-auto">
      <div className="text-center">
        <p className="system-badge system-badge--dark mb-3">Handoff</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Ready for review
        </h2>
        <p className="mt-3" style={{ color: "var(--text-secondary)" }}>
          {meetingType} with {personName} · {companyName}
        </p>
      </div>

      <div className="bh-card p-6 sm:p-8">
        <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] mb-5" style={{ color: BLUE }}>
          Review path
        </p>
        <ol className="space-y-4">
          {path.map((step, i) => (
            <li key={step.role} className="flex gap-4">
              <span
                className="font-mono text-xs tabular-nums pt-1 shrink-0"
                style={{ color: "var(--boeing-cyan)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="font-semibold text-sm" style={{ color: NAVY }}>{step.role}</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>{step.action}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="p-5 text-sm leading-relaxed"
        style={{ background: "var(--bg-muted)", borderLeft: `3px solid ${BLUE}`, color: "var(--text-secondary)" }}
      >
        Collaborators who typically supply inputs: CTLs, Division BD CoS, BGS-G, GovOps, GovOps CoS, other integrators, ISP, and ISP CoS. The tool does not invent new approvers.
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <Button onClick={onContinue}>Continue to meeting report</Button>
      </div>
    </div>
  )
}
