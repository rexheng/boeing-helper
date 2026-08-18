import type { Company } from "../data/companies"
import { personSurname, type Person } from "../data/people"
import type { ExtractedField, PriorMeetingPaper } from "../types/internalDocument"
import type { ResearchResult } from "../types/research"

const NAVY = "0A2240"
const BLUE = "0033A1"
const RULE = "C5CDD4"
const ICE = "E3EFFA"
const MUTED = "515F6B"

const SEA_CONTACT = {
  name: "Rex Heng",
  title: "Office of President Boeing Southeast Asia & Taiwan",
  phone: "+65 8xxx xxxx",
} as const

const AMERICAS_CONTACT = {
  name: "Rex Heng",
  title: "Boeing Commercial Airplanes · Americas Airline Accounts",
  phone: "+1 206 xxx xxxx",
} as const

function stem(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function clip(text: string, n: number) {
  const t = text.replace(/\s+/g, " ").trim()
  if (t.length <= n) return t
  return t.slice(0, n - 1).trimEnd() + "…"
}

function isAirShow(meetingType: string) {
  return /air show|airshow|bilateral|chalet|mspo/i.test(meetingType)
}

function isAirline(company: Company) {
  return company.industry === "Commercial Aviation"
}

/** Date / event already used in seeded airline notes — display only, no new paper body. */
function airlineStamp(company: Company): Partial<PriorMeetingPaper> | null {
  if (!isAirline(company)) return null
  if (company.id === "american") {
    return {
      dateLabel: "April 2026",
      dateIso: "2026-04",
      locationOrEvent: "DFW account review",
    }
  }
  if (company.id === "delta") {
    return {
      dateLabel: "May 2026",
      dateIso: "2026-05",
      locationOrEvent: "Atlanta account review",
    }
  }
  return {
    dateLabel: "12 May 2026",
    dateIso: "2026-05-12",
    locationOrEvent: "Programme Status Review",
  }
}

function inferSalutation(person: Person): string {
  const t = person.title.toLowerCase()
  const surname = personSurname(person)
  if (t.includes("minister") || t.includes("secretary")) return `Minister ${surname}`
  if (t.includes("general") || t.includes("admiral")) return person.name
  if (t.includes("dr") || t.includes("doctor")) return `Dr. ${surname}`
  return `Mr ${surname}`
}

function contactFor(company: Company) {
  return company.regionId === "americas" ? { ...AMERICAS_CONTACT } : { ...SEA_CONTACT }
}

/** Flagship prior papers — dated, short, with open items that seed the next brief. */
function flagshipPrior(person: Person, company: Company): Partial<PriorMeetingPaper> | null {
  if (person.id === "chan-chun-sing" || (company.id === "mindef-sg" && person.id === "chan-chun-sing")) {
    return chanPrior(person)
  }
  if (company.id === "mindef-sg") return mindefPrior(person)
  if (person.id === "goh-choon-phong" || company.id === "sia") return siaPrior(person)
  return null
}

function chanPrior(person: Person): Partial<PriorMeetingPaper> {
  return {
    dateLabel: "11 February 2026",
    dateIso: "2026-02-11",
    locationOrEvent: "Singapore Airshow 2026",
    customer: {
      name: person.name,
      title: person.title,
      salutation: "Minister Chan",
      phonetic: "chahn chun sing",
      raa: "Responsible for defence policy and RSAF acquisition decisions affecting P-8A, AH-64, and Chinook programmes.",
    },
    objectives: [
      "Customer confirmed sustainment — P-8A, AH-64D, CH-47 — as the live conversation; fighter is off the table.",
      "Agreed a D+30 technical exchange on P-8A logistics and the training pipeline.",
      "Boeing to issue a written follow-up pack within five business days of the show.",
    ],
    keyMessages: [
      {
        message: "P-8A delivery and training pathway remains the near-term conversation — schedule reliability over new platform pitches.",
        note: "RSAF has called F-35 and P-8A the force’s game-changers.",
      },
      { message: "AH-64D and CH-47 sustainment economics matter as much as unit price; bring cost-per-flight-hour evidence." },
      { message: "Local industry participation through ST Engineering and DSTA should be named in the room, not left to follow-up." },
    ],
    customerSatIssues: [
      "Delivery credibility after F-35 and commercial schedule slips",
      "Lifecycle cost versus acquisition price",
      "Apache and Chinook spares availability and depot turnaround",
      "Offset and local-industry participation on P-8A induction",
    ],
    engagementBackground:
      "Singapore Airshow 2026 chalet bilateral with the minister’s office. Public marker (CNA, Feb 2026): Chief of Air Force calls F-35 and P-8A the RSAF’s game-changers. Confirm last Boeing attendees before freeze.",
    campaignBackground:
      "Live Boeing lanes: P-8A Poseidon, AH-64D Apache life extension, CH-47 Chinook sustainment. F-35 is a Lockheed relationship. ST Engineering is the expected local MRO prime.",
    openItems: [
      "Dated P-8A induction and training language still not on paper.",
      "AH-64D / CH-47 readiness or depot numbers still blank.",
      "Singapore-side owner for the next written ask not named.",
    ],
    commitments: [
      "D+30 technical exchange on P-8A logistics and training pipeline.",
      "Written follow-up pack within five business days of the show.",
    ],
  }
}

function mindefPrior(person: Person): Partial<PriorMeetingPaper> {
  return {
    dateLabel: "11 February 2026",
    dateIso: "2026-02-11",
    locationOrEvent: "Singapore Airshow 2026",
    customer: {
      name: person.name,
      title: person.title,
      salutation: inferSalutation(person),
      phonetic: "—",
      raa: "RSAF / MINDEF counterpart on P-8A, AH-64D and Chinook programmes.",
    },
    objectives: [
      "Align on P-8A induction timing and the training pipeline before the next programme review.",
      "Share AH-64D life-extension cost-per-flight-hour evidence with DSTA.",
      "Name the Singapore-side owner for the next written ask to Boeing.",
    ],
    keyMessages: [
      { message: "P-8A induction path is the near-term conversation." },
      { message: "AH-64D and CH-47 sustainment economics will be scored, not unit price alone." },
      { message: "ST Engineering workshare should be named in the room." },
    ],
    customerSatIssues: [
      "Delivery credibility",
      "Lifecycle cost",
      "Local industry participation",
    ],
    engagementBackground:
      "Singapore Airshow 2026 working session. Carry-forward items from the chalet still open.",
    campaignBackground:
      "Boeing installed base at RSAF: AH-64D, CH-47, and P-8A on order.",
    openItems: [
      "P-8A induction window still not written.",
      "Apache life-extension cost pack not delivered.",
      "Chinook spare-parts pipeline question unanswered.",
    ],
    commitments: [
      "Issue the AH-64D cost-per-flight-hour pack to DSTA.",
      "Propose dates for a P-8A technical working group.",
    ],
  }
}

function siaPrior(person: Person): Partial<PriorMeetingPaper> {
  return {
    dateLabel: "14 May 2026",
    dateIso: "2026-05-14",
    locationOrEvent: "Programme Status Review",
    customer: {
      name: person.name,
      title: person.title,
      salutation: person.id === "goh-choon-phong" ? "Mr Goh" : inferSalutation(person),
      phonetic: person.id === "goh-choon-phong" ? "goh choon fong" : "—",
      raa: "SIA counterpart on 777-9 delivery, cabin install and the next-decade widebody contest.",
    },
    objectives: [
      "Put a dated 777-9 delivery and cabin-install statement on paper, or remove schedule language.",
      "Align on next-widebody slot picture — not discounting.",
      "Name the SIA-side owner for the next written ask.",
    ],
    keyMessages: [
      { message: "Delivery credibility is the nerve. Do not re-announce the 777-9 order without a date." },
      { message: "The next 50+ widebody contest turns on slots; the A350F lane is closed." },
      { message: "Name the SIAEC–Boeing JV if MRO is in the room." },
    ],
    customerSatIssues: [
      "777-9 certification and delivery (none in the FY27 plan)",
      "Cost of 777-300ER extension",
      "Cabin specification on first aircraft",
      "Next-order slot picture",
    ],
    engagementBackground:
      "Programme status review, 14 May 2026. Public marker: Aviation Week fleet-plan coverage, May 2026. Confirm last Boeing attendees before freeze.",
    campaignBackground:
      "SIA: 31× 777-9 and 26× 787-10 on order. Temasek premium hub. SIAEC is the Changi MRO anchor.",
    openItems: [
      "Dated 777-9 delivery still missing from the paper.",
      "Slot picture for the next widebody contest not written.",
      "777-300ER delay-cost figure still blank.",
    ],
    commitments: [
      "Return a written 777-9 date or strike the schedule sentence.",
      "Name SIA-side owner before the next review.",
    ],
  }
}

function genericPrior(
  person: Person,
  company: Company,
  meetingType: string,
  research?: ResearchResult | null,
): Partial<PriorMeetingPaper> {
  const air = isAirShow(meetingType) && !isAirline(company)
  const country = research?.country
  const metric = research?.company.key_metrics[0]
  const priority = country?.priorities[0]
  const concern = country?.concerns[0]
  const news = research?.company.recent_news[0]

  return {
    dateLabel: air ? "11 February 2026" : "12 May 2026",
    dateIso: air ? "2026-02-11" : "2026-05-12",
    locationOrEvent: air ? "Singapore Airshow 2026" : "Programme Status Review",
    objectives: [
      priority
        ? `Customer signalled a follow-on discussion on: ${clip(priority, 90)}`
        : `Align on the live programme ask for ${company.name}.`,
      metric
        ? `Review status for ${metric.label} (${metric.value}) and any open Boeing asks.`
        : "Agree the open Boeing asks before the next gate.",
      "Agree owners and dates for the next deliverable before leaving the room.",
    ],
    keyMessages: [
      metric
        ? { message: `${metric.label} stands at ${metric.value} — speak to schedule and sustainment with programme detail.` }
        : { message: `Programme status for ${company.name} should be spoken with dates, not targets.` },
      priority
        ? { message: `Near-term offer maps to their stated priority: ${clip(priority, 100)}` }
        : { message: "Bring evidence, not a new platform pitch." },
      concern
        ? { message: `Address ${clip(concern, 80)} with programme evidence.` }
        : { message: "Name the counterpart owner for the next written ask." },
    ],
    customerSatIssues: (country?.concerns ?? [
      "Cost and affordability pressure on the next tranche",
      "Delivery timing credibility",
      "Local industry participation expectations",
    ]).slice(0, 4),
    engagementBackground: news
      ? `Prior review. Public marker: “${news.headline}” (${news.source}, ${news.date}). Confirm last Boeing attendees before freeze.`
      : `Prior ${air ? "air-show" : "programme"} review with ${person.name}. Confirm last Boeing attendees before freeze.`,
    campaignBackground: clip(research?.company.overview || company.overview || company.tagline, 220),
    openItems: [
      metric
        ? `Dated language for ${metric.label} still not on paper.`
        : "Dated language for the next deliverable still not on paper.",
      "Named owner for the next written ask still blank.",
      concern ? `Open concern not closed: ${clip(concern, 90)}` : "One customer-sat item still without an owner.",
    ],
    commitments: [
      "Issue a written follow-up pack within five business days.",
      "Propose dates for the next technical working group.",
    ],
  }
}

export function generatePriorMeetingPaper(
  company: Company,
  person: Person,
  meetingType: string,
  research?: ResearchResult | null,
): PriorMeetingPaper {
  const air = isAirShow(meetingType) && !isAirline(company)
  const flagship = flagshipPrior(person, company)
  const generic = genericPrior(person, company, meetingType, research)
  const merged = { ...generic, ...airlineStamp(company), ...flagship }
  const dateLabel = merged.dateLabel ?? (air ? "11 February 2026" : "12 May 2026")
  const dateIso = merged.dateIso ?? (air ? "2026-02-11" : "2026-05-12")
  const locationOrEvent = merged.locationOrEvent ?? (air ? "Singapore Airshow 2026" : "Programme Status Review")
  const bio = clip(research?.person.background || person.headline, 240)

  const paper: PriorMeetingPaper = {
    fileName: `Meeting-Paper-${stem(person.name)}-${dateIso}.docx`,
    dateLabel,
    dateIso,
    meetingTitle: `MEETING WITH ${person.name.toUpperCase()}`,
    subtitle: `${person.title}${research?.country?.name ? `, ${research.country.name}` : company.countryName ? `, ${company.countryName}` : ""}`,
    locationOrEvent,
    classification: "BOEING PROPRIETARY — INTERNAL USE ONLY",
    contact: merged.contact ?? contactFor(company),
    customer: merged.customer ?? {
      name: person.name,
      title: person.title,
      salutation: inferSalutation(person),
      phonetic: "—",
      raa: `Responsible for decisions affecting ${company.name} engagement with Boeing.`,
    },
    objectives: (merged.objectives ?? []).slice(0, 4),
    keyMessages: (merged.keyMessages ?? []).slice(0, 4),
    campaignBackground: merged.campaignBackground ?? clip(company.tagline, 220),
    customerSatIssues: merged.customerSatIssues ?? [],
    engagementBackground: merged.engagementBackground ?? "Prior engagement history to be completed by the in-country team.",
    biography: {
      name: person.name,
      title: person.title,
      text: bio,
    },
    openItems: merged.openItems ?? [],
    commitments: merged.commitments ?? [],
  }
  return paper
}

export function extractionFields(paper: PriorMeetingPaper): ExtractedField[] {
  const fields: ExtractedField[] = [
    { id: "date", label: "Date stamp", value: paper.dateLabel, kind: "date", lane: "company" },
    { id: "event", label: "Event", value: paper.locationOrEvent, kind: "event", lane: "country" },
    {
      id: "counterpart",
      label: "Counterpart",
      value: `${paper.customer.name}, ${paper.customer.title}`,
      kind: "counterpart",
      lane: "industry",
    },
  ]
  paper.objectives.forEach((value, i) => {
    fields.push({
      id: `obj-${i}`,
      label: `Objective ${i + 1}`,
      value,
      kind: "objective",
      lane: "company",
    })
  })
  paper.openItems.forEach((value, i) => {
    fields.push({
      id: `open-${i}`,
      label: `Open item ${i + 1}`,
      value,
      kind: "open",
      lane: "company",
    })
  })
  paper.commitments.forEach((value, i) => {
    fields.push({
      id: `cmt-${i}`,
      label: `Commitment ${i + 1}`,
      value,
      kind: "commitment",
      lane: "company",
    })
  })
  return fields
}

/** Fixed-format prior meeting paper — same field set as the live Boeing template. */
export async function buildPriorMeetingPaperDocx(paper: PriorMeetingPaper): Promise<Blob> {
  const {
    AlignmentType,
    BorderStyle,
    Document,
    Footer,
    Header,
    HeightRule,
    Packer,
    PageNumber,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
    VerticalAlign,
    WidthType,
  } = await import("docx")

  const noBorder = {
    style: BorderStyle.NONE,
    size: 0,
    color: "FFFFFF",
  }

  const hairline = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: RULE,
  }

function cellBorders(opts?: { bottom?: boolean; top?: boolean }) {
  return {
    top: opts?.top ? hairline : noBorder,
    bottom: opts?.bottom ? hairline : noBorder,
    left: noBorder,
    right: noBorder,
  }
}

function p(text: string, opts?: { bold?: boolean; size?: number; color?: string; caps?: boolean; italic?: boolean }) {
  return new Paragraph({
    spacing: { after: 0, before: 0, line: 276 },
    children: [
      new TextRun({
        text,
        font: "Calibri",
        size: opts?.size ?? 20,
        bold: opts?.bold,
        italics: opts?.italic,
        color: opts?.color ?? "253746",
        smallCaps: opts?.caps,
      }),
    ],
  })
}

function sectionLabel(text: string) {
  return new Paragraph({
    spacing: { before: 220, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 4 },
    },
    children: [
      new TextRun({
        text,
        font: "Calibri",
        size: 18,
        bold: true,
        color: BLUE,
        smallCaps: true,
      }),
    ],
  })
}

