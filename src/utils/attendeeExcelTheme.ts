/** Shared visual tokens — preview HTML and Excel export must stay identical. */
export const EXCEL = {
  blue: "0033A1",
  navy: "0A2240",
  steel: "1F4F8A",
  green: "2F6B4F",
  revised: "8B1E2D",
  grid: "7A8490",
  zebra: "EEF2F6",
  legend: "D6DEE8",
  white: "FFFFFF",
  text: "222222",
  textMuted: "555555",
  black: "000000",
} as const

export const EXCEL_ACCENT: Record<"navy" | "blue" | "steel" | "green", string> = {
  navy: EXCEL.navy,
  blue: EXCEL.blue,
  steel: EXCEL.steel,
  green: EXCEL.green,
}

export const EXCEL_SUB: Record<"navy" | "blue" | "steel" | "green", string> = {
  navy: "163A63",
  blue: "1A4A9C",
  steel: "2A5F9E",
  green: "3D8B63",
}

/** Character widths matching preview ratios Role 28% · Name 36% · Org 26% · I/D/L 10% */
export const EXCEL_COL_WIDTHS = Array.from({ length: 16 }, (_, i) => {
  const w = i % 4
  // Quarter ≈ 55 chars → 15.4 / 19.8 / 14.3 / 5.5
  return w === 0 ? 15.5 : w === 1 ? 20 : w === 2 ? 14.5 : 5.5
})

export const EXCEL_FONT = "Arial"
