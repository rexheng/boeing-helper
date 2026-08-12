/** Track-changes: delete = strikethrough red, insert = green (no link-style underline). */
export function ReviewDiffText({
  before,
  after,
  op,
}: {
  before: string
  after: string
  op: "update" | "add" | "remove"
}) {
  const del = "#B91C1C"
  const ins = "#1F6B4A"
  if (op === "add") {
    return (
      <span style={{ color: ins, fontWeight: 600 }}>{after || "(empty)"}</span>
    )
  }
  if (op === "remove") {
    return (
      <span style={{ color: del, textDecoration: "line-through" }}>{before || "(empty)"}</span>
    )
  }
  return (
    <span className="inline-flex flex-wrap items-baseline gap-1">
      <span style={{ color: del, textDecoration: "line-through" }}>{before || "(empty)"}</span>
      <span style={{ color: "#8896A3" }}>→</span>
      <span style={{ color: ins, fontWeight: 600 }}>{after || "(empty)"}</span>
    </span>
  )
}
