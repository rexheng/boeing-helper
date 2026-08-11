import { useEffect, useState } from "react"
import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

interface WorkflowsProps {
  id?: string
}

type WorkflowKey = "tripbook" | "fms"

interface Move {
  label: string
  note: string
}

const handoffs = [
  "Customer list",
  "Integrator skeleton",
  "Regional updates",
  "Gov Ops / CTL review",
  "RD review",
  "Updates & edits",
  "Papers to IBD VP",
  "IBD VP review",
  "BD&S LT / VPGM",
  "Final to integrator",
  "PDF into trip book",
  "Change → restart RD",
]

const workflows: Record<
  WorkflowKey,
  {
    label: string
    moves: Move[]
    proof: string
  }
> = {
  tripbook: {
    label: "Trip-book papers",
    moves: [
      { label: "Select counterpart", note: "Org + biography" },
      { label: "Run research agents", note: "Internal · Industry · Country" },
      { label: "Review & export PDF", note: "Ready for RD, IBD, and trip book" },
    ],
    proof: "One meeting paper every reviewer sees — regenerate without restarting at RD.",
  },
  fms: {
    label: "FMS cheat sheet",
    moves: [
      { label: "Pull programme facts", note: "Fleet, FMS, offsets" },
      { label: "Draft cheat-sheet brief", note: "One shared baseline" },
      { label: "PDF to trip book & field", note: "Same pack for every reviewer" },
    ],
    proof: "One pack for RD, VPGM, and IBD VP — not divergent versions.",
  },
}

