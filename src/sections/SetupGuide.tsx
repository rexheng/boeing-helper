import { useState } from "react"
import { SectionHeader } from "../components/SectionHeader"
import { CodeBlock } from "../components/CodeBlock"
import { useInView } from "../hooks/useInView"

type Tab = "demo" | "full"

export function SetupGuide() {
  const [tab, setTab] = useState<Tab>("demo")
  const { ref, visible } = useInView()

  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} py-24`}>
      <SectionHeader title="Get Started in 60 Seconds" />

      <div className="glass-panel p-8 md:p-12">
        {/* Tab toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <button
            onClick={() => setTab("demo")}
            className={`px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === "demo"
                ? "btn-primary !h-auto !py-2 !px-5 !text-sm"
                : "btn-secondary !h-auto !py-2 !px-5 !text-sm"
            }`}
          >
            Quick Demo
          </button>
          <button
            onClick={() => setTab("full")}
            className={`px-5 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              tab === "full"
                ? "btn-primary !h-auto !py-2 !px-5 !text-sm"
                : "btn-secondary !h-auto !py-2 !px-5 !text-sm"
            }`}
          >
            Full Mode
          </button>
        </div>

        {/* Tab content */}
        <div className="max-w-2xl mx-auto">
          {tab === "demo" && (
            <div className="space-y-4">
              <CodeBlock>
                {`git clone https://github.com/sixandeight/manusman.git
cd manusman1
npm install
echo "DEMO_MODE=true" > .env
npm start`}
              </CodeBlock>
              <p className="text-[var(--text-tech)] text-sm">
                Demo mode uses training data — no API keys needed.
              </p>
            </div>
          )}

          {tab === "full" && (
            <div className="space-y-4">
              <CodeBlock>
                {`git clone https://github.com/sixandeight/manusman.git
cd manusman1
npm install`}
              </CodeBlock>

              <p className="text-[var(--text-secondary)]">
                Create a <code className="text-white font-mono text-sm">.env</code> file:
              </p>

              <CodeBlock>
                {`GROQ_API_KEY=your_key      # optional — meeting AI (copilot, summary)
MANUS_API_KEY=your_key     # manus.ai — research agent
KIMI_API_KEY=your_key      # moonshot.ai — chat & vision`}
              </CodeBlock>

              <CodeBlock>{`npm start`}</CodeBlock>
            </div>
          )}

          <p className="text-[var(--text-tech)] text-sm text-center mt-8">
            Runs on Windows, macOS, and Linux. Requires Node.js 18+.
          </p>
        </div>
      </div>
    </div>
  )
}
