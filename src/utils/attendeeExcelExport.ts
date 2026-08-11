import * as XLSX from "xlsx"
import {
  type AttendeeDashboardData,
  flattenAttendees,
  sectionCount,
  subsectionCount,
} from "../data/attendeeDashboard"

export function downloadAttendeeDashboardExcel(data: AttendeeDashboardData): void {
  const wb = XLSX.utils.book_new()

  // Dashboard sheet — mirrors on-screen Role | Name | Organization | I/D/L lattice
  const grid: (string | number)[][] = []
  grid.push([
    "Attendee List Template",
    "",
    data.eventTitle,
    "",
    "Participant List",
    data.revisedLabel,
  ])
  grid.push([])
  grid.push(["#", "Top 5 Objectives", "BD&S Leads", "Key", "Travel", "#"])
  data.objectives.forEach((o, i) => {
    const travel =
      i === 0
        ? (["I", "International Travel Required", data.travelCounts.I] as const)
        : i === 1
          ? (["D", "Domestic / Regional Travel Required", data.travelCounts.D] as const)
          : i === 2
            ? (["L", "Local Attendee, No Travel", data.travelCounts.L] as const)
            : i === 3
              ? (["", "Total assigned seats", data.travelCounts.I + data.travelCounts.D + data.travelCounts.L] as const)
              : (["", "", ""] as const)
    grid.push([o.rank, o.text, o.bdsLead, travel[0], travel[1], travel[2]])
  })
  grid.push([])

  // Four section headers
  grid.push(data.columns.map((c) => `${c.title} (${sectionCount(c)})`))
  grid.push(data.columns.map(() => "Role | Name | Organization | I/D/L | Seats | Notes"))

  const maxSubs = Math.max(...data.columns.map((c) => c.subsections.length))
  for (let si = 0; si < maxSubs; si++) {
    grid.push(
      data.columns.map((c) => {
        const sub = c.subsections[si]
        return sub ? `${sub.title} (${subsectionCount(sub)})` : ""
      }),
    )
    const maxRows = Math.max(
      ...data.columns.map((c) => (c.subsections[si] ? c.subsections[si].rows.length : 0)),
      0,
    )
    for (let ri = 0; ri < maxRows; ri++) {
      grid.push(
        data.columns.map((c) => {
          const row = c.subsections[si]?.rows[ri]
          if (!row) return ""
          const parts = [
            row.roleLabel,
            row.name || "",
            row.organization || "",
            row.travel || "",
            row.count || "",
            row.notes || "",
          ]
          return parts.join(" | ")
        }),
      )
    }
    grid.push([])
  }

  const dashSheet = XLSX.utils.aoa_to_sheet(grid)
  dashSheet["!cols"] = [{ wch: 42 }, { wch: 42 }, { wch: 42 }, { wch: 42 }]
  XLSX.utils.book_append_sheet(wb, dashSheet, "Dashboard")

  // Flat roster — full scaffold including empty role slots
  const list = flattenAttendees(data, { filledOnly: false }).map((r) => ({
    Section: r.section,
    Subsection: r.subsection,
    Role: r.role,
    Name: r.name,
    Organization: r.organization,
    Travel: r.travel,
    Seats: r.count,
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
    { wch: 28 },
  ]
  XLSX.utils.book_append_sheet(wb, listSheet, "Attendee List")

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
