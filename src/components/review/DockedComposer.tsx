import { useEffect, useMemo, useRef, useState } from "react"
import { Check, Loader2, Mail, Sparkles, X } from "lucide-react"
import type {
  DocumentDebrief,
  DocumentUpdateResponse,
  ReviewHunk,
  ReviewTarget,
} from "../../types/documentReview"
import { ReviewDiffText } from "./ReviewDiffText"
import { SAMPLE_ATTENDEE_UPDATE_EMAIL } from "../../demo/sampleAttendeeUpdateEmail"

type Phase = "compose" | "extracting" | "review"

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
  const [paste, setPaste] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<DocumentUpdateResponse | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [phase, setPhase] = useState<Phase>("compose")
  const [chips, setChips] = useState<{ id: string; label: string; kind: "add" | "upd" | "rm" }[]>([])
  const [activeHunkId, setActiveHunkId] = useState<string | null>(null)
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
    const paths = selectedHunks.map((h) => h.path)
    onHighlightPaths(paths)
  }, [result, phase, selectedHunks, onHighlightPaths])

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
        label: chipLabel(h),
        kind: (h.op === "add" ? "add" : h.op === "remove" ? "rm" : "upd") as "add" | "upd" | "rm",
      }))
      setChips(staged)

      // Let extraction chips animate before revealing the review list
      await wait(Math.min(900 + staged.length * 120, 1800))

      setResult(data)
      const init: Record<string, boolean> = {}
      for (const h of data.hunks) init[h.id] = true
      setSelected(init)
      setPhase("review")
      if (data.hunks[0]) setActiveHunkId(data.hunks[0].id)
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
    onAccept({
      proposedDocument: result.proposedDocument,
      hunks: selectedHunks,
      allHunkCount: result.hunks.length,
      debrief: result.debrief || {},
      summary: result.summary || "Accepted roster updates",
    })
    setResult(null)
    setPaste("")
    setChips([])
    setPhase("compose")
    setActiveHunkId(null)
    onHighlightPaths([])
  }

  const reject = () => {
    setResult(null)
    setChips([])
    setPhase("compose")
    setActiveHunkId(null)
    onHighlightPaths([])
    onRejectAll?.()
  }

  return (
    <aside className="docked-composer flex flex-col h-full min-h-0" aria-label="Update roster from email or notes">
      <header className="docked-composer__hero shrink-0">
        <p className="docked-composer__eyebrow">Boeing Helper</p>
        <h3 className="docked-composer__title">Update roster</h3>
        <p className="docked-composer__sub">
          Paste an email or meeting notes — we’ll propose attendee updates you review before anything hits the roster.
        </p>
      </header>

      <div className="docked-composer__body flex flex-col min-h-0 flex-1">
        {phase === "compose" && (
          <>
            <label className="sr-only" htmlFor="docked-paste">Email or notes</label>
            <textarea
              id="docked-paste"
              ref={textareaRef}
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
              placeholder="Paste email, roster notes, or freeform travel updates…"
              className="docked-composer__textarea"
              spellCheck={false}
            />
            <div className="docked-composer__actions shrink-0">
              <button
                type="button"
                onClick={runGenerate}
                disabled={busy}
                className="docked-composer__primary"
              >
                {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Propose updates
              </button>
              <button
                type="button"
                className="docked-composer__ghost"
                onClick={() => {
                  setPaste(SAMPLE_ATTENDEE_UPDATE_EMAIL)
                  setError(null)
                  requestAnimationFrame(() => textareaRef.current?.focus())
                }}
              >
                <Mail size={13} />
                Use sample email
              </button>
            </div>
          </>
        )}

        {phase === "extracting" && (
          <div className="docked-composer__extract" aria-live="polite">
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
                  style={{ animationDelay: `${0.08 + i * 0.1}s` }}
                >
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {phase === "review" && result && (
          <div className="docked-composer__review flex flex-col min-h-0 flex-1">
            <DebriefStrip debrief={result.debrief} summary={result.summary} count={result.hunks.length} />
            <ul className="docked-composer__hunks flex-1 min-h-0 overflow-y-auto">
              {result.hunks.map((h) => {
                const on = selected[h.id] !== false
                const active = activeHunkId === h.id
                return (
                  <li key={h.id}>
                    <button
                      type="button"
                      className={`docked-composer__hunk ${on ? "is-on" : "is-off"} ${active ? "is-active" : ""}`}
                      onClick={() => {
                        setActiveHunkId(h.id)
                        onHighlightPaths([h.path])
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
                        aria-label={`Include change: ${h.field}`}
                      />
                      <div className="min-w-0 flex-1 text-left">
                        <p className="docked-composer__hunk-field">
                          {h.field}
                          <span className="docked-composer__op">{h.op}</span>
                        </p>
                        <p className="docked-composer__hunk-path">{h.path}</p>
                        <ReviewDiffText before={h.before} after={h.after} op={h.op} />
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
                Accept selected ({selectedHunks.length})
              </button>
              <button
                type="button"
                className="docked-composer__ghost"
                onClick={() => {
                  if (!result) return
                  const all: Record<string, boolean> = {}
                  for (const h of result.hunks) all[h.id] = true
                  setSelected(all)
                }}
              >
                Select all
              </button>
              <button type="button" className="docked-composer__ghost" onClick={reject}>
                <X size={13} />
                Reject
              </button>
              <button
                type="button"
                className="docked-composer__link"
                onClick={() => {
                  setPhase("compose")
                  setResult(null)
                  setChips([])
                  setActiveHunkId(null)
                  onHighlightPaths([])
                }}
              >
                Edit paste
              </button>
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

function DebriefStrip({
  debrief,
  summary,
  count,
}: {
  debrief: DocumentDebrief
  summary: string
  count: number
}) {
  return (
    <div className="docked-composer__debrief shrink-0">
      <div className="flex items-baseline justify-between gap-2">
        <p className="docked-composer__debrief-title">Proposed changes</p>
        <span className="docked-composer__count">{count}</span>
      </div>
      {summary && <p className="docked-composer__debrief-sum">{summary}</p>}
      {(debrief?.sentiment || typeof debrief?.score === "number") && (
        <p className="docked-composer__meta">
          {debrief.sentiment && <span>{debrief.sentiment}</span>}
          {typeof debrief.score === "number" && <span>Score {debrief.score}</span>}
        </p>
      )}
    </div>
  )
}

function chipLabel(h: ReviewHunk) {
  const verb = h.op === "add" ? "Add" : h.op === "remove" ? "Remove" : "Update"
  const detail = (h.after || h.before || h.field).slice(0, 42)
  return `${verb} · ${detail}`
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
