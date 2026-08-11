import { FileCheck2, Landmark, MicOff, ShieldCheck } from "lucide-react"
import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface SecurityProps {
  id?: string
}

const trustPoints = [
  {
    icon: Landmark,
    title: "Internal tool, internal data",
    desc: "Boeing Helper runs as an internal application. Briefings, notes, and meeting records stay inside Boeing systems and are not shared with external parties.",
  },
  {
    icon: FileCheck2,
    title: "Approved sources only",
    desc: "Research is assembled from published material and approved internal sources. Every claim in a briefing carries its source so it can be checked before it is used in a meeting.",
  },
  {
    icon: MicOff,
    title: "No recording by default",
    desc: "The live meeting view does not record audio or video and does not transcribe unless a user explicitly turns it on. Nothing is captured in the background.",
  },
  {
    icon: ShieldCheck,
    title: "Handled as Boeing confidential",
    desc: "Customer, government, and programme information is treated as Boeing confidential and follows existing classification and retention practice. Export control and non-disclosure obligations still apply.",
  },
]

const sourceGroups = [
  {
    label: "Published sources",
    items: ["Regulatory filings", "Official statements", "Trade and defense press"],
  },
  {
    label: "Approved internal sources",
    items: ["Account and campaign records", "Programme status", "Prior meeting notes"],
  },
]

export function Security({ id }: SecurityProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Trust"
          title="Handled the way Boeing handles everything else."
          subtitle="Boeing Helper is an internal preparation tool. It is designed to sit inside existing confidentiality, export control, and records practice rather than alongside it."
        />

        <div className="grid gap-12 md:grid-cols-[3fr_2fr] md:gap-16">
          <div className="grid gap-8 sm:grid-cols-2">
            {trustPoints.map((tp) => {
              const Icon = tp.icon
              return (
                <div key={tp.title}>
                  <Icon size={22} strokeWidth={1.5} style={{ color: "var(--boeing-blue)" }} />
                  <h4
                    className="mt-4 text-base font-semibold"
                    style={{ color: "var(--boeing-navy)" }}
                  >
                    {tp.title}
                  </h4>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {tp.desc}
                  </p>
                </div>
              )
            })}
          </div>

          <div
            className="p-7"
            style={{
              background: "var(--boeing-navy)",
              borderRadius: "var(--radius)",
              color: "#fff",
            }}
          >
            <p className="system-badge">Where briefings come from</p>

            <div className="mt-6 space-y-6">
              {sourceGroups.map((group) => (
                <div key={group.label}>
                  <p
                    className="font-ui text-xs font-medium uppercase"
                    style={{ color: "var(--boeing-cyan-bright)", letterSpacing: "0.12em" }}
                  >
                    {group.label}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm"
                        style={{ color: "rgba(255,255,255,0.86)" }}
                      >
                        <span
                          aria-hidden
                          className="mt-2.5 h-px w-3 shrink-0"
                          style={{ background: "var(--boeing-cyan-bright)" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p
              className="mt-7 border-t pt-5 text-xs leading-relaxed"
              style={{ borderColor: "rgba(255,255,255,0.16)", color: "rgba(255,255,255,0.7)" }}
            >
              Sources are shown on every briefing section, so a reviewer can trace any figure back
              before it reaches a customer conversation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
