import type { AuditSource, GroundedParagraph, ResearchAudit } from "../../types/researchAudit"
import { RESEARCH_MODELS } from "../../utils/researchAudit"
import { CiteChip, LANE_ACCENT, NAVY } from "./ui"

interface GroundedBriefProps {
  audit: ResearchAudit
  enabled: Set<string>
  selectedSourceId: string | null
  onSelectSource: (id: string) => void
}

export function GroundedBrief({ audit, enabled, selectedSourceId, onSelectSource }: GroundedBriefProps) {
  return (
    <div className="overflow-auto audit-scroll h-full p-5 sm:p-7">
      <div className="max-w-3xl mx-auto space-y-8">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--boeing-blue)" }}>
            Grounded brief
          </p>
          <h3 className="mt-1 text-xl font-bold" style={{ color: NAVY }}>
            What the models found
          </h3>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Click a superscript to open the excerpt and the model that retrieved it.
          </p>
        </header>

        {audit.grounded.map((para) => (
          <GroundedBlock
            key={para.id}
            para={para}
            sources={audit.sources}
            enabled={enabled}
            selectedSourceId={selectedSourceId}
            onSelectSource={onSelectSource}
          />
        ))}
      </div>
    </div>
  )
}

function GroundedBlock({
  para,
  sources,
  enabled,
  selectedSourceId,
  onSelectSource,
}: {
  para: GroundedParagraph
  sources: AuditSource[]
  enabled: Set<string>
  selectedSourceId: string | null
  onSelectSource: (id: string) => void
}) {
  const model = RESEARCH_MODELS.find((m) => m.id === para.modelId)
  const liveCites = para.citations.filter((c) => enabled.has(c.sourceId))

  return (
    <article>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: LANE_ACCENT[para.lane] }} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: LANE_ACCENT[para.lane] }}>
          {para.heading} · {model?.shortName} model
        </p>
      </div>
      <p className="text-[15px] leading-[1.75]" style={{ color: "var(--text-primary)" }}>
        {para.text}
        {liveCites.length > 0 && (
          <span className="inline-flex items-center gap-0.5 ml-1">
            {liveCites.map((c) => {
              const src = sources.find((s) => s.id === c.sourceId)
              if (!src) return null
              return (
                <CiteChip
                  key={`${para.id}-${c.sourceId}`}
                  n={src.citeIndex}
                  active={selectedSourceId === src.id}
                  onClick={() => onSelectSource(src.id)}
                />
              )
            })}
          </span>
        )}
      </p>
    </article>
  )
}
