import ExcelJS from "exceljs"
import {
  type AttendeeDashboardData,
  type AttendeeSection,
  flattenAttendees,
  sectionCount,
  subsectionCount,
} from "../data/attendeeDashboard"
import {
  EXCEL,
  EXCEL_ACCENT,
  EXCEL_COL_WIDTHS,
  EXCEL_FONT,
  EXCEL_SUB,
} from "./attendeeExcelTheme"

type FlatBlock =
  | { kind: "sub"; title: string; count: number }
  | {
      kind: "row"
      role: string
      name: string
      org: string
      travel: string
      seats: number
      zebra: boolean
    }

function flattenSection(section: AttendeeSection): FlatBlock[] {
  const blocks: FlatBlock[] = []
  for (const sub of section.subsections) {
    blocks.push({ kind: "sub", title: sub.title, count: subsectionCount(sub) })
    sub.rows.forEach((row, idx) => {
      blocks.push({
        kind: "row",
        role: row.roleLabel,
        name: row.name || "",
        org: row.organization || "",
        travel: row.travel || "",
        seats: row.count,
        zebra: idx % 2 === 1,
      })
    })
  }
  return blocks
}

function argb(hex: string) {
  return `FF${hex.replace(/^#/, "").toUpperCase()}`
}

function thinBorder() {
  const edge = { style: "thin" as const, color: { argb: argb(EXCEL.grid) } }
  return { top: edge, left: edge, bottom: edge, right: edge }
}

function applyBorderRange(
  ws: ExcelJS.Worksheet,
  r1: number,
  c1: number,
  r2: number,
  c2: number,
) {
  const border = thinBorder()
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const cell = ws.getCell(r, c)
      cell.border = border
    }
  }
}

function fillRange(
  ws: ExcelJS.Worksheet,
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  fillHex: string,
) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      ws.getCell(r, c).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: argb(fillHex) },
      }
    }
  }
}

function styleHeaderCell(
  cell: ExcelJS.Cell,
  opts: {
    fill: string
    fontSize?: number
    bold?: boolean
    color?: string
    hAlign?: ExcelJS.Alignment["horizontal"]
    vAlign?: ExcelJS.Alignment["vertical"]
    wrap?: boolean
  },
) {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: argb(opts.fill) },
  }
  cell.font = {
    name: EXCEL_FONT,
    size: opts.fontSize ?? 11,
    bold: opts.bold ?? true,
    color: { argb: argb(opts.color ?? EXCEL.white) },
  }
  cell.alignment = {
    horizontal: opts.hAlign ?? "left",
    vertical: opts.vAlign ?? "middle",
    wrapText: opts.wrap ?? false,
  }
  cell.border = thinBorder()
}

