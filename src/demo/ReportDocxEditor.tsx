import { useEffect, useRef, useState } from "react"
import { DocxEditor, type DocxEditorRef } from "@docx-editor.dev/react"
import "@docx-editor.dev/core/styles/editor.css"
import { Download, FileText, Loader2 } from "lucide-react"
import { buildAirshowReportDocx, type AirshowReportData } from "../utils/templateExport"
import { jsPDF } from "jspdf"

const BLUE = "#0033A1"
const NAVY = "#0A2240"

function downloadBuffer(buf: ArrayBuffer, filename: string) {
  const blob = new Blob([new Uint8Array(buf)], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  })
  const a = document.createElement("a")
  a.href = URL.createObjectURL(blob)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
}

function editorPlainText(editor: { query?: (q: { type: string }) => unknown } | null | undefined): string {
  try {
    const result = editor?.query?.({ type: "getText" }) as { text?: string; value?: string } | string | null
    if (!result) return ""
    if (typeof result === "string") return result
    return result.text || result.value || ""
  } catch {
    return ""
  }
}

function fieldLabel(key?: string) {
  if (!key) return ""
  if (key === "executiveSummary" || key === "Executive Summary") return "Executive Summary"
  if (key === "engagementBody" || key === "Engagement Body") return "Engagement"
  if (key === "engagementTitle" || key === "Engagement Title") return "Engagement"
  if (key === "regionLabel" || key === "Region") return "ASIA PACIFIC"
  if (key === "showName" || key === "Show") return "Summary Report"
  return key
}

function searchSnippets(data: AirshowReportData, key?: string): string[] {
  if (!key) return []
  if (key === "executiveSummary" || key === "Executive Summary") {
    return ["Executive Summary", data.executiveSummary.slice(0, 48)]
  }
  if (key === "engagementBody" || key === "Engagement Body") {
    return [data.engagementTitle, data.engagementBody.slice(0, 48), "ACTION:"]
  }
  if (key === "engagementTitle" || key === "Engagement Title") {
    return [data.engagementTitle]
  }
  if (key === "regionLabel" || key === "Region") {
    return [data.regionLabel, "ASIA PACIFIC"]
  }
  if (key === "showName" || key === "Show") {
    return [data.showName, "Summary Report"]
  }
  return [fieldLabel(key)]
}

function clearInDocHighlights(root: HTMLElement) {
  root.querySelectorAll(".report-docx-in-highlight").forEach((el) => {
    el.classList.remove("report-docx-in-highlight", "is-applied", "sheet-row-highlight")
  })
  root.classList.remove("sheet-is-reviewing", "sheet-is-applied")
}

/** Best-effort: find a rendered Word paragraph/heading and pulse it in place. */
function pulseInDocument(root: HTMLElement, snippets: string[], mode?: "focus" | "applied") {
  clearInDocHighlights(root)
  if (!snippets.length) return
  root.classList.add(mode === "applied" ? "sheet-is-applied" : "sheet-is-reviewing")

  const candidates = Array.from(
    root.querySelectorAll<HTMLElement>("p, h1, h2, h3, h4, td, span, div"),
  )

  for (const snippet of snippets) {
    const needle = snippet.trim()
    if (needle.length < 3) continue
    const hit = candidates.find((el) => {
      const t = (el.textContent || "").replace(/\s+/g, " ").trim()
      return t.includes(needle) && t.length < 800
    })
    if (hit) {
      hit.classList.add("report-docx-in-highlight", "sheet-row-highlight")
      if (mode === "applied") hit.classList.add("is-applied")
      hit.scrollIntoView({ behavior: "smooth", block: "nearest" })
      return
    }
  }
}

