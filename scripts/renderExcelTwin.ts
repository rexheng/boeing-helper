/**
 * Render the Dashboard sheet to a static HTML twin for visual QA vs the React preview.
 */
import ExcelJS from "exceljs"
import { writeFileSync } from "fs"
import { buildAttendeeDashboard } from "../src/data/attendeeDashboard"
import type { Company } from "../src/data/companies"
import type { Person } from "../src/data/people"

const company = {
  id: "mindef-sg",
  name: "MINDEF Singapore",
  country: "singapore",
} as Company

const person = {
  id: "ccs",
  name: "Chan Chun Sing",
  title: "Minister for Defence",
} as Person

function cssColor(argb?: string) {
  if (!argb) return "transparent"
  const hex = argb.replace(/^FF/i, "")
  if (hex === "00000000" || hex.length < 6) return "transparent"
  return `#${hex}`
}

async function main() {
  ;(globalThis as any).document = { createElement: () => ({ click() {}, href: "", download: "" }) }
  ;(globalThis as any).URL = { createObjectURL: () => "blob:test", revokeObjectURL: () => {} }
  const buffers: ArrayBuffer[] = []
  ;(globalThis as any).Blob = class {
    constructor(parts: ArrayBuffer[]) {
      buffers.push(parts[0])
    }
  }

  const data = buildAttendeeDashboard(company, person, "Singapore Airshow", "Singapore")
  const mod = await import("../src/utils/attendeeExcelExport")
  await mod.downloadAttendeeDashboardExcel(data)

  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(buffers[0])
  writeFileSync("/tmp/attendee-dashboard-verify.xlsx", Buffer.from(buffers[0]))
  const ws = wb.getWorksheet("Dashboard")!

  const merges = new Map<string, { rowspan: number; colspan: number }>()
  const skip = new Set<string>()
  const mergeList = (ws.model as any).merges as string[] | undefined
  if (mergeList) {
    for (const m of mergeList) {
      // e.g. "A1:F1"
      const [a, b] = m.split(":")
      const parse = (addr: string) => {
        const m2 = addr.match(/^([A-Z]+)(\d+)$/)!
        const col =
          m2[1].split("").reduce((n, ch) => n * 26 + (ch.charCodeAt(0) - 64), 0)
        return { r: Number(m2[2]), c: col }
      }
      const s = parse(a)
      const e = parse(b)
      merges.set(`${s.r}:${s.c}`, { rowspan: e.r - s.r + 1, colspan: e.c - s.c + 1 })
      for (let r = s.r; r <= e.r; r++) {
        for (let c = s.c; c <= e.c; c++) {
          if (r === s.r && c === s.c) continue
          skip.add(`${r}:${c}`)
        }
      }
    }
  }

  const widths = Array.from({ length: 16 }, (_, i) => {
    const w = ws.getColumn(i + 1).width || 10
    return `${(w / 58) * 100}%`
  })

  let html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Excel Dashboard Twin</title>
<style>
  body{margin:16px;background:#e8eef4;font-family:Arial,Helvetica,sans-serif}
  h1{font-size:14px;color:#0A2240}
  table{border-collapse:collapse;width:100%;table-layout:fixed;background:#fff;font-size:9.5px;line-height:1.15}
  td{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:1px 3px;border:1px solid #7A8490;vertical-align:middle}
</style></head><body>
<h1>Exported Excel → HTML twin (visual QA)</h1>
<table><colgroup>${widths.map((w) => `<col style="width:${w}"/>`).join("")}</colgroup>`

  for (let r = 1; r <= ws.rowCount; r++) {
    html += "<tr>"
    for (let c = 1; c <= 16; c++) {
      if (skip.has(`${r}:${c}`)) continue
      const cell = ws.getCell(r, c)
      const fill = cssColor((cell.fill as ExcelJS.FillPattern)?.fgColor?.argb)
      const color = cssColor(cell.font?.color?.argb) || "#222"
      const bold = cell.font?.bold ? "font-weight:700;" : ""
      const align = cell.alignment?.horizontal || "left"
      const merge = merges.get(`${r}:${c}`)
      const rs = merge && merge.rowspan > 1 ? ` rowspan="${merge.rowspan}"` : ""
      const cs = merge && merge.colspan > 1 ? ` colspan="${merge.colspan}"` : ""
      const val = cell.value == null ? "" : String(cell.value)
      html += `<td${rs}${cs} style="background:${fill};color:${color};${bold}text-align:${align}">${escapeHtml(val)}</td>`
    }
    html += "</tr>"
  }
  html += "</table></body></html>"
  writeFileSync("/tmp/attendee-excel-twin.html", html)
  console.log("Wrote /tmp/attendee-excel-twin.html and /tmp/attendee-dashboard-verify.xlsx")
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
