import { SectionHeader } from "../components/SectionHeader"
import { useInView } from "../hooks/useInView"

function Tile({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="glass-card p-4 h-40 flex flex-col justify-between hover:glow">
      <div className="flex-1 flex flex-col items-center justify-center">{children}</div>
      <div className="text-[var(--text-tech)] text-xs text-center mt-2">{label}</div>
    </div>
  )
}

function StatCard() {
  const bars = [30, 50, 70, 90]
  return (
    <Tile label="Stat Card">
      <div className="text-xl font-bold text-brand-primary">$4.2M</div>
      <div className="flex items-end gap-1 mt-2 h-6">
        {bars.map((h, i) => (
          <div
            key={i}
            className="w-3 bg-brand-primary/50 rounded-t"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </Tile>
  )
}

function Chart() {
  const bars = [
    { h: 40, label: "Q1" },
    { h: 60, label: "Q2" },
    { h: 70, label: "Q3" },
    { h: 95, label: "Q4" },
  ]
  return (
    <Tile label="Chart">
      <div className="flex items-end gap-2 h-14">
        {bars.map((b) => (
          <div key={b.label} className="flex flex-col items-center">
            <div
              className="w-5 bg-brand-primary rounded-t"
              style={{ height: `${b.h}%` }}
            />
            <span className="text-[10px] text-[var(--text-tech)] mt-1">{b.label}</span>
          </div>
        ))}
      </div>
    </Tile>
  )
}

function Comparison() {
  return (
    <Tile label="Comparison">
      <div className="w-full space-y-2 px-1">
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-[var(--text-secondary)]">Us</span>
            <span className="text-[var(--text-tech)]">78%</span>
          </div>
          <div className="w-full h-2 bg-[var(--bg-surface-2)] rounded overflow-hidden">
            <div className="h-full bg-brand-primary rounded" style={{ width: "78%" }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-[var(--text-secondary)]">Them</span>
            <span className="text-[var(--text-tech)]">52%</span>
          </div>
          <div className="w-full h-2 bg-[var(--bg-surface-2)] rounded overflow-hidden">
            <div className="h-full bg-brand-fringe rounded" style={{ width: "52%" }} />
          </div>
        </div>
      </div>
    </Tile>
  )
}

function Profile() {
  return (
    <Tile label="Profile">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold">
          S
        </div>
        <div className="text-sm text-white mt-1.5">Sarah Chen</div>
        <div className="text-xs text-[var(--text-tech)]">VP Sales</div>
      </div>
    </Tile>
  )
}

function Verdict() {
  return (
    <Tile label="Verdict">
      <div className="flex flex-col items-center">
        <span className="bg-brand-primary/20 text-brand-primary text-sm font-bold px-3 py-1 rounded">
          TRUE
        </span>
        <span className="text-xs text-[var(--text-tech)] mt-2">92% confidence</span>
      </div>
    </Tile>
  )
}

function Checklist() {
  const items = [
    { color: "bg-brand-primary", checked: true },
    { color: "bg-brand-hover", checked: true },
    { color: "bg-brand-fringe", checked: false },
  ]
  return (
    <Tile label="Checklist">
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${item.color}`} />
            <div className="w-24 h-2 bg-[var(--bg-surface-2)] rounded" />
            {item.checked && <span className="text-brand-primary text-xs">&#10003;</span>}
          </div>
        ))}
      </div>
    </Tile>
  )
}

function Pipeline() {
  return (
    <Tile label="Pipeline">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < 3 ? "bg-brand-primary" : "bg-[var(--bg-surface-3)]"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-[var(--text-tech)] mt-2">Stage 3 of 5</span>
      </div>
    </Tile>
  )
}

function Slides() {
  return (
    <Tile label="Slides">
      <div className="border border-[var(--border-glass)] rounded-lg p-2 w-full max-w-[120px]">
        <div className="text-xs text-white font-semibold">Q3 Strategy</div>
        <div className="w-16 h-1.5 bg-[var(--bg-surface-3)] rounded mt-1" />
        <div className="w-16 h-1.5 bg-[var(--bg-surface-3)] rounded mt-1" />
      </div>
    </Tile>
  )
}

export function CardShowcase() {
  const { ref, visible } = useInView()

  return (
    <div ref={ref} className={`reveal ${visible ? "visible" : ""} py-24`}>
      <SectionHeader title="Eight Ways to See Intelligence" />

      <div className={`stagger ${visible ? "visible" : ""} grid grid-cols-2 md:grid-cols-4 gap-4`}>
        <StatCard />
        <Chart />
        <Comparison />
        <Profile />
        <Verdict />
        <Checklist />
        <Pipeline />
        <Slides />
      </div>
    </div>
  )
}
