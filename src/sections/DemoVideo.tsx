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
            <p className="system-badge mb-5">Quick start</p>
            <h2 style={{ color: "#fff", maxWidth: "16ch" }}>
              Prepare a meeting briefing
            </h2>
            <p
              className="mt-5 text-lg leading-relaxed"
              style={{ color: "rgba(255,255,255,0.82)", maxWidth: "52ch" }}
            >
              Select organisation and contact, choose meeting type, run research, then export materials.
            </p>
          </div>

          <div className="shrink-0">
            <Button variant="secondary" onClick={onStartDemo}>
              Start preparation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
