import { useState, useEffect, useRef, useCallback } from "react"
import { Building2, Globe, MapPin, ChevronDown, ChevronRight, CheckCircle2, AlertCircle, Loader2, Info, LayoutList, ListTree } from "lucide-react"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import type { ExtractedInternalDocument } from "../types/internalDocument"
import { getHardcodedResearch } from "../data/research"
import { Button } from "../components/Button"
import { ResearchAuditWorkspace } from "./researchAudit"
import { InternalDocumentsPanel } from "./InternalDocumentsPanel"
import { mergePriorEngagement, PRIOR_SOURCE_ID } from "../utils/internalDocumentExtract"

interface AgentResearchProps {
  company: Company
  person: Person
  meetingType: string
  prefetchedResult?: ResearchResult | null
  prefetchInProgress?: boolean
  /** Already-finished research — skip the live trace; the brief is available from the toggle. */
  completedResult?: ResearchResult | null
  initialNotes?: string
  onReady?: (result: ResearchResult, internalNotes: string) => void
  onComplete: (result: ResearchResult, internalNotes: string) => void
}

type SpanStatus = "pending" | "running" | "complete"

interface TraceSpan {
  id: string
  label: string
  completeLabel?: string // Revealed only after span completes — hides findings until "discovered"
  elapsed: string | null
  status: SpanStatus
}

interface TraceAgent {
  id: string
  label: string
  icon: typeof Building2
  elapsed: string | null
  status: SpanStatus
  spans: TraceSpan[]
  collapsed: boolean
}

function StatusIcon({ status }: { status: SpanStatus }) {
  if (status === "complete") return <CheckCircle2 size={14} className="shrink-0" style={{ color: "var(--boeing-blue)" }} />
  if (status === "running") return <Loader2 size={14} className="shrink-0 animate-spin" style={{ color: "var(--boeing-cyan)" }} />
  return <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ border: "1.5px solid var(--surface-border)" }} />
}

