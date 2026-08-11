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
  desc: string
  points: string[]
}

const capabilities: Capability[] = [
  {
    title: "Papers & briefings",
    image: "/images/capability-briefing.jpg",
    alt: "Colleagues reviewing printed briefing material at a table",
    desc: "Meeting papers for every engagement — objectives, key messages, campaign background, customer sat issues, and biography — plus country papers and FMS cheat sheets when the trip book needs them.",
    points: [
      "Meeting paper structure leadership already expects",
      "Country papers and FMS cheat sheets in the same flow",
      "Biography cut to current title and role",
    ],
  },
  {
    title: "Meeting invitations",
    image: "/images/capability-bio.jpg",
    alt: "Portrait of an executive in a glass-walled office",
    focus: "50% 18%",
    desc: "Event and bilateral invitation letters from the real Boeing invitation template — salutation, event context, showcase language, and the right closing paragraph for the ask.",
    points: [
      "Meeting-only, special-event, or contact-first closings",
      "Sender, contact, and event fields filled once",
      "Ready for in-country review before it goes out",
    ],
  },
  {
    title: "Attendee list",
    image: "/images/capability-live.jpg",
    alt: "Delegates taking notes during a conference session",
    desc: "Show attendee lists across BDS, BGS, Boeing Global, and exhibit operations — with travel key, objectives, and the D-90 to D-30 review path integrators already run.",
    points: [
      "BU lanes that match the show template",
      "International, domestic, and local travel counts",
      "Draft → RD → division leads → executive lock",
    ],
  },
  {
    title: "Meeting report",
    image: "/images/usecase-government.jpg",
    alt: "Boeing C-17 Globemaster III in flight",
    desc: "Post-meeting notes and stakeholder tracking after the room — what was said, what was committed, and who owns the follow-up.",
    points: [
      "Outcomes against the paper’s objectives",
      "Action owners and due dates",
      "Feed for the next engagement background",
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
          title="Everything the show cycle needs before papers lock."
          subtitle="Boeing Helper is a briefing-materials preparer for integrators, CTLs, and the reviewers who sign the trip book — not a live meeting overlay."
        />

        <div className={`grid gap-6 sm:grid-cols-2 stagger ${visible ? "visible" : ""}`}>
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

              <p className="mt-5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {cap.desc}
              </p>

              <ul className="mt-4 space-y-2">
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
