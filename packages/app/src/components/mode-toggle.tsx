"use client"

import { IconBrightness } from "@tabler/icons-react"
import React from "react"
import { useTheme } from "#/components/theme-provider"

import { Button } from "#/registry/new-york-v4/ui/button"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  return (
    <Button
      variant="secondary"
      size="icon"
      className="group/toggle size-8"
      onClick={toggleTheme}
    >
      <IconBrightness />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
