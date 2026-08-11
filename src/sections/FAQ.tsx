import { useState } from "react"
import { Plus } from "lucide-react"
import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface FAQProps {
  id?: string
}

const faqs = [
  {
    q: "Who is Boeing Helper for?",
    a: "Integrators and CTLs draft; VPGMs, Division BD, and IBD VP review. Both sides work from one pack — with inputs from Division BD CoS, BGS-G, GovOps, ISP, and other integrators as the show cycle requires.",
  },
  {
    q: "What does it produce?",
    a: "Meeting papers for engagements and roundtables, country papers, FMS cheat sheets, organisation meeting notes, invitation letters, show attendee lists, and post-meeting reports with stakeholder follow-ups.",
  },
  {
    q: "Where does the research come from?",
    a: "Published material — official statements, trade and defense press — and approved internal sources such as account records, programme status, and prior engagement notes. Each section can be traced before a paper leaves the tool.",
  },
  {
    q: "Is this demonstration using live data?",
    a: "No. Demonstration organisations and contacts use prepared research. In production, the same steps run against approved published and internal sources.",
  },
  {
    q: "Can teams take materials offline?",
    a: "Yes. Meeting papers export to PDF from the review step with the same structure as the on-screen version. Teams commonly export the night before so the pack is available on the show floor without a connection.",
  },
  {
    q: "Does this replace RD or IBD review?",
    a: "No. Prep collapses; review does not. Regional Directors, Division BD, VPGMs, and IBD VP still clear papers. Late attendee additions still need IBD VP approval.",
  },
]

export function FAQ({ id }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader eyebrow="FAQ" title="Questions we get from teams." />

        <div className="max-w-3xl" style={{ borderTop: "1px solid var(--surface-border)" }}>
          {faqs.map((faq, i) => {
            const isOpen = open === i
            return (
              <div key={faq.q} style={{ borderBottom: "1px solid var(--surface-border)" }}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
                >
                  <span
                    className="text-lg font-semibold"
                    style={{ color: isOpen ? "var(--boeing-blue)" : "var(--boeing-navy)" }}
                  >
                    {faq.q}
                  </span>
                  <Plus
                    size={20}
                    strokeWidth={1.5}
                    className="shrink-0 transition-transform duration-200"
                    style={{
                      color: "var(--boeing-blue)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "32rem" : "0", opacity: isOpen ? 1 : 0 }}
                >
                  <p
                    className="pb-7 pr-10 leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {faq.a}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
