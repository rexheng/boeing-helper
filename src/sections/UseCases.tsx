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
    alt: "F-22 fighter jet on static display at a defense airshow",
    lede: "High-volume bilateral calendars with late schedule changes.",
    detail:
      "Build one briefing per counterpart: attendees, prior asks, and open commitments — same structure for handoff.",
    outcome: "Consistent briefing format across the delegation.",
  },
  {
    index: "02",
    title: "Government and Defense Roundtables",
    image: "/images/usecase-government.jpg",
    alt: "Boeing C-17 Globemaster III in flight",
    lede: "Ministerial and staff meetings with known programme questions.",
    detail:
      "Country context with the individual: defence posture, procurement cycle, offsets, and recorded concerns.",
    outcome: "Offsets, timelines, and prior commitments in one place.",
  },
  {
    index: "03",
    title: "Airlines",
    image: "/images/usecase-airline.jpg",
    alt: "Commercial aircraft at the gate during evening turnaround",
    lede: "Fleet and network briefings based on current customer data.",
    detail:
      "Fleet, orders, network direction, and public operational pressures — carried through follow-ups as one account record.",
    outcome: "Shared account view across touchpoints.",
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
            title="Use cases: air shows, government talks, and airline reviews"
            subtitle="Same preparation flow for air-show, government, and airline meetings."
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
