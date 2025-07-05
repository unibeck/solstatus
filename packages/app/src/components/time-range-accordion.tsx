"use client"

import { cn } from "@/lib/utils"
import type { TimeRange } from "@/types/endpointMonitor"

interface TimeRangeAccordionProps {
  value: TimeRange
  onChange: (value: TimeRange) => void
  className?: string
}

const timeRangeOptions: {
  value: TimeRange
  shortLabel: string
  fullLabel: string
}[] = [
  { value: "30m", shortLabel: "30m", fullLabel: "30 minutes" },
  { value: "1h", shortLabel: "1h", fullLabel: "1 hour" },
  { value: "3h", shortLabel: "3h", fullLabel: "3 hours" },
  { value: "6h", shortLabel: "6h", fullLabel: "6 hours" },
  { value: "1d", shortLabel: "1d", fullLabel: "1 day" },
  { value: "2d", shortLabel: "2d", fullLabel: "2 days" },
  { value: "7d", shortLabel: "7d", fullLabel: "7 days" },
]

export function TimeRangeAccordion({
  value,
  onChange,
  className,
}: TimeRangeAccordionProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 bg-muted/50 rounded-lg border",
        className
      )}
    >
      {timeRangeOptions.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative px-3 py-1.5 text-sm font-medium transition-all duration-200",
              "hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
              isActive
                ? "text-foreground bg-background shadow-sm border"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            <span className="relative z-10 transition-all duration-200">
              {isActive ? option.fullLabel : option.shortLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
} 