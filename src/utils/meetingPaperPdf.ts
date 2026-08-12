import { jsPDF } from "jspdf"
import type { MeetingPaper } from "./meetingPaperGenerator"

/** Letter page, matching BDS/BGS Meeting Paper Airshow template. */
const PAGE_W = 215.9 // mm
const PAGE_H = 279.4
const MARGIN_L = 19.05 // 0.75in
const MARGIN_R = 19.05
const MARGIN_T = 20.32 // 0.8in
const MARGIN_B = 17.78 // 0.7in
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R
const LABEL_W = 25.1 // ~1422 DXA
const VALUE_W = CONTENT_W - LABEL_W
const BLUE: [number, number, number] = [0, 0, 255]
const FONT = "helvetica" // Arial Narrow unavailable in jsPDF standard fonts

function drawHeader(doc: jsPDF, dateLabel: string, y: number): number {
  doc.setFont(FONT, "normal")
  doc.setFontSize(11)
  doc.setTextColor(0, 0, 0)
  doc.text(dateLabel, MARGIN_L, y)
  doc.setFont(FONT, "bold")
  doc.setFontSize(12)
  doc.text("BOEING", PAGE_W - MARGIN_R, y, { align: "right" })
  return y + 10
}

function drawTitles(doc: jsPDF, paper: MeetingPaper, y: number): number {
  doc.setFont(FONT, "bold")
  doc.setFontSize(10.5)
  doc.setTextColor(BLUE[0], BLUE[1], BLUE[2])
  const title = paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With ")
  doc.text(title, PAGE_W / 2, y, { align: "center" })
  y += 5.5
  doc.text(paper.subtitle, PAGE_W / 2, y, { align: "center" })
  y += 5.5
  doc.text(paper.locationOrEvent, PAGE_W / 2, y, { align: "center" })
  return y + 8
}

function wrap(doc: jsPDF, text: string, maxW: number, fontSize: number): string[] {
  doc.setFontSize(fontSize)
  return doc.splitTextToSize(text, maxW) as string[]
}

function drawRow(
  doc: jsPDF,
  label: string,
  value: string,
  y: number,
  opts?: { labelLines?: string[] },
): number {
  const pad = 1.5
  const fontSize = 10.5
  const lineH = 4.2

  doc.setFont(FONT, "bold")
  const labelParts = [label, ...(opts?.labelLines || [])]
  const labelWrapped: string[] = []
  for (const part of labelParts) {
    labelWrapped.push(...wrap(doc, part, LABEL_W - pad * 2, fontSize))
  }

  doc.setFont(FONT, "normal")
  const valueLines = value
    .split("\n")
    .flatMap((line) => (line.trim() === "" ? [""] : wrap(doc, line, VALUE_W - pad * 2, fontSize)))

  const rowsNeeded = Math.max(labelWrapped.length, valueLines.length, 1)
  const boxH = Math.max(rowsNeeded * lineH + pad * 2, 8)

  // page break
  if (y + boxH > PAGE_H - MARGIN_B - 12) {
    doc.addPage()
    y = MARGIN_T
  }

  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.25)
  doc.rect(MARGIN_L, y, LABEL_W, boxH)
  doc.rect(MARGIN_L + LABEL_W, y, VALUE_W, boxH)

  doc.setFont(FONT, "bold")
  doc.setFontSize(fontSize)
  doc.setTextColor(0, 0, 0)
  let ly = y + pad + 3.5
  for (const line of labelWrapped) {
    doc.text(line, MARGIN_L + pad, ly)
    ly += lineH
  }

  doc.setFont(FONT, "normal")
  let vy = y + pad + 3.5
  for (const line of valueLines) {
    doc.text(line, MARGIN_L + LABEL_W + pad, vy)
    vy += lineH
  }

  return y + boxH
}

function drawFooter(doc: jsPDF) {
  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFont(FONT, "bold")
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("BOEING PROPRIETARY", PAGE_W / 2, PAGE_H - 10, { align: "center" })
  }
}

export async function exportMeetingPaperPDF(paper: MeetingPaper, fileStem: string): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "letter" })
  let y = MARGIN_T

  y = drawHeader(doc, paper.dateLabel, y)
  y = drawTitles(doc, paper, y)

  const isAirShow = /air show|airshow|bilateral|chalet|mspo/i.test(paper.locationOrEvent)

  y = drawRow(
    doc,
    "Contact",
    `${paper.contact.name}, ${paper.contact.title}, ${paper.contact.phone}`,
    y,
  )
  y = drawRow(
    doc,
    "Customer(s) Salutation & Customer RAA",
    [
      `${paper.customer.name}, ${paper.customer.title}`,
      `“${paper.customer.salutation}” [${paper.customer.phonetic}]`,
      `RAA: “${paper.customer.raa}”`,
    ].join("\n"),
    y,
  )
  y = drawRow(doc, "Objectives", paper.objectives.join("\n"), y)
  y = drawRow(
    doc,
    "Key Messages",
    paper.keyMessages.map((km) => (km.note ? `${km.message}\nNote: ${km.note}` : km.message)).join("\n"),
    y,
  )

  if (!isAirShow && paper.agendaLogistics) {
    y = drawRow(doc, "Agenda/", paper.agendaLogistics, y, { labelLines: ["Logistics"] })
  }

  y = drawRow(doc, "Campaign Background", paper.campaignBackground, y)
  y = drawRow(doc, "Potential Customer Sat", paper.customerSatIssues.join("\n"), y, {
    labelLines: ["Issues"],
  })
  y = drawRow(doc, "Engagement Background", paper.engagementBackground, y)
  y = drawRow(
    doc,
    "Biography",
    `${paper.biography.name}, ${paper.biography.title}\n${paper.biography.text}`,
    y,
  )

  drawFooter(doc)
  doc.save(`Meeting-Paper-${fileStem.toLowerCase().replace(/\s+/g, "-")}.pdf`)
}
