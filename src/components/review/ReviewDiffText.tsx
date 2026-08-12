/** Track-changes: delete = strikethrough red, insert = green (no link-style underline). */
export function ReviewDiffText({
  before,
  after,
  op,
  maxChars = 160,
}: {
  before: string
  after: string
  op: "update" | "add" | "remove"
  /** Truncate long report field diffs for scannable review cards. */
  maxChars?: number
}) {
  const del = "#B91C1C"
  const ins = "#1F6B4A"
  const clip = (s: string) => {
    const t = (s || "(empty)").replace(/\s+/g, " ").trim()
    if (t.length <= maxChars) return t
    const slice = t.slice(0, maxChars)
    const boundary = Math.max(slice.lastIndexOf(" "), slice.lastIndexOf("—"), slice.lastIndexOf("-"))
    const cut = boundary > maxChars * 0.55 ? slice.slice(0, boundary) : slice
    return `${cut.trimEnd()}…`
  }
  if (op === "add") {
    return (
      <span style={{ color: ins, fontWeight: 600 }}>{clip(after)}</span>
    )
  }
  if (op === "remove") {
    return (
      <span style={{ color: del, textDecoration: "line-through" }}>{clip(before)}</span>
    )
  }
  return (
    <span className="inline-flex flex-wrap items-baseline gap-1">
      <span style={{ color: del, textDecoration: "line-through" }}>{clip(before)}</span>
      <span style={{ color: "#8896A3" }}>→</span>
      <span style={{ color: ins, fontWeight: 600 }}>{clip(after)}</span>
    </span>
  )
}
