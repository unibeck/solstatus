interface PolkaDotsProps {
  className?: string
  color?: string
  dotColor?: string
}

export function PolkaDots({
  className = "",
  color = "transparent",
  dotColor = "currentColor",
}: PolkaDotsProps) {
  return (
    <div
      className={`absolute inset-0 opacity-20 ${className}`}
      style={{
        backgroundImage: `radial-gradient(${dotColor} 1px, ${color} 1px)`,
        backgroundSize: "16px 16px",
      }}
    />
  )
}
