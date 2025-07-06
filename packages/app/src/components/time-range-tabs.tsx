"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/animated-tabs"
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
  return (
    <Tabs
      value={value}
      onValueChange={(val) => onValueChange(val as TimeRange)}
      className="w-full"
    >
      <div className="flex justify-end items-center mb-3">
        <TabsList className="h-auto p-1">
          {timeRanges.map((range) => {
            const isActive = value === range
            
            return (
              <TabsTrigger
                key={range}
                value={range}
                className="px-4 py-1.5 text-sm font-medium transition-colors duration-200"
              >
                {getTimeRangeDisplay(range, isActive)}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>
    </Tabs>
  )
} 