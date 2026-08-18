import { useEffect, useMemo, useState } from "react"
import {
  Download,
  FileText,
  LayoutList,
  Library,
  PanelsTopLeft,
  Search,
} from "lucide-react"
import type { Company } from "../../data/companies"
import type { Person } from "../../data/people"
import type { ResearchResult } from "../../types/research"
import type { AuditFinding, AuditSource, ResearchLane } from "../../types/researchAudit"
import {
  auditToCsv,
  buildResearchAudit,
  downloadTextFile,
} from "../../utils/researchAudit"
import { Button } from "../../components/Button"
import { CorpusTable, type CorpusSortKey } from "./CorpusTable"
import { GroundedBrief } from "./GroundedBrief"
import { Inspector } from "./Inspector"
import { ModelLanes } from "./ModelLanes"
import { SourceLibrary } from "./SourceLibrary"
import { BLUE, NAVY } from "./ui"

type View = "corpus" | "models" | "grounded"

interface ResearchAuditWorkspaceProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  notesSlot?: React.ReactNode
  notesOpenLabel?: string
  focusSourceId?: string | null
  onContinue: () => void
  onSkip: () => void
}

export function ResearchAuditWorkspace({
  company,
  person,
  research,
  meetingType,
  notesSlot,
  notesOpenLabel = "Notes",
  focusSourceId,
  onContinue,
  onSkip,
}: ResearchAuditWorkspaceProps) {
  const audit = useMemo(
    () => buildResearchAudit(research, company, person, meetingType),
    [research, company, person, meetingType],
  )

  const [view, setView] = useState<View>("grounded")
  const [sourceQuery, setSourceQuery] = useState("")
  const [titleQuery, setTitleQuery] = useState("")
  const [enabled, setEnabled] = useState<Set<string>>(() => new Set(audit.sources.map((s) => s.id)))
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(audit.sources[0]?.id ?? null)
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<CorpusSortKey>("year")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [hasSupporting, setHasSupporting] = useState(false)
  const [hasDisputing, setHasDisputing] = useState(false)
  const [hasMentioning, setHasMentioning] = useState(false)
  const [laneFilter, setLaneFilter] = useState<Set<ResearchLane>>(new Set(["company", "industry", "country"]))
  const [inspectorOpen, setInspectorOpen] = useState(false)
  const [inspectorTick, setInspectorTick] = useState(0)
  const [notesOpen, setNotesOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInspectorOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    setEnabled((prev) => {
      const next = new Set(prev)
      let changed = false
      for (const s of audit.sources) {
        if (!next.has(s.id)) {
          next.add(s.id)
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [audit.sources])

  useEffect(() => {
    if (!focusSourceId) return
    if (!audit.sources.some((s) => s.id === focusSourceId)) return
    setSelectedSourceId(focusSourceId)
    const src = audit.sources.find((s) => s.id === focusSourceId)
    if (src?.findingIds[0]) setSelectedFindingId(src.findingIds[0])
    setInspectorOpen(true)
    setInspectorTick((n) => n + 1)
    setView("grounded")
  }, [focusSourceId, audit.sources])

  const selectedSource = audit.sources.find((s) => s.id === selectedSourceId) ?? null
  const selectedFinding = audit.findings.find((f) => f.id === selectedFindingId) ?? null

  const selectSource = (id: string) => {
    setSelectedSourceId(id)
    const src = audit.sources.find((s) => s.id === id)
    if (src?.findingIds[0]) setSelectedFindingId(src.findingIds[0])
    setInspectorOpen(true)
    setInspectorTick((n) => n + 1)
  }

  const selectFinding = (id: string) => {
    setSelectedFindingId(id)
    const f = audit.findings.find((x) => x.id === id)
    if (f?.sourceIds[0]) setSelectedSourceId(f.sourceIds[0])
    setInspectorOpen(true)
    setInspectorTick((n) => n + 1)
  }

  const filtered: AuditSource[] = useMemo(() => {
    const q = titleQuery.trim().toLowerCase()
    let rows = audit.sources.filter((s) => enabled.has(s.id))
    rows = rows.filter((s) => s.lanes.some((l) => laneFilter.has(l)))
    if (q) {
      rows = rows.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.authors.toLowerCase().includes(q) ||
          s.publisher.toLowerCase().includes(q),
      )
    }
    if (hasSupporting) rows = rows.filter((s) => s.stanceCounts.supporting > 0)
    if (hasDisputing) rows = rows.filter((s) => s.stanceCounts.disputing > 0)
    if (hasMentioning) rows = rows.filter((s) => s.stanceCounts.mentioning > 0)
    const dir = sortDir === "asc" ? 1 : -1
    rows = [...rows].sort((a, b) => {
      const val = (s: AuditSource) => {
        switch (sortKey) {
          case "title":
            return s.title.toLowerCase()
          case "authors":
            return s.authors.toLowerCase()
          case "year":
            return s.year
          case "supporting":
            return s.stanceCounts.supporting
          case "disputing":
            return s.stanceCounts.disputing
          case "mentioning":
            return s.stanceCounts.mentioning
          case "citedBy":
            return s.citedBy
        }
      }
      const av = val(a)
      const bv = val(b)
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir
      return String(av).localeCompare(String(bv)) * dir
    })
    return rows
  }, [
    audit.sources,
    enabled,
    laneFilter,
    titleQuery,
    hasSupporting,
    hasDisputing,
    hasMentioning,
    sortKey,
    sortDir,
  ])

  useEffect(() => {
    setPage(0)
  }, [titleQuery, pageSize, hasSupporting, hasDisputing, hasMentioning, sortKey, sortDir, enabled, laneFilter])

  const pageRows = filtered.slice(page * pageSize, page * pageSize + pageSize)

  const toggleEnabled = (id: string) => {
    setEnabled((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleLaneSources = (lane: ResearchLane, on: boolean) => {
    setEnabled((prev) => {
      const next = new Set(prev)
      for (const s of audit.sources) {
        if (s.lanes[0] === lane) {
          if (on) next.add(s.id)
          else next.delete(s.id)
        }
      }
      return next
    })
  }

  const toggleAll = (on: boolean) => {
    setEnabled(on ? new Set(audit.sources.map((s) => s.id)) : new Set())
  }

  const onSort = (key: CorpusSortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else {
      setSortKey(key)
      setSortDir(key === "title" || key === "authors" ? "asc" : "desc")
    }
  }

  const exportCsv = () => {
    const stem = person.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    const subset = { ...audit, sources: audit.sources.filter((s) => enabled.has(s.id)) }
    downloadTextFile(`research-audit-${stem}.csv`, auditToCsv(subset), "text/csv;charset=utf-8")
  }

  const views: { id: View; label: string; icon: typeof Library }[] = [
    { id: "grounded", label: "Grounded brief", icon: LayoutList },
    { id: "models", label: "By model", icon: PanelsTopLeft },
    { id: "corpus", label: "Corpus", icon: Library },
  ]

  const initial = person.initial || person.name.charAt(0).toUpperCase()
  const highFindings = audit.findings.filter((f) => f.confidence === "high")

  return (
    <div className="audit-workspace h-full min-h-0">
      <header className="audit-toolbar">
        <div className="audit-toolbar__bar" />
        <div className="audit-toolbar__row">
          <div className="flex items-center gap-3 min-w-0">
            {person.photoUrl ? (
              <img
                src={person.photoUrl}
                alt=""
                className="w-9 h-9 rounded-full object-cover shrink-0"
                style={{ border: "2px solid var(--boeing-ice)" }}
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: BLUE }}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-[17px] font-bold truncate leading-tight" style={{ color: NAVY, letterSpacing: "-0.02em" }}>
                {person.name}
              </h2>
              <p className="text-[12px] truncate" style={{ color: "var(--text-secondary)" }}>
                {person.title}
                <span style={{ color: "var(--text-muted)" }}>
                  {" · "}
                  {company.name}
                  {audit.subject.countryName ? ` · ${audit.subject.countryName}` : ""}
                </span>
              </p>
            </div>
          </div>

          <ul className="audit-toolbar__stats" aria-label="Research indices">
            <li>
              <strong>{audit.indices.findings}</strong>
              findings
            </li>
            <li>
              <strong>{audit.indices.sources}</strong>
              sources
            </li>
            <li>
              <strong>{highFindings.length}</strong>
              high conf.
            </li>
            <li>
              <strong>{audit.indices.supporting}</strong>
              supporting
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {notesSlot && (
              <button
                type="button"
                onClick={() => setNotesOpen((v) => !v)}
                className={`audit-quiet-btn ${notesOpen ? "is-on" : ""}`}
                aria-expanded={notesOpen}
              >
                {notesOpenLabel}
              </button>
            )}
            <button type="button" onClick={exportCsv} className="audit-quiet-btn" title="Export selected sources">
              <Download size={14} />
              Export
            </button>
            <button type="button" onClick={onSkip} className="audit-skip">
              Skip to paper
            </button>
            <Button onClick={onContinue}>
              <FileText size={16} />
              Compose paper
            </Button>
          </div>
        </div>
      </header>

      <div className={`audit-grid ${view === "corpus" ? "audit-grid--corpus" : ""}`}>
        <SourceLibrary
          sources={audit.sources}
          enabled={enabled}
          selectedId={selectedSourceId}
          query={sourceQuery}
          onQuery={setSourceQuery}
          onToggle={toggleEnabled}
          onSelect={selectSource}
          onToggleLane={toggleLaneSources}
          onToggleAll={toggleAll}
        />

        <section className="audit-pane audit-pane--main flex flex-col min-h-0 min-w-0">
          <div className="px-3 sm:px-4 pt-3 pb-2 flex flex-wrap items-center gap-2 shrink-0" style={{ borderBottom: "1px solid var(--surface-border)" }}>
            <div
              className="flex items-center gap-1 p-0.5 rounded"
              style={{ background: "var(--bg-muted)" }}
              role="tablist"
              aria-label="Research views"
            >
              {views.map((v) => {
                const Icon = v.icon
                const active = view === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="tab"
                    onClick={() => setView(v.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium"
                    style={{
                      background: active ? "#fff" : "transparent",
                      color: active ? BLUE : "var(--text-secondary)",
                      boxShadow: active ? "0 1px 2px rgba(10,34,64,0.08)" : undefined,
                    }}
                    aria-selected={active}
                  >
                    <Icon size={13} />
                    {v.label}
                  </button>
                )
              })}
            </div>
            <span className="text-[11px] tabular-nums ml-auto" style={{ color: "var(--text-muted)" }}>
              {filtered.length} in view
            </span>
          </div>

          {view === "corpus" && (
            <>
              <div className="px-3 sm:px-4 py-3 space-y-2.5 shrink-0" style={{ borderBottom: "1px solid var(--surface-border)" }}>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex-1 min-w-[12rem] flex items-center gap-2 rounded px-2.5 py-1.5" style={{ background: "var(--bg-muted)", border: "1px solid var(--surface-border)" }}>
                    <Search size={13} style={{ color: "var(--text-muted)" }} />
                    <input
                      value={titleQuery}
                      onChange={(e) => setTitleQuery(e.target.value)}
                      placeholder="Filter articles by title."
                      className="flex-1 bg-transparent text-xs outline-none"
                      style={{ color: "var(--text-primary)" }}
                      aria-label="Article title"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px]" style={{ color: "var(--text-secondary)" }}>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#0033A1]" checked={hasSupporting} onChange={(e) => setHasSupporting(e.target.checked)} />
                    Has supporting cites
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#0033A1]" checked={hasDisputing} onChange={(e) => setHasDisputing(e.target.checked)} />
                    Has disputing cites
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#0033A1]" checked={hasMentioning} onChange={(e) => setHasMentioning(e.target.checked)} />
                    Has mentioning cites
                  </label>
                  {(["company", "industry", "country"] as ResearchLane[]).map((lane) => (
                    <label key={lane} className="inline-flex items-center gap-1.5 cursor-pointer capitalize">
                      <input
                        type="checkbox"
                        className="accent-[#0033A1]"
                        checked={laneFilter.has(lane)}
                        onChange={(e) => {
                          setLaneFilter((prev) => {
                            const next = new Set(prev)
                            if (e.target.checked) next.add(lane)
                            else next.delete(lane)
                            if (next.size === 0) return prev
                            return next
                          })
                        }}
                      />
                      {lane}
                    </label>
                  ))}
                  <span className="ml-auto inline-flex items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center gap-1" style={{ color: "#2E7D32" }}><span aria-hidden>✓</span> supporting</span>
                    <span className="inline-flex items-center gap-1" style={{ color: "#B26A00" }}>? disputing</span>
                    <span className="inline-flex items-center gap-1" style={{ color: "#66737E" }}>– mentioning</span>
                  </span>
                </div>
              </div>
              <CorpusTable
                sources={pageRows}
                selectedId={selectedSourceId}
                onSelect={selectSource}
                sortKey={sortKey}
                sortDir={sortDir}
                onSort={onSort}
                page={page}
                pageSize={pageSize}
                total={filtered.length}
                onPage={setPage}
                onPageSize={(n) => {
                  setPageSize(n)
                  setPage(0)
                }}
                onClearFilters={() => {
                  setTitleQuery("")
                  setHasSupporting(false)
                  setHasDisputing(false)
                  setHasMentioning(false)
                  setLaneFilter(new Set(["company", "industry", "country"]))
                }}
              />
            </>
          )}

          {view === "models" && (
            <ModelLanes
              audit={audit}
              enabled={enabled}
              selectedSourceId={selectedSourceId}
              selectedFindingId={selectedFindingId}
              onSelectSource={selectSource}
              onSelectFinding={selectFinding}
            />
          )}

          {view === "grounded" && (
            <GroundedBrief
              audit={audit}
              enabled={enabled}
              selectedSourceId={selectedSourceId}
              onSelectSource={selectSource}
            />
          )}
        </section>

        <div
          className={`audit-inspector-wrap ${inspectorOpen ? "is-open" : ""} ${view === "corpus" ? "audit-inspector-wrap--overlay" : ""}`}
          data-flash={inspectorTick || undefined}
        >
          <button
            type="button"
            className="audit-inspector-backdrop"
            aria-label="Close inspector"
            onClick={() => setInspectorOpen(false)}
          />
          <Inspector
            audit={audit}
            source={selectedSource}
            finding={selectedFinding}
            onSelectSource={selectSource}
            onSelectFinding={selectFinding}
            onClose={view === "corpus" ? () => setInspectorOpen(false) : undefined}
          />
        </div>
      </div>

      {notesSlot && notesOpen && (
        <div className="audit-notes">
          {notesSlot}
        </div>
      )}
    </div>
  )
}

export type { AuditFinding, AuditSource }
