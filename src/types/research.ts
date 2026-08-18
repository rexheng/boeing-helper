export type ResearchLane = "company" | "industry" | "country"

export type ResearchSourceKind =
  | "article"
  | "press"
  | "internal"
  | "website"
  | "report"
  | "speech"
  | "linkedin"
  | "metric"
  | "briefing"

export interface ResearchNewsItem {
  headline: string
  source: string
  date: string
  /** Direct URL to the originating filing, newsroom post, or IR page. */
  url?: string
}

export interface ResearchMetric {
  label: string
  value: string
  /** Citable origin for the figure — 10-K, newsroom, IR, not secondary encyclopedias. */
  source?: string
  url?: string
}

/**
 * Curated corpus node for the research inspector.
 * Open items should point at company filings, newsrooms, or IR.
 * Internal items are simulated Boeing account notes for the demo.
 */
export interface ResearchSource {
  id: string
  title: string
  publisher: string
  authors?: string
  kind: ResearchSourceKind
  classification: "open" | "internal" | "synthesized"
  url?: string
  date?: string
  snippet: string
  excerpt?: string
  lanes?: ResearchLane[]
}

export interface ResearchResult {
  person: {
    name: string
    title: string
    background: string
    linkedin_posts: { text: string; date: string }[]
    profile_overview: string
  }
  company: {
    overview: string
    recent_news: ResearchNewsItem[]
    key_metrics: ResearchMetric[]
    /** Optional extra corpus — official publications plus internal synthetic notes. */
    sources?: ResearchSource[]
  }
  industry: {
    trends: string[]
    competitive_context: string
  }
  country: {
    name: string
    overview: string
    priorities: string[]
    bilateral_context: string
    concerns: string[]
  }
}
