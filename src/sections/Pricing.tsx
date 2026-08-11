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
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""} max-w-3xl`}>
        <SectionHeader
          eyebrow="Access"
          title="Internal tool. Pilot on one show cycle."
          subtitle="Boeing Helper is not sold externally. Nominate the integrator and the show; IT and records owners clear access."
        />

        <div className={`space-y-6 ${visible ? "opacity-100" : ""}`}>
          <p style={{ color: "var(--text-secondary)" }} className="leading-relaxed text-lg">
            Start with one campaign team on a live engagement cycle — meeting papers,
            invitations, and attendee drafts. Shared templates across BUs come after the
            pilot proves the pack for RD and IBD review.
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Onboarding follows your show calendar. No external licensing.
          </p>
        </div>

        <div
          className="mt-12 flex flex-col gap-6 pt-8 md:flex-row md:items-center md:justify-between"
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
