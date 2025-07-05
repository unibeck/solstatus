"use client"

import { memo, useLayoutEffect, useRef, useState } from "react"
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

export const TimeRangeAccordion = memo(function TimeRangeAccordion({
  value,
  onChange,
  className,
}: TimeRangeAccordionProps) {
  const [buttonWidths, setButtonWidths] = useState<Record<string, { short: number; full: number }>>({})
  const measureRefs = useRef<Record<string, HTMLSpanElement>>({})

  // Measure the width of both short and full labels
  useLayoutEffect(() => {
    const widths: Record<string, { short: number; full: number }> = {}
    
    timeRangeOptions.forEach((option) => {
      const shortRef = measureRefs.current[`${option.value}-short`]
      const fullRef = measureRefs.current[`${option.value}-full`]
      
      if (shortRef && fullRef) {
        widths[option.value] = {
          short: shortRef.offsetWidth,
          full: fullRef.offsetWidth,
        }
      }
    })
    
    setButtonWidths(widths)
  }, [])

  return (
    <>
      {/* Hidden elements for measuring */}
      <div className="sr-only" aria-hidden="true">
        {timeRangeOptions.map((option) => (
          <div key={option.value} className="inline-flex">
            <span
              ref={(el) => {
                if (el) { measureRefs.current[`${option.value}-short`] = el }
              }}
              className="px-3 text-sm font-medium"
            >
              {option.shortLabel}
            </span>
            <span
              ref={(el) => {
                if (el) { measureRefs.current[`${option.value}-full`] = el }
              }}
              className="px-3 text-sm font-medium"
            >
              {option.fullLabel}
            </span>
          </div>
        ))}
      </div>

      <div
        className={cn(
          "flex items-center gap-1 p-1 bg-muted/50 rounded-lg border",
          className
        )}
      >
        {timeRangeOptions.map((option) => {
          const isActive = value === option.value
          const widthData = buttonWidths[option.value]
          const width = widthData
            ? isActive
              ? widthData.full
              : widthData.short
            : "auto"

          return (
            <button
              type="button"
              key={option.value}
              onClick={() => onChange(option.value)}
              className={cn(
                "relative py-1.5 text-sm font-medium overflow-hidden whitespace-nowrap",
                "transition-all duration-300 ease-in-out",
                "hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md",
                isActive
                  ? "text-foreground bg-background shadow-sm border"
                  : "text-muted-foreground hover:bg-muted"
              )}
              style={{
                width: typeof width === "number" ? `${width}px` : width,
                willChange: "width",
              }}
            >
              <span className="absolute inset-0 flex items-center justify-center px-3 transition-opacity duration-300">
                <span
                  className={cn(
                    "transition-opacity duration-300 whitespace-nowrap",
                    isActive ? "opacity-0" : "opacity-100"
                  )}
                  style={{ willChange: "opacity" }}
                >
                  {option.shortLabel}
                </span>
              </span>
              <span className="absolute inset-0 flex items-center justify-center px-3 transition-opacity duration-300">
                <span
                  className={cn(
                    "transition-opacity duration-300 whitespace-nowrap",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                  style={{ willChange: "opacity" }}
                >
                  {option.fullLabel}
                </span>
              </span>
              {/* Keep content in DOM for width calculation */}
              <span className="invisible px-3 whitespace-nowrap">
                {isActive ? option.fullLabel : option.shortLabel}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}) 