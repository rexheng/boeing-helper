import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface ToolShowcaseProps {
  id?: string
}

interface Capability {
  title: string
  image: string
  alt: string
  /** Framing for portrait-oriented photography inside the landscape tile. */
  focus?: string
  desc: string
  points: string[]
}

const capabilities: Capability[] = [
  {
    title: "Briefing Intelligence",
    image: "/images/capability-briefing.jpg",
    alt: "Colleagues reviewing printed briefing material at a table",
    desc: "One consolidated read-ahead per engagement — company position, industry landscape, and country context, assembled before you leave for the show.",
    points: [
      "Fleet, order book, and programme status",
      "Industry and competitor movement",
      "Country priorities and bilateral context",
    ],
  },
  {
    title: "Biography Preparation",
    image: "/images/capability-bio.jpg",
    alt: "Portrait of an executive in a glass-walled office",
    focus: "50% 18%",
    desc: "Know who is in the room before you shake hands. Career history, portfolio, public positions, and the concerns they have raised on record.",
    points: [
      "Appointment history and reporting lines",
      "Stated priorities and recent remarks",
      "Prior Boeing touchpoints and open items",
    ],
  },
  {
    title: "Live Meeting Overlay",
    image: "/images/capability-live.jpg",
    alt: "Delegates taking notes during a conference session",
    desc: "Keep the briefing at hand while the meeting runs. Recall a figure, a programme name, or a follow-up commitment without breaking the conversation.",
    points: [
      "Key facts on a single keystroke",
      "Talking points and questions to expect",
      "Follow-ups captured as they are agreed",
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
          title="Everything your team needs before the room fills."
          subtitle="Boeing Helper pulls preparation into one place so account teams, campaign leads, and executives arrive with the same picture of the counterpart."
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

              <p
                className="mt-5 text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {cap.desc}
              </p>

              <ul className="mt-auto space-y-2 pt-5">
                {cap.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span
                      aria-hidden
                      className="mt-2 h-px w-4 shrink-0"
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
