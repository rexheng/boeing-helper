import { Button } from "../components/Button"
import { BoeingLogo } from "../components/BoeingLogo"

interface HeroProps {
  onStartDemo: () => void
}

const navLinks = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Workflows", href: "#workflows" },
  { label: "Trust", href: "#trust" },
  { label: "Access", href: "#access" },
]

export function Hero({ onStartDemo }: HeroProps) {
  return (
    <div className="relative">
      <header className="site-header">
        <div className="constrain site-header__inner">
          <a href="#top" className="site-header__logo flex items-center gap-3">
            <BoeingLogo variant="white" height={20} />
            <span className="hidden sm:inline text-sm font-medium tracking-wide" style={{ color: "rgba(255,255,255,0.85)" }}>
              Helper
            </span>
          </a>

          <nav className="site-header__nav" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <Button variant="secondary" onClick={onStartDemo}>
            Launch Demo
          </Button>
        </div>
      </header>

      <section id="top" className="hero">
        <img
          src="/images/hero-airshow.jpg"
          alt="Commercial airliner wing above cloud cover at sunrise"
          className="hero__media"
          decoding="async"
        />
        <div className="hero__scrim" />

        <div className="hero__content">
          <div className="constrain animate-[fadeInUp_0.9s_ease-out_both]">
            <h1 className="hero__brand">Boeing Helper</h1>

            <p className="hero__headline">
              Draft the meeting paper once. Review it once. Put it in the trip book.
            </p>

            <p className="hero__sub">
              Meeting papers, invitations, and attendee lists for integrators and CTLs —
              cleared by VPGMs and IBD leadership without restarting the chain.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-9">
              <Button variant="primary" onClick={onStartDemo}>
                Launch Demo
              </Button>
              <a href="#capabilities">
                <Button variant="secondary">See capabilities</Button>
              </a>
            </div>
          </div>
        </div>

        <div className="hero__swoosh" />
      </section>
    </div>
  )
}
