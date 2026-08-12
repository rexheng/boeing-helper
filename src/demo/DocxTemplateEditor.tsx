import { useEffect, useRef, useState } from "react"
import { DocxEditor, type DocxEditorRef } from "@docx-editor.dev/react"
import "@docx-editor.dev/core/styles/editor.css"
import { Download, FileText, Loader2 } from "lucide-react"
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

export function DocxTemplateEditor({
  buildDocument,
  title,
  fileStem,
  pdfFallbackText,
  reloadKey,
  loadingLabel = "Building document…",
}: {
  buildDocument: () => Promise<ArrayBuffer>
  title: string
  fileStem: string
  pdfFallbackText: string
  /** Bump to rebuild the docx (e.g. after LLM accept). */
  reloadKey: number
  loadingLabel?: string
}) {
  const ref = useRef<DocxEditorRef>(null)
  const [buffer, setBuffer] = useState<ArrayBuffer | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<"load" | "docx" | "pdf" | null>("load")
  const buildRef = useRef(buildDocument)
  buildRef.current = buildDocument

  useEffect(() => {
    let cancelled = false
    setBusy("load")
    setError(null)
    buildRef
      .current()
      .then((buf) => {
        if (cancelled) return
        setBuffer(buf)
        ref.current?.load(buf)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : "Failed to build document")
      })
      .finally(() => {
        if (!cancelled) setBusy((b) => (b === "load" ? null : b))
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const handleWord = async () => {
    setBusy("docx")
    try {
      const saved = await ref.current?.save()
      if (saved) {
        downloadBuffer(saved, `${fileStem}.docx`)
      } else {
        const buf = await buildRef.current()
        downloadBuffer(buf, `${fileStem}.docx`)
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
      const text = fromEditor.trim() || pdfFallbackText

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
      doc.text(title, W / 2, y, { align: "center" })
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
      doc.save(`${fileStem}.pdf`)
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Word-accurate editor — <kbd className="px-1" style={{ background: "var(--bg-muted)" }}>Ctrl/Cmd+B</kbd> bold,{" "}
          <kbd className="px-1" style={{ background: "var(--bg-muted)" }}>I</kbd> italic,{" "}
          <kbd className="px-1" style={{ background: "var(--bg-muted)" }}>U</kbd> underline, Undo/Redo, zoom in chrome.
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

      {error && (
        <p className="text-xs" style={{ color: "#B91C1C" }}>{error}</p>
      )}

      <div
        className="report-docx-host bg-white overflow-hidden"
        style={{ border: "1px solid var(--surface-border)", minHeight: 560 }}
      >
        {busy === "load" && !buffer && (
          <div className="flex items-center justify-center gap-2 py-24 text-sm" style={{ color: NAVY }}>
            <Loader2 size={16} className="animate-spin" /> {loadingLabel}
          </div>
        )}
        {buffer && (
          <DocxEditor
            ref={ref}
            document={buffer}
            mode="edit"
            title={title}
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
