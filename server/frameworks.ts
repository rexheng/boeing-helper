import type { Request, Response } from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import Groq from "groq-sdk"

interface ResearchResult {
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
}

interface FrameworksData {
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  porters: {
    competitiveRivalry: { level: string; factors: string[] }
    threatOfNewEntrants: { level: string; factors: string[] }
    bargainingPowerBuyers: { level: string; factors: string[] }
    bargainingPowerSuppliers: { level: string; factors: string[] }
    threatOfSubstitutes: { level: string; factors: string[] }
  }
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.resolve(__dirname, "../.cache/frameworks")
const CACHE_TTL = 3_600_000 // 1 hour

// --- Cache layer (compound key with TTL) ---

function cacheKey(company: string, personName: string, personTitle: string): string {
  const slug = `${company}__${personName}__${personTitle}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
  return slug
}

function readCache(key: string): FrameworksData | null {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`)
    if (!fs.existsSync(filePath)) return null
    const stats = fs.statSync(filePath)
    if (Date.now() - stats.mtimeMs > CACHE_TTL) return null // stale
    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch {
    return null
  }
}

function writeCache(key: string, data: FrameworksData): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
    fs.writeFileSync(
      path.join(CACHE_DIR, `${key}.json`),
      JSON.stringify(data, null, 2),
      "utf-8"
    )
  } catch (err) {
    console.error("[frameworks-cache] Write failed:", err)
  }
}

// --- JSON extraction (same pattern as manus.ts) ---

function extractJson(raw: string): FrameworksData | null {
  // 1. Try markdown fences
  const fenceMatch = raw.match(/```(?:json)?\n?([\s\S]*?)```/)
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()) } catch { /* continue */ }
  }
  // 2. Try raw parse
  try { return JSON.parse(raw.trim()) } catch { /* continue */ }
  // 3. Find outermost { ... } block
  const braceStart = raw.indexOf("{")
  const braceEnd = raw.lastIndexOf("}")
  if (braceStart !== -1 && braceEnd > braceStart) {
    try { return JSON.parse(raw.slice(braceStart, braceEnd + 1)) } catch { /* continue */ }
  }
  return null
}

// --- Prompt builder ---

function buildPrompt(companyName: string, research: ResearchResult): string {
  const metrics = research.company.key_metrics.map(m => `${m.label}: ${m.value}`).join(", ")
  const news = research.company.recent_news.map(n => n.headline).join("; ")
  const trends = research.industry.trends.join(", ")

  return `You are a senior management consultant. Analyze the following company research and produce two strategic frameworks.

Company: ${companyName}
Overview: ${research.company.overview}
Key Metrics: ${metrics || "N/A"}
Recent News: ${news || "N/A"}
Industry Trends: ${trends || "N/A"}
Competitive Context: ${research.industry.competitive_context || "N/A"}
Contact Background: ${research.person.background || "N/A"}

Return a JSON object with this exact structure:
{
  "swot": {
    "strengths": ["2-3 specific strengths based on the data"],
    "weaknesses": ["2-3 specific weaknesses based on the data"],
    "opportunities": ["2-3 specific opportunities based on the data"],
    "threats": ["2-3 specific threats based on the data"]
  },
  "porters": {
    "competitiveRivalry": { "level": "High|Medium|Low", "factors": ["1-2 specific factors"] },
    "threatOfNewEntrants": { "level": "High|Medium|Low", "factors": ["1-2 specific factors"] },
    "bargainingPowerBuyers": { "level": "High|Medium|Low", "factors": ["1-2 specific factors"] },
    "bargainingPowerSuppliers": { "level": "High|Medium|Low", "factors": ["1-2 specific factors"] },
    "threatOfSubstitutes": { "level": "High|Medium|Low", "factors": ["1-2 specific factors"] }
  }
}

Each bullet point should be specific to this company — no generic statements. Keep each bullet under 15 words.
Return ONLY the JSON object.`
}

// --- Express handler ---

export async function frameworksHandler(req: Request, res: Response): Promise<void> {
  const { companyName, research } = req.body as {
    companyName: string
    research: ResearchResult
  }

  if (!companyName || !research) {
    res.status(400).json({ error: "Missing required fields: companyName, research" })
    return
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: "AI service not configured" })
    return
  }

  // Check cache
  const key = cacheKey(companyName, research.person.name, research.person.title)
  const cached = readCache(key)
  if (cached) {
    res.json(cached)
    return
  }

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "user", content: buildPrompt(companyName, research) },
      ],
      temperature: 0.3,
      max_tokens: 800,
    })

    const raw = completion.choices[0]?.message?.content || ""
    const parsed = extractJson(raw)

    if (!parsed) {
      console.error("[frameworks] JSON parse failed, raw:", raw.slice(0, 500))
      res.status(500).json({ error: "Failed to parse framework analysis" })
      return
    }

    writeCache(key, parsed)
    res.json(parsed)
  } catch (err) {
    console.error("[frameworks] Groq error:", err)
    res.status(500).json({ error: "Failed to generate frameworks" })
  }
}
