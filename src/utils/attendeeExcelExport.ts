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

function edge(style: "thin" | "medium" = "thin") {
  return { style, color: { argb: argb(EXCEL.grid) } }
}

function solidFill(hex: string): ExcelJS.Fill {
  return {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: argb(hex) },
  }
}

function font(opts: {
  size?: number
  bold?: boolean
  color?: string
}): Partial<ExcelJS.Font> {
  return {
    name: EXCEL_FONT,
    size: opts.size ?? 9.5,
    bold: !!opts.bold,
    color: { argb: argb(opts.color ?? EXCEL.text) },
  }
}

/** Paint every cell in a range with the same fill + thin grid border. */
function paintRange(
  ws: ExcelJS.Worksheet,
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  fillHex: string,
) {
  for (let r = r1; r <= r2; r++) {
    for (let c = c1; c <= c2; c++) {
      const cell = ws.getCell(r, c)
      cell.fill = solidFill(fillHex)
      cell.border = {
        top: edge(),
        left: edge(),
        bottom: edge(),
        right: edge(),
      }
    }
  }
}

/**
 * Preview uses one colspan=4 cell with flex space-between (title | count).
 * Excel: same fill across the quarter, title left / count right, no internal seam.
 */
function paintTitleCountBand(
  ws: ExcelJS.Worksheet,
  row: number,
  c1: number,
  title: string,
  count: number,
  fill: string,
  fontSize: number,
  uppercase = false,
) {
  const cCount = c1 + 3
  const label = uppercase ? title.toUpperCase() : title

  // Merge title span first, then paint every cell so fills survive the merge
  ws.mergeCells(row, c1, row, cCount - 1)

  for (let c = c1; c <= cCount; c++) {
    const cell = ws.getCell(row, c)
    cell.fill = solidFill(fill)
    cell.border = {
      top: edge(),
      bottom: edge(),
      left: c === c1 ? edge() : undefined,
      right: c === cCount ? edge() : undefined,
    }
  }

  const titleCell = ws.getCell(row, c1)
  titleCell.value = label
  titleCell.font = font({ size: fontSize, bold: true, color: EXCEL.white })
  titleCell.alignment = { horizontal: "left", vertical: "middle", indent: 0 }
  titleCell.fill = solidFill(fill)
  titleCell.border = {
    top: edge(),
    bottom: edge(),
    left: edge(),
    right: undefined,
  }

  const countCell = ws.getCell(row, cCount)
  countCell.value = `(${count})`
  countCell.font = font({ size: fontSize, bold: true, color: EXCEL.white })
  countCell.alignment = { horizontal: "right", vertical: "middle" }
  countCell.fill = solidFill(fill)
  countCell.border = {
    top: edge(),
    bottom: edge(),
    left: undefined,
    right: edge(),
  }
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
    views: [{ state: "frozen", ySplit: 2, showGridLines: false }],
    properties: { defaultRowHeight: 12.5 },
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

  // —— Row 1: Title bar (preview: blue 6 | navy 5 | navy 3 | revised 2) ——
  const headerBands: Array<{
    c1: number
    c2: number
    value: string
    fill: string
    size: number
    hAlign?: ExcelJS.Alignment["horizontal"]
  }> = [
    { c1: 1, c2: 6, value: "Attendee List Template", fill: EXCEL.blue, size: 11 },
    { c1: 7, c2: 11, value: title, fill: EXCEL.navy, size: 11 },
    { c1: 12, c2: 14, value: "Participant List", fill: EXCEL.navy, size: 11 },
    {
      c1: 15,
      c2: 16,
      value: data.revisedLabel,
      fill: EXCEL.revised,
      size: 10,
      hAlign: "right",
    },
  ]
  for (const band of headerBands) {
    paintRange(ws, 1, band.c1, 1, band.c2, band.fill)
    ws.mergeCells(1, band.c1, 1, band.c2)
    const cell = ws.getCell(1, band.c1)
    cell.value = band.value
    cell.font = font({ size: band.size, bold: true, color: EXCEL.white })
    cell.alignment = {
      horizontal: band.hAlign ?? "left",
      vertical: "middle",
    }
    cell.fill = solidFill(band.fill)
    cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
  }
  ws.getRow(1).height = 16

  // —— Row 2: Legend headers ——
  const legendSpecs: Array<{
    c1: number
    c2: number
    value: string
    hAlign?: ExcelJS.Alignment["horizontal"]
  }> = [
    { c1: 1, c2: 1, value: "#" },
    { c1: 2, c2: 8, value: "Top 5 Objectives" },
    { c1: 9, c2: 12, value: "BD&S Leads" },
    { c1: 13, c2: 13, value: "Key" },
    { c1: 14, c2: 15, value: "Travel" },
    { c1: 16, c2: 16, value: "#", hAlign: "right" },
  ]
  for (const spec of legendSpecs) {
    paintRange(ws, 2, spec.c1, 2, spec.c2, EXCEL.legend)
    if (spec.c2 > spec.c1) ws.mergeCells(2, spec.c1, 2, spec.c2)
    const cell = ws.getCell(2, spec.c1)
    cell.value = spec.value
    cell.font = font({ size: 9, bold: true, color: EXCEL.navy })
    cell.alignment = {
      horizontal: spec.hAlign ?? "left",
      vertical: "middle",
    }
    cell.fill = solidFill(EXCEL.legend)
  }
  ws.getRow(2).height = 13

  // —— Rows 3–7: Objectives + leads + travel key ——
  data.objectives.forEach((o, idx) => {
    const row = 3 + idx
    const t = travelRows[idx]
    const bg = idx % 2 ? EXCEL.zebra : EXCEL.white

    const cells: Array<{
      c1: number
      c2: number
      value: string | number
      bold?: boolean
      color?: string
      hAlign?: ExcelJS.Alignment["horizontal"]
      wrap?: boolean
    }> = [
      { c1: 1, c2: 1, value: o.rank, bold: true, color: EXCEL.navy, hAlign: "center" },
      { c1: 2, c2: 8, value: o.text, color: EXCEL.text, wrap: true },
      { c1: 9, c2: 12, value: o.bdsLead, bold: true, color: EXCEL.navy },
      { c1: 13, c2: 13, value: t.code, bold: true, color: EXCEL.blue, hAlign: "center" },
      { c1: 14, c2: 15, value: t.label, color: EXCEL.text },
      {
        c1: 16,
        c2: 16,
        value: t.n === "" ? "" : t.n,
        bold: true,
        color: EXCEL.navy,
        hAlign: "right",
      },
    ]

    for (const spec of cells) {
      paintRange(ws, row, spec.c1, row, spec.c2, bg)
      if (spec.c2 > spec.c1) ws.mergeCells(row, spec.c1, row, spec.c2)
      const cell = ws.getCell(row, spec.c1)
      cell.value = spec.value
      cell.font = font({
        size: 9,
        bold: !!spec.bold,
        color: spec.color ?? EXCEL.text,
      })
      cell.alignment = {
        horizontal: spec.hAlign ?? "left",
        vertical: "middle",
        wrapText: !!spec.wrap,
      }
      cell.fill = solidFill(bg)
    }
    ws.getRow(row).height = 14
  })

  // —— Row 8: Section headers ——
  const sectionRow = 8
  data.columns.forEach((col, i) => {
    paintTitleCountBand(
      ws,
      sectionRow,
      i * 4 + 1,
      col.title,
      sectionCount(col),
      EXCEL_ACCENT[col.accent],
      9,
      true,
    )
  })
  ws.getRow(sectionRow).height = 14

  // —— Row 9: Role / Name / Organization / I/D/L ——
  const headerRow = 9
  for (let i = 0; i < 4; i++) {
    ;(["Role", "Name", "Organization", "I/D/L"] as const).forEach((h, j) => {
      const cell = ws.getCell(headerRow, i * 4 + j + 1)
      cell.value = h
      cell.fill = solidFill(EXCEL.legend)
      cell.font = font({ size: 8.5, bold: true, color: EXCEL.navy })
      cell.alignment = { horizontal: "left", vertical: "middle" }
      cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
    })
  }
  ws.getRow(headerRow).height = 12.5

  // —— Body ——
  for (let rowIdx = 0; rowIdx < maxRows; rowIdx++) {
    const excelRow = headerRow + 1 + rowIdx
    ws.getRow(excelRow).height = 12

    data.columns.forEach((section, colIdx) => {
      const block = columns[colIdx][rowIdx]
      const c1 = colIdx * 4 + 1

      if (!block) {
        for (let j = 0; j < 4; j++) {
          const cell = ws.getCell(excelRow, c1 + j)
          cell.value = ""
          cell.fill = solidFill(EXCEL.white)
          cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
          cell.font = font({ size: 8.5, color: EXCEL.text })
        }
        return
      }

      if (block.kind === "sub") {
        paintTitleCountBand(
          ws,
          excelRow,
          c1,
          block.title,
          block.count,
          EXCEL_SUB[section.accent],
          8.5,
          false,
        )
        return
      }

      const bg = block.zebra ? EXCEL.zebra : EXCEL.white
      const travelCell =
        block.travel && block.seats > 1
          ? `${block.travel}·${block.seats}`
          : block.travel

      const specs: Array<{
        value: string
        bold?: boolean
        color: string
        hAlign?: ExcelJS.Alignment["horizontal"]
      }> = [
        { value: block.role, bold: true, color: EXCEL.navy },
        { value: block.name, color: EXCEL.text },
        { value: block.org, color: EXCEL.textMuted },
        { value: travelCell, bold: true, color: EXCEL.blue, hAlign: "center" },
      ]

      specs.forEach((spec, j) => {
        const cell = ws.getCell(excelRow, c1 + j)
        cell.value = spec.value
        cell.fill = solidFill(bg)
        cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
        cell.font = font({ size: 8.5, bold: !!spec.bold, color: spec.color })
        cell.alignment = {
          horizontal: spec.hAlign ?? "left",
          vertical: "top",
          wrapText: j < 3,
        }
        if (block.seats > 1 && (j === 1 || j === 3)) {
          cell.note = `${block.seats} seats`
        }
      })
    })
  }

  // No post-pass border rewrite — borders are set per-cell above so title/count
  // bands keep their seamless interiors (matching preview flex headers).

  ws.pageSetup = {
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    paperSize: 9,
    margins: { left: 0.25, right: 0.25, top: 0.4, bottom: 0.4, header: 0.2, footer: 0.2 },
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
    cell.fill = solidFill(EXCEL.navy)
    cell.font = font({ size: 10, bold: true, color: EXCEL.white })
    cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
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
      cell.font = font({ size: 9 })
      cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
      if (idx % 2 === 1) cell.fill = solidFill(EXCEL.zebra)
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
    cell.fill = solidFill(EXCEL.navy)
    cell.font = font({ size: 10, bold: true, color: EXCEL.white })
    cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
  })
  data.objectives.forEach((o, idx) => {
    ;[o.rank, o.text, o.bdsLead].forEach((v, i) => {
      const cell = ws.getCell(idx + 2, i + 1)
      cell.value = v
      cell.font = font({ size: 9 })
      cell.border = { top: edge(), left: edge(), bottom: edge(), right: edge() }
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
