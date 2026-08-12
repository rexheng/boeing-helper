import type { Request, Response } from "express"
import Groq from "groq-sdk"

function extractJson(raw: string): Record<string, unknown> | null {
  const fenceMatch = raw.match(/```(?:json)?\n?([\s\S]*?)```/)
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()) } catch { /* continue */ }
  }
  try { return JSON.parse(raw.trim()) } catch { /* continue */ }
  const braceStart = raw.indexOf("{")
  const braceEnd = raw.lastIndexOf("}")
  if (braceStart !== -1 && braceEnd > braceStart) {
    try { return JSON.parse(raw.slice(braceStart, braceEnd + 1)) } catch { /* continue */ }
  }
  return null
}

type Travel = "I" | "D" | "L" | ""

interface AttendeeRoleRow {
  id: string
  roleLabel: string
  name: string
  organization?: string
  travel: Travel
  notes?: string
  count: number
}

interface AttendeeDashboardData {
  eventName: string
  eventTitle: string
  revisedLabel: string
  objectives: { rank: number; text: string; bdsLead: string }[]
  travelCounts: { I: number; D: number; L: number }
  columns: {
    id: string
    title: string
    accent: string
    subsections: { id: string; title: string; rows: AttendeeRoleRow[] }[]
  }[]
}

interface AirshowReportData {
  showName: string
  executiveSummary: string
  regionLabel: string
  engagementTitle: string
  engagementBody: string
}

interface Hunk {
  id: string
  path: string
  field: string
  before: string
  after: string
  op: "update" | "add" | "remove"
}

