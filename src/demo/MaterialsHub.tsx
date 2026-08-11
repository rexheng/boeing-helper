import { useMemo, useState } from "react"
import { Download, LayoutGrid, List } from "lucide-react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import {
  accentColor,
  buildAttendeeDashboard,
  flattenAttendees,
  sectionCount,
  subHeaderColor,
  subsectionCount,
  type AttendeeDashboardData,
  type AttendeeSection,
} from "../data/attendeeDashboard"

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
const GRID = "#C5CDD4"
const CELL = "#F7F9FC"

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
      ? `Singapore Airshow engagement`
      : meetingType
  const [eventName, setEventName] = useState(defaultEvent)
  const [showcase, setShowcase] = useState("P-8A pathway and rotorcraft sustainment support")
  const [senderName, setSenderName] = useState("Rex Heng")
  const [senderTitle] = useState("Regional Integrator, International Business Development")
  const [contactEmail, setContactEmail] = useState("rex.heng@boeing.example")

  const dashboard = useMemo(
    () => buildAttendeeDashboard(company, person, meetingType, countryName),
    [company, person, meetingType, countryName],
  )

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
    downloadAttendeeDashboardExcel({ ...dashboard, eventName: eventName || dashboard.eventName })
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
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div
              className="inline-flex gap-1 p-1"
              style={{ background: "var(--bg-muted)", border: "1px solid var(--surface-border)", borderRadius: "var(--radius-sm)" }}
              role="tablist"
              aria-label="Dashboard display"
            >
              {(
                [
                  { id: "excel" as const, label: "Excel format", icon: LayoutGrid },
                  { id: "list" as const, label: "List format", icon: List },
                ] as const
              ).map((v) => {
                const Icon = v.icon
                const active = attendeeView === v.id
                return (
                  <button
                    key={v.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setAttendeeView(v.id)}
                    className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold"
                    style={{
                      background: active ? "#fff" : "transparent",
                      color: active ? NAVY : "var(--text-secondary)",
                      border: active ? `1px solid ${GRID}` : "1px solid transparent",
                      borderRadius: 4,
                      boxShadow: active ? "0 1px 2px rgba(10,34,64,0.06)" : undefined,
                    }}
                  >
                    <Icon size={13} />
                    {v.label}
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={handleExcelDownload}
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
              style={{ background: BLUE, borderRadius: 4 }}
            >
              <Download size={14} />
              Download Excel
            </button>
          </div>

          {attendeeView === "excel" ? (
            <ExcelDashboard data={dashboard} eventLabel={eventName} />
          ) : (
            <ListDashboard data={dashboard} eventLabel={eventName} />
          )}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue to report</Button>
      </div>
    </div>
  )
}

function ExcelDashboard({ data, eventLabel }: { data: AttendeeDashboardData; eventLabel: string }) {
  return (
    <div
      className="bg-white overflow-x-auto"
      style={{
        border: `1px solid ${GRID}`,
        boxShadow: "0 8px 28px rgba(10,34,64,0.08)",
        fontFamily: "IBM Plex Sans, Ubuntu, Arial, sans-serif",
      }}
    >
      {/* Title strip */}
      <div className="grid grid-cols-[1.4fr_1fr_1fr] min-w-[920px]">
        <div
          className="px-4 py-2.5 text-white font-semibold text-[15px] tracking-wide"
          style={{ background: BLUE }}
        >
          Attendee List Template
        </div>
        <div
          className="px-4 py-2.5 font-semibold text-[13px] flex items-center"
          style={{ color: NAVY, borderBottom: `1px solid ${GRID}`, borderLeft: `1px solid ${GRID}` }}
        >
          {eventLabel || data.eventTitle}
        </div>
        <div
          className="px-4 py-2.5 font-semibold text-[13px] flex items-center"
          style={{ color: NAVY, borderBottom: `1px solid ${GRID}`, borderLeft: `1px solid ${GRID}` }}
        >
          Participant List
        </div>
      </div>

      <div className="px-3 pt-2 min-w-[920px]">
        <p className="text-[11px] font-semibold mb-2" style={{ color: "#C41E3A" }}>
          {data.revisedLabel}
        </p>
      </div>

      {/* Objectives + Travel key */}
      <div className="grid grid-cols-[1.55fr_0.9fr] gap-3 px-3 pb-3 min-w-[920px]">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr style={{ background: "#4A5568", color: "#fff" }}>
              <th className="text-left font-semibold px-2 py-1.5 border" style={{ borderColor: GRID, width: "28%" }}>
                Top 5 Objectives
              </th>
              <th className="text-left font-semibold px-2 py-1.5 border" style={{ borderColor: GRID }}>
                Objective
              </th>
              <th className="text-left font-semibold px-2 py-1.5 border" style={{ borderColor: GRID, width: "22%" }}>
                BD&amp;S Leads
              </th>
            </tr>
          </thead>
          <tbody>
            {data.objectives.map((o) => (
              <tr key={o.rank} style={{ background: o.rank % 2 ? "#fff" : CELL }}>
                <td className="px-2 py-1.5 border font-medium" style={{ borderColor: GRID, color: NAVY }}>
                  Objective {o.rank}:
                </td>
                <td className="px-2 py-1.5 border" style={{ borderColor: GRID, color: "var(--text-secondary)" }}>
                  {o.text}
                </td>
                <td className="px-2 py-1.5 border font-medium" style={{ borderColor: GRID, color: NAVY }}>
                  {o.bdsLead}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full border-collapse text-[11px] h-fit">
          <thead>
            <tr style={{ background: BLUE, color: "#fff" }}>
              <th className="text-left font-semibold px-2 py-1.5 border" style={{ borderColor: GRID, width: "14%" }}>
                Key
              </th>
              <th className="text-left font-semibold px-2 py-1.5 border" style={{ borderColor: GRID }}>
                Travel
              </th>
              <th className="text-right font-semibold px-2 py-1.5 border" style={{ borderColor: GRID, width: "22%" }}>
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
              <tr key={row.code} style={{ background: i % 2 ? CELL : "#fff" }}>
                <td className="px-2 py-1.5 border font-bold text-center" style={{ borderColor: GRID, color: BLUE }}>
                  {row.code}
                </td>
                <td className="px-2 py-1.5 border" style={{ borderColor: GRID, color: "var(--text-secondary)" }}>
                  {row.label}
                </td>
                <td className="px-2 py-1.5 border text-right font-semibold" style={{ borderColor: GRID, color: NAVY }}>
                  {row.n}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Four role columns */}
      <div className="grid grid-cols-4 gap-2 px-3 pb-4 min-w-[920px]">
        {data.columns.map((col) => (
          <ExcelColumn key={col.id} section={col} />
        ))}
      </div>
    </div>
  )
}

function ExcelColumn({ section }: { section: AttendeeSection }) {
  const accent = accentColor(section.accent)
  const subBg = subHeaderColor(section.accent)
  const total = sectionCount(section)

  return (
    <div style={{ border: `1px solid ${GRID}`, background: "#fff" }}>
      <div
        className="px-2 py-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.04em] text-white leading-tight"
        style={{ background: accent, minHeight: 44 }}
      >
        <span>{section.title}</span>
        <span
          className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold"
          style={{ background: "rgba(255,255,255,0.18)", borderRadius: 2 }}
        >
          {total}
        </span>
      </div>

      {section.subsections.map((sub) => {
        const count = subsectionCount(sub)
        return (
          <div key={sub.id}>
            <div
              className="px-2 py-1 flex items-center justify-between text-[10px] font-semibold text-white"
              style={{ background: subBg }}
            >
              <span>{sub.title}</span>
              <span>{count}</span>
            </div>
            <table className="w-full border-collapse text-[10px]">
              <tbody>
                {sub.rows.map((row, i) => (
                  <tr key={row.id} style={{ background: i % 2 ? CELL : "#fff" }}>
                    <td
                      className="px-1.5 py-1 border-b align-top font-medium"
                      style={{ borderColor: GRID, color: NAVY, width: "38%" }}
                    >
                      {row.roleLabel}
                    </td>
                    <td className="px-1.5 py-1 border-b align-top" style={{ borderColor: GRID, color: "var(--text-secondary)" }}>
                      <div className="flex items-start justify-between gap-1">
                        <span className="leading-snug">
                          {row.name || <span style={{ color: "#A0AAB4" }}>—</span>}
                          {row.organization && (
                            <span className="block text-[9px]" style={{ color: "var(--text-muted)" }}>
                              {row.organization}
                            </span>
                          )}
                        </span>
                        {row.travel && (
                          <span
                            className="shrink-0 font-bold text-[9px] px-1"
                            style={{
                              color: BLUE,
                              background: "var(--boeing-ice)",
                              border: `1px solid ${GRID}`,
                            }}
                          >
                            {row.travel}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}

function ListDashboard({ data, eventLabel }: { data: AttendeeDashboardData; eventLabel: string }) {
  const rows = flattenAttendees(data)

  return (
    <div className="bg-white space-y-5" style={{ border: `1px solid ${GRID}`, boxShadow: "0 8px 28px rgba(10,34,64,0.08)" }}>
      <div className="px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between" style={{ background: NAVY, color: "#fff" }}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.55)" }}>
            Attendee list · {data.revisedLabel}
          </p>
          <h3 className="text-lg font-semibold mt-1">{eventLabel || data.eventName}</h3>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.7)" }}>
            Role roster with travel codes and objectives
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <span><strong>I</strong> {data.travelCounts.I}</span>
          <span><strong>D</strong> {data.travelCounts.D}</span>
          <span><strong>L</strong> {data.travelCounts.L}</span>
        </div>
      </div>

      <div className="px-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: BLUE }}>
          Top 5 objectives
        </p>
        <ol className="space-y-2 mb-6">
          {data.objectives.map((o) => (
            <li
              key={o.rank}
              className="grid grid-cols-[1.5rem_1fr_auto] gap-3 text-sm items-start py-2"
              style={{ borderBottom: `1px solid ${GRID}` }}
            >
              <span className="font-bold" style={{ color: BLUE }}>{o.rank}</span>
              <span style={{ color: "var(--text-secondary)" }}>{o.text}</span>
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: NAVY }}>{o.bdsLead}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="px-5 pb-5 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[640px]">
          <thead>
            <tr style={{ background: CELL }}>
              {["Section", "Role", "Name", "Travel", "#"].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-2 border-b"
                  style={{ color: "var(--text-muted)", borderColor: GRID }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.section}-${r.role}-${i}`} style={{ background: i % 2 ? CELL : "#fff" }}>
                <td className="px-3 py-2.5 border-b align-top" style={{ borderColor: GRID, color: "var(--text-muted)", fontSize: 12 }}>
                  <div className="font-medium" style={{ color: NAVY }}>{r.section.replace(" Customer Meetings & Engagements", "").replace(" Operation Staff", "")}</div>
                  <div className="text-[11px]">{r.subsection}</div>
                </td>
                <td className="px-3 py-2.5 border-b align-top font-medium" style={{ borderColor: GRID, color: NAVY }}>
                  {r.role}
                </td>
                <td className="px-3 py-2.5 border-b align-top" style={{ borderColor: GRID, color: "var(--text-secondary)" }}>
                  {r.name}
                  {r.organization && (
                    <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>{r.organization}</span>
                  )}
                </td>
                <td className="px-3 py-2.5 border-b align-top">
                  {r.travel !== "—" ? (
                    <span
                      className="inline-block px-1.5 py-0.5 text-[11px] font-bold"
                      style={{ color: BLUE, background: "var(--boeing-ice)", border: `1px solid ${GRID}` }}
                    >
                      {r.travel}
                    </span>
                  ) : (
                    <span style={{ color: "#A0AAB4" }}>—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 border-b align-top font-semibold" style={{ borderColor: GRID, color: NAVY }}>
                  {r.count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
