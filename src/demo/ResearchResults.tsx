import { useState, useEffect, useRef, useMemo } from "react"
import { Download, MessageCircleQuestion, ListChecks, FileText, Newspaper, BarChart3, Globe2, Building2, UserRound, Landmark, ShieldAlert, Lock } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "../components/Button"
import type { Company } from "../data/companies"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import { generateBriefing } from "../utils/briefingGenerator"
import type { FrameworksData } from "../types/frameworks"

interface ResearchResultsProps {
  company: Company
  person: Person
  research: ResearchResult
  meetingType: string
  internalNotes?: string
  onStartMeeting: () => void
  onFrameworksReady?: (data: FrameworksData) => void
}

const BLUE = "#0033A1"
const NAVY = "#0A2240"
const ICE = "#E3EFFA"

function FadeSection({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <div
      className="opacity-0"
      style={{
        animation: "fadeInUp 0.6s ease-out forwards",
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function Panel({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow: string
  title: string
  icon: LucideIcon
  children: React.ReactNode
}) {
  return (
    <section className="bh-card p-6 sm:p-8">
      <header className="pb-4 mb-6 border-b" style={{ borderColor: "var(--surface-border)" }}>
        <p className="flex items-center gap-2 text-[11px] font-semibold uppercase" style={{ color: BLUE, letterSpacing: "0.14em" }}>
          <Icon size={13} color={BLUE} />
          {eyebrow}
        </p>
        <h3 className="mt-2 text-xl font-bold" style={{ color: NAVY, letterSpacing: "-0.01em" }}>{title}</h3>
      </header>
      {children}
    </section>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
      {children}
    </p>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{children}</p>
}

function NumberBadge({ n }: { n: number }) {
  return (
    <span
      className="w-5 h-5 rounded-sm flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5"
      style={{ background: ICE, color: BLUE }}
    >
      {n}
    </span>
  )
}

function BriefingSection({ research, meetingType }: { research: ResearchResult; meetingType: string }) {
  const briefing = useMemo(() => generateBriefing(research, meetingType), [research, meetingType])

  return (
    <div className="space-y-7">
      <Body>{briefing.summary}</Body>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <ListChecks size={14} color={BLUE} />
          <h4 className="text-sm font-semibold" style={{ color: NAVY }}>Suggested Agenda</h4>
        </div>
        <ol className="space-y-2">
          {briefing.agenda.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <NumberBadge n={i + 1} />
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion size={14} color={BLUE} />
          <h4 className="text-sm font-semibold" style={{ color: NAVY }}>Key Questions</h4>
        </div>
        <ul className="space-y-2">
          {briefing.questions.map((q, i) => (
            <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: BLUE }} />
              <span className="italic">{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function PersonSection({ research, photoUrl }: { research: ResearchResult; photoUrl?: string }) {
  const { person } = research
  const initial = person.name.charAt(0).toUpperCase()

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        {photoUrl ? (
          <img src={photoUrl} alt={person.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold shrink-0" style={{ background: BLUE }}>
            {initial}
          </div>
        )}
        <div>
          <p className="text-lg font-bold" style={{ color: NAVY }}>{person.name}</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{person.title}</p>
        </div>
      </div>

      {person.background && <Body>{person.background}</Body>}

      {person.profile_overview && (
        <div className="pl-4 py-1" style={{ borderLeft: `3px solid ${BLUE}` }}>
          <Label>Read on the counterpart</Label>
          <p className="mt-1.5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{person.profile_overview}</p>
        </div>
      )}

      {person.linkedin_posts.length > 0 && (
        <div className="space-y-3">
          <Label>Recent Public Remarks</Label>
          {person.linkedin_posts.map((post, i) => (
            <div key={i} className="rounded p-4" style={{ background: "var(--bg-muted)" }}>
              <p className="text-sm italic leading-relaxed" style={{ color: "var(--text-secondary)" }}>{post.text}</p>
              {post.date && <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{post.date}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CompanySection({ research }: { research: ResearchResult }) {
  const { company } = research

  const hasNews = company.recent_news.length > 0
  const hasMetrics = company.key_metrics.length > 0
  if (!company.overview && !hasNews && !hasMetrics) return null

  return (
    <div className="space-y-6">
      {company.overview && <Body>{company.overview}</Body>}

      {hasMetrics && (
        <div className="space-y-3">
          <Label>Key Metrics</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {company.key_metrics.map((metric, i) => (
              <div key={i} className="rounded p-4" style={{ background: "var(--bg-muted)", borderTop: `2px solid ${BLUE}` }}>
                <p className="text-base font-bold leading-tight" style={{ color: NAVY }}>{metric.value}</p>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hasNews && (
        <div className="space-y-3">
          <Label>Recent Developments</Label>
          <div className="space-y-2">
            {company.recent_news.map((item, i) => (
              <div key={i} className="rounded border p-4" style={{ borderColor: "var(--surface-border)" }}>
                <p className="text-sm font-semibold leading-snug" style={{ color: NAVY }}>{item.headline}</p>
                <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>
                  {item.source}{item.date ? ` \u2014 ${item.date}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function IndustrySection({ research }: { research: ResearchResult }) {
  const { industry } = research
  const hasTrends = industry.trends.length > 0

  if (!hasTrends && !industry.competitive_context) return null

  return (
    <div className="space-y-6">
      {hasTrends && (
        <div className="space-y-3">
          <Label>Trends Shaping the Sector</Label>
          <ul className="space-y-2.5">
            {industry.trends.map((trend, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <span className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: BLUE }} />
                <span>{trend}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {industry.competitive_context && (
        <div className="space-y-3">
          <Label>Competitive Context</Label>
          <Body>{industry.competitive_context}</Body>
        </div>
      )}
    </div>
  )
}

function CountrySection({ country }: { country: ResearchResult["country"] }) {
  const priorities = country?.priorities ?? []
  const concerns = country?.concerns ?? []

  return (
    <div className="space-y-6">
      {country.overview && <Body>{country.overview}</Body>}

      {priorities.length > 0 && (
        <div className="space-y-3">
          <Label>National Priorities</Label>
          <ol className="space-y-2.5">
            {priorities.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                <NumberBadge n={i + 1} />
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {country.bilateral_context && (
        <div className="rounded p-5 space-y-2" style={{ background: ICE }}>
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase" style={{ color: BLUE, letterSpacing: "0.12em" }}>
            <Landmark size={13} color={BLUE} />
            Bilateral Context
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>{country.bilateral_context}</p>
        </div>
      )}

      {concerns.length > 0 && (
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase" style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
            <ShieldAlert size={13} />
            Sensitivities to Handle Carefully
          </p>
          <ul className="space-y-2.5">
            {concerns.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm leading-relaxed pl-3" style={{ color: "var(--text-secondary)", borderLeft: "2px solid var(--surface-border)" }}>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface NewsArticle {
  title: string
  link: string
  source: string
  pubDate: string
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (isNaN(seconds)) return ""
  if (seconds < 3600) return "just now"
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return `${Math.floor(seconds / 604800)}w ago`
}

function NewsSection({ companyName }: { companyName: string }) {
  const [articles, setArticles] = useState<NewsArticle[]>([])

  useEffect(() => {
    let cancelled = false

    fetch(`/api/news?company=${encodeURIComponent(companyName)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.articles?.length) setArticles(data.articles)
      })
      .catch(() => {}) // silent fail

    return () => { cancelled = true }
  }, [companyName])

  if (articles.length === 0) return null

  return (
    <FadeSection delay={800}>
      <Panel eyebrow="Press Monitor" title="Latest Coverage" icon={Newspaper}>
        <div className="space-y-2">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded border p-4 transition-colors"
              style={{ borderColor: "var(--surface-border)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-muted)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
            >
              <p className="text-sm font-semibold leading-snug line-clamp-2" style={{ color: NAVY }}>{article.title}</p>
              <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                <span className="inline-block px-1.5 py-0.5 rounded-sm text-[10px] font-semibold mr-2" style={{ background: ICE, color: BLUE }}>
                  {article.source}
                </span>
                {timeAgo(article.pubDate)}
              </p>
            </a>
          ))}
        </div>
      </Panel>
    </FadeSection>
  )
}

// --- Strategic Framework Diagrams ---

const swotColors = {
  strengths: { accent: "#2E7D32", bg: "rgba(46,125,50,0.06)" },
  weaknesses: { accent: "#C62828", bg: "rgba(198,40,40,0.06)" },
  opportunities: { accent: BLUE, bg: "rgba(0,51,161,0.06)" },
  threats: { accent: "#B26A00", bg: "rgba(178,106,0,0.07)" },
}

function SwotDiagram({ swot }: { swot: FrameworksData["swot"] }) {
  return (
    <div className="space-y-3">
      <Label>SWOT Analysis</Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(Object.keys(swotColors) as (keyof typeof swotColors)[]).map((key) => (
          <div
            key={key}
            className="rounded p-4 space-y-2"
            style={{ background: swotColors[key].bg, borderLeft: `3px solid ${swotColors[key].accent}` }}
          >
            <p className="text-[11px] font-bold uppercase" style={{ color: swotColors[key].accent, letterSpacing: "0.1em" }}>
              {key}
            </p>
            <ul className="space-y-1.5">
              {swot[key].map((item, i) => (
                <li key={i} className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const levelColors: Record<string, string> = {
  High: "#C62828",
  Medium: "#B26A00",
  Low: "#2E7D32",
}

function PorterForceCard({ name, level, factors }: { name: string; level: string; factors: string[] }) {
  const accent = levelColors[level] || BLUE
  return (
    <div className="rounded p-3 space-y-1.5 border" style={{ background: "var(--bg-muted)", borderColor: "var(--surface-border)" }}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-semibold" style={{ color: NAVY }}>{name}</p>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-pill shrink-0"
          style={{ background: "#fff", color: accent, border: `1px solid ${accent}` }}
        >
          {level}
        </span>
      </div>
      {factors.map((f, i) => (
        <p key={i} className="text-[11px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f}</p>
      ))}
    </div>
  )
}

function PortersDiagram({ porters }: { porters: FrameworksData["porters"] }) {
  return (
    <div className="space-y-3">
      <Label>Porter's Five Forces</Label>
      <div className="space-y-2">
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <PorterForceCard name="Threat of New Entrants" level={porters.threatOfNewEntrants.level} factors={porters.threatOfNewEntrants.factors} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <PorterForceCard name="Supplier Power" level={porters.bargainingPowerSuppliers.level} factors={porters.bargainingPowerSuppliers.factors} />
          <PorterForceCard name="Buyer Power" level={porters.bargainingPowerBuyers.level} factors={porters.bargainingPowerBuyers.factors} />
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <PorterForceCard name="Competitive Rivalry" level={porters.competitiveRivalry.level} factors={porters.competitiveRivalry.factors} />
          </div>
        </div>
        <div className="flex justify-center">
          <div className="w-full max-w-xs">
            <PorterForceCard name="Threat of Substitutes" level={porters.threatOfSubstitutes.level} factors={porters.threatOfSubstitutes.factors} />
          </div>
        </div>
      </div>
    </div>
  )
}

function FrameworksSection({ companyName, research, onReady }: { companyName: string; research: ResearchResult; onReady?: (data: FrameworksData) => void }) {
  const [data, setData] = useState<FrameworksData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/frameworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ companyName, research }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then(e => { throw new Error(e.error || `HTTP ${res.status}`) })
        }
        return res.json()
      })
      .then((result) => {
        if (!cancelled && result && result.swot) {
          setData(result)
          onReady?.(result)
        }
      })
      .catch((err) => { if (!cancelled) setError(err.message || "Failed to load") })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [companyName])

  if (!data && !loading && !error) return null

  return (
    <FadeSection delay={1200}>
      <Panel eyebrow="Analysis" title="Strategic Frameworks" icon={BarChart3}>
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: ICE, borderTopColor: BLUE }} />
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Generating strategic analysis...</p>
          </div>
        )}

        {!loading && error && (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Strategic frameworks unavailable: {error}</p>
        )}

        {!loading && data && (
          <div className="space-y-8">
            <SwotDiagram swot={data.swot} />
            <PortersDiagram porters={data.porters} />
          </div>
        )}
      </Panel>
    </FadeSection>
  )
}

const meetingShortcuts = [
  { key: "1", label: "Company snapshot" },
  { key: "2", label: "Rapport builder" },
  { key: "3", label: "Meeting prep" },
  { key: "4", label: "Quick lookup" },
  { key: "5", label: "Copilot chat" },
  { key: "6", label: "Strategic frameworks" },
  { key: "7", label: "Country context" },
  { key: "Esc", label: "End meeting" },
]

function InternalNotice() {
  return (
    <div className="rounded border p-5 sm:p-6 space-y-4" style={{ background: "var(--bg-muted)", borderColor: "var(--surface-border)" }}>
      <div className="flex items-start gap-3">
        <Lock size={16} color={BLUE} className="mt-0.5 shrink-0" />
        <div className="space-y-1.5">
          <p className="text-sm font-semibold" style={{ color: NAVY }}>Boeing Helper &middot; Internal deployment</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            This briefing is assembled from internal records and open-source reporting for Boeing personnel preparing
            government, defence and airline engagements. Confirm export-controlled, pricing and contract-sensitive
            details with your regional campaign lead before anything leaves this tool.
          </p>
        </div>
      </div>

      <div className="pt-4 border-t space-y-2" style={{ borderColor: "var(--surface-border)" }}>
        <Label>Live meeting shortcuts</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {meetingShortcuts.map((k) => (
            <div key={k.key} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              <kbd className="px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold" style={{ background: "#fff", color: BLUE, border: "1px solid var(--surface-border)" }}>{k.key}</kbd>
              <span>{k.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ResearchResults({ company, person, research, meetingType, internalNotes, onStartMeeting, onFrameworksReady }: ResearchResultsProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)
  const [localFrameworks, setLocalFrameworks] = useState<FrameworksData | null>(null)

  const handleFrameworksReady = (data: FrameworksData) => {
    setLocalFrameworks(data)
    onFrameworksReady?.(data)
  }

  const briefing = useMemo(() => generateBriefing(research, meetingType), [research, meetingType])
  const country = research.country

  const handlePdfExport = async () => {
    setDownloading(true)
    try {
      const { exportBriefingPDF } = await import("../utils/pdfExport")
      await exportBriefingPDF(contentRef.current!, person.name, {
        personName: person.name,
        personTitle: person.title,
        companyName: company.name,
        meetingType,
        research,
        briefing,
        frameworks: localFrameworks,
        internalNotes,
      })
    } catch (err) {
      console.error("PDF export failed:", err)
    } finally {
      setDownloading(false)
    }
  }

  const actions = (
    <div className="flex flex-wrap gap-3 shrink-0">
      <button
        onClick={handlePdfExport}
        disabled={downloading}
        className="btn-secondary"
      >
        <Download size={16} />
        {downloading ? "Generating..." : "Download PDF"}
      </button>
      <Button onClick={onStartMeeting}>Start the Meeting</Button>
    </div>
  )

  return (
    <div className="space-y-6 pb-12">
      <FadeSection delay={0}>
        <div className="bh-panel overflow-hidden">
          <div style={{ height: "4px", background: BLUE }} />
          <div className="px-6 sm:px-8 py-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="system-badge system-badge--dark">Boeing Helper &middot; Meeting Briefing</p>
              <h2 className="mt-2 text-3xl font-bold" style={{ color: NAVY, letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                Your Briefing is Ready
              </h2>
              <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                {meetingType} with {person.name} &middot; {person.title}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {company.name}{country?.name ? ` \u00b7 ${country.name}` : ""}
              </p>
            </div>
            {actions}
          </div>
        </div>
      </FadeSection>

      <div ref={contentRef} className="space-y-6">
        <FadeSection delay={150}>
          <Panel eyebrow={`Preparation \u00b7 ${meetingType}`} title="Executive Summary" icon={FileText}>
            <BriefingSection research={research} meetingType={meetingType} />
          </Panel>
        </FadeSection>

        <FadeSection delay={300}>
          <Panel eyebrow="Counterpart" title={person.name} icon={UserRound}>
            <PersonSection research={research} photoUrl={person.photoUrl} />
          </Panel>
        </FadeSection>

        <FadeSection delay={450}>
          <Panel eyebrow="Organisation" title={company.name} icon={Building2}>
            <CompanySection research={research} />
          </Panel>
        </FadeSection>

        <FadeSection delay={600}>
          <Panel eyebrow="Sector" title="Industry Landscape" icon={BarChart3}>
            <IndustrySection research={research} />
          </Panel>
        </FadeSection>

        {country && (
          <FadeSection delay={750}>
            <Panel eyebrow="Country Context" title={country.name || "Country Context"} icon={Globe2}>
              <CountrySection country={country} />
            </Panel>
          </FadeSection>
        )}

        <NewsSection companyName={company.name} />

        <FrameworksSection companyName={company.name} research={research} onReady={handleFrameworksReady} />

        {internalNotes && (
          <FadeSection delay={1350}>
            <Panel eyebrow="Internal" title="Your Notes" icon={FileText}>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{internalNotes}</p>
            </Panel>
          </FadeSection>
        )}
      </div>

      <FadeSection delay={1500}>
        <div className="bh-panel px-6 sm:px-8 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold" style={{ color: NAVY }}>Ready when you are</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Take the briefing into the live meeting, or export it for the delegation pack.
            </p>
          </div>
          {actions}
        </div>
      </FadeSection>

      <FadeSection delay={1650}>
        <InternalNotice />
      </FadeSection>
    </div>
  )
}
