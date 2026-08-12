import type { Person } from "./people"
import type { Company } from "./companies"

export type TravelCode = "I" | "D" | "L"

export interface AttendeeRoleRow {
  id: string
  roleLabel: string
  name: string
  organization?: string
  travel: TravelCode | ""
  notes?: string
  count: number
}

export interface AttendeeSubsection {
  id: string
  title: string
  rows: AttendeeRoleRow[]
}

export interface AttendeeSection {
  id: string
  title: string
  accent: "navy" | "blue" | "steel" | "green"
  subsections: AttendeeSubsection[]
}

export interface AttendeeObjective {
  rank: number
  text: string
  bdsLead: string
}

export interface AttendeeDashboardData {
  eventName: string
  eventTitle: string
  revisedLabel: string
  objectives: AttendeeObjective[]
  travelCounts: { I: number; D: number; L: number }
  columns: AttendeeSection[]
}

const ACCENT = {
  navy: "#0A2240",
  blue: "#0033A1",
  steel: "#1F4F8A",
  green: "#2F6B4F",
} as const

const SUB_HEADER = {
  navy: "#163A63",
  blue: "#1A4A9C",
  steel: "#2A5F9E",
  green: "#3D8B63",
} as const

export function accentColor(key: AttendeeSection["accent"]) {
  return ACCENT[key]
}

export function subHeaderColor(key: AttendeeSection["accent"]) {
  return SUB_HEADER[key]
}

function sectionCount(section: AttendeeSection) {
  return section.subsections.reduce(
    (sum, sub) => sum + sub.rows.reduce((s, r) => s + (r.count || 0), 0),
    0,
  )
}

export function subsectionCount(sub: AttendeeSubsection) {
  return sub.rows.reduce((s, r) => s + (r.count || 0), 0)
}

export { sectionCount }