function downloadBlob(buffer: ArrayBuffer, filename: string) {
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

async function buildDashboardSheet(
  wb: ExcelJS.Workbook,
  data: AttendeeDashboardData,
) {
  const ws = wb.addWorksheet("Dashboard", {
    views: [{ state: "frozen", ySplit: 2, showGridLines: true }],
    properties: { defaultRowHeight: 14 },
  })

  ws.columns = EXCEL_COL_WIDTHS.map((width) => ({ width }))

  const title = data.eventTitle.toUpperCase()
  const columns = data.columns.map(flattenSection)
  const maxRows = Math.max(...columns.map((c) => c.length), 0)

  const travelRows = [
    { code: "I", label: "International Travel Required", n: data.travelCounts.I },
    { code: "D", label: "Domestic / Regional Travel Required", n: data.travelCounts.D },
    { code: "L", label: "Local Attendee, No Travel", n: data.travelCounts.L },
    {
      code: "",
      label: "Total assigned seats",
      n: data.travelCounts.I + data.travelCounts.D + data.travelCounts.L,
    },
    { code: "", label: "", n: "" as const },
  ]

  // —— Row 1: Title bar (matches preview header) ——
  ws.mergeCells(1, 1, 1, 6)
  ws.mergeCells(1, 7, 1, 11)
  ws.mergeCells(1, 12, 1, 14)
  ws.mergeCells(1, 15, 1, 16)

  const cTemplate = ws.getCell(1, 1)
  cTemplate.value = "Attendee List Template"
  styleHeaderCell(cTemplate, { fill: EXCEL.blue, fontSize: 11 })
  fillRange(ws, 1, 1, 1, 6, EXCEL.blue)
  applyBorderRange(ws, 1, 1, 1, 6)

  const cEvent = ws.getCell(1, 7)
  cEvent.value = title
  styleHeaderCell(cEvent, { fill: EXCEL.navy, fontSize: 11 })
  fillRange(ws, 1, 7, 1, 11, EXCEL.navy)
  applyBorderRange(ws, 1, 7, 1, 11)

  const cPart = ws.getCell(1, 12)
  cPart.value = "Participant List"
  styleHeaderCell(cPart, { fill: EXCEL.navy, fontSize: 11 })
  fillRange(ws, 1, 12, 1, 14, EXCEL.navy)
  applyBorderRange(ws, 1, 12, 1, 14)

  const cRev = ws.getCell(1, 15)
  cRev.value = data.revisedLabel
  styleHeaderCell(cRev, {
    fill: EXCEL.revised,
    fontSize: 10,
    hAlign: "right",
  })
  fillRange(ws, 1, 15, 1, 16, EXCEL.revised)
  applyBorderRange(ws, 1, 15, 1, 16)
  ws.getRow(1).height = 18

  // —— Row 2: Legend headers ——
  ws.mergeCells(2, 2, 2, 8)
  ws.mergeCells(2, 9, 2, 12)
  ws.mergeCells(2, 14, 2, 15)

  const legendSpecs: Array<{
    col: number
    end: number
    value: string
    hAlign?: ExcelJS.Alignment["horizontal"]
  }> = [
    { col: 1, end: 1, value: "#", hAlign: "left" },
    { col: 2, end: 8, value: "Top 5 Objectives" },
    { col: 9, end: 12, value: "BD&S Leads" },
    { col: 13, end: 13, value: "Key" },
    { col: 14, end: 15, value: "Travel" },
    { col: 16, end: 16, value: "#", hAlign: "right" },
  ]

  for (const spec of legendSpecs) {
    const cell = ws.getCell(2, spec.col)
    cell.value = spec.value
    styleHeaderCell(cell, {
      fill: EXCEL.legend,
      fontSize: 9,
      color: EXCEL.navy,
      hAlign: spec.hAlign ?? "left",
    })
    fillRange(ws, 2, spec.col, 2, spec.end, EXCEL.legend)
    applyBorderRange(ws, 2, spec.col, 2, spec.end)
  }
  ws.getRow(2).height = 15

  // —— Rows 3–7: Objectives + leads + travel key ——
  data.objectives.forEach((o, idx) => {
    const row = 3 + idx
    const t = travelRows[idx]
    const bg = idx % 2 ? EXCEL.zebra : EXCEL.white

    ws.mergeCells(row, 2, row, 8)
    ws.mergeCells(row, 9, row, 12)
    ws.mergeCells(row, 14, row, 15)

    const cells: Array<{
      col: number
      end: number
      value: string | number
      bold?: boolean
      color?: string
      hAlign?: ExcelJS.Alignment["horizontal"]
    }> = [
      { col: 1, end: 1, value: o.rank, bold: true, color: EXCEL.navy, hAlign: "center" },
      { col: 2, end: 8, value: o.text, color: EXCEL.text },
      { col: 9, end: 12, value: o.bdsLead, bold: true, color: EXCEL.navy },
      { col: 13, end: 13, value: t.code, bold: true, color: EXCEL.blue, hAlign: "center" },
      { col: 14, end: 15, value: t.label, color: EXCEL.text },
      {
        col: 16,
        end: 16,
        value: t.n === "" ? "" : t.n,
        bold: true,
        color: EXCEL.navy,
        hAlign: "right",
      },
    ]

    for (const spec of cells) {
      const cell = ws.getCell(row, spec.col)
      cell.value = spec.value
      cell.font = {
        name: EXCEL_FONT,
        size: 9,
        bold: !!spec.bold,
        color: { argb: argb(spec.color ?? EXCEL.text) },
      }
      cell.alignment = {
        horizontal: spec.hAlign ?? "left",
        vertical: "middle",
        wrapText: spec.col === 2,
      }
      fillRange(ws, row, spec.col, row, spec.end, bg)
      applyBorderRange(ws, row, spec.col, row, spec.end)
    }
    ws.getRow(row).height = 16
  })

  // —— Row 8: Section headers (4 × 4 cols) — title left, count right ——
  const sectionRow = 8
  data.columns.forEach((col, i) => {
    const c1 = i * 4 + 1
    const c2 = c1 + 3
    const fill = EXCEL_ACCENT[col.accent]
    // Merge title across first 3 of the quarter; count sits in the 4th cell
    ws.mergeCells(sectionRow, c1, sectionRow, c2 - 1)
    const titleCell = ws.getCell(sectionRow, c1)
    titleCell.value = col.title.toUpperCase()
    styleHeaderCell(titleCell, { fill, fontSize: 9, hAlign: "left" })
    const countCell = ws.getCell(sectionRow, c2)
    countCell.value = `(${sectionCount(col)})`
    styleHeaderCell(countCell, { fill, fontSize: 9, hAlign: "right" })
    fillRange(ws, sectionRow, c1, sectionRow, c2, fill)
    applyBorderRange(ws, sectionRow, c1, sectionRow, c2)
  })
  ws.getRow(sectionRow).height = 16

  // —— Row 9: Column headers Role / Name / Organization / I/D/L ——
  const headerRow = 9
  for (let i = 0; i < 4; i++) {
    ;(["Role", "Name", "Organization", "I/D/L"] as const).forEach((h, j) => {
      const cell = ws.getCell(headerRow, i * 4 + j + 1)
      cell.value = h
      styleHeaderCell(cell, {
        fill: EXCEL.legend,
        fontSize: 8,
        color: EXCEL.navy,
      })
    })
  }
  ws.getRow(headerRow).height = 14

  // —— Body rows (aligned across four columns, same as preview) ——
  for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
    const excelRow = headerRow + 1 + rowIdx
    ws.getRow(excelRow).height = 13

    data.columns.forEach((section, colIdx) => {
      const block = columns[colIdx][rowIdx]
      const c1 = colIdx * 4 + 1

      if (!block) {
        for (let j = 0; j < 4; j++) {
          const cell = ws.getCell(excelRow, c1 + j)
          cell.value = ""
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: argb(EXCEL.white) },
          }
          cell.border = thinBorder()
          cell.font = { name: EXCEL_FONT, size: 8 }
        }
        return
      }

      if (block.kind === "sub") {
        const fill = EXCEL_SUB[section.accent]
        ws.mergeCells(excelRow, c1, excelRow, c1 + 2)
        const titleCell = ws.getCell(excelRow, c1)
        titleCell.value = block.title
        styleHeaderCell(titleCell, { fill, fontSize: 8, hAlign: "left" })
        const countCell = ws.getCell(excelRow, c1 + 3)
        countCell.value = `(${block.count})`
        styleHeaderCell(countCell, { fill, fontSize: 8, hAlign: "right" })
        fillRange(ws, excelRow, c1, excelRow, c1 + 3, fill)
        applyBorderRange(ws, excelRow, c1, excelRow, c1 + 3)
        return
      }

      const bg = block.zebra ? EXCEL.zebra : EXCEL.white
      const travelCell =
        block.travel && block.seats > 1
          ? `${block.travel}·${block.seats}`
          : block.travel

      const values = [block.role, block.name, block.org, travelCell]
      values.forEach((val, j) => {
        const cell = ws.getCell(excelRow, c1 + j)
        cell.value = val
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: argb(bg) },
        }
        cell.border = thinBorder()
        if (j === 0) {
          cell.font = {
            name: EXCEL_FONT,
            size: 8,
            bold: true,
            color: { argb: argb(EXCEL.navy) },
          }
          cell.alignment = { horizontal: "left", vertical: "top", wrapText: true }
        } else if (j === 2) {
          cell.font = {
            name: EXCEL_FONT,
            size: 8,
            color: { argb: argb(EXCEL.textMuted) },
          }
          cell.alignment = { horizontal: "left", vertical: "top", wrapText: true }
        } else if (j === 3) {
          cell.font = {
            name: EXCEL_FONT,
            size: 8,
            bold: true,
            color: { argb: argb(EXCEL.blue) },
          }
          cell.alignment = { horizontal: "center", vertical: "top" }
        } else {
          cell.font = {
            name: EXCEL_FONT,
            size: 8,
            color: { argb: argb(EXCEL.text) },
          }
          cell.alignment = { horizontal: "left", vertical: "top", wrapText: true }
        }
        if (block.seats > 1 && (j === 1 || j === 3)) {
          cell.note = `${block.seats} seats`
        }
      })
    })
  }

  // Light footer bar under the grid
  const footerRow = headerRow + 1 + maxRows
  for (let c = 1; c <= 16; c++) {
    const cell = ws.getCell(footerRow, c)
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: argb(EXCEL.legend) },
    }
    cell.border = thinBorder()
  }
  ws.getRow(footerRow).height = 8

  // Thick outer border around the full dashboard (matches preview frame)
  const thin = { style: "thin" as const, color: { argb: argb(EXCEL.grid) } }
  const thick = { style: "medium" as const, color: { argb: argb(EXCEL.navy) } }
  for (let r = 1; r <= footerRow; r++) {
    for (let c = 1; c <= 16; c++) {
      const cell = ws.getCell(r, c)
      cell.border = {
        top: r === 1 ? thick : thin,
        bottom: r === footerRow ? thick : thin,
        left: c === 1 ? thick : thin,
        right: c === 16 ? thick : thin,
      }
    }
  }

  // Print / page setup for landscape dashboard feel
  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
  }
}

