import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface ToolShowcaseProps {
  id?: string
}

interface Capability {
  title: string
  image: string
  alt: string
  focus?: string
  points: string[]
}

const capabilities: Capability[] = [
  {
    title: "Papers & briefings",
    image: "/images/capability-briefing.jpg",
    alt: "Colleagues reviewing printed briefing material at a table",
    points: [
      "Meeting papers for every engagement",
      "Country papers and FMS cheat sheets",
      "Biography cut to current title and role",
    ],
  },
  {
    title: "Meeting invitations",
    image: "/images/capability-bio.jpg",
    alt: "Portrait of an executive in a glass-walled office",
    focus: "50% 18%",
    points: [
      "Invitation letters from the Boeing template",
      "Meeting-only, special-event, or contact-first closings",
      "Ready for in-country review before send",
    ],
  },
  {
    title: "Attendee lists & reports",
    image: "/images/capability-live.jpg",
    alt: "Delegates taking notes during a conference session",
    points: [
      "Show attendee lists across BUs",
      "Travel key and review path to lock",
      "Post-meeting notes against paper objectives",
    ],
  },
]

export function ToolShowcase({ id }: ToolShowcaseProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Capabilities"
          title="Meeting papers, invitations, attendee lists, and reports."
          subtitle="Structured for executive and leadership team review."
        />

        <div className={`grid gap-6 md:grid-cols-3 stagger ${visible ? "visible" : ""}`}>
          {capabilities.map((cap) => (
            <article key={cap.title} className="flex h-full flex-col">
              <div className="photo-tile">
                <img
                  src={cap.image}
                  alt={cap.alt}
                  className="photo-tile__media"
                  loading="lazy"
                  style={{ objectPosition: cap.focus }}
                />
                <div className="photo-tile__scrim" />
                <div className="photo-tile__body">
                  <h3 style={{ color: "#fff", fontSize: "1.5rem" }}>{cap.title}</h3>
                </div>
              </div>

              <ul className="mt-5 space-y-2">
                {cap.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-snug"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-px w-3 shrink-0"
                      style={{ background: "var(--boeing-blue)" }}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
