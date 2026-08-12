import { useEffect, useState, type ReactNode } from "react"
import { FileUp, Building2, Newspaper } from "lucide-react"
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
    <section id={id} className="section section--muted">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Data integrity"
          title="Every figure traces back to a source."
          subtitle="Collect in parallel. Assemble with citations. Check before the room."
        />

        <div className="grid gap-0 lg:grid-cols-[4.5rem_minmax(0,1fr)]">
          {/* Desktop spine */}
          <div className="relative hidden lg:block" aria-hidden>
            <div
              className="absolute left-1/2 top-3 bottom-3 w-0.5 -translate-x-1/2 origin-top"
              style={{
                background: "var(--boeing-blue)",
                transform: drawn ? "translateX(-50%) scaleY(1)" : "translateX(-50%) scaleY(0)",
                transition: "transform 0.9s var(--ease-out-expo) 0.1s",
              }}
            />
            {["01", "02", "03"].map((n, i) => (
              <div
                key={n}
                className="absolute left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center font-mono text-sm font-bold tabular-nums"
                style={{
                  top: i === 0 ? "0.15rem" : i === 1 ? "42%" : "78%",
                  background: "var(--boeing-blue)",
                  color: "#fff",
                  borderRadius: "2px",
                  opacity: drawn ? 1 : 0,
                  transition: `opacity 0.4s ease ${180 + i * 160}ms`,
                  boxShadow: "0 0 0 6px var(--bg-muted)",
                }}
              >
                {n}
              </div>
            ))}
          </div>

          <div className="space-y-10 sm:space-y-12">
            {/* ===== 01 COLLECT ===== */}
            <Phase
              n="01"
              title="Collect"
              drawn={drawn}
              delay={80}
              lead="Three sources. Captured simultaneously."
            >
              <div className="grid gap-3 lg:grid-cols-[1.35fr_1fr_1fr]">
                {/* Elevated uploads — intentionally larger */}
                <div
                  className="relative p-5 sm:p-6"
                  style={{
                    background: "#fff",
                    border: "2px solid var(--boeing-blue)",
                    borderRadius: "var(--radius-sm)",
                    boxShadow: "0 8px 28px rgba(0, 51, 161, 0.12)",
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? "translateY(0)" : "translateY(10px)",
                    transition:
                      "opacity 0.45s ease 0.16s, transform 0.5s var(--ease-out-expo) 0.16s",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <FileUp size={22} strokeWidth={1.5} style={{ color: "var(--boeing-blue)" }} />
                    <span
                      className="font-ui text-[10px] font-bold uppercase tracking-[0.14em] px-2.5 py-1"
                      style={{ background: "var(--boeing-blue)", color: "#fff", borderRadius: "2px" }}
                    >
                      Elevated
                    </span>
                  </div>
                  <p
                    className="mt-4 font-ui text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "var(--boeing-blue)" }}
                  >
                    Primary · Uploads
                  </p>
                  <p className="mt-2 text-lg font-semibold leading-snug" style={{ color: "var(--boeing-navy)" }}>
                    Your campaign pack
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Notes, letters, and files attached for this meeting — treated as first authority.
                  </p>
                </div>

                <SourceSlim
                  drawn={drawn}
                  delay={220}
                  icon={Building2}
                  kicker="Internal"
                  title="Boeing knowledge"
                  body="Account and programme records"
                />
                <SourceSlim
                  drawn={drawn}
                  delay={280}
                  icon={Newspaper}
                  kicker="Published"
                  title="AI research agent"
                  body="Filings, statements, defence press"
                />
              </div>
            </Phase>

            {/* ===== 02 ASSEMBLE ===== */}
            <Phase
              n="02"
              title="Assemble"
              drawn={drawn}
              delay={360}
              lead="Conflicts resolve by precedence — then every claim keeps its label."
            >
              <div
                className="overflow-hidden"
                style={{
                  background: "#fff",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "var(--radius-sm)",
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "translateY(0)" : "translateY(10px)",
                  transition:
                    "opacity 0.5s ease 0.4s, transform 0.55s var(--ease-out-expo) 0.4s",
                }}
              >
                <div
                  className="grid sm:grid-cols-[auto_1fr_auto] items-stretch"
                  style={{ borderBottom: "1px solid var(--surface-border)" }}
                >
                  <ConflictSide
                    label="Upload"
                    value="31"
                    tone="win"
                    note="Campaign pack"
                  />
                  <div
                    className="flex flex-col items-center justify-center px-4 py-4 text-center"
                    style={{ background: "var(--bg-muted)" }}
                  >
                    <p
                      className="font-ui text-[10px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Claim
                    </p>
                    <p className="mt-1 text-sm font-semibold" style={{ color: "var(--boeing-navy)" }}>
                      777-9 on order
                    </p>
                    <p
                      className="mt-3 font-ui text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1"
                      style={{ background: "var(--boeing-ice)", color: "var(--boeing-blue)" }}
                    >
                      Upload wins
                    </p>
                  </div>
                  <ConflictSide
                    label="Press"
                    value="28"
                    tone="lose"
                    note="Trade report"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
                  <p
                    className="font-ui text-[10px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: "var(--boeing-blue)" }}
                  >
                    Precedence
                  </p>
                  <PrecedenceChip n="1" label="Uploads" strong />
                  <span style={{ color: "var(--text-muted)" }} aria-hidden>
                    →
                  </span>
                  <PrecedenceChip n="2" label="Internal" />
                  <span style={{ color: "var(--text-muted)" }} aria-hidden>
                    →
                  </span>
                  <PrecedenceChip n="3" label="Published" />
                </div>
              </div>
            </Phase>

            {/* ===== 03 REVIEW ===== */}
            <Phase
              n="03"
              title="Review"
              drawn={drawn}
              delay={560}
              lead="Open any figure. Export the same citations in the PDF."
            >
              <div
                className="grid sm:grid-cols-3 gap-px overflow-hidden"
                style={{
                  background: "var(--surface-border)",
                  border: "1px solid var(--surface-border)",
                  borderRadius: "var(--radius-sm)",
                  opacity: drawn ? 1 : 0,
                  transition: "opacity 0.5s ease 0.58s",
                }}
              >
                {[
                  { t: "Open the source", d: "From the briefing on screen" },
                  { t: "Export the pack", d: "Citations travel with the PDF" },
                  { t: "Into the room", d: "Only after you have checked it" },
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
            </Phase>
          </div>
        </div>
      </div>
    </section>
  )
}

function Phase({
  n,
  title,
  lead,
  children,
  drawn,
  delay,
}: {
  n: string
  title: string
  lead: string
  children: ReactNode
  drawn: boolean
  delay: number
}) {
  return (
    <section
      style={{
        opacity: drawn ? 1 : 0,
        transform: drawn ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.5s var(--ease-out-expo) ${delay}ms`,
      }}
    >
      <div className="mb-4 flex items-baseline gap-3 lg:gap-4">
        <span
          className="lg:hidden font-mono text-sm font-bold tabular-nums px-2 py-1"
          style={{ background: "var(--boeing-blue)", color: "#fff", borderRadius: "2px" }}
        >
          {n}
        </span>
        <h3
          className="font-bold uppercase tracking-[0.14em]"
          style={{ color: "var(--boeing-navy)", fontSize: "0.8125rem" }}
        >
          {title}
        </h3>
        <div className="hidden sm:block flex-1 h-px" style={{ background: "var(--surface-border)" }} />
      </div>
      <p className="mb-4 text-base font-medium leading-snug" style={{ color: "var(--boeing-navy)" }}>
        {lead}
      </p>
      {children}
    </section>
  )
}

function SourceSlim({
  drawn,
  delay,
  icon: Icon,
  kicker,
  title,
  body,
}: {
  drawn: boolean
  delay: number
  icon: typeof FileUp
  kicker: string
  title: string
  body: string
}) {
  return (
    <div
      className="p-5"
      style={{
        background: "#fff",
        border: "1px solid var(--surface-border)",
        borderRadius: "var(--radius-sm)",
        opacity: drawn ? 1 : 0,
        transform: drawn ? "translateY(0)" : "translateY(10px)",
        transition: `opacity 0.45s ease ${delay}ms, transform 0.5s var(--ease-out-expo) ${delay}ms`,
      }}
    >
      <Icon size={18} strokeWidth={1.5} style={{ color: "var(--boeing-navy)" }} />
      <p
        className="mt-3 font-ui text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color: "var(--text-muted)" }}
      >
        {kicker}
      </p>
      <p className="mt-1.5 text-[15px] font-semibold" style={{ color: "var(--boeing-navy)" }}>
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {body}
      </p>
    </div>
  )
}

function ConflictSide({
  label,
  value,
  tone,
  note,
}: {
  label: string
  value: string
  tone: "win" | "lose"
  note: string
}) {
  const win = tone === "win"
  return (
    <div
      className="px-5 py-5 text-center sm:text-left min-w-[7.5rem]"
      style={{
        background: win ? "var(--boeing-ice)" : "#fff",
        borderRight: win ? "1px solid var(--surface-border)" : undefined,
        borderLeft: !win ? "1px solid var(--surface-border)" : undefined,
      }}
    >
      <p
        className="font-ui text-[10px] font-bold uppercase tracking-[0.14em]"
        style={{ color: win ? "var(--boeing-blue)" : "var(--text-muted)" }}
      >
        {label}
      </p>
      <p
        className="mt-2 font-mono text-3xl font-semibold tabular-nums leading-none"
        style={{ color: win ? "var(--boeing-blue)" : "var(--text-secondary)", opacity: win ? 1 : 0.55 }}
      >
        {value}
      </p>
      <p className="mt-2 text-xs" style={{ color: "var(--text-muted)" }}>
        {note}
      </p>
    </div>
  )
}

function PrecedenceChip({ n, label, strong }: { n: string; label: string; strong?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: "var(--boeing-navy)" }}>
      <span
        className="font-mono text-[10px] font-bold tabular-nums px-1.5 py-0.5"
        style={{
          background: strong ? "var(--boeing-blue)" : "var(--bg-muted)",
          color: strong ? "#fff" : "var(--text-muted)",
          borderRadius: "2px",
        }}
      >
        {n}
      </span>
      <span className={strong ? "font-semibold" : undefined}>{label}</span>
    </span>
  )
}
