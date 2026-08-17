import { Search, Lock } from "lucide-react"
import type { AuditSource, ResearchLane } from "../../types/researchAudit"
import { RESEARCH_MODELS, sourceKindLabel } from "../../utils/researchAudit"
import { BLUE, FileGlyph, ICE, LANE_ACCENT, NAVY } from "./ui"

interface SourceLibraryProps {
  sources: AuditSource[]
  enabled: Set<string>
  selectedId: string | null
  query: string
  onQuery: (q: string) => void
  onToggle: (id: string) => void
  onSelect: (id: string) => void
  onToggleLane: (lane: ResearchLane, on: boolean) => void
  onToggleAll: (on: boolean) => void
  notesSlot?: React.ReactNode
}

export function SourceLibrary({
  sources,
  enabled,
  selectedId,
  query,
  onQuery,
  onToggle,
  onSelect,
  onToggleLane,
  onToggleAll,
  notesSlot,
}: SourceLibraryProps) {
  const q = query.trim().toLowerCase()
  const visible = q
    ? sources.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.publisher.toLowerCase().includes(q) ||
          s.authors.toLowerCase().includes(q),
      )
    : sources

  const byLane: Record<ResearchLane, AuditSource[]> = {
    company: [],
    industry: [],
    country: [],
  }
  for (const s of visible) {
    byLane[s.lanes[0]].push(s)
  }

  const allOn = sources.length > 0 && sources.every((s) => enabled.has(s.id))
  const enabledCount = sources.filter((s) => enabled.has(s.id)).length

  return (
    <aside className="audit-pane audit-pane--sources flex flex-col min-h-0">
      <header className="px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: "1px solid var(--surface-border)" }}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold" style={{ color: NAVY }}>
            Sources
          </h3>
          <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
            {enabledCount}/{sources.length}
          </span>
        </div>
        <label className="mt-3 flex items-center gap-2 rounded px-2.5 py-1.5" style={{ background: "var(--bg-muted)", border: "1px solid var(--surface-border)" }}>
          <Search size={13} style={{ color: "var(--text-muted)" }} />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search the library"
            className="flex-1 bg-transparent text-xs outline-none"
            style={{ color: "var(--text-primary)" }}
          />
        </label>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            className="text-[11px] font-medium"
            style={{ color: BLUE }}
            onClick={() => onToggleAll(!allOn)}
          >
            {allOn ? "Deselect all" : "Select all"}
          </button>
          <span style={{ color: "var(--surface-border)" }}>·</span>
          <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
            Unchecked sources hide from this library only
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto audit-scroll px-2 py-2 space-y-3">
        {RESEARCH_MODELS.map((model) => {
          const items = byLane[model.id]
          if (items.length === 0) return null
          const laneEnabled = items.filter((s) => enabled.has(s.id)).length
          const laneAll = laneEnabled === items.length
          return (
            <section key={model.id}>
              <div className="flex items-center gap-2 px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: LANE_ACCENT[model.id] }} />
                <p className="text-[11px] font-semibold uppercase tracking-[0.1em] flex-1" style={{ color: NAVY }}>
                  {model.shortName}
                </p>
                <button
                  type="button"
                  className="text-[10px] font-medium"
                  style={{ color: BLUE }}
                  onClick={() => onToggleLane(model.id, !laneAll)}
                >
                  {laneAll ? "None" : "All"}
                </button>
                <span className="text-[10px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                  {laneEnabled}/{items.length}
                </span>
              </div>
              <ul className="space-y-0.5">
                {items.map((s) => {
                  const on = enabled.has(s.id)
                  const selected = selectedId === s.id
                  return (
                    <li key={s.id}>
                      <div
                        className="flex items-start gap-2 rounded px-2 py-1.5 cursor-pointer"
                        style={{
                          background: selected ? ICE : "transparent",
                          opacity: on ? 1 : 0.45,
                        }}
                        onClick={() => onSelect(s.id)}
                      >
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => onToggle(s.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-1.5 accent-[#0033A1] shrink-0"
                          aria-label={`Include ${s.title}`}
                        />
                        <FileGlyph kind={s.kind} />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium leading-snug line-clamp-2" style={{ color: selected ? BLUE : NAVY }}>
                            <span className="tabular-nums font-semibold mr-1" style={{ color: BLUE }}>
                              [{s.citeIndex}]
                            </span>
                            {s.title}
                          </p>
                          <p className="text-[10px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                            {s.classification === "internal" && (
                              <Lock size={9} className="inline mr-1 -mt-px" />
                            )}
                            {sourceKindLabel(s.kind)} · {s.publisher}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>

      {notesSlot && (
        <div className="shrink-0 p-3" style={{ borderTop: "1px solid var(--surface-border)" }}>
          {notesSlot}
        </div>
      )}
    </aside>
  )
}
