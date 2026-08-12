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
            <HelperLogo variant="white" height={28} />
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
            <p className="system-badge mb-5">Boeing Internal Tool</p>

            <h1 className="hero__brand">
              <HelperLogo variant="white" height={72} className="hero__brand-logo" />
            </h1>

            <p className="hero__headline">
              Event meeting, biography preparation, and procurement positions for every engagement.
            </p>

            <p className="hero__sub">
              Walk into a meeting with all the key information ready, so you know what concerns
              are likely to surface.
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
