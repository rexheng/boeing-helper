import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  CheckCircle2,
  Download,
  FileText,
  Loader2,
  Lock,
  Upload,
  X,
} from "lucide-react"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ExtractedInternalDocument, PriorMeetingPaper } from "../types/internalDocument"
import type { ResearchResult } from "../types/research"
import { extractInternalDocument } from "../utils/internalDocumentExtract"
import { downloadPriorMeetingPaper, generatePriorMeetingPaper } from "../utils/pastMeetingPaper"

type Phase = "idle" | "processing" | "complete"

interface Stage {
  id: string
  label: string
  completeLabel: string
  at: number
  fieldIds: string[]
}

const STAGES: Stage[] = [
  { id: "ingest", label: "Reading document…", completeLabel: "Document ingested", at: 0, fieldIds: [] },
  { id: "parse", label: "Matching meeting-paper template…", completeLabel: "Fixed-format template recognised", at: 720, fieldIds: [] },
  { id: "date", label: "Extracting date stamp…", completeLabel: "Date stamp locked", at: 1480, fieldIds: ["date", "event"] },
  { id: "counterpart", label: "Reading counterpart and RAA…", completeLabel: "Counterpart identified", at: 2280, fieldIds: ["counterpart"] },
  { id: "objectives", label: "Extracting objectives and messages…", completeLabel: "Objectives captured", at: 3120, fieldIds: ["obj-0", "obj-1", "obj-2"] },
  { id: "open", label: "Carrying forward open items…", completeLabel: "Open items synthesised", at: 4080, fieldIds: ["open-0", "open-1", "open-2"] },
  { id: "commit", label: "Recording commitments…", completeLabel: "Commitments filed", at: 4880, fieldIds: ["cmt-0", "cmt-1"] },
  { id: "synth", label: "Writing into the research brief…", completeLabel: "Filed in Research Brief", at: 5680, fieldIds: [] },
]

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function fileKind(name: string) {
  if (name.endsWith(".pdf")) return "PDF"
  if (name.endsWith(".doc") || name.endsWith(".docx")) return "DOC"
  if (name.endsWith(".txt")) return "TXT"
  return "FILE"
}

interface InternalDocumentsPanelProps {
  company: Company
  person: Person
  meetingType: string
  research?: ResearchResult | null
  compact?: boolean
  extracted: ExtractedInternalDocument | null
  onExtracted: (doc: ExtractedInternalDocument) => void
  onClear?: () => void
}

