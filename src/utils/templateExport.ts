import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import type { MeetingPaper } from "./meetingPaperGenerator"
import { injectWordComments } from "./wordComments"

function stem(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

/** Drop numbered/list paragraphs that have no visible text (template fluff bullets). */
export function stripEmptyListParagraphs(zip: PizZip): void {
  const docPath = "word/document.xml"
  const file = zip.file(docPath)
  if (!file) return

  let xml = file.asText()
  const out: string[] = []
  let i = 0
  let removed = 0

  while (i < xml.length) {
    const start = xml.indexOf("<w:p", i)
    if (start < 0) {
      out.push(xml.slice(i))
      break
    }
    out.push(xml.slice(i, start))
    const after = xml[start + 4]
    // Only real <w:p> / <w:p …> — not w:pPr, w:pgSz, etc.
    if (after !== ">" && after !== " " && after !== "\n" && after !== "\r" && after !== "\t") {
      out.push(xml.slice(start, start + 4))
      i = start + 4
      continue
    }
    const end = xml.indexOf("</w:p>", start)
    if (end < 0) {
      out.push(xml.slice(start))
      break
    }
    const close = end + "</w:p>".length
    const pXml = xml.slice(start, close)
    const hasNum = pXml.includes("<w:numPr")
    const texts: string[] = []
    let cursor = 0
    while (true) {
      const tStart = pXml.indexOf("<w:t", cursor)
      if (tStart < 0) break
      const gt = pXml.indexOf(">", tStart)
      if (gt < 0) break
      const tEnd = pXml.indexOf("</w:t>", gt)
      if (tEnd < 0) break
      texts.push(pXml.slice(gt + 1, tEnd))
      cursor = tEnd + 6
    }
    if (hasNum && !texts.join("").trim()) {
      removed += 1
    } else {
      out.push(pXml)
    }
    i = close
  }

  if (removed > 0) {
    zip.file(docPath, out.join(""))
  }
}

/** Build a filled Meeting Paper .docx as ArrayBuffer (for in-browser editor). */
export async function buildMeetingPaperDocx(paper: MeetingPaper): Promise<ArrayBuffer> {
  const isAirShow = /air show|airshow|bilateral|chalet|mspo/i.test(paper.locationOrEvent)
  const templatePath = isAirShow
    ? "/templates/meeting-paper-airshow-fillable.docx"
    : "/templates/meeting-paper-fillable.docx"
  const res = await fetch(templatePath)
  if (!res.ok) throw new Error("Meeting paper template missing")
  const buf = await res.arrayBuffer()
  const templateZip = new PizZip(buf)
  const doc = new Docxtemplater(templateZip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: "{{", end: "}}" },
  })

  const customerLines = [
    `${paper.customer.name}, ${paper.customer.title}`,
    `“${paper.customer.salutation}” [${paper.customer.phonetic}]`,
    `RAA: “${paper.customer.raa}”`,
  ]

  const keyMessages = paper.keyMessages.map((km) =>
    km.note ? `${km.message}\nNote: ${km.note}` : km.message,
  )

  const biography = `${paper.biography.name}, ${paper.biography.title}\n${paper.biography.text}`
  const meetingTitle = paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With ")

  const data: Record<string, unknown> = {
    date_label: paper.dateLabel,
    meeting_title: meetingTitle,
    subtitle: paper.subtitle,
    location_or_event: paper.locationOrEvent,
    contact: `${paper.contact.name}, ${paper.contact.title}, ${paper.contact.phone}`,
    customer_lines: customerLines,
    objectives: paper.objectives.filter((o) => o.trim()),
    key_messages: keyMessages.filter((m) => m.trim()),
    campaign_background: paper.campaignBackground,
    cust_sat: paper.customerSatIssues.filter((s) => s.trim()),
    engagement_background: paper.engagementBackground,
    biography,
  }

  if (!isAirShow) {
    data.agenda = paper.agendaLogistics || ""
  }

  doc.render(data)

  const outZip = doc.getZip()
  stripEmptyListParagraphs(outZip)
  injectWordComments(outZip, paper.reviewComments ?? [])

  return outZip.generate({ type: "arraybuffer" }) as ArrayBuffer
}

export async function exportMeetingPaperDocx(paper: MeetingPaper): Promise<void> {
  const buf = await buildMeetingPaperDocx(paper)
  const out = new Blob([new Uint8Array(buf)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(out)
  a.download = `Meeting-Paper-${stem(paper.biography.name)}.docx`
  a.click()
  URL.revokeObjectURL(a.href)
}

export interface AirshowReportData {
  showName: string
  executiveSummary: string
  regionLabel: string
  engagementTitle: string
  engagementBody: string
}

/** Build a filled Air Show Report .docx as ArrayBuffer (for in-browser editor). */
export async function buildAirshowReportDocx(data: AirshowReportData): Promise<ArrayBuffer> {
  const res = await fetch("/templates/airshow-report-fillable.docx")
  if (!res.ok) throw new Error("Air show report template missing")
  const buf = await res.arrayBuffer()
  const zip = new PizZip(buf)
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    delimiters: { start: "{{", end: "}}" },
  })

  doc.render({
    show_name: data.showName,
    executive_summary: data.executiveSummary,
    region_label: data.regionLabel,
    eng_title: data.engagementTitle,
    eng_body: data.engagementBody,
  })

  return doc.getZip().generate({ type: "arraybuffer" }) as ArrayBuffer
}

export async function exportAirshowReportDocx(data: AirshowReportData): Promise<void> {
  const buf = await buildAirshowReportDocx(data)
  const out = new Blob([new Uint8Array(buf)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(out)
  a.download = `${stem(data.showName)}-Summary-Report.docx`
  a.click()
  URL.revokeObjectURL(a.href)
}