/** Build a synthetic SEA air-show attendee dashboard seeded from the selected engagement. */
export function buildAttendeeDashboard(
  company: Company,
  person: Person,
  meetingType: string,
  countryName?: string,
): AttendeeDashboardData {
  const eventName = /mspo/i.test(meetingType)
    ? "MSPO 2026"
    : "Singapore Airshow 2026"

  const customerTravel: TravelCode =
    countryName === "Singapore" || company.country === "singapore" ? "L" : "I"

  const counterpartLabel = person.title.toLowerCase().includes("minister")
    ? `Minister ${person.name.split(" ").slice(-1)[0]}`
    : person.name

  const objectives: AttendeeObjective[] = [
    {
      rank: 1,
      text: `Secure follow-on technical session with ${counterpartLabel} on live programme timing`,
      bdsLead: "Rex Heng",
    },
    {
      rank: 2,
      text: "Align sustainment / cost-per-flight-hour narrative before next programme review",
      bdsLead: "Regional Integrator",
    },
    {
      rank: 3,
      text: "Name the customer-side owner for the next written ask to Boeing",
      bdsLead: "IBD VP",
    },
    {
      rank: 4,
      text: "Align local-industry / offset talking points with in-country team",
      bdsLead: "GovOps",
    },
    {
      rank: 5,
      text: "Lock D-30 attendee list and protocol for the bilateral",
      bdsLead: "Exhibit Mgmt",
    },
  ]

  const columns: AttendeeSection[] = [
    {
      id: "bds",
      title: "BDS Customer Meetings & Engagements",
      accent: "navy",
      subsections: [
        {
          id: "bds-bds",
          title: "Business Development & Strategy",
          rows: [
            { id: "bds-ceo", roleLabel: "CEO", name: "", travel: "", count: 0 },
            { id: "bds-vp", roleLabel: "VP", name: "", travel: "", count: 0 },
            { id: "bds-ea", roleLabel: "EA", name: "", travel: "", count: 0 },
            { id: "bds-ad", roleLabel: "AD", name: "", travel: "", count: 0 },
            { id: "bds-msb", roleLabel: "MS&B", name: "", travel: "", count: 0 },
            { id: "bds-pw-r", roleLabel: "PW", name: "", travel: "", count: 0 },
            { id: "bds-siws", roleLabel: "SI&WS", name: "", travel: "", count: 0 },
            { id: "bds-vl-r", roleLabel: "VL", name: "", travel: "", count: 0 },
          ],
        },
        {
          id: "bds-ibd",
          title: "International Business Development",
          rows: [
            { id: "bds-exec", roleLabel: "Executive", name: "", travel: "", count: 0 },
            { id: "bds-rd", roleLabel: "Regional Director", name: "SEA RD", travel: "L", count: 1 },
            { id: "bds-rf", roleLabel: "Regional Focal", name: "Rex Heng", organization: "IBD · SEA", travel: "L", count: 1 },
            { id: "bds-isp", roleLabel: "ISP", name: "", travel: "", count: 0 },
            {
              id: "bds-customer",
              roleLabel: "Customer principal",
              name: person.name,
              organization: `${person.title} · ${company.name}`,
              travel: customerTravel,
              notes: "Primary bilateral seat",
              count: 1,
            },
          ],
        },
        {
          id: "bds-adom",
          title: "Air Dominance",
          rows: [{ id: "bds-adom-f", roleLabel: "Program focal", name: "", travel: "", count: 0 }],
        },
        {
          id: "bds-mob",
          title: "Mobility Surveillance & Bombers",
          rows: [{ id: "bds-mob-f", roleLabel: "Program focal", name: "Programme focal", travel: "I", count: 1 }],
        },
        {
          id: "bds-pw",
          title: "Phantom Works",
          rows: [{ id: "bds-pw-f", roleLabel: "Program focal", name: "", travel: "", count: 0 }],
        },
        {
          id: "bds-space",
          title: "Space Intelligence & Weapon Systems",
          rows: [{ id: "bds-space-f", roleLabel: "Program focal", name: "", travel: "", count: 0 }],
        },
        {
          id: "bds-vl",
          title: "Vertical Lift",
          rows: [{ id: "bds-vl-f", roleLabel: "Program focal", name: "AH-64 / CH-47 lead", travel: "D", count: 1 }],
        },
      ],
    },
    {
      id: "bgs",
      title: "BGS Customer Meetings & Engagements",
      accent: "steel",
      subsections: [
        {
          id: "bgs-bds",
          title: "Business Development & Strategy",
          rows: [{ id: "bgs-exec", roleLabel: "Executive", name: "", travel: "", count: 0 }],
        },
        {
          id: "bgs-gov",
          title: "Government Services",
          rows: [{ id: "bgs-vp", roleLabel: "VP/GM", name: "Field service lead", travel: "I", count: 1 }],
        },
        {
          id: "bgs-parts",
          title: "Parts & Distro",
          rows: [{ id: "bgs-focal", roleLabel: "Program focal", name: "Loyang DC focal", travel: "L", count: 1 }],
        },
      ],
    },
    {
      id: "global",
      title: "Boeing Global Engagements",
      accent: "blue",
      subsections: [
        {
          id: "bg-core",
          title: "Boeing Global Engagements",
          rows: [
            { id: "bg-cvp", roleLabel: "CVP", name: "", travel: "", count: 0 },
            { id: "bg-ea", roleLabel: "EA", name: "", travel: "", count: 0 },
            { id: "bg-govops", roleLabel: "Government Ops", name: "Protocol notified", travel: "L", count: 1 },
            { id: "bg-sched", roleLabel: "Scheduler", name: "", travel: "", count: 0 },
          ],
        },
        {
          id: "bg-wisk",
          title: "Wisk / Aurora",
          rows: [
            { id: "bg-wisk-vp", roleLabel: "VP", name: "", travel: "", count: 0 },
            { id: "bg-wisk-f", roleLabel: "Focal", name: "", travel: "", count: 0 },
          ],
        },
        {
          id: "bg-sust",
          title: "Sustainability Customer Engagements",
          rows: [
            { id: "bg-sust-vp", roleLabel: "VP", name: "", travel: "", count: 0 },
            { id: "bg-sust-f", roleLabel: "Focal", name: "", travel: "", count: 0 },
          ],
        },
        {
          id: "bg-tl",
          title: "Thought Leadership",
          rows: [
            { id: "bg-tl1", roleLabel: "Presenter", name: "", travel: "", count: 0 },
            { id: "bg-tl2", roleLabel: "Presenter", name: "", travel: "", count: 0 },
            { id: "bg-tl3", roleLabel: "Presenter", name: "", travel: "", count: 0 },
          ],
        },
        {
          id: "bg-day",
          title: "Day Passes",
          rows: [
            { id: "bg-d1", roleLabel: "Customer mtg day 1", name: "", travel: "", count: 0 },
            { id: "bg-d2", roleLabel: "Customer mtg day 2", name: "", travel: "", count: 0 },
          ],
        },
        {
          id: "bg-stem",
          title: "Public Day / STEM Day",
          rows: [{ id: "bg-stem-r", roleLabel: "STEM / public", name: "", travel: "", count: 0 }],
        },
      ],
    },
    {
      id: "exhibit",
      title: "Exhibit Operation Staff",
      accent: "green",
      subsections: [
        {
          id: "ex-mgmt",
          title: "Exhibit Management",
          rows: [
            { id: "ex-mgr", roleLabel: "Exhibit Manager", name: "Exhibit lead", travel: "L", count: 1 },
            { id: "ex-ri", roleLabel: "Regional Integrator", name: "Rex Heng", travel: "L", count: 1 },
            { id: "ex-totem", roleLabel: "Totem Lead", name: "", travel: "", count: 0 },
            { id: "ex-front", roleLabel: "Front Desk", name: "Chalet desk", travel: "L", count: 2 },
            { id: "ex-ce", roleLabel: "Customer Engagement", name: "", travel: "", count: 0 },
            { id: "ex-dod", roleLabel: "DOD Corral", name: "", travel: "", count: 0 },
          ],
        },
        {
          id: "ex-supp",
          title: "Supplier Management",
          rows: [{ id: "ex-supp-f", roleLabel: "Focal", name: "", travel: "", count: 0 }],
        },
        {
          id: "ex-sec",
          title: "Security (GSA / EP)",
          rows: [{ id: "ex-sec-f", roleLabel: "Lead", name: "EP detail", travel: "L", count: 2 }],
        },
        {
          id: "ex-sim",
          title: "Simulator",
          rows: [{ id: "ex-sim-f", roleLabel: "Focal", name: "", travel: "", count: 0 }],
        },
        {
          id: "ex-d1",
          title: "Demo #1",
          rows: [{ id: "ex-d1-f", roleLabel: "Focal", name: "", travel: "", count: 0 }],
        },
        {
          id: "ex-d2",
          title: "Demo #2",
          rows: [{ id: "ex-d2-f", roleLabel: "Focal", name: "", travel: "", count: 0 }],
        },
        {
          id: "ex-comms",
          title: "Communications / Media Engagement",
          rows: [{ id: "ex-comms-f", roleLabel: "Lead", name: "Media engagement", travel: "L", count: 1 }],
        },
        {
          id: "ex-git",
          title: "Global IT",
          rows: [{ id: "ex-git-f", roleLabel: "Focal", name: "", travel: "", count: 0 }],
        },
      ],
    },
  ]

  const travelCounts = { I: 0, D: 0, L: 0 }
  for (const col of columns) {
    for (const sub of col.subsections) {
      for (const row of sub.rows) {
        if (row.travel === "I") travelCounts.I += row.count
        if (row.travel === "D") travelCounts.D += row.count
        if (row.travel === "L") travelCounts.L += row.count
      }
    }
  }

  const revised = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  })

  return {
    eventName,
    eventTitle: eventName.toUpperCase(),
    revisedLabel: `Revised ${revised}`,
    objectives,
    travelCounts,
    columns,
  }
}

