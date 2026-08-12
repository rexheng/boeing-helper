/** Track-changes: delete = strikethrough red, insert = green (no link-style underline). */
export function ReviewDiffText({
  before,
  after,
  op,
  maxChars = 140,
}: {
  before: string
  after: string
  op: "update" | "add" | "remove"
  /** Soft cap so long report fields don’t dump walls of text in the rail. */
  maxChars?: number
}) {
  const del = "#B91C1C"
  const ins = "#1F6B4A"
  const clip = (s: string) => {
    const t = s || "(empty)"
    if (t.length <= maxChars) return t
    return `${t.slice(0, maxChars).trimEnd()}…`
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
