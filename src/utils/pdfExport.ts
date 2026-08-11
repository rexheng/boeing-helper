import { jsPDF } from "jspdf"
import type { ResearchResult } from "../types/research"
import type { FrameworksData } from "../types/frameworks"
import type { MeetingBriefing } from "./briefingGenerator"

interface PdfData {
  personName: string
  personTitle: string
  companyName: string
  meetingType: string
  research: ResearchResult
  briefing: MeetingBriefing
  frameworks?: FrameworksData | null
  internalNotes?: string
}

// Colors — Boeing palette
const NAVY = [10, 34, 64] as const
const BLUE = [0, 51, 161] as const
const GRAY = [102, 115, 126] as const
const DARK = [37, 55, 70] as const
const LIGHT_BG = [243, 244, 245] as const
const GREEN = [46, 125, 50] as const
const RED = [198, 40, 40] as const
const AMBER = [178, 106, 0] as const

const PAGE_W = 210
const MARGIN = 20
const CONTENT_W = PAGE_W - MARGIN * 2
const LINE_H = 5.5

function setColor(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2])
}

function checkPage(doc: jsPDF, y: number, needed: number): number {
  if (y + needed > 275) {
    doc.addPage()
    return 25
  }
  return y
}

function drawSectionHeader(doc: jsPDF, title: string, y: number): number {
  y = checkPage(doc, y, 15)
  setColor(doc, BLUE)
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text(title, MARGIN, y)
  y += 2
  doc.setDrawColor(BLUE[0], BLUE[1], BLUE[2])
  doc.setLineWidth(0.5)
  doc.line(MARGIN, y, MARGIN + CONTENT_W, y)
  return y + 6
}

function drawWrappedText(doc: jsPDF, text: string, x: number, y: number, maxW: number, fontSize: number, color: readonly [number, number, number], style: string = "normal"): number {
  doc.setFontSize(fontSize)
  doc.setFont("helvetica", style)
  setColor(doc, color)
  const lines = doc.splitTextToSize(text, maxW)
  for (const line of lines) {
    y = checkPage(doc, y, LINE_H)
    doc.text(line, x, y)
    y += LINE_H
  }
  return y
}

function drawBullet(doc: jsPDF, text: string, x: number, y: number, maxW: number, bulletColor: readonly [number, number, number] = BLUE): number {
  y = checkPage(doc, y, LINE_H)
  doc.setFillColor(bulletColor[0], bulletColor[1], bulletColor[2])
  doc.circle(x + 1.5, y - 1.5, 1, "F")
  return drawWrappedText(doc, text, x + 5, y, maxW - 5, 9, DARK)
}

function drawNumberedItem(doc: jsPDF, text: string, num: number, x: number, y: number, maxW: number): number {
  y = checkPage(doc, y, LINE_H)
  doc.setFillColor(BLUE[0], BLUE[1], BLUE[2])
  doc.roundedRect(x, y - 4, 5, 5, 1, 1, "F")
  doc.setFontSize(7)
  doc.setFont("helvetica", "bold")
  setColor(doc, [255, 255, 255])
  doc.text(String(num), x + 1.8, y - 0.5)
  return drawWrappedText(doc, text, x + 8, y, maxW - 8, 9, DARK)
}