function TraceRow({ span, isLast }: { span: TraceSpan; isLast: boolean }) {
  return (
    <div
      className="flex items-center gap-3 py-1 pl-8 font-mono text-xs"
      style={{
        opacity: span.status === "pending" ? 0.35 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
      <span style={{ color: "var(--border-hover)" }}>{isLast ? "└─" : "├─"}</span>
      <StatusIcon status={span.status} />
      <span style={{ color: span.status === "running" ? "var(--boeing-blue)" : "var(--text-secondary)" }}>
        {span.status === "complete" && span.completeLabel ? span.completeLabel : span.label}
      </span>
      {span.elapsed && (
        <span className="ml-auto tabular-nums" style={{ color: "var(--text-muted)" }}>{span.elapsed}</span>
      )}
    </div>
  )
}

function AgentTraceBlock({
  agent,
  onToggle,
}: {
  agent: TraceAgent
  onToggle: () => void
}) {
  const Icon = agent.icon
  return (
    <div className="bh-panel overflow-hidden">
      {/* Agent header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 p-4 cursor-pointer transition-colors"
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-card-hover)" }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
      >
        <div className="w-8 h-8 rounded flex items-center justify-center shrink-0" style={{ background: "var(--boeing-ice)" }}>
          <Icon size={16} style={{ color: "var(--boeing-blue)" }} />
        </div>
        <span className="font-semibold text-sm flex-1 text-left" style={{ color: "var(--text-primary)" }}>{agent.label}</span>
        {agent.elapsed && (
          <span className="font-mono text-xs tabular-nums mr-2" style={{ color: "var(--text-muted)" }}>{agent.elapsed}</span>
        )}
        <StatusIcon status={agent.status} />
        {agent.collapsed ? <ChevronRight size={14} style={{ color: "var(--text-muted)" }} /> : <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />}
      </button>

      {/* Sub-task spans */}
      {!agent.collapsed && agent.spans.length > 0 && (
        <div className="pb-3 px-4" style={{ borderTop: "1px solid var(--surface-border)" }}>
          <div className="pt-2">
            {agent.spans.map((span, i) => (
              <TraceRow key={span.id} span={span} isLast={i === agent.spans.length - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

function formatDuration(ms: number): string {
  return `${(ms / 1000).toFixed(1)}s`
}

type ResearchPane = "agents" | "brief"

function ResearchPaneToggle({
  pane,
  onChange,
  briefReady,
}: {
  pane: ResearchPane
  onChange: (pane: ResearchPane) => void
  briefReady: boolean
}) {
  const tabs: { id: ResearchPane; label: string; icon: typeof ListTree; disabled?: boolean }[] = [
    { id: "agents", label: "Agent activity", icon: ListTree },
    { id: "brief", label: "Research brief", icon: LayoutList, disabled: !briefReady },
  ]

  return (
    <div
      className="flex items-center gap-1 p-0.5 rounded shrink-0"
      style={{ background: "var(--bg-muted)" }}
      role="tablist"
      aria-label="Research views"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const active = pane === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={tab.disabled}
            title={tab.disabled ? "Available when research finishes" : undefined}
            onClick={() => {
              if (tab.disabled) return
              onChange(tab.id)
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-[12px] font-medium disabled:cursor-not-allowed disabled:opacity-45"
            style={{
              background: active ? "#fff" : "transparent",
              color: active ? "var(--boeing-blue)" : "var(--text-secondary)",
              boxShadow: active ? "0 1px 2px rgba(10,34,64,0.08)" : undefined,
            }}
          >
            <Icon size={13} />
            {tab.label}
            {tab.id === "brief" && briefReady && !active && (
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--boeing-blue)" }} aria-hidden />
            )}
          </button>
        )
      })}
    </div>
  )
}

export function AgentResearch({
  company,
  person,
  meetingType,
  prefetchedResult,
  prefetchInProgress,
  completedResult,
  initialNotes,
  onReady,
  onComplete,
}: AgentResearchProps) {
  const [isComplete, setIsComplete] = useState(false)
  const [isFallback, setIsFallback] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResearchResult | null>(null)
  const [internalNotes, setInternalNotes] = useState(initialNotes ?? "")
  const [extractedDoc, setExtractedDoc] = useState<ExtractedInternalDocument | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [pane, setPane] = useState<ResearchPane>("agents")
  const agentScrollRef = useRef<HTMLDivElement>(null)
  const stickToBottom = useRef(true)
  const [agents, setAgents] = useState<TraceAgent[]>([
    {
      id: "company", label: "Internal & Company Research", icon: Building2,
      elapsed: null, status: "pending", collapsed: false,
      spans: [
        { id: "c1", label: `Web search: "${company.name}"`, elapsed: null, status: "pending" },
        { id: "c2", label: "Programme and fleet status", elapsed: null, status: "pending" },
        { id: "c3", label: "News coverage scan", elapsed: null, status: "pending" },
        { id: "c4", label: "Internal Boeing record search", elapsed: null, status: "pending" },
      ],
    },
    {
      id: "industry", label: "Industry Research", icon: Globe,
      elapsed: null, status: "pending", collapsed: false,
      spans: [
        { id: "i1", label: "Competitor landscape mapping", elapsed: null, status: "pending" },
        { id: "i2", label: "Market trend analysis", elapsed: null, status: "pending" },
        { id: "i3", label: `LinkedIn profile scan: ${person.name}`, elapsed: null, status: "pending" },
      ],
    },
    {
      id: "country", label: "Country Research", icon: MapPin,
      elapsed: null, status: "pending", collapsed: false,
      spans: [
        { id: "k1", label: "Loading country brief", elapsed: null, status: "pending" },
        { id: "k2", label: "Mapping bilateral aerospace agenda", elapsed: null, status: "pending" },
        { id: "k3", label: "Scanning air-show talking points", elapsed: null, status: "pending" },
        { id: "k4", label: "Extracting counterpart concerns", elapsed: null, status: "pending" },
      ],
    },
  ])
  const hasFired = useRef(false)
  const extractedRef = useRef<ExtractedInternalDocument | null>(null)

  const publishResult = useCallback((r: ResearchResult) => {
    const merged = extractedRef.current ? mergePriorEngagement(r, extractedRef.current) : r
    if (extractedRef.current) setInternalNotes(extractedRef.current.notesText)
    setResult(merged)
  }, [])

  useEffect(() => {
    if (isComplete) return
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [isComplete])

  const updateSpan = useCallback((agentId: string, spanId: string, status: SpanStatus, elapsed?: string) => {
    setAgents((prev) => prev.map((a) => {
      if (a.id !== agentId) return a
      const updatedSpans = a.spans.map((s) =>
        s.id === spanId ? { ...s, status, elapsed: elapsed ?? s.elapsed } : s
      )
      // If updating a span to running, make sure the agent is running too
      const agentStatus = updatedSpans.every((s) => s.status === "complete") ? "complete" as const
        : updatedSpans.some((s) => s.status === "running" || s.status === "complete") ? "running" as const
        : "pending" as const
      return { ...a, spans: updatedSpans, status: agentStatus }
    }))
  }, [])

  const completeAgent = useCallback((agentId: string, totalElapsed: string) => {
    setAgents((prev) => prev.map((a) =>
      a.id === agentId ? { ...a, status: "complete", elapsed: totalElapsed } : a
    ))
  }, [])

  const toggleAgent = useCallback((agentId: string) => {
    setAgents((prev) => prev.map((a) =>
      a.id === agentId ? { ...a, collapsed: !a.collapsed } : a
    ))
  }, [])

  const doResearch = useCallback(async () => {
    setError(null)
    setIsFallback(false)
    setElapsedSeconds(0)

    const jitter = (base: number) => base + (Math.random() - 0.5) * 1000

    // Generic trace animation for SSE/API path (short, ~7s)
    const animateTrace = async () => {
      const steps: { delay: number; agentId: string; spanId: string; elapsed: string }[] = [
        { delay: 300, agentId: "company", spanId: "c1", elapsed: "" },
        { delay: 1400, agentId: "company", spanId: "c1", elapsed: "1.1s" },
        { delay: 1500, agentId: "company", spanId: "c2", elapsed: "" },
        { delay: 3100, agentId: "company", spanId: "c2", elapsed: "1.6s" },
        { delay: 3200, agentId: "company", spanId: "c3", elapsed: "" },
        { delay: 4300, agentId: "company", spanId: "c3", elapsed: "1.1s" },
        { delay: 4400, agentId: "company", spanId: "c4", elapsed: "" },
        { delay: 5500, agentId: "company", spanId: "c4", elapsed: "1.1s" },
        { delay: 800, agentId: "industry", spanId: "i1", elapsed: "" },
        { delay: 2500, agentId: "industry", spanId: "i1", elapsed: "1.7s" },
        { delay: 2600, agentId: "industry", spanId: "i2", elapsed: "" },
        { delay: 4600, agentId: "industry", spanId: "i2", elapsed: "2.0s" },
        { delay: 4700, agentId: "industry", spanId: "i3", elapsed: "" },
        { delay: 6200, agentId: "industry", spanId: "i3", elapsed: "1.5s" },
        { delay: 1000, agentId: "country", spanId: "k1", elapsed: "" },
        { delay: 1600, agentId: "country", spanId: "k1", elapsed: "0.6s" },
        { delay: 1700, agentId: "country", spanId: "k2", elapsed: "" },
        { delay: 3800, agentId: "country", spanId: "k2", elapsed: "2.1s" },
        { delay: 3900, agentId: "country", spanId: "k3", elapsed: "" },
        { delay: 5400, agentId: "country", spanId: "k3", elapsed: "1.5s" },
        { delay: 5500, agentId: "country", spanId: "k4", elapsed: "" },
        { delay: 7200, agentId: "country", spanId: "k4", elapsed: "1.7s" },
      ]

      steps.sort((a, b) => a.delay - b.delay)
      let lastDelay = 0
      for (const step of steps) {
        await new Promise((r) => setTimeout(r, step.delay - lastDelay))
        lastDelay = step.delay
        if (step.elapsed === "") {
          updateSpan(step.agentId, step.spanId, "running")
        } else {
          updateSpan(step.agentId, step.spanId, "complete", step.elapsed)
        }
      }

      await new Promise((r) => setTimeout(r, 400))
      completeAgent("company", formatDuration(5500))
      await new Promise((r) => setTimeout(r, 200))
      completeAgent("industry", formatDuration(6200))
      await new Promise((r) => setTimeout(r, 200))
      completeAgent("country", formatDuration(7200))
    }

    // Check for hardcoded research data (demo companies)
    const hardcoded = getHardcodedResearch(company.id, person.id)
    if (hardcoded) {
      // --- Data-driven simulation for demo companies (25-35s) ---

      // Build data-specific span labels from research result
      const overviewSnippet = hardcoded.company.overview.split(".")[0]
      const newsHeadline = hardcoded.company.recent_news[0]?.headline || "Analyzing news feeds..."
      const metricLabels = hardcoded.company.key_metrics.slice(0, 2).map((m) => m.label).join(", ")
      const metricCount = hardcoded.company.key_metrics.length
      const competitiveSnippet = hardcoded.industry.competitive_context.split(".")[0]
      const postCount = hardcoded.person.linkedin_posts.length
      const firstPostSnippet = hardcoded.person.linkedin_posts[0]?.text.slice(0, 80) || ""
      const firstTrend = hardcoded.industry.trends[0] || "Analyzing market dynamics..."
      const trendSnippet = firstTrend.length > 90 ? firstTrend.slice(0, 90) + "..." : firstTrend

      const clip = (text: string, max = 90) => (text.length > max ? text.slice(0, max) + "..." : text)
      const countryName = hardcoded.country?.name || company.name
      const countryOverview = clip(hardcoded.country?.overview.split(".")[0] || "Country brief loaded")
      const bilateralSnippet = clip(hardcoded.country?.bilateral_context.split(".")[0] || "Bilateral context mapped")
      const priorities = hardcoded.country?.priorities ?? []
      const concerns = hardcoded.country?.concerns ?? []
      const topPriority = priorities[0] ? `Top priority: ${clip(priorities[0], 80)}` : "Priorities mapped"
      const topConcern = concerns[0] ? `Concern: ${clip(concerns[0], 80)}` : "Concerns mapped"

      // Replace agent spans — action labels while running, findings revealed on complete
      setAgents((prev) => prev.map((a) => {
        if (a.id === "company") {
          return {
            ...a, status: "pending", elapsed: null,
            spans: [
              { id: "c1", label: `Querying ${company.name} corporate website...`, completeLabel: `Loaded ${company.domain}`, elapsed: null, status: "pending" },
              { id: "c2", label: "Parsing company overview...", completeLabel: `Found: ${overviewSnippet}`, elapsed: null, status: "pending" },
              { id: "c3", label: "Scanning recent press coverage...", completeLabel: `Found: ${newsHeadline}`, elapsed: null, status: "pending" },
              { id: "c4", label: "Searching for additional headlines...", completeLabel: `${hardcoded.company.recent_news.length} articles collected`, elapsed: null, status: "pending" },
              { id: "c5", label: "Extracting programme and fleet metrics...", completeLabel: `Extracted: ${metricLabels}`, elapsed: null, status: "pending" },
              { id: "c6", label: "Validating metric sources...", completeLabel: `${metricCount} metrics verified`, elapsed: null, status: "pending" },
              { id: "c7", label: "Connecting to internal Boeing record store...", completeLabel: "Connected to secured index", elapsed: null, status: "pending" },
              { id: "c8", label: `Searching prior meeting notes: ${person.name}...`, completeLabel: "Internal records matched", elapsed: null, status: "pending" },
              { id: "c9", label: "Ranking internal documents by relevance...", completeLabel: "Insights extracted from internal notes", elapsed: null, status: "pending" },
              { id: "c10", label: "Compiling organization profile...", completeLabel: "Internal & company research complete", elapsed: null, status: "pending" },
            ],
          }
        }
        if (a.id === "industry") {
          return {
            ...a, status: "pending", elapsed: null,
            spans: [
              { id: "i1", label: `Mapping competitive landscape...`, completeLabel: `${competitiveSnippet}`, elapsed: null, status: "pending" },
              { id: "i2", label: "Identifying key competitors...", completeLabel: `Competitive analysis complete`, elapsed: null, status: "pending" },
              { id: "i3", label: `Scanning LinkedIn: ${person.name}...`, completeLabel: `Found ${postCount} recent posts`, elapsed: null, status: "pending" },
              { id: "i4", label: "Reading recent activity...", completeLabel: `"${firstPostSnippet}..."`, elapsed: null, status: "pending" },
              { id: "i5", label: "Analyzing post themes...", completeLabel: "Activity themes mapped", elapsed: null, status: "pending" },
              { id: "i6", label: "Researching industry trends...", completeLabel: trendSnippet, elapsed: null, status: "pending" },
              { id: "i7", label: "Identifying additional trends...", completeLabel: `${hardcoded.industry.trends.length} trends identified`, elapsed: null, status: "pending" },
              { id: "i8", label: "Synthesizing strategic profile...", completeLabel: "Profile overview generated", elapsed: null, status: "pending" },
              { id: "i9", label: "Finalizing industry analysis...", completeLabel: "Industry research complete", elapsed: null, status: "pending" },
            ],
          }
        }
        if (a.id === "country") {
          return {
            ...a, status: "pending", elapsed: null,
            spans: [
              { id: "k1", label: `Loading country brief: ${countryName}...`, completeLabel: `Country brief loaded — ${countryName}`, elapsed: null, status: "pending" },
              { id: "k2", label: "Reading defence posture and budget cycle...", completeLabel: countryOverview, elapsed: null, status: "pending" },
              { id: "k3", label: "Mapping bilateral aerospace agenda...", completeLabel: bilateralSnippet, elapsed: null, status: "pending" },
              { id: "k4", label: "Ranking ministry priorities...", completeLabel: topPriority, elapsed: null, status: "pending" },
              { id: "k5", label: "Collating remaining priorities...", completeLabel: `${priorities.length} national priorities captured`, elapsed: null, status: "pending" },
              { id: "k6", label: "Extracting counterpart concerns...", completeLabel: topConcern, elapsed: null, status: "pending" },
              { id: "k7", label: "Scanning air-show talking points...", completeLabel: "Country research complete", elapsed: null, status: "pending" },
            ],
          }
        }
        return a
      }))

      // Wait one frame for state to flush before starting animation
      await new Promise((r) => setTimeout(r, 50))

      // Build staggered steps with jitter
      // Internal & Company Research: ~24s total
      const steps: { delay: number; agentId: string; spanId: string; elapsed: string }[] = [
        { delay: jitter(400),   agentId: "company", spanId: "c1", elapsed: "" },
        { delay: jitter(2800),  agentId: "company", spanId: "c1", elapsed: "2.4s" },
        { delay: jitter(3000),  agentId: "company", spanId: "c2", elapsed: "" },
        { delay: jitter(5400),  agentId: "company", spanId: "c2", elapsed: "2.4s" },
        { delay: jitter(5600),  agentId: "company", spanId: "c3", elapsed: "" },
        { delay: jitter(8200),  agentId: "company", spanId: "c3", elapsed: "2.6s" },
        { delay: jitter(8400),  agentId: "company", spanId: "c4", elapsed: "" },
        { delay: jitter(10200), agentId: "company", spanId: "c4", elapsed: "1.8s" },
        { delay: jitter(10400), agentId: "company", spanId: "c5", elapsed: "" },
        { delay: jitter(13200), agentId: "company", spanId: "c5", elapsed: "2.8s" },
        { delay: jitter(13400), agentId: "company", spanId: "c6", elapsed: "" },
        { delay: jitter(15000), agentId: "company", spanId: "c6", elapsed: "1.6s" },
        { delay: jitter(15200), agentId: "company", spanId: "c7", elapsed: "" },
        { delay: jitter(16400), agentId: "company", spanId: "c7", elapsed: "1.2s" },
        { delay: jitter(16600), agentId: "company", spanId: "c8", elapsed: "" },
        { delay: jitter(20200), agentId: "company", spanId: "c8", elapsed: "3.6s" },
        { delay: jitter(20400), agentId: "company", spanId: "c9", elapsed: "" },
        { delay: jitter(22800), agentId: "company", spanId: "c9", elapsed: "2.4s" },
        { delay: jitter(23000), agentId: "company", spanId: "c10", elapsed: "" },
        { delay: jitter(24400), agentId: "company", spanId: "c10", elapsed: "1.4s" },
      ]

      // Industry Research: starts at ~1s, completes at ~22-28s
      steps.push(
        { delay: jitter(1200),  agentId: "industry", spanId: "i1", elapsed: "" },
        { delay: jitter(4000),  agentId: "industry", spanId: "i1", elapsed: "2.8s" },
        { delay: jitter(4200),  agentId: "industry", spanId: "i2", elapsed: "" },
        { delay: jitter(7400),  agentId: "industry", spanId: "i2", elapsed: "3.2s" },
        { delay: jitter(7600),  agentId: "industry", spanId: "i3", elapsed: "" },
        { delay: jitter(10800), agentId: "industry", spanId: "i3", elapsed: "3.2s" },
        { delay: jitter(11000), agentId: "industry", spanId: "i4", elapsed: "" },
        { delay: jitter(12600), agentId: "industry", spanId: "i4", elapsed: "1.6s" },
        { delay: jitter(12800), agentId: "industry", spanId: "i5", elapsed: "" },
        { delay: jitter(15600), agentId: "industry", spanId: "i5", elapsed: "2.8s" },
        { delay: jitter(15800), agentId: "industry", spanId: "i6", elapsed: "" },
        { delay: jitter(19000), agentId: "industry", spanId: "i6", elapsed: "3.2s" },
        { delay: jitter(19200), agentId: "industry", spanId: "i7", elapsed: "" },
        { delay: jitter(22400), agentId: "industry", spanId: "i7", elapsed: "3.2s" },
        { delay: jitter(22600), agentId: "industry", spanId: "i8", elapsed: "" },
        { delay: jitter(25200), agentId: "industry", spanId: "i8", elapsed: "2.6s" },
        { delay: jitter(25400), agentId: "industry", spanId: "i9", elapsed: "" },
        { delay: jitter(26400), agentId: "industry", spanId: "i9", elapsed: "1.0s" },
      )

      // Country Research: starts at ~2s, completes at ~26s
      steps.push(
        { delay: jitter(2000),  agentId: "country", spanId: "k1", elapsed: "" },
        { delay: jitter(3400),  agentId: "country", spanId: "k1", elapsed: "1.4s" },
        { delay: jitter(3600),  agentId: "country", spanId: "k2", elapsed: "" },
        { delay: jitter(6400),  agentId: "country", spanId: "k2", elapsed: "2.8s" },
        { delay: jitter(6600),  agentId: "country", spanId: "k3", elapsed: "" },
        { delay: jitter(10600), agentId: "country", spanId: "k3", elapsed: "4.0s" },
        { delay: jitter(10800), agentId: "country", spanId: "k4", elapsed: "" },
        { delay: jitter(14400), agentId: "country", spanId: "k4", elapsed: "3.6s" },
        { delay: jitter(14600), agentId: "country", spanId: "k5", elapsed: "" },
        { delay: jitter(18600), agentId: "country", spanId: "k5", elapsed: "4.0s" },
        { delay: jitter(18800), agentId: "country", spanId: "k6", elapsed: "" },
        { delay: jitter(22400), agentId: "country", spanId: "k6", elapsed: "3.6s" },
        { delay: jitter(22600), agentId: "country", spanId: "k7", elapsed: "" },
        { delay: jitter(26200), agentId: "country", spanId: "k7", elapsed: "3.6s" },
      )

      // Sort by delay and process
      steps.sort((a, b) => a.delay - b.delay)
      // Ensure no negative delays from jitter
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].delay < 0) steps[i].delay = 0
        if (i > 0 && steps[i].delay < steps[i - 1].delay) {
          steps[i].delay = steps[i - 1].delay + 50
        }
      }

      let lastDelay = 0
      for (const step of steps) {
        const wait = Math.max(0, step.delay - lastDelay)
        await new Promise((r) => setTimeout(r, wait))
        lastDelay = step.delay
        if (step.elapsed === "") {
          updateSpan(step.agentId, step.spanId, "running")
        } else {
          updateSpan(step.agentId, step.spanId, "complete", step.elapsed)
        }
      }

      // Complete agents with staggered timing
      await new Promise((r) => setTimeout(r, jitter(600)))
      completeAgent("company", formatDuration(24500))
      await new Promise((r) => setTimeout(r, jitter(2000)))
      completeAgent("industry", formatDuration(26500))
      await new Promise((r) => setTimeout(r, jitter(1200)))
      completeAgent("country", formatDuration(27000))

      setIsComplete(true)
      publishResult(hardcoded)
      return
    }

    // SSE path for custom companies — animate trace in parallel with real API
    const tracePromise = animateTrace()

    try {
      const res = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.name,
          person: { name: person.name, title: person.title },
          meetingType,
        }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      if (!res.body) throw new Error("No response stream")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

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
            if (event.type === "result") {
              await tracePromise
              setIsComplete(true)
              setIsFallback(!!event.isFallback)
              publishResult(event.data)
            }
          } catch {
            // skip malformed events
          }
        }
      }
    } catch (err) {
      await tracePromise
      setError(err instanceof Error ? err.message : "Research failed.")
    }
  }, [company, person, meetingType, updateSpan, completeAgent, publishResult])

  // Start research on mount
  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    if (completedResult) {
      publishResult(completedResult)
      setIsComplete(true)
      stickToBottom.current = false
      setAgents((prev) =>
        prev.map((a) => ({
          ...a,
          status: "complete" as const,
          elapsed: a.elapsed ?? "—",
          spans: a.spans.map((s) => ({ ...s, status: "complete" as const })),
        })),
      )
      return
    }

    // If prefetch already resolved, use it immediately
    if (prefetchedResult) {
      publishResult(prefetchedResult)
      setIsComplete(true)
      const fastTrace = async () => {
        for (const agent of ["company", "industry", "country"] as const) {
          completeAgent(agent, "0.8s")
          await new Promise(r => setTimeout(r, 600))
        }
      }
      fastTrace()
      return
    }
    // If prefetch is in progress, don't fire a duplicate API call — wait for it
    if (prefetchInProgress) {
      hasFired.current = false
      return
    }
    doResearch()
  }, [doResearch, prefetchedResult, prefetchInProgress, completeAgent, completedResult])

  const onReadyRef = useRef(onReady)
  onReadyRef.current = onReady

  useEffect(() => {
    if (result) onReadyRef.current?.(result, internalNotes)
  }, [result, internalNotes])

  const handleExtracted = useCallback((doc: ExtractedInternalDocument) => {
    extractedRef.current = doc
    setExtractedDoc(doc)
    setInternalNotes(doc.notesText)
    setResult((prev) => (prev ? mergePriorEngagement(prev, doc) : prev))
  }, [])

  const documentsPanel = (compact?: boolean) => (
    <InternalDocumentsPanel
      company={company}
      person={person}
      meetingType={meetingType}
      research={result}
      compact={compact}
      extracted={extractedDoc}
      onExtracted={handleExtracted}
      onClear={() => {
        extractedRef.current = null
        setExtractedDoc(null)
        if (!initialNotes) setInternalNotes("")
      }}
    />
  )

  useEffect(() => {
    if (isComplete) stickToBottom.current = false
  }, [isComplete])

  const traceSig = agents
    .map((a) => `${a.id}:${a.status}:${a.elapsed}:${a.spans.map((s) => `${s.status}:${s.elapsed}`).join(",")}`)
    .join("|")

  useEffect(() => {
    if (pane !== "agents" || isComplete || !stickToBottom.current) return
    const el = agentScrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
  }, [traceSig, pane, isComplete])

  // If prefetch resolves WHILE we're already researching, pick it up
  useEffect(() => {
    if (prefetchedResult && !isComplete && !result) {
      publishResult(prefetchedResult)
      setIsComplete(true)
      // Complete all agents instantly
      for (const agent of ["company", "industry", "country"] as const) {
        completeAgent(agent, formatTime(elapsedSeconds))
      }
    }
  }, [prefetchedResult, isComplete, result, completeAgent, elapsedSeconds])

  const retryResearch = () => {
    hasFired.current = false
    setResult(null)
    setIsComplete(false)
    setIsFallback(false)
    setElapsedSeconds(0)
    setPane("agents")
    stickToBottom.current = true
    doResearch()
  }

  const openBrief = () => {
    if (!result) return
    setPane("brief")
  }

  const showBrief = pane === "brief" && !!result

  return (
    <div className="h-full min-h-0 flex flex-col gap-3">
      {isFallback && (
        <div
          className="flex flex-wrap items-center gap-3 rounded px-4 py-3 shrink-0"
          style={{ background: "#FFF8E8", color: "#B45309", border: "1px solid #F3E0B8" }}
        >
          <AlertCircle size={16} className="shrink-0" />
          <p className="text-sm flex-1">Agent returned limited data. Review the library, or retry.</p>
          <button type="button" className="text-xs font-semibold underline" onClick={retryResearch}>
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 shrink-0 px-0.5">
        <div className="min-w-0">
          <p className="system-badge system-badge--dark">Step 04 &middot; Research</p>
        </div>
        <ResearchPaneToggle pane={pane} onChange={setPane} briefReady={!!result} />
        <p className="text-sm font-mono tabular-nums" style={{ color: "var(--text-muted)" }}>
          {isComplete ? (result ? "Ready" : formatTime(elapsedSeconds)) : formatTime(elapsedSeconds)}
        </p>
      </div>

      {showBrief && result ? (
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          <ResearchAuditWorkspace
            company={company}
            person={person}
            research={result}
            meetingType={meetingType}
            notesSlot={documentsPanel(true)}
            notesOpenLabel="Internal docs"
            focusSourceId={extractedDoc ? PRIOR_SOURCE_ID : null}
            onContinue={() => onComplete(result, internalNotes)}
            onSkip={() => onComplete(result, internalNotes)}
          />
        </div>
      ) : (
        <div
          ref={agentScrollRef}
          className="research-agent-scroll flex-1 min-h-0 overflow-y-auto audit-scroll"
          onScroll={(e) => {
            const el = e.currentTarget
            stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96
          }}
        >
          <div className="space-y-6 max-w-3xl mx-auto pb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                {isComplete && result ? "Research ready" : "Preparing briefing"}
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {person.name} &middot; {company.name}
              </p>
            </div>

            <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: "var(--surface-border)" }}>
              <div
                className="h-full rounded-full"
                style={
                  isComplete
                    ? { width: "100%", background: "var(--boeing-blue)", transition: "width 0.5s ease-out" }
                    : {
                        width: "100%",
                        background: "linear-gradient(90deg, transparent 0%, #0033A1 50%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "shimmer 1.5s ease-in-out infinite",
                      }
                }
              />
              <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
            </div>

            <div className="space-y-2">
              {agents.map((agent) => (
                <AgentTraceBlock
                  key={agent.id}
                  agent={agent}
                  onToggle={() => toggleAgent(agent.id)}
                />
              ))}
            </div>

            {documentsPanel(false)}

            {isComplete && result && (
              <div
                className="flex flex-col items-center gap-4 opacity-0"
                style={{ animation: "fadeInUp 0.6s ease-out forwards" }}
              >
                {isFallback ? (
                  <>
                    <div className="flex items-center gap-2" style={{ color: "#B45309" }}>
                      <AlertCircle size={16} />
                      <p className="text-sm">Agent returned limited data. You can retry or continue.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button type="button" onClick={retryResearch} className="btn-secondary">
                        Retry
                      </button>
                      <button type="button" onClick={openBrief} className="btn-secondary">
                        Open research brief
                      </button>
                      <Button onClick={() => onComplete(result, internalNotes)}>Continue with limited data</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                      Research complete. Open the brief to review sources, or continue to the paper.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button type="button" onClick={openBrief} className="btn-secondary">
                        Open research brief
                      </button>
                      <Button onClick={() => onComplete(result, internalNotes)}>Continue to meeting paper</Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex items-center gap-2" style={{ color: "#B91C1C" }}>
                  <AlertCircle size={18} />
                  <span className="text-sm">{error}</span>
                </div>
                <button
                  onClick={retryResearch}
                  className="btn-primary !h-auto !py-2 !px-5 !text-sm"
                >
                  Retry
                </button>
              </div>
            )}

            <div className="flex gap-2 pt-2" style={{ color: "var(--text-muted)" }}>
              <Info size={14} className="shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                The internal record search inside Internal &amp; Company Research uses a{" "}
                <a
                  href="https://aws.amazon.com/what-is/retrieval-augmented-generation/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                  style={{ color: "var(--boeing-blue)" }}
                >
                  RAG (Retrieval-Augmented Generation)
                </a>{" "}
                system to query Boeing's own meeting notes, campaign memos, and account history through a secured vector
                database not reachable from web search. Internal record search is simulated in this environment.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
