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
 * Use `multiline` for textarea fields (Enter inserts newline; commit on blur).
 */
export function CellInput({
  value,
  onCommit,
  style,
  className,
  title,
  "aria-label": ariaLabel,
  multiline = false,
  rows = 3,
}: {
  value: string
  onCommit: (next: string) => void
  style?: CSSProperties
  className?: string
  title?: string
  "aria-label"?: string
  multiline?: boolean
  rows?: number
}) {
  const [draft, setDraft] = useState(value)
  const focused = useRef(false)

  useEffect(() => {
    if (!focused.current) setDraft(value)
  }, [value])

  const commit = () => {
    if (draft !== value) onCommit(draft)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!multiline && e.key === "Enter") {
      e.preventDefault()
      commit()
      ;(e.target as HTMLElement).blur()
    } else if (e.key === "Escape") {
      setDraft(value)
      ;(e.target as HTMLElement).blur()
    }
  }

  const shared = {
    className,
    value: draft,
    title,
    "aria-label": ariaLabel,
    style: { ...cellInput, ...style },
    onFocus: () => {
      focused.current = true
    },
    onBlur: () => {
      focused.current = false
      commit()
    },
    onChange: (e: { target: { value: string } }) => setDraft(e.target.value),
    onKeyDown,
  }

  if (multiline) {
    return <textarea {...shared} rows={rows} />
  }

  return <input {...shared} />
}

export { cellInput }
