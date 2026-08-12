import type { AirshowReportData } from "./templateExport"

export type ReportSectionKey = keyof AirshowReportData

const KNOWN_KEYS = new Set<string>([
  "executiveSummary",
  "regionLabel",
  "engagementTitle",
  "engagementBody",
  "showName",
])

const LABEL_TO_KEY: Array<{ key: ReportSectionKey; labels: string[] }> = [
  { key: "executiveSummary", labels: ["executive summary", "executive"] },
  { key: "engagementTitle", labels: ["engagement title"] },
  { key: "engagementBody", labels: ["engagement body", "engagement notes", "notes"] },
  { key: "regionLabel", labels: ["region", "region label"] },
  { key: "showName", labels: ["show name", "air show name"] },
]

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ")
}

/** Exact label / leaf match — never bare "show" against "Air Show". */
function matchKnownLabel(text: string): ReportSectionKey | null {
  const n = normalize(text)
  if (!n) return null
  if (KNOWN_KEYS.has(text.trim())) return text.trim() as ReportSectionKey

  for (const { key, labels } of LABEL_TO_KEY) {
    for (const label of labels) {
      if (n === label) return key
    }
  }

  // Phrase contains (order matters: title before body/notes)
  if (n.includes("executive")) return "executiveSummary"
  if (n.includes("engagement title") || (n.includes("engagement") && n.includes("title") && !n.includes("body"))) {
    return "engagementTitle"
  }
  if (
    n.includes("engagement body") ||
    (n.includes("engagement") && n.includes("notes")) ||
    (n.includes("notes") && !n.includes("title"))
  ) {
    return "engagementBody"
  }
  if (/\bregion\b/.test(n)) return "regionLabel"
  if (n === "show name" || n.includes("show name") || n === "showname") return "showName"
  return null
}

/**
 * Map a review hunk's field / path / anchor → AirshowReportData key.
 * Prefers exact known anchors; never maps "Air Show …" via bare "show".
 * Returns null when unresolved (caller decides fallback).
 */
export function resolveReportSectionKey(h: {
  field?: string
  path?: string
  anchor?: string
}): ReportSectionKey | null {
  if (h.anchor && KNOWN_KEYS.has(h.anchor)) return h.anchor as ReportSectionKey

  const field = (h.field || "").trim()
  if (field && KNOWN_KEYS.has(field)) return field as ReportSectionKey
  const fromField = matchKnownLabel(field)
  if (fromField) return fromField

  const path = (h.path || "").trim()
  if (path && KNOWN_KEYS.has(path)) return path as ReportSectionKey

  // Prefer leaf after "Air Show Report / …" so the prefix never drives matching
  const leaf = path.includes("/") ? path.split("/").map((p) => p.trim()).filter(Boolean).pop() || "" : path
  const fromLeaf = matchKnownLabel(leaf)
  if (fromLeaf) return fromLeaf

  if (h.anchor) {
    const fromAnchor = matchKnownLabel(h.anchor)
    if (fromAnchor) return fromAnchor
  }

  return null
}

/** Section id for ReportFieldSheet highlight / scroll; empty when unresolved. */
export function reportHunkAnchor(h: { field?: string; path?: string; anchor?: string }): string {
  return resolveReportSectionKey(h) ?? ""
}
