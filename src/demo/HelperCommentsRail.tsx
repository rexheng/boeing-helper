import { MessageSquareWarning, ShieldAlert, CircleHelp } from "lucide-react"
import type { ReviewComment } from "../utils/meetingPaperGenerator"

const BLUE = "#0033A1"

const SEVERITY: Record<
  ReviewComment["severity"],
  { label: string; color: string; bg: string; Icon: typeof CircleHelp }
> = {
  ask: { label: "Ask", color: BLUE, bg: "rgba(0,51,161,0.08)", Icon: CircleHelp },
  caution: { label: "Caution", color: "#B26A00", bg: "rgba(178,106,0,0.1)", Icon: ShieldAlert },
  verify: { label: "Verify", color: "#0A2240", bg: "rgba(10,34,64,0.06)", Icon: MessageSquareWarning },
}

export function HelperCommentsRail({
  comments,
  activeId,
  onSelect,
}: {
  comments: ReviewComment[]
  activeId?: string | null
  onSelect?: (id: string) => void
}) {
  return (
    <aside className="helper-comments" aria-label="Boeing Helper comments">
      <header className="helper-comments__head">
        <p className="helper-comments__eyebrow">Boeing Helper · Review</p>
        <h3>Comments on this paper</h3>
        <p>
          The document is scaffolding. These are the freeze questions — name, date, number, or cut the
          claim. Click a card to highlight that field on the paper. The same comments land in Word’s Review
          pane on download.
        </p>
        <p className="helper-comments__count">{comments.length} comments · BH</p>
      </header>
      <ol className="helper-comments__list">
        {comments.map((c, i) => {
          const sev = SEVERITY[c.severity]
          const Icon = sev.Icon
          const active = activeId === c.id
          return (
            <li key={c.id}>
              <button
                type="button"
                className={`helper-comment ${active ? "is-active" : ""}`}
                onClick={() => onSelect?.(c.id)}
              >
                <div className="helper-comment__meta">
                  <span className="helper-comment__bh" title="Boeing Helper">
                    BH
                  </span>
                  <span className="helper-comment__n">{i + 1}</span>
                  <span className="helper-comment__section">{c.sectionLabel}</span>
                  <span
                    className="helper-comment__sev"
                    style={{ color: sev.color, background: sev.bg }}
                  >
                    <Icon size={11} />
                    {sev.label}
                  </span>
                </div>
                <p className="helper-comment__text">{c.text}</p>
              </button>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
