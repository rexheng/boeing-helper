import { useMemo, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import type {
  DocumentDebrief,
  DocumentUpdateResponse,
  ReviewHunk,
  ReviewTarget,
} from "../../types/documentReview"
import { ReviewDiffText } from "./ReviewDiffText"

const NAVY = "#0A2240"
const BLUE = "#0033A1"
const RED = "#B91C1C"

export function ReviewPanel({
  target,
  currentDocument,
  context,
  onAccept,
  onRejectAll,
}: {
  target: ReviewTarget
  currentDocument: unknown
  context?: Record<string, unknown>
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

  const selectedHunks = useMemo(() => {
    if (!result) return []
    return result.hunks.filter((h) => selected[h.id] !== false)
  }, [result, selected])

  const runGenerate = async () => {
    if (!paste.trim()) {
      setError("Paste email text, notes, or a roster first.")
      return
    }
    setBusy(true)
    setError(null)
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
      setResult(data)
      const init: Record<string, boolean> = {}
      for (const h of data.hunks) init[h.id] = true
      setSelected(init)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed")
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
      summary: result.summary || "Accepted LLM updates",
    })
    setResult(null)
    setPaste("")
  }

  const reject = () => {
    setResult(null)
    onRejectAll?.()
  }

  return (
    <div className="space-y-3 p-4" style={{ border: "1px solid var(--surface-border)", background: "#fff" }}>
      <div className="flex items-center gap-2">
        <Sparkles size={14} style={{ color: BLUE }} />
        <h3 className="text-sm font-semibold" style={{ color: NAVY }}>
          Update from email / notes
        </h3>
      </div>
      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
        Paste freeform text. Groq builds a debrief, then proposes document updates you review before applying.
      </p>
      <textarea
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        rows={5}
        placeholder="Paste email, meeting notes, or roster text…"
        className="w-full px-3 py-2 text-sm"
        style={{ border: "1px solid var(--surface-border)", color: NAVY }}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={runGenerate}
          disabled={busy}
          className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-white disabled:opacity-60"
          style={{ background: BLUE }}
        >
          {busy ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          {busy ? "Generating…" : "Generate debrief & proposal"}
        </button>
      </div>
      {error && (
        <p className="text-xs" style={{ color: RED }}>{error}</p>
      )}

      {result && (
        <div className="space-y-3 pt-2" style={{ borderTop: "1px solid var(--surface-border)" }}>
          <DebriefCard debrief={result.debrief} summary={result.summary} />

          <div>
            <p className="text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: NAVY }}>
              Review changes ({result.hunks.length})
            </p>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {result.hunks.map((h) => (
                <li key={h.id} className="flex gap-2 items-start text-[11px] p-2" style={{ background: "var(--bg-muted)" }}>
                  <input
                    type="checkbox"
                    checked={selected[h.id] !== false}
                    onChange={() => toggle(h.id)}
                    className="mt-0.5"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold" style={{ color: NAVY }}>
                      {h.field} <span className="font-normal" style={{ color: "var(--text-muted)" }}>({h.op})</span>
                    </p>
                    <p className="text-[10px] mb-1 truncate" style={{ color: "var(--text-muted)" }}>{h.path}</p>
                    <ReviewDiffText before={h.before} after={h.after} op={h.op} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={accept}
              disabled={selectedHunks.length === 0}
              className="cursor-pointer px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-50"
              style={{ background: BLUE }}
            >
              Accept selected ({selectedHunks.length})
            </button>
            <button
              type="button"
              onClick={() => {
                if (!result) return
                const all: Record<string, boolean> = {}
                for (const h of result.hunks) all[h.id] = true
                setSelected(all)
              }}
              className="cursor-pointer px-3 py-1.5 text-[11px] font-semibold"
              style={{ border: `1px solid ${BLUE}`, color: BLUE }}
            >
              Select all
            </button>
            <button
              type="button"
              onClick={reject}
              className="cursor-pointer px-3 py-1.5 text-[11px] font-semibold"
              style={{ border: "1px solid var(--surface-border)", color: NAVY }}
            >
              Reject all
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DebriefCard({ debrief, summary }: { debrief: DocumentDebrief; summary: string }) {
  if (!debrief) return null
  return (
    <div className="p-3 space-y-2" style={{ background: "var(--boeing-ice, #E8F0FE)", border: `1px solid ${BLUE}` }}>
      <p className="text-xs font-semibold" style={{ color: NAVY }}>Debrief</p>
      {summary && <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>{summary}</p>}
      <div className="flex flex-wrap gap-3 text-[11px]" style={{ color: NAVY }}>
        {debrief.sentiment && <span><strong>Sentiment:</strong> {debrief.sentiment}</span>}
        {typeof debrief.score === "number" && <span><strong>Score:</strong> {debrief.score}</span>}
      </div>
      {debrief.outcomes && debrief.outcomes.length > 0 && (
        <ul className="list-disc pl-4 text-[11px]" style={{ color: "var(--text-secondary)" }}>
          {debrief.outcomes.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      )}
      {debrief.actions && debrief.actions.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase" style={{ color: NAVY }}>Actions</p>
          <ul className="list-disc pl-4 text-[11px]" style={{ color: "var(--text-secondary)" }}>
            {debrief.actions.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </div>
      )}
      {debrief.people && debrief.people.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold uppercase" style={{ color: NAVY }}>People</p>
          <ul className="text-[11px] space-y-0.5" style={{ color: "var(--text-secondary)" }}>
            {debrief.people.map((p, i) => (
              <li key={i}>
                {p.name}{p.role ? ` · ${p.role}` : ""}{p.organization ? ` · ${p.organization}` : ""}
                {p.travel ? ` · ${p.travel}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