export async function exportBriefingPDF(_element: HTMLElement, personName: string, data?: PdfData): Promise<void> {
  if (!data) return

  const doc = new jsPDF({ unit: "mm", format: "a4" })
  let y = 20

  // --- Header ---
  doc.setFillColor(NAVY[0], NAVY[1], NAVY[2])
  doc.rect(0, 0, PAGE_W, 45, "F")

  setColor(doc, [130, 212, 246])
  doc.setFontSize(8)
  doc.setFont("helvetica", "bold")
  doc.text("BOEING HELPER", MARGIN, 12)

  setColor(doc, [255, 255, 255])
  doc.setFontSize(22)
  doc.setFont("helvetica", "bold")
  doc.text("Meeting Briefing", MARGIN, 22)

  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  doc.text(`${data.meetingType} with ${data.personName}`, MARGIN, 30)

  setColor(doc, [170, 195, 225])
  doc.setFontSize(9)
  const countryName = data.research.country?.name
  const headerMeta = [data.personTitle, data.companyName, countryName, new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })]
    .filter(Boolean)
    .join("  |  ")
  doc.text(headerMeta, MARGIN, 37)

  doc.setFontSize(7)
  doc.text("Internal use only — verify export-controlled detail before sharing", MARGIN, 42)

  y = 55

  // --- Briefing Summary ---
  y = drawSectionHeader(doc, "Executive Summary", y)
  y = drawWrappedText(doc, data.briefing.summary, MARGIN, y, CONTENT_W, 10, DARK)
  y += 4

  // --- Suggested Agenda ---
  y = drawSectionHeader(doc, "Suggested Agenda", y)
  for (let i = 0; i < data.briefing.agenda.length; i++) {
    y = drawNumberedItem(doc, data.briefing.agenda[i], i + 1, MARGIN, y, CONTENT_W)
    y += 1
  }
  y += 4

  // --- Key Questions ---
  y = drawSectionHeader(doc, "Key Questions", y)
  for (const q of data.briefing.questions) {
    y = drawWrappedText(doc, `"${q}"`, MARGIN + 3, y, CONTENT_W - 3, 9, DARK, "italic")
    y += 1
  }
  y += 4

  // --- Person Profile ---
  y = drawSectionHeader(doc, `About ${data.personName}`, y)

  // Name + title badge
  doc.setFillColor(BLUE[0], BLUE[1], BLUE[2])
  doc.circle(MARGIN + 5, y + 1, 5, "F")
  setColor(doc, [255, 255, 255])
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text(data.personName.charAt(0), MARGIN + 3.2, y + 3.8)

  setColor(doc, NAVY)
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.text(data.personName, MARGIN + 14, y + 1)

  setColor(doc, GRAY)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(data.personTitle, MARGIN + 14, y + 6)
  y += 12

  if (data.research.person.background) {
    y = drawWrappedText(doc, data.research.person.background, MARGIN, y, CONTENT_W, 9, DARK)
    y += 3
  }

  if (data.research.person.linkedin_posts.length > 0) {
    setColor(doc, GRAY)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text("RECENT POSTS", MARGIN, y)
    y += 4
    for (const post of data.research.person.linkedin_posts.slice(0, 3)) {
      y = checkPage(doc, y, 10)
      // Left border line
      doc.setDrawColor(BLUE[0], BLUE[1], BLUE[2])
      doc.setLineWidth(0.6)
      const startY = y
      const postY = drawWrappedText(doc, post.text, MARGIN + 5, y, CONTENT_W - 5, 8.5, DARK, "italic")
      doc.line(MARGIN + 1, startY - 2, MARGIN + 1, postY - 2)
      if (post.date) {
        setColor(doc, GRAY)
        doc.setFontSize(7)
        doc.text(post.date, MARGIN + 5, postY)
        y = postY + 3
      } else {
        y = postY + 1
      }
    }
    y += 2
  }

  // --- Company ---
  y = drawSectionHeader(doc, `About ${data.companyName}`, y)
  if (data.research.company.overview) {
    y = drawWrappedText(doc, data.research.company.overview, MARGIN, y, CONTENT_W, 9, DARK)
    y += 4
  }

  // Key Metrics
  const metrics = data.research.company.key_metrics
  if (metrics.length > 0) {
    y = checkPage(doc, y, 20)
    setColor(doc, GRAY)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text("KEY METRICS", MARGIN, y)
    y += 5

    const colW = CONTENT_W / Math.min(metrics.length, 4)
    for (let i = 0; i < Math.min(metrics.length, 4); i++) {
      const x = MARGIN + i * colW
      doc.setFillColor(LIGHT_BG[0], LIGHT_BG[1], LIGHT_BG[2])
      doc.roundedRect(x, y - 3, colW - 3, 14, 2, 2, "F")

      setColor(doc, NAVY)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text(metrics[i].value, x + (colW - 3) / 2, y + 3, { align: "center" })

      setColor(doc, GRAY)
      doc.setFontSize(7)
      doc.setFont("helvetica", "normal")
      doc.text(metrics[i].label, x + (colW - 3) / 2, y + 8, { align: "center" })
    }
    y += 18
  }

  // Recent News
  const news = data.research.company.recent_news
  if (news.length > 0) {
    y = checkPage(doc, y, 15)
    setColor(doc, GRAY)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text("RECENT NEWS", MARGIN, y)
    y += 5
    for (const item of news.slice(0, 4)) {
      y = checkPage(doc, y, 8)
      y = drawWrappedText(doc, item.headline, MARGIN + 3, y, CONTENT_W - 3, 9, NAVY, "bold")
      setColor(doc, GRAY)
      doc.setFontSize(7)
      doc.text(`${item.source}${item.date ? ` — ${item.date}` : ""}`, MARGIN + 3, y)
      y += 5
    }
    y += 2
  }

  // --- Industry ---
  const { industry } = data.research
  if (industry.trends.length > 0 || industry.competitive_context) {
    y = drawSectionHeader(doc, "Industry Landscape", y)
    if (industry.trends.length > 0) {
      setColor(doc, GRAY)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text("TRENDS", MARGIN, y)
      y += 5
      for (const trend of industry.trends) {
        y = drawBullet(doc, trend, MARGIN, y, CONTENT_W)
        y += 1
      }
      y += 2
    }
    if (industry.competitive_context) {
      setColor(doc, GRAY)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text("COMPETITIVE CONTEXT", MARGIN, y)
      y += 5
      y = drawWrappedText(doc, industry.competitive_context, MARGIN, y, CONTENT_W, 9, DARK)
      y += 4
    }
  }

  // --- Country Context ---
  const country = data.research.country
  if (country && (country.overview || country.priorities?.length || country.bilateral_context || country.concerns?.length)) {
    y = drawSectionHeader(doc, `Country Context${country.name ? ` — ${country.name}` : ""}`, y)

    if (country.overview) {
      y = drawWrappedText(doc, country.overview, MARGIN, y, CONTENT_W, 9, DARK)
      y += 4
    }

    if (country.priorities?.length) {
      y = checkPage(doc, y, 12)
      setColor(doc, GRAY)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text("NATIONAL PRIORITIES", MARGIN, y)
      y += 5
      for (let i = 0; i < country.priorities.length; i++) {
        y = drawNumberedItem(doc, country.priorities[i], i + 1, MARGIN, y, CONTENT_W)
        y += 1
      }
      y += 3
    }

    if (country.bilateral_context) {
      y = checkPage(doc, y, 20)
      setColor(doc, GRAY)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text("BILATERAL CONTEXT", MARGIN, y)
      y += 5
      const startY = y
      const endY = drawWrappedText(doc, country.bilateral_context, MARGIN + 5, y, CONTENT_W - 5, 9, DARK)
      doc.setDrawColor(BLUE[0], BLUE[1], BLUE[2])
      doc.setLineWidth(0.8)
      doc.line(MARGIN + 1, startY - 3, MARGIN + 1, endY - 3)
      y = endY + 4
    }

    if (country.concerns?.length) {
      y = checkPage(doc, y, 12)
      setColor(doc, GRAY)
      doc.setFontSize(8)
      doc.setFont("helvetica", "bold")
      doc.text("SENSITIVITIES TO HANDLE CAREFULLY", MARGIN, y)
      y += 5
      for (const concern of country.concerns) {
        y = drawBullet(doc, concern, MARGIN, y, CONTENT_W, AMBER)
        y += 1
      }
      y += 3
    }
  }

  // --- Strategic Frameworks ---
  if (data.frameworks) {
    y = drawSectionHeader(doc, "Strategic Frameworks", y)

    // SWOT
    setColor(doc, GRAY)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text("SWOT ANALYSIS", MARGIN, y)
    y += 5

    const swotQuadrants: { key: keyof FrameworksData["swot"]; label: string; color: readonly [number, number, number] }[] = [
      { key: "strengths", label: "Strengths", color: GREEN },
      { key: "weaknesses", label: "Weaknesses", color: RED },
      { key: "opportunities", label: "Opportunities", color: BLUE },
      { key: "threats", label: "Threats", color: AMBER },
    ]

    const quadW = CONTENT_W / 2 - 2
    for (let row = 0; row < 2; row++) {
      y = checkPage(doc, y, 25)
      const rowY = y
      let maxY = y

      for (let col = 0; col < 2; col++) {
        const q = swotQuadrants[row * 2 + col]
        const x = MARGIN + col * (quadW + 4)
        let qy = rowY

        // Left border
        doc.setDrawColor(q.color[0], q.color[1], q.color[2])
        doc.setLineWidth(0.8)
        doc.line(x, qy - 2, x, qy + 18)

        setColor(doc, q.color)
        doc.setFontSize(8)
        doc.setFont("helvetica", "bold")
        doc.text(q.label.toUpperCase(), x + 3, qy)
        qy += 4

        for (const item of data.frameworks!.swot[q.key]) {
          qy = drawWrappedText(doc, item, x + 3, qy, quadW - 5, 8, DARK)
          qy += 1
        }
        if (qy > maxY) maxY = qy
      }
      y = maxY + 4
    }

    // Porter's Five Forces
    y += 2
    y = checkPage(doc, y, 15)
    setColor(doc, GRAY)
    doc.setFontSize(8)
    doc.setFont("helvetica", "bold")
    doc.text("PORTER'S FIVE FORCES", MARGIN, y)
    y += 5

    const forces: [string, { level: string; factors: string[] }][] = [
      ["Competitive Rivalry", data.frameworks.porters.competitiveRivalry],
      ["Threat of New Entrants", data.frameworks.porters.threatOfNewEntrants],
      ["Buyer Power", data.frameworks.porters.bargainingPowerBuyers],
      ["Supplier Power", data.frameworks.porters.bargainingPowerSuppliers],
      ["Threat of Substitutes", data.frameworks.porters.threatOfSubstitutes],
    ]

    for (const [name, force] of forces) {
      y = checkPage(doc, y, 10)
      setColor(doc, NAVY)
      doc.setFontSize(9)
      doc.setFont("helvetica", "bold")
      doc.text(name, MARGIN + 3, y)

      // Level badge
      const levelColor = force.level === "High" ? RED : force.level === "Medium" ? AMBER : GREEN
      setColor(doc, levelColor)
      doc.setFontSize(7)
      doc.setFont("helvetica", "bold")
      doc.text(force.level, MARGIN + CONTENT_W - 5, y, { align: "right" })
      y += 4

      for (const f of force.factors) {
        y = drawWrappedText(doc, f, MARGIN + 6, y, CONTENT_W - 6, 8, DARK)
      }
      y += 3
    }
  }

  // --- Internal Notes ---
  if (data.internalNotes) {
    y = drawSectionHeader(doc, "Internal Notes", y)
    y = drawWrappedText(doc, data.internalNotes, MARGIN, y, CONTENT_W, 9, DARK)
  }

  // --- Footer on each page ---
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    setColor(doc, [180, 180, 180])
    doc.setFontSize(7)
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W / 2, 290, { align: "center" })
    doc.text("Confidential — Boeing Helper · Internal Use", MARGIN, 290)
  }

  doc.save(`briefing-${personName.toLowerCase().replace(/ /g, "-")}.pdf`)
}
