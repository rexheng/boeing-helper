import { Button } from "../components/Button"
import { BoeingHelperLogo } from "../components/BoeingHelperLogo"

interface HeroProps {
  onStartDemo: () => void
}

const navLinks = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Workflows", href: "#workflows" },
  { label: "Trust", href: "#trust" },
  { label: "Sources", href: "#sources" },
]

export function Hero({ onStartDemo }: HeroProps) {
  return (
    <div className="relative">
      <header className="site-header">
        <div className="constrain site-header__inner">
          <a href="#top" className="site-header__logo flex items-center">
            <BoeingHelperLogo variant="white" height={36} />
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

            <p className="hero__headline">Saving time and cost.</p>

            <p className="hero__sub">
              Meeting papers, invitation letters, and attendee lists — prepared once for the
              show cycle.
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
