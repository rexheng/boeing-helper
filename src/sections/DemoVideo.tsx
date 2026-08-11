import { Button } from "../components/Button"
import { useInView } from "../hooks/useInView"

interface DemoVideoProps {
  id?: string
  onStartDemo: () => void
}

export function DemoVideo({ id, onStartDemo }: DemoVideoProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section section--navy">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="system-badge mb-5">Demonstration</p>
            <h2 style={{ color: "#fff", maxWidth: "18ch" }}>
              Walk a meeting paper from draft to handoff.
            </h2>
            <p
              className="mt-5 text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.82)", maxWidth: "52ch" }}
            >
              Pick the organisation and counterpart, set the engagement, watch research
              assemble, review the meeting paper, prepare the invite and attendee line,
              then hand off for RD and IBD review.
            </p>
          </div>

          <div className="shrink-0">
            <Button variant="secondary" onClick={onStartDemo}>
              Launch Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
