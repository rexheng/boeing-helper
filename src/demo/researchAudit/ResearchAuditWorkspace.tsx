import { useEffect, useMemo, useState } from "react"
import {
  Download,
  FileText,
  LayoutList,
  Library,
  PanelsTopLeft,
  Search,
  SkipForward,
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
import { BLUE, NAVY, StanceCountsRow } from "./ui"

type View = "corpus" | "models" | "grounded"

interface ResearchAuditWorkspaceProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  notesSlot?: React.ReactNode
  onContinue: () => void
  onSkip: () => void
}

export function ResearchAuditWorkspace({
  company,
  person,
  research,
  meetingType,
  notesSlot,
  onContinue,
  onSkip,
}: ResearchAuditWorkspaceProps) {
  const audit = useMemo(
    () => buildResearchAudit(research, company, person, meetingType),
    [research, company, person, meetingType],
  )

  const [view, setView] = useState<View>("corpus")
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
  const [includeZero, setIncludeZero] = useState(true)
  const [laneFilter, setLaneFilter] = useState<Set<ResearchLane>>(new Set(["company", "industry", "country"]))
  const [inspectorOpen, setInspectorOpen] = useState(false)

  useEffect(() => {
    setEnabled(new Set(audit.sources.map((s) => s.id)))
    setSelectedSourceId(audit.sources[0]?.id ?? null)
    setSelectedFindingId(null)
    setPage(0)
  }, [audit])

  const selectedSource = audit.sources.find((s) => s.id === selectedSourceId) ?? null
  const selectedFinding = audit.findings.find((f) => f.id === selectedFindingId) ?? null

  const selectSource = (id: string) => {
    setSelectedSourceId(id)
    const src = audit.sources.find((s) => s.id === id)
    if (src?.findingIds[0]) setSelectedFindingId(src.findingIds[0])
    setInspectorOpen(true)
  }

  const selectFinding = (id: string) => {
    setSelectedFindingId(id)
    const f = audit.findings.find((x) => x.id === id)
    if (f?.sourceIds[0]) setSelectedSourceId(f.sourceIds[0])
    setInspectorOpen(true)
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
    if (!includeZero) {
      rows = rows.filter(
        (s) => s.stanceCounts.supporting + s.stanceCounts.disputing + s.stanceCounts.mentioning > 0,
      )
    }
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
    includeZero,
    sortKey,
    sortDir,
  ])

  useEffect(() => {
    setPage(0)
  }, [titleQuery, pageSize, hasSupporting, hasDisputing, hasMentioning, includeZero, sortKey, sortDir, enabled, laneFilter])

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
    downloadTextFile(`research-audit-${stem}.csv`, auditToCsv(audit), "text/csv;charset=utf-8")
  }

  const views: { id: View; label: string; icon: typeof Library }[] = [
    { id: "corpus", label: "Corpus", icon: Library },
    { id: "models", label: "By model", icon: PanelsTopLeft },
    { id: "grounded", label: "Grounded brief", icon: LayoutList },
  ]

  const initial = person.initial || person.name.charAt(0).toUpperCase()
  const highFindings = audit.findings.filter((f) => f.confidence === "high")
  const highSourceCount = new Set(highFindings.flatMap((f) => f.sourceIds)).size

  return (
    <div className="audit-workspace space-y-4">
      <header className="bh-panel overflow-hidden">
        <div style={{ height: 4, background: BLUE }} />
        <div className="px-5 sm:px-7 py-5 grid gap-6 lg:grid-cols-[1fr_auto] items-start">
          <div className="flex items-start gap-4 min-w-0">
            {person.photoUrl ? (
              <img
                src={person.photoUrl}
                alt=""
                className="w-16 h-16 rounded-full object-cover shrink-0"
                style={{ border: "2px solid var(--boeing-ice)" }}
              />
            ) : (
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0"
                style={{ background: BLUE }}
              >
                {initial}
              </div>
            )}
            <div className="min-w-0">
              <p className="system-badge system-badge--dark">Step 04 · Research library</p>
              <h2 className="mt-1 text-2xl font-bold truncate" style={{ color: NAVY, letterSpacing: "-0.02em" }}>
                {person.name}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {person.title}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {company.name}
                {audit.subject.countryName ? ` · ${audit.subject.countryName}` : ""} · {meetingType}
              </p>
              <p className="mt-2 text-xs leading-relaxed max-w-2xl" style={{ color: "var(--text-secondary)" }}>
                Full transparency of what each research model retrieved — sources, excerpts and citation
                character — before anything is written into the meeting paper.
              </p>
            </div>
          </div>

          <div className="audit-indices">
            <table>
              <thead>
                <tr>
                  <th>Research indices</th>
                  <th>All</th>
                  <th>High conf.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sources</td>
                  <td>{audit.indices.sources}</td>
                  <td>{highSourceCount}</td>
                </tr>
                <tr>
                  <td>Findings</td>
                  <td>{audit.indices.findings}</td>
                  <td>{highFindings.length}</td>
                </tr>
                <tr>
                  <td>Supporting</td>
                  <td>{audit.indices.supporting}</td>
                  <td>{highFindings.filter((f) => f.stance === "supporting").length}</td>
                </tr>
                <tr>
                  <td>Contested</td>
                  <td>{audit.indices.disputing}</td>
                  <td>{highFindings.filter((f) => f.stance === "disputing").length}</td>
                </tr>
              </tbody>
            </table>
            <p className="audit-indices__hint">
              High conf. = claims the models marked high-confidence, and the sources those claims rest on.
              {" "}{audit.indices.internal} internal · {audit.indices.open} open.
            </p>
          </div>
        </div>

        <div
          className="px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3"
          style={{ borderTop: "1px solid var(--surface-border)", background: "var(--bg-muted)" }}
        >
          <StanceCountsRow
            counts={{
              supporting: audit.indices.supporting,
              disputing: audit.indices.disputing,
              mentioning: audit.indices.mentioning,
            }}
          />
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={exportCsv} className="btn-secondary !min-h-0 !h-9 !px-3 !text-[11px] !tracking-[0.08em]">
              <Download size={14} />
              Export corpus
            </button>
            <button type="button" onClick={onSkip} className="btn-secondary !min-h-0 !h-9 !px-3 !text-[11px] !tracking-[0.08em]">
              <SkipForward size={14} />
              Skip to paper
            </button>
            <Button onClick={onContinue} className="!min-h-0 !h-9 !px-4 !text-[11px] !tracking-[0.08em]">
              <FileText size={14} />
              Compose paper
            </Button>
          </div>
        </div>
      </header>

      <div className="audit-grid">
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
          notesSlot={notesSlot}
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
                  <label className="inline-flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="accent-[#0033A1]" checked={includeZero} onChange={(e) => setIncludeZero(e.target.checked)} />
                    Include zero cites
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

        <div className={`audit-inspector-wrap ${inspectorOpen ? "is-open" : ""}`}>
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
            onClose={() => setInspectorOpen(false)}
          />
        </div>
      </div>
    </div>
  )
}

export type { AuditFinding, AuditSource }
