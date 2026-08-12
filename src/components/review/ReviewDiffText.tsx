/** Red track-changes: deleted = strikethrough, inserted = underline. */
export function ReviewDiffText({
  before,
  after,
  op,
}: {
  before: string
  after: string
  op: "update" | "add" | "remove"
}) {
  const red = "#B91C1C"
  if (op === "add") {
    return (
      <span style={{ color: red, textDecoration: "underline" }}>{after || "(empty)"}</span>
    )
  }
  if (op === "remove") {
    return (
      <span style={{ color: red, textDecoration: "line-through" }}>{before || "(empty)"}</span>
    )
  }
  return (
    <span className="inline-flex flex-wrap items-baseline gap-1">
      <span style={{ color: red, textDecoration: "line-through" }}>{before || "(empty)"}</span>
      <span style={{ color: "#888" }}>→</span>
      <span style={{ color: red, textDecoration: "underline" }}>{after || "(empty)"}</span>
    </span>
  )
}