function recountTravel(columns: AttendeeDashboardData["columns"]) {
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

function buildAttendeePrompt(
  paste: string,
  current: AttendeeDashboardData,
  context?: Record<string, unknown>,
) {
  const flat = current.columns.flatMap((col) =>
    col.subsections.flatMap((sub) =>
      sub.rows.map((r) => ({
        sectionId: col.id,
        section: col.title,
        subsectionId: sub.id,
        subsection: sub.title,
        rowId: r.id,
        role: r.roleLabel,
        name: r.name,
        organization: r.organization || "",
        travel: r.travel,
        count: r.count,
      })),
    ),
  )

  return `You are Boeing Helper. Convert freeform email/notes/roster text into a structured engagement debrief, then propose updates to an attendee dashboard.

Context:
${JSON.stringify(context || {}, null, 2)}

Current attendee rows (JSON):
${JSON.stringify(flat, null, 2)}

Freeform paste:
"""
${paste}
"""

Return ONLY JSON with this shape:
{
  "debrief": {
    "sentiment": "Positive|Neutral|Needs Follow-up|Excellent",
    "score": <1-100>,
    "outcomes": ["..."],
    "actions": ["..."],
    "people": [{"name":"","role":"","organization":"","travel":"I|D|L|"}],
    "narrativeBullets": ["..."]
  },
  "updates": [
    {
      "op": "update|add|remove",
      "sectionId": "...",
      "subsectionId": "...",
      "rowId": "... (required for update/remove; omit for add)",
      "roleLabel": "...",
      "name": "...",
      "organization": "...",
      "travel": "I|D|L|",
      "count": 1,
      "notes": ""
    }
  ],
  "summary": "one sentence describing proposed roster changes"
}

Rules:
- Prefer updating empty role slots that match the person's role/title.
- Use travel I=international, D=domestic/regional, L=local.
- For add, pick the best matching sectionId/subsectionId from the current rows.
- Only include real changes inferred from the paste.
- Keep Boeing titles/roles concise.`
}

function buildReportPrompt(
  paste: string,
  current: AirshowReportData,
  context?: Record<string, unknown>,
) {
  return `You are Boeing Helper. Convert freeform meeting notes/email/transcript into a structured debrief, then rewrite an Air Show Summary Report.

Context:
${JSON.stringify(context || {}, null, 2)}

Current report:
${JSON.stringify(current, null, 2)}

Freeform paste:
"""
${paste}
"""

Return ONLY JSON:
{
  "debrief": {
    "sentiment": "Positive|Neutral|Needs Follow-up|Excellent",
    "score": <1-100>,
    "outcomes": ["..."],
    "actions": ["ACTION: owner — task"],
    "people": [{"name":"","role":"","organization":""}],
    "narrativeBullets": ["..."]
  },
  "report": {
    "executiveSummary": "updated executive summary paragraph(s)",
    "engagementTitle": "optional updated title or same",
    "engagementBody": "updated engagement notes including ACTION lines",
    "regionLabel": "optional or same"
  },
  "summary": "one sentence describing report updates"
}

Write in Boeing institutional tone. Be specific to the paste. Do not invent unrelated programmes.`
}

function applyAttendeeUpdates(
  current: AttendeeDashboardData,
  updates: Array<Record<string, unknown>>,
): { proposed: AttendeeDashboardData; hunks: Hunk[] } {
  const proposed: AttendeeDashboardData = structuredClone(current)
  const hunks: Hunk[] = []
  let i = 0

  for (const u of updates) {
    const op = String(u.op || "update") as Hunk["op"]
    const sectionId = String(u.sectionId || "")
    const subsectionId = String(u.subsectionId || "")
    const rowId = u.rowId ? String(u.rowId) : ""
    const section = proposed.columns.find((c) => c.id === sectionId)
    const sub = section?.subsections.find((s) => s.id === subsectionId)
    if (!section || !sub) continue

    if (op === "add") {
      const row: AttendeeRoleRow = {
        id: `llm-${Date.now()}-${i++}`,
        roleLabel: String(u.roleLabel || "Role"),
        name: String(u.name || ""),
        organization: u.organization ? String(u.organization) : undefined,
        travel: (String(u.travel || "") as Travel) || "",
        notes: u.notes ? String(u.notes) : undefined,
        count: typeof u.count === "number" ? u.count : 1,
      }
      sub.rows.push(row)
      hunks.push({
        id: `h-${i}`,
        path: `${section.title} / ${sub.title}`,
        field: "New attendee",
        before: "",
        after: `${row.roleLabel}: ${row.name}${row.organization ? ` (${row.organization})` : ""} [${row.travel || "—"}]`,
        op: "add",
      })
      continue
    }

    const row = sub.rows.find((r) => r.id === rowId)
    if (!row) continue

    if (op === "remove") {
      hunks.push({
        id: `h-${i++}`,
        path: `${section.title} / ${sub.title}`,
        field: row.roleLabel || "Attendee",
        before: `${row.name || "(empty)"}${row.organization ? ` · ${row.organization}` : ""}`,
        after: "",
        op: "remove",
      })
      sub.rows = sub.rows.filter((r) => r.id !== rowId)
      continue
    }

    const fields: Array<[keyof AttendeeRoleRow, string]> = [
      ["roleLabel", "Role"],
      ["name", "Name"],
      ["organization", "Organization"],
      ["travel", "I/D/L"],
      ["notes", "Notes"],
    ]
    for (const [key, label] of fields) {
      if (u[key] === undefined) continue
      const before = String(row[key] ?? "")
      const after = String(u[key] ?? "")
      if (before === after) continue
      ;(row as Record<string, unknown>)[key] = after
      hunks.push({
        id: `h-${i++}-${key}`,
        path: `${section.title} / ${sub.title} / ${row.roleLabel}`,
        field: label,
        before,
        after,
        op: "update",
      })
    }
    if (typeof u.count === "number" && u.count !== row.count) {
      hunks.push({
        id: `h-${i++}-count`,
        path: `${section.title} / ${sub.title} / ${row.roleLabel}`,
        field: "Seats",
        before: String(row.count),
        after: String(u.count),
        op: "update",
      })
      row.count = u.count
    } else if (row.name && !row.count) {
      row.count = 1
    }
  }

  proposed.travelCounts = recountTravel(proposed.columns)
  return { proposed, hunks }
}

function applyReportUpdates(
  current: AirshowReportData,
  report: Record<string, unknown>,
): { proposed: AirshowReportData; hunks: Hunk[] } {
  const proposed = { ...current }
  const hunks: Hunk[] = []
  const map: Array<[keyof AirshowReportData, string]> = [
    ["executiveSummary", "Executive Summary"],
    ["engagementTitle", "Engagement Title"],
    ["engagementBody", "Engagement Body"],
    ["regionLabel", "Region"],
  ]
  let i = 0
  for (const [key, label] of map) {
    if (report[key] === undefined) continue
    const before = String(current[key] ?? "")
    const after = String(report[key] ?? "")
    if (before === after) continue
    proposed[key] = after
    hunks.push({
      id: `h-${i++}`,
      path: "Air Show Report",
      field: label,
      before,
      after,
      op: "update",
    })
  }
  return { proposed, hunks }
}

function fallbackAttendee(
  paste: string,
  current: AttendeeDashboardData,
  context?: Record<string, unknown>,
) {
  const peopleHint = paste.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/g)?.slice(0, 5) || []
  const debrief = {
    sentiment: "Positive",
    score: 74,
    outcomes: ["Parsed freeform notes into a draft roster debrief (offline fallback)."],
    actions: ["Review proposed name fills against empty role slots."],
    people: peopleHint.map((name) => ({ name, role: "", organization: String(context?.companyName || ""), travel: "" as const })),
    narrativeBullets: peopleHint.map((n) => `Mentioned: ${n}`),
  }
  const updates: Array<Record<string, unknown>> = []
  let pi = 0
  outer: for (const col of current.columns) {
    for (const sub of col.subsections) {
      for (const row of sub.rows) {
        if (pi >= peopleHint.length) break outer
        if (!row.name) {
          updates.push({
            op: "update",
            sectionId: col.id,
            subsectionId: sub.id,
            rowId: row.id,
            name: peopleHint[pi++],
            count: 1,
            travel: row.travel || "L",
          })
        }
      }
    }
  }
  const { proposed, hunks } = applyAttendeeUpdates(current, updates)
  return {
    debrief,
    proposedDocument: proposed,
    hunks,
    summary: hunks.length
      ? `Fallback mapped ${hunks.length} field change(s) from pasted names.`
      : "No roster changes inferred from paste (fallback).",
  }
}

