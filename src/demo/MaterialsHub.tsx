import { useMemo, useState } from "react"
import { Download, LayoutGrid, List, Minus, Plus } from "lucide-react"
import { Button } from "../components/Button"
import { ChangelogDrawer } from "../components/review/ChangelogDrawer"
import { ReviewPanel } from "../components/review/ReviewPanel"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import {
  addAttendeeRow,
  buildAttendeeDashboard,
  flattenAttendees,
  removeAttendeeRow,
  updateAttendeeRow,
  type AttendeeDashboardData,
  type TravelCode,
} from "../data/attendeeDashboard"
import { useDocumentReview } from "../hooks/useDocumentReview"
import { applyAttendeeHunks } from "../utils/applyReviewHunks"
import { changelogScope } from "../utils/changelogStorage"
import { AttendeeExcelSheet } from "./AttendeeExcelSheet"

interface MaterialsHubProps {
  company: Company
  person: Person
  meetingType: string
  countryName?: string
  onContinue: () => void
}

type Tab = "invite" | "attendee"
type AttendeeView = "excel" | "list"
type InviteClose = "meeting" | "special" | "contact"

const BLUE = "#0033A1"
const NAVY = "#0A2240"
const GRID = "#9AA3AD"
const ZEBRA = "#EEF2F6"
const FONT = "Arial, 'Helvetica Neue', Helvetica, sans-serif"

const ZOOM_MIN = 0.75
const ZOOM_MAX = 1.5
const ZOOM_STEP = 0.1

