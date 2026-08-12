import { useCallback, useEffect, useState } from "react"
import type { ChangelogEntry, DocumentDebrief, ReviewHunk, ReviewTarget } from "../types/documentReview"
import { appendChangelog, loadChangelog } from "../utils/changelogStorage"

export function useDocumentReview(scope: string) {
  const [entries, setEntries] = useState<ChangelogEntry[]>([])
  const [changelogOpen, setChangelogOpen] = useState(false)

  useEffect(() => {
    setEntries(loadChangelog(scope))
  }, [scope])

  const recordAccept = useCallback(
    (opts: {
      source: "manual" | "llm"
      target: ReviewTarget
      summary: string
      hunks: ReviewHunk[]
      debriefSnapshot?: DocumentDebrief
    }) => {
      const next = appendChangelog(scope, opts)
      setEntries(next)
      return next
    },
    [scope],
  )

  return {
    entries,
    changelogOpen,
    setChangelogOpen,
    recordAccept,
  }
}
