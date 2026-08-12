import { useMemo } from "react"
import {
  DataSheetGrid,
  textColumn,
  keyColumn,
  intColumn,
} from "react-datasheet-grid"
import "react-datasheet-grid/dist/style.css"
import {
  addAttendeeRow,
  removeAttendeeRow,
  withRecountedTravel,
  type AttendeeDashboardData,
  type TravelCode,
} from "../data/attendeeDashboard"

const BLUE = "#0033A1"
const NAVY = "#0A2240"

export type SheetRow = {
  sectionId: string
  subsectionId: string
  rowId: string
  section: string
  subsection: string
  role: string
  name: string
  organization: string
  travel: string
  count: number | null
  notes: string
}

function shortSection(title: string) {
  if (title.startsWith("BDS")) return "BDS"
  if (title.startsWith("BGS")) return "BGS"
  if (title.startsWith("Boeing Global")) return "Boeing Global"
  return "Exhibit Ops"
}

export function rowsFromDashboard(data: AttendeeDashboardData, filledOnly: boolean): SheetRow[] {
  const rows: SheetRow[] = []
  for (const section of data.columns) {
    for (const sub of section.subsections) {
      for (const r of sub.rows) {
        if (filledOnly && !r.name && !r.count) continue
        rows.push({
          sectionId: section.id,
          subsectionId: sub.id,
          rowId: r.id,
          section: shortSection(section.title),
          subsection: sub.title,
          role: r.roleLabel,
          name: r.name || "",
          organization: r.organization || "",
          travel: r.travel || "",
          count: r.count || null,
          notes: r.notes || "",
        })
      }
    }
  }
  return rows
}

function applySheetRows(
  data: AttendeeDashboardData,
  rows: SheetRow[],
  opts?: { filledOnly?: boolean },
): AttendeeDashboardData {
  const filledOnly = opts?.filledOnly ?? false
  const byId = new Map<string, SheetRow>()
  for (const r of rows) byId.set(r.rowId, r)

  const next: AttendeeDashboardData = structuredClone(data)
  const seen = new Set<string>()

  for (const col of next.columns) {
    for (const sub of col.subsections) {
      const kept = []
      for (const row of sub.rows) {
        const patch = byId.get(row.id)
        if (!patch) {
          // Hidden empty slots stay; only delete if the row was visible in the grid
          const wasVisible = !filledOnly || Boolean(row.name || row.count)
          if (!wasVisible) kept.push(row)
          continue
        }
        seen.add(row.id)
        const travel = (["I", "D", "L"].includes(patch.travel) ? patch.travel : "") as TravelCode | ""
        kept.push({
          ...row,
          roleLabel: patch.role,
          name: patch.name,
          organization: patch.organization || undefined,
          travel,
          count: patch.count ?? (patch.name.trim() ? 1 : 0),
          notes: patch.notes || undefined,
        })
      }
      for (const r of rows) {
        if (seen.has(r.rowId)) continue
        if (r.sectionId !== col.id || r.subsectionId !== sub.id) continue
        seen.add(r.rowId)
        const travel = (["I", "D", "L"].includes(r.travel) ? r.travel : "") as TravelCode | ""
        kept.push({
          id: r.rowId,
          roleLabel: r.role || "Role",
          name: r.name,
          organization: r.organization || undefined,
          travel,
          count: r.count ?? (r.name.trim() ? 1 : 0),
          notes: r.notes || undefined,
        })
      }
      sub.rows = kept
    }
  }

  return withRecountedTravel(next)
}

