import { useState, useEffect, useCallback, useRef } from "react"
import Webcam from "react-webcam"
import type { Person } from "../data/people"
import type { Company } from "../data/companies"
import type { ResearchResult } from "../types/research"
import type { FrameworksData } from "../types/frameworks"
import { generateBriefing } from "../utils/briefingGenerator"
import { Search, TrendingUp, Presentation, ShieldCheck, MessageCircle, BarChart3, Globe2, X, Mic, MicOff, Video, VideoOff, PhoneOff, MoreVertical } from "lucide-react"
import { HelperLogo } from "../components/HelperLogo"

interface MeetingSimulationProps {
  person: Person
  company: Company
  research: ResearchResult
  meetingType: string
  internalNotes?: string
  frameworksData?: FrameworksData | null
  onMeetingEnd: (transcript: string, durationSeconds: number) => void
}

const BLUE = "#0033A1"
const NAVY = "#0A2240"
const ICE = "#E3EFFA"
const BORDER = "#E9EBED"
const MUTED = "#F3F4F5"
const TEXT = "#253746"
const TEXT_SECONDARY = "#515F6B"
const TEXT_MUTED = "#66737E"
const STAGE = "#0A2240"

// --- Overlay card types ---

interface OverlayCardData {
  id: string
  type: "company" | "rapport" | "prep" | "lookup" | "frameworks" | "country"
  title: string
  content: React.ReactNode
}

function CardHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] font-semibold uppercase" style={{ color: BLUE, letterSpacing: "0.12em" }}>{eyebrow}</span>
      <span className="text-sm font-semibold truncate" style={{ color: NAVY }}>{title}</span>
    </div>
  )
}

function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase font-semibold" style={{ color: TEXT_MUTED, letterSpacing: "0.1em" }}>{children}</p>
  )
}

