/**
 * Headless verification: build the same dashboard workbook the browser downloads
 * and assert structural + style invariants match the preview.
 */
import ExcelJS from "exceljs"
import { writeFileSync } from "fs"
import { buildAttendeeDashboard } from "../src/data/attendeeDashboard"
import type { Company } from "../src/data/companies"
import type { Person } from "../src/data/people"
import { EXCEL, EXCEL_ACCENT, EXCEL_SUB } from "../src/utils/attendeeExcelTheme"

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

async function main() {
  ;(globalThis as unknown as { document: unknown }).document = {
    createElement: () => ({ click() {}, href: "", download: "" }),
  }
  ;(globalThis as unknown as { URL: unknown }).URL = {
    createObjectURL: () => "blob:test",
    revokeObjectURL: () => {},
  }

  const data = buildAttendeeDashboard(company, person, "Singapore Airshow", "Singapore")

  const buffers: ArrayBuffer[] = []
  class FakeBlob {
    constructor(parts: ArrayBuffer[]) {
      buffers.push(parts[0])
    }
  }
  ;(globalThis as unknown as { Blob: unknown }).Blob = FakeBlob

  const mod = await import("../src/utils/attendeeExcelExport")
  await mod.downloadAttendeeDashboardExcel(data)

  if (!buffers.length) throw new Error("No workbook buffer produced")
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(buffers[0])

  const ws = wb.getWorksheet("Dashboard")
  if (!ws) throw new Error("Missing Dashboard sheet")

  const failures: string[] = []
  const expect = (cond: boolean, msg: string) => {
    if (!cond) failures.push(msg)
  }

  expect(ws.columnCount >= 16, `expected ≥16 cols, got ${ws.columnCount}`)
  expect(String(ws.getCell(1, 1).value).includes("Attendee List Template"), "A1 title")
  expect(String(ws.getCell(1, 7).value).includes("SINGAPORE"), "event title")
  expect(String(ws.getCell(1, 12).value) === "Participant List", "Participant List")
  expect(String(ws.getCell(1, 15).value).startsWith("Revised"), "revised label")

  const fillOf = (r: number, c: number) => {
    const f = ws.getCell(r, c).fill as ExcelJS.FillPattern
    return (f?.fgColor?.argb || "").replace(/^FF/i, "").toUpperCase()
  }

  expect(fillOf(1, 1) === EXCEL.blue, `header blue got ${fillOf(1, 1)}`)
  expect(fillOf(1, 7) === EXCEL.navy, `header navy got ${fillOf(1, 7)}`)
  expect(fillOf(1, 15) === EXCEL.revised, `revised red got ${fillOf(1, 15)}`)
  expect(fillOf(2, 1) === EXCEL.legend, `legend bg got ${fillOf(2, 1)}`)

  expect(fillOf(8, 1) === EXCEL_ACCENT.navy, `BDS accent got ${fillOf(8, 1)}`)
  expect(fillOf(8, 5) === EXCEL_ACCENT.steel, `BGS accent got ${fillOf(8, 5)}`)
  expect(fillOf(8, 9) === EXCEL_ACCENT.blue, `Global accent got ${fillOf(8, 9)}`)
  expect(fillOf(8, 13) === EXCEL_ACCENT.green, `Exhibit accent got ${fillOf(8, 13)}`)

  expect(String(ws.getCell(9, 1).value) === "Role", "Role header")
  expect(String(ws.getCell(9, 4).value) === "I/D/L", "IDL header")
  expect(fillOf(9, 1) === EXCEL.legend, "col header legend fill")

  expect(fillOf(10, 1) === EXCEL_SUB.navy, `first sub fill got ${fillOf(10, 1)}`)
  expect(String(ws.getCell(10, 1).value).includes("Business Development"), "first sub title")

  const travelFont = ws.getCell(3, 13).font
  expect(!!travelFont?.bold, "travel code bold")
  expect(
    (travelFont?.color?.argb || "").toUpperCase().endsWith(EXCEL.blue),
    "travel code blue",
  )

  const merges = (ws.model as { merges?: string[] }).merges || []
  expect(merges.length > 20, `expected many merges, got ${merges.length}`)

  for (let i = 1; i <= 16; i++) {
    const w = ws.getColumn(i).width || 0
    expect(w >= 5, `col ${i} width ${w}`)
  }

  // Zebra on objective row 4 (0-index 1 → excel row 4)
  expect(fillOf(4, 2) === EXCEL.zebra, `obj zebra got ${fillOf(4, 2)}`)

  // Scan for "Rex Heng" only in Name columns of the body (row ≥ 10)
  let foundRex = false
  ws.eachRow((row) => {
    if (row.number < 10) return
    for (const nameCol of [2, 6, 10, 14]) {
      const cell = ws.getCell(row.number, nameCol)
      if (String(cell.value) === "Rex Heng") {
        foundRex = true
        const tcell = ws.getCell(row.number, nameCol + 2)
        expect(
          (tcell.font?.color?.argb || "").toUpperCase().endsWith(EXCEL.blue),
          `Rex travel blue @${row.number}`,
        )
        expect(tcell.alignment?.horizontal === "center", `Rex travel centered @${row.number}`)
      }
    }
  })
  expect(foundRex, "found Rex Heng in sheet")

  writeFileSync("/tmp/attendee-dashboard-verify.xlsx", Buffer.from(buffers[0]))

  if (failures.length) {
    console.error("FAILURES:")
    failures.forEach((f) => console.error(" -", f))
    process.exit(1)
  }
  console.log("OK — Dashboard sheet matches preview structure/styles")
  console.log("Wrote /tmp/attendee-dashboard-verify.xlsx")
  console.log(`Rows: ${ws.rowCount}, Merges: ${merges.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
