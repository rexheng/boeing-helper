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
const GRID = "#8E97A1"
const ZEBRA = "#EEF2F6"
const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif"

type FlatBlock =
  | { kind: "sub"; title: string; count: number; accent: AttendeeSection["accent"] }
  | { kind: "row"; role: string; name: string; org: string; travel: string; zebra: boolean }

function flattenSection(section: AttendeeSection): FlatBlock[] {
  const blocks: FlatBlock[] = []
  for (const sub of section.subsections) {
    blocks.push({
      kind: "sub",
      title: sub.title,
      count: subsectionCount(sub),
      accent: section.accent,
    })
    sub.rows.forEach((row, idx) => {
      blocks.push({
        kind: "row",
        role: row.roleLabel,
        name: row.name || "",
        org: row.organization || "",
        travel: row.travel || "",
        zebra: idx % 2 === 1,
      })
    })
  }
  return blocks
}

function padBlocks(blocks: FlatBlock[], target: number): FlatBlock[] {
  if (blocks.length >= target) return blocks
  const padded = [...blocks]
  let i = 0
  while (padded.length < target) {
    padded.push({ kind: "row", role: "", name: "", org: "", travel: "", zebra: i % 2 === 1 })
    i++
  }
  return padded
}

export function AttendeeExcelSheet({
  data,
  eventLabel,
}: {
  data: AttendeeDashboardData
  eventLabel: string
}) {
  const title = (eventLabel || data.eventTitle).toUpperCase()

  const columns = useMemo(() => {
    const flats = data.columns.map(flattenSection)
    const max = Math.max(...flats.map((f) => f.length), 0)
    return flats.map((f) => padBlocks(f, max))
  }, [data.columns])

  return (
    <div
      className="w-full overflow-x-auto bg-white"
      style={{ border: `1px solid ${GRID}`, fontFamily: FONT, fontSize: 10, lineHeight: 1.25 }}
    >
      <table className="w-full border-collapse min-w-[1080px]" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {Array.from({ length: 16 }).map((_, i) => (
            <col key={i} style={{ width: `${100 / 16}%` }} />
          ))}
        </colgroup>

        {/* Title — full navy/blue band across all 16 subcolumns (4×4) */}
        <thead>
          <tr>
            <th
              colSpan={8}
              className="text-left font-bold text-[12px] text-white px-1.5 py-1 border"
              style={{ background: BLUE, borderColor: GRID }}
            >
              Attendee List Template
            </th>
            <th
              colSpan={4}
              className="text-left font-bold text-[11px] text-white px-1.5 py-1 border"
              style={{ background: NAVY, borderColor: GRID }}
            >
              {title}
            </th>
            <th
              colSpan={4}
              className="text-left font-bold text-[11px] text-white px-1.5 py-1 border"
              style={{ background: NAVY, borderColor: GRID }}
            >
              Participant List
              <span className="ml-2 font-semibold" style={{ color: "#F5C6CB" }}>
                {data.revisedLabel}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Objectives (12 cols) + Travel (4 cols) */}
          <tr>
            <td colSpan={12} className="p-0 border align-top" style={{ borderColor: GRID }}>
              <table className="w-full border-collapse" style={{ fontSize: 10 }}>
                <thead>
                  <tr style={{ background: NAVY, color: "#fff" }}>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID, width: "12%" }}>
                      #
                    </th>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID }}>
                      Top 5 Objectives
                    </th>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID, width: "20%" }}>
                      BD&amp;S Leads
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.objectives.map((o) => (
                    <tr key={o.rank} style={{ background: o.rank % 2 ? "#fff" : ZEBRA }}>
                      <td className="px-1 py-0.5 border font-bold text-center" style={{ borderColor: GRID, color: NAVY }}>
                        {o.rank}
                      </td>
                      <td className="px-1 py-0.5 border" style={{ borderColor: GRID, color: "#222" }}>
                        {o.text}
                      </td>
                      <td className="px-1 py-0.5 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                        {o.bdsLead}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td colSpan={4} className="p-0 border align-top" style={{ borderColor: GRID }}>
              <table className="w-full border-collapse h-full" style={{ fontSize: 10 }}>
                <thead>
                  <tr style={{ background: BLUE, color: "#fff" }}>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID, width: "14%" }}>
                      Key
                    </th>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID }}>
                      Travel
                    </th>
                    <th className="text-right font-bold px-1 py-0.5 border" style={{ borderColor: GRID, width: "16%" }}>
                      #
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      { code: "I", label: "International Travel Required", n: data.travelCounts.I },
                      { code: "D", label: "Domestic / Regional Travel Required", n: data.travelCounts.D },
                      { code: "L", label: "Local Attendee, No Travel", n: data.travelCounts.L },
                    ] as const
                  ).map((row, i) => (
                    <tr key={row.code} style={{ background: i % 2 ? ZEBRA : "#fff" }}>
                      <td className="px-1 py-0.5 border font-bold text-center" style={{ borderColor: GRID, color: BLUE }}>
                        {row.code}
                      </td>
                      <td className="px-1 py-0.5 border" style={{ borderColor: GRID, color: "#222" }}>
                        {row.label}
                      </td>
                      <td className="px-1 py-0.5 border text-right font-bold" style={{ borderColor: GRID, color: NAVY }}>
                        {row.n}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: ZEBRA }}>
                    <td colSpan={3} className="px-1 py-0.5 border" style={{ borderColor: GRID, color: "#666", height: 28 }}>
                      {/* fills residual height under 5 objectives */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          {/* Section headers — 4 cols × 4 subcols */}
          <tr>
            {data.columns.map((col) => (
              <td
                key={col.id}
                colSpan={4}
                className="px-1 py-1 border font-bold uppercase text-white text-[9px] align-middle"
                style={{ background: accentColor(col.accent), borderColor: GRID }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span>{col.title}</span>
                  <span className="shrink-0 tabular-nums">({sectionCount(col)})</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Column legends */}
          <tr>
            {data.columns.map((col) => (
              <td key={`${col.id}-legend`} colSpan={4} className="p-0 border" style={{ borderColor: GRID }}>
                <table className="w-full border-collapse" style={{ fontSize: 9, tableLayout: "fixed" }}>
                  <colgroup>
                    <col style={{ width: "26%" }} />
                    <col style={{ width: "34%" }} />
                    <col style={{ width: "28%" }} />
                    <col style={{ width: "12%" }} />
                  </colgroup>
                  <tbody>
                    <tr style={{ background: "#D9E2EC" }}>
                      {["Role", "Name", "Organization", "I/D/L"].map((h) => (
                        <td key={h} className="px-0.5 py-0.5 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                          {h}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </td>
            ))}
          </tr>

          {/* Aligned role body — one row of the outer table per logical block index */}
          {columns[0].map((_, rowIdx) => (
            <tr key={`body-${rowIdx}`}>
              {columns.map((colBlocks, colIdx) => {
                const block = colBlocks[rowIdx]
                const section = data.columns[colIdx]
                if (block.kind === "sub") {
                  return (
                    <td
                      key={`${section.id}-sub-${rowIdx}`}
                      colSpan={4}
                      className="px-1 py-0.5 border font-bold text-white text-[9px]"
                      style={{ background: subHeaderColor(section.accent), borderColor: GRID }}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>{block.title}</span>
                        <span className="tabular-nums">({block.count})</span>
                      </div>
                    </td>
                  )
                }
                return (
                  <td key={`${section.id}-row-${rowIdx}`} colSpan={4} className="p-0 border" style={{ borderColor: GRID }}>
                    <table className="w-full border-collapse" style={{ fontSize: 9.5, tableLayout: "fixed" }}>
                      <colgroup>
                        <col style={{ width: "26%" }} />
                        <col style={{ width: "34%" }} />
                        <col style={{ width: "28%" }} />
                        <col style={{ width: "12%" }} />
                      </colgroup>
                      <tbody>
                        <tr style={{ background: block.zebra ? ZEBRA : "#fff" }}>
                          <td className="px-0.5 py-0.5 border font-bold align-top" style={{ borderColor: GRID, color: NAVY }}>
                            {block.role}
                          </td>
                          <td className="px-0.5 py-0.5 border align-top" style={{ borderColor: GRID, color: "#222" }}>
                            {block.name}
                          </td>
                          <td className="px-0.5 py-0.5 border align-top" style={{ borderColor: GRID, color: "#555" }}>
                            {block.org}
                          </td>
                          <td className="px-0.5 py-0.5 border text-center font-bold align-top" style={{ borderColor: GRID, color: BLUE }}>
                            {block.travel}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
