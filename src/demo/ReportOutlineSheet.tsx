import { useEffect } from "react"
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
}> = [
  { key: "showName", label: "Show", multiline: false },
  { key: "executiveSummary", label: "Executive Summary", multiline: true, rows: 6 },
  { key: "regionLabel", label: "Region", multiline: false, uppercase: true },
  { key: "engagementTitle", label: "Engagement Title", multiline: false },
  { key: "engagementBody", label: "Engagement Body", multiline: true, rows: 10 },
]

export function ReportOutlineSheet({
  data,
  onChange,
  highlightPaths = [],
  highlightMode,
}: {
  data: AirshowReportData
  onChange?: (next: AirshowReportData) => void
  highlightPaths?: string[]
  highlightMode?: "focus" | "applied"
}) {
  const editable = Boolean(onChange)
  const reviewing = highlightPaths.length > 0
  const focusSet = new Set(highlightPaths)

  useEffect(() => {
    if (!highlightPaths.length) return
    const key = highlightPaths[0]
    const el = document.querySelector(`[data-report-field="${CSS.escape(key)}"]`)
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [highlightPaths])

  const patch = (key: keyof AirshowReportData, value: string) => {
    if (!onChange) return
    onChange({ ...data, [key]: value })
  }

  return (
    <div
      className={`report-outline-sheet ${reviewing ? (highlightMode === "applied" ? "sheet-is-applied" : "sheet-is-reviewing") : ""}`}
      style={{ border: `1px solid ${GRID}`, background: "#fff" }}
    >
      <div
        className="flex items-center justify-between gap-2 px-3 py-1.5 text-[11px] font-semibold"
        style={{ background: NAVY, color: "#fff" }}
      >
        <span>Summary report — editable outline</span>
        <span style={{ color: "#A8C5E8" }}>Fields sync to Word on Apply / reload</span>
      </div>

      <article className="report-outline-sheet__page">
        <div className="flex justify-end mb-5">
          <img src="/templates/boeing-logo-doc.png" alt="Boeing" className="h-7 object-contain" />
        </div>

        <h3 className="text-center font-bold text-[11px] mb-8 tracking-wide" style={{ color: "#000" }}>
          {data.showName} Summary Report
        </h3>

        {FIELDS.map((f) => {
          const active = focusSet.has(f.key) || focusSet.has(f.label)
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
                  style={{
                    textTransform: f.uppercase ? "uppercase" : undefined,
                    minHeight: f.multiline && f.rows ? f.rows * 18 : undefined,
                    resize: f.multiline ? "vertical" : undefined,
                  }}
                />
              ) : (
                <p
                  className="report-outline-sheet__static"
                  style={{ whiteSpace: "pre-wrap", textTransform: f.uppercase ? "uppercase" : undefined }}
                >
                  {data[f.key]}
                </p>
              )}
            </section>
          )
        })}

        <p className="text-center text-[10px] font-bold mt-8 tracking-[0.12em]" style={{ color: NAVY }}>
          BOEING PROPRIETARY
        </p>
      </article>
    </div>
  )
}
