export interface FrameworksData {
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  porters: {
    competitiveRivalry: { level: "High" | "Medium" | "Low"; factors: string[] }
    threatOfNewEntrants: { level: "High" | "Medium" | "Low"; factors: string[] }
    bargainingPowerBuyers: { level: "High" | "Medium" | "Low"; factors: string[] }
    bargainingPowerSuppliers: { level: "High" | "Medium" | "Low"; factors: string[] }
    threatOfSubstitutes: { level: "High" | "Medium" | "Low"; factors: string[] }
  }
}
