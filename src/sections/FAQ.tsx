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
    a: "Two lanes run in parallel: an AI research agent over approved published material (filings, official statements, trade and defence press), and Boeing’s internal knowledge — including documents you upload for the meeting. Uploads and internal records outrank press when sources disagree. Each claim in the briefing keeps its source so you can check it before the room.",
  },
  {
    q: "Is this demonstration using live data?",
    a: "This is a proof of concept. The walkthrough shows the same collect → assemble → review path the product is built for: parallel research and internal knowledge, source-labelled briefings, and PDF export for the meeting.",
  },
  {
    q: "Can I export the briefing?",
    a: "Yes. From the review step you can export a PDF with the same structure and source labels as the on-screen briefing — ready for RD, IBD, and the trip book.",
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
