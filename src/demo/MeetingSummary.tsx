import { useState, useEffect, useRef } from "react"
import { CheckCircle2, Loader2, Download } from "lucide-react"
import type { Person } from "../data/people"
import type { Company } from "../data/companies"
import type { ResearchResult } from "../types/research"
import type { FrameworksData } from "../types/frameworks"
import type { MeetingSummaryData } from "../types/meetingSummary"

interface MeetingSummaryProps {
  person: Person
  company: Company
  research: ResearchResult
  meetingType: string
  transcript: string
  internalNotes?: string
  frameworksData?: FrameworksData | null
  meetingDuration: number
  onClose: () => void
}

const BLUE = "#0033A1"
const NAVY = "#0A2240"
const ICE = "#E3EFFA"
const GREEN = "#2E7D32"
const AMBER = "#B26A00"
const RED = "#C62828"
const TEAL = "#005896"

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

const sentimentColors: Record<string, { bg: string; text: string }> = {
  Excellent: { bg: "rgba(46,125,50,0.1)", text: GREEN },
  Positive: { bg: ICE, text: BLUE },
  Neutral: { bg: "rgba(178,106,0,0.1)", text: AMBER },
  "Needs Follow-up": { bg: "rgba(198,40,40,0.1)", text: RED },
}

const priorityColors: Record<string, { bg: string; text: string }> = {
  High: { bg: ICE, text: BLUE },
  Medium: { bg: "var(--bg-muted)", text: "var(--text-secondary)" },
  Low: { bg: "transparent", text: "var(--text-muted)" },
}

function Label({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p className="uppercase text-[10px] font-semibold" style={{ color, letterSpacing: "0.12em" }}>
      {children}
    </p>
  )
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? GREEN : score >= 60 ? BLUE : AMBER

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E9EBED"
        strokeWidth={6}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1.5s ease-out 0.5s" }}
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="text-2xl font-bold"
        fill={NAVY}
      >
        {score}
      </text>
    </svg>
  )
}

