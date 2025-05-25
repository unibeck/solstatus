import React from "react"
import { useHeaderContext } from "../context/header-context"
import { cn } from "../lib/utils"

export function SiteHeader() {
  const { headerLeftContent, headerRightContent } = useHeaderContext()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          <div>{headerLeftContent}</div>
          <div className="flex items-center gap-2">{headerRightContent}</div>
        </div>
      </div>
    </header>
  )
}