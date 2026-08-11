import type { Request, Response } from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.resolve(__dirname, "../.cache/company-search")
const MANUS_BASE = "https://api.manus.ai/v1"

function manusHeaders(): Record<string, string> {
  return {
    accept: "application/json",
    "content-type": "application/json",
    API_KEY: process.env.MANUS_API_KEY!,
    Authorization: `Bearer ${process.env.MANUS_API_KEY}`,
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface CompanyResult {
  name: string
  domain: string
  tagline: string
  overview: string
  industry: string
}

function searchCacheKey(query: string): string {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")
}

function readSearchCache(key: string): CompanyResult | null {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`)
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch {
    return null
  }
}

function writeSearchCache(key: string, data: CompanyResult): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
    fs.writeFileSync(path.join(CACHE_DIR, `${key}.json`), JSON.stringify(data, null, 2), "utf-8")
    console.log(`[company-search-cache] Saved: ${key}.json`)
  } catch (err) {
    console.error("[company-search-cache] Write failed:", err)
  }
}

function extractJson(raw: string): unknown | null {
  // 1. Try markdown fences
  const fenceMatch = raw.match(/```(?:json)?\n?([\s\S]*?)```/)
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()) } catch { /* continue */ }
  }
  // 2. Try raw parse
  try { return JSON.parse(raw.trim()) } catch { /* continue */ }
  // 3. Find first { ... } block (handles surrounding text)
  const braceMatch = raw.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]) } catch { /* continue */ }
  }
  return null
}

export async function companySearchHandler(req: Request, res: Response): Promise<void> {
  const { query } = req.body as { query: string }

  if (!query) {
    res.status(400).json({ error: "Missing query" })
    return
  }

  const fallback = {
    name: query,
    domain: query.toLowerCase().replace(/[^a-z0-9]/g, "") + ".com",
    tagline: `${query} — Company`,
    overview: "",
    industry: "",
  }

  // Set up SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  function sendEvent(type: string, data: unknown) {
    res.write(`data: ${JSON.stringify({ type, ...data as Record<string, unknown> })}\n\n`)
  }

  // Check cache first
  const cacheK = searchCacheKey(query)
  const cached = readSearchCache(cacheK)
  if (cached) {
    sendEvent("status", { message: "Loading cached result..." })
    await sleep(300)
    sendEvent("result", { data: cached })
    res.end()
    return
  }

  // If no API key, return fallback immediately
  if (!process.env.MANUS_API_KEY) {
    sendEvent("status", { message: "No API key configured — using best guess" })
    await sleep(300)
    sendEvent("result", { data: fallback })
    res.end()
    return
  }

  try {
    sendEvent("status", { message: `Searching for "${query}"...` })

    const createRes = await fetch(`${MANUS_BASE}/tasks`, {
      method: "POST",
      headers: manusHeaders(),
      body: JSON.stringify({
        prompt: `Search the web for the company "${query}". Research them thoroughly — their website, recent news, product offerings, and market position.

Return a JSON object with exactly these fields:
{
  "name": "Official company name",
  "domain": "company-website.com",
  "tagline": "One sentence describing what the company does and their market position",
  "overview": "2-3 sentence company summary covering what they do, their scale, and key differentiators",
  "industry": "The primary industry or sector they operate in"
}
Return ONLY the JSON object, no markdown fences or explanation.`,
        mode: "agent",
      }),
    })

    if (!createRes.ok) {
      console.error("Manus company search creation failed:", createRes.status)
      sendEvent("status", { message: "Search agent failed to start" })
      sendEvent("result", { data: fallback })
      res.end()
      return
    }

    const createData = (await createRes.json()) as { task_id?: string; id?: string }
    const taskId = createData.task_id || createData.id

    if (!taskId) {
      sendEvent("result", { data: fallback })
      res.end()
      return
    }

    sendEvent("status", { message: "Agent started — searching the web..." })

    let lastSeenMessages = 0

    // Poll for result (max 90 seconds)
    for (let i = 0; i < 30; i++) {
      await sleep(1500)

      const pollRes = await fetch(`${MANUS_BASE}/tasks/${taskId}`, {
        method: "GET",
        headers: manusHeaders(),
      })

      if (!pollRes.ok) continue

      const taskStatus = (await pollRes.json()) as {
        status?: string
        output?: Array<{ role: string; content: Array<{ type: string; text?: string }> }>
      }

      const status = taskStatus.status?.toLowerCase()

      // Stream status
      const statusMessages: Record<string, string> = {
        running: "Agent is researching...",
        working: "Agent is researching...",
        queued: "Queued — waiting for agent...",
        pending: "Queued — waiting for agent...",
      }
      sendEvent("status", { message: statusMessages[status || ""] || `Agent: ${status || "working"}` })

      // Stream new agent messages as traces
      const output = taskStatus.output
      if (output && Array.isArray(output)) {
        const assistantMessages = output.filter((m) => m.role === "assistant")
        if (assistantMessages.length > lastSeenMessages) {
          for (let j = lastSeenMessages; j < assistantMessages.length; j++) {
            const msg = assistantMessages[j]
            const textBlocks = msg.content.filter((b) => b.type === "output_text" || b.type === "text")
            const text = textBlocks.map((b) => b.text || "").join("")
            if (text.trim()) {
              const preview = text.length > 150 ? text.slice(0, 150) + "..." : text
              sendEvent("trace", { message: preview })
            }
          }
          lastSeenMessages = assistantMessages.length
        }
      }

      if (status === "failed" || status === "error") break

      if (status === "completed" || status === "done" || status === "finished") {
        if (output && Array.isArray(output)) {
          const assistantMsgs = output.filter((m) => m.role === "assistant")
          const lastMsg = assistantMsgs[assistantMsgs.length - 1]
          if (lastMsg) {
            const textBlocks = lastMsg.content.filter((b) => b.type === "output_text" || b.type === "text")
            const text = textBlocks.map((b) => b.text || "").join("")
            const parsed = extractJson(text)
            if (parsed && typeof parsed === "object" && "name" in (parsed as Record<string, unknown>)) {
              writeSearchCache(cacheK, parsed as CompanyResult)
              sendEvent("status", { message: "Company found!" })
              sendEvent("result", { data: parsed })
              res.end()
              return
            }
            console.error("Company search JSON parse failed, raw:", text.slice(0, 500))
          }
        }
        break
      }
    }

    sendEvent("status", { message: "Could not find detailed info — using best guess" })
    sendEvent("result", { data: fallback })
    res.end()
  } catch (err) {
    console.error("Company search error:", err)
    sendEvent("status", { message: "Search error — using best guess" })
    sendEvent("result", { data: fallback })
    res.end()
  }
}
