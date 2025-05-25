import React, { useEffect } from "react"
import { useStatsStore } from "../store/dashboard-stats-store"

export function SectionCards() {
  const { stats, fetchDashboardStats, isLoading } = useStatsStore()

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Endpoint Monitors Card */}
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Endpoint Monitors
          </p>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              stats.totalEndpointMonitors
            )}
          </div>
        </div>
      </div>

      {/* Active Monitors Card */}
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Active Monitors
          </p>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              stats.activeEndpointMonitors
            )}
          </div>
        </div>
      </div>

      {/* Average Latency Card */}
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Average Latency
          </p>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              `${stats.averageLatencyMs.toFixed(2)}ms`
            )}
          </div>
        </div>
      </div>

      {/* Uptime Percentage Card */}
      <div className="rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-muted-foreground">
            Uptime
          </p>
          <div className="text-2xl font-bold">
            {isLoading ? (
              <span className="animate-pulse">...</span>
            ) : (
              `${stats.uptimePercentage.toFixed(2)}%`
            )}
          </div>
        </div>
      </div>
    </div>
  )
}