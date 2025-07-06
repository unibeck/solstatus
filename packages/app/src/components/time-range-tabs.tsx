"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import type { TimeRange } from "@/types/endpointMonitor"

interface TimeRangeTabsProps {
  value: TimeRange
  onValueChange: (value: TimeRange) => void
}

const timeRanges: TimeRange[] = ["30m", "1h", "3h", "6h", "1d", "2d", "7d"]

const getTimeRangeDisplay = (range: TimeRange, isSelected: boolean): string => {
  if (!isSelected) { return range }
  
  const displayMap: Record<TimeRange, string> = {
    "30m": "30 Minutes",
    "1h": "1 Hour",
    "3h": "3 Hours",
    "6h": "6 Hours",
    "1d": "1 Day",
    "2d": "2 Days",
    "7d": "7 Days"
  }
  return displayMap[range]
}

export function TimeRangeTabs({ value, onValueChange }: TimeRangeTabsProps) {
  // Track the display text separately to control timing
  const [displayedRange, setDisplayedRange] = useState(value)
  
  useEffect(() => {
    // Delay text change slightly for smoother animation
    const timer = setTimeout(() => {
      setDisplayedRange(value)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [value])
  
  return (
    <Tabs
      value={value}
      onValueChange={(val) => onValueChange(val as TimeRange)}
      className="w-full"
    >
      <div className="flex justify-end items-center mb-3">
        <TabsList className="h-auto p-1 gap-1">
          {timeRanges.map((range) => {
            const isActive = value === range
            const isDisplayActive = displayedRange === range
            
            return (
              <TabsTrigger
                key={range}
                value={range}
                className="relative overflow-hidden px-3 py-1.5 text-sm font-medium transition-all duration-300 ease-out will-change-transform data-[state=active]:scale-x-110 data-[state=active]:px-4"
              >
                <span 
                  className={`block transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-80'
                  }`}
                >
                  {getTimeRangeDisplay(range, isDisplayActive)}
                </span>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>
    </Tabs>
  )
} 