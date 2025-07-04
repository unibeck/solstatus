"use client"

import { useCallback, useEffect, useRef } from "react"
import { useHeaderContext } from "@/context/header-context"

interface UseAutoRefreshOptions {
  onRefresh: () => void | Promise<void>
  enabled?: boolean
}

export function useAutoRefresh({
  onRefresh,
  enabled = true,
}: UseAutoRefreshOptions) {
  const {
    refreshInterval,
    isRefreshEnabled,
    setRefreshProgress,
    setIsAutoRefreshAvailable,
  } = useHeaderContext()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Immediately set auto-refresh as available for the component that uses this hook
  setIsAutoRefreshAvailable(true)

  const clearIntervals = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  useEffect(
    () => () => {
      setIsAutoRefreshAvailable(false)
    },
    [setIsAutoRefreshAvailable],
  )

  const startRefresh = useCallback(() => {
    if (!isRefreshEnabled || !enabled || refreshInterval === "off") {
      clearIntervals()
      setRefreshProgress(0)
      return
    }

    clearIntervals()

    const intervalMs = refreshInterval * 1000
    startTimeRef.current = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min((elapsed / intervalMs) * 100, 100)
      setRefreshProgress(progress)
    }

    progressIntervalRef.current = setInterval(updateProgress, 100)

    intervalRef.current = setInterval(() => {
      onRefresh()
      startTimeRef.current = Date.now()
      setRefreshProgress(0)
    }, intervalMs)

    onRefresh()
  }, [
    refreshInterval,
    isRefreshEnabled,
    enabled,
    onRefresh,
    setRefreshProgress,
    clearIntervals,
  ])

  useEffect(() => {
    startRefresh()
    return clearIntervals
  }, [startRefresh, clearIntervals])

  return {
    refreshInterval,
    isRefreshEnabled: isRefreshEnabled && enabled,
  }
}
