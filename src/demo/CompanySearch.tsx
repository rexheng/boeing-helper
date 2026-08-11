import { useState, useCallback, useRef } from "react"
import { Search, Loader2 } from "lucide-react"
import type { Company } from "../data/companies"

interface Props {
  onSelect: (company: Company) => void
}

export function CompanySearch({ onSelect }: Props) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Company | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [traces, setTraces] = useState<string[]>([])
  const traceEndRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setStatusMessage(null)
    setTraces([])

    try {
      const res = await fetch("/api/company-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim() }),
      })

      if (!res.ok || !res.body) throw new Error("Search failed")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          try {
            const event = JSON.parse(line.slice(6))

            if (event.type === "status") {
              setStatusMessage(event.message)
            } else if (event.type === "trace") {
              setTraces((prev) => [...prev, event.message])
              setTimeout(() => traceEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50)
            } else if (event.type === "result") {
              const data = event.data
              setResult({
                id: `custom-${Date.now()}`,
                name: data.name,
                domain: data.domain,
                tagline: data.tagline,
                overview: data.overview || "",
                industry: data.industry || "",
                logoUrl: `https://www.google.com/s2/favicons?domain=${data.domain}&sz=128`,
                isCustom: true,
              })
            }
          } catch { /* skip malformed events */ }
        }
      }
    } catch {
      setError("Could not find company. Try again.")
    } finally {
      setLoading(false)
      setStatusMessage(null)
    }
  }, [query])

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search any airline, ministry, or air force..."
            className="w-full h-12 px-4 pl-10 rounded outline-none transition-colors text-sm"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--surface-border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--boeing-blue)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0, 51, 161, 0.12)" }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--surface-border)"; e.currentTarget.style.boxShadow = "none" }}
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="h-12 px-6 rounded-full text-sm font-medium uppercase tracking-[0.08em] text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
          style={{ background: "var(--boeing-blue)", opacity: loading || !query.trim() ? 0.4 : 1 }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Search"}
        </button>
      </div>

      {/* Live SSE trace feed */}
      {loading && (
        <div
          className="bh-panel p-3 space-y-2"
          style={{ animation: "fadeInUp 0.3s ease-out" }}
        >
          {/* Status line */}
          {statusMessage && (
            <div className="flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" style={{ color: "var(--boeing-blue)" }} />
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {statusMessage}
              </span>
            </div>
          )}

          {/* Agent trace messages */}
          {traces.length > 0 && (
            <div
              className="max-h-28 overflow-y-auto space-y-1 pt-1"
              style={{ borderTop: "1px solid var(--surface-border)", scrollbarWidth: "thin" }}
            >
              {traces.map((trace, i) => (
                <p
                  key={i}
                  className="text-[11px] font-mono pl-3"
                  style={{ color: "var(--text-muted)", borderLeft: "2px solid var(--boeing-ice)", animation: "fadeInUp 0.2s ease-out" }}
                >
                  {trace}
                </p>
              ))}
              <div ref={traceEndRef} />
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-center" style={{ color: "#B91C1C" }}>{error}</p>}

      {/* Result card — same style as hardcoded company cards */}
      {result && (
        <button
          onClick={() => onSelect(result)}
          className="w-full flex items-center gap-4 p-5 glass-card text-left cursor-pointer"
          style={{ animation: "fadeInUp 0.4s ease-out" }}
        >
          <div
            className="w-12 h-12 rounded flex items-center justify-center overflow-hidden flex-shrink-0"
            style={{ background: "#fff", border: "1px solid var(--surface-border)" }}
          >
            <img
              src={result.logoUrl}
              alt={result.name}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                target.parentElement!.innerHTML = `<span style="color:#0033A1" class="font-bold text-lg">${result.name[0]}</span>`
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>{result.name}</h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{result.tagline}</p>
            {result.overview && (
              <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>{result.overview}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="system-badge system-badge--dark">Custom</span>
            {result.industry && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{result.industry}</span>}
          </div>
        </button>
      )}
    </div>
  )
}