function MoveCard({
  move,
  index,
  active,
}: {
  move: Move
  index: number
  active: boolean
}) {
  return (
    <div
      className="rounded-sm bg-white px-4 py-3"
      style={{
        border: "1px solid var(--surface-border)",
        borderLeft: "3px solid var(--boeing-blue)",
        boxShadow: "var(--shadow-card)",
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(10px)",
        transition: `opacity 0.45s ease ${220 + index * 90}ms, transform 0.5s var(--ease-out-expo) ${220 + index * 90}ms`,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="font-mono text-xs tabular-nums pt-0.5 shrink-0"
          style={{ color: "var(--boeing-cyan)" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <p
            className="text-sm font-semibold tracking-tight"
            style={{ color: "var(--boeing-navy)" }}
          >
            {move.label}
          </p>
          <p className="mt-0.5 text-xs" style={{ color: "var(--text-muted)" }}>
            {move.note}
          </p>
        </div>
      </div>
    </div>
  )
}

function CollapseRail({
  active,
  moves,
}: {
  active: boolean
  moves: Move[]
}) {
  return (
    <div
      className="relative overflow-hidden"
      style={{
        borderRadius: "var(--radius)",
        background: "var(--bg-muted)",
        border: "1px solid var(--surface-border)",
      }}
      aria-hidden
    >
      {/* Mobile: metric-first, no 12-line dump */}
      <div className="md:hidden p-5">
        <div
          className="mb-5 flex items-end justify-between gap-4 rounded-sm px-4 py-4"
          style={{
            background: "var(--boeing-ice)",
            border: "1px solid var(--surface-border)",
          }}
        >
          <div>
            <p
              className="font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--text-secondary)" }}
            >
              Before
            </p>
            <p
              className="mt-1 font-mono text-3xl font-light tabular-nums leading-none"
              style={{ color: "var(--text-secondary)" }}
            >
              12
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              handoffs across RD, IBD, trip book
            </p>
          </div>
          <span
            className="pb-6 text-2xl font-semibold"
            style={{ color: "var(--boeing-cyan)" }}
          >
            →
          </span>
          <div className="text-right">
            <p
              className="font-ui text-[10px] font-bold uppercase tracking-[0.16em]"
              style={{ color: "var(--boeing-blue)" }}
            >
              With Helper
            </p>
            <p
              className="mt-1 font-mono text-3xl font-semibold tabular-nums leading-none"
              style={{ color: "var(--boeing-blue)" }}
            >
              3
            </p>
            <p className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
              moves to a shared PDF
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {moves.map((move, i) => (
            <MoveCard key={move.label} move={move} index={i} active={active} />
          ))}
        </div>
      </div>

      {/* Desktop: full collapse spine */}
      <div className="hidden md:grid md:grid-cols-[1fr_4.75rem_1.2fr] md:items-stretch md:gap-3 md:p-7 min-h-[22rem]">
        <div className="flex min-w-0 flex-col">
          <p
            className="mb-3 font-ui text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ color: "var(--text-secondary)" }}
          >
            Before — 12 handoffs
          </p>
          <ol className="flex-1 space-y-[5px]">
            {handoffs.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-2 font-mono text-[11px] leading-snug"
                style={{
                  color: "var(--text-secondary)",
                  opacity: i > 8 ? 0.62 : 0.9,
                  transition: `opacity 0.5s ease ${i * 20}ms`,
                }}
              >
                <span
                  className="w-4 shrink-0 tabular-nums"
                  style={{ color: "var(--boeing-cyan)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{step}</span>
              </li>
            ))}
          </ol>
          <p
            className="mt-3 text-[11px] leading-snug"
            style={{ color: "var(--text-muted)" }}
          >
            Same restart loop on the FMS cheat sheet.
          </p>
        </div>

        <div className="relative flex flex-col items-center justify-center py-2">
          <div
            className="absolute top-6 bottom-6 w-0.5 origin-top"
            style={{
              background: "var(--boeing-blue)",
              transform: active ? "scaleY(1)" : "scaleY(0)",
              transition: "transform 0.65s var(--ease-out-expo) 0.08s",
            }}
          />
          <div
            className="relative z-10 flex flex-col items-center px-1 py-3"
            style={{ background: "var(--bg-muted)" }}
          >
            <span
              className="font-mono text-xl font-light tabular-nums leading-none"
              style={{ color: "var(--text-muted)" }}
            >
              12
            </span>
            <span
              className="my-1.5 text-xl font-semibold leading-none"
              style={{
                color: "var(--boeing-cyan)",
                opacity: active ? 1 : 0.35,
                transition: "opacity 0.4s ease 0.2s",
              }}
            >
              ↓
            </span>
            <span
              className="font-mono text-4xl font-semibold tabular-nums leading-none"
              style={{
                color: "var(--boeing-blue)",
                transform: active ? "scale(1)" : "scale(0.9)",
                transition: "transform 0.6s var(--ease-out-expo) 0.2s",
              }}
            >
              3
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <p
            className="mb-3 font-ui text-[11px] font-bold uppercase tracking-[0.16em]"
            style={{ color: "var(--boeing-blue)" }}
          >
            With Helper — 3 moves
          </p>
          <div className="flex flex-1 flex-col justify-center gap-3">
            {moves.map((move, i) => (
              <MoveCard key={move.label} move={move} index={i} active={active} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Workflows({ id }: WorkflowsProps) {
  const { ref, visible } = useInView(0.18)
  const [workflow, setWorkflow] = useState<WorkflowKey>("tripbook")
  const [collapsed, setCollapsed] = useState(false)
  const current = workflows[workflow]

  useEffect(() => {
    if (!visible) return
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setCollapsed(true)
      return
    }
    const t = window.setTimeout(() => setCollapsed(true), 120)
    return () => window.clearTimeout(t)
  }, [visible])

  return (
    <section id={id} className="section">
      <div ref={ref} className={`constrain reveal ${visible ? "visible" : ""}`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.28fr)] lg:items-center lg:gap-12">
          <div>
            <SectionHeader
              eyebrow="Simplify your workflows"
              title="Twelve handoffs. Three moves."
              subtitle="No more chasing CTLs, GovOps, ISP, and RD for the same trip-book facts. Select, research, export — one pack for every reviewer."
            />

            <div
              className="flex w-full flex-col gap-2 sm:inline-flex sm:w-auto sm:flex-row sm:gap-1.5 sm:rounded-sm sm:p-1.5"
              style={{
                background: "var(--bg-muted)",
                border: "1px solid var(--surface-border)",
                borderRadius: "var(--radius-sm)",
              }}
              role="tablist"
              aria-label="Workflow type"
            >
              {(Object.keys(workflows) as WorkflowKey[]).map((key) => {
                const selected = workflow === key
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setWorkflow(key)}
                    className="w-full cursor-pointer rounded-sm px-4 py-3 font-ui text-sm font-medium transition-all duration-150 sm:w-auto sm:py-2.5"
                    style={{
                      background: selected ? "var(--boeing-blue)" : "#fff",
                      color: selected ? "#fff" : "var(--text-secondary)",
                      border: selected
                        ? "1px solid var(--boeing-blue)"
                        : "1.5px solid var(--border-hover)",
                      minHeight: "2.75rem",
                    }}
                  >
                    {workflows[key].label}
                  </button>
                )
              })}
            </div>

            <p
              key={workflow}
              className="mt-8 pl-4 text-base font-medium leading-snug"
              style={{
                color: "var(--boeing-navy)",
                borderLeft: "3px solid var(--boeing-blue)",
                animation: visible ? "fadeInUp 0.4s ease-out both" : undefined,
              }}
              aria-live="polite"
            >
              {current.proof}
            </p>

            <p className="sr-only">
              Twelve handoffs reduced to three moves with Boeing Helper.
            </p>
          </div>

          <div
            className={visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            style={{
              transition:
                "opacity 0.7s var(--ease-out-expo) 0.08s, transform 0.7s var(--ease-out-expo) 0.08s",
            }}
          >
            <CollapseRail active={collapsed} moves={current.moves} />
          </div>
        </div>
      </div>
    </section>
  )
}
