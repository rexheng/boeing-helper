import "dotenv/config"
import express from "express"
import { researchHandler } from "../server/manus.js"
import { companySearchHandler } from "../server/companySearch.js"
import { companyContactsHandler } from "../server/apollo.js"
import { newsHandler } from "../server/news.js"
import { frameworksHandler } from "../server/frameworks.js"

if (!process.env.MANUS_API_KEY) {
  console.warn("Warning: MANUS_API_KEY is not set. Research and company search endpoints will not work.")
}

const app = express()

app.use(express.json({ limit: "1mb" }))
app.post("/api/company-search", companySearchHandler)
app.post("/api/research", researchHandler)
app.post("/api/company-contacts", companyContactsHandler)
app.get("/api/news", newsHandler)
app.post("/api/frameworks", frameworksHandler)

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "boeing-helper",
    groq: Boolean(process.env.GROQ_API_KEY),
    manus: Boolean(process.env.MANUS_API_KEY),
    apollo: Boolean(process.env.APOLLO_API_KEY),
  })
})

export default app
