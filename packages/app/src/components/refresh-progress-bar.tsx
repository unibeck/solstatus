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
      className={`relative w-full ${hoverHeight} transition-all duration-200 ease-in-out bg-muted/20`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isRefreshEnabled && (
        <div
          className={`h-full ${progressBarColor} transition-all duration-100 ease-linear`}
          style={{ width: `${refreshProgress}%` }}
        />
      )}

      {isHovered && (
        <div className="absolute inset-0 flex items-center justify-between px-3 bg-background/95 backdrop-blur-sm border-t">
          <span className="text-sm text-muted-foreground">
            Auto-refresh: {intervalLabels[refreshInterval]}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 px-2">
                <IconSettings className="h-3 w-3 mr-1" />
                Change
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
        </div>
      )}
    </div>
  )
}