function fallbackReport(paste: string, current: AirshowReportData) {
  const snippet = paste.trim().slice(0, 400)
  const actions = [...paste.matchAll(/ACTION[:\s]+([^\n]+)/gi)].map((m) => `ACTION: ${m[1].trim()}`)
  const body = [
    current.engagementBody.split("\n\n")[0],
    snippet ? `Notes captured: ${snippet}` : "",
    ...(actions.length ? actions : ["ACTION: Integrator — confirm follow-up within 5 business days"]),
  ].filter(Boolean).join("\n\n")

  const report = {
    executiveSummary: `${current.executiveSummary}\n\nDebrief addendum (from pasted notes): ${snippet.slice(0, 220)}`,
    engagementBody: body,
  }
  const { proposed, hunks } = applyReportUpdates(current, report)
  return {
    debrief: {
      sentiment: "Positive",
      score: 72,
      outcomes: ["Offline fallback debrief generated from pasted notes."],
      actions: actions.length ? actions : ["Confirm follow-up owners"],
      narrativeBullets: [snippet.slice(0, 160)],
    },
    proposedDocument: proposed,
    hunks,
    summary: "Fallback debrief applied to report fields.",
  }
}

export async function documentUpdateHandler(req: Request, res: Response): Promise<void> {
  const { target, instructionOrPaste, currentDocument, context } = req.body as {
    target?: "attendees" | "report"
    instructionOrPaste?: string
    currentDocument?: unknown
    context?: Record<string, unknown>
  }

  if (!target || !instructionOrPaste?.trim() || !currentDocument) {
    res.status(400).json({ error: "Missing target, instructionOrPaste, or currentDocument" })
    return
  }

  const paste = instructionOrPaste.trim()

  if (target === "attendees") {
    const current = currentDocument as AttendeeDashboardData
    if (!process.env.GROQ_API_KEY) {
      res.json(fallbackAttendee(paste, current, context))
      return
    }
    try {
      const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: buildAttendeePrompt(paste, current, context) }],
        temperature: 0.3,
        max_tokens: 2500,
      })
      const raw = completion.choices[0]?.message?.content || ""
      const parsed = extractJson(raw)
      if (!parsed) {
        res.json(fallbackAttendee(paste, current, context))
        return
      }
      const updates = Array.isArray(parsed.updates) ? (parsed.updates as Array<Record<string, unknown>>) : []
      const { proposed, hunks } = applyAttendeeUpdates(current, updates)
      res.json({
        debrief: parsed.debrief || {},
        proposedDocument: proposed,
        hunks,
        summary: String(parsed.summary || "Proposed attendee updates from debrief."),
      })
    } catch (err) {
      console.error("[document-update] attendees Groq error:", err)
      res.json(fallbackAttendee(paste, current, context))
    }
    return
  }

  if (target === "report") {
    const current = currentDocument as AirshowReportData
    if (!process.env.GROQ_API_KEY) {
      res.json(fallbackReport(paste, current))
      return
    }
    try {
      const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
      const completion = await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: buildReportPrompt(paste, current, context) }],
        temperature: 0.35,
        max_tokens: 2200,
      })
      const raw = completion.choices[0]?.message?.content || ""
      const parsed = extractJson(raw)
      if (!parsed) {
        res.json(fallbackReport(paste, current))
        return
      }
      const report = (parsed.report || {}) as Record<string, unknown>
      const { proposed, hunks } = applyReportUpdates(current, report)
      res.json({
        debrief: parsed.debrief || {},
        proposedDocument: proposed,
        hunks,
        summary: String(parsed.summary || "Proposed report updates from debrief."),
      })
    } catch (err) {
      console.error("[document-update] report Groq error:", err)
      res.json(fallbackReport(paste, current))
    }
    return
  }

  res.status(400).json({ error: "Invalid target" })
}
