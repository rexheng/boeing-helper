import { SectionHeader } from "../components/SectionHeader"
import { Button } from "../components/Button"
import { useInView } from "../hooks/useInView"

interface PricingProps {
  id?: string
}

export function Pricing({ id }: PricingProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section section--muted">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Access"
          title="Internal tool. Pilot on one show cycle."
          subtitle="Boeing Helper is not sold externally. Nominate the integrator and the show; IT and records owners clear access."
        />

        <div className={`grid gap-10 md:grid-cols-3 stagger ${visible ? "visible" : ""}`}>
          {[
            {
              label: "Pilot",
              title: "One campaign, one show",
              desc: "Integrator and CTL run meeting papers, invites, and attendee drafts through a live engagement cycle.",
            },
            {
              label: "Team use",
              title: "Shared templates across BUs",
              desc: "Same paper standard for BDS, BGS, GovOps, and IBD reviewers — RD and VPGM see one pack.",
            },
            {
              label: "Support",
              title: "Onboarding with your show calendar",
              desc: "Help structuring papers, invitation language, and attendee-list timing for the cycle you are on.",
            },
          ].map((track) => (
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
              <h4 className="mt-3 text-xl font-semibold" style={{ color: "var(--boeing-navy)" }}>
                {track.title}
              </h4>
              <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {track.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="mt-14 flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between"
          style={{ borderTop: "1px solid var(--surface-border)" }}
        >
          <div>
            <p className="text-xl font-semibold" style={{ color: "var(--boeing-navy)" }}>
              Nominate a pilot show
            </p>
            <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
              Name the integrator and the engagement cycle. Access is arranged internally.
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
