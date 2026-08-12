import { useState } from "react"
import { History, X } from "lucide-react"
import type { ChangelogEntry } from "../../types/documentReview"
import { ReviewDiffText } from "./ReviewDiffText"

const NAVY = "#0A2240"
const BLUE = "#0033A1"

export function ChangelogDrawer({
  entries,
  open,
  onClose,
  onOpen,
}: {
  entries: ChangelogEntry[]
  open: boolean
  onClose: () => void
  onOpen: () => void
}) {
  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold"
        style={{ border: "1px solid var(--surface-border)", color: NAVY, background: "#fff" }}
      >
        <History size={13} />
        Changelog ({entries.length})
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(10,34,64,0.35)" }}>
          <button type="button" className="flex-1 cursor-default" aria-label="Close changelog" onClick={onClose} />
          <aside
            className="h-full w-full max-w-md overflow-y-auto bg-white shadow-xl"
            style={{ borderLeft: `1px solid var(--surface-border)` }}
          >
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 bg-white" style={{ borderBottom: "1px solid var(--surface-border)" }}>
              <h3 className="text-sm font-semibold" style={{ color: NAVY }}>Saved changelog</h3>
              <button type="button" onClick={onClose} className="cursor-pointer p-1" style={{ color: NAVY }}>
                <X size={16} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {entries.length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  No accepted changes yet. Manual edits and approved updates appear here.
                </p>
              )}
              {entries.map((e) => (
                <article key={e.id} className="p-3 space-y-2" style={{ border: "1px solid var(--surface-border)", background: "var(--bg-muted)" }}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold" style={{ color: NAVY }}>{e.summary}</p>
                    <span className="text-[10px] uppercase tracking-wider shrink-0" style={{ color: BLUE }}>
                      {e.source === "llm" ? "assistant" : e.source}
                    </span>
                  </div>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                    {new Date(e.at).toLocaleString()} · {e.target}
                  </p>
                  {e.hunks.slice(0, 6).map((h) => (
                    <div key={h.id} className="text-[11px] leading-snug">
                      <span className="font-semibold" style={{ color: NAVY }}>{h.field}: </span>
                      <ReviewDiffText before={h.before} after={h.after} op={h.op} />
                    </div>
                  ))}
                  {e.hunks.length > 6 && (
                    <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>+{e.hunks.length - 6} more</p>
                  )}
                </article>
              ))}
            </div>
          </aside>
        </div>
      )}
    </>
  )
}

export function useChangelogOpen() {
  const [open, setOpen] = useState(false)
  return { open, setOpen }
}
