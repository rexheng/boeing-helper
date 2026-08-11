import { SectionHeader } from "../components/SectionHeader"
import { Button } from "../components/Button"
import { useInView } from "../hooks/useInView"

interface PricingProps {
  id?: string
}

const tracks = [
  {
    label: "Internal pilot",
    title: "One campaign, one show cycle",
    desc: "A single integrator or campaign team runs Boeing Helper through a live engagement cycle — meeting papers, invites, and attendee drafts for one show.",
    detail: "Set up with your existing distribution list and SharePoint folder.",
  },
  {
    label: "Team rollout",
    title: "Across regions and business units",
    desc: "Shared paper templates and one preparation standard for BDS, BGS, GovOps, and IBD reviewers — so RD and VPGM review the same pack every time.",
    detail: "Coordinated with IT and the relevant records owners.",
  },
  {
    label: "Support",
    title: "Onboarding and paper review",
    desc: "Guidance on structuring meeting papers, invitation language, and attendee-list timing for a specific show calendar.",
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
          title="Available to Boeing teams on request."
          subtitle="Boeing Helper is an internal tool. It is not sold or licensed externally. Access starts with a pilot on a live show cycle."
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
              Request a pilot for your team
            </p>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Tell us the show cycle you are preparing for and we will set up access with your integrator.
            </p>
          </div>
          <a href="#top" className="shrink-0">
            <Button variant="primary">Request pilot access</Button>
          </a>
        </div>
      </div>
    </section>
  )
}
