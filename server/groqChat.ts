import type { Request, Response } from "express"
import Groq from "groq-sdk"

interface ChatRequest {
  messages: { role: "user" | "assistant"; content: string }[]
  context: {
    personName: string
    personTitle: string
    companyName: string
    meetingType: string
    companyOverview: string
    keyMetrics: string[]
    recentNews: string[]
    industryTrends: string[]
    competitiveContext: string
    personBackground: string
    profileOverview: string
    linkedinPosts: string[]
    internalNotes: string
  }
}

function buildSystemPrompt(ctx: ChatRequest["context"]): string {
  return `You are a real-time meeting copilot. The user is currently in a live ${ctx.meetingType} meeting with ${ctx.personName} (${ctx.personTitle}) at ${ctx.companyName}. Answer concisely — they're reading your responses while talking.

## Research Brief

**Person — ${ctx.personName}**
Title: ${ctx.personTitle}
Background: ${ctx.personBackground}
Profile overview: ${ctx.profileOverview}
${ctx.linkedinPosts.length > 0 ? `Recent LinkedIn posts:\n${ctx.linkedinPosts.map((p, i) => `  ${i + 1}. ${p}`).join("\n")}` : ""}

**Company — ${ctx.companyName}**
${ctx.companyOverview}
${ctx.keyMetrics.length > 0 ? `Key metrics: ${ctx.keyMetrics.join(", ")}` : ""}
${ctx.recentNews.length > 0 ? `Recent news:\n${ctx.recentNews.map((n, i) => `  ${i + 1}. ${n}`).join("\n")}` : ""}

**Industry**
Trends: ${ctx.industryTrends.join("; ") || "N/A"}
Competitive context: ${ctx.competitiveContext || "N/A"}

${ctx.internalNotes ? `**User's Internal Notes**\n${ctx.internalNotes}` : ""}

## Guidelines
- Keep responses SHORT (2-4 sentences max). The user is mid-conversation.
- Be direct and actionable. No preamble.
- If asked for a question to ask, give ONE specific question.
- If asked for a talking point, give ONE concise point with a supporting fact.
- Reference specific data from the research when relevant.
- You can suggest what to say next, surface relevant stats, or provide quick context.`
}

export async function copilotChatHandler(req: Request, res: Response): Promise<void> {
  const { messages, context } = req.body as ChatRequest

  if (!messages || !context) {
    res.status(400).json({ error: "Missing messages or context" })
    return
  }

  if (!process.env.GROQ_API_KEY) {
    res.status(500).json({ error: "AI service not configured" })
    return
  }

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY })
  const systemPrompt = buildSystemPrompt(context)

  // Set up SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  })

  try {
    const stream = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      stream: true,
      max_tokens: 300,
      temperature: 0.7,
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) {
        res.write(`data: ${JSON.stringify({ type: "delta", content: delta })}\n\n`)
      }
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`)
    res.end()
  } catch (err) {
    console.error("Groq chat error:", err)
    res.write(`data: ${JSON.stringify({ type: "error", content: "Failed to get response. Try again." })}\n\n`)
    res.end()
  }
}
