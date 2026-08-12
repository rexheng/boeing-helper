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
  if (key === "engagementBody" || key === "Engagement Body") return "Engagement Body"
  if (key === "engagementTitle" || key === "Engagement Title") return "Engagement Title"
  if (key === "regionLabel" || key === "Region") return "Region"
  if (key === "showName" || key === "Show") return "Show"
  return key
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

  const spotlight = fieldLabel(highlightField)

  return (
    <div className={`report-docx-editor ${embedded ? "report-docx-editor--embedded" : "space-y-3"}`}>
      {!embedded ? (
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
      ) : (
        <p className="text-[11px] m-0" style={{ color: "var(--text-secondary)" }}>
          Word-accurate editor — <kbd className="px-1" style={{ background: "var(--bg-muted)" }}>Ctrl/Cmd+B</kbd> bold · Export from toolbar
        </p>
      )}

      {spotlight && (
        <div
          className={`report-docx-spotlight ${highlightMode === "applied" ? "is-applied" : "is-focus"}`}
          role="status"
        >
          Spotlight · {spotlight}
        </div>
      )}

      {error && (
        <p className="text-xs" style={{ color: "#B91C1C" }}>{error}</p>
      )}

      <div
        className="report-docx-host bg-white overflow-hidden"
        style={{ border: "1px solid var(--surface-border)", minHeight: embedded ? 420 : 560 }}
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
