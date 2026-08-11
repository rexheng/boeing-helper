import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface SourcesProps {
  id?: string
}

const columns = [
  {
    label: "Outside Boeing",
    items: [
      "Official statements and filings",
      "Trade and defense press",
      "Public programme and fleet facts",
    ],
  },
  {
    label: "Inside Boeing",
    items: [
      "Account and campaign records",
      "Programme status held by the BU",
      "Prior engagement notes under retention",
    ],
  },
] as const

const spine = [
  { n: "01", label: "Claim" },
  { n: "02", label: "Linked source" },
  { n: "03", label: "Open & check" },
] as const

export function Sources({ id }: SourcesProps) {
  const { ref, visible } = useInView()

  return (
    <section id={id} className="section section--muted">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <SectionHeader
          eyebrow="Sources"
          title="Every claim opens to a source."
          subtitle="Published filings, trade press, and approved internal records. Each line in the paper links back to one of them."
        />

        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {columns.map((col, i) => (
            <div
              key={col.label}
              className={i === 1 ? "md:border-l md:pl-16" : ""}
              style={i === 1 ? { borderColor: "var(--surface-border)" } : undefined}
            >
              <p
                className="font-ui text-xs font-medium uppercase"
                style={{ color: "var(--boeing-blue)", letterSpacing: "0.12em" }}
              >
                {col.label}
              </p>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-base leading-snug"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      aria-hidden
                      className="mt-2.5 h-px w-3 shrink-0"
                      style={{ background: "var(--boeing-navy)" }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 flex flex-col gap-8 p-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
          style={{ background: "var(--boeing-navy)", borderRadius: "var(--radius)" }}
        >
          {spine.map((step, i) => (
            <div key={step.n} className="flex items-end gap-4 sm:flex-1 sm:justify-between">
              <div>
                <p
                  className="font-mono text-xs tabular-nums"
                  style={{ color: "var(--boeing-cyan-bright)" }}
                >
                  {step.n}
                </p>
                <p className="mt-1 text-xl font-semibold text-white">{step.label}</p>
              </div>
              {i < spine.length - 1 && (
                <span
                  className="hidden sm:inline pb-1 text-2xl font-light"
                  style={{ color: "var(--boeing-cyan-bright)" }}
                  aria-hidden
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm font-medium" style={{ color: "var(--boeing-navy)" }}>
          No orphan sentences. No invented facts.
        </p>
      </div>
    </section>
  )
}