export function ReportDocxEditor({
  data,
  reloadKey,
  embedded = false,
  highlightField,
  highlightMode,
}: {
  data: AirshowReportData
  /** Bump to rebuild the docx from `data` (e.g. after LLM accept). */
  reloadKey: number
  /** Compact chrome when hosted inside the docked sheet pane. */
  embedded?: boolean
  highlightField?: string
  highlightMode?: "focus" | "applied"
}) {
  const ref = useRef<DocxEditorRef>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<"load" | "docx" | "pdf" | null>("load")

  useEffect(() => {
    let cancelled = false
    setBusy("load")
    setError(null)
    buildAirshowReportDocx(data)
      .then((buf) => {
        if (cancelled) return
        setBuffer(buf)
        ref.current?.load(buf)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to build report document")
      })
      .finally(() => {
        if (!cancelled) setBusy((b) => (b === "load" ? null : b))
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reloadKey forces rebuild from latest data
  }, [reloadKey])

  useEffect(() => {
    const root = hostRef.current
    if (!root) return
    if (!highlightField) {
      clearInDocHighlights(root)
      return
    }
    const snippets = searchSnippets(data, highlightField)
    const run = () => pulseInDocument(root, snippets, highlightMode)
    run()
    const t1 = window.setTimeout(run, 280)
    const t2 = window.setTimeout(run, 700)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [highlightField, highlightMode, buffer, data, busy])

  const handleWord = async () => {
    setBusy("docx")
    try {
      const saved = await ref.current?.save()
      if (saved) {
        downloadBuffer(saved, `${data.showName.replace(/\s+/g, "-")}-Summary-Report.docx`)
      } else {
        const buf = await buildAirshowReportDocx(data)
        downloadBuffer(buf, `${data.showName.replace(/\s+/g, "-")}-Summary-Report.docx`)
      }
    } catch (err) {
      console.error(err)
      setError("Word export failed")
    } finally {
      setBusy(null)
    }
  }

  const handlePdf = async () => {
    setBusy("pdf")
    try {
      const editor = ref.current?.getEditor()
      const fromEditor = editorPlainText(editor as { query?: (q: { type: string }) => unknown })
      const text =
        fromEditor.trim() ||
        `Executive Summary\n${data.executiveSummary}\n\n${data.regionLabel}\n${data.engagementTitle}\n${data.engagementBody}`

      const doc = new jsPDF({ unit: "mm", format: "letter" })
      const W = 215.9
      const ML = 25.4
      const MR = 25.4
      const contentW = W - ML - MR
      let y = 25.4
      doc.setFont("helvetica", "bold")
      doc.setFontSize(12)
      doc.text("BOEING", W - MR, 18, { align: "right" })
      doc.setFontSize(10)
      doc.text(`${data.showName} Summary Report`, W / 2, y, { align: "center" })
      y += 12
      doc.setFont("helvetica", "normal")
      const lines = doc.splitTextToSize(text, contentW)
      for (const line of lines) {
        if (y > 260) {
          doc.addPage()
          y = 25
        }
        doc.text(line, ML, y)
        y += 5
      }
      doc.setFont("helvetica", "bold")
      doc.text("BOEING PROPRIETARY", W / 2, 270, { align: "center" })
      doc.save(`${data.showName.replace(/\s+/g, "-")}-Summary-Report.pdf`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className={`report-docx-editor ${embedded ? "report-docx-editor--embedded" : "space-y-3"}`}>
      {!embedded && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
            Word-accurate editor — <kbd className="px-1" style={{ background: "var(--bg-muted)" }}>Ctrl/Cmd+B</kbd>{" "}
            bold · Undo/Redo in chrome
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleWord}
              disabled={!!busy}
              className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold text-white disabled:opacity-60"
              style={{ background: BLUE }}
            >
              {busy === "docx" ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />}
              Download Word
            </button>
            <button
              type="button"
              onClick={handlePdf}
              disabled={!!busy}
              className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold disabled:opacity-60"
              style={{ border: `1px solid ${NAVY}`, color: NAVY, background: "#fff" }}
            >
              {busy === "pdf" ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              Download PDF
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs" style={{ color: "#B91C1C" }}>{error}</p>
      )}

      <div
        ref={hostRef}
        className={[
          "report-docx-host bg-white overflow-auto",
          highlightField && highlightMode === "focus" ? "sheet-is-reviewing is-field-focus" : "",
          highlightField && highlightMode === "applied" ? "sheet-is-applied is-field-applied" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ border: "1px solid #9AA3AD", minHeight: embedded ? 480 : 560 }}
      >
        {busy === "load" && !buffer && (
          <div className="flex items-center justify-center gap-2 py-24 text-sm" style={{ color: NAVY }}>
            <Loader2 size={16} className="animate-spin" /> Building report document…
          </div>
        )}
        {buffer && (
          <DocxEditor
            ref={ref}
            document={buffer}
            mode="edit"
            title={`${data.showName} Summary Report`}
            chrome
            navigation={false}
            rulers={false}
            className="boeing-docx-editor"
          />
        )}
      </div>
    </div>
  )
}
