import { useEffect, useMemo, useRef, useState } from "react"
import { Check, CheckCircle2, Loader2, Mail, X } from "lucide-react"
import type {
  DocumentDebrief,
  DocumentUpdateResponse,
  ReviewHunk,
  ReviewTarget,
} from "../../types/documentReview"
import { ReviewDiffText } from "./ReviewDiffText"
import { SAMPLE_ATTENDEE_UPDATE_EMAIL } from "../../demo/sampleAttendeeUpdateEmail"
import { SAMPLE_REPORT_UPDATE_EMAIL } from "../../demo/sampleReportUpdateEmail"

type Phase = "compose" | "extracting" | "review" | "applied"

const COPY: Record<
  ReviewTarget,
  {
    aria: string
    titleCompose: string
    titleReview: string
    titleApplied: string
    subCompose: string
    subReview: string
    subApplied: string
    placeholder: string
    applyLabel: (n: number) => string
    victoryTitle: (n: number) => string
    victorySub: (n: number) => string
    sample: string
    sampleLabel: string
    acceptFallbackSummary: string
  }
> = {
  attendees: {
    aria: "Update roster from email or notes",
    titleCompose: "Update roster",
    titleReview: "Review updates",
    titleApplied: "Roster updated",
    subCompose:
      "Paste an email or meeting notes — we’ll propose attendee updates you review before anything hits the roster.",
    subReview: "Select what to apply. Click a change to spotlight it on the live sheet.",
    subApplied: "Changes are on the roster. Paste another note anytime.",
    placeholder: "Paste email, roster notes, or freeform travel updates…",
    applyLabel: (n) => `Apply ${n} to roster`,
    victoryTitle: (n) => `Applied ${n} update${n === 1 ? "" : "s"} to the roster`,
    victorySub: (n) =>
      `${n} change${n === 1 ? "" : "s"} ${n === 1 ? "is" : "are"} live on the sheet and logged in Changelog.`,
    sample: SAMPLE_ATTENDEE_UPDATE_EMAIL,
    sampleLabel: "Use sample email",
    acceptFallbackSummary: "Accepted roster updates",
  },
  report: {
    aria: "Update summary report from email or notes",
    titleCompose: "Update report",
    titleReview: "Review updates",
    titleApplied: "Report updated",
    subCompose:
      "Paste an email or freeform debrief — we’ll propose report updates you review before anything hits the Word document.",
    subReview: "Select what to apply. Click a change to spotlight it in the live report.",
    subApplied: "Changes are on the report. Paste another note anytime.",
    placeholder: "Paste email, bilateral notes, or freeform debrief text…",
    applyLabel: (n) => `Apply ${n} to report`,
    victoryTitle: (n) => `Applied ${n} update${n === 1 ? "" : "s"} to the report`,
    victorySub: (n) =>
      `${n} change${n === 1 ? "" : "s"} ${n === 1 ? "is" : "are"} live on the document and logged in Changelog.`,
    sample: SAMPLE_REPORT_UPDATE_EMAIL,
    sampleLabel: "Use sample debrief",
    acceptFallbackSummary: "Accepted report updates",
  },
}

