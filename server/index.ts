import "dotenv/config"
import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import { researchHandler } from "./manus.js"
import { companySearchHandler } from "./companySearch.js"
import { companyContactsHandler } from "./apollo.js"
import { copilotChatHandler } from "./groqChat.js"
import { newsHandler } from "./news.js"
import { frameworksHandler } from "./frameworks.js"
import { meetingSummaryHandler } from "./meetingSummary.js"

if (!process.env.MANUS_API_KEY) {
  console.warn("Warning: MANUS_API_KEY is not set. Research and company search endpoints will not work.")
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.json({ limit: "1mb" }))
app.post("/api/company-search", companySearchHandler)
app.post("/api/research", researchHandler)
app.post("/api/company-contacts", companyContactsHandler)
app.post("/api/copilot-chat", copilotChatHandler)
app.get("/api/news", newsHandler)
app.post("/api/frameworks", frameworksHandler)
app.post("/api/meeting-summary", meetingSummaryHandler)

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "boeing-helper",
    groq: Boolean(process.env.GROQ_API_KEY),
    manus: Boolean(process.env.MANUS_API_KEY),
    apollo: Boolean(process.env.APOLLO_API_KEY),
  })
})

const isVercel = Boolean(process.env.VERCEL)

if (!isVercel) {
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve(__dirname, "../dist")
    app.use(express.static(distPath))
    app.get("*", (_req, res) => res.sendFile("index.html", { root: distPath }))
  } else {
    const { createServer: createViteServer } = await import("vite")
    const vite = await createViteServer({
      server: { middlewareMode: true, allowedHosts: true },
      appType: "spa",
    })
    app.use(vite.middlewares)
  }

  const port = process.env.PORT || 3000
  app.listen(port, () => console.log(`Server on :${port}`))
}

export default app
