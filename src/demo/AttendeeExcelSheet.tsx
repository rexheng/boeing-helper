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
const LEGEND = "#D6DEE8"
const EMPTY = "#FAFBFC"
const FONT = "'IBM Plex Sans', Ubuntu, Arial, sans-serif"

type FlatBlock =
  | { kind: "sub"; title: string; count: number }
  | { kind: "row"; role: string; name: string; org: string; travel: string; zebra: boolean }

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
        zebra: idx % 2 === 1,
      })
    })
  }
  return blocks
}

function padBlocks(blocks: FlatBlock[], target: number): FlatBlock[] {
  if (blocks.length >= target) return blocks
  const padded = [...blocks]
  while (padded.length < target) {
    padded.push({ kind: "row", role: "", name: "", org: "", travel: "", zebra: false })
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
      style={{ border: `1px solid ${GRID}`, fontFamily: FONT, fontSize: 10, lineHeight: 1.2 }}
    >
      <table className="w-full border-collapse min-w-[1100px]" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {Array.from({ length: 16 }).map((_, i) => {
            const within = i % 4
            const pct = within === 0 ? 7 : within === 1 ? 8.5 : within === 2 ? 6.5 : 3
            return <col key={i} style={{ width: `${pct}%` }} />
          })}
        </colgroup>

        <thead>
          <tr>
            <th
              colSpan={16}
              className="text-left font-bold text-[12px] text-white px-2 py-1.5 border"
              style={{ background: NAVY, borderColor: GRID }}
            >
              Attendee List Template
              <span className="mx-3" style={{ color: "rgba(255,255,255,0.35)" }}>|</span>
              {title}
              <span className="mx-3" style={{ color: "rgba(255,255,255,0.35)" }}>|</span>
              Participant List
              <span className="ml-3 text-[10px] font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.7)" }}>
                {data.revisedLabel}
              </span>
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Band headers */}
          <tr>
            <td
              colSpan={12}
              className="px-1.5 py-1 border font-bold text-white text-[9px]"
              style={{ background: NAVY, borderColor: GRID }}
            >
              Top 5 Objectives · BD&amp;S Leads
            </td>
            <td
              colSpan={4}
              className="px-1.5 py-1 border font-bold text-white text-[9px]"
              style={{ background: BLUE, borderColor: GRID }}
            >
              Travel Key
            </td>
          </tr>

          {data.objectives.map((o, idx) => (
            <tr key={o.rank} style={{ background: idx % 2 ? ZEBRA : "#fff" }}>
              <td className="px-1 py-1 border font-bold text-center" style={{ borderColor: GRID, color: NAVY }}>
                {o.rank}
              </td>
              <td colSpan={8} className="px-1 py-1 border" style={{ borderColor: GRID, color: "#222" }}>
                {o.text}
              </td>
              <td colSpan={3} className="px-1 py-1 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                {o.bdsLead}
              </td>
              {idx === 0 && (
                <td rowSpan={5} colSpan={4} className="p-0 border align-top" style={{ borderColor: GRID }}>
                  {(
                    [
                      { code: "I", label: "International Travel Required", n: data.travelCounts.I },
                      { code: "D", label: "Domestic / Regional Travel Required", n: data.travelCounts.D },
                      { code: "L", label: "Local Attendee, No Travel", n: data.travelCounts.L },
                    ] as const
                  ).map((row, i) => (
                    <div
                      key={row.code}
                      className="grid grid-cols-[1.4rem_1fr_1.4rem] gap-1 px-1 py-1.5 text-[9.5px]"
                      style={{
                        background: i % 2 ? ZEBRA : "#fff",
                        borderBottom: i < 2 ? `1px solid ${GRID}` : undefined,
                        minHeight: 34,
                      }}
                    >
                      <span className="font-bold text-center" style={{ color: BLUE }}>{row.code}</span>
                      <span style={{ color: "#222" }}>{row.label}</span>
                      <span className="font-bold text-right" style={{ color: NAVY }}>{row.n}</span>
                    </div>
                  ))}
                </td>
              )}
            </tr>
          ))}

          {/* Four section headers */}
          <tr>
            {data.columns.map((col) => (
              <td
                key={col.id}
                colSpan={4}
                className="px-1 py-1 border font-bold uppercase text-white text-[9px]"
                style={{ background: accentColor(col.accent), borderColor: GRID }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span>{col.title}</span>
                  <span className="shrink-0 tabular-nums">({sectionCount(col)})</span>
                </div>
              </td>
            ))}
          </tr>

          {/* Legend */}
          <tr style={{ background: LEGEND }}>
            {data.columns.flatMap((col) =>
              ["Role", "Name", "Organization", "I/D/L"].map((h) => (
                <td
                  key={`${col.id}-${h}`}
                  className="px-0.5 py-0.5 border font-bold text-[9px]"
                  style={{ borderColor: GRID, color: NAVY }}
                >
                  {h}
                </td>
              )),
            )}
          </tr>

          {/* Flat body */}
          {columns[0].map((_, rowIdx) => (
            <tr key={`r-${rowIdx}`}>
              {columns.map((colBlocks, colIdx) => {
                const block = colBlocks[rowIdx]
                const section = data.columns[colIdx]
                if (block.kind === "sub") {
                  return (
                    <td
                      key={`${section.id}-s-${rowIdx}`}
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
                const filled = Boolean(block.role || block.name)
                const bg = filled ? (block.zebra ? ZEBRA : "#fff") : EMPTY
                return (
                  <FragmentRow
                    key={`${section.id}-r-${rowIdx}`}
                    role={block.role}
                    name={block.name}
                    org={block.org}
                    travel={block.travel}
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
  bg,
}: {
  role: string
  name: string
  org: string
  travel: string
  bg: string
}) {
  return (
    <>
      <td className="px-0.5 py-0.5 border font-bold align-top" style={{ borderColor: GRID, color: NAVY, background: bg }}>
        {role}
      </td>
      <td className="px-0.5 py-0.5 border align-top" style={{ borderColor: GRID, color: "#222", background: bg }}>
        {name}
      </td>
      <td className="px-0.5 py-0.5 border align-top" style={{ borderColor: GRID, color: "#555", background: bg }}>
        {org}
      </td>
      <td className="px-0.5 py-0.5 border text-center font-bold align-top" style={{ borderColor: GRID, color: BLUE, background: bg }}>
        {travel}
      </td>
    </>
  )
}
