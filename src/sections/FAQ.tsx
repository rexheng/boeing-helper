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
    a: "Boeing teams who prepare for external meetings — campaign and capture leads, country directors, programme managers, and the executives they support. It is aimed at engagements where the counterpart matters as much as the material: air-show meetings, ministerial reviews, and airline leadership calls.",
  },
  {
    q: "Where does the research come from?",
    a: "Two places. Published material such as regulatory filings, official statements, and trade and defense press; and approved internal sources such as account records, programme status, and prior meeting notes. Each briefing section lists the sources behind it so a reviewer can check anything before it is used with a customer.",
  },
  {
    q: "Is this demonstration using live data?",
    a: "No. The demonstration companies and contacts run on prepared research so the flow behaves the same way every time it is shown. When Boeing Helper is connected to live sources, the same six steps run against them and the research assembles while you wait rather than appearing instantly.",
  },
  {
    q: "Can I take the briefing into a meeting offline?",
    a: "Yes. Any briefing can be exported to PDF from the review step, with the same structure and sources as the on-screen version. Teams commonly export the night before so the pack is available without a connection on the show floor.",
  },
  {
    q: "What do the live meeting overlays do?",
    a: "They keep the briefing within reach while the meeting runs. A keystroke brings up the counterpart's background, the key figures for their fleet or programme, or the questions you expected — without switching windows or opening a document in front of the customer.",
  },
  {
    q: "Does it record meetings?",
    a: "Not by default. The live meeting view does not capture audio or video and does not transcribe unless someone explicitly turns it on. Follow-ups are recorded only when a user writes them down.",
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