export function MaterialsHub({
  company,
  person,
  meetingType,
  countryName,
  onContinue,
}: MaterialsHubProps) {
  const [tab, setTab] = useState<Tab>("invite")
  const [attendeeView, setAttendeeView] = useState<AttendeeView>("excel")
  const [close, setClose] = useState<InviteClose>("meeting")
  const defaultEvent = /mspo/i.test(meetingType)
    ? "MSPO 2026"
    : countryName
      ? "Singapore Airshow 2026"
      : meetingType
  const [eventName, setEventName] = useState(defaultEvent)
  const [showcase, setShowcase] = useState("P-8A pathway and rotorcraft sustainment support")
  const [senderName, setSenderName] = useState("Rex Heng")
  const senderTitle = "Regional Integrator, International Business Development"
  const [contactEmail, setContactEmail] = useState("rex.heng@boeing.example")
  const [zoom, setZoom] = useState(1.15)
  const [showLlm, setShowLlm] = useState(false)

  const [dashboard, setDashboard] = useState<AttendeeDashboardData>(() =>
    buildAttendeeDashboard(company, person, meetingType, countryName),
  )

  const reviewScope = changelogScope({
    companyId: company.id,
    personId: person.id,
    meetingType,
    target: "attendees",
  })
  const { entries, changelogOpen, setChangelogOpen, recordAccept } = useDocumentReview(reviewScope)

  const surname = person.name.split(" ").slice(-1)[0]
  const salutation = person.title.toLowerCase().includes("minister")
    ? `Minister ${surname}`
    : person.name.split(" ")[0]

  const closing = useMemo(() => {
    if (close === "special") {
      return `We would be delighted if you could join our senior leadership reception. To reserve your place or for questions, please email ${senderName} (${contactEmail}) and we will arrange details.`
    }
    if (close === "contact") {
      return `If easier, simply contact ${senderName} (${contactEmail}) and we will coordinate a suitable time or provide additional information.`
    }
    return `We would be pleased to meet at a time convenient for you. Please reach out to ${senderName} (${contactEmail}) and we will arrange details.`
  }, [close, senderName, contactEmail])

  const handleExcelDownload = async () => {
    const { downloadAttendeeDashboardExcel } = await import("../utils/attendeeExcelExport")
    const name = eventName || dashboard.eventName
    downloadAttendeeDashboardExcel({
      ...dashboard,
      eventName: name,
      eventTitle: name.toUpperCase(),
    })
  }

  const bumpZoom = (dir: 1 | -1) => {
    setZoom((z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round((z + dir * ZOOM_STEP) * 100) / 100)))
  }

  const onManualChange = (next: AttendeeDashboardData) => {
    setDashboard(next)
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="text-center mb-2">
        <p className="system-badge system-badge--dark mb-3">Step 06 · Materials</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Invitation and attendee dashboard
        </h2>
        <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Letter for the counterpart, plus a role-and-objectives dashboard for the show cycle.
        </p>
      </div>

      <div
        className="flex gap-1.5 p-1.5 mx-auto max-w-md"
        style={{ background: "var(--bg-muted)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}
        role="tablist"
      >
        {(
          [
            { id: "invite" as const, label: "Invitation" },
            { id: "attendee" as const, label: "Attendee dashboard" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 cursor-pointer rounded-sm px-4 py-2.5 font-ui text-sm font-medium"
            style={{
              background: tab === t.id ? BLUE : "#fff",
              color: tab === t.id ? "#fff" : "var(--text-secondary)",
              border: tab === t.id ? `1px solid ${BLUE}` : "1px solid var(--border-hover)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "invite" && (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              <span className="block mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Event</span>
              <input value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full px-3 py-2 text-sm" style={{ border: "1px solid var(--surface-border)", color: NAVY }} />
            </label>
            <label className="text-sm">
              <span className="block mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Showcase</span>
              <input value={showcase} onChange={(e) => setShowcase(e.target.value)} className="w-full px-3 py-2 text-sm" style={{ border: "1px solid var(--surface-border)", color: NAVY }} />
            </label>
            <label className="text-sm">
              <span className="block mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Sender</span>
              <input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="w-full px-3 py-2 text-sm" style={{ border: "1px solid var(--surface-border)", color: NAVY }} />
            </label>
            <label className="text-sm">
              <span className="block mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Contact email</span>
              <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full px-3 py-2 text-sm" style={{ border: "1px solid var(--surface-border)", color: NAVY }} />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: "meeting" as const, label: "Meeting only" },
                { id: "special" as const, label: "Special event" },
                { id: "contact" as const, label: "Contact-first" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setClose(opt.id)}
                className="cursor-pointer px-3 py-1.5 text-xs font-medium"
                style={{
                  background: close === opt.id ? "var(--boeing-ice)" : "#fff",
                  color: close === opt.id ? BLUE : "var(--text-secondary)",
                  border: `1px solid ${close === opt.id ? BLUE : "var(--surface-border)"}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <article className="bg-white p-6 sm:p-8 space-y-5 text-[15px] leading-relaxed" style={{ border: "1px solid var(--surface-border)", color: "var(--text-secondary)" }}>
            <div className="flex justify-between gap-6 items-start">
              <div className="text-sm space-y-0.5" style={{ color: NAVY }}>
                <p>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p>{person.name}</p>
                <p>{person.title}</p>
                <p>{company.name}</p>
                <p>{countryName || "Location"}</p>
              </div>
              <div className="px-5 py-3 text-white text-sm font-semibold text-center shrink-0" style={{ background: BLUE, minWidth: "9rem" }}>
                Invitation Template
              </div>
            </div>
            <p>Dear {salutation},</p>
            <p>
              On behalf of The Boeing Company, I write to invite you to meet with us during{" "}
              <strong style={{ color: NAVY }}>{eventName}</strong>
              {countryName ? `, taking place in ${countryName}` : ""}.
            </p>
            <p>
              At {eventName}, we look forward to showcasing <strong style={{ color: NAVY }}>{showcase}</strong> and discussing how it supports your priorities.
            </p>
            <p>{closing}</p>
            <div className="pt-4">
              <p>Sincerely,</p>
              <p className="mt-4 font-medium" style={{ color: NAVY }}>{senderName}</p>
              <p>{senderTitle}</p>
              <p>The Boeing Company</p>
            </div>
          </article>
        </div>
      )}

      {tab === "attendee" && (
        <div className="space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="inline-flex" style={{ border: `1px solid ${GRID}` }} role="tablist" aria-label="Dashboard display">
              {(
                [
                  { id: "excel" as const, label: "Excel format", icon: LayoutGrid },
                  { id: "list" as const, label: "List format", icon: List },
                ] as const
              ).map((v, i) => {
                const Icon = v.icon
                const active = attendeeView === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setAttendeeView(v.id)}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold"
                    style={{
                      background: active ? NAVY : "#fff",
                      color: active ? "#fff" : NAVY,
                      borderLeft: i === 0 ? "none" : `1px solid ${GRID}`,
                    }}
                  >
                    <Icon size={12} />
                    {v.label}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center" style={{ border: `1px solid ${GRID}` }}>
                <button
                  type="button"
                  aria-label="Zoom out"
                  onClick={() => bumpZoom(-1)}
                  className="cursor-pointer px-2 py-1.5"
                  style={{ color: NAVY }}
                >
                  <Minus size={12} />
                </button>
                <span className="px-2 text-[11px] font-semibold tabular-nums" style={{ color: NAVY, borderLeft: `1px solid ${GRID}`, borderRight: `1px solid ${GRID}` }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  aria-label="Zoom in"
                  onClick={() => bumpZoom(1)}
                  className="cursor-pointer px-2 py-1.5"
                  style={{ color: NAVY }}
                >
                  <Plus size={12} />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowLlm((s) => !s)}
                className="cursor-pointer px-3 py-1.5 text-[11px] font-semibold"
                style={{
                  background: showLlm ? "var(--boeing-ice)" : "#fff",
                  color: BLUE,
                  border: `1px solid ${BLUE}`,
                }}
              >
                Update from email / notes
              </button>

              <ChangelogDrawer
                entries={entries}
                open={changelogOpen}
                onOpen={() => setChangelogOpen(true)}
                onClose={() => setChangelogOpen(false)}
              />

              <button
                type="button"
                onClick={handleExcelDownload}
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white"
                style={{ background: BLUE }}
              >
                <Download size={13} />
                Download Excel
              </button>
            </div>
          </div>

          {showLlm && (
            <ReviewPanel
              target="attendees"
              currentDocument={dashboard}
              context={{
                companyName: company.name,
                personName: person.name,
                personTitle: person.title,
                meetingType,
                eventName,
                countryName,
              }}
              onAccept={({ proposedDocument, hunks, allHunkCount, debrief, summary }) => {
                const next = applyAttendeeHunks(
                  dashboard,
                  proposedDocument as AttendeeDashboardData,
                  hunks,
                  allHunkCount,
                )
                setDashboard(next)
                recordAccept({
                  source: "llm",
                  target: "attendees",
                  summary,
                  hunks,
                  debriefSnapshot: debrief,
                })
                setShowLlm(false)
              }}
            />
          )}

          {attendeeView === "excel" ? (
            <AttendeeExcelSheet
              data={dashboard}
              eventLabel={eventName}
              zoom={zoom}
              onChange={(next) => onManualChange(next)}
            />
          ) : (
            <ListDashboard
              data={dashboard}
              eventLabel={eventName}
              zoom={zoom}
              onChange={(next) => onManualChange(next)}
            />
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue to report</Button>
      </div>
    </div>
  )
}

function ListDashboard({
  data,
  eventLabel,
  zoom = 1,
  onChange,
}: {
  data: AttendeeDashboardData
  eventLabel: string
  zoom?: number
  onChange?: (next: AttendeeDashboardData) => void
}) {
  const [showEmpty, setShowEmpty] = useState(true)
  const rows = flattenAttendees(data, { filledOnly: !showEmpty })
  const editable = Boolean(onChange)

  return (
    <div
      className="bg-white origin-top-left"
      style={{ border: `1px solid ${GRID}`, fontFamily: FONT, fontSize: 10, zoom }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th colSpan={2} className="text-left font-bold text-[11px] text-white px-1.5 py-1 border" style={{ background: BLUE, borderColor: GRID }}>
              Attendee List Template
            </th>
            <th colSpan={2} className="text-left font-bold text-[11px] text-white px-1.5 py-1 border" style={{ background: NAVY, borderColor: GRID }}>
              {(eventLabel || data.eventName).toUpperCase()}
            </th>
            <th colSpan={1} className="text-left font-bold text-[11px] text-white px-1.5 py-1 border" style={{ background: NAVY, borderColor: GRID }}>
              Participant List
            </th>
            <th colSpan={1} className="text-right font-bold text-[10px] px-1.5 py-1 border" style={{ background: NAVY, borderColor: GRID, color: "#F8D7DA" }}>
              {data.revisedLabel}
            </th>
          </tr>
        </thead>
      </table>

      <div className="px-2 py-1.5 flex justify-between gap-2" style={{ borderBottom: `1px solid ${GRID}` }}>
        <label className="inline-flex items-center gap-2 text-[10px] font-semibold cursor-pointer" style={{ color: NAVY }}>
          <input type="checkbox" checked={showEmpty} onChange={(e) => setShowEmpty(e.target.checked)} />
          Show empty role slots
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr]">
        <table className="w-full border-collapse" style={{ fontSize: 10.5 }}>
          <thead>
            <tr style={{ background: NAVY, color: "#fff" }}>
              <th className="text-left font-bold px-1.5 py-1 border" style={{ borderColor: GRID, width: "16%" }}>#</th>
              <th className="text-left font-bold px-1.5 py-1 border" style={{ borderColor: GRID }}>Top 5 Objectives</th>
              <th className="text-left font-bold px-1.5 py-1 border" style={{ borderColor: GRID, width: "22%" }}>BD&amp;S Leads</th>
            </tr>
          </thead>
          <tbody>
            {data.objectives.map((o) => (
              <tr key={o.rank} style={{ background: o.rank % 2 ? "#fff" : ZEBRA }}>
                <td className="px-1.5 py-1 border font-bold" style={{ borderColor: GRID, color: NAVY }}>Objective {o.rank}:</td>
                <td className="px-1.5 py-1 border" style={{ borderColor: GRID, color: "#222" }}>
                  {editable ? (
                    <input
                      className="w-full bg-transparent outline-none"
                      value={o.text}
                      onChange={(e) => {
                        const objectives = data.objectives.map((obj) =>
                          obj.rank === o.rank ? { ...obj, text: e.target.value } : obj,
                        )
                        onChange?.({ ...data, objectives })
                      }}
                    />
                  ) : o.text}
                </td>
                <td className="px-1.5 py-1 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                  {editable ? (
                    <input
                      className="w-full bg-transparent outline-none font-bold"
                      value={o.bdsLead}
                      onChange={(e) => {
                        const objectives = data.objectives.map((obj) =>
                          obj.rank === o.rank ? { ...obj, bdsLead: e.target.value } : obj,
                        )
                        onChange?.({ ...data, objectives })
                      }}
                    />
                  ) : o.bdsLead}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <table className="w-full border-collapse" style={{ fontSize: 10.5 }}>
          <thead>
            <tr style={{ background: BLUE, color: "#fff" }}>
              <th className="text-left font-bold px-1.5 py-1 border" style={{ borderColor: GRID }}>Key</th>
              <th className="text-left font-bold px-1.5 py-1 border" style={{ borderColor: GRID }}>Travel</th>
              <th className="text-right font-bold px-1.5 py-1 border" style={{ borderColor: GRID }}>#</th>
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
                <td className="px-1.5 py-1 border font-bold text-center" style={{ borderColor: GRID, color: BLUE }}>{row.code}</td>
                <td className="px-1.5 py-1 border" style={{ borderColor: GRID, color: "#222" }}>{row.label}</td>
                <td className="px-1.5 py-1 border text-right font-bold" style={{ borderColor: GRID, color: NAVY }}>{row.n}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[720px]" style={{ fontSize: 10.5 }}>
          <thead>
            <tr>
              {["Section", "Subsection", "Role", "Name", "Organization", "I/D/L", "Seats", "Notes", ""].map((h) => (
                <th
                  key={h || "actions"}
                  className="text-left font-bold px-1.5 py-1 border text-white"
                  style={{ background: NAVY, borderColor: GRID }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.rowId} style={{ background: i % 2 ? ZEBRA : "#fff" }}>
                <td className="px-1.5 py-1 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                  {r.section.startsWith("BDS") ? "BDS"
                    : r.section.startsWith("BGS") ? "BGS"
                      : r.section.startsWith("Boeing Global") ? "Boeing Global"
                        : "Exhibit Ops"}
                </td>
                <td className="px-1.5 py-1 border" style={{ borderColor: GRID, color: "#444" }}>{r.subsection}</td>
                <td className="px-1.5 py-1 border font-bold" style={{ borderColor: GRID, color: NAVY }}>
                  {editable ? (
                    <input
                      className="w-full bg-transparent outline-none font-bold"
                      value={r.role}
                      onChange={(e) => onChange?.(updateAttendeeRow(data, r.sectionId, r.subsectionId, r.rowId, { roleLabel: e.target.value }))}
                    />
                  ) : r.role}
                </td>
                <td className="px-1.5 py-1 border" style={{ borderColor: GRID, color: "#222" }}>
                  {editable ? (
                    <input
                      className="w-full bg-transparent outline-none"
                      value={r.name}
                      onChange={(e) => {
                        const name = e.target.value
                        onChange?.(updateAttendeeRow(data, r.sectionId, r.subsectionId, r.rowId, {
                          name,
                          count: name.trim() ? Math.max(r.count, 1) : r.count,
                        }))
                      }}
                    />
                  ) : r.name}
                </td>
                <td className="px-1.5 py-1 border" style={{ borderColor: GRID, color: "#555" }}>
                  {editable ? (
                    <input
                      className="w-full bg-transparent outline-none"
                      value={r.organization}
                      onChange={(e) => onChange?.(updateAttendeeRow(data, r.sectionId, r.subsectionId, r.rowId, { organization: e.target.value }))}
                    />
                  ) : r.organization}
                </td>
                <td className="px-1.5 py-1 border text-center font-bold" style={{ borderColor: GRID, color: BLUE }}>
                  {editable ? (
                    <select
                      value={r.travel}
                      className="bg-transparent outline-none font-bold text-center w-full"
                      style={{ color: BLUE }}
                      onChange={(e) => {
                        const travel = e.target.value as TravelCode | ""
                        onChange?.(updateAttendeeRow(data, r.sectionId, r.subsectionId, r.rowId, {
                          travel,
                          count: travel ? Math.max(r.count, 1) : r.count,
                        }))
                      }}
                    >
                      <option value="">—</option>
                      <option value="I">I</option>
                      <option value="D">D</option>
                      <option value="L">L</option>
                    </select>
                  ) : r.travel}
                </td>
                <td className="px-1.5 py-1 border text-center font-bold tabular-nums" style={{ borderColor: GRID, color: NAVY }}>
                  {editable ? (
                    <input
                      type="number"
                      min={0}
                      className="w-12 bg-transparent outline-none text-center font-bold"
                      value={r.count || 0}
                      onChange={(e) => onChange?.(updateAttendeeRow(data, r.sectionId, r.subsectionId, r.rowId, { count: Number(e.target.value) || 0 }))}
                    />
                  ) : (r.count || "")}
                </td>
                <td className="px-1.5 py-1 border" style={{ borderColor: GRID, color: "#555" }}>
                  {editable ? (
                    <input
                      className="w-full bg-transparent outline-none"
                      value={r.notes}
                      onChange={(e) => onChange?.(updateAttendeeRow(data, r.sectionId, r.subsectionId, r.rowId, { notes: e.target.value }))}
                    />
                  ) : r.notes}
                </td>
                <td className="px-1 py-1 border text-center" style={{ borderColor: GRID }}>
                  {editable && (
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        title="Add row in subsection"
                        className="cursor-pointer text-[10px] font-bold px-1"
                        style={{ color: BLUE }}
                        onClick={() => onChange?.(addAttendeeRow(data, r.sectionId, r.subsectionId))}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        title="Remove row"
                        className="cursor-pointer text-[10px] font-bold px-1"
                        style={{ color: "#8B1E2D" }}
                        onClick={() => onChange?.(removeAttendeeRow(data, r.sectionId, r.subsectionId, r.rowId))}
                      >
                        ×
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