export function DockedComposer({
  target,
  currentDocument,
  context,
  onHighlightPaths,
  onAccept,
  onRejectAll,
}: {
  target: ReviewTarget
  currentDocument: unknown
  context?: Record<string, unknown>
  onHighlightPaths: (paths: string[]) => void
  onAccept: (payload: {
    proposedDocument: unknown
    hunks: ReviewHunk[]
    allHunkCount: number
    debrief: DocumentDebrief
    summary: string
  }) => void
  onRejectAll?: () => void
}) {
  const copy = COPY[target]
  const [paste, setPaste] = useState(copy.sample)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DocumentUpdateResponse | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [phase, setPhase] = useState<Phase>("compose")
  const [chips, setChips] = useState<{ id: string; label: string; kind: "add" | "upd" | "rm" }[]>([])
  const [activeHunkId, setActiveHunkId] = useState<string | null>(null)
  const [showHunks, setShowHunks] = useState(false)
  const [appliedCount, setAppliedCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const selectedHunks = useMemo(() => {
    if (!result) return []
    return result.hunks.filter((h) => selected[h.id] !== false)
  }, [result, selected])

  useEffect(() => {
    if (!result || phase !== "review") {
      onHighlightPaths([])
      return
    }
    const active = result.hunks.find((h) => h.id === activeHunkId)
    if (active) {
      onHighlightPaths([active.anchor || active.path])
      return
    }
    const firstOn = selectedHunks[0]
    onHighlightPaths(firstOn ? [firstOn.anchor || firstOn.path] : [])
  }, [result, phase, activeHunkId, selectedHunks, onHighlightPaths])

  const runGenerate = async () => {
    if (!paste.trim()) {
      setError("Paste an email or notes first.")
      textareaRef.current?.focus()
      return
    }
    setBusy(true)
    setError(null)
    setPhase("extracting")
    setChips([])
    setResult(null)
    setShowHunks(false)
    try {
      const res = await fetch("/api/document-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          instructionOrPaste: paste,
          currentDocument,
          context,
        }),
      })
      const data = (await res.json()) as DocumentUpdateResponse & { error?: string }
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
      if (!data.hunks || !Array.isArray(data.hunks)) throw new Error("Invalid response from update API")

      const staged = data.hunks.slice(0, 8).map((h) => ({
        id: h.id,
        label: chipLabel(h, target),
        kind: (h.op === "add" ? "add" : h.op === "remove" ? "rm" : "upd") as "add" | "upd" | "rm",
      }))
      setChips(staged)
      await wait(Math.min(1000 + staged.length * 110, 1900))

      setResult(data)
      const init: Record<string, boolean> = {}
      for (const h of data.hunks) init[h.id] = true
      setSelected(init)
      setPhase("review")
      if (data.hunks[0]) setActiveHunkId(data.hunks[0].id)
      requestAnimationFrame(() => setShowHunks(true))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
      setPhase("compose")
      setResult(null)
    } finally {
      setBusy(false)
    }
  }

  const toggle = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const accept = () => {
    if (!result) return
    const n = selectedHunks.length
    onAccept({
      proposedDocument: result.proposedDocument,
      hunks: selectedHunks,
      allHunkCount: result.hunks.length,
      debrief: result.debrief || {},
      summary: result.summary || copy.acceptFallbackSummary,
    })
    setAppliedCount(n)
    setResult(null)
    setPaste("")
    setChips([])
    setActiveHunkId(null)
    setShowHunks(false)
    onHighlightPaths([])
    setPhase("applied")
  }

  const reject = () => {
    resetToCompose(false)
    onRejectAll?.()
  }

  const resetToCompose = (clearPaste: boolean) => {
    setResult(null)
    if (clearPaste) setPaste("")
    setChips([])
    setPhase("compose")
    setActiveHunkId(null)
    setShowHunks(false)
    onHighlightPaths([])
  }

  return (
    <aside className="docked-composer flex flex-col h-full min-h-0" aria-label={copy.aria}>
      <header className="docked-composer__hero shrink-0">
        <p className="docked-composer__brand">Boeing Helper</p>
        <h3 className="docked-composer__title">
          {phase === "review"
            ? copy.titleReview
            : phase === "applied"
              ? copy.titleApplied
              : copy.titleCompose}
        </h3>
        <p className="docked-composer__sub">
          {phase === "review"
            ? copy.subReview
            : phase === "applied"
              ? copy.subApplied
              : copy.subCompose}
        </p>
      </header>

      <div className="docked-composer__body flex flex-col min-h-0 flex-1">
        {(phase === "compose" || phase === "extracting") && (
          <div className={`docked-composer__paste-wrap ${phase === "extracting" ? "is-scanning" : ""}`}>
            <label className="sr-only" htmlFor={`docked-paste-${target}`}>Email or notes</label>
            <textarea
              id={`docked-paste-${target}`}
              ref={textareaRef}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder={copy.placeholder}
              className="docked-composer__textarea"
              spellCheck={false}
              readOnly={phase === "extracting"}
            />
            {phase === "extracting" && (
              <div className="docked-composer__extract-overlay" aria-live="polite">
                <div className="docked-composer__extract-label">
                  <Loader2 size={13} className="animate-spin" />
                  Reading paste…
                </div>
                <div className="docked-composer__scan" />
                <div className="docked-composer__chips">
                  {chips.map((c, i) => (
                    <div
                      key={c.id}
                      className={`docked-composer__chip docked-composer__chip--${c.kind}`}
                      style={{ animationDelay: `${0.06 + i * 0.09}s` }}
                    >
                      {c.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "compose" && (
          <div className="docked-composer__actions shrink-0">
            <button type="button" onClick={runGenerate} disabled={busy} className="docked-composer__primary">
              Propose updates
            </button>
            <button
              type="button"
              className="docked-composer__link"
              onClick={() => {
                setPaste(copy.sample)
                setError(null)
                requestAnimationFrame(() => textareaRef.current?.focus())
              }}
            >
              <Mail size={12} />
              {copy.sampleLabel}
            </button>
          </div>
        )}

        {phase === "applied" && (
          <div className="docked-composer__victory" aria-live="polite">
            <CheckCircle2 size={28} style={{ color: "#2F6B4F" }} />
            <p className="docked-composer__victory-title">{copy.victoryTitle(appliedCount)}</p>
            <p className="docked-composer__victory-sub">{copy.victorySub(appliedCount)}</p>
            <button type="button" className="docked-composer__primary" onClick={() => resetToCompose(true)}>
              Update from another note
            </button>
          </div>
        )}

        {phase === "review" && result && (
          <div className="docked-composer__review flex flex-col min-h-0 flex-1">
            <div className="docked-composer__debrief shrink-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="docked-composer__debrief-title">Proposed changes</p>
                <span className="docked-composer__count">{result.hunks.length}</span>
              </div>
              {result.summary && !/fallback|groq|score/i.test(result.summary) && (
                <p className="docked-composer__debrief-sum">{result.summary}</p>
              )}
            </div>

            <ul className={`docked-composer__hunks flex-1 min-h-0 overflow-y-auto ${showHunks ? "is-in" : ""}`}>
              {result.hunks.map((h, i) => {
                const on = selected[h.id] !== false
                const active = activeHunkId === h.id
                return (
                  <li key={h.id} style={{ animationDelay: `${0.04 + i * 0.045}s` }}>
                    <button
                      type="button"
                      className={`docked-composer__hunk ${on ? "is-on" : "is-off"} ${active ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveHunkId(h.id)
                        onHighlightPaths([h.anchor || h.path])
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={(e) => {
                          e.stopPropagation()
                          toggle(h.id)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Include change: ${executiveHeadline(h, target)}`}
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <p className="docked-composer__hunk-field">{executiveHeadline(h, target)}</p>
                        <p className="docked-composer__hunk-detail">
                          <ReviewDiffText before={h.before} after={h.after} op={h.op} />
                        </p>
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>

            <div className="docked-composer__sticky shrink-0">
              <button
                type="button"
                onClick={accept}
                disabled={selectedHunks.length === 0}
                className="docked-composer__primary"
              >
                <Check size={14} />
                {copy.applyLabel(selectedHunks.length)}
              </button>
              <button type="button" className="docked-composer__ghost" onClick={reject}>
                <X size={13} />
                Reject
              </button>
              <div className="docked-composer__quiet">
                <button type="button" className="docked-composer__link" onClick={() => resetToCompose(false)}>
                  Edit paste
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <p className="docked-composer__error" role="alert">{error}</p>
        )}
      </div>
    </aside>
  )
}

function executiveHeadline(h: ReviewHunk, target: ReviewTarget) {
  if (target === "report") return reportHeadline(h)
  if (h.op === "remove") {
    const who = h.before.split("·")[0]?.trim() || h.field
    return `Remove ${who}`
  }
  if (h.op === "add") {
    const who = h.after.split(/[:·]/)[0]?.trim() || h.after
    return `Add ${who}`
  }
  const person = h.after.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/)?.[1]
  const emptyBefore =
    !h.before.trim() ||
    /\(empty\)/i.test(h.before) ||
    /AH-64|CH-47|Programme/i.test(h.before) ||
    /^\d+\s*seats?$/i.test(h.before.trim())
  if (person && emptyBefore) return `Assign ${person}${roleSuffix(h)}`
  if (person) return `Update to ${person}${roleSuffix(h)}`
  if (/seats/i.test(h.field) || (/^\d+\s*seats?$/i.test(h.before.trim()) && /^\d+\s*seats?$/i.test(h.after.trim()))) {
    return `Adjust ${h.field.replace(/\s*·\s*seats/i, "").trim() || "seats"} (${h.before} → ${h.after})`
  }
  if (/objective/i.test(h.field)) return "Tighten Objective 5"
  return h.field
}

function reportHeadline(h: ReviewHunk) {
  if (/executive/i.test(h.field)) return "Refresh executive summary"
  if (/engagement title/i.test(h.field)) return "Retitle engagement"
  if (/engagement body/i.test(h.field) || /notes/i.test(h.field)) return "Rewrite engagement notes"
  if (/region/i.test(h.field)) return "Update region label"
  if (/action/i.test(h.field)) {
    const owner = h.after.match(/ACTION:\s*([^—\n-]+)/i)?.[1]?.trim()
    return owner ? `Add action · ${owner}` : "Add follow-up action"
  }
  if (h.op === "add") return `Add ${h.field}`
  if (h.op === "remove") return `Remove ${h.field}`
  return h.field
}

function roleSuffix(h: ReviewHunk) {
  const role = h.path.split(" / ").slice(-1)[0]
  if (!role || /objective/i.test(role)) return ""
  if (role.toLowerCase() === h.field.toLowerCase()) return ` · ${role}`
  if (/^[A-Z0-9]/.test(role)) return ` · ${role}`
  return ""
}

function chipLabel(h: ReviewHunk, target: ReviewTarget) {
  return executiveHeadline(h, target).slice(0, 48)
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
