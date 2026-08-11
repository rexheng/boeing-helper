import { useMemo, useState } from "react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"

interface MaterialsHubProps {
  company: Company
  person: Person
  meetingType: string
  countryName?: string
  onContinue: () => void
}

type Tab = "invite" | "attendee"

type InviteClose = "meeting" | "special" | "contact"

const BLUE = "#0033A1"
const NAVY = "#0A2240"

export function MaterialsHub({
  company,
  person,
  meetingType,
  countryName,
  onContinue,
}: MaterialsHubProps) {
  const [tab, setTab] = useState<Tab>("invite")
  const [close, setClose] = useState<InviteClose>("meeting")
  const [eventName, setEventName] = useState(meetingType.includes("Air") ? "MSPO 2026" : meetingType)
  const [showcase, setShowcase] = useState("programme capability and sustainment support")

  const surname = person.name.split(" ").slice(-1)[0]
  const salutation = person.title.toLowerCase().includes("minister")
    ? `Minister ${surname}`
    : person.name.split(" ")[0]

  const closing = useMemo(() => {
    if (close === "special") {
      return `We would be delighted if you could join our senior leadership reception. To reserve your place or for questions, please email the regional integrator and we will confirm details.`
    }
    if (close === "contact") {
      return `If easier, simply contact the regional integrator and we will coordinate a suitable time or provide additional information.`
    }
    return `We would be pleased to meet at a time convenient for you. Please confirm a meeting time or reach out to the regional integrator and we will arrange details.`
  }, [close])

  return (
    <div className="space-y-6 pb-12">
      <div className="text-center mb-2">
        <p className="system-badge system-badge--dark mb-3">Materials</p>
        <h2 className="text-2xl md:text-3xl font-semibold" style={{ color: "var(--text-primary)" }}>
          Invitation and attendee list
        </h2>
        <p className="mt-3 max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Same counterpart, same show cycle — letter and attendee line ready for integrator review.
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
            { id: "attendee" as const, label: "Attendee list" },
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
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="text-sm sm:col-span-1">
              <span className="block mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Event</span>
              <input
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-sm"
                style={{ border: "1px solid var(--surface-border)", color: NAVY }}
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="block mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Showcase</span>
              <input
                value={showcase}
                onChange={(e) => setShowcase(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-sm"
                style={{ border: "1px solid var(--surface-border)", color: NAVY }}
              />
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
                className="cursor-pointer px-3 py-1.5 text-xs font-medium rounded-sm"
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

          <article className="bh-card p-6 sm:p-8 space-y-5 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            <div className="flex justify-between gap-6 items-start">
              <div className="text-sm space-y-0.5" style={{ color: NAVY }}>
                <p>{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
                <p>{person.name}</p>
                <p>{person.title}</p>
                <p>{company.name}</p>
                <p>{countryName || "Location"}</p>
              </div>
              <div
                className="px-5 py-3 text-white text-sm font-semibold text-center shrink-0"
                style={{ background: BLUE, minWidth: "9rem" }}
              >
                Invitation
              </div>
            </div>

            <p>Dear {salutation},</p>

            <p>
              On behalf of The Boeing Company, I write to invite you to meet with us during{" "}
              <strong style={{ color: NAVY }}>{eventName}</strong>
              {countryName ? `, taking place in ${countryName}` : ""}.
            </p>

            <p className="italic">
              In today’s global security environment, Boeing continues to innovate and invest across defense, space, and services so partners can field capability with confidence.
            </p>

            <p>
              At {eventName}, we look forward to showcasing <strong style={{ color: NAVY }}>{showcase}</strong> and discussing how it supports your priorities.
            </p>

            <p>{closing}</p>

            <div className="pt-4">
              <p>Sincerely,</p>
              <p className="mt-4 font-medium" style={{ color: NAVY }}>Regional Integrator</p>
              <p>International Business Development</p>
              <p>The Boeing Company</p>
            </div>
          </article>
        </div>
      )}

      {tab === "attendee" && (
        <article className="bh-card overflow-hidden">
          <div className="px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between" style={{ background: NAVY, color: "#fff" }}>
            <div>
              <p className="font-semibold">Attendee List</p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                {eventName} · Participant list · Revised for demo
              </p>
            </div>
            <div className="flex gap-4 text-xs">
              <span><strong>I</strong> Int’l 1</span>
              <span><strong>D</strong> Domestic 0</span>
              <span><strong>L</strong> Local 0</span>
            </div>
          </div>

          <div className="p-5 grid gap-6 md:grid-cols-2">
            <div>
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: BLUE }}>
                Top objectives
              </p>
              <ol className="space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                <li>01 · Advance {company.name} bilateral on the show calendar</li>
                <li>02 · Confirm Boeing attendees for the {person.name.split(" ").slice(-1)[0]} meeting</li>
                <li>03 · Lock RD review before D-60 executive pass</li>
              </ol>
            </div>

            <div>
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: BLUE }}>
                BDS customer meetings
              </p>
              <div className="rounded-sm p-4 text-sm" style={{ background: "var(--bg-muted)", border: "1px solid var(--surface-border)" }}>
                <p className="font-semibold" style={{ color: NAVY }}>International Business Development</p>
                <p className="mt-2" style={{ color: "var(--text-secondary)" }}>
                  Customer meeting · <span style={{ color: NAVY }}>{person.name}</span>
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {person.title} · {company.name} · Travel: I
                </p>
                <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                  Focal: Regional Director · Integrator draft
                </p>
              </div>
            </div>

            <div className="md:col-span-2">
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: BLUE }}>
                Review path
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                {["Integrator draft", "RD review", "Division BD leads", "60-day exec review", "D-30 lock", "Late adds → IBD VP"].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5"
                    style={{ background: "var(--boeing-ice)", color: NAVY, border: "1px solid var(--surface-border)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      )}

      <div className="flex justify-end">
        <Button onClick={onContinue}>Continue to handoff</Button>
      </div>
    </div>
  )
}
