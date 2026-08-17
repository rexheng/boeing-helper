/**
 * Find the tightest on-screen block in the Word editor that contains a needle
 * and mark it so a Helper comment click feels like a Word comment jump.
 */
export function highlightPaperField(root: HTMLElement, needles: string[]): HTMLElement | null {
  clearPaperHighlights(root)
  const cleaned = needles
    .map((n) => n.replace(/\s+/g, " ").trim())
    .filter((n) => n.length >= 4)
    .map((n) => (n.length > 64 ? n.slice(0, 64) : n))

  if (!cleaned.length) return null

  const blocks = collectBlocks(root)
  let best: { el: HTMLElement; score: number } | null = null

  for (const el of blocks) {
    if (el.closest("[data-bh-highlight-chrome]")) continue
    const text = (el.textContent || "").replace(/\s+/g, " ").trim()
    if (text.length < 4) continue
    for (const needle of cleaned) {
      const idx = text.toLowerCase().indexOf(needle.toLowerCase())
      if (idx === -1) continue
      const tightness = needle.length / Math.max(text.length, needle.length)
      const depth = el.querySelectorAll("p, span, div").length
      const score = tightness * 10 - depth * 0.01 + (idx === 0 ? 0.2 : 0)
      if (!best || score > best.score) best = { el, score }
    }
  }

  if (!best) return null
  const target = closestHighlightable(best.el)
  target.dataset.bhHighlight = "true"
  target.dataset.bhPrevOutline = target.style.outline
  target.dataset.bhPrevBg = target.style.backgroundColor
  target.classList.add("paper-field-highlight")
  target.style.outline = "2px solid #e8b923"
  target.style.backgroundColor = "rgba(232, 185, 35, 0.28)"
  target.style.boxShadow = "0 0 0 4px rgba(232, 185, 35, 0.14)"
  target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" })
  return target
}

export function clearPaperHighlights(root: HTMLElement) {
  for (const el of collectBlocks(root)) {
    if (!el.dataset.bhHighlight) continue
    delete el.dataset.bhHighlight
    el.classList.remove("paper-field-highlight")
    el.style.outline = el.dataset.bhPrevOutline ?? ""
    el.style.backgroundColor = el.dataset.bhPrevBg ?? ""
    el.style.boxShadow = ""
    delete el.dataset.bhPrevOutline
    delete el.dataset.bhPrevBg
  }
}

function collectBlocks(root: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = []
  const visit = (node: ParentNode) => {
    node.querySelectorAll<HTMLElement>("p, h1, h2, h3, h4, td, li, span, div").forEach((el) => out.push(el))
    node.querySelectorAll("*").forEach((el) => {
      if (el.shadowRoot) visit(el.shadowRoot)
    })
  }
  visit(root)
  if (root.shadowRoot) visit(root.shadowRoot)
  return out
}

function closestHighlightable(el: HTMLElement): HTMLElement {
  return el.closest("p, h1, h2, h3, h4, td, li") ?? el
}