export function MeetingSummary({
  person,
  company,
  research,
  meetingType,
  transcript,
  internalNotes,
  frameworksData,
  meetingDuration,
  onClose,
}: MeetingSummaryProps) {
  const [data, setData] = useState<MeetingSummaryData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    setError(false)
    fetch("/api/meeting-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: transcript || "",
        companyName: company.name,
        personName: person.name,
        personTitle: person.title,
        meetingType,
        research,
        internalNotes,
        frameworksData,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed")
        return res.json()
      })
      .then((result) => {
        if (result?.error) throw new Error(result.error)
        setData(result)
      })
      .catch(() => {
        setError(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleExportPdf = async () => {
    if (!contentRef.current) return
    const html2pdf = (await import("html2pdf.js")).default
    html2pdf()
      .set({
        margin: 10,
        filename: `boeing-helper-summary-${company.name.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { format: "a4" },
      })
      .from(contentRef.current)
      .save()
  }

  const noTranscript = !transcript
  const sentiment = data ? sentimentColors[data.overallSentiment] : null

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-muted)" }}>
      <div ref={contentRef} className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        {/* 1. Header */}
        <div className="bh-panel overflow-hidden">
          <div style={{ height: "4px", background: BLUE }} />
          <div className="px-6 sm:px-8 py-8 text-center space-y-3">
            <div className="flex justify-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(46,125,50,0.1)",
                  animation: "fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                }}
              >
                <CheckCircle2 size={30} color={GREEN} />
              </div>
            </div>
            <p className="system-badge system-badge--dark">Boeing Helper &middot; Post-meeting record</p>
            <h2 className="text-3xl font-bold" style={{ color: NAVY, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
              Meeting Complete
            </h2>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              {meetingType} with {person.name}, {person.title}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {company.name}
              {research.country?.name ? ` \u00b7 ${research.country.name}` : ""} &middot; {formatDuration(meetingDuration)}
            </p>
          </div>
        </div>

        {/* 2. Loading state */}
        {loading && (
          <div className="flex items-center justify-center gap-2">
            <Loader2 size={16} className="animate-spin" style={{ color: BLUE }} />
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Analysing the conversation...
            </p>
          </div>
        )}

        {/* 2b. Error state */}
        {error && !data && (
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Unable to analyse this meeting. Summary unavailable.
          </p>
        )}

        {/* 3. Note when mic transcript was empty — summary still generated from briefing context */}
        {noTranscript && !loading && data && (
          <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
            No live microphone transcript — summary generated from briefing context and meeting metadata.
          </p>
        )}

        {/* 4. Score section */}
        {data && (
          <div
            className="bh-card px-6 py-7 flex flex-col items-center gap-3 opacity-0"
            style={{
              animation: "fadeInUp 0.6s ease-out forwards",
              animationDelay: "200ms",
            }}
          >
            <Label color="var(--text-muted)">Engagement score</Label>
            <ScoreRing score={data.meetingScore} />
            {sentiment && (
              <span
                className="text-xs font-semibold px-3 py-1 rounded-pill"
                style={{ background: sentiment.bg, color: sentiment.text }}
              >
                {data.overallSentiment}
              </span>
            )}
          </div>
        )}

        {/* 5. Four-column grid */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Highlights */}
            <div
              className="bh-card p-4 space-y-2 opacity-0"
              style={{
                borderTop: `3px solid ${GREEN}`,
                animation: "fadeInUp 0.6s ease-out forwards",
                animationDelay: "400ms",
              }}
            >
              <Label color={GREEN}>Highlights</Label>
              {data.highlights.map((h, i) => (
                <p key={i} className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  &bull; {h}
                </p>
              ))}
            </div>

            {/* Counterpart Signals */}
            <div
              className="bh-card p-4 space-y-2 opacity-0"
              style={{
                borderTop: `3px solid ${BLUE}`,
                animation: "fadeInUp 0.6s ease-out forwards",
                animationDelay: "600ms",
              }}
            >
              <Label color={BLUE}>Counterpart signals</Label>
              {data.clientSignals.map((cs, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold" style={{ color: NAVY }}>{cs.signal}</p>
                  <p className="text-[10px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {cs.interpretation}
                  </p>
                </div>
              ))}
            </div>

            {/* Action Items */}
            <div
              className="bh-card p-4 space-y-2 opacity-0"
              style={{
                borderTop: `3px solid ${AMBER}`,
                animation: "fadeInUp 0.6s ease-out forwards",
                animationDelay: "800ms",
              }}
            >
              <Label color={AMBER}>Action items</Label>
              {data.actionItems.map((ai, i) => {
                const pc = priorityColors[ai.priority]
                return (
                  <div key={i} className="flex items-start gap-2">
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-pill font-bold shrink-0 mt-0.5"
                      style={{ background: pc.bg, color: pc.text }}
                    >
                      {ai.priority}
                    </span>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {ai.item}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Campaign Intelligence */}
            <div
              className="bh-card p-4 space-y-2 opacity-0"
              style={{
                borderTop: `3px solid ${TEAL}`,
                animation: "fadeInUp 0.6s ease-out forwards",
                animationDelay: "1000ms",
              }}
            >
              <Label color={TEAL}>Campaign intelligence</Label>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "var(--text-muted)" }}>
                  Opportunity
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {data.dealIntelligence.opportunityAlignment}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "var(--text-muted)" }}>
                  Competitive angle
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {data.dealIntelligence.competitiveAngle}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase" style={{ color: "var(--text-muted)" }}>
                  Urgency
                </p>
                {data.dealIntelligence.urgencyIndicators.map((u, i) => (
                  <p key={i} className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    &bull; {u}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Next Steps */}
        {data && data.nextSteps.length > 0 && (
          <div
            className="bh-card p-6 opacity-0"
            style={{
              animation: "fadeInUp 0.6s ease-out forwards",
              animationDelay: "1200ms",
            }}
          >
            <div className="mb-4">
              <Label color={BLUE}>Next steps</Label>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {data.nextSteps.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span
                    className="w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                    style={{ background: ICE, color: BLUE }}
                  >
                    {i + 1}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. Relationship Notes */}
        {data && data.relationshipNotes && (
          <div
            className="bh-card p-6 opacity-0"
            style={{
              animation: "fadeInUp 0.6s ease-out forwards",
              animationDelay: "1400ms",
            }}
          >
            <div className="mb-3">
              <Label color="var(--text-muted)">Relationship notes</Label>
            </div>
            <p className="text-sm leading-relaxed italic" style={{ color: "var(--text-secondary)" }}>
              {data.relationshipNotes}
            </p>
          </div>
        )}

        {/* 8. Action buttons */}
        <div
          className="flex flex-wrap justify-center gap-4 opacity-0"
          style={{
            animation: "fadeInUp 0.6s ease-out forwards",
            animationDelay: "1600ms",
          }}
        >
          <button onClick={onClose} className="btn-secondary">
            Close
          </button>
          {data && (
            <button onClick={handleExportPdf} className="btn-primary">
              <Download size={16} />
              Export PDF
            </button>
          )}
        </div>

        <p className="text-center text-[11px] pt-2" style={{ color: "var(--text-muted)" }}>
          Confidential — Boeing Helper &middot; Internal Use
        </p>
      </div>
    </div>
  )
}
