import { useCallback, useMemo, useState } from "react"
import { Download, LayoutGrid, List, Minus, Plus } from "lucide-react"
import { Button } from "../components/Button"
import { ChangelogDrawer } from "../components/review/ChangelogDrawer"
import { DockedComposer } from "../components/review/DockedComposer"
import type { Company } from "../data/companies"
import { personSurname, type Person } from "../data/people"
import {
  buildAttendeeDashboard,
  type AttendeeDashboardData,
} from "../data/attendeeDashboard"
import { useDocumentReview } from "../hooks/useDocumentReview"
import { applyAttendeeHunks } from "../utils/applyReviewHunks"
import { changelogScope } from "../utils/changelogStorage"
import { AttendeeExcelSheet } from "./AttendeeExcelSheet"
import { AttendeeDataSheet } from "./AttendeeDataSheet"

interface MaterialsHubProps {
  company: Company
  person: Person
  meetingType: string
  countryName?: string
  onContinue: () => void
}

type AttendeeView = "excel" | "list"
type InviteClose = "meeting" | "special" | "contact"

const BLUE = "#0033A1"
const NAVY = "#0A2240"
const GRID = "#9AA3AD"

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
  const [attendeeView, setAttendeeView] = useState<AttendeeView>("excel")
  const [close, setClose] = useState<InviteClose>("meeting")
  const defaultEvent = /mspo/i.test(meetingType)
    ? "MSPO 2026"
    : countryName
      ? "Singapore Airshow 2026"
      : meetingType
  const [eventName, setEventName] = useState(defaultEvent)
  const [showcase, setShowcase] = useState("Programme focus")
  const [senderName, setSenderName] = useState("Rex Heng")
  const senderTitle = "Office of President Boeing Southeast Asia & Taiwan"
  const [contactEmail, setContactEmail] = useState("rex.heng@boeing.com")
  const contactPhone = "+65 8xxx xxxx"
  const [zoom, setZoom] = useState(1.05)
  const [showEmpty, setShowEmpty] = useState(true)
  const [highlightPaths, setHighlightPaths] = useState<string[]>([])
  const [appliedFlash, setAppliedFlash] = useState<string[]>([])

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

  const salutation = person.title.toLowerCase().includes("minister")
    ? `Minister ${personSurname(person)}`
    : person.name
        .replace(/^(HH Sheikh|Gen\.|Lt Gen\.|ACM|AVM|MG|VADM|AIRMSHL|Brig\. Gen\.|Dato' Seri|Dato'|Tan Sri)\s+/i, "")
        .trim()
        .split(/\s+/)[0] || personSurname(person)

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

  const onManualChange = useCallback(
    (next: AttendeeDashboardData) => {
      setDashboard(next)
      recordAccept({
        source: "manual",
        target: "attendees",
        summary: "Manual attendee edit",
        hunks: [],
      })
    },
    [recordAccept],
  )

  const onHighlightPaths = useCallback((paths: string[]) => {
    setHighlightPaths(paths)
  }, [])

  const scrollToInvitation = () => {
    document.getElementById("materials-invitation")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="pb-12 space-y-8 docked-attendee-page">
      <div className={`docked-workspace ${highlightPaths.length > 0 ? "is-reviewing" : ""}`}>
        <DockedComposer
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
          onHighlightPaths={onHighlightPaths}
          onAccept={({ proposedDocument, hunks, allHunkCount, debrief, summary }) => {
            const next = applyAttendeeHunks(
              dashboard,
              proposedDocument as AttendeeDashboardData,
              hunks,
              allHunkCount,
            )
            setDashboard(next)
            const anchors = hunks.map((h) => h.anchor || h.path).filter(Boolean)
            setAppliedFlash(anchors)
            setHighlightPaths([])
            window.setTimeout(() => setAppliedFlash([]), 2200)
            recordAccept({
              source: "llm",
              target: "attendees",
              summary,
              hunks,
              debriefSnapshot: debrief,
            })
          }}
        />

        <div className="docked-workspace__sheet">
          <div className="docked-workspace__toolbar">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex" style={{ border: `1px solid ${GRID}` }} role="tablist" aria-label="Dashboard display">
                {(
                  [
                    { id: "excel" as const, label: "Sheet", icon: LayoutGrid },
                    { id: "list" as const, label: "List", icon: List },
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
              <button
                type="button"
                onClick={scrollToInvitation}
                className="cursor-pointer px-2.5 py-1.5 text-[11px] font-semibold"
                style={{ color: NAVY, border: `1px solid ${GRID}`, background: "#fff" }}
              >
                Invitation ↓
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center" style={{ border: `1px solid ${GRID}` }}>
                <button type="button" aria-label="Zoom out" onClick={() => bumpZoom(-1)} className="cursor-pointer px-2 py-1.5" style={{ color: NAVY }}>
                  <Minus size={12} />
                </button>
                <span className="px-2 text-[11px] font-semibold tabular-nums" style={{ color: NAVY, borderLeft: `1px solid ${GRID}`, borderRight: `1px solid ${GRID}` }}>
                  {Math.round(zoom * 100)}%
                </span>
                <button type="button" aria-label="Zoom in" onClick={() => bumpZoom(1)} className="cursor-pointer px-2 py-1.5" style={{ color: NAVY }}>
                  <Plus size={12} />
                </button>
              </div>

              <ChangelogDrawer
                entries={entries}
                open={changelogOpen}
                onOpen={() => setChangelogOpen(true)}
                onClose={() => setChangelogOpen(false)}
              />

              <button
                type="button"
                onClick={handleExcelDownload}
                className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em]"
                style={{ background: "#fff", color: BLUE, border: `1px solid ${BLUE}` }}
              >
                <Download size={13} />
                Export
              </button>
            </div>
          </div>

          <div className="docked-workspace__sheet-body">
            {attendeeView === "excel" ? (
              <AttendeeExcelSheet
                data={dashboard}
                eventLabel={eventName}
                zoom={zoom}
                onChange={onManualChange}
                highlightPaths={highlightPaths.length ? highlightPaths : appliedFlash}
                highlightMode={highlightPaths.length ? "focus" : appliedFlash.length ? "applied" : undefined}
              />
            ) : (
              <div className="space-y-2" style={{ zoom }}>
                <label className="inline-flex items-center gap-2 text-[11px] font-semibold cursor-pointer" style={{ color: NAVY }}>
                  <input type="checkbox" checked={showEmpty} onChange={(e) => setShowEmpty(e.target.checked)} />
                  Show empty role slots
                </label>
                <AttendeeDataSheet
                  data={dashboard}
                  showEmpty={showEmpty}
                  onChange={onManualChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <section id="materials-invitation" className="space-y-4 scroll-mt-6">
        <div>
          <p className="system-badge system-badge--dark mb-2">Invitation</p>
          <h3 className="text-xl md:text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
            Counterpart invitation letter
          </h3>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--text-secondary)" }}>
            Edit event details and closing style, then copy or adapt the letter for outreach.
          </p>
        </div>

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
            <div className="mt-4 space-y-0.5" style={{ color: NAVY }}>
              <p className="font-semibold">{senderName} | Boeing Global</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{senderTitle}</p>
              <p className="text-sm">
                <span className="font-semibold">E:</span>{" "}
                <a href={`mailto:${contactEmail}`} style={{ color: BLUE, textDecoration: "underline" }}>
                  {contactEmail}
                </a>
              </p>
              <p className="text-sm">
                <span className="font-semibold">Tel:</span> {contactPhone}
              </p>
              <img
                src="/images/boeing-logo.svg"
                alt="Boeing"
                className="mt-3 h-5 w-auto"
              />
            </div>
          </div>
        </article>
      </section>

      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue to report</Button>
      </div>
    </div>
  )
}
