import { useEffect, useRef } from "react"
import { CellInput } from "../components/CellInput"
import type { AirshowReportData } from "../utils/templateExport"

const NAVY = "#0A2240"

const BODY_FIELDS: Array<{
  key: keyof AirshowReportData
  label: string
  multiline?: boolean
  rows?: number
  uppercase?: boolean
  centered?: boolean
}> = [
  { key: "executiveSummary", label: "Executive Summary", multiline: true, rows: 7 },
  { key: "regionLabel", label: "Region", multiline: false, uppercase: true, centered: true },
  { key: "engagementTitle", label: "Engagement", multiline: false },
  { key: "engagementBody", label: "", multiline: true, rows: 11 },
]

function fieldMatches(paths: string[], key: keyof AirshowReportData, label: string) {
  return paths.some((p) => {
    const t = p.trim()
    if (t === key || t.toLowerCase() === key.toLowerCase()) return true
    if (label && t === label) return true
    if (key === "engagementTitle" && (t === "Engagement Title" || t === "Engagement")) return true
    if (key === "engagementBody" && t === "Engagement Body") return true
    return false
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
      style={{ zoom }}
    >
      <article className="report-outline-sheet__page">
        <div className="flex justify-end mb-8">
          <img src="/templates/boeing-logo-doc.png" alt="Boeing" className="h-7 object-contain" />
        </div>

        <h3
          data-report-field="showName"
          className={`report-outline-sheet__doc-title ${
            titleActive ? "sheet-row-highlight" : reviewing ? "sheet-row-dim" : ""
          }`}
        >
          {editable ? (
            <span className="inline-flex flex-wrap items-baseline justify-center gap-1.5">
              <CellInput
                value={data.showName}
                onCommit={(v) => patch("showName", v)}
                className="report-outline-sheet__input report-outline-sheet__title-input"
                aria-label="Show name"
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  textAlign: "center",
                  minWidth: "14ch",
                  maxWidth: "40ch",
                }}
              />
              <span>Summary Report</span>
            </span>
          ) : (
            `${data.showName} Summary Report`
          )}
        </h3>

        {BODY_FIELDS.map((f) => {
          const active = fieldMatches(highlightPaths, f.key, f.label)
          const dim = reviewing && !active
          return (
            <section
              key={f.key}
              data-report-field={f.key}
              className={`report-outline-sheet__section ${active ? "sheet-row-highlight" : ""} ${dim ? "sheet-row-dim" : ""}`}
            >
              {f.label ? (
                <p
                  className="report-outline-sheet__heading"
                  style={{
                    textAlign: f.centered ? "center" : undefined,
                    letterSpacing: f.uppercase ? "0.08em" : undefined,
                  }}
                >
                  {f.label}
                </p>
              ) : null}
              {editable ? (
                <CellInput
                  multiline={f.multiline}
                  rows={f.rows}
                  value={data[f.key]}
                  onCommit={(v) => patch(f.key, f.uppercase ? v.toUpperCase() : v)}
                  className="report-outline-sheet__input"
                  aria-label={f.label || f.key}
                  style={{
                    textTransform: f.uppercase ? "uppercase" : undefined,
                    minHeight: f.multiline && f.rows ? f.rows * 17 : undefined,
                    resize: f.multiline ? "vertical" : undefined,
                    fontWeight: f.key === "engagementTitle" || f.uppercase ? 700 : undefined,
                    letterSpacing: f.uppercase ? "0.1em" : undefined,
                    textAlign: f.centered || f.key === "engagementTitle" ? "center" : undefined,
                    color: f.key === "regionLabel" || f.key === "engagementTitle" ? NAVY : "#111",
                    fontSize: f.key === "engagementTitle" ? 12 : undefined,
                  }}
                />
              ) : (
                <p
                  className="report-outline-sheet__static"
                  style={{
                    whiteSpace: "pre-wrap",
                    textTransform: f.uppercase ? "uppercase" : undefined,
                    fontWeight: f.key === "engagementTitle" || f.uppercase ? 700 : undefined,
                    letterSpacing: f.uppercase ? "0.1em" : undefined,
                    textAlign: f.centered || f.key === "engagementTitle" ? "center" : undefined,
                    color: f.key === "regionLabel" || f.key === "engagementTitle" ? NAVY : "#111",
                  }}
                >
                  {data[f.key]}
                </p>
              )}
            </section>
          )
        })}

        <p className="report-outline-sheet__proprietary">BOEING PROPRIETARY</p>
      </article>
    </div>
  )
}