export function InternalDocumentsPanel({
  company,
  person,
  meetingType,
  research,
  compact,
  extracted,
  onExtracted,
  onClear,
}: InternalDocumentsPanelProps) {
  const paper = useMemo(
    () => generatePriorMeetingPaper(company, person, meetingType, research),
    [company, person, meetingType, research],
  )
  const [phase, setPhase] = useState<Phase>(extracted ? "complete" : "idle")
  const [dragOver, setDragOver] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [activeStage, setActiveStage] = useState(0)
  const [liveFields, setLiveFields] = useState<Set<string>>(new Set())
  const [doneFields, setDoneFields] = useState<Set<string>>(new Set())
  const [workingFile, setWorkingFile] = useState<{ name: string; size: number } | null>(
    extracted ? { name: extracted.fileName, size: extracted.fileSize } : null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (extracted && phase === "idle") setPhase("complete")
  }, [extracted, phase])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  useEffect(() => {
    if (phase === "processing") {
      rootRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [phase])

  const runTheatre = useCallback(
    (file: File) => {
      clearTimers()
      setWorkingFile({ name: file.name, size: file.size })
      setPhase("processing")
      setActiveStage(0)
      setLiveFields(new Set())
      setDoneFields(new Set())

      const extractPromise = extractInternalDocument(file, company, person, meetingType, research)

      STAGES.forEach((stage, index) => {
        const id = window.setTimeout(() => {
          setActiveStage(index)
          if (stage.fieldIds.length) {
            setLiveFields(new Set(stage.fieldIds))
            setDoneFields((prev) => {
              const next = new Set(prev)
              stage.fieldIds.forEach((fid) => next.add(fid))
              return next
            })
          }
        }, stage.at)
        timers.current.push(id)
      })

      const finishAt = 6400
      const id = window.setTimeout(async () => {
        const doc = await extractPromise
        setLiveFields(new Set())
        setPhase("complete")
        onExtracted(doc)
      }, finishAt)
      timers.current.push(id)
    },
    [company, person, meetingType, research, onExtracted],
  )

  const handleFiles = useCallback(
    (list: FileList | File[]) => {
      const files = Array.from(list)
      const preferred =
        files.find((f) => /\.(docx|doc|pdf|txt)$/i.test(f.name)) ?? files[0]
      if (!preferred) return
      runTheatre(preferred)
    },
    [runTheatre],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadPriorMeetingPaper(paper)
    } finally {
      setDownloading(false)
    }
  }

  const reset = () => {
    clearTimers()
    setPhase("idle")
    setWorkingFile(null)
    setActiveStage(0)
    setLiveFields(new Set())
    setDoneFields(new Set())
    onClear?.()
  }

  const displayPaper = extracted?.paper ?? paper
  const showTheatre = phase === "processing" || (phase === "complete" && !compact)

  return (
    <div className={`idp ${compact ? "idp--compact" : ""}`} ref={rootRef}>
      <div className="idp-head">
        <div className="idp-head__icon" aria-hidden>
          <Lock size={14} />
        </div>
        <div className="idp-head__copy">
          <p className="idp-kicker">Internal</p>
          <h3 className="idp-title">Upload Internal Documents</h3>
          {!compact && (
            <p className="idp-lede">
              Prior meeting papers are read against the fixed Boeing template, then written into the research brief.
            </p>
          )}
        </div>
      </div>

      {phase === "idle" && (
        <div className="idp-sample">
          <div className="idp-sample__stamp">
            <span className="idp-sample__label">Sample prior paper</span>
            <span className="idp-sample__date">{paper.dateLabel}</span>
          </div>
          <p className="idp-sample__meta">
            {paper.locationOrEvent} · {paper.fileName}
          </p>
          <button type="button" className="idp-download" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
            Download Word template
          </button>
        </div>
      )}

      {phase === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`idp-drop ${dragOver ? "is-over" : ""} ${compact ? "idp-drop--compact" : ""}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click()
          }}
        >
          <Upload size={compact ? 16 : 18} />
          <p>{dragOver ? "Drop the meeting paper" : "Drag & drop files, or click to browse"}</p>
          <span>PDF, TXT, DOC, DOCX — fixed-format meeting paper</span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files)
              e.target.value = ""
            }}
            className="hidden"
          />
        </div>
      )}

      {showTheatre && workingFile && (
        <div className={`idp-theatre ${phase === "complete" ? "is-done" : ""}`} aria-live="polite">
          {!compact && (
            <PaperFacsimile
              paper={displayPaper}
              fileName={workingFile.name}
              liveFields={liveFields}
              doneFields={phase === "complete" ? new Set(["date", "event", "counterpart", "obj-0", "obj-1", "obj-2", "open-0", "open-1", "open-2"]) : doneFields}
              scanning={phase === "processing"}
            />
          )}
          {phase === "processing" && (
            <ExtractionStream
              stages={STAGES}
              activeStage={activeStage}
              complete={false}
              fileName={workingFile.name}
              fileSize={workingFile.size}
              paper={displayPaper}
            />
          )}
        </div>
      )}

      {phase === "complete" && extracted && (
        <div className="idp-result">
          <div className="idp-file">
            <div className="idp-file__glyph">{fileKind(extracted.fileName)}</div>
            <div className="idp-file__body">
              <p className="idp-file__name">{extracted.fileName}</p>
              <p className="idp-file__meta">
                {extracted.paper.dateLabel} · {extracted.paper.locationOrEvent} · {formatFileSize(extracted.fileSize)}
              </p>
            </div>
            <CheckCircle2 size={16} className="idp-file__ok" />
            <button type="button" className="idp-file__remove" onClick={reset} aria-label="Remove document">
              <X size={13} />
            </button>
          </div>
          <p className="idp-result__kicker">Synthesised for the research brief</p>
          <ul className="idp-insights">
            {extracted.paper.openItems.map((item) => (
              <li key={item}>
                <span>Open</span>
                {item}
              </li>
            ))}
            {extracted.paper.commitments.slice(0, compact ? 1 : 2).map((item) => (
              <li key={item} className="is-commit">
                <span>Commit</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="idp-result__foot">
            <FileText size={12} />
            Filed as an internal source · carries into Compose paper
          </p>
        </div>
      )}
    </div>
  )
}

function PaperFacsimile({
  paper,
  fileName,
  liveFields,
  doneFields,
  scanning,
}: {
  paper: PriorMeetingPaper
  fileName: string
  liveFields: Set<string>
  doneFields: Set<string>
  scanning: boolean
}) {
  const mark = (id: string) =>
    liveFields.has(id) ? "is-live" : doneFields.has(id) ? "is-done" : ""

  return (
    <article className="idp-sheet" aria-hidden>
      {scanning && <div className="idp-scan" />}
      <header className="idp-sheet__banner">
        <span>Boeing</span>
        <span>Meeting paper</span>
        <span>Proprietary</span>
      </header>
      <div className="idp-sheet__body">
        <p className="idp-sheet__class">{paper.classification}</p>
        <p className="idp-sheet__title">{paper.meetingTitle.replace(/^MEETING WITH\s+/i, "Meeting With ")}</p>
        <p className="idp-sheet__sub">{paper.subtitle}</p>
        <dl className="idp-sheet__meta">
          <div className={mark("date")}>
            <dt>Date</dt>
            <dd>{paper.dateLabel}</dd>
          </div>
          <div className={mark("event")}>
            <dt>Event</dt>
            <dd>{paper.locationOrEvent}</dd>
          </div>
          <div className={mark("counterpart")}>
            <dt>Customer</dt>
            <dd>
              {paper.customer.name}
              <em>{paper.customer.salutation}</em>
            </dd>
          </div>
        </dl>
        <p className="idp-sheet__h">Objectives</p>
        <ol>
          {paper.objectives.slice(0, 3).map((o, i) => (
            <li key={o} className={mark(`obj-${i}`)}>
              {o}
            </li>
          ))}
        </ol>
        <p className="idp-sheet__h">Open items — carry forward</p>
        <ul>
          {paper.openItems.slice(0, 3).map((o, i) => (
            <li key={o} className={mark(`open-${i}`)}>
              {o}
            </li>
          ))}
        </ul>
      </div>
      <footer className="idp-sheet__foot">
        {fileName} · {paper.dateLabel}
      </footer>
    </article>
  )
}

function ExtractionStream({
  stages,
  activeStage,
  complete,
  fileName,
  fileSize,
  paper,
}: {
  stages: Stage[]
  activeStage: number
  complete: boolean
  fileName: string
  fileSize: number
  paper: PriorMeetingPaper
}) {
  return (
    <div className="idp-stream">
      <div className="idp-stream__file">
        <div className="idp-file__glyph">DOC</div>
        <div>
          <p className="idp-file__name">{fileName}</p>
          <p className="idp-file__meta">{formatFileSize(fileSize)} · Boeing meeting-paper template</p>
        </div>
      </div>
      <ol className="idp-log">
        {stages.map((stage, i) => {
          const status = complete || i < activeStage ? "done" : i === activeStage ? "run" : "wait"
          return (
            <li key={stage.id} data-status={status}>
              {status === "done" ? (
                <CheckCircle2 size={13} />
              ) : status === "run" ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <span className="idp-log__dot" />
              )}
              <span>{status === "done" ? stage.completeLabel : stage.label}</span>
            </li>
          )
        })}
      </ol>
      {complete && (
        <p className="idp-stream__done">
          {paper.openItems.length} open items · {paper.commitments.length} commitments ready for the brief
        </p>
      )}
    </div>
  )
}
