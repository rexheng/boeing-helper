import { useEffect, useState } from "react"
import { FileUp, Building2, Newspaper, GitMerge, Eye, ArrowRight } from "lucide-react"
import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface SecurityProps {
  id?: string
}

const trustOrder = [
  {
    rank: "01",
    title: "Uploaded documents",
    note: "Campaign packs, prior notes, letters attached for this meeting",
    tone: "primary" as const,
  },
  {
    rank: "02",
    title: "Internal Boeing knowledge",
    note: "Account records, programme status, prior meeting history",
    tone: "secondary" as const,
  },
  {
    rank: "03",
    title: "Published sources",
    note: "Filings, official statements, trade and defence press",
    tone: "tertiary" as const,
  },
]

export function Security({ id }: SecurityProps) {
  const { ref, visible } = useInView(0.2)
  const [drawn, setDrawn] = useState(false)

  useEffect(() => {
    if (!visible) return
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setDrawn(true)
      return
    }
    const t = window.setTimeout(() => setDrawn(true), 80)
    return () => window.clearTimeout(t)
  }, [visible])

  return (
    <section id={id} className="section section--muted">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Data integrity"
          title="Every figure traces back to a source."
          subtitle="Two lanes collect in parallel. The briefing is assembled from what was found — not invented — and every claim keeps its origin."
        />

        {/* Flow diagram */}
        <div
          className="overflow-hidden"
          style={{
            borderRadius: "var(--radius)",
            border: "1px solid var(--surface-border)",
            background: "#fff",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {/* Stage labels */}
          <div
            className="hidden md:grid grid-cols-[1.15fr_auto_1fr_auto_0.85fr] gap-3 px-7 pt-6 pb-2"
            aria-hidden
          >
            {["Collect", "", "Assemble", "", "Review"].map((label, i) => (
              <p
                key={i}
                className="font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
                style={{ color: label ? "var(--boeing-blue)" : "transparent" }}
              >
                {label || "·"}
              </p>
            ))}
          </div>

          <div className="p-5 sm:p-7">
            {/* Desktop flow */}
            <div className="hidden md:grid md:grid-cols-[1.15fr_auto_1fr_auto_0.85fr] md:items-stretch md:gap-3">
              {/* Collect — parallel lanes */}
              <div className="flex flex-col gap-3 min-h-[14rem]">
                <FlowLane
                  drawn={drawn}
                  delay={0}
                  accent="var(--boeing-blue)"
                  icon={FileUp}
                  eyebrow="Elevated"
                  title="Uploads"
                  body="Documents you attach for this engagement"
                />
                <FlowLane
                  drawn={drawn}
                  delay={90}
                  accent="var(--boeing-navy)"
                  icon={Building2}
                  eyebrow="Internal"
                  title="Boeing knowledge"
                  body="Approved account and programme records"
                />
                <FlowLane
                  drawn={drawn}
                  delay={180}
                  accent="var(--boeing-cyan)"
                  icon={Newspaper}
                  eyebrow="In parallel"
                  title="AI research agent"
                  body="Filings, statements, trade and defence press"
                />
              </div>

              <FlowArrow drawn={drawn} delay={280} />

              {/* Assemble */}
              <div className="flex flex-col justify-center">
                <div
                  className="relative px-5 py-6 h-full flex flex-col justify-center"
                  style={{
                    background: "var(--boeing-navy)",
                    borderRadius: "var(--radius-sm)",
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 0.55s ease 0.32s, transform 0.55s var(--ease-out-expo) 0.32s",
                  }}
                >
                  <GitMerge size={20} strokeWidth={1.5} style={{ color: "var(--boeing-cyan-bright)" }} />
                  <p
                    className="mt-4 font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: "var(--boeing-cyan-bright)" }}
                  >
                    Briefing
                  </p>
                  <p className="mt-2 text-base font-semibold leading-snug" style={{ color: "#fff" }}>
                    Claims keep their source and date
                  </p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                    Uploads and internal records outrank press when sources disagree.
                  </p>
                  <div
                    className="mt-5 pt-4 flex flex-wrap gap-2"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.14)" }}
                  >
                    {["Source", "Date", "Tier"].map((chip) => (
                      <span
                        key={chip}
                        className="px-2.5 py-1 font-ui text-[10px] font-semibold uppercase tracking-[0.12em]"
                        style={{
                          background: "rgba(130,212,246,0.12)",
                          color: "var(--boeing-cyan-bright)",
                          borderRadius: "2px",
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <FlowArrow drawn={drawn} delay={420} />

              {/* Review */}
              <div className="flex flex-col justify-center">
                <div
                  className="px-5 py-6 h-full flex flex-col justify-center"
                  style={{
                    background: "var(--boeing-ice)",
                    border: "1px solid var(--surface-border)",
                    borderRadius: "var(--radius-sm)",
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? "translateY(0)" : "translateY(12px)",
                    transition: "opacity 0.55s ease 0.45s, transform 0.55s var(--ease-out-expo) 0.45s",
                  }}
                >
                  <Eye size={20} strokeWidth={1.5} style={{ color: "var(--boeing-blue)" }} />
                  <p
                    className="mt-4 font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
                    style={{ color: "var(--boeing-blue)" }}
                  >
                    Before the room
                  </p>
                  <p className="mt-2 text-base font-semibold leading-snug" style={{ color: "var(--boeing-navy)" }}>
                    Check any figure
                  </p>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Open the source on screen or in the PDF export.
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile flow */}
            <div className="md:hidden space-y-3">
              <p
                className="font-ui text-[10px] font-bold uppercase tracking-[0.16em] mb-1"
                style={{ color: "var(--boeing-blue)" }}
              >
                Collect — in parallel
              </p>
              <FlowLane
                drawn={drawn}
                delay={0}
                accent="var(--boeing-blue)"
                icon={FileUp}
                eyebrow="Elevated"
                title="Uploads"
                body="Documents you attach for this engagement"
              />
              <FlowLane
                drawn={drawn}
                delay={60}
                accent="var(--boeing-navy)"
                icon={Building2}
                eyebrow="Internal"
                title="Boeing knowledge"
                body="Approved account and programme records"
              />
              <FlowLane
                drawn={drawn}
                delay={120}
                accent="var(--boeing-cyan)"
                icon={Newspaper}
                eyebrow="In parallel"
                title="AI research agent"
                body="Filings, statements, trade and defence press"
              />
              <MobileJoin drawn={drawn} />
              <div
                className="px-4 py-5"
                style={{
                  background: "var(--boeing-navy)",
                  borderRadius: "var(--radius-sm)",
                  opacity: drawn ? 1 : 0,
                  transition: "opacity 0.45s ease 0.28s",
                }}
              >
                <p
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "var(--boeing-cyan-bright)" }}
                >
                  Assemble
                </p>
                <p className="mt-2 text-base font-semibold" style={{ color: "#fff" }}>
                  Claims keep their source and date
                </p>
                <p className="mt-1.5 text-sm" style={{ color: "rgba(255,255,255,0.72)" }}>
                  Uploads and internal records outrank press when sources disagree.
                </p>
              </div>
              <MobileJoin drawn={drawn} />
              <div
                className="px-4 py-5"
                style={{
                  background: "var(--boeing-ice)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "var(--radius-sm)",
                  opacity: drawn ? 1 : 0,
                  transition: "opacity 0.45s ease 0.4s",
                }}
              >
                <p
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "var(--boeing-blue)" }}
                >
                  Review
                </p>
                <p className="mt-2 text-base font-semibold" style={{ color: "var(--boeing-navy)" }}>
                  Check any figure before the room
                </p>
                <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                  Open the source on screen or in the PDF export.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust order */}
        <div className="mt-10 md:mt-12">
          <p
            className="font-ui text-[11px] font-bold uppercase tracking-[0.16em] mb-5"
            style={{ color: "var(--boeing-blue)" }}
          >
            When sources disagree
          </p>
          <ol className="grid gap-4 sm:grid-cols-3">
            {trustOrder.map((item, i) => (
              <li
                key={item.title}
                className="relative pt-1"
                style={{
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.45s ease ${520 + i * 80}ms, transform 0.45s var(--ease-out-expo) ${520 + i * 80}ms`,
                }}
              >
                <div
                  className="mb-3 h-1 w-full"
                  style={{
                    background:
                      item.tone === "primary"
                        ? "var(--boeing-blue)"
                        : item.tone === "secondary"
                          ? "var(--boeing-navy)"
                          : "var(--boeing-cyan)",
                    opacity: item.tone === "tertiary" ? 0.55 : 1,
                  }}
                />
                <p
                  className="font-mono text-xs tabular-nums"
                  style={{ color: "var(--boeing-cyan)" }}
                >
                  {item.rank}
                </p>
                <p
                  className="mt-1.5 text-sm font-semibold"
                  style={{ color: "var(--boeing-navy)" }}
                >
                  {item.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.note}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function FlowLane({
  drawn,
  delay,
  accent,
  icon: Icon,
  eyebrow,
  title,
  body,
}: {
  drawn: boolean
  delay: number
  accent: string
  icon: typeof FileUp
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <div
      className="flex-1 px-4 py-3.5"
      style={{
        background: "var(--bg-muted)",
        borderLeft: `3px solid ${accent}`,
        borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
        opacity: drawn ? 1 : 0,
        transform: drawn ? "translateX(0)" : "translateX(-10px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s var(--ease-out-expo) ${delay}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <Icon size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" style={{ color: accent }} />
        <div className="min-w-0">
          <p
            className="font-ui text-[10px] font-bold uppercase tracking-[0.14em]"
            style={{ color: accent }}
          >
            {eyebrow}
          </p>
          <p className="mt-1 text-sm font-semibold" style={{ color: "var(--boeing-navy)" }}>
            {title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {body}
          </p>
        </div>
      </div>
    </div>
  )
}

function FlowArrow({ drawn, delay }: { drawn: boolean; delay: number }) {
  return (
    <div className="flex items-center justify-center px-1" aria-hidden>
      <ArrowRight
        size={22}
        strokeWidth={1.75}
        style={{
          color: "var(--boeing-blue)",
          opacity: drawn ? 1 : 0,
          transform: drawn ? "translateX(0)" : "translateX(-6px)",
          transition: `opacity 0.4s ease ${delay}ms, transform 0.4s var(--ease-out-expo) ${delay}ms`,
        }}
      />
    </div>
  )
}

function MobileJoin({ drawn }: { drawn: boolean }) {
  return (
    <div className="flex justify-center py-0.5" aria-hidden>
      <div
        className="h-5 w-px"
        style={{
          background: "var(--boeing-blue)",
          opacity: drawn ? 0.55 : 0,
          transition: "opacity 0.35s ease 0.2s",
        }}
      />
    </div>
  )
}
