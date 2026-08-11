import { useState, useCallback, useRef, useEffect } from "react"
import type { Company } from "../data/companies"
import { companies } from "../data/companies"
import { people } from "../data/people"
import type { Person } from "../data/people"
import type { ResearchResult } from "../types/research"
import { getHardcodedResearch } from "../data/research"
import { CompanySelect } from "./CompanySelect"
import { PersonSelect } from "./PersonSelect"
import { MeetingContext } from "./MeetingContext"
import { AgentResearch } from "./AgentResearch"
import { MeetingPaperView } from "./MeetingPaperView"
import { MaterialsHub } from "./MaterialsHub"
import { HandoffScreen } from "./HandoffScreen"
import { MeetingReportView } from "./MeetingReportView"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { BoeingLogo } from "../components/BoeingLogo"

interface DemoFlowProps {
  onClose: () => void
}

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const mockResearch: ResearchResult = {
  person: {
    name: "Chan Chun Sing",
    title: "Minister for Defence, Singapore",
    background: "Chan Chun Sing became Singapore's Minister for Defence in May 2025 after a career that took him to Major-General and Chief of Army before he entered politics in 2011. He owns the Republic of Singapore Air Force's 20-aircraft F-35 commitment and Singapore's long-horizon approach to capability planning.",
    linkedin_posts: [
      { text: "At Fort Worth to see Singapore's first F-35 being built. This is one step in a long journey we take together with our partners.", date: "September 2025" },
      { text: "Small states cannot choose their geography, but they can choose to be useful, consistent and credible.", date: "June 2025" },
    ],
    profile_overview: "Chan is a soldier-turned-technocrat who reads programme detail personally. The productive ground for a Boeing conversation is the P-8A induction, Apache life extension and Chinook sustainment — existing programmes where schedule reliability and cost-per-flight-hour matter more than new platform pitches.",
  },
  company: {
    overview: "The Ministry of Defence directs the Singapore Armed Forces and the Republic of Singapore Air Force, with acquisition executed through the Defence Science and Technology Agency. The RSAF operates 20 Boeing AH-64D Apaches and 26 Chinooks, has 20 F-35s on order, and will replace its Fokker 50 maritime patrol fleet with Boeing P-8As from the early 2030s.",
    recent_news: [
      { headline: "Singapore's first four F-35Bs due before end-2026, operating initially from Ebbing Air National Guard Base", source: "Asian Military Review", date: "Feb 2026" },
      { headline: "Chief of Air Force calls F-35 and P-8A the RSAF's 'game-changers'", source: "CNA", date: "Feb 2026" },
      { headline: "RSAF opts for a partial C-130 refresh with used H-models rather than new airlift", source: "FlightGlobal", date: "Feb 2026" },
    ],
    key_metrics: [
      { label: "Defence Budget", value: "~S$23B (~3% GDP)" },
      { label: "F-35s on Order", value: "20 (12 B / 8 A)" },
      { label: "Boeing Rotorcraft", value: "20 AH-64D, 26 CH-47" },
      { label: "C-130 Fleet Avg Age", value: "52.7 years" },
    ],
  },
  industry: {
    trends: ["Fifth-generation transition across the Asia-Pacific", "Maritime domain awareness investment", "Attrition-tolerant mass and counter-UAS", "Sustainment economics deciding competitions"],
    competitive_context: "Lockheed Martin holds the fighter and tactical airlift relationship, Airbus supplies tankers and rotorcraft, and Boeing owns heavy lift, attack helicopters and — with the P-8A — maritime patrol. ST Engineering is the local prime for MRO and upgrades.",
  },
  country: {
    name: "Singapore",
    overview: "A city-state with no strategic depth, Singapore sustains one of Asia's most capable militaries on roughly 3 percent of GDP and trains its air force largely from permanent detachments in the United States.",
    priorities: [
      "Deliver the F-35 programme on schedule and expand Tengah Air Base",
      "Replace the Fokker 50 maritime patrol fleet with the P-8A in the early 2030s",
      "Extend proven fleets — AH-64D and F-16 — rather than replace them early",
      "Build depth in drones, counter-drone and AI-enabled command and control",
    ],
    bilateral_context: "The US-Singapore defence relationship is the deepest in Southeast Asia short of a treaty alliance, with US access to Paya Lebar and Changi through 2035 and SAF training detachments across the United States.",
    concerns: [
      "Delivery credibility after F-35 and 777-9 schedule slips",
      "Lifecycle and sustainment cost over acquisition price",
      "Manpower and training pipeline constraints in a conscript force",
      "Local industry participation through ST Engineering and DSTA",
    ],
  },
}

