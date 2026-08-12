import Docxtemplater from "docxtemplater"
import PizZip from "pizzip"
import type { MeetingPaper } from "./meetingPaperGenerator"
import { injectWordComments } from "./wordComments"

function stem(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export async function exportMeetingPaperDocx(paper: MeetingPaper): Promise<void> {
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

  const customerBlock = [
    `${paper.customer.name}, ${paper.customer.title}`,
    `“${paper.customer.salutation}” [${paper.customer.phonetic}]`,
    `RAA: “${paper.customer.raa}”`,
  ].join("\n")

  const objectives = paper.objectives.join("\n")
  const keyMessages = paper.keyMessages
    .map((km) => (km.note ? `${km.message}\nNote: ${km.note}` : km.message))
    .join("\n")

  const biography = `${paper.biography.name}, ${paper.biography.title}\n${paper.biography.text}`
  const meetingTitle = paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With ")

  const data: Record<string, string> = {
    date_label: paper.dateLabel,
    meeting_title: meetingTitle,
    subtitle: paper.subtitle,
    location_or_event: paper.locationOrEvent,
    contact: `${paper.contact.name}, ${paper.contact.title}, ${paper.contact.phone}`,
    customer_block: customerBlock,
    objectives,
    key_messages: keyMessages,
    campaign_background: paper.campaignBackground,
    cust_sat: paper.customerSatIssues.join("\n"),
    engagement_background: paper.engagementBackground,
    biography,
  }

  if (!isAirShow) {
    data.agenda = paper.agendaLogistics || ""
  }

  doc.render(data)

  const outZip = doc.getZip()
  injectWordComments(outZip, paper.reviewComments ?? [])

  const out = outZip.generate({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
