interface BoeingLogoProps {
  variant?: "blue" | "white"
  className?: string
  height?: number
}

/** Official Boeing wordmark (Wikimedia Commons / Boeing). */
export function BoeingLogo({ variant = "blue", className = "", height = 22 }: BoeingLogoProps) {
  const src = variant === "white" ? "/images/boeing-logo-white.svg" : "/images/boeing-logo.svg"
  return (
    <img
      src={src}
      alt="Boeing"
      height={height}
      className={className}
      style={{ height, width: "auto", display: "block" }}
      decoding="async"
    />
  )
}
