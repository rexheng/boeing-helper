import {
  Check,
  HelpCircle,
  MinusCircle,
  Lock,
  Globe,
  Newspaper,
  FileText,
  BarChart3,
  Quote,
  Landmark,
  UserRound,
  FileBarChart,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { CitationStance, ResearchLane, SourceKind, StanceCounts } from "../../types/researchAudit"

export const BLUE = "#0033A1"
export const NAVY = "#0A2240"
export const ICE = "#E3EFFA"
export const SUPPORT = "#2E7D32"
export const DISPUTE = "#B26A00"
export const MENTION = "#66737E"

export const LANE_ACCENT: Record<ResearchLane, string> = {
  company: BLUE,
  industry: "#005896",
  country: "#0A2240",
}

export const KIND_ICON: Record<SourceKind, LucideIcon> = {
  article: Newspaper,
  press: Newspaper,
  internal: Lock,
  website: Globe,
  report: FileBarChart,
  speech: Quote,
  linkedin: UserRound,
  metric: BarChart3,
  briefing: Landmark,
}

export function StanceIcon({ stance, size = 13 }: { stance: CitationStance; size?: number }) {
  if (stance === "supporting") return <Check size={size} strokeWidth={2.4} color={SUPPORT} />
  if (stance === "disputing") return <HelpCircle size={size} strokeWidth={2.2} color={DISPUTE} />
  return <MinusCircle size={size} strokeWidth={2.2} color={MENTION} />
}

export function StanceCountsRow({
  counts,
  compact,
}: {
  counts: StanceCounts
  compact?: boolean
}) {
  const cell = (stance: CitationStance, n: number, label: string) => (
    <span
      className="inline-flex items-center gap-1 tabular-nums"
      title={`${label}: ${n}`}
      style={{
        color: stance === "supporting" ? SUPPORT : stance === "disputing" ? DISPUTE : MENTION,
        fontSize: compact ? 11 : 12,
        fontWeight: 600,
        minWidth: compact ? 28 : 36,
      }}
    >
      <StanceIcon stance={stance} size={compact ? 12 : 13} />
      {n}
    </span>
  )
  return (
    <span className="inline-flex items-center gap-3">
      {cell("supporting", counts.supporting, "Supporting cites")}
      {cell("disputing", counts.disputing, "Disputing cites")}
      {cell("mentioning", counts.mentioning, "Mentioning cites")}
    </span>
  )
}

export function CiteChip({
  n,
  active,
  onClick,
}: {
  n: number
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      className="audit-cite-chip"
      aria-label={`Citation ${n}`}
      aria-pressed={active}
      style={{
        background: active ? BLUE : ICE,
        color: active ? "#fff" : BLUE,
      }}
    >
      {n}
    </button>
  )
}

export function KindBadge({ kind }: { kind: SourceKind }) {
  const Icon = KIND_ICON[kind]
  const isInternal = kind === "internal"
  return (
    <span
      className="inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
      style={{
        background: isInternal ? "rgba(10,34,64,0.08)" : ICE,
        color: isInternal ? NAVY : BLUE,
      }}
    >
      <Icon size={10} />
      {kind === "internal" ? "Internal" : kind}
    </span>
  )
}

export function ConfidenceDot({ level }: { level: "high" | "medium" | "low" }) {
  const color = level === "high" ? SUPPORT : level === "medium" ? DISPUTE : MENTION
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium capitalize" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
      {level}
    </span>
  )
}

export function SortButton({
  label,
  active,
  dir,
  onClick,
  align = "left",
}: {
  label: string
  active: boolean
  dir: "asc" | "desc"
  onClick: () => void
  align?: "left" | "right"
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] ${
        align === "right" ? "ml-auto" : ""
      }`}
      style={{ color: active ? BLUE : "var(--text-muted)" }}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      {label}
      <span className="inline-flex flex-col -space-y-1" aria-hidden>
        <ChevronUp size={10} style={{ opacity: active && dir === "asc" ? 1 : 0.35 }} />
        <ChevronDown size={10} style={{ opacity: active && dir === "desc" ? 1 : 0.35 }} />
      </span>
    </button>
  )
}

export function FileGlyph({ kind }: { kind: SourceKind }) {
  const Icon = KIND_ICON[kind] ?? FileText
  return (
    <span
      className="w-7 h-7 rounded flex items-center justify-center shrink-0"
      style={{
        background: kind === "internal" ? "rgba(10,34,64,0.08)" : ICE,
        color: kind === "internal" ? NAVY : BLUE,
      }}
    >
      <Icon size={13} />
    </span>
  )
}