function addRosterSheet(
  wb: ExcelJS.Workbook,
  name: string,
  data: AttendeeDashboardData,
  filledOnly: boolean,
) {
  const ws = wb.addWorksheet(name)
  const rows = flattenAttendees(data, { filledOnly })
  const headers = [
    "Section",
    "Subsection",
    "Role",
    "Name",
    "Organization",
    "Travel",
    "Seats",
    "Notes",
  ]
  headers.forEach((h, i) => {
    const cell = ws.getCell(1, i + 1)
    cell.value = h
    styleHeaderCell(cell, { fill: EXCEL.navy, fontSize: 10 })
  })
  rows.forEach((r, idx) => {
    const values = [
      r.section,
      r.subsection,
      r.role,
      r.name,
      r.organization,
      r.travel,
      r.count,
      r.notes,
    ]
    values.forEach((v, i) => {
      const cell = ws.getCell(idx + 2, i + 1)
      cell.value = v
      cell.font = { name: EXCEL_FONT, size: 9 }
      cell.border = thinBorder()
      if (idx % 2 === 1) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: argb(EXCEL.zebra) },
        }
      }
    })
  })
  ws.columns = [
    { width: 36 },
    { width: 28 },
    { width: 22 },
    { width: 22 },
    { width: 28 },
    { width: 8 },
    { width: 8 },
    { width: 24 },
  ]
}