function kvRow(label: string, value: string, shade?: boolean) {
  const lines = value.split("\n").filter((line) => line.length > 0)
  return new TableRow({
    height: { value: 320, rule: HeightRule.ATLEAST },
    children: [
      new TableCell({
        width: { size: 28, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        shading: shade ? { fill: ICE } : undefined,
        margins: { top: 60, bottom: 60, left: 80, right: 80 },
        borders: cellBorders({ bottom: true }),
        children: [p(label.toUpperCase(), { bold: true, size: 16, color: MUTED, caps: true })],
      }),
      new TableCell({
        width: { size: 72, type: WidthType.PERCENTAGE },
        verticalAlign: VerticalAlign.TOP,
        shading: shade ? { fill: ICE } : undefined,
        margins: { top: 60, bottom: 60, left: 80, right: 120 },
        borders: cellBorders({ bottom: true }),
        children: lines.map((line) => p(line, { size: 21 })),
      }),
    ],
  })
}

function numbered(items: string[]) {
  return items.map(
    (item, i) =>
      new Paragraph({
        spacing: { after: 80, line: 288 },
        children: [
          new TextRun({ text: `${i + 1}.  `, font: "Calibri", size: 21, bold: true, color: BLUE }),
          new TextRun({ text: item, font: "Calibri", size: 21, color: "253746" }),
        ],
      }),
  )
}

function bullets(items: string[]) {
  return items.map(
    (item) =>
      new Paragraph({
        spacing: { after: 60, line: 276 },
        children: [
          new TextRun({ text: "▸  ", font: "Calibri", size: 20, color: BLUE }),
          new TextRun({ text: item, font: "Calibri", size: 21, color: "253746" }),
        ],
      }),
  )
}

  const headerTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [3120, 4680, 2880],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 3120, type: WidthType.DXA },
            shading: { fill: NAVY },
            margins: { top: 80, bottom: 80, left: 120, right: 80 },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            children: [
              new Paragraph({
                children: [new TextRun({ text: "BOEING", font: "Calibri", size: 22, bold: true, color: "FFFFFF", characterSpacing: 120 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 4680, type: WidthType.DXA },
            shading: { fill: NAVY },
            margins: { top: 80, bottom: 80, left: 80, right: 80 },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ text: "MEETING PAPER", font: "Calibri", size: 22, bold: true, color: "FFFFFF", characterSpacing: 160 })],
              }),
            ],
          }),
          new TableCell({
            width: { size: 2880, type: WidthType.DXA },
            shading: { fill: NAVY },
            margins: { top: 80, bottom: 80, left: 80, right: 120 },
            borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [new TextRun({ text: "PROPRIETARY", font: "Calibri", size: 16, bold: true, color: "82D4F6", characterSpacing: 80 })],
              }),
            ],
          }),
        ],
      }),
    ],
  })

  const meta = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      kvRow("Date", paper.dateLabel, true),
      kvRow("Meeting", paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With ")),
      kvRow("Subtitle", paper.subtitle, true),
      kvRow("Location / event", paper.locationOrEvent),
      kvRow("Contact", `${paper.contact.name}, ${paper.contact.title}, ${paper.contact.phone}`, true),
      kvRow(
        "Customer",
        `${paper.customer.name}, ${paper.customer.title}\n“${paper.customer.salutation}” [${paper.customer.phonetic}]\nRAA: “${paper.customer.raa}”`,
      ),
    ],
  })

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 680, bottom: 720, left: 850, right: 850, header: 280, footer: 280 },
          },
        },
        headers: {
          default: new Header({
            children: [headerTable],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                border: { top: { style: BorderStyle.SINGLE, size: 8, color: NAVY, space: 8 } },
                spacing: { before: 80 },
                children: [
                  new TextRun({
                    text: `${paper.classification}  ·  ${paper.dateLabel}  ·  ${paper.fileName}`,
                    font: "Calibri",
                    size: 14,
                    color: MUTED,
                  }),
                  new TextRun({ text: "    ", font: "Calibri", size: 14 }),
                  new TextRun({ children: ["p. ", PageNumber.CURRENT], font: "Calibri", size: 14, color: MUTED }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({ spacing: { after: 80 }, children: [] }),
          p(paper.classification, { bold: true, size: 16, color: BLUE, caps: true }),
          new Paragraph({
            spacing: { before: 40, after: 160 },
            children: [
              new TextRun({
                text: paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With "),
                font: "Calibri",
                size: 36,
                bold: true,
                color: NAVY,
              }),
            ],
          }),
          p(paper.subtitle, { size: 20, color: MUTED }),
          new Paragraph({ spacing: { after: 120 }, children: [] }),
          meta,
          sectionLabel("Objectives"),
          ...numbered(paper.objectives),
          sectionLabel("Key messages"),
          ...numbered(paper.keyMessages.map((km) => (km.note ? `${km.message}  Note: ${km.note}` : km.message))),
          sectionLabel("Campaign background"),
          p(paper.campaignBackground, { size: 21 }),
          sectionLabel("Customer sat"),
          ...bullets(paper.customerSatIssues),
          sectionLabel("Engagement background"),
          p(paper.engagementBackground, { size: 21 }),
          sectionLabel("Biography"),
          p(`${paper.biography.name}, ${paper.biography.title}`, { bold: true, size: 21 }),
          p(paper.biography.text, { size: 21 }),
          sectionLabel("Open items — carry forward"),
          ...bullets(paper.openItems),
          sectionLabel("Commitments recorded"),
          ...bullets(paper.commitments),
        ],
      },
    ],
  })

  return Packer.toBlob(doc)
}

export async function downloadPriorMeetingPaper(paper: PriorMeetingPaper): Promise<void> {
  const blob = await buildPriorMeetingPaperDocx(paper)
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = paper.fileName
  a.click()
  URL.revokeObjectURL(a.href)
}
