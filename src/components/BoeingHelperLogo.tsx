interface BoeingHelperLogoProps {
  variant?: "blue" | "white"
  className?: string
  height?: number
}

/** Official Boeing mark with Helper stacked below. */
export function BoeingHelperLogo({
  variant = "blue",
  className = "",
  height = 40,
}: BoeingHelperLogoProps) {
  const src =
    variant === "white"
      ? "/images/boeing-helper-logo-white.svg"
      : "/images/boeing-helper-logo.svg"
  return (
    <img
      src={src}
      alt="Boeing Helper"
      height={height}
      className={className}
      style={{ height, width: "auto", display: "block" }}
      decoding="async"
    />
  )
}
