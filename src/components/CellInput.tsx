import { useEffect, useRef, useState } from "react"
import type { CSSProperties, KeyboardEvent } from "react"

const cellInput: CSSProperties = {
  width: "100%",
  border: "none",
  background: "transparent",
  outline: "none",
  font: "inherit",
  padding: 0,
  margin: 0,
  color: "inherit",
}

/**
 * Local-draft cell input: commits on blur / Enter so parent re-renders
 * do not steal the caret mid-keystroke.
 */
export function CellInput({
  value,
  onCommit,
  style,
  className,
  title,
  "aria-label": ariaLabel,
}: {
  value: string
  onCommit: (next: string) => void
  style?: CSSProperties
  className?: string
  title?: string
  "aria-label"?: string
}) {
  const [draft, setDraft] = useState(value)
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(value)
  }, [value])

  const commit = () => {
    if (draft !== value) onCommit(draft)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      commit()
      ;(e.target as HTMLInputElement).blur()
    } else if (e.key === "Escape") {
      setDraft(value)
      ;(e.target as HTMLInputElement).blur()
    }
  }

  return (
    <input
      className={className}
      value={draft}
      title={title}
      aria-label={ariaLabel}
      style={{ ...cellInput, ...style }}
      onFocus={() => {
        focused.current = true
      }}
      onBlur={() => {
        focused.current = false
        commit()
      }}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={onKeyDown}
    />
  )
}

export { cellInput }