function getInitialState(): { step: Step; company: Company | null; person: Person | null; meetingType: string; research: ResearchResult | null } {
  const params = new URLSearchParams(window.location.search)
  const skipTo = params.get("step")
  if (skipTo === "5" || skipTo === "6" || skipTo === "7" || skipTo === "8") {
    const co = companies.find((c) => c.id === "mindef-sg") ?? companies[0]
    const pe = people.find((p) => p.companyId === co.id)!
    return {
      step: Number(skipTo) as Step,
      company: co,
      person: pe,
      meetingType: "Air Show Briefing",
      research: getHardcodedResearch(co.id, pe.id) ?? mockResearch,
    }
  }
  return { step: 1, company: null, person: null, meetingType: "", research: null }
}

export default function DemoFlow({ onClose }: DemoFlowProps) {
  const init = getInitialState()
  const [step, setStep] = useState<Step>(init.step)
  const [company, setCompany] = useState<Company | null>(init.company)
  const [person, setPerson] = useState<Person | null>(init.person)
  const [meetingType, setMeetingType] = useState<string>(init.meetingType)
  const [research, setResearch] = useState<ResearchResult | null>(init.research)
  const [internalNotes, setInternalNotes] = useState("")
  const [prefetchedResult, setPrefetchedResult] = useState<ResearchResult | null>(null)
  const [prefetchInProgress, setPrefetchInProgress] = useState(false)
  const prefetchAbort = useRef<AbortController | null>(null)

  const startPrefetch = useCallback((co: Company, pe: Person) => {
    if (getHardcodedResearch(co.id, pe.id)) return

    prefetchAbort.current?.abort()
    const abort = new AbortController()
    prefetchAbort.current = abort
    setPrefetchInProgress(true)

    fetch("/api/research", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        company: co.name,
        person: { name: pe.name, title: pe.title },
        meetingType: "Air Show Briefing",
      }),
      signal: abort.signal,
    }).then(async (res) => {
      if (!res.ok || !res.body) return
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
            if (event.type === "result" && !event.isFallback) {
              setPrefetchedResult(event.data)
              setPrefetchInProgress(false)
            }
          } catch { /* skip */ }
        }
      }
    }).catch(() => { /* aborted or failed */ })
      .finally(() => setPrefetchInProgress(false))
  }, [])

  const [prefetchedContacts, setPrefetchedContacts] = useState<Person[] | null>(null)
  const [contactsLoading, setContactsLoading] = useState(false)

  const handleCompanySelect = useCallback((c: Company) => {
    setCompany(c)
    setPrefetchedResult(null)
    setPrefetchInProgress(false)
    setPrefetchedContacts(null)
    prefetchAbort.current?.abort()

    if (c.isCustom) {
      setContactsLoading(true)
      fetch("/api/company-contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: c.name, companyDomain: c.domain }),
      })
        .then((res) => res.json())
        .then((data) => {
          const contacts: Person[] = (data.contacts || []).map((ct: Person) => ({
            ...ct,
            companyId: c.id,
            isCustom: true,
          }))
          setPrefetchedContacts(contacts)
        })
        .catch(() => setPrefetchedContacts([]))
        .finally(() => setContactsLoading(false))
    }

    setTimeout(() => setStep(2), 400)
  }, [])

  const handlePersonSelect = useCallback((p: Person) => {
    setPerson(p)
    if (company) startPrefetch(company, p)
    setTimeout(() => setStep(3), 400)
  }, [company, startPrefetch])

  const handleMeetingSubmit = useCallback((type: string) => {
    setMeetingType(type)
    setStep(4)
  }, [])

  const canGoBack = step > 1 && step !== 4
  const canGoForward =
    (step === 1 && company) ||
    (step === 2 && person) ||
    (step === 3 && meetingType) ||
    (step === 5 && research) ||
    step === 6 ||
    step === 7

  const goBack = () => {
    if (step > 1) setStep((s) => (s - 1) as Step)
  }

  const goForward = () => {
    if (step === 1 && company) setStep(2)
    else if (step === 2 && person) setStep(3)
    else if (step === 3 && meetingType) setStep(4)
    else if (step === 5 && research) setStep(6)
    else if (step === 6) setStep(7)
    else if (step === 7) setStep(8)
  }

  const stepLabels = ["Organization", "Contact", "Context", "Research", "Paper", "Materials", "Handoff", "Report"]
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [step])

  return (
    <div ref={scrollRef} className="demo-shell fixed inset-0 z-50 overflow-y-auto">
      <div className="sticky top-0 z-20">
        <div className="demo-topbar">
          <div className="max-w-5xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4" style={{ minHeight: "2.75rem" }}>
            <div className="flex items-center gap-3 min-w-0">
              <BoeingLogo variant="white" height={18} />
              <span className="text-sm font-semibold tracking-tight text-white">Helper</span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.14em] truncate" style={{ color: "var(--boeing-cyan-bright)" }}>
                Briefing Materials
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.6)" }}>
                Step {step} of {stepLabels.length}
              </span>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors"
                style={{ color: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.82)" }}
              >
                <X size={13} />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--surface-border)" }}>
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-2.5 flex items-center justify-between gap-4">
            <div className="w-24 shrink-0">
              {canGoBack && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1 pl-1.5 pr-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors"
                  style={{ color: "var(--text-secondary)", border: "1px solid var(--surface-border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--boeing-ice)"; e.currentTarget.style.color = "var(--boeing-blue)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)" }}
                >
                  <ChevronLeft size={14} />
                  <span className="hidden sm:inline">Back</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto">
              {stepLabels.map((label, i) => {
                const n = i + 1
                const reached = n <= step
                const active = n === step
                return (
                  <div key={label} className="flex items-center gap-1.5 md:gap-2 shrink-0">
                    {i > 0 && <span className="hidden md:block w-4 h-px" style={{ background: reached ? "var(--boeing-blue)" : "var(--surface-border)" }} />}
                    <span
                      className="rounded-full transition-colors"
                      style={{
                        width: active ? "0.5rem" : "0.375rem",
                        height: active ? "0.5rem" : "0.375rem",
                        background: reached ? "var(--boeing-blue)" : "#C5CDD4",
                        boxShadow: active ? "0 0 0 3px rgba(0, 51, 161, 0.15)" : undefined,
                      }}
                    />
                    <span
                      className="text-[11px] hidden lg:inline whitespace-nowrap"
                      style={{
                        color: active ? "var(--boeing-blue)" : reached ? "var(--text-secondary)" : "var(--text-muted)",
                        fontWeight: active ? 600 : 400,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="w-24 shrink-0 flex justify-end">
              {canGoForward && (
                <button
                  onClick={goForward}
                  className="flex items-center gap-1 pl-3 pr-1.5 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors text-white"
                  style={{ background: "var(--boeing-blue)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--boeing-blue-hover)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--boeing-blue)" }}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-10 md:py-14">
        {step === 1 && <CompanySelect onSelect={handleCompanySelect} />}
        {step === 2 && company && (
          <PersonSelect
            company={company}
            prefetchedContacts={prefetchedContacts}
            contactsLoading={contactsLoading}
            onSelect={handlePersonSelect}
          />
        )}
        {step === 3 && company && person && (
          <MeetingContext company={company} person={person} onSubmit={handleMeetingSubmit} />
        )}
        {step === 4 && company && person && (
          <AgentResearch
            company={company}
            person={person}
            meetingType={meetingType}
            prefetchedResult={prefetchedResult}
            prefetchInProgress={prefetchInProgress}
            onComplete={(r, notes) => {
              setResearch(r)
              setInternalNotes(notes)
              setStep(5)
            }}
          />
        )}
        {step === 5 && company && person && research && (
          <MeetingPaperView
            company={company}
            person={person}
            research={research}
            meetingType={meetingType}
            internalNotes={internalNotes}
            onContinue={() => setStep(6)}
          />
        )}
        {step === 6 && company && person && (
          <MaterialsHub
            company={company}
            person={person}
            meetingType={meetingType}
            countryName={research?.country?.name}
            onContinue={() => setStep(7)}
          />
        )}
        {step === 7 && company && person && (
          <HandoffScreen
            personName={person.name}
            companyName={company.name}
            meetingType={meetingType}
            onContinue={() => setStep(8)}
          />
        )}
        {step === 8 && company && person && research && (
          <MeetingReportView
            company={company}
            person={person}
            research={research}
            meetingType={meetingType}
            onFinish={onClose}
          />
        )}
      </div>
    </div>
  )
}
