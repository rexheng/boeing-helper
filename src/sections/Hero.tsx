import { Button } from "../components/Button"
import { HelperLogo } from "../components/HelperLogo"

interface HeroProps {
  onStartDemo: () => void
}

const navLinks = [
  { label: "Capabilities", href: "#capabilities" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Workflows", href: "#workflows" },
  { label: "Trust", href: "#trust" },
  { label: "FAQ", href: "#faq" },
]

export function Hero({ onStartDemo }: HeroProps) {
  return (
    <div className="relative">
      <header className="site-header">
        <div className="constrain site-header__inner">
          <a href="#top" className="site-header__logo flex items-center">
            <HelperLogo variant="white" height={26} />
          </a>

          <nav className="site-header__nav" aria-label="Primary">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          <Button variant="secondary" onClick={onStartDemo}>
            Start preparation
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
          <div className="constrain hero__copy animate-[fadeInUp_0.9s_ease-out_both]">
            <h1 className="hero__brand">
              <HelperLogo variant="white" height={56} className="hero__brand-logo" />
            </h1>

            <p className="hero__sub">
              Meeting briefs and papers updated live for every engagement
            </p>

            <div className="hero__actions">
              <Button variant="primary" onClick={onStartDemo}>
                Start preparation
              </Button>
              <a href="#capabilities">
                <Button variant="secondary">View capabilities</Button>
              </a>
            </div>
          </div>
        </div>

        <div className="hero__swoosh" />
      </section>
    </div>
  )
}
