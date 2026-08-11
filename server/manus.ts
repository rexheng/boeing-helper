import type { Request, Response } from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.resolve(__dirname, "../.cache/research")
const MANUS_BASE = "https://api.manus.ai/v1"

// --- Cache layer ---

function cacheKey(company: string, personName: string, personTitle: string): string {
  const slug = `${company}__${personName}__${personTitle}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
  return slug
}

function readCache(key: string): ResearchResult | null {
  try {
    const filePath = path.join(CACHE_DIR, `${key}.json`)
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writeCache(key: string, data: ResearchResult): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
    const filePath = path.join(CACHE_DIR, `${key}.json`)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8")
    console.log(`[cache] Saved: ${key}.json`)
  } catch (err) {
    console.error("[cache] Write failed:", err)
  }
}

// --- Prompt & fallback ---

function buildPrompt(company: string, personName: string, personTitle: string, meetingType: string): string {
  return `You are a consulting research analyst preparing a briefing for a meeting.

Company: ${company}
Contact: ${personName}, ${personTitle}
Meeting type: ${meetingType}

Research this company and person thoroughly using web search. Return your findings as a JSON object with this exact structure:

{
  "person": {
    "name": "...",
    "title": "...",
    "background": "2-3 sentence summary",
    "linkedin_posts": [
      { "text": "post content or summary", "date": "approximate date" }
    ],
    "profile_overview": "2-3 sentence synthesis connecting the person's recent activity, company trends, and strategic angles for this meeting"
  },
  "company": {
    "overview": "2-3 sentence company summary",
    "recent_news": [
      { "headline": "...", "source": "...", "date": "..." }
    ],
    "key_metrics": [
      { "label": "...", "value": "..." }
    ]
  },
  "industry": {
    "trends": ["trend 1", "trend 2", "trend 3"],
    "competitive_context": "1-2 sentences"
  }
}

Return ONLY the JSON object, no markdown fences or explanation.`
}

function buildFallback(company: string, personName: string, personTitle: string): ResearchResult {
  return {
    person: {
      name: personName,
      title: personTitle,
      background: `${personName} serves as ${personTitle} at ${company}.`,
      linkedin_posts: [],
      profile_overview: `${personName} is a key decision-maker at ${company}. Consider discussing recent developments and exploring collaboration opportunities.`,
    },
    company: {
      overview: `${company} is a significant player in their industry.`,
      recent_news: [],
      key_metrics: [],
    },
    industry: {
      trends: [
        "Digital transformation continues to reshape the industry",
        "Sustainability initiatives gaining momentum",
      ],
      competitive_context: "The competitive landscape is evolving with new market entrants.",
    },
  }
}

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

function extractJsonFromText(raw: string): ResearchResult | null {
  // 1. Try markdown fences
  const fenceMatch = raw.match(/```(?:json)?\n?([\s\S]*?)```/)
  if (fenceMatch) {
    try { return JSON.parse(fenceMatch[1].trim()) } catch { /* continue */ }
  }
  // 2. Try raw parse
  try { return JSON.parse(raw.trim()) } catch { /* continue */ }
  // 3. Find the outermost { ... } block (handles surrounding explanation text)
  const braceStart = raw.indexOf("{")
  const braceEnd = raw.lastIndexOf("}")
  if (braceStart !== -1 && braceEnd > braceStart) {
    try { return JSON.parse(raw.slice(braceStart, braceEnd + 1)) } catch { /* continue */ }
  }
  return null
}

// SSE streaming endpoint — streams real agent status + partial results
export async function researchHandler(req: Request, res: Response): Promise<void> {
  const { company, person, meetingType } = req.body as {
    company: string
    person: { name: string; title: string }
    meetingType: string
  }

  if (!company || !person?.name || !person?.title || !meetingType) {
    res.status(400).json({ error: "Missing required fields: company, person.name, person.title, meetingType" })
    return
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

  const key = cacheKey(company, person.name, person.title)
  const fallback = buildFallback(company, person.name, person.title)

  // --- Check cache first ---
  const cached = readCache(key)
  if (cached) {
    console.log(`[cache] HIT: ${key}`)
    sendEvent("status", { message: "Loading cached research..." })
    await sleep(500)
    sendEvent("status", { message: `Found previous research for ${person.name}` })
    await sleep(500)
    sendEvent("agent_message", { message: `Cached briefing for ${person.name} at ${company}`, index: 0 })
    await sleep(300)
    sendEvent("result", { data: cached, isFallback: false, fromCache: true })
    res.end()
    return
  }

  console.log(`[cache] MISS: ${key} — calling Manus API`)

  const prompt = buildPrompt(company, person.name, person.title, meetingType)

  try {
    sendEvent("status", { message: "Creating research task..." })

    const createRes = await fetch(`${MANUS_BASE}/tasks`, {
      method: "POST",
      headers: manusHeaders(),
      body: JSON.stringify({ prompt, mode: "agent" }),
    })

    if (!createRes.ok) {
      const errText = await createRes.text()
      console.error("Manus task creation failed:", createRes.status, errText)
      sendEvent("result", { data: fallback, isFallback: true })
      res.end()
      return
    }

    const createData = (await createRes.json()) as { task_id?: string; id?: string }
    const taskId = createData.task_id || createData.id

    if (!taskId) {
      console.error("No task ID in Manus response:", createData)
      sendEvent("result", { data: fallback, isFallback: true })
      res.end()
      return
    }

    sendEvent("status", { message: "Manus agent started. Researching..." })

    const MAX_POLLS = 120
    const POLL_INTERVAL = 1500
    let lastSeenMessages = 0

    for (let i = 0; i < MAX_POLLS; i++) {
      await sleep(POLL_INTERVAL)

      const pollRes = await fetch(`${MANUS_BASE}/tasks/${taskId}`, {
        method: "GET",
        headers: manusHeaders(),
      })

      if (!pollRes.ok) {
        console.error("Poll failed:", pollRes.status)
        continue
      }

      const taskStatus = (await pollRes.json()) as {
        status?: string
        output?: Array<{
          role: string
          content: Array<{ type: string; text?: string }>
        }>
      }

      const status = taskStatus.status?.toLowerCase()

      // Stream status updates
      sendEvent("status", { message: `Agent status: ${status || "working"}`, agentStatus: status })

      // Stream new assistant messages as they appear
      const output = taskStatus.output
      if (output && Array.isArray(output)) {
        const assistantMessages = output.filter((m) => m.role === "assistant")
        if (assistantMessages.length > lastSeenMessages) {
          for (let j = lastSeenMessages; j < assistantMessages.length; j++) {
            const msg = assistantMessages[j]
            const textBlocks = msg.content.filter(
              (b) => b.type === "output_text" || b.type === "text"
            )
            const text = textBlocks.map((b) => b.text || "").join("")
            if (text.trim()) {
              const preview = text.length > 200 ? text.slice(0, 200) + "..." : text
              sendEvent("agent_message", { message: preview, index: j })
            }
          }
          lastSeenMessages = assistantMessages.length
        }
      }

      if (status === "failed" || status === "error") {
        console.error("Manus task failed:", taskStatus)
        sendEvent("result", { data: fallback, isFallback: true })
        res.end()
        return
      }

      if (status !== "completed" && status !== "done" && status !== "finished") {
        continue
      }

      // Parse final result
      if (!output || !Array.isArray(output)) {
        sendEvent("result", { data: fallback, isFallback: true })
        res.end()
        return
      }

      const assistantMessages = output.filter((m) => m.role === "assistant")
      if (assistantMessages.length === 0) {
        sendEvent("result", { data: fallback, isFallback: true })
        res.end()
        return
      }

      const lastMessage = assistantMessages[assistantMessages.length - 1]
      const textBlocks = lastMessage.content.filter(
        (b) => b.type === "output_text" || b.type === "text"
      )
      const fullText = textBlocks.map((b) => b.text || "").join("")

      if (!fullText.trim()) {
        sendEvent("result", { data: fallback, isFallback: true })
        res.end()
        return
      }

      const parsed = extractJsonFromText(fullText)
      if (parsed) {
        // Cache successful result to disk
        writeCache(key, parsed)
        sendEvent("result", { data: parsed, isFallback: false })
      } else {
        console.error("JSON parse failed, raw:", fullText.slice(0, 500))
        sendEvent("result", { data: fallback, isFallback: true })
      }
      res.end()
      return
    }

    sendEvent("result", { data: fallback, isFallback: true })
    res.end()
  } catch (err) {
    console.error("Research handler error:", err)
    sendEvent("result", { data: fallback, isFallback: true })
    res.end()
  }
}
