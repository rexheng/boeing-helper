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
    a: "Campaign and capture leads, country directors, programme managers, and the executives they support — for air-show, government, and airline meetings.",
  },
  {
    q: "Where does the research come from?",
    a: "Published material such as regulatory filings, official statements, and trade and defense press; and approved internal sources such as account records, programme status, and prior meeting notes. Each briefing section lists its sources.",
  },
  {
    q: "Does this use live data?",
    a: "Sample organisations use prepared research. Connected environments run the same steps against live sources.",
  },
  {
    q: "Can I take the briefing into a meeting offline?",
    a: "Yes. Export any briefing to PDF from the review step for offline use.",
  },
]

export function FAQ({ id }: FAQProps) {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />

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
