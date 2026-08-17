import { ExternalLink, Lock } from "lucide-react"
import type { AuditSource, CitationStance } from "../../types/researchAudit"
import { sourceKindLabel } from "../../utils/researchAudit"
import { BLUE, NAVY, SortButton, StanceIcon, SUPPORT, DISPUTE, MENTION } from "./ui"

function StanceCell({ stance, n }: { stance: CitationStance; n: number }) {
  const color = stance === "supporting" ? SUPPORT : stance === "disputing" ? DISPUTE : MENTION
  return (
    <span
      className="inline-flex items-center justify-end gap-1 tabular-nums font-semibold"
      style={{ color, fontSize: 12 }}
    >
      <StanceIcon stance={stance} size={13} />
      {n}
    </span>
  )
}

export type CorpusSortKey = "title" | "year" | "authors" | "supporting" | "disputing" | "mentioning" | "citedBy"

interface CorpusTableProps {
  sources: AuditSource[]
  selectedId: string | null
  onSelect: (id: string) => void
  sortKey: CorpusSortKey
  sortDir: "asc" | "desc"
  onSort: (key: CorpusSortKey) => void
  page: number
  pageSize: number
  total: number
  onPage: (p: number) => void
  onPageSize: (n: number) => void
}

export function CorpusTable({
  sources,
  selectedId,
  onSelect,
  sortKey,
  sortDir,
  onSort,
  page,
  pageSize,
  total,
  onPage,
  onPageSize,
}: CorpusTableProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const from = total === 0 ? 0 : page * pageSize + 1
  const to = Math.min(total, (page + 1) * pageSize)

  const header = (key: CorpusSortKey, label: string, align: "left" | "right" = "left") => (
    <th className={`px-3 py-2 ${align === "right" ? "text-right" : "text-left"}`} scope="col">
      <SortButton label={label} active={sortKey === key} dir={sortDir} onClick={() => onSort(key)} align={align} />
    </th>
  )

  return (
    <div className="flex flex-col min-h-0 flex-1">
      <div className="flex-1 overflow-auto audit-scroll">
        <table className="w-full border-collapse audit-table">
          <thead className="sticky top-0 z-10">
            <tr style={{ background: "#fff", borderBottom: "1px solid var(--surface-border)" }}>
              {header("title", "Title")}
              {header("year", "Year")}
              {header("authors", "Authors")}
              {header("supporting", "Supporting", "right")}
              {header("disputing", "Disputing", "right")}
              {header("mentioning", "Mentioning", "right")}
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                  No sources match these filters.
                </td>
              </tr>
            )}
            {sources.map((s) => {
              const selected = selectedId === s.id
              return (
                <tr
                  key={s.id}
                  tabIndex={0}
                  onClick={() => onSelect(s.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      onSelect(s.id)
                    }
                  }}
                  className="cursor-pointer audit-row"
                  style={{
                    background: selected ? "rgba(227,239,250,0.85)" : undefined,
                    boxShadow: selected ? `inset 3px 0 0 ${BLUE}` : undefined,
                  }}
                >
                  <td className="px-3 py-3 align-top">
                    <p className="text-[13px] leading-snug font-medium">
                      <span className="tabular-nums mr-1.5 text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        [{s.citeIndex}]
                      </span>
                      {s.url ? (
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="audit-title-link"
                        >
                          {s.title}
                          <ExternalLink size={11} className="inline ml-1 -mt-px opacity-60" />
                        </a>
                      ) : (
                        <span style={{ color: BLUE }}>{s.title}</span>
                      )}
                    </p>
                    <p className="text-[11px] mt-1 leading-snug" style={{ color: "var(--text-muted)" }}>
                      {s.classification === "internal" && (
                        <Lock size={10} className="inline mr-1 -mt-px" />
                      )}
                      {sourceKindLabel(s.kind)}
                      {s.date ? ` · ${s.date}` : ` · ${s.year}`}
                      {s.publisher ? ` · ${s.publisher}` : ""}
                    </p>
                  </td>
                  <td className="px-3 py-3 align-top text-[13px] tabular-nums" style={{ color: NAVY }}>
                    {s.year}
                  </td>
                  <td className="px-3 py-3 align-top text-[12px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {s.authors}
                  </td>
                  <td className="px-3 py-3 align-top text-right">
                    <StanceCell stance="supporting" n={s.stanceCounts.supporting} />
                  </td>
                  <td className="px-3 py-3 align-top text-right">
                    <StanceCell stance="disputing" n={s.stanceCounts.disputing} />
                  </td>
                  <td className="px-3 py-3 align-top text-right">
                    <StanceCell stance="mentioning" n={s.stanceCounts.mentioning} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <footer
        className="flex flex-wrap items-center justify-between gap-3 px-3 py-2 shrink-0"
        style={{ borderTop: "1px solid var(--surface-border)", background: "#fff" }}
      >
        <p className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
          {from}–{to} of {total}
        </p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
            Page size
            <select
              value={pageSize}
              onChange={(e) => onPageSize(Number(e.target.value))}
              className="rounded px-1.5 py-1 text-[11px] outline-none"
              style={{ border: "1px solid var(--surface-border)", color: NAVY, background: "#fff" }}
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 0}
              onClick={() => onPage(page - 1)}
              className="px-2 py-1 text-[11px] rounded disabled:opacity-40"
              style={{ border: "1px solid var(--surface-border)", color: BLUE }}
            >
              Prev
            </button>
            <span className="text-[11px] tabular-nums px-1" style={{ color: "var(--text-muted)" }}>
              {page + 1}/{pages}
            </span>
            <button
              type="button"
              disabled={page + 1 >= pages}
              onClick={() => onPage(page + 1)}
              className="px-2 py-1 text-[11px] rounded disabled:opacity-40"
              style={{ border: "1px solid var(--surface-border)", color: BLUE }}
            >
              Next
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
