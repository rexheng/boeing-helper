export interface MeetingType {
  id: string
  label: string
  subtitle: string
  icon: string
}

export const meetingTypes: MeetingType[] = [
  { id: "airshow", label: "Air Show Briefing", subtitle: "Chalet or stand meeting — delegation background, programme status, talking points", icon: "plane" },
  { id: "first-call", label: "First Call / Introduction", subtitle: "First engagement — establish relationship, understand priorities", icon: "handshake" },
  { id: "follow-up", label: "Follow-up Meeting", subtitle: "Continue an open thread — commitments made, questions outstanding", icon: "repeat" },
  { id: "check-in", label: "Progress Check-in", subtitle: "Programme status — deliveries, sustainment, issues to surface", icon: "clipboard-check" },
  { id: "quarterly", label: "Quarterly Review", subtitle: "Formal cadence — performance against commitments, next-quarter asks", icon: "bar-chart" },
  { id: "other", label: "Other", subtitle: "Describe your meeting context", icon: "message-circle" },
]
