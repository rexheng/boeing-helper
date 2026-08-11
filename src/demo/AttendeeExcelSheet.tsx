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
const GRID = "#9AA3AD"
const ZEBRA = "#EEF2F6"
const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif"

/**
 * Single continuous workbook lattice for the Attendee List Template.
 * Four equal role columns share one geometry from the title row down.
 */
export function AttendeeExcelSheet({
  data,
  eventLabel,
}: {
  data: AttendeeDashboardData
  eventLabel: string
}) {
  const title = (eventLabel || data.eventTitle).toUpperCase()

  return (
    <div
      className="w-full overflow-x-auto bg-white"
      style={{ border: `1px solid ${GRID}`, fontFamily: FONT, fontSize: 10, lineHeight: 1.2 }}
    >
      <table className="w-full border-collapse min-w-[1000px]" style={{ tableLayout: "fixed" }}>
        <colgroup>
          {[0, 1, 2, 3].map((i) => (
            <col key={i} style={{ width: "25%" }} />
          ))}
        </colgroup>

        <thead>
          <tr>
            <th
              colSpan={2}
              className="text-left font-bold text-[12px] text-white px-1.5 py-1 border"
              style={{ background: BLUE, borderColor: GRID }}
            >
              Attendee List Template
            </th>
            <th
              className="text-left font-bold text-[11px] text-white px-1.5 py-1 border"
              style={{ background: NAVY, borderColor: GRID }}
            >
              {title}
            </th>
            <th
              className="text-left font-bold text-[11px] text-white px-1.5 py-1 border"
              style={{ background: NAVY, borderColor: GRID }}
            >
              Participant List
            </th>
          </tr>
          <tr>
            <td
              colSpan={4}
              className="px-1.5 py-0.5 border font-bold text-[10px]"
              style={{ borderColor: GRID, color: "#C41E3A", background: "#FFF8F8" }}
            >
              {data.revisedLabel}
            </td>
          </tr>
        </thead>

        <tbody>
          {/* Objectives (cols 1–3) + Travel key (col 4) */}
          <tr>
            <td colSpan={3} className="p-0 border align-top" style={{ borderColor: GRID }}>
              <table className="w-full border-collapse" style={{ fontSize: 10 }}>
                <thead>
                  <tr style={{ background: NAVY, color: "#fff" }}>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID, width: "16%" }}>
                      #
                    </th>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID }}>
                      Top 5 Objectives
                    </th>
                    <th className="text-left font-bold px-1 py-0.5 border" style={{ borderColor: GRID, width: "22%" }}>
                      BD&amp;S Leads
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.objectives.map((o) => (
                    <tr key={o.rank} style={{ background: o.rank % 2 ? "#fff" : ZEBRA }}>
                      <td className="px-1 py-0.5 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                        Objective {o.rank}:
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
            <td className="p-0 border align-top" style={{ borderColor: GRID }}>
              <table className="w-full border-collapse" style={{ fontSize: 10 }}>
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
                </tbody>
              </table>
            </td>
          </tr>

          {/* Four section headers */}
          <tr>
            {data.columns.map((col) => (
              <td
                key={col.id}
                className="px-1 py-1 border font-bold uppercase text-white text-[9px] align-middle"
                style={{ background: accentColor(col.accent), borderColor: GRID, verticalAlign: "middle" }}
              >
                <div className="flex items-start justify-between gap-1">
                  <span>{col.title}</span>
                  <span className="shrink-0 tabular-nums">({sectionCount(col)})</span>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Role body: four columns as one table row of nested tables for continuous borders */}
      <div className="grid grid-cols-4 min-w-[1000px]" style={{ borderTop: `1px solid ${GRID}` }}>
        {data.columns.map((col, i) => (
          <RoleColumn key={col.id} section={col} isLast={i === data.columns.length - 1} />
        ))}
      </div>
    </div>
  )
}

function RoleColumn({ section, isLast }: { section: AttendeeSection; isLast: boolean }) {
  const subBg = subHeaderColor(section.accent)

  return (
    <div style={{ borderRight: isLast ? "none" : `1px solid ${GRID}` }}>
      {section.subsections.map((sub) => (
        <div key={sub.id}>
          <div
            className="px-1 py-0.5 flex items-center justify-between text-[9px] font-bold text-white"
            style={{ background: subBg }}
          >
            <span>{sub.title}</span>
            <span className="tabular-nums">({subsectionCount(sub)})</span>
          </div>
          <table className="w-full border-collapse" style={{ fontSize: 9.5, tableLayout: "fixed" }}>
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "42%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "12%" }} />
            </colgroup>
            <tbody>
              {sub.rows.map((row, idx) => {
                const nameOnly = row.name || ""
                const orgOnly = row.organization || ""
                return (
                  <tr key={row.id} style={{ background: idx % 2 ? ZEBRA : "#fff", height: 17 }}>
                    <td className="px-0.5 py-0 border font-bold align-middle truncate" style={{ borderColor: GRID, color: NAVY }}>
                      {row.roleLabel}
                    </td>
                    <td className="px-0.5 py-0 border align-middle truncate" style={{ borderColor: GRID, color: "#222" }} title={nameOnly}>
                      {nameOnly}
                    </td>
                    <td className="px-0.5 py-0 border align-middle truncate" style={{ borderColor: GRID, color: "#555" }} title={orgOnly}>
                      {orgOnly}
                    </td>
                    <td className="px-0.5 py-0 border text-center font-bold align-middle" style={{ borderColor: GRID, color: BLUE }}>
                      {row.travel || ""}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
