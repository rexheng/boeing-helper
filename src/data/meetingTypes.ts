export interface MeetingType {
  id: string
  label: string
  subtitle: string
  icon: string
}

/**
 * Boeing Helper context types — IBD / trip-book workflows (not generic SaaS meetings).
 *
 * Proposed set (aligned to how Regional Integrators actually prep):
 * 1. Air-show bilateral — chalet / stand engagement at a show
 * 2. Stakeholder biography — executive bio + RAA pack for a principal
 * 3. Programme status review — delivery / sustainment cadence
 * 4. Country / ministry engagement — government protocol brief
 * 5. Pre-travel trip book — full materials lock before wheels-up
 * 6. Other — freeform
 */
export const meetingTypes: MeetingType[] = [
  {
    id: "airshow",
    label: "Air-Show Bilateral",
    subtitle: "Chalet or stand meeting — delegation background, programme status, talking points",
    icon: "plane",
  },
  {
    id: "biography",
    label: "Stakeholder Biography Prep",
    subtitle: "Executive bio, phonetic, RAA, and key messages for the principal",
    icon: "users",
  },
  {
    id: "programme",
    label: "Programme Status Review",
    subtitle: "Deliveries, sustainment, open actions, and next milestone owners",
    icon: "clipboard-check",
  },
  {
    id: "country",
    label: "Country / Ministry Engagement",
    subtitle: "Government protocol, bilateral context, and ministry priorities",
    icon: "handshake",
  },
  {
    id: "trip-book",
    label: "Pre-Travel Trip Book",
    subtitle: "Lock papers, attendee dashboard, and materials before travel",
    icon: "presentation",
  },
  {
    id: "other",
    label: "Other",
    subtitle: "Enter a custom meeting type",
    icon: "message-circle",
  },
]
