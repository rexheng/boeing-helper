import { useEffect, useState } from "react"
import { FileUp, Building2, Newspaper, ArrowDown } from "lucide-react"
import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface SecurityProps {
  id?: string
}

export function Security({ id }: SecurityProps) {
  const { ref, visible } = useInView(0.18)
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
    const t = window.setTimeout(() => setDrawn(true), 60)
    return () => window.clearTimeout(t)
  }, [visible])

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Data integrity"
          title="Every figure traces back to a source."
          subtitle="Collect in parallel. Assemble with citations. Check before the room."
        />

        <div
          className="relative"
          style={{
            borderRadius: "var(--radius)",
            border: "1px solid var(--surface-border)",
            background: "var(--bg-muted)",
            overflow: "hidden",
          }}
        >
          {/* subtle institutional grid */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(10,34,64,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,34,64,0.04) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div className="relative p-5 sm:p-8 lg:p-10">
            {/* ===== STAGE 1: COLLECT ===== */}
            <StageLabel n="01" label="Collect" drawn={drawn} delay={0} />

            <div
              className="mt-4"
              style={{
                opacity: drawn ? 1 : 0,
                transform: drawn ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.5s ease 0.08s, transform 0.55s var(--ease-out-expo) 0.08s",
              }}
            >
              <div
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                style={{
                  background: "var(--boeing-navy)",
                  borderRadius: "var(--radius-sm) var(--radius-sm) 0 0",
                }}
              >
                <p
                  className="font-ui text-[11px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "#fff" }}
                >
                  Three sources · same moment
                </p>
                <span
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1"
                  style={{
                    background: "var(--boeing-cyan-bright)",
                    color: "var(--boeing-navy)",
                    borderRadius: "2px",
                  }}
                >
                  In parallel
                </span>
              </div>

              <div
                className="grid gap-0 lg:grid-cols-3"
                style={{
                  background: "#fff",
                  border: "1px solid var(--surface-border)",
                  borderTop: "none",
                  borderRadius: "0 0 var(--radius-sm) var(--radius-sm)",
                }}
              >
                <SourceCell
                  drawn={drawn}
                  delay={120}
                  elevated
                  icon={FileUp}
                  kicker="Primary"
                  title="Uploads"
                  body="Campaign packs and notes you attach"
                  className="border-b lg:border-b-0 lg:border-r"
                />
                <SourceCell
                  drawn={drawn}
                  delay={200}
                  icon={Building2}
                  kicker="Internal"
                  title="Boeing knowledge"
                  body="Account, programme, prior meetings"
                  className="border-b lg:border-b-0 lg:border-r"
                />
                <SourceCell
                  drawn={drawn}
                  delay={280}
                  icon={Newspaper}
                  kicker="Published"
                  title="AI research agent"
                  body="Filings, statements, defence press"
                />
              </div>
            </div>

            <FlowJoin drawn={drawn} delay={360} />

            {/* ===== STAGE 2: ASSEMBLE ===== */}
            <StageLabel n="02" label="Assemble" drawn={drawn} delay={400} />

            <div
              className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]"
              style={{
                opacity: drawn ? 1 : 0,
                transform: drawn ? "translateY(0)" : "translateY(10px)",
                transition: "opacity 0.5s ease 0.42s, transform 0.55s var(--ease-out-expo) 0.42s",
              }}
            >
              <div
                className="px-5 py-5 sm:px-6 sm:py-6"
                style={{
                  background: "var(--boeing-navy)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <p
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
                  style={{ color: "var(--boeing-cyan-bright)" }}
                >
                  Briefing output
                </p>
                <p className="mt-3 text-xl font-semibold leading-snug" style={{ color: "#fff" }}>
                  One pack. Every claim labelled.
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.72)" }}>
                  Precedence when sources conflict: uploads → internal → published.
                </p>
              </div>

              {/* Sample citation — proof of the thesis */}
              <div
                className="px-5 py-5 sm:px-6 sm:py-6 flex flex-col justify-center"
                style={{
                  background: "#fff",
                  border: "1px solid var(--surface-border)",
                  borderLeft: "3px solid var(--boeing-blue)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <p
                  className="font-ui text-[10px] font-bold uppercase tracking-[0.14em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Example claim
                </p>
                <p
                  className="mt-2 text-[15px] font-semibold leading-snug"
                  style={{ color: "var(--boeing-navy)" }}
                >
                  31 × 777-9 on order
                </p>
                <div
                  className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span style={{ color: "var(--boeing-blue)", fontWeight: 600 }}>
                    Aviation Week
                  </span>
                  <span aria-hidden style={{ color: "var(--surface-border)" }}>
                    |
                  </span>
                  <span>May 2026</span>
                  <span aria-hidden style={{ color: "var(--surface-border)" }}>
                    |
                  </span>
                  <span
                    className="font-ui uppercase tracking-[0.1em] text-[10px] font-bold"
                    style={{ color: "var(--boeing-blue)" }}
                  >
                    Published
                  </span>
                </div>
              </div>
            </div>

            <FlowJoin drawn={drawn} delay={520} />

            {/* ===== STAGE 3: REVIEW ===== */}
            <StageLabel n="03" label="Review" drawn={drawn} delay={560} />

            <div
              className="mt-4 grid gap-px sm:grid-cols-3 overflow-hidden"
              style={{
                background: "var(--surface-border)",
                border: "1px solid var(--surface-border)",
                borderRadius: "var(--radius-sm)",
                opacity: drawn ? 1 : 0,
                transform: drawn ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.5s ease 0.58s, transform 0.55s var(--ease-out-expo) 0.58s",
              }}
            >
              {[
                { t: "Open the source", d: "Tap any figure in the briefing" },
                { t: "Export the pack", d: "Same citations in the PDF" },
                { t: "Take it to the room", d: "Only after you have checked it" },
              ].map((item) => (
                <div key={item.t} className="px-5 py-5" style={{ background: "#fff" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--boeing-navy)" }}>
                    {item.t}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StageLabel({
  n,
  label,
  drawn,
  delay,
}: {
  n: string
  label: string
  drawn: boolean
  delay: number
}) {
  return (
    <div
      className="flex items-baseline gap-3"
      style={{
        opacity: drawn ? 1 : 0,
        transition: `opacity 0.4s ease ${delay}ms`,
      }}
    >
      <span
        className="font-mono text-sm tabular-nums font-semibold"
        style={{ color: "var(--boeing-blue)" }}
      >
        {n}
      </span>
      <h3
        className="text-base font-bold uppercase tracking-[0.12em]"
        style={{ color: "var(--boeing-navy)", fontSize: "0.8125rem" }}
      >
        {label}
      </h3>
      <div className="flex-1 h-px" style={{ background: "var(--surface-border)" }} />
    </div>
  )
}

function SourceCell({
  drawn,
  delay,
  elevated,
  icon: Icon,
  kicker,
  title,
  body,
  className = "",
}: {
  drawn: boolean
  delay: number
  elevated?: boolean
  icon: typeof FileUp
  kicker: string
  title: string
  body: string
  className?: string
}) {
  return (
    <div
      className={`relative px-5 py-5 sm:px-6 sm:py-6 ${className}`}
      style={{
        background: elevated ? "var(--boeing-ice)" : "#fff",
        borderColor: "var(--surface-border)",
        boxShadow: elevated ? "inset 0 3px 0 0 var(--boeing-blue)" : undefined,
        opacity: drawn ? 1 : 0,
        transform: drawn ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.5s var(--ease-out-expo) ${delay}ms`,
      }}
    >
      {elevated && (
        <span
          className="absolute top-4 right-4 font-ui text-[9px] font-bold uppercase tracking-[0.14em] px-2 py-0.5"
          style={{
            background: "var(--boeing-blue)",
            color: "#fff",
            borderRadius: "2px",
          }}
        >
          Elevated
        </span>
      )}
      <Icon
        size={18}
        strokeWidth={1.5}
        style={{ color: elevated ? "var(--boeing-blue)" : "var(--boeing-navy)" }}
      />
      <p
        className="mt-3 font-ui text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color: elevated ? "var(--boeing-blue)" : "var(--text-muted)" }}
      >
        {kicker}
      </p>
      <p
        className="mt-1.5 text-[15px] font-semibold"
        style={{ color: "var(--boeing-navy)" }}
      >
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {body}
      </p>
    </div>
  )
}

function FlowJoin({ drawn, delay }: { drawn: boolean; delay: number }) {
  return (
    <div className="flex justify-center py-4" aria-hidden>
      <div
        className="flex flex-col items-center"
        style={{
          opacity: drawn ? 1 : 0,
          transition: `opacity 0.35s ease ${delay}ms`,
        }}
      >
        <div className="w-px h-3" style={{ background: "var(--boeing-blue)" }} />
        <ArrowDown size={18} strokeWidth={2} style={{ color: "var(--boeing-blue)" }} />
        <div className="w-px h-3" style={{ background: "var(--boeing-blue)" }} />
      </div>
    </div>
  )
}
