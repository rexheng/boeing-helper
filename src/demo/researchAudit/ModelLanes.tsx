import type { AuditFinding, AuditSource, ResearchAudit } from "../../types/researchAudit"
import { RESEARCH_MODELS } from "../../utils/researchAudit"
import { BLUE, CiteChip, ConfidenceDot, LANE_ACCENT, NAVY, StanceIcon } from "./ui"

interface ModelLanesProps {
  audit: ResearchAudit
  enabled: Set<string>
  selectedSourceId: string | null
  selectedFindingId: string | null
  onSelectSource: (id: string) => void
  onSelectFinding: (id: string) => void
}

export function ModelLanes({
  audit,
  enabled,
  selectedSourceId,
  selectedFindingId,
  onSelectSource,
  onSelectFinding,
}: ModelLanesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-3 overflow-auto audit-scroll h-full">
      {RESEARCH_MODELS.map((model) => {
        const findings = audit.findings.filter((f) => f.modelId === model.id)
        const sources = audit.sources.filter((s) => s.modelIds.includes(model.id))
        const liveFindings = findings.filter((f) => f.sourceIds.some((id) => enabled.has(id)))
        return (
          <section key={model.id} className="bh-panel flex flex-col min-h-0 overflow-hidden">
            <header className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--surface-border)" }}>
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: LANE_ACCENT[model.id] }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: LANE_ACCENT[model.id] }} />
                {model.shortName} model
              </p>
              <h3 className="mt-1 text-sm font-semibold" style={{ color: NAVY }}>
                {model.name}
              </h3>
              <p className="mt-1 text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {model.method}
              </p>
              <div className="mt-2 flex gap-3 text-[11px] tabular-nums" style={{ color: "var(--text-secondary)" }}>
                <span>{liveFindings.length} findings</span>
                <span>{sources.filter((s) => enabled.has(s.id)).length} sources</span>
              </div>
            </header>
            <ul className="flex-1 overflow-y-auto audit-scroll p-2 space-y-1.5">
              {liveFindings.map((f) => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  sources={audit.sources}
                  enabled={enabled}
                  selected={selectedFindingId === f.id}
                  selectedSourceId={selectedSourceId}
                  onSelect={() => onSelectFinding(f.id)}
                  onCite={onSelectSource}
                />
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function FindingCard({
  finding,
  sources,
  enabled,
  selected,
  selectedSourceId,
  onSelect,
  onCite,
}: {
  finding: AuditFinding
  sources: AuditSource[]
  enabled: Set<string>
  selected: boolean
  selectedSourceId: string | null
  onSelect: () => void
  onCite: (id: string) => void
}) {
  const cites = finding.sourceIds
    .map((id) => sources.find((s) => s.id === id))
    .filter((s): s is AuditSource => !!s && enabled.has(s.id))

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect()
          }
        }}
        className="w-full text-left rounded p-3 cursor-pointer"
        style={{
          background: selected ? "rgba(227,239,250,0.9)" : "var(--bg-muted)",
          boxShadow: selected ? `inset 3px 0 0 ${BLUE}` : undefined,
        }}
      >
        <div className="flex items-start gap-2">
          <StanceIcon stance={finding.stance} />
          <p className="text-[12.5px] leading-snug flex-1" style={{ color: "var(--text-primary)" }}>
            {finding.claim}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-5">
          {cites.map((s) => (
            <CiteChip
              key={s.id}
              n={s.citeIndex}
              active={selectedSourceId === s.id}
              onClick={() => onCite(s.id)}
            />
          ))}
          <ConfidenceDot level={finding.confidence} />
        </div>
      </div>
    </li>
  )
}
