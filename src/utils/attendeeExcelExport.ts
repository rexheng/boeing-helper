import * as XLSX from "xlsx"
import {
  type AttendeeDashboardData,
  flattenAttendees,
  sectionCount,
  subsectionCount,
} from "../data/attendeeDashboard"

export function downloadAttendeeDashboardExcel(data: AttendeeDashboardData): void {
  const wb = XLSX.utils.book_new()

  // —— Dashboard sheet (mirrors Excel visual layout) ——
  const grid: (string | number)[][] = []
  grid.push(["Attendee List Template", "", "", data.eventTitle, "Participant List"])
  grid.push([data.revisedLabel])
  grid.push([])
  grid.push(["Top 5 Objectives", "", "BD&S Leads", "", "Travel Key", "Description", "# of attendees"])
  data.objectives.forEach((o, i) => {
    const travelRow =
      i === 0
        ? ["I", "International Travel Required", data.travelCounts.I]
        : i === 1
          ? ["D", "Domestic / Regional Travel Required", data.travelCounts.D]
          : i === 2
            ? ["L", "Local Attendee, No Travel", data.travelCounts.L]
            : ["", "", ""]
    grid.push([`Objective ${o.rank}:`, o.text, o.bdsLead, "", ...travelRow])
  })
  grid.push([])

  const colHeaders = data.columns.map((c) => `${c.title}  (${sectionCount(c)})`)
  grid.push(colHeaders)

  const maxSubs = Math.max(...data.columns.map((c) => c.subsections.length))
  for (let si = 0; si < maxSubs; si++) {
    const subTitles = data.columns.map((c) => {
      const sub = c.subsections[si]
      return sub ? `${sub.title}  (${subsectionCount(sub)})` : ""
    })
    grid.push(subTitles)

    const maxRows = Math.max(
      ...data.columns.map((c) => (c.subsections[si] ? c.subsections[si].rows.length : 0)),
      0,
    )
    for (let ri = 0; ri < maxRows; ri++) {
      grid.push(
        data.columns.map((c) => {
          const row = c.subsections[si]?.rows[ri]
          if (!row) return ""
          const travel = row.travel ? ` [${row.travel}]` : ""
          const name = row.name ? ` — ${row.name}` : ""
          return `${row.roleLabel}${name}${travel}`
        }),
      )
    }
    grid.push([])
  }

  const dashSheet = XLSX.utils.aoa_to_sheet(grid)
  dashSheet["!cols"] = [{ wch: 36 }, { wch: 36 }, { wch: 36 }, { wch: 36 }]
  XLSX.utils.book_append_sheet(wb, dashSheet, "Dashboard")

  // —— Flat list sheet ——
  const list = flattenAttendees(data).map((r) => ({
    Section: r.section,
    Subsection: r.subsection,
    Role: r.role,
    Name: r.name,
    Organization: r.organization,
    Travel: r.travel,
    Count: r.count,
    Notes: r.notes,
  }))
  const listSheet = XLSX.utils.json_to_sheet(list)
  listSheet["!cols"] = [
    { wch: 34 },
    { wch: 28 },
    { wch: 22 },
    { wch: 28 },
    { wch: 36 },
    { wch: 8 },
    { wch: 8 },
    { wch: 24 },
  ]
  XLSX.utils.book_append_sheet(wb, listSheet, "Attendee List")

  // —— Objectives sheet ——
  const objSheet = XLSX.utils.json_to_sheet(
    data.objectives.map((o) => ({
      Rank: o.rank,
      Objective: o.text,
      "BD&S Lead": o.bdsLead,
    })),
  )
  XLSX.utils.book_append_sheet(wb, objSheet, "Objectives")

  XLSX.writeFile(wb, `${data.eventName.replace(/\s+/g, "-")}-Attendee-Dashboard.xlsx`)
}
