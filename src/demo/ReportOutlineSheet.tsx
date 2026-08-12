import { useEffect, useRef } from "react"
import { CellInput } from "../components/CellInput"
import type { AirshowReportData } from "../utils/templateExport"

const NAVY = "#0A2240"
const GRID = "#9AA3AD"

const FIELDS: Array<{
  key: keyof AirshowReportData
  label: string
  multiline?: boolean
  rows?: number
  uppercase?: boolean
  /** Omit from stacked field list when rendered elsewhere (e.g. title). */
  hideInList?: boolean
}> = [
  { key: "showName", label: "Show", multiline: false, hideInList: true },
  { key: "executiveSummary", label: "Executive Summary", multiline: true, rows: 6 },
  { key: "regionLabel", label: "Region", multiline: false, uppercase: true },
  { key: "engagementTitle", label: "Engagement Title", multiline: false },
  { key: "engagementBody", label: "Engagement Body", multiline: true, rows: 10 },
]

function fieldMatches(paths: string[], key: keyof AirshowReportData, label: string) {
  return paths.some((p) => {
    const t = p.trim()
    return t === key || t === label || t.toLowerCase() === key.toLowerCase()
  })
}

export function ReportOutlineSheet({
  data,
  onChange,
  zoom = 1,
  highlightPaths = [],
  highlightMode,
}: {
  data: AirshowReportData
  onChange?: (next: AirshowReportData) => void
  zoom?: number
  highlightPaths?: string[]
  highlightMode?: "focus" | "applied"
}) {
  const editable = Boolean(onChange)
  const reviewing = highlightPaths.length > 0
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!highlightPaths.length) return
    const root = rootRef.current
    if (!root) return
    const key = highlightPaths[0]
    const byId = key
      ? root.querySelector<HTMLElement>(`[data-report-field="${CSS.escape(key)}"]`)
      : null
    const first =
      byId ||
      root.querySelector<HTMLElement>(".sheet-row-highlight[data-report-field]") ||
      root.querySelector<HTMLElement>(".sheet-row-highlight")
    first?.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }, [highlightPaths])

  const patch = (key: keyof AirshowReportData, value: string) => {
    if (!onChange) return
    onChange({ ...data, [key]: value })
  }

  const titleActive = fieldMatches(highlightPaths, "showName", "Show")

  return (
    <div
      ref={rootRef}
      className={[
        "report-outline-sheet",
        reviewing && highlightMode === "focus" ? "sheet-is-reviewing" : "",
        reviewing && highlightMode === "applied" ? "sheet-is-applied" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        border: `1px solid ${GRID}`,
        background: "#fff",
        zoom,
      }}
    >
      <div
        className="flex items-center justify-between gap-2 px-3 py-1.5 text-[11px] font-semibold"
        style={{ background: NAVY, color: "#fff" }}
      >
        <span>Air Show Summary Report</span>
        <span style={{ color: "#A8C5E8" }}>Editable outline · syncs to Word on Apply</span>
      </div>

      <article className="report-outline-sheet__page">
        <div className="flex justify-end mb-6">
          <img src="/templates/boeing-logo-doc.png" alt="Boeing" className="h-7 object-contain" />
        </div>

        <h3
          data-report-field="showName"
          className={`text-center font-bold text-[12px] mb-8 tracking-wide report-outline-sheet__title ${
            titleActive ? "sheet-row-highlight" : reviewing ? "sheet-row-dim" : ""
          }`}
          style={{ color: "#000" }}
        >
          {editable ? (
            <span className="inline-flex flex-wrap items-baseline justify-center gap-1">
              <CellInput
                value={data.showName}
                onCommit={(v) => patch("showName", v)}
                className="report-outline-sheet__input report-outline-sheet__title-input"
                aria-label="Show name"
                style={{
                  fontWeight: 700,
                  fontSize: 12,
                  textAlign: "center",
                  minWidth: "12ch",
                  maxWidth: "36ch",
                }}
              />
              <span>Summary Report</span>
            </span>
          ) : (
            `${data.showName} Summary Report`
          )}
        </h3>

        {FIELDS.filter((f) => !f.hideInList).map((f) => {
          const active = fieldMatches(highlightPaths, f.key, f.label)
          const dim = reviewing && !active
          return (
            <section
              key={f.key}
              data-report-field={f.key}
              className={`report-outline-sheet__field ${active ? "sheet-row-highlight" : ""} ${dim ? "sheet-row-dim" : ""}`}
            >
              <p className="report-outline-sheet__label">{f.label}</p>
              {editable ? (
                <CellInput
                  multiline={f.multiline}
                  rows={f.rows}
                  value={data[f.key]}
                  onCommit={(v) => patch(f.key, f.uppercase ? v.toUpperCase() : v)}
                  className="report-outline-sheet__input"
                  aria-label={f.label}
                  style={{
                    textTransform: f.uppercase ? "uppercase" : undefined,
                    minHeight: f.multiline && f.rows ? f.rows * 18 : undefined,
                    resize: f.multiline ? "vertical" : undefined,
                    fontWeight: f.key === "engagementTitle" ? 700 : undefined,
                    letterSpacing: f.uppercase ? "0.06em" : undefined,
                    textAlign: f.key === "regionLabel" ? "center" : undefined,
                    color: f.key === "regionLabel" ? NAVY : undefined,
                  }}
                />
              ) : (
                <p
                  className="report-outline-sheet__static"
                  style={{
                    whiteSpace: "pre-wrap",
                    textTransform: f.uppercase ? "uppercase" : undefined,
                    fontWeight: f.key === "engagementTitle" ? 700 : undefined,
                    letterSpacing: f.uppercase ? "0.06em" : undefined,
                    textAlign: f.key === "regionLabel" ? "center" : undefined,
                    color: f.key === "regionLabel" ? NAVY : undefined,
                  }}
                >
                  {data[f.key]}
                </p>
              )}
            </section>
          )
        })}

        <p className="text-center text-[10px] font-bold mt-10 tracking-[0.14em]" style={{ color: NAVY }}>
          BOEING PROPRIETARY
        </p>
      </article>
    </div>
  )
}
