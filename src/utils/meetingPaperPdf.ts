import { jsPDF } from "jspdf"
import type { MeetingPaper } from "./meetingPaperGenerator"

const NAVY: [number, number, number] = [10, 34, 64]
const BLUE: [number, number, number] = [0, 51, 161]
const DARK: [number, number, number] = [37, 55, 70]
const GRAY: [number, number, number] = [102, 115, 126]

const PAGE_W = 210
const MARGIN = 20
const CONTENT_W = PAGE_W - MARGIN * 2

function checkPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage()
    return 22
  }
  return y
}

function section(doc: jsPDF, label: string, y: number): number {
  y = checkPage(doc, y, 14)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  doc.setTextColor(BLUE[0], BLUE[1], BLUE[2])
  doc.text(label.toUpperCase(), MARGIN, y)
  return y + 5
}

function body(doc: jsPDF, text: string, y: number, size = 10): number {
  doc.setFont("helvetica", "normal")
  doc.setFontSize(size)
  doc.setTextColor(DARK[0], DARK[1], DARK[2])
  const lines = doc.splitTextToSize(text, CONTENT_W)
  for (const line of lines) {
    y = checkPage(doc, y, 5.5)
    doc.text(line, MARGIN, y)
    y += 5.5
  }
  return y + 3
}

export async function exportMeetingPaperPDF(paper: MeetingPaper, fileStem: string): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  let y = 18

  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.text(paper.dateLabel, MARGIN, y)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.setTextColor(NAVY[0], NAVY[1], NAVY[2])
  doc.text("BOEING", PAGE_W - MARGIN, y, { align: "right" })
  y += 12

  doc.setFont("helvetica", "bold")
  doc.setFontSize(14)
  doc.setTextColor(BLUE[0], BLUE[1], BLUE[2])
  doc.text(paper.meetingTitle, PAGE_W / 2, y, { align: "center" })
  y += 7
  doc.setFontSize(11)
  doc.text(paper.subtitle, PAGE_W / 2, y, { align: "center" })
  y += 6
  doc.setFont("helvetica", "normal")
  doc.text(paper.locationOrEvent, PAGE_W / 2, y, { align: "center" })
  y += 10

  doc.setDrawColor(BLUE[0], BLUE[1], BLUE[2])
  doc.setLineWidth(0.4)
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  y += 8

  y = section(doc, "Contact", y)
  y = body(doc, `${paper.contact.name}\n${paper.contact.title}\n${paper.contact.phone}`, y)

  y = section(doc, "Customer, salutation & RAA", y)
  y = body(
    doc,
    `${paper.customer.name} — ${paper.customer.title}\nSalutation: ${paper.customer.salutation} [${paper.customer.phonetic}]\nRAA: ${paper.customer.raa}`,
    y,
  )

  y = section(doc, "Objectives", y)
  for (let i = 0; i < paper.objectives.length; i++) {
    y = body(doc, `${i + 1}. ${paper.objectives[i]}`, y)
  }

  y = section(doc, "Key messages", y)
  for (let i = 0; i < paper.keyMessages.length; i++) {
    const km = paper.keyMessages[i]
    y = body(doc, `${i + 1}. ${km.message}`, y)
    if (km.note) y = body(doc, `Note: ${km.note}`, y, 9)
  }

  if (paper.agendaLogistics) {
    y = section(doc, "Agenda / logistics", y)
    y = body(doc, paper.agendaLogistics, y)
  }

  y = section(doc, "Campaign background", y)
  y = body(doc, paper.campaignBackground, y)

  y = section(doc, "Potential customer sat issues", y)
  for (const issue of paper.customerSatIssues) {
    y = body(doc, `• ${issue}`, y)
  }

  y = section(doc, "Engagement background", y)
  y = body(doc, paper.engagementBackground, y)

  y = section(doc, "Biography", y)
  y = body(doc, `${paper.biography.name}\n${paper.biography.title}\n${paper.biography.text}`, y)

  y = checkPage(doc, y, 12)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(GRAY[0], GRAY[1], GRAY[2])
  doc.text("BOEING PROPRIETARY", PAGE_W / 2, Math.max(y + 8, 285), { align: "center" })

  doc.save(`meeting-paper-${fileStem.toLowerCase().replace(/\s+/g, "-")}.pdf`)
}
