import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface TestimonialsProps {
  id?: string
}

const notes = [
  {
    quote:
      "Air-show week used to mean rebuilding the same background pack three times over. Now the delegation works from one briefing per counterpart.",
    role: "Regional Capture Lead, Commercial",
  },
  {
    quote:
      "The biography section is what changed the meetings. Knowing what a permanent secretary has said publicly about sustainment sets the tone in the first two minutes.",
    role: "Country Director, Government Services",
  },
  {
    quote:
      "Follow-ups no longer live in one person's notebook. The record carries from the first call through to the review.",
    role: "Programme Manager, Defense & Space",
  },
]

export function Testimonials({ id }: TestimonialsProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="How teams use it"
          title="Preparation that travels with the team."
        />

        <div className={`grid gap-10 md:grid-cols-3 stagger ${visible ? "visible" : ""}`}>
          {notes.map((note) => (
            <figure
              key={note.role}
              className="flex h-full flex-col"
              style={{ borderTop: "2px solid var(--boeing-blue)" }}
            >
              <blockquote
                className="pt-6 text-lg font-light leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {note.quote}
              </blockquote>
              <figcaption
                className="mt-auto pt-5 font-ui text-xs font-medium uppercase"
                style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}
              >
                {note.role}
              </figcaption>
            </figure>
          ))}
        </div>

        <p
          className="mt-12 border-t pt-6 text-sm"
          style={{ borderColor: "var(--surface-border)", color: "var(--text-muted)" }}
        >
          Illustrative scenarios prepared for this demonstration. Roles are representative rather
          than attributed to individuals.
        </p>
      </div>
    </section>
  )
}
