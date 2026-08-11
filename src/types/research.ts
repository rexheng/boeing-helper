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
    recent_news: { headline: string; source: string; date: string }[]
    key_metrics: { label: string; value: string }[]
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
