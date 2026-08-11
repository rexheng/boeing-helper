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
}

const capabilities: Capability[] = [
  {
    title: "Papers & briefings",
    image: "/images/capability-briefing.jpg",
    alt: "Colleagues reviewing printed briefing material at a table",
    desc: "Meeting papers for engagements and roundtables — objectives, key messages, campaign background, customer sat issues, and biography — with country papers and FMS cheat sheets when the trip book needs them.",
  },
  {
    title: "Meeting invitations",
    image: "/images/capability-bio.jpg",
    alt: "Portrait of an executive in a glass-walled office",
    focus: "50% 18%",
    desc: "Invitation letters from the Boeing invitation template — salutation, event context, showcase language, and meeting-only, special-event, or contact-first closings.",
  },
  {
    title: "Attendee list",
    image: "/images/capability-live.jpg",
    alt: "Delegates taking notes during a conference session",
    desc: "Show attendee lists across BDS, BGS, Boeing Global, and exhibit operations, with travel key and the D-90 to D-30 path from integrator draft to IBD VP lock.",
  },
  {
    title: "Meeting report",
    image: "/images/capability-briefing.jpg",
    alt: "Briefing materials on a table after a working session",
    desc: "Post-meeting notes against the paper’s objectives — owners, dates, and stakeholder tracking that feed the next engagement background.",
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
          subtitle="Structured for integrator draft and VPGM / IBD review — one pack through the show cycle."
        />

        <div className={`grid gap-10 sm:grid-cols-2 stagger ${visible ? "visible" : ""}`}>
          {capabilities.map((cap) => (
            <article key={cap.title}>
              <div className="overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
                <img
                  src={cap.image}
                  alt={cap.alt}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  style={{ objectPosition: cap.focus }}
                />
              </div>
              <h3 className="mt-5" style={{ fontSize: "1.35rem" }}>{cap.title}</h3>
              <p className="mt-3 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {cap.desc}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
