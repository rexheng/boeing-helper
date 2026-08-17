import type { ReviewComment } from "../utils/meetingPaperGenerator"

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
        <h3>Missing context</h3>
        <p>
          Short gaps to fill on this paper. Click a card to jump to that field. The same notes land in
          Word’s Review pane on download.
        </p>
        <p className="helper-comments__count">{comments.length} comments · BH</p>
      </header>
      <ol className="helper-comments__list">
        {comments.map((c, i) => {
          const active = activeId === c.id
          const topic = c.topic || c.sectionLabel
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
                </div>
                <p className="helper-comment__label">
                  Boeing Helper: Missing context — {topic}
                </p>
                <p className="helper-comment__text">{c.text}</p>
              </button>
            </li>
          )
        })}
      </ol>
    </aside>
  )
}
