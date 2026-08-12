import { SectionHeader } from "../components/SectionHeader"
import { Button } from "../components/Button"
import { useInView } from "../hooks/useInView"

interface PricingProps {
  id?: string
}

const tracks = [
  {
    label: "Internal pilot",
    title: "Single-team pilot",
    desc: "Pilot with one account or campaign team through a full engagement cycle.",
    detail: "Set up with your existing team distribution list.",
  },
  {
    label: "Enterprise rollout",
    title: "Across regions and business units",
    desc: "Shared briefing templates, common source configuration, and consistent meeting records across Commercial, Defense & Space, and Government Services.",
    detail: "Coordinated with IT and the relevant records owners.",
  },
  {
    label: "Support",
    title: "Onboarding and briefing review",
    desc: "Guidance on structuring briefings, reviewing sources before customer meetings, and adapting the flow to a specific show or engagement calendar.",
    detail: "Available to any team already running a pilot.",
  },
]

export function Pricing({ id }: PricingProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section section--muted">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Access"
          title="Request internal access"
          subtitle="Internal use only. Access starts with a pilot on a live engagement cycle."
        />

        <div className={`grid gap-10 md:grid-cols-3 stagger ${visible ? "visible" : ""}`}>
          {tracks.map((track) => (
            <div
              key={track.label}
              className="flex h-full flex-col"
              style={{ borderTop: "2px solid var(--boeing-blue)" }}
            >
              <p
                className="pt-6 font-ui text-xs font-medium uppercase"
                style={{ color: "var(--boeing-blue)", letterSpacing: "0.12em" }}
              >
                {track.label}
              </p>
              <h4
                className="mt-3 text-xl font-semibold"
                style={{ color: "var(--boeing-navy)" }}
              >
                {track.title}
              </h4>
              <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {track.desc}
              </p>
              <p className="mt-auto pt-4 text-sm" style={{ color: "var(--text-muted)" }}>
                {track.detail}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-14 flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between"
          style={{ background: "#fff", borderRadius: "var(--radius)", boxShadow: "var(--shadow-card)" }}
        >
          <div>
            <p className="text-xl font-semibold" style={{ color: "var(--boeing-navy)" }}>
              Request access for your team
            </p>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Specify the engagement cycle for pilot setup.
            </p>
          </div>
          <a href="#top" className="shrink-0">
            <Button variant="primary">Request access</Button>
          </a>
        </div>
      </div>
    </section>
  )
}
