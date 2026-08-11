import type { Request, Response } from "express"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { XMLParser } from "fast-xml-parser"

interface NewsArticle {
  title: string
  link: string
  source: string
  pubDate: string
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const CACHE_DIR = path.resolve(__dirname, "../.cache/news")
const CACHE_TTL = 3_600_000 // 1 hour

// --- Cache layer (file-based with TTL) ---

function cacheKey(company: string): string {
  return company.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")
}

function readCache(key: string): NewsArticle[] | null {
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

function writeCache(key: string, articles: NewsArticle[]): void {
  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true })
    fs.writeFileSync(
      path.join(CACHE_DIR, `${key}.json`),
      JSON.stringify(articles, null, 2),
      "utf-8"
    )
  } catch (err) {
    console.error("[news-cache] Write failed:", err)
  }
}

// --- RSS fetch + parse ---

function buildRssUrl(company: string): string {
  const q = encodeURIComponent(
    `"${company}" source:"Financial Times" OR source:"Bloomberg" OR source:"Reuters" OR source:"Wall Street Journal"`
  )
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`
}

function parseRss(xml: string): NewsArticle[] {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" })
  const parsed = parser.parse(xml)

  const items = parsed?.rss?.channel?.item
  if (!items) return []

  const list = Array.isArray(items) ? items : [items]

  return list.slice(0, 5).map((item: Record<string, unknown>) => {
    // Source: <source url="https://...">Publisher Name</source>
    const sourceObj = item.source as Record<string, string> | string | undefined
    let source = "Unknown"
    let link = (item.link as string) || ""

    if (typeof sourceObj === "object" && sourceObj !== null) {
      source = sourceObj["#text"] || "Unknown"
      if (sourceObj["@_url"]) link = sourceObj["@_url"]
    } else if (typeof sourceObj === "string") {
      source = sourceObj
    }

    return {
      title: (item.title as string) || "",
      link,
      source,
      pubDate: (item.pubDate as string) || "",
    }
  })
}

// --- Express handler ---

export async function newsHandler(req: Request, res: Response): Promise<void> {
  const company = req.query.company as string

  if (!company) {
    res.json({ articles: [] })
    return
  }

  // Check cache
  const key = cacheKey(company)
  const cached = readCache(key)
  if (cached) {
    res.json({ articles: cached })
    return
  }

  // Fetch Google News RSS
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const rssRes = await fetch(buildRssUrl(company), { signal: controller.signal })
    clearTimeout(timeout)

    if (!rssRes.ok) {
      console.error(`[news] RSS fetch failed: ${rssRes.status}`)
      res.json({ articles: [] })
      return
    }

    const xml = await rssRes.text()
    const articles = parseRss(xml)

    writeCache(key, articles)
    res.json({ articles })
  } catch (err) {
    console.error("[news] Fetch error:", err)
    res.json({ articles: [] })
  }
}