function addObjectivesSheet(wb: ExcelJS.Workbook, data: AttendeeDashboardData) {
  const ws = wb.addWorksheet("Objectives")
  ;["Rank", "Objective", "BD&S Lead"].forEach((h, i) => {
    const cell = ws.getCell(1, i + 1)
    cell.value = h
    styleHeaderCell(cell, { fill: EXCEL.navy, fontSize: 10 })
  })
  data.objectives.forEach((o, idx) => {
    ;[o.rank, o.text, o.bdsLead].forEach((v, i) => {
      const cell = ws.getCell(idx + 2, i + 1)
      cell.value = v
      cell.font = { name: EXCEL_FONT, size: 9 }
      cell.border = thinBorder()
      cell.alignment = { wrapText: i === 1, vertical: "middle" }
    })
  })
  ws.columns = [{ width: 8 }, { width: 70 }, { width: 22 }]
}

export async function downloadAttendeeDashboardExcel(
  data: AttendeeDashboardData,
): Promise<void> {
  const wb = new ExcelJS.Workbook()
  wb.creator = "Boeing Helper"
  wb.created = new Date()

  await buildDashboardSheet(wb, data)
  addRosterSheet(wb, "Filled Roster", data, true)
  addRosterSheet(wb, "Full Scaffold", data, false)
  addObjectivesSheet(wb, data)

  const buffer = await wb.xlsx.writeBuffer()
  downloadBlob(
    buffer as ArrayBuffer,
    `${data.eventName.replace(/\s+/g, "-")}-Attendee-Dashboard.xlsx`,
  )
}