function CompanySnapshotCard({ research, company }: { research: ResearchResult; company: Company }) {
  return (
    <div className="space-y-3">
      <CardHeading eyebrow="Organisation" title={company.name} />
      <p className="text-xs leading-relaxed line-clamp-6" style={{ color: TEXT_SECONDARY }}>
        {research.company.overview || `${company.name} is a major industry player.`}
      </p>
      {research.company.key_metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {research.company.key_metrics.slice(0, 3).map((m, i) => (
            <div key={i} className="rounded-sm p-2 text-center" style={{ background: MUTED, borderTop: `2px solid ${BLUE}` }}>
              <p className="font-bold text-[11px] leading-tight" style={{ color: NAVY }}>{m.value}</p>
              <p className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>{m.label}</p>
            </div>
          ))}
        </div>
      )}
      {research.company.recent_news.length > 0 && (
        <div className="space-y-1.5">
          <MicroLabel>Recent Developments</MicroLabel>
          {research.company.recent_news.slice(0, 2).map((n, i) => (
            <p key={i} className="text-xs leading-snug" style={{ color: TEXT_SECONDARY }}>
              {n.headline}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function buildRapportStarters(research: ResearchResult, person: Person): string[] {
  const starters: string[] = []
  const { linkedin_posts, profile_overview } = research.person

  // From public remarks — extract conversational hooks
  for (const post of linkedin_posts.slice(0, 3)) {
    const text = post.text.toLowerCase()
    if (text.includes("hackathon") || text.includes("event") || text.includes("hosted")) {
      starters.push(`Ask about their recent event: "${post.text.split(".")[0].split("—")[0].trim()}"`)
    } else if (text.includes("announce") || text.includes("launch") || text.includes("ship")) {
      starters.push(`Congratulate on: "${post.text.split(".")[0].split("—")[0].trim()}"`)
    } else if (text.includes("insight") || text.includes("takeaway") || text.includes("learn")) {
      starters.push(`Reference their thinking on: "${post.text.split(".")[0].split("—")[0].trim()}"`)
    } else {
      starters.push(`They recently said: "${post.text.length > 80 ? post.text.slice(0, 80) + "..." : post.text}"`)
    }
  }

  // From profile overview — strategic angle
  if (profile_overview) {
    const sentences = profile_overview.split(".")
    const strategic = sentences.find(s => s.toLowerCase().includes("strategic") || s.toLowerCase().includes("angle") || s.toLowerCase().includes("approach"))
    if (strategic) starters.push(strategic.trim() + ".")
  }

  // Fallback
  if (starters.length === 0) {
    starters.push(`Open with their role as ${person.title} — ask what's top of mind this quarter`)
  }

  return starters.slice(0, 4)
}

function NumberChip({ n }: { n: number }) {
  return (
    <span className="w-4 h-4 rounded-sm flex items-center justify-center shrink-0 text-[9px] font-bold mt-0.5" style={{ background: ICE, color: BLUE }}>
      {n}
    </span>
  )
}

function RapportCard({ research, person }: { research: ResearchResult; person: Person }) {
  const starters = buildRapportStarters(research, person)
  return (
    <div className="space-y-3">
      <CardHeading eyebrow="Rapport" title={person.name} />
      <MicroLabel>Conversation Starters</MicroLabel>
      <ul className="space-y-2">
        {starters.map((s, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: TEXT_SECONDARY }}>
            <NumberChip n={i + 1} />
            <span className="leading-relaxed">{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PrepCard({ research, meetingType }: { research: ResearchResult; meetingType: string }) {
  const briefing = generateBriefing(research, meetingType)
  return (
    <div className="space-y-3">
      <CardHeading eyebrow="Prep" title={`${meetingType} agenda`} />
      <ol className="space-y-1.5">
        {briefing.agenda.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-xs" style={{ color: TEXT_SECONDARY }}>
            <NumberChip n={i + 1} />
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
      {briefing.questions.length > 0 && (
        <div className="pt-1.5 space-y-1">
          <MicroLabel>Ask</MicroLabel>
          {briefing.questions.slice(0, 2).map((q, i) => (
            <p key={i} className="text-xs italic leading-relaxed" style={{ color: TEXT_SECONDARY }}>{q}</p>
          ))}
        </div>
      )}
    </div>
  )
}

function LookupCard({ research, company }: { research: ResearchResult; company: Company }) {
  const trends = research.industry.trends
  const metrics = research.company.key_metrics
  return (
    <div className="space-y-3">
      <CardHeading eyebrow="Lookup" title="Quick reference" />

      {metrics.length > 0 && (
        <div className="space-y-1">
          <MicroLabel>Key facts — {company.name}</MicroLabel>
          {metrics.slice(0, 4).map((m, i) => (
            <div key={i} className="flex justify-between gap-3 text-xs" style={{ color: TEXT_SECONDARY }}>
              <span>{m.label}</span>
              <span className="font-semibold text-right" style={{ color: NAVY }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}

      {research.industry.competitive_context && (
        <div className="space-y-1">
          <MicroLabel>Competitive landscape</MicroLabel>
          <p className="text-xs leading-relaxed line-clamp-6" style={{ color: TEXT_SECONDARY }}>
            {research.industry.competitive_context}
          </p>
        </div>
      )}

      {trends.length > 0 && (
        <div className="space-y-1">
          <MicroLabel>Sector trends</MicroLabel>
          <ul className="space-y-1">
            {trends.slice(0, 3).map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: BLUE }} />
                <span className="line-clamp-2">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function CountryCard({ country }: { country: ResearchResult["country"] }) {
  return (
    <div className="space-y-3">
      <CardHeading eyebrow="Country" title={country.name} />

      {country.priorities?.length > 0 && (
        <div className="space-y-1.5">
          <MicroLabel>National priorities</MicroLabel>
          <ul className="space-y-1.5">
            {country.priorities.slice(0, 3).map((p, i) => (
              <li key={i} className="flex items-start gap-2 text-xs" style={{ color: TEXT_SECONDARY }}>
                <NumberChip n={i + 1} />
                <span className="leading-relaxed line-clamp-3">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {country.concerns?.length > 0 && (
        <div className="space-y-1.5">
          <MicroLabel>Handle carefully</MicroLabel>
          {country.concerns.slice(0, 3).map((c, i) => (
            <p key={i} className="text-xs leading-relaxed line-clamp-3 pl-2" style={{ color: TEXT_SECONDARY, borderLeft: `2px solid ${BORDER}` }}>{c}</p>
          ))}
        </div>
      )}

      {country.bilateral_context && (
        <div className="rounded-sm p-2.5" style={{ background: ICE }}>
          <MicroLabel>Bilateral context</MicroLabel>
          <p className="text-xs leading-relaxed mt-1 line-clamp-5" style={{ color: TEXT }}>{country.bilateral_context}</p>
        </div>
      )}
    </div>
  )
}

// --- Copilot chat card ---

function CopilotCard({
  messages,
  input,
  streaming,
  onInputChange,
  onSend,
  inputRef,
  endRef,
}: {
  messages: { role: "user" | "assistant"; content: string }[]
  input: string
  streaming: boolean
  onInputChange: (v: string) => void
  onSend: (msg: string) => void
  inputRef: React.RefObject<HTMLInputElement>
  endRef: React.RefObject<HTMLDivElement>
}) {
  return (
    <div className="flex flex-col" style={{ height: "400px" }}>
      <div className="mb-2">
        <CardHeading eyebrow="Copilot" title="Boeing Helper assistant" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 pr-1" style={{ scrollbarWidth: "thin" }}>
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs" style={{ color: TEXT_MUTED }}>Ask anything about this meeting.</p>
            <div className="flex flex-wrap gap-1.5 justify-center mt-3">
              {["What should I ask?", "Key talking points", "Their priorities"].map((q) => (
                <button
                  key={q}
                  onClick={() => onSend(q)}
                  className="text-[10px] px-2.5 py-1 rounded-pill cursor-pointer transition-colors"
                  style={{ background: MUTED, color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="text-xs leading-relaxed px-3 py-2 rounded max-w-[90%]"
              style={
                msg.role === "user"
                  ? { background: BLUE, color: "white" }
                  : { background: MUTED, color: TEXT_SECONDARY }
              }
            >
              {msg.content || (streaming && i === messages.length - 1 ? (
                <span className="dot-pulse inline-flex gap-1"><span /><span /><span /></span>
              ) : null)}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); onSend(input) } }}
          placeholder="Ask your copilot..."
          disabled={streaming}
          className="flex-1 px-3 py-2 rounded text-xs outline-none"
          style={{ background: "#fff", border: `1px solid ${BORDER}`, color: TEXT }}
          onFocus={(e) => e.currentTarget.style.borderColor = BLUE}
          onBlur={(e) => e.currentTarget.style.borderColor = BORDER}
        />
        <button
          onClick={() => onSend(input)}
          disabled={streaming || !input.trim()}
          className="px-3 py-2 rounded text-xs font-medium cursor-pointer"
          style={{ background: BLUE, color: "white", opacity: streaming || !input.trim() ? 0.5 : 1 }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

// --- Frameworks overlay card ---

const frameworksLevelColors: Record<string, string> = { High: "#C62828", Medium: "#B26A00", Low: "#2E7D32" }
const swotAccents: Record<string, string> = { strengths: "#2E7D32", weaknesses: "#C62828", opportunities: BLUE, threats: "#B26A00" }

function FrameworksCard({ data }: { data: FrameworksData }) {
  const [tab, setTab] = useState<"swot" | "porters">("swot")

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <CardHeading eyebrow="Strategy" title="Frameworks" />
        <div className="flex rounded-sm overflow-hidden shrink-0" style={{ border: `1px solid ${BORDER}` }}>
          <button
            onClick={() => setTab("swot")}
            className="px-2.5 py-1 text-[10px] font-semibold transition-colors cursor-pointer"
            style={tab === "swot" ? { background: BLUE, color: "white" } : { color: TEXT_MUTED, background: "#fff" }}
          >
            SWOT
          </button>
          <button
            onClick={() => setTab("porters")}
            className="px-2.5 py-1 text-[10px] font-semibold transition-colors cursor-pointer"
            style={tab === "porters" ? { background: BLUE, color: "white" } : { color: TEXT_MUTED, background: "#fff" }}
          >
            Porter's
          </button>
        </div>
      </div>

      {tab === "swot" && (
        <div className="grid grid-cols-2 gap-1.5">
          {(["strengths", "weaknesses", "opportunities", "threats"] as const).map((key) => (
            <div key={key} className="rounded-sm p-2" style={{ background: MUTED, borderLeft: `2px solid ${swotAccents[key]}` }}>
              <p className="text-[9px] font-bold uppercase" style={{ color: swotAccents[key], letterSpacing: "0.08em" }}>{key}</p>
              {data.swot[key].map((item, i) => (
                <p key={i} className="text-[10px] leading-snug mt-0.5" style={{ color: TEXT_SECONDARY }}>
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "porters" && (
        <div className="space-y-1.5">
          {([
            ["Competitive Rivalry", data.porters.competitiveRivalry],
            ["New Entrants", data.porters.threatOfNewEntrants],
            ["Buyer Power", data.porters.bargainingPowerBuyers],
            ["Supplier Power", data.porters.bargainingPowerSuppliers],
            ["Substitutes", data.porters.threatOfSubstitutes],
          ] as [string, { level: string; factors: string[] }][]).map(([name, force]) => {
            const accent = frameworksLevelColors[force.level] || BLUE
            return (
              <div key={name} className="rounded-sm p-2" style={{ background: MUTED, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold" style={{ color: NAVY }}>{name}</span>
                  <span className="font-bold px-1.5 py-0.5 rounded-pill text-[9px]" style={{ background: "#fff", color: accent, border: `1px solid ${accent}` }}>
                    {force.level}
                  </span>
                </div>
                {force.factors.map((f, i) => (
                  <p key={i} className="text-[10px] leading-snug mt-0.5" style={{ color: TEXT_SECONDARY }}>{f}</p>
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// --- Keybind hint bar ---

const keybinds = [
  { key: "1", label: "Company", icon: Search, type: "company" as const },
  { key: "2", label: "Rapport", icon: TrendingUp, type: "rapport" as const },
  { key: "3", label: "Prep", icon: Presentation, type: "prep" as const },
  { key: "4", label: "Lookup", icon: ShieldCheck, type: "lookup" as const },
  { key: "5", label: "Copilot", icon: MessageCircle, type: "copilot" as const },
  { key: "6", label: "Strategy", icon: BarChart3, type: "frameworks" as const },
  { key: "7", label: "Country", icon: Globe2, type: "country" as const },
]

// --- Research sidebar ---

function SidebarLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] uppercase font-semibold" style={{ color: BLUE, letterSpacing: "0.12em" }}>{children}</p>
  )
}

function ResearchSidebar({ research, person, company, meetingType, internalNotes }: { research: ResearchResult; person: Person; company: Company; meetingType: string; internalNotes?: string }) {
  const briefing = generateBriefing(research, meetingType)
  const country = research.country

  return (
    <div className="h-full overflow-y-auto p-4 space-y-6" style={{ scrollbarWidth: "thin" }}>
      <div className="pb-3 border-b" style={{ borderColor: BORDER }}>
        <HelperLogo height={18} />
        <p className="mt-1.5 text-sm font-semibold" style={{ color: NAVY }}>Research brief</p>
      </div>

      {/* Person */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {person.photoUrl ? (
            <img src={person.photoUrl} alt={person.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: BLUE }}>
              {person.initial}
            </div>
          )}
          <div>
            <p className="font-semibold text-sm" style={{ color: NAVY }}>{person.name}</p>
            <p className="text-xs" style={{ color: TEXT_MUTED }}>{person.title} · {company.name}</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>{research.person.background}</p>
      </div>

      {/* Meeting Briefing */}
      <div className="space-y-2">
        <SidebarLabel>Agenda — {meetingType}</SidebarLabel>
        <ol className="space-y-1.5">
          {briefing.agenda.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>
              <NumberChip n={i + 1} />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {briefing.questions.length > 0 && (
        <div className="space-y-2">
          <SidebarLabel>Questions to ask</SidebarLabel>
          {briefing.questions.map((q, i) => (
            <p key={i} className="text-xs italic leading-relaxed" style={{ color: TEXT_SECONDARY }}>{q}</p>
          ))}
        </div>
      )}

      {/* Company */}
      <div className="space-y-2">
        <SidebarLabel>Organisation overview</SidebarLabel>
        <p className="text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>{research.company.overview}</p>
      </div>

      {/* Metrics */}
      {research.company.key_metrics.length > 0 && (
        <div className="space-y-2">
          <SidebarLabel>Key metrics</SidebarLabel>
          <div className="grid grid-cols-2 gap-2">
            {research.company.key_metrics.map((m, i) => (
              <div key={i} className="rounded-sm p-2.5" style={{ background: MUTED, borderTop: `2px solid ${BLUE}` }}>
                <p className="font-bold text-xs leading-tight" style={{ color: NAVY }}>{m.value}</p>
                <p className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Country context */}
      {country && (
        <div className="space-y-2">
          <SidebarLabel>Country context — {country.name}</SidebarLabel>
          {country.overview && (
            <p className="text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>{country.overview}</p>
          )}
          {country.priorities?.length > 0 && (
            <ol className="space-y-1.5 pt-1">
              {country.priorities.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                  <NumberChip n={i + 1} />
                  <span>{p}</span>
                </li>
              ))}
            </ol>
          )}
          {country.bilateral_context && (
            <div className="rounded-sm p-3 mt-1" style={{ background: ICE }}>
              <MicroLabel>Bilateral context</MicroLabel>
              <p className="text-xs leading-relaxed mt-1" style={{ color: TEXT }}>{country.bilateral_context}</p>
            </div>
          )}
          {country.concerns?.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <MicroLabel>Handle carefully</MicroLabel>
              {country.concerns.map((c, i) => (
                <p key={i} className="text-xs leading-relaxed pl-2" style={{ color: TEXT_SECONDARY, borderLeft: `2px solid ${BORDER}` }}>{c}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* News */}
      {research.company.recent_news.length > 0 && (
        <div className="space-y-2">
          <SidebarLabel>Recent developments</SidebarLabel>
          {research.company.recent_news.map((n, i) => (
            <div key={i} className="rounded-sm border p-3" style={{ borderColor: BORDER }}>
              <p className="text-xs font-medium leading-snug" style={{ color: NAVY }}>{n.headline}</p>
              <p className="text-[10px] mt-1" style={{ color: TEXT_MUTED }}>{n.source} · {n.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Industry */}
      {research.industry.trends.length > 0 && (
        <div className="space-y-2">
          <SidebarLabel>Sector trends</SidebarLabel>
          <ul className="space-y-1.5">
            {research.industry.trends.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: TEXT_SECONDARY }}>
                <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: BLUE }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Public remarks */}
      {research.person.linkedin_posts.length > 0 && (
        <div className="space-y-2">
          <SidebarLabel>Recent remarks</SidebarLabel>
          {research.person.linkedin_posts.map((p, i) => (
            <div key={i} className="text-xs pl-3 py-1" style={{ borderLeft: `2px solid ${BLUE}`, color: TEXT_SECONDARY }}>
              <p className="leading-relaxed">{p.text.length > 150 ? p.text.slice(0, 150) + "..." : p.text}</p>
              <p className="mt-1" style={{ color: TEXT_MUTED }}>{p.date}</p>
            </div>
          ))}
        </div>
      )}

      {/* Internal Notes */}
      {internalNotes && (
        <div className="space-y-2">
          <SidebarLabel>Your notes</SidebarLabel>
          <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: TEXT_SECONDARY }}>{internalNotes}</p>
        </div>
      )}

      <p className="text-[10px] pt-2 border-t" style={{ color: TEXT_MUTED, borderColor: BORDER }}>
        Confidential — Boeing Helper · Internal Use
      </p>
    </div>
  )
}

// --- Main component ---

export function MeetingSimulation({ person, company, research, meetingType, internalNotes, frameworksData, onMeetingEnd }: MeetingSimulationProps) {
  const [cameraError, setCameraError] = useState(false)
  const [overlayCards, setOverlayCards] = useState<OverlayCardData[]>([])
  const [micOn, setMicOn] = useState(true)
  const [videoOn, setVideoOn] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [lastKeyHint, setLastKeyHint] = useState<string | null>(null)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotMessages, setCopilotMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [copilotInput, setCopilotInput] = useState("")
  const [copilotStreaming, setCopilotStreaming] = useState(false)
  const copilotInputRef = useRef<HTMLInputElement>(null)
  const copilotEndRef = useRef<HTMLDivElement>(null)

  // Speech recognition
  const transcriptRef = useRef<string>("")
  const [subtitle, setSubtitle] = useState("")
  const [isInterim, setIsInterim] = useState(false)
  const subtitleTimer = useRef<number | null>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const errorCountRef = useRef(0)
  const stoppedRef = useRef(false)

  // Meeting duration (ref to avoid re-renders every second)
  const durationRef = useRef(0)

  const sendCopilotMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || copilotStreaming) return

    const newMessages = [...copilotMessages, { role: "user" as const, content: userMessage }]
    setCopilotMessages(newMessages)
    setCopilotInput("")
    setCopilotStreaming(true)

    try {
      const res = await fetch("/api/copilot-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          context: {
            personName: person.name,
            personTitle: person.title,
            companyName: company.name,
            meetingType,
            companyOverview: research.company.overview || "",
            keyMetrics: research.company.key_metrics.map(m => `${m.label}: ${m.value}`),
            recentNews: research.company.recent_news.map(n => n.headline),
            industryTrends: research.industry.trends,
            competitiveContext: research.industry.competitive_context || "",
            personBackground: research.person.background || "",
            profileOverview: research.person.profile_overview || "",
            linkedinPosts: research.person.linkedin_posts.map(p => p.text),
            internalNotes: internalNotes || "",
          },
        }),
      })

      if (!res.ok || !res.body) throw new Error("Failed")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let assistantContent = ""

      // Add empty assistant message to stream into
      setCopilotMessages(prev => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === "delta") {
              assistantContent += event.content
              setCopilotMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: "assistant", content: assistantContent }
                return updated
              })
            } else if (event.type === "error") {
              assistantContent = event.content
              setCopilotMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: "assistant", content: assistantContent }
                return updated
              })
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setCopilotMessages(prev => [...prev, { role: "assistant", content: "Connection error. Try again." }])
    } finally {
      setCopilotStreaming(false)
    }
  }, [copilotMessages, copilotStreaming, person, company, research, meetingType, internalNotes])

  // Auto-scroll copilot messages
  useEffect(() => {
    copilotEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [copilotMessages])

  // Focus copilot input when opened — deferred so the keystroke that opened it
  // is not typed into the field
  useEffect(() => {
    if (!copilotOpen) return
    const frame = requestAnimationFrame(() => copilotInputRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [copilotOpen])

  // Track meeting duration (ref-based to avoid re-renders)
  useEffect(() => {
    const interval = setInterval(() => { durationRef.current += 1 }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Speech recognition lifecycle
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return

    const recognition = new SpeechRecognitionAPI() as SpeechRecognition
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"
    recognitionRef.current = recognition

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      errorCountRef.current = 0
      let interim = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          transcriptRef.current += result[0].transcript + " "
          setSubtitle(result[0].transcript)
          setIsInterim(false)
          if (subtitleTimer.current) clearTimeout(subtitleTimer.current)
          subtitleTimer.current = window.setTimeout(() => setSubtitle(""), 3000)
        } else {
          interim += result[0].transcript
        }
      }
      if (interim) {
        setSubtitle(interim)
        setIsInterim(true)
        if (subtitleTimer.current) clearTimeout(subtitleTimer.current)
      }
    }

    recognition.onerror = () => {
      errorCountRef.current++
      if (errorCountRef.current >= 3) {
        console.warn("[speech] too many errors, stopping")
      }
    }

    recognition.onend = () => {
      if (!stoppedRef.current && errorCountRef.current < 3) {
        try { recognition.start() } catch { /* already started */ }
      }
    }

    try { recognition.start() } catch { /* ignore */ }

    return () => {
      stoppedRef.current = true
      recognition.abort()
      if (subtitleTimer.current) clearTimeout(subtitleTimer.current)
    }
  }, [])

  // Sync micOn with speech recognition
  useEffect(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    if (micOn) {
      stoppedRef.current = false
      errorCountRef.current = 0
      try { recognition.start() } catch { /* already running */ }
    } else {
      stoppedRef.current = true
      recognition.stop()
      if (subtitleTimer.current) clearTimeout(subtitleTimer.current)
      subtitleTimer.current = window.setTimeout(() => setSubtitle(""), 2000)
    }
  }, [micOn])

  const addOverlayCard = useCallback((type: OverlayCardData["type"]) => {
    // Toggle: if same type is already showing, dismiss it
    if (overlayCards.length > 0 && overlayCards[0].type === type) {
      setOverlayCards([])
      return
    }

    const id = `${type}-${Date.now()}`
    let title = ""
    let content: React.ReactNode = null

    switch (type) {
      case "company":
        title = "Company Snapshot"
        content = <CompanySnapshotCard research={research} company={company} />
        break
      case "rapport":
        title = "Rapport Builder"
        content = <RapportCard research={research} person={person} />
        break
      case "prep":
        title = "Prep"
        content = <PrepCard research={research} meetingType={meetingType} />
        break
      case "lookup":
        title = "Quick Lookup"
        content = <LookupCard research={research} company={company} />
        break
      case "country":
        if (!research.country) return
        title = "Country Context"
        content = <CountryCard country={research.country} />
        break
      case "frameworks":
        if (!frameworksData) return
        title = "Strategic Frameworks"
        content = <FrameworksCard data={frameworksData} />
        break
    }

    // Replace — only one card at a time. Pressing a new key swaps it.
    setOverlayCards([{ id, type, title, content }])

    // Auto-dismiss after 20s
    setTimeout(() => {
      setOverlayCards((prev) => prev.filter((c) => c.id !== id))
    }, 20000)
  }, [research, company, person, overlayCards, frameworksData, meetingType])

  const dismissCard = useCallback((id: string) => {
    setOverlayCards((prev) => prev.filter((c) => c.id !== id))
  }, [])

  // Keyboard listeners
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key

      // While typing, only Escape is honoured — and it steps out of the copilot
      // rather than ending the meeting
      const typing = document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA"
      if (typing) {
        if (key === "Escape") {
          (document.activeElement as HTMLElement).blur()
          setCopilotOpen(false)
        }
        return
      }

      if (key === "1") { setCopilotOpen(false); addOverlayCard("company"); setLastKeyHint("1") }
      else if (key === "2") { setCopilotOpen(false); addOverlayCard("rapport"); setLastKeyHint("2") }
      else if (key === "3") { setCopilotOpen(false); addOverlayCard("prep"); setLastKeyHint("3") }
      else if (key === "4") { setCopilotOpen(false); addOverlayCard("lookup"); setLastKeyHint("4") }
      else if (key === "5") { setOverlayCards([]); setCopilotOpen(prev => !prev); setLastKeyHint("5") }
      else if (key === "6") { setCopilotOpen(false); addOverlayCard("frameworks"); setLastKeyHint("6") }
      else if (key === "7") { setCopilotOpen(false); addOverlayCard("country"); setLastKeyHint("7") }
      else if (key === "Escape") { onMeetingEnd(transcriptRef.current, durationRef.current) }

      if (["1", "2", "3", "4", "5", "6", "7"].includes(key)) {
        setTimeout(() => setLastKeyHint(null), 1500)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [addOverlayCard, onMeetingEnd])

  const overlayPanelStyle: React.CSSProperties = {
    background: "#fff",
    border: `1px solid ${BORDER}`,
    borderTop: `3px solid ${BLUE}`,
    borderRadius: "8px",
    boxShadow: "0 12px 32px rgba(10, 34, 64, 0.28)",
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: "#fff" }}>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 shrink-0" style={{ background: "#fff", borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <HelperLogo height={20} />
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-pill text-[10px] font-semibold uppercase shrink-0" style={{ background: "rgba(198,40,40,0.08)", color: "#C62828", letterSpacing: "0.1em" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C62828" }} />
            Live
          </span>
          <span className="text-xs truncate" style={{ color: TEXT_MUTED }}>{person.name} · {company.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Keybind hints */}
          {keybinds.map((kb) => (
            <button
              key={kb.key}
              onClick={() => {
                if (kb.type === "copilot") { setOverlayCards([]); setCopilotOpen(prev => !prev) }
                else { setCopilotOpen(false); addOverlayCard(kb.type as OverlayCardData["type"]) }
                setLastKeyHint(kb.key)
                setTimeout(() => setLastKeyHint(null), 1500)
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-pill text-xs transition-colors cursor-pointer"
              style={lastKeyHint === kb.key
                ? { background: BLUE, color: "#fff", border: `1px solid ${BLUE}` }
                : { background: MUTED, color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}
            >
              <kb.icon size={12} />
              <span className="font-mono font-bold">{kb.key}</span>
              <span className="hidden xl:inline">{kb.label}</span>
            </button>
          ))}
          <div className="w-px h-5 mx-1" style={{ background: BORDER }} />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="px-3 py-1.5 rounded-pill text-xs font-medium cursor-pointer"
            style={sidebarOpen
              ? { background: ICE, color: BLUE, border: `1px solid ${BLUE}` }
              : { background: MUTED, color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}
          >
            Research
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden" style={{ background: MUTED }}>
        {/* Video area */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          {/* Counterpart video */}
          <div className="w-full max-w-4xl aspect-video rounded overflow-hidden relative" style={{ background: STAGE }}>
            {person.videoId ? (
              <>
                <iframe
                  src={`https://www.youtube.com/embed/${person.videoId}?start=${person.videoStart || 0}&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: "none" }}
                  allow="autoplay"
                  frameBorder="0"
                />
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded-sm text-xs text-white z-10" style={{ background: "rgba(10,34,64,0.75)" }}>
                  {person.name}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                {person.photoUrl ? (
                  <img src={person.photoUrl} alt={person.name} className="w-24 h-24 rounded-full object-cover" onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                    target.nextElementSibling?.classList.remove("hidden")
                  }} />
                ) : null}
                <div className={`w-24 h-24 rounded-full items-center justify-center text-white font-bold text-3xl ${person.photoUrl ? "hidden" : "flex"}`} style={{ background: BLUE }}>
                  {person.initial}
                </div>
                <p className="text-white font-semibold">{person.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.65)" }}>{person.title} · {company.name}</p>
              </div>
            )}

            {/* Overlay cards — positioned on the video */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-3 top-3 bottom-3 w-72 flex flex-col gap-2 overflow-y-auto pointer-events-auto" style={{ scrollbarWidth: "none" }}>
                {overlayCards.map((card) => (
                  <div
                    key={card.id}
                    className="relative p-3"
                    style={{ ...overlayPanelStyle, animation: "slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  >
                    <button
                      onClick={() => dismissCard(card.id)}
                      className="absolute top-2 right-2 cursor-pointer"
                      style={{ color: TEXT_MUTED }}
                    >
                      <X size={12} />
                    </button>
                    {card.content}
                  </div>
                ))}
                {copilotOpen && (
                  <div
                    className="relative p-3"
                    style={{ ...overlayPanelStyle, animation: "slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  >
                    <button
                      onClick={() => setCopilotOpen(false)}
                      className="absolute top-2 right-2 cursor-pointer z-10"
                      style={{ color: TEXT_MUTED }}
                    >
                      <X size={12} />
                    </button>
                    <CopilotCard
                      messages={copilotMessages}
                      input={copilotInput}
                      streaming={copilotStreaming}
                      onInputChange={setCopilotInput}
                      onSend={sendCopilotMessage}
                      inputRef={copilotInputRef}
                      endRef={copilotEndRef}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Live transcription subtitle */}
            {subtitle && (
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[80%] px-4 py-2 rounded-sm text-sm text-white text-center line-clamp-2 pointer-events-none z-10"
                style={{
                  background: "rgba(10, 34, 64, 0.82)",
                  opacity: isInterim ? 0.7 : 1,
                  transition: "opacity 0.15s ease",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* Your webcam — bottom right picture-in-picture */}
          <div className="absolute bottom-6 right-6 w-48 aspect-video rounded overflow-hidden shadow-xl z-20" style={{ border: `2px solid #fff`, background: STAGE }}>
            {cameraError || !videoOn ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: BLUE }}>
                  You
                </div>
              </div>
            ) : (
              <Webcam
                audio={false}
                mirrored={true}
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user", width: 320, height: 180 }}
                onUserMediaError={() => setCameraError(true)}
              />
            )}
          </div>
        </div>

        {/* Research sidebar */}
        {sidebarOpen && (
          <div className="w-80 shrink-0" style={{ borderLeft: `1px solid ${BORDER}`, background: "#fff" }}>
            <ResearchSidebar research={research} person={person} company={company} meetingType={meetingType} internalNotes={internalNotes} />
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="relative flex items-center justify-center gap-3 py-3 shrink-0" style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={() => setMicOn(!micOn)}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={micOn ? { background: MUTED, color: TEXT_SECONDARY, border: `1px solid ${BORDER}` } : { background: "#C62828", color: "white" }}
        >
          {micOn ? <Mic size={18} /> : <MicOff size={18} />}
        </button>
        <button
          onClick={() => setVideoOn(!videoOn)}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-colors"
          style={videoOn ? { background: MUTED, color: TEXT_SECONDARY, border: `1px solid ${BORDER}` } : { background: "#C62828", color: "white" }}
        >
          {videoOn ? <Video size={18} /> : <VideoOff size={18} />}
        </button>
        <button className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer" style={{ background: MUTED, color: TEXT_SECONDARY, border: `1px solid ${BORDER}` }}>
          <MoreVertical size={18} />
        </button>
        <button
          onClick={() => onMeetingEnd(transcriptRef.current, durationRef.current)}
          className="w-12 h-10 rounded-pill flex items-center justify-center cursor-pointer text-white transition-colors"
          style={{ background: "#C62828" }}
        >
          <PhoneOff size={18} />
        </button>
        <p className="hidden md:block absolute right-4 text-[10px]" style={{ color: TEXT_MUTED }}>
          Confidential — Boeing Helper · Internal Use · press Esc to end
        </p>
      </div>
    </div>
  )
}
