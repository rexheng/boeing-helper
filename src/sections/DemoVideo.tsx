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
            <h2 style={{ color: "#fff", maxWidth: "16ch" }}>
              Prepare your next <span className="whitespace-nowrap">air-show</span> meeting.
            </h2>
            <p
              className="mt-5 text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.82)", maxWidth: "52ch" }}
            >
              Six steps, start to finish — pick the organisation and the counterpart, set the
              meeting type, watch the research assemble, review the briefing, and take it into a
              live meeting.
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
