import { useEffect, useMemo, useRef } from "react"
import type { MouseEvent as ReactMouseEvent } from "react"
import { CellInput, cellInput } from "../components/CellInput"
import {
  accentColor,
  sectionCount,
  subHeaderColor,
  subsectionCount,
  updateAttendeeRow,
  type AttendeeDashboardData,
  type AttendeeSection,
  type TravelCode,
} from "../data/attendeeDashboard"

const BLUE = "#0033A1"
const NAVY = "#0A2240"
const GRID = "#7A8490"
const ZEBRA = "#EEF2F6"
const LEGEND = "#D6DEE8"
const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif"

type FlatBlock =
  | { kind: "sub"; subsectionId: string; title: string; count: number }
  | {
      kind: "row"
      subsectionId: string
      rowId: string
      role: string
      name: string
      org: string
      travel: TravelCode | ""
      seats: number
      zebra: boolean
    }

function flattenSection(section: AttendeeSection): FlatBlock[] {
  const blocks: FlatBlock[] = []
  for (const sub of section.subsections) {
    blocks.push({ kind: "sub", subsectionId: sub.id, title: sub.title, count: subsectionCount(sub) })
    sub.rows.forEach((row, idx) => {
      blocks.push({
        kind: "row",
        subsectionId: sub.id,
        rowId: row.id,
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

/** Fuzzy-match a highlight path like "Section / Subsection / Role" to a sheet block. */
function pathMatchesBlock(
  path: string,
  sectionTitle: string,
  block: FlatBlock,
  subsectionTitle: string,
): boolean {
  const p = path.trim()
  if (!p) return false

  const parts = p.split(" / ").map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return false

  const sectionHit = parts.some(
    (part) => part === sectionTitle || sectionTitle.includes(part) || part.includes(sectionTitle.slice(0, 12)),
  )
  const subHit = parts.some(
    (part) => part === subsectionTitle || subsectionTitle.includes(part) || part.includes(subsectionTitle),
  )

  if (block.kind === "sub") {
    return sectionHit && subHit
  }

  // Prefer strict section + subsection + role
  if (sectionHit && subHit) {
    const roleHint = parts[2]
    if (!roleHint) return true
    return (
      block.role === roleHint ||
      block.role.includes(roleHint) ||
      roleHint.includes(block.role) ||
      (!!block.name && (p.includes(block.name) || roleHint.includes(block.name)))
    )
  }

  // Name-only fallback when path embeds the person (after update)
  if (block.name && block.name.length > 2 && p.includes(block.name)) return true
  return false
}

function blockIsHighlighted(
  paths: string[] | undefined,
  sectionTitle: string,
  block: FlatBlock,
  subsectionTitle: string,
): boolean {
  if (!paths?.length) return false
  return paths.some((path) => pathMatchesBlock(path, sectionTitle, block, subsectionTitle))
}

export function AttendeeExcelSheet({
  data,
  eventLabel,
  onChange,
  zoom = 1,
  highlightPaths,
}: {
  data: AttendeeDashboardData
  eventLabel: string
  onChange?: (next: AttendeeDashboardData) => void
  zoom?: number
  highlightPaths?: string[]
}) {
  const editable = Boolean(onChange)
  const sheetRef = useRef<HTMLDivElement>(null)
  const title = (eventLabel || data.eventTitle).toUpperCase()
  const columns = useMemo(() => data.columns.map(flattenSection), [data.columns])
  const maxRows = Math.max(...columns.map((c) => c.length), 0)

  useEffect(() => {
    if (!highlightPaths?.length) return
    const root = sheetRef.current
    if (!root) return
    const first =
      root.querySelector<HTMLElement>(".sheet-row-highlight[data-row-id]") ||
      root.querySelector<HTMLElement>(".sheet-row-highlight")
    first?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
  }, [highlightPaths])

  const travelRows = [
    { code: "I", label: "International Travel Required", n: data.travelCounts.I },
    { code: "D", label: "Domestic / Regional Travel Required", n: data.travelCounts.D },
    { code: "L", label: "Local Attendee, No Travel", n: data.travelCounts.L },
    { code: "", label: "Total assigned seats", n: data.travelCounts.I + data.travelCounts.D + data.travelCounts.L },
    { code: "", label: "", n: "" as const },
  ]

  const colWidths = Array.from({ length: 16 }, (_, i) => {
    const w = i % 4
    return w === 0 ? "7%" : w === 1 ? "9%" : w === 2 ? "6.5%" : "2.5%"
  })

  const patchRow = (
    sectionId: string,
    subsectionId: string,
    rowId: string,
    patch: Parameters<typeof updateAttendeeRow>[4],
  ) => {
    if (!onChange) return
    onChange(updateAttendeeRow(data, sectionId, subsectionId, rowId, patch))
  }

  return (
    <div
      ref={sheetRef}
      className={`w-full overflow-x-auto bg-white origin-top-left${highlightPaths?.length ? " sheet-is-reviewing" : ""}`}
      style={{
        border: `1px solid ${GRID}`,
        fontFamily: FONT,
        fontSize: 9.5,
        lineHeight: 1.15,
        zoom,
      }}
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
                <td colSpan={7} className="px-1 py-0 border" style={{ borderColor: GRID, color: "#222" }}>
                  {editable ? (
                    <CellInput
                      value={o.text}
                      onCommit={(text) => {
                        const objectives = data.objectives.map((obj) =>
                          obj.rank === o.rank ? { ...obj, text } : obj,
                        )
                        onChange?.({ ...data, objectives })
                      }}
                      aria-label={`Objective ${o.rank}`}
                    />
                  ) : (
                    o.text
                  )}
                </td>
                <td colSpan={4} className="px-1 py-0 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                  {editable ? (
                    <CellInput
                      value={o.bdsLead}
                      onCommit={(bdsLead) => {
                        const objectives = data.objectives.map((obj) =>
                          obj.rank === o.rank ? { ...obj, bdsLead } : obj,
                        )
                        onChange?.({ ...data, objectives })
                      }}
                      style={{ fontWeight: 700 }}
                      aria-label={`BD&S lead ${o.rank}`}
                    />
                  ) : (
                    o.bdsLead
                  )}
                </td>
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
                    <EmptyCells key={`${section.id}-empty-${rowIdx}`} bg="#fff" />
                  )
                }
                const subsectionTitle =
                  block.kind === "sub"
                    ? block.title
                    : section.subsections.find((s) => s.id === block.subsectionId)?.title || ""
                if (block.kind === "sub") {
                  return (
                    <td
                      key={`${section.id}-s-${block.subsectionId}-${rowIdx}`}
                      colSpan={4}
                      className="px-1 py-0 border font-bold text-white text-[8.5px]"
                      style={{ background: subHeaderColor(section.accent), borderColor: GRID }}
                      data-subsection-id={block.subsectionId}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span>{block.title}</span>
                        <span className="tabular-nums">({block.count})</span>
                      </div>
                    </td>
                  )
                }
                const highlighted = blockIsHighlighted(
                  highlightPaths,
                  section.title,
                  block,
                  subsectionTitle,
                )
                const bg = block.zebra ? ZEBRA : "#fff"
                return (
                  <EditableRow
                    key={`${section.id}-${block.rowId}`}
                    role={block.role}
                    name={block.name}
                    org={block.org}
                    travel={block.travel}
                    seats={block.seats}
                    bg={bg}
                    editable={editable}
                    highlight={highlighted}
                    subsectionId={block.subsectionId}
                    rowId={block.rowId}
                    onPatch={(patch) => patchRow(section.id, block.subsectionId, block.rowId, patch)}
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

function EmptyCells({ bg }: { bg: string }) {
  return (
    <>
      <td className="px-0.5 py-0 border" style={{ borderColor: GRID, background: bg }} />
      <td className="px-0.5 py-0 border" style={{ borderColor: GRID, background: bg }} />
      <td className="px-0.5 py-0 border" style={{ borderColor: GRID, background: bg }} />
      <td className="px-0.5 py-0 border" style={{ borderColor: GRID, background: bg }} />
    </>
  )
}

function EditableRow({
  role,
  name,
  org,
  travel,
  seats,
  bg,
  editable,
  highlight,
  subsectionId,
  rowId,
  onPatch,
}: {
  role: string
  name: string
  org: string
  travel: TravelCode | ""
  seats: number
  bg: string
  editable: boolean
  highlight?: boolean
  subsectionId: string
  rowId: string
  onPatch: (patch: { roleLabel?: string; name?: string; organization?: string; travel?: TravelCode | ""; count?: number }) => void
}) {
  const travelDisplay =
    travel && seats > 1 ? `${travel}·${seats}` : travel
  const hl = highlight ? " sheet-row-highlight" : " sheet-row-dim"
  // Omit inline bg when highlighted so sheetPulse can paint the cells
  const cellBg = highlight ? undefined : bg
  const idAttrs = { "data-subsection-id": subsectionId, "data-row-id": rowId }

  const focusCell = (e: ReactMouseEvent<HTMLTableCellElement>) => {
    const input = e.currentTarget.querySelector("input, select") as HTMLElement | null
    input?.focus()
  }

  if (!editable) {
    return (
      <>
        <td className={`px-0.5 py-0 border font-bold align-top${hl}`} style={{ borderColor: GRID, color: NAVY, background: cellBg }} {...idAttrs}>{role}</td>
        <td className={`px-0.5 py-0 border align-top${hl}`} style={{ borderColor: GRID, color: "#222", background: cellBg }} title={seats > 1 ? `${seats} seats` : undefined}>{name}</td>
        <td className={`px-0.5 py-0 border align-top${hl}`} style={{ borderColor: GRID, color: "#555", background: cellBg }}>{org}</td>
        <td className={`px-0.5 py-0 border text-center font-bold align-top${hl}`} style={{ borderColor: GRID, color: BLUE, background: cellBg }}>{travelDisplay}</td>
      </>
    )
  }

  return (
    <>
      <td
        className={`px-0.5 py-0 border font-bold align-top${hl}`}
        style={{ borderColor: GRID, color: NAVY, background: cellBg, cursor: "text" }}
        onClick={focusCell}
        {...idAttrs}
      >
        <CellInput
          value={role}
          onCommit={(v) => onPatch({ roleLabel: v })}
          style={{ fontWeight: 700 }}
          aria-label="Role"
        />
      </td>
      <td
        className={`px-0.5 py-0 border align-top${hl}`}
        style={{ borderColor: GRID, color: "#222", background: cellBg, cursor: "text" }}
        title={seats > 1 ? `${seats} seats` : undefined}
        onClick={focusCell}
      >
        <CellInput
          value={name}
          onCommit={(nextName) => onPatch({ name: nextName, count: nextName.trim() ? Math.max(seats, 1) : seats })}
          aria-label="Name"
        />
      </td>
      <td
        className={`px-0.5 py-0 border align-top${hl}`}
        style={{ borderColor: GRID, color: "#555", background: cellBg, cursor: "text" }}
        onClick={focusCell}
      >
        <CellInput value={org} onCommit={(v) => onPatch({ organization: v })} aria-label="Organization" />
      </td>
      <td
        className={`px-0.5 py-0 border text-center font-bold align-top${hl}`}
        style={{ borderColor: GRID, color: BLUE, background: cellBg, cursor: "pointer" }}
        title={seats > 1 ? `${seats} seats` : undefined}
        onClick={focusCell}
      >
        <select
          value={travel}
          onChange={(e) => {
            const v = e.target.value as TravelCode | ""
            onPatch({ travel: v, count: v ? Math.max(seats, 1) : seats })
          }}
          style={{
            ...cellInput,
            textAlign: "center",
            fontWeight: 700,
            color: BLUE,
            cursor: "pointer",
            appearance: "none",
            WebkitAppearance: "none",
            MozAppearance: "none",
          }}
          aria-label="Travel code"
        >
          <option value=""></option>
          <option value="I">{seats > 1 ? `I·${seats}` : "I"}</option>
          <option value="D">{seats > 1 ? `D·${seats}` : "D"}</option>
          <option value="L">{seats > 1 ? `L·${seats}` : "L"}</option>
        </select>
      </td>
    </>
  )
}
