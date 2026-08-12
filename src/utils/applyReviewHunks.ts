import type { AttendeeDashboardData, TravelCode } from "../data/attendeeDashboard"
import { withRecountedTravel } from "../data/attendeeDashboard"
import type { AirshowReportData } from "../utils/templateExport"
import type { ReviewHunk } from "../types/documentReview"

/** Apply only selected report field hunks onto the current report. */
export function applyReportHunks(
  current: AirshowReportData,
  hunks: ReviewHunk[],
): AirshowReportData {
  const next = { ...current }
  for (const h of hunks) {
    if (h.op === "remove") continue
    const key =
      h.field === "Executive Summary" ? "executiveSummary"
        : h.field === "Engagement Title" ? "engagementTitle"
          : h.field === "Engagement Body" ? "engagementBody"
            : h.field === "Region" ? "regionLabel"
              : null
    if (key) next[key] = h.after
  }
  return next
}

/**
 * Prefer full proposed document when every hunk is accepted.
 * Otherwise merge selected field updates/adds/removes onto current.
 */
export function applyAttendeeHunks(
  current: AttendeeDashboardData,
  proposed: AttendeeDashboardData,
  selected: ReviewHunk[],
  allHunkCount: number,
): AttendeeDashboardData {
  if (selected.length === 0) return current
  if (selected.length === allHunkCount) return withRecountedTravel(proposed)

  let next = structuredClone(current)

  for (const h of selected) {
    if (h.op === "add") {
      // Pull matching new rows from proposed that aren't in current
      for (const col of proposed.columns) {
        const curCol = next.columns.find((c) => c.id === col.id)
        if (!curCol) continue
        for (const sub of col.subsections) {
          const curSub = curCol.subsections.find((s) => s.id === sub.id)
          if (!curSub) continue
          for (const row of sub.rows) {
            if (curSub.rows.some((r) => r.id === row.id)) continue
            const label = `${row.roleLabel}: ${row.name}${row.organization ? ` (${row.organization})` : ""} [${row.travel || "—"}]`
            if (h.after.includes(row.name) || h.after === label) {
              curSub.rows.push(structuredClone(row))
            }
          }
        }
      }
      continue
    }

    if (h.op === "remove") {
      for (const col of next.columns) {
        for (const sub of col.subsections) {
          sub.rows = sub.rows.filter((r) => {
            const label = `${r.name || "(empty)"}${r.organization ? ` · ${r.organization}` : ""}`
            return !(h.before === label || (r.name && h.before.includes(r.name)))
          })
        }
      }
      continue
    }

    // update: locate row by path fragments and patch field
    const parts = h.path.split(" / ").map((p) => p.trim())
    const sectionTitle = parts[0]
    const subsectionTitle = parts[1]
    const roleHint = parts[2]
    for (const col of next.columns) {
      if (sectionTitle && !col.title.startsWith(sectionTitle) && col.title !== sectionTitle) continue
      for (const sub of col.subsections) {
        if (subsectionTitle && sub.title !== subsectionTitle) continue
        for (const row of sub.rows) {
          if (roleHint && row.roleLabel !== roleHint && !h.path.includes(row.roleLabel)) continue
          if (h.field === "Role") row.roleLabel = h.after
          if (h.field === "Name") {
            row.name = h.after
            if (h.after.trim()) row.count = Math.max(row.count, 1)
          }
          if (h.field === "Organization") row.organization = h.after
          if (h.field === "I/D/L") row.travel = (h.after as TravelCode | "") || ""
          if (h.field === "Notes") row.notes = h.after
          if (h.field === "Seats") row.count = Number(h.after) || 0
        }
      }
    }
  }

  return withRecountedTravel(next)
}
