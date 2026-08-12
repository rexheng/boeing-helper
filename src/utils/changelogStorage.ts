import type { ChangelogEntry, ReviewTarget } from "../types/documentReview"

function keyFor(scope: string) {
  return `boeing-helper-changelog:${scope}`
}

export function loadChangelog(scope: string): ChangelogEntry[] {
  try {
    const raw = localStorage.getItem(keyFor(scope))
    if (!raw) return []
    const parsed = JSON.parse(raw) as ChangelogEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveChangelog(scope: string, entries: ChangelogEntry[]) {
  localStorage.setItem(keyFor(scope), JSON.stringify(entries.slice(0, 100)))
}

export function appendChangelog(
  scope: string,
  entry: Omit<ChangelogEntry, "id" | "at"> & { id?: string; at?: string },
): ChangelogEntry[] {
  const next: ChangelogEntry = {
    id: entry.id || `cl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    at: entry.at || new Date().toISOString(),
    source: entry.source,
    target: entry.target,
    summary: entry.summary,
    debriefSnapshot: entry.debriefSnapshot,
    hunks: entry.hunks,
  }
  const all = [next, ...loadChangelog(scope)]
  saveChangelog(scope, all)
  return all
}

export function changelogScope(parts: {
  companyId?: string
  personId?: string
  meetingType?: string
  target?: ReviewTarget
}) {
  return [parts.companyId || "co", parts.personId || "pe", parts.meetingType || "mt", parts.target || "all"]
    .join("|")
    .replace(/\s+/g, "-")
}
