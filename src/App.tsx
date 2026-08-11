import { useState, lazy, Suspense } from "react"
import { Hero } from "./sections/Hero"
import { ToolShowcase } from "./sections/ToolShowcase"
import { UseCases } from "./sections/UseCases"
import { Workflows } from "./sections/Workflows"
import { DemoVideo } from "./sections/DemoVideo"
import { Security } from "./sections/Security"
import { Sources } from "./sections/Sources"
import { FAQ } from "./sections/FAQ"
import { Footer } from "./sections/Footer"

const DemoFlow = lazy(() => import("./demo/DemoFlow"))

export default function App() {
  const [showDemo, setShowDemo] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.has("step")
  })

  const startDemo = () => setShowDemo(true)

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-base)" }}>
      {!showDemo && (
        <>
          <main>
            <Hero onStartDemo={startDemo} />
            <ToolShowcase id="capabilities" />
            <UseCases id="use-cases" />
            <Workflows id="workflows" />
            <DemoVideo id="demo" onStartDemo={startDemo} />
            <Security id="trust" />
            <Sources id="sources" />
            <FAQ id="faq" />
          </main>
          <Footer />
        </>
      )}

      {showDemo && (
        <Suspense
          fallback={
            <div
              className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-muted)", color: "var(--boeing-navy)" }}
            >
              <div className="text-center">
                <p className="system-badge system-badge--dark justify-center">Boeing Helper</p>
                <p className="mt-3 text-lg font-light">Loading demo…</p>
              </div>
            </div>
          }
        >
          <DemoFlow onClose={() => setShowDemo(false)} />
        </Suspense>
      )}
    </div>
  )
}
