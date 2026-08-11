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
      "Campaign and country teams build a briefing per counterpart before the chalet and bilateral calendar locks — who is attending, what they have asked for previously, and where open commitments sit. Every pack follows the same structure so a colleague can pick up a meeting at short notice.",
    outcome: "One preparation standard across the whole MSPO delegation.",
  },
  {
    index: "02",
    title: "Government and Defense Roundtables",
    image: "/images/usecase-government.jpg",
    alt: "Boeing C-17 Globemaster III in flight",
    lede: "Ministerial and staff talks where the questions are known long before they are asked.",
    detail:
      "Boeing Helper assembles the country picture alongside the individual: defense posture, procurement cycle, industrial participation expectations, and the bilateral concerns that have surfaced on record. Sustainment and offset commitments sit next to the person raising them.",
    outcome: "No surprises on offsets, timelines, or prior commitments.",
  },
  {
    index: "03",
    title: "Airlines",
    image: "/images/usecase-airline.jpg",
    alt: "Commercial aircraft at the gate during evening turnaround",
    lede: "Fleet and network conversations that start from the customer's actual position.",
    detail:
      "Current fleet, orders and options, network direction, and the operational pressures leadership has been public about — gathered before the first call and carried through follow-ups so the account team keeps one shared record of the relationship.",
    outcome: "One shared view of the account across every touchpoint.",
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
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow-card)",
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
          {item.detail}
        </p>

        <p
          className="mt-6 pl-5 text-base font-medium"
          style={{
            color: "var(--boeing-navy)",
            borderLeft: "2px solid var(--boeing-blue)",
          }}
        >
          {item.outcome}
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
            title="Built around the meetings with 60+ official delegations from allied nations."
            subtitle="The same preparation flow whether the counterpart sits in an MSPO bilateral, a government roundtable, or an airline leadership review."
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
