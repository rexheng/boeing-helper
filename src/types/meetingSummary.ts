export interface MeetingSummaryData {
  overallSentiment: "Excellent" | "Positive" | "Neutral" | "Needs Follow-up"
  meetingScore: number
  highlights: string[]
  clientSignals: { signal: string; interpretation: string }[]
  actionItems: { item: string; priority: "High" | "Medium" | "Low" }[]
  nextSteps: string[]
  relationshipNotes: string
  dealIntelligence: {
    opportunityAlignment: string
    competitiveAngle: string
    urgencyIndicators: string[]
  }
}
