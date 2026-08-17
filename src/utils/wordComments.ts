import type PizZip from "pizzip"
import type { ReviewComment } from "./meetingPaperGenerator"

/**
 * Inject Word review comments into a docxtemplater-rendered docx (PizZip).
 * Comments appear in Word's Review pane — not as visible body text.
 */
export function injectWordComments(
  zip: PizZip,
  comments: ReviewComment[],
  author = "Boeing Helper",
): void {
  if (!comments.length) return

  const docPath = "word/document.xml"
  const docFile = zip.file(docPath)
  if (!docFile) return

  let documentXml = docFile.asText()
  const now = new Date().toISOString()

  const commentItems = comments
    .map(
      (c, i) => `
    <w:comment w:id="${i}" w:author="${escapeXml(author)}" w:date="${now}" w:initials="BH">
      <w:p>
        <w:pPr><w:pStyle w:val="CommentText"/></w:pPr>
        <w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr></w:r>
        <w:r><w:t>${escapeXml(c.text)}</w:t></w:r>
      </w:p>
    </w:comment>`,
    )
    .join("")

  const commentsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:comments xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
${commentItems}
</w:comments>`

  zip.file("word/comments.xml", commentsXml)

  // Content types
  const ctPath = "[Content_Types].xml"
  const ctFile = zip.file(ctPath)
  if (ctFile) {
    let ct = ctFile.asText()
    if (!ct.includes('PartName="/word/comments.xml"')) {
      ct = ct.replace(
        "</Types>",
        `<Override PartName="/word/comments.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml"/></Types>`,
      )
      zip.file(ctPath, ct)
    }
  }

  // Relationships
  const relsPath = "word/_rels/document.xml.rels"
  const relsFile = zip.file(relsPath)
  if (relsFile) {
    let rels = relsFile.asText()
    if (!rels.includes("comments.xml")) {
      const rid = `rIdComment${Date.now()}`
      rels = rels.replace(
        "</Relationships>",
        `<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="comments.xml"/></Relationships>`,
      )
      zip.file(relsPath, rels)
    }
  }

  // Anchor each comment near a matching field marker or at end of body
  comments.forEach((c, i) => {
    const marker = findAnchorSpot(documentXml, c.anchor)
    if (!marker) return
    const insertAt = marker.index + marker.length
    const bookmark = `<w:commentRangeStart w:id="${i}"/><w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="${i}"/></w:r><w:commentRangeEnd w:id="${i}"/>`
    documentXml = documentXml.slice(0, insertAt) + bookmark + documentXml.slice(insertAt)
  })

  // Fallback: if no anchors matched, attach all at end of document body
  if (!documentXml.includes("w:commentReference")) {
    const bodyClose = documentXml.lastIndexOf("</w:body>")
    if (bodyClose !== -1) {
      const block = comments
        .map(
          (_c, i) =>
            `<w:p><w:r><w:t xml:space="preserve"> </w:t></w:r><w:commentRangeStart w:id="${i}"/><w:r><w:rPr><w:rStyle w:val="CommentReference"/></w:rPr><w:commentReference w:id="${i}"/></w:r><w:commentRangeEnd w:id="${i}"/></w:p>`,
        )
        .join("")
      documentXml = documentXml.slice(0, bodyClose) + block + documentXml.slice(bodyClose)
    }
  }

  zip.file(docPath, documentXml)
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function findAnchorSpot(xml: string, anchor: string): { index: number; length: number } | null {
  const needles: Record<string, string[]> = {
    contact: ["Contact", "CONTACT", "Rex Heng"],
    customer: ["Customer", "CUSTOMER", "Salutation"],
    objectives: ["Objective", "OBJECTIVES", "Objectives"],
    key_messages: ["Key Message", "KEY MESSAGE", "Key messages"],
    engagement_background: ["Engagement", "ENGAGEMENT", "Background"],
    campaign_background: ["Campaign", "CAMPAIGN"],
    cust_sat: ["Customer Sat", "CUST SAT", "Satisfaction", "Issues"],
    biography: ["Biography", "BIOGRAPHY"],
    agenda: ["Agenda", "AGENDA", "Logistics"],
  }
  const list = needles[anchor] ?? [anchor]
  for (const n of list) {
    const idx = xml.indexOf(n)
    if (idx !== -1) {
      // find end of containing <w:t>...</w:t> or just after the match
      const close = xml.indexOf("</w:t>", idx)
      if (close !== -1) return { index: close + "</w:t>".length, length: 0 }
      return { index: idx + n.length, length: 0 }
    }
  }
  return null
}
