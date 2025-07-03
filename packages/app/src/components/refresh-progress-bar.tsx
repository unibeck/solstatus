"use client"

import { IconSettings } from "@tabler/icons-react"
import { useTheme } from "next-themes"
import { useState } from "react"
import {
  type RefreshInterval,
  useHeaderContext,
} from "@/context/header-context"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"

const intervalLabels: Record<RefreshInterval, string> = {
  10: "10 seconds",
  30: "30 seconds",
  60: "1 minute",
  off: "Off",
}

export function RefreshProgressBar() {
  const { theme } = useTheme()
  const {
    refreshInterval,
    setRefreshInterval,
    refreshProgress,
    isRefreshEnabled,
  } = useHeaderContext()
  const [isHovered, setIsHovered] = useState(false)

  const progressBarColor = theme === "dark" ? "bg-white" : "bg-black"
  const hoverHeight = isHovered ? "h-8" : "h-1"

  return (
    <div
      role="progressbar"
      aria-label="Auto-refresh progress"
      className={`relative w-full ${hoverHeight} transition-all duration-200 ease-in-out bg-muted/80`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isRefreshEnabled && (
        <div className="flex justify-center h-full">
          <div
            className={`h-full ${progressBarColor} transition-all duration-100 ease-linear`}
            style={{ width: `${refreshProgress}%` }}
          />
        </div>
      )}

      {isHovered && (
        <div
          className={`absolute top-0 left-1/2 h-full w-fit -translate-x-1/2 flex items-center justify-center gap-2 px-3 text-secondary ${progressBarColor}`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <IconSettings className="h-3 w-3 mr-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setRefreshInterval(10)}>
                10 seconds
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRefreshInterval(30)}>
                30 seconds
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRefreshInterval(60)}>
                1 minute
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRefreshInterval("off")}>
                Off
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <span className="text-sm">
            Auto-refresh: {intervalLabels[refreshInterval]}
          </span>
        </div>
      )}
    </div>
  )
}
