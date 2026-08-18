import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { CheckCircle2, Download, FileText, Loader2, Lock, Upload, X } from "lucide-react"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ExtractedInternalDocument, PriorMeetingPaper } from "../types/internalDocument"
import type { ResearchResult } from "../types/research"
import { extractInternalDocument } from "../utils/internalDocumentExtract"
import { downloadPriorMeetingPaper, generatePriorMeetingPaper } from "../utils/pastMeetingPaper"

type Phase = "idle" | "processing" | "complete" | "error"

interface Beat {
  id: string
  label: string
  at: number
  fieldIds: string[]
}

const BEATS: Beat[] = [
  { id: "read", label: "Reading the meeting paper", at: 0, fieldIds: ["date", "event"] },
  { id: "extract", label: "Extracting template fields", at: 520, fieldIds: ["contact", "counterpart", "obj-0", "obj-1", "obj-2"] },
  { id: "file", label: "Filing open items into the brief", at: 1180, fieldIds: ["open-0", "open-1", "open-2"] },
]

const FINISH_AT = 1780
const ACCEPT = ".pdf,.txt,.doc,.docx"

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}

function isAccepted(file: File) {
  return /\.(pdf|txt|docx?)$/i.test(file.name)
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
  const [error, setError] = useState<string | null>(null)
  const [beat, setBeat] = useState(0)
  const [liveFields, setLiveFields] = useState<Set<string>>(new Set())
  const [doneFields, setDoneFields] = useState<Set<string>>(new Set())
  const [workingFile, setWorkingFile] = useState<{ name: string; size: number } | null>(
    extracted ? { name: extracted.fileName, size: extracted.fileSize } : null,
  )
  const inputId = useId()
  const dragDepth = useRef(0)
  const timers = useRef<number[]>([])

  useEffect(() => {
    if (extracted && phase === "idle") setPhase("complete")
  }, [extracted, phase])

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id))
    timers.current = []
  }

  useEffect(() => () => clearTimers(), [])

  const runTheatre = useCallback(
    (file: File) => {
      clearTimers()
      setError(null)
      setWorkingFile({ name: file.name, size: file.size })
      setPhase("processing")
      setBeat(0)
      setLiveFields(new Set())
      setDoneFields(new Set())

      const extractPromise = extractInternalDocument(file, company, person, meetingType, research)

      BEATS.forEach((item, index) => {
        const id = window.setTimeout(() => {
          setBeat(index)
          setLiveFields(new Set(item.fieldIds))
          setDoneFields((prev) => {
            const next = new Set(prev)
            item.fieldIds.forEach((fid) => next.add(fid))
            return next
          })
        }, item.at)
        timers.current.push(id)
      })

      const id = window.setTimeout(async () => {
        try {
          const doc = await extractPromise
          setLiveFields(new Set())
          setPhase("complete")
          onExtracted(doc)
        } catch {
          setPhase("error")
          setError("The document could not be read. Try the sample Word paper.")
        }
      }, FINISH_AT)
      timers.current.push(id)
    },
    [company, person, meetingType, research, onExtracted],
  )

  const handleFiles = useCallback(
    (list: FileList | File[]) => {
      const files = Array.from(list)
      const preferred = files.find(isAccepted)
      if (!preferred) {
        setError("Use a PDF, Word, or text meeting paper.")
        setPhase("error")
        return
      }
      runTheatre(preferred)
    },
    [runTheatre],
  )

  const handleDownload = async () => {
    setDownloading(true)
    setError(null)
    try {
      await downloadPriorMeetingPaper(paper)
    } catch {
      setError("The sample paper could not be built. Try again.")
      setPhase("error")
    } finally {
      setDownloading(false)
    }
  }

  const reset = () => {
    clearTimers()
    setPhase("idle")
    setWorkingFile(null)
    setBeat(0)
    setError(null)
    setLiveFields(new Set())
    setDoneFields(new Set())
    onClear?.()
  }

  const displayPaper = extracted?.paper ?? paper
  const completeFields = new Set([
    "date",
    "event",
    "contact",
    "counterpart",
    "obj-0",
    "obj-1",
    "obj-2",
    "open-0",
    "open-1",
    "open-2",
  ])

  return (
    <div className={`idp ${compact ? "idp--compact" : ""}`}>
      <div className="idp-head">
        <div className="idp-head__icon" aria-hidden>
          <Lock size={14} />
        </div>
        <div>
          <p className="idp-kicker">Internal</p>
          <h3 className="idp-title">Upload Internal Documents</h3>
          {!compact && (
            <p className="idp-lede">
              Prior meeting papers are read against the fixed Boeing template, then written into the research brief.
            </p>
          )}
        </div>
      </div>

      {(phase === "idle" || phase === "error") && (
        <>
          <div className="idp-sample">
            <div className="idp-sample__stamp">
              <span className="idp-sample__label">Prior paper</span>
              <span className="idp-sample__date">{paper.dateLabel}</span>
              <span className="idp-sample__meta">
                {paper.locationOrEvent}
              </span>
            </div>
            <button type="button" className="idp-download" onClick={handleDownload} disabled={downloading}>
              {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
              Download Word
            </button>
          </div>

          <label
            htmlFor={inputId}
            className={`idp-drop ${dragOver ? "is-over" : ""}`}
            onDragEnter={(e) => {
              e.preventDefault()
              dragDepth.current += 1
              setDragOver(true)
            }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => {
              dragDepth.current = Math.max(0, dragDepth.current - 1)
              if (dragDepth.current === 0) setDragOver(false)
            }}
            onDrop={(e) => {
              e.preventDefault()
              dragDepth.current = 0
              setDragOver(false)
              if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
            }}
          >
            <Upload size={16} />
            <span className="idp-drop__copy">
              <strong>{dragOver ? "Drop the meeting paper" : "Drop the filled meeting paper, or browse"}</strong>
              <em>PDF, DOC, DOCX, TXT</em>
            </span>
            <input
              id={inputId}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files)
                e.target.value = ""
              }}
            />
          </label>
        </>
      )}

      {phase === "error" && error && (
        <p className="idp-error" role="alert">
          {error}
        </p>
      )}

      {phase === "processing" && workingFile && (
        <div className="idp-theatre" aria-live="polite" aria-atomic="true">
          {!compact && (
            <PaperFacsimile
              paper={displayPaper}
              fileName={workingFile.name}
              liveFields={liveFields}
              doneFields={doneFields}
            />
          )}
          <p className="idp-status">
            <Loader2 size={14} className="animate-spin" />
            {BEATS[beat]?.label}
            <span>
              {workingFile.name} · {formatFileSize(workingFile.size)}
            </span>
          </p>
        </div>
      )}

      {phase === "complete" && extracted && (
        <div className="idp-result">
          {compact ? (
            <div className="idp-file">
              <div className="idp-file__glyph" aria-hidden>
                DOC
              </div>
              <div className="idp-file__body">
                <p className="idp-file__name">{extracted.fileName}</p>
                <p className="idp-file__meta">
                  {extracted.paper.dateLabel} · {extracted.paper.locationOrEvent}
                </p>
              </div>
              <CheckCircle2 size={16} className="idp-file__ok" />
              <button type="button" className="idp-file__remove" onClick={reset} aria-label="Remove document">
                <X size={13} />
              </button>
            </div>
          ) : (
            <PaperFacsimile
              paper={extracted.paper}
              fileName={extracted.fileName}
              liveFields={new Set()}
              doneFields={completeFields}
            />
          )}
          <div className="idp-result__bar">
            <p className="idp-result__kicker">Carried into the research brief</p>
            {!compact && (
              <button type="button" className="idp-file__remove" onClick={reset} aria-label="Remove document">
                <X size={13} />
              </button>
            )}
          </div>
          <ul className="idp-insights">
            {extracted.paper.openItems.map((item) => (
              <li key={item}>
                <span>Open</span>
                {item}
              </li>
            ))}
            {extracted.paper.commitments.slice(0, compact ? 1 : 2).map((item) => (
              <li key={item}>
                <span>Held</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="idp-result__foot">
            <FileText size={12} />
            Internal source · Compose paper will cite this engagement
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
}: {
  paper: PriorMeetingPaper
  fileName: string
  liveFields: Set<string>
  doneFields: Set<string>
}) {
  const mark = (id: string) => (liveFields.has(id) ? "is-live" : doneFields.has(id) ? "is-done" : "")

  return (
    <article className="idp-sheet" aria-hidden>
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
            <dt>Location</dt>
            <dd>{paper.locationOrEvent}</dd>
          </div>
          <div className={mark("contact")}>
            <dt>Contact</dt>
            <dd>{paper.contact.name}</dd>
          </div>
          <div className={mark("counterpart")}>
            <dt>Customer</dt>
            <dd>
              {paper.customer.name}
              <em>
                “{paper.customer.salutation}” · {paper.customer.title}
              </em>
            </dd>
          </div>
        </dl>
        <p className="idp-sheet__h">Objectives</p>
        <ol>
          {paper.objectives.slice(0, 3).map((o, i) => (
            <li key={o} className={mark(`obj-${i}`)}>
              <b>{i + 1}.</b> {o}
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
