import { useEffect, useRef } from "react"
import type { AirshowReportData } from "../utils/templateExport"
import {
  resolveReportSectionKey,
  type ReportSectionKey,
} from "../utils/reportSectionAnchor"

export { reportHunkAnchor, resolveReportSectionKey } from "../utils/reportSectionAnchor"
export type ReportSectionAnchor = ReportSectionKey

const NAVY = "#0A2240"
const BLUE = "#0033A1"
const GRID = "#9AA3AD"
const FONT = "'IBM Plex Sans', 'Ubuntu', system-ui, sans-serif"

const SECTION_META: Array<{
  anchor: ReportSectionKey
  label: string
  key: keyof AirshowReportData
}> = [
  { anchor: "executiveSummary", label: "Executive Summary", key: "executiveSummary" },
  { anchor: "regionLabel", label: "Region", key: "regionLabel" },
  { anchor: "engagementTitle", label: "Engagement Title", key: "engagementTitle" },
  { anchor: "engagementBody", label: "Engagement Body", key: "engagementBody" },
]

function matchesHighlight(paths: string[] | undefined, anchor: string, label: string): boolean {
  if (!paths?.length) return false
  return paths.some((p) => {
    const t = p.trim()
    if (!t) return false
    if (t === anchor || t === label) return true
    if (t.toLowerCase() === label.toLowerCase()) return true
    if (t === `Air Show Report / ${label}`) return true
    const resolved = resolveReportSectionKey({ anchor: t, path: t, field: t })
    return resolved === anchor
  })
}

export function ReportFieldSheet({
  data,
  highlightPaths,
  highlightMode,
  onChange,
}: {
  data: AirshowReportData
  highlightPaths?: string[]
  highlightMode?: "focus" | "applied"
  onChange?: (next: AirshowReportData) => void
}) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const editable = Boolean(onChange)

  useEffect(() => {
    if (!highlightPaths?.length) return
    const root = sheetRef.current
    if (!root) return
    const key = highlightPaths[0]
    const byId = key
      ? root.querySelector<HTMLElement>(`[data-section-id="${CSS.escape(key)}"]`)
      : null
    const first =
      byId ||
      root.querySelector<HTMLElement>(".sheet-row-highlight[data-section-id]") ||
      root.querySelector<HTMLElement>(".sheet-row-highlight")
    first?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
  }, [highlightPaths])

  const patch = (key: keyof AirshowReportData, value: string) => {
    if (!onChange) return
    onChange({ ...data, [key]: value })
  }

  const reviewing = Boolean(highlightPaths?.length)

  return (
    <div
      ref={sheetRef}
      className={[
        "report-field-sheet",
        reviewing && highlightMode === "focus" ? "sheet-is-reviewing" : "",
        reviewing && highlightMode === "applied" ? "sheet-is-applied" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        border: `1px solid ${GRID}`,
        fontFamily: FONT,
        background: "#fff",
        minHeight: "100%",
      }}
    >
      <header
        className="report-field-sheet__masthead"
        style={{
          borderBottom: `2px solid ${BLUE}`,
          padding: "18px 22px 14px",
          background: "linear-gradient(180deg, #f7fafc 0%, #fff 100%)",
        }}
      >
        <p
          className="m-0 text-[10px] font-bold uppercase tracking-[0.14em]"
          style={{ color: BLUE }}
        >
          Boeing · Air Show Summary Report
        </p>
        <h3
          className="m-0 mt-2 text-lg font-semibold tracking-tight"
          style={{ color: NAVY, fontFamily: "var(--font-display)" }}
          data-section-id="showName"
        >
          {data.showName}
        </h3>
        <p className="m-0 mt-1 text-[11px]" style={{ color: "var(--text-secondary)" }}>
          Click a proposed change to spotlight the matching section. Edits sync into Word export.
        </p>
      </header>

      <div className="report-field-sheet__body" style={{ padding: "16px 22px 22px" }}>
        {SECTION_META.map((sec) => {
          const highlight = matchesHighlight(highlightPaths, sec.anchor, sec.label)
          const value = String(data[sec.key] ?? "")
          const multiline = sec.key === "executiveSummary" || sec.key === "engagementBody"
          return (
            <section
              key={sec.anchor}
              data-section-id={sec.anchor}
              className={[
                "report-field-sheet__section",
                highlight ? "sheet-row-highlight" : reviewing ? "sheet-row-dim" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              style={{
                marginBottom: 14,
                padding: "12px 14px",
                border: `1px solid ${highlight ? "transparent" : "rgba(10,34,64,0.08)"}`,
                background: highlight ? undefined : "#fff",
              }}
            >
              <p
                className="m-0 mb-2 text-[10px] font-bold uppercase tracking-[0.1em]"
                style={{ color: BLUE }}
              >
                {sec.label}
              </p>
              {editable ? (
                multiline ? (
                  <textarea
                    value={value}
                    onChange={(e) => patch(sec.key, e.target.value)}
                    rows={sec.key === "engagementBody" ? 8 : 5}
                    className="report-field-sheet__input"
                    spellCheck={false}
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => patch(sec.key, e.target.value)}
                    className="report-field-sheet__input"
                    spellCheck={false}
                  />
                )
              ) : (
                <div
                  className="report-field-sheet__static"
                  style={{
                    whiteSpace: "pre-wrap",
                    color: NAVY,
                    fontSize: 13,
                    lineHeight: 1.55,
                  }}
                >
                  {value || "—"}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