export function recountTravel(columns: AttendeeSection[]): AttendeeDashboardData["travelCounts"] {
  const travelCounts = { I: 0, D: 0, L: 0 }
  for (const col of columns) {
    for (const sub of col.subsections) {
      for (const row of sub.rows) {
        if (row.travel === "I") travelCounts.I += row.count || 0
        if (row.travel === "D") travelCounts.D += row.count || 0
        if (row.travel === "L") travelCounts.L += row.count || 0
      }
    }
  }
  return travelCounts
}

export function withRecountedTravel(data: AttendeeDashboardData): AttendeeDashboardData {
  return { ...data, travelCounts: recountTravel(data.columns) }
}

export function updateAttendeeRow(
  data: AttendeeDashboardData,
  sectionId: string,
  subsectionId: string,
  rowId: string,
  patch: Partial<AttendeeRoleRow>,
): AttendeeDashboardData {
  const columns = data.columns.map((col) => {
    if (col.id !== sectionId) return col
    return {
      ...col,
      subsections: col.subsections.map((sub) => {
        if (sub.id !== subsectionId) return sub
        return {
          ...sub,
          rows: sub.rows.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
        }
      }),
    }
  })
  return withRecountedTravel({ ...data, columns })
}

export function addAttendeeRow(
  data: AttendeeDashboardData,
  sectionId: string,
  subsectionId: string,
  row?: Partial<AttendeeRoleRow>,
): AttendeeDashboardData {
  const columns = data.columns.map((col) => {
    if (col.id !== sectionId) return col
    return {
      ...col,
      subsections: col.subsections.map((sub) => {
        if (sub.id !== subsectionId) return sub
        const next: AttendeeRoleRow = {
          id: row?.id || `row-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          roleLabel: row?.roleLabel ?? "Role",
          name: row?.name ?? "",
          organization: row?.organization,
          travel: row?.travel ?? "",
          notes: row?.notes,
          count: row?.count ?? 1,
        }
        return { ...sub, rows: [...sub.rows, next] }
      }),
    }
  })
  return withRecountedTravel({ ...data, columns })
}

export function removeAttendeeRow(
  data: AttendeeDashboardData,
  sectionId: string,
  subsectionId: string,
  rowId: string,
): AttendeeDashboardData {
  const columns = data.columns.map((col) => {
    if (col.id !== sectionId) return col
    return {
      ...col,
      subsections: col.subsections.map((sub) => {
        if (sub.id !== subsectionId) return sub
        return { ...sub, rows: sub.rows.filter((r) => r.id !== rowId) }
      }),
    }
  })
  return withRecountedTravel({ ...data, columns })
}

export function flattenAttendees(data: AttendeeDashboardData, opts?: { filledOnly?: boolean }) {
  const filledOnly = opts?.filledOnly ?? false
  return data.columns.flatMap((section) =>
    section.subsections.flatMap((sub) =>
      sub.rows
        .filter((r) => (filledOnly ? r.name || r.count > 0 : true))
        .map((r) => ({
          sectionId: section.id,
          subsectionId: sub.id,
          rowId: r.id,
          section: section.title,
          subsection: sub.title,
          role: r.roleLabel,
          name: r.name || "",
          organization: r.organization || "",
          travel: r.travel || "",
          count: r.count,
          notes: r.notes || "",
        })),
    ),
  )
}
