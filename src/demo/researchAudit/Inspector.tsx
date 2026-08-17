import { ExternalLink, Lock, X } from "lucide-react"
import type { AuditFinding, AuditSource, ResearchAudit } from "../../types/researchAudit"
import { RESEARCH_MODELS, sourceKindLabel } from "../../utils/researchAudit"
import { BLUE, ConfidenceDot, KindBadge, NAVY, StanceCountsRow, StanceIcon } from "./ui"

interface InspectorProps {
  audit: ResearchAudit
  source: AuditSource | null
  finding: AuditFinding | null
  onSelectSource: (id: string) => void
  onSelectFinding: (id: string) => void
  onClose?: () => void
}

export function Inspector({ audit, source, finding, onSelectSource, onSelectFinding, onClose }: InspectorProps) {
  const relatedFindings = source
    ? audit.findings.filter((f) => f.sourceIds.includes(source.id))
    : finding
      ? [finding]
      : []

  const relatedSources = finding
    ? audit.sources.filter((s) => finding.sourceIds.includes(s.id))
    : source
      ? [source]
      : []

  const models = (source ?? finding)
    ? RESEARCH_MODELS.filter((m) =>
        source ? source.modelIds.includes(m.id) : finding?.modelId === m.id,
      )
    : []

  return (
    <aside className="audit-pane audit-pane--inspector flex flex-col min-h-0">
      <header className="px-4 pt-4 pb-3 flex items-start justify-between gap-2 shrink-0" style={{ borderBottom: "1px solid var(--surface-border)" }}>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: BLUE }}>
            Inspector
          </p>
          <h3 className="mt-1 text-sm font-semibold" style={{ color: NAVY }}>
            {source ? "Source record" : finding ? "Finding" : "Select a row"}
          </h3>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} className="p-1 rounded" style={{ color: "var(--text-muted)" }} aria-label="Close inspector">
            <X size={16} />
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto audit-scroll p-4 space-y-5">
        {!source && !finding && (
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Click an article, a finding, or a citation chip to see the excerpt, which model retrieved it, and
            every claim that rests on it.
          </p>
        )}

        {source && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="tabular-nums text-xs font-bold px-1.5 py-0.5 rounded-sm"
                style={{ background: "var(--boeing-ice)", color: BLUE }}
              >
                [{source.citeIndex}]
              </span>
              <KindBadge kind={source.kind} />
              {source.classification === "internal" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: NAVY }}>
                  <Lock size={10} /> Restricted
                </span>
              )}
            </div>
            <h4 className="text-[15px] font-semibold leading-snug" style={{ color: NAVY }}>
              {source.title}
            </h4>
            <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {source.authors} · {source.publisher}
              {source.date ? ` · ${source.date}` : ` · ${source.year}`}
            </p>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-1.5" style={{ color: "var(--text-muted)" }}>
                Citation character
              </p>
              <StanceCountsRow counts={source.stanceCounts} />
            </div>
            <blockquote
              className="text-sm leading-relaxed pl-3 py-1"
              style={{ borderLeft: `3px solid ${BLUE}`, color: "var(--text-secondary)" }}
            >
              {source.excerpt}
            </blockquote>
            {source.url ? (
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: BLUE }}
              >
                Open source
                <ExternalLink size={12} />
              </a>
            ) : (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                No public URL — held in the Boeing internal index.
              </p>
            )}
          </section>
        )}

        {finding && !source && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <StanceIcon stance={finding.stance} />
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                {finding.stance} · {finding.field}
              </span>
            </div>
            <h4 className="text-[15px] font-semibold leading-snug" style={{ color: NAVY }}>
              {finding.claim}
            </h4>
            <ConfidenceDot level={finding.confidence} />
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {finding.excerpt}
            </p>
          </section>
        )}

        {models.length > 0 && (
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--text-muted)" }}>
              Retrieved by
            </p>
            <ul className="space-y-2">
              {models.map((m) => (
                <li key={m.id} className="rounded p-3" style={{ background: "var(--bg-muted)" }}>
                  <p className="text-xs font-semibold" style={{ color: NAVY }}>
                    {m.name}
                  </p>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {m.method}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedFindings.length > 0 && (
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--text-muted)" }}>
              Findings that cite this
            </p>
            <ul className="space-y-1.5">
              {relatedFindings.map((f) => (
                <li key={f.id}>
                  <button
                    type="button"
                    onClick={() => onSelectFinding(f.id)}
                    className="w-full text-left rounded px-3 py-2 text-xs leading-snug"
                    style={{
                      background: finding?.id === f.id ? "var(--boeing-ice)" : "var(--bg-muted)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <StanceIcon stance={f.stance} />{" "}
                    {f.claim}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {relatedSources.length > 0 && finding && (
          <section>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--text-muted)" }}>
              Evidence
            </p>
            <ul className="space-y-1.5">
              {relatedSources.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => onSelectSource(s.id)}
                    className="w-full text-left rounded px-3 py-2"
                    style={{
                      background: source?.id === s.id ? "var(--boeing-ice)" : "var(--bg-muted)",
                    }}
                  >
                    <p className="text-xs font-medium" style={{ color: BLUE }}>
                      [{s.citeIndex}] {s.title}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {sourceKindLabel(s.kind)} · {s.publisher}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </aside>
  )
}
