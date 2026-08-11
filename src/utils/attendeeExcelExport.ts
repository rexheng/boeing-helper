import * as XLSX from "xlsx"
import {
  type AttendeeDashboardData,
  type AttendeeSection,
  flattenAttendees,
  sectionCount,
  subsectionCount,
} from "../data/attendeeDashboard"

function sectionRows(section: AttendeeSection): string[][] {
  const rows: string[][] = [
    [`${section.title} (${sectionCount(section)})`, "", "", ""],
    ["Role", "Name", "Organization", "I/D/L"],
  ]
  for (const sub of section.subsections) {
    rows.push([`${sub.title} (${subsectionCount(sub)})`, "", "", ""])
    for (const r of sub.rows) {
      rows.push([
        r.roleLabel,
        r.name || "",
        r.organization || "",
        r.travel ? (r.count > 1 ? `${r.travel}·${r.count}` : r.travel) : "",
      ])
    }
  }
  return rows
}

export function downloadAttendeeDashboardExcel(data: AttendeeDashboardData): void {
  const wb = XLSX.utils.book_new()

  // —— Dashboard: true side-by-side Role/Name/Org/Travel blocks (16 cols) ——
  const grid: (string | number)[][] = []
  grid.push([
    "Attendee List Template",
    "",
    "",
    "",
    "",
    "",
    data.eventTitle,
    "",
    "",
    "",
    "",
    "Participant List",
    "",
    data.revisedLabel,
    "",
    "",
  ])
  grid.push([
    "#",
    "Top 5 Objectives",
    "",
    "",
    "",
    "",
    "",
    "",
    "BD&S Leads",
    "",
    "",
    "Key",
    "Travel",
    "",
    "#",
    "",
  ])

  const travelPack = [
    ["I", "International Travel Required", data.travelCounts.I],
    ["D", "Domestic / Regional Travel Required", data.travelCounts.D],
    ["L", "Local Attendee, No Travel", data.travelCounts.L],
    ["", "Total assigned seats", data.travelCounts.I + data.travelCounts.D + data.travelCounts.L],
    ["", "", ""],
  ] as const

  data.objectives.forEach((o, i) => {
    const t = travelPack[i] ?? (["", "", ""] as const)
    grid.push([
      o.rank,
      o.text,
      "",
      "",
      "",
      "",
      "",
      "",
      o.bdsLead,
      "",
      "",
      t[0],
      t[1],
      "",
      t[2],
      "",
    ])
  })

  grid.push([])
  grid.push(data.columns.flatMap((c) => [`${c.title} (${sectionCount(c)})`, "", "", ""]))
  grid.push(data.columns.flatMap(() => ["Role", "Name", "Organization", "I/D/L"]))

  const blocks = data.columns.map(sectionRows)
  // skip the two header lines already written
  const bodies = blocks.map((b) => b.slice(2))
  const maxBody = Math.max(...bodies.map((b) => b.length), 0)
  for (let i = 0; i < maxBody; i++) {
    const row: (string | number)[] = []
    for (const body of bodies) {
      const cells = body[i] ?? ["", "", "", ""]
      row.push(...cells)
    }
    grid.push(row)
  }

  const dashSheet = XLSX.utils.aoa_to_sheet(grid)
  dashSheet["!cols"] = Array.from({ length: 16 }, () => ({ wch: 14 }))
  XLSX.utils.book_append_sheet(wb, dashSheet, "Dashboard")

  // —— Flat roster (filled seats by default sheet; full scaffold second) ——
  const filled = flattenAttendees(data, { filledOnly: true }).map((r) => ({
    Section: r.section,
    Subsection: r.subsection,
    Role: r.role,
    Name: r.name,
    Organization: r.organization,
    Travel: r.travel,
    Seats: r.count,
    Notes: r.notes,
  }))
  const filledSheet = XLSX.utils.json_to_sheet(filled)
  XLSX.utils.book_append_sheet(wb, filledSheet, "Filled Roster")

  const scaffold = flattenAttendees(data, { filledOnly: false }).map((r) => ({
    Section: r.section,
    Subsection: r.subsection,
    Role: r.role,
    Name: r.name,
    Organization: r.organization,
    Travel: r.travel,
    Seats: r.count,
    Notes: r.notes,
  }))
  const scaffoldSheet = XLSX.utils.json_to_sheet(scaffold)
  XLSX.utils.book_append_sheet(wb, scaffoldSheet, "Full Scaffold")

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
