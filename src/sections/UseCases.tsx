import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface UseCasesProps {
  id?: string
}

interface UseCase {
  index: string
  title: string
  image: string
  alt: string
  lede: string
  detail: string
  outcome: string
}

const cases: UseCase[] = [
  {
    index: "01",
    title: "MSPO 2026",
    image: "/images/usecase-airshow.jpg",
    alt: "Commercial airliner on the apron ahead of an international aerospace event",
    lede: "Sixty-plus official delegations. A schedule that still moves the night before.",
    detail:
      "Integrators and CTLs build a meeting paper per counterpart before pavilion schedules and bilateral meetings lock — objectives, key messages, open commitments, and biography. Invitation letters and attendee-list lines follow the same organisation so a colleague can pick up at short notice.",
    outcome: "One preparation standard across the whole MSPO delegation.",
  },
  {
    index: "02",
    title: "Government and Defense Roundtables",
    image: "/images/usecase-government.jpg",
    alt: "Boeing C-17 Globemaster III in flight",
    lede: "Ministerial and staff talks where the questions are known long before they are asked.",
    detail:
      "Meeting papers carry customer sat issues, campaign background, and RAA next to the person in the room. Country papers and FMS cheat sheets sit behind the walk-in pack so RD and IBD review one story, not divergent drafts.",
    outcome: "No surprises on offsets, timelines, or prior commitments.",
  },
  {
    index: "03",
    title: "Airlines",
    image: "/images/usecase-airline.jpg",
    alt: "Commercial aircraft at the gate during evening turnaround",
    lede: "Fleet and network conversations that start from the customer's actual position.",
    detail:
      "Organisation meeting papers and follow-up reports keep fleet, orders, and operational pressure in one shared record — from first invitation through post-meeting stakeholder tracking.",
    outcome: "One meeting paper and follow-up report the account team and reviewers share.",
  },
]

function UseCaseRow({ item, flip }: { item: UseCase; flip: boolean }) {
  const { ref, visible } = useInView()

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} grid gap-10 md:grid-cols-2 md:gap-16 md:items-center`}
    >
      <div className={flip ? "md:order-2" : ""}>
        <img
          src={item.image}
          alt={item.alt}
          loading="lazy"
          className="w-full object-cover"
          style={{
            aspectRatio: "4 / 3",
          }}
        />
      </div>

      <div className={flip ? "md:order-1" : ""}>
        <p className="font-mono text-sm tracking-widest" style={{ color: "var(--boeing-cyan)" }}>
          {item.index}
        </p>

        <h3 className="mt-3">{item.title}</h3>

        <p
          className="mt-4 text-xl font-light leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          {item.lede}
        </p>

        <p className="mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {item.detail} {item.outcome}
        </p>
      </div>
    </div>
  )
}

export function UseCases({ id }: UseCasesProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section section--muted">
      <div className="constrain">
        <div ref={ref} className={`reveal ${visible ? "visible" : ""}`}>
          <SectionHeader
            eyebrow="Use Cases"
            title="One paper flow. Three kinds of room."
            subtitle="Air shows, government talks, airline reviews."
          />
        </div>

        <div className="space-y-20 md:space-y-28">
          {cases.map((item, i) => (
            <UseCaseRow key={item.index} item={item} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