export function AttendeeDataSheet({
  data,
  onChange,
  showEmpty,
}: {
  data: AttendeeDashboardData
  onChange: (next: AttendeeDashboardData) => void
  showEmpty: boolean
}) {
  const rows = useMemo(() => rowsFromDashboard(data, !showEmpty), [data, showEmpty])

  const columns = useMemo(
    () => [
      { ...keyColumn("section", textColumn), title: "Section", minWidth: 100, disabled: true },
      { ...keyColumn("subsection", textColumn), title: "Subsection", minWidth: 140, disabled: true },
      { ...keyColumn("role", textColumn), title: "Role", minWidth: 120 },
      { ...keyColumn("name", textColumn), title: "Name", minWidth: 140 },
      { ...keyColumn("organization", textColumn), title: "Organization", minWidth: 140 },
      { ...keyColumn("travel", textColumn), title: "I/D/L", minWidth: 80 },
      { ...keyColumn("count", intColumn), title: "Seats", minWidth: 72 },
      { ...keyColumn("notes", textColumn), title: "Notes", minWidth: 140 },
    ],
    [],
  )

  return (
    <div className="attendee-datasheet" style={{ border: "1px solid #9AA3AD" }}>
      <div
        className="flex items-center justify-between gap-2 px-2 py-1.5 text-[11px] font-semibold"
        style={{ background: NAVY, color: "#fff" }}
      >
        <span>Participant list — editable grid (Excel / Sheets paste works)</span>
        <span style={{ color: "#A8C5E8" }}>Tab · Enter · Ctrl/Cmd+C/V · Delete</span>
      </div>
      <DataSheetGrid
        value={rows}
        onChange={(next) => {
          // Normalize travel codes
          const cleaned: SheetRow[] = next.map((r) => {
            const t = String(r.travel || "").trim().toUpperCase().slice(0, 1)
            return {
              ...r,
              travel: t === "I" || t === "D" || t === "L" ? t : "",
              rowId: r.rowId || `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              sectionId: r.sectionId || data.columns[0]?.id || "bds",
              subsectionId:
                r.subsectionId || data.columns[0]?.subsections[0]?.id || "sub",
              section: r.section || "",
              subsection: r.subsection || "",
              role: r.role || "",
              name: r.name || "",
              organization: r.organization || "",
              count: r.count ?? null,
              notes: r.notes || "",
            }
          })
          onChange(applySheetRows(data, cleaned, { filledOnly: !showEmpty }))
        }}
        columns={columns}
        gutterColumn={{ minWidth: 36 }}
        height={420}
        rowHeight={28}
        headerRowHeight={30}
        lockRows={false}
        disableExpandSelection={false}
        createRow={() => {
          const col = data.columns[0]
          const sub = col?.subsections[0]
          return {
            sectionId: col?.id || "bds",
            subsectionId: sub?.id || "sub",
            rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            section: shortSection(col?.title || "BDS"),
            subsection: sub?.title || "",
            role: "Role",
            name: "",
            organization: "",
            travel: "",
            count: 1,
            notes: "",
          } satisfies SheetRow
        }}
        duplicateRow={({ rowData }) => ({
          ...rowData,
          rowId: `row-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: rowData.name ? `${rowData.name} (copy)` : "",
        })}
      />
      <div className="flex flex-wrap gap-2 px-2 py-2" style={{ background: "#F8FAFC", borderTop: "1px solid #E9EBED" }}>
        <button
          type="button"
          className="cursor-pointer text-[11px] font-semibold px-2 py-1"
          style={{ color: BLUE, border: `1px solid ${BLUE}` }}
          onClick={() => {
            const col = data.columns[0]
            const sub = col?.subsections[0]
            if (!col || !sub) return
            onChange(addAttendeeRow(data, col.id, sub.id, { roleLabel: "Role", count: 1 }))
          }}
        >
          + Add row (first section)
        </button>
        <button
          type="button"
          className="cursor-pointer text-[11px] font-semibold px-2 py-1"
          style={{ color: "#8B1E2D", border: "1px solid #8B1E2D" }}
          onClick={() => {
            const last = rows[rows.length - 1]
            if (!last) return
            onChange(removeAttendeeRow(data, last.sectionId, last.subsectionId, last.rowId))
          }}
        >
          Remove last row
        </button>
      </div>
    </div>
  )
}
