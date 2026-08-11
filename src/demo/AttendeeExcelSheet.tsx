import { useMemo } from "react"
import {
  accentColor,
  sectionCount,
  subHeaderColor,
  subsectionCount,
  type AttendeeDashboardData,
  type AttendeeSection,
} from "../data/attendeeDashboard"

const BLUE = "#0033A1"
const NAVY = "#0A2240"
const GRID = "#7A8490"
const ZEBRA = "#EEF2F6"
const LEGEND = "#D6DEE8"
const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif"

type FlatBlock =
  | { kind: "sub"; title: string; count: number }
  | { kind: "row"; role: string; name: string; org: string; travel: string; seats: number; zebra: boolean }

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

export function AttendeeExcelSheet({
  data,
  eventLabel,
}: {
  data: AttendeeDashboardData
  eventLabel: string
}) {
  const title = (eventLabel || data.eventTitle).toUpperCase()
  const columns = useMemo(() => data.columns.map(flattenSection), [data.columns])
  const maxRows = Math.max(...columns.map((c) => c.length), 0)

  const travelRows = [
    { code: "I", label: "International Travel Required", n: data.travelCounts.I },
    { code: "D", label: "Domestic / Regional Travel Required", n: data.travelCounts.D },
    { code: "L", label: "Local Attendee, No Travel", n: data.travelCounts.L },
    { code: "", label: "Total assigned seats", n: data.travelCounts.I + data.travelCounts.D + data.travelCounts.L },
    { code: "", label: "", n: "" as const },
  ]

  // Per-quarter widths: Role 28% · Name 36% · Org 26% · I/D/L 10% of 25% → of full sheet
  const colWidths = Array.from({ length: 16 }, (_, i) => {
    const w = i % 4
    return w === 0 ? "7%" : w === 1 ? "9%" : w === 2 ? "6.5%" : "2.5%"
  })

  return (
    <div
      className="w-full overflow-x-auto bg-white"
      style={{ border: `1px solid ${GRID}`, fontFamily: FONT, fontSize: 9.5, lineHeight: 1.15 }}
    >
      <table className="w-full border-collapse min-w-[1100px]" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {colWidths.map((w, i) => (
            <col key={i} style={{ width: w }} />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th colSpan={6} className="text-left font-bold text-[11px] text-white px-1 py-1 border sticky top-0" style={{ background: BLUE, borderColor: GRID }}>
              Attendee List Template
            </th>
            <th colSpan={5} className="text-left font-bold text-[11px] text-white px-1 py-1 border sticky top-0" style={{ background: NAVY, borderColor: GRID }}>
              {title}
            </th>
            <th colSpan={3} className="text-left font-bold text-[11px] text-white px-1 py-1 border sticky top-0" style={{ background: NAVY, borderColor: GRID }}>
              Participant List
            </th>
            <th colSpan={2} className="text-right font-bold text-[10px] text-white px-1 py-1 border sticky top-0" style={{ background: "#8B1E2D", borderColor: GRID }}>
              {data.revisedLabel}
            </th>
          </tr>
          <tr style={{ background: LEGEND }}>
            <th colSpan={1} className="text-left font-bold text-[9px] px-1 py-0.5 border" style={{ borderColor: GRID, color: NAVY }}>#</th>
            <th colSpan={7} className="text-left font-bold text-[9px] px-1 py-0.5 border" style={{ borderColor: GRID, color: NAVY }}>Top 5 Objectives</th>
            <th colSpan={4} className="text-left font-bold text-[9px] px-1 py-0.5 border" style={{ borderColor: GRID, color: NAVY }}>BD&amp;S Leads</th>
            <th className="text-left font-bold text-[9px] px-1 py-0.5 border" style={{ borderColor: GRID, color: NAVY }}>Key</th>
            <th colSpan={2} className="text-left font-bold text-[9px] px-1 py-0.5 border" style={{ borderColor: GRID, color: NAVY }}>Travel</th>
            <th className="text-right font-bold text-[9px] px-1 py-0.5 border" style={{ borderColor: GRID, color: NAVY }}>#</th>
          </tr>
        </thead>

        <tbody>
          {data.objectives.map((o, idx) => {
            const t = travelRows[idx]
            return (
              <tr key={o.rank} style={{ background: idx % 2 ? ZEBRA : "#fff" }}>
                <td className="px-1 py-0 border font-bold text-center" style={{ borderColor: GRID, color: NAVY }}>{o.rank}</td>
                <td colSpan={7} className="px-1 py-0 border" style={{ borderColor: GRID, color: "#222" }}>{o.text}</td>
                <td colSpan={4} className="px-1 py-0 border font-bold" style={{ borderColor: GRID, color: NAVY }}>{o.bdsLead}</td>
                <td className="px-1 py-0 border font-bold text-center" style={{ borderColor: GRID, color: BLUE }}>{t.code}</td>
                <td colSpan={2} className="px-1 py-0 border" style={{ borderColor: GRID, color: "#222" }}>{t.label}</td>
                <td className="px-1 py-0 border font-bold text-right" style={{ borderColor: GRID, color: NAVY }}>{t.n}</td>
              </tr>
            )
          })}

          <tr>
            {data.columns.map((col) => (
              <td
                key={col.id}
                colSpan={4}
                className="px-1 py-0.5 border font-bold uppercase text-white text-[9px]"
                style={{ background: accentColor(col.accent), borderColor: GRID }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span>{col.title}</span>
                  <span className="shrink-0 tabular-nums">({sectionCount(col)})</span>
                </div>
              </td>
            ))}
          </tr>

          <tr style={{ background: LEGEND }}>
            {data.columns.flatMap((col) =>
              ["Role", "Name", "Organization", "I/D/L"].map((h) => (
                <td key={`${col.id}-${h}`} className="px-0.5 py-0 border font-bold text-[8.5px]" style={{ borderColor: GRID, color: NAVY }}>
                  {h}
                </td>
              )),
            )}
          </tr>

          {Array.from({ length: maxRows }).map((_, rowIdx) => (
            <tr key={`r-${rowIdx}`}>
              {columns.map((colBlocks, colIdx) => {
                const block = colBlocks[rowIdx]
                const section = data.columns[colIdx]
                if (!block) {
                  return (
                    <FragmentRow key={`${section.id}-empty-${rowIdx}`} role="" name="" org="" travel="" bg="#fff" />
                  )
                }
                if (block.kind === "sub") {
                  return (
                    <td
                      key={`${section.id}-s-${rowIdx}`}
                      colSpan={4}
                      className="px-1 py-0 border font-bold text-white text-[8.5px]"
                      style={{ background: subHeaderColor(section.accent), borderColor: GRID }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>{block.title}</span>
                        <span className="tabular-nums">({block.count})</span>
                      </div>
                    </td>
                  )
                }
                const bg = block.zebra ? ZEBRA : "#fff"
                const travelCell =
                  block.travel && block.seats > 1
                    ? `${block.travel}·${block.seats}`
                    : block.travel
                return (
                  <FragmentRow
                    key={`${section.id}-r-${rowIdx}`}
                    role={block.role}
                    name={block.name}
                    org={block.org}
                    travel={travelCell}
                    note={block.seats > 1 ? `${block.seats} seats` : undefined}
                    bg={bg}
                  />
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FragmentRow({
  role,
  name,
  org,
  travel,
  note,
  bg,
}: {
  role: string
  name: string
  org: string
  travel: string
  note?: string
  title?: string
  bg: string
}) {
  return (
    <>
      <td className="px-0.5 py-0 border font-bold align-top" style={{ borderColor: GRID, color: NAVY, background: bg }}>{role}</td>
      <td className="px-0.5 py-0 border align-top" style={{ borderColor: GRID, color: "#222", background: bg }} title={note}>{name}</td>
      <td className="px-0.5 py-0 border align-top" style={{ borderColor: GRID, color: "#555", background: bg }}>{org}</td>
      <td className="px-0.5 py-0 border text-center font-bold align-top" style={{ borderColor: GRID, color: BLUE, background: bg }} title={note}>{travel}</td>
    </>
  )
}
