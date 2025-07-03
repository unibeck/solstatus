"use client"

import type React from "react"
import { createContext, type ReactNode, useContext, useState } from "react"

export type RefreshInterval = 10 | 30 | 60 | "off"

interface HeaderContextProps {
  headerLeftContent: React.ReactNode
  setHeaderLeftContent: (content: React.ReactNode) => void
  headerRightContent: React.ReactNode
  setHeaderRightContent: (content: React.ReactNode) => void
  refreshInterval: RefreshInterval
  setRefreshInterval: (interval: RefreshInterval) => void
  isRefreshEnabled: boolean
  refreshProgress: number
  setRefreshProgress: (progress: number) => void
}

const HeaderContext = createContext<HeaderContextProps | undefined>(undefined)

export const defaultHeaderContent: React.ReactNode = <div />

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [headerLeftContent, setHeaderLeftContent] =
    useState<React.ReactNode>(defaultHeaderContent)
  const [headerRightContent, setHeaderRightContent] =
    useState<React.ReactNode>(defaultHeaderContent)
  const [refreshInterval, setRefreshInterval] = useState<RefreshInterval>(60)
  const [refreshProgress, setRefreshProgress] = useState(0)

  const isRefreshEnabled = refreshInterval !== "off"

  return (
    <HeaderContext.Provider
      value={{
        headerLeftContent,
        setHeaderLeftContent,
        headerRightContent,
        setHeaderRightContent,
        refreshInterval,
        setRefreshInterval,
        isRefreshEnabled,
        refreshProgress,
        setRefreshProgress,
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeaderContext() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error("useHeaderContext must be used within a HeaderProvider")
  }
  return context
}
