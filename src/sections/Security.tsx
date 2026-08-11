import { Landmark, Users, ShieldCheck } from "lucide-react"
import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface SecurityProps {
  id?: string
}

const trustPoints = [
  {
    icon: Landmark,
    title: "Internal tool, internal data",
    desc: "Boeing Helper runs as an internal application. Papers, invites, attendee lists, and meeting reports stay inside Boeing systems.",
  },
  {
    icon: Users,
    title: "Roles that already own the paper",
    desc: "Draft inputs from CTLs, integrators, GovOps, and ISP. Wording ownership stays with in-country teams. Review clears through VPGMs, Division BD, and IBD VP.",
  },
  {
    icon: ShieldCheck,
    title: "Handled as Boeing confidential",
    desc: "Customer, government, and programme information follows existing classification and retention practice. Export control and non-disclosure obligations still apply.",
  },
]

const sourceGroups = [
  {
    label: "Collaborators (inputs)",
    items: ["CTLs & Division BD CoS", "BGS-G, GovOps & GovOps CoS", "Integrators, ISP & ISP CoS"],
  },
  {
    label: "Reviewers",
    items: ["VPGMs", "Division BD", "IBD VP"],
  },
]

export function Security({ id }: SecurityProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Trust"
          title="Built for existing confidentiality and review practice."
          subtitle="Boeing Helper sits inside export control and records practice — and names the same collaborators and reviewers the show cycle already uses."
        />

        <div className="grid gap-12 md:grid-cols-1">
          <div className="grid gap-8 sm:grid-cols-3">
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
            <p className="system-badge">Who touches the paper</p>

            <div className="mt-6 grid gap-8 sm:grid-cols-2">
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
              Named roles mirror the real handoff path. The tool does not invent new approvers or skip IBD VP lock for late additions.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
