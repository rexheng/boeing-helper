import type { ResearchResult } from "../../types/research"

// Placeholder lookup for hidden, name-searchable contacts. Empty for the Boeing Helper
// demo dataset — PersonSelect still calls these helpers for custom company searches.
export const judgeResearch: Record<string, ResearchResult> = {}

export const judgePersons: Record<string, { name: string; title: string; companyName: string; slug: string }> = {}

export function getJudgesByCompany(companyName: string): typeof judgePersons[string][] {
  const q = companyName.toLowerCase().trim()
  if (!q) return []
  return Object.values(judgePersons).filter((j) => {
    const cn = j.companyName.toLowerCase()
    return cn === q || cn.startsWith(q) || cn.includes(q) || q.includes(cn)
  })
}

export function findJudgeByName(query: string): typeof judgePersons[string] | null {
  const q = query.toLowerCase().trim()
  if (q.length < 3) return null
  if (judgePersons[q]) return judgePersons[q]
  for (const [key, val] of Object.entries(judgePersons)) {
    if (key.includes(q) || val.name.toLowerCase().includes(q) || q.includes(key)) return val
  }
  return null
}
