import { mindefSgResearch } from "./mindef-sg"
import { modIdResearch } from "./mod-id"
import { rtafResearch } from "./rtaf"
import { rmafResearch } from "./rmaf"
import { siaResearch } from "./sia"
import { garudaResearch } from "./garuda"
import { vietnamCaaResearch } from "./vietnam-caa"
import { pafResearch } from "./paf"
import { americanResearch } from "./american"
import { deltaResearch } from "./delta"
import type { ResearchResult } from "../../types/research"

const allResearch: Record<string, Record<string, ResearchResult>> = {
  "mindef-sg": mindefSgResearch,
  "mod-id": modIdResearch,
  rtaf: rtafResearch,
  rmaf: rmafResearch,
  sia: siaResearch,
  garuda: garudaResearch,
  "vietnam-caa": vietnamCaaResearch,
  paf: pafResearch,
  american: americanResearch,
  delta: deltaResearch,
}

export function getHardcodedResearch(companyId: string, personId: string): ResearchResult | null {
  return allResearch[companyId]?.[personId] ?? null
}
