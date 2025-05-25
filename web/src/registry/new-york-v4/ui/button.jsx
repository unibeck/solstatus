import React from "react"
import { cn } from "../../../lib/utils"

// Basic Button component that supports variants
export function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        {
          // Variants
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "primary",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "hover:underline": variant === "link",
          
          // Sizes
          "h-9 px-4 py-2": size === "default",
          "h-7 rounded-md px-3 text-xs": size === "sm",
          "h-10 rounded-md px-8": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}