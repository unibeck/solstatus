"use client"

import type {
  endpointMonitorsSelectSchema,
  uptimeChecksSelectSchema,
} from "@solstatus/common/db"
import { msToHumanReadable, secsToHumanReadable } from "@solstatus/common/utils"
import { IconPointFilled } from "@tabler/icons-react"
import { ArrowLeft } from "lucide-react"
import type { Route } from "next"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import type { z } from "zod"
import { PolkaDots } from "@/components/bg-patterns/polka-dots"
import { EndpointMonitorDetailHeader } from "@/components/endpoint-monitor-detail-header"
import { EndpointMonitorSectionCards } from "@/components/endpoint-monitor-section-cards"
import LatencyRangeChart from "@/components/latency-range-chart"
import { UptimeChart } from "@/components/uptime-chart"
import {
  defaultHeaderContent,
  useHeaderContext,
} from "@/context/header-context"
import { useAutoRefresh } from "@/hooks/use-auto-refresh"
import { Badge } from "@/registry/new-york-v4/ui/badge"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/registry/new-york-v4/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york-v4/ui/tooltip"
import type { TimeRange } from "@/types/endpointMonitor"

// Define the type for a single uptime check
type LatestUptimeCheck = z.infer<typeof uptimeChecksSelectSchema>

export default function EndpointMonitorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const endpointMonitorId = params.id as string
  const { setHeaderLeftContent, setHeaderRightContent } = useHeaderContext()
  const searchParams = useSearchParams()

  const [endpointMonitor, setEndpointMonitor] = useState<z.infer<
    typeof endpointMonitorsSelectSchema
  > | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // Initialize timeRange from URL or default to '1d'
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    const rangeParam = searchParams.get("range")
    return rangeParam === "1h" || rangeParam === "1d" || rangeParam === "7d"
      ? rangeParam
      : "1d"
  })

  const [uptimeData, setUptimeData] = useState<
    z.infer<typeof uptimeChecksSelectSchema>[]
  >([])
  const [latestUptimeCheck, setLatestUptimeCheck] =
    useState<LatestUptimeCheck | null>(null) // New state for latest check

  const [uptimePercentage, setUptimePercentage] = useState<number | null>(null)
  const [avgLatency, setAvgLatency] = useState<number | null>(null)
  const [isUptimeDataLoading, setIsUptimeDataLoading] = useState(true)
  const [uptimeDataError, setUptimeDataError] = useState<string | null>(null)
  const isInitialRender = useRef(true)

  const fetchWebsite = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/endpoint-monitors/${endpointMonitorId}`,
      )
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/")
          return
        }
        throw new Error(
          `Failed to fetch endpointMonitor: ${response.statusText}`,
        )
      }
      const data = await response.json()
      setEndpointMonitor(data as z.infer<typeof endpointMonitorsSelectSchema>)
    } catch (error) {
      console.error("Error fetching endpointMonitor:", error)
    } finally {
      setIsLoading(false)
    }
  }, [endpointMonitorId, router])

  const fetchUptimeData = useCallback(async () => {
    if (!endpointMonitorId) {
      return
    }

    setIsUptimeDataLoading(true)
    setUptimeDataError(null)

    try {
      const response = await fetch(
        `/api/endpoint-monitors/${endpointMonitorId}/uptime/range?range=${timeRange}`,
      )
      if (!response.ok) {
        console.error(
          `Failed to fetch combined data for endpointMonitor ${endpointMonitorId} with error: ${response.statusText}`,
        )
        setUptimeData([])
        setUptimePercentage(null)
        setAvgLatency(null)
        setUptimeDataError(`Failed to load data: ${response.statusText}`)
        return
      }

      const responseData = (await response.json()) as z.infer<
        typeof uptimeChecksSelectSchema
      >[]

      setUptimeData(responseData)
      setUptimeDataError(null)
    } catch (error) {
      console.error("Error fetching combined uptime/latency data:", error)
      setUptimeData([])
      setUptimeDataError(
        "An error occurred while loading endpointMonitor data.",
      )
    } finally {
      setIsUptimeDataLoading(false)
    }
  }, [endpointMonitorId, timeRange])

  const fetchLatestUptimeCheck = useCallback(async () => {
    if (!endpointMonitorId) {
      return
    }

    try {
      const response = await fetch(
        `/api/endpoint-monitors/${endpointMonitorId}/uptime`,
      )
      if (!response.ok) {
        if (response.status !== 404) {
          console.error(
            `Failed to fetch latest uptime check: ${response.statusText}`,
          )
        }
        setLatestUptimeCheck(null)
        return
      }
      const data = await response.json()
      setLatestUptimeCheck(data as LatestUptimeCheck)
    } catch (error) {
      console.error("Error fetching latest uptime check:", error)
      setLatestUptimeCheck(null)
    }
  }, [endpointMonitorId])

  // Create a ref to hold the latest fetchUptimeData function.
  // This allows refreshAllData to remain stable while still calling the latest fetchUptimeData.
  const fetchUptimeDataRef = useRef(fetchUptimeData)
  useEffect(() => {
    fetchUptimeDataRef.current = fetchUptimeData
  }, [fetchUptimeData])

  const refreshAllData = useCallback(async () => {
    if (endpointMonitorId) {
      await Promise.all([
        fetchWebsite(),
        fetchUptimeDataRef.current(),
        fetchLatestUptimeCheck(),
      ])
    }
  }, [endpointMonitorId, fetchWebsite, fetchLatestUptimeCheck])

  useAutoRefresh({
    onRefresh: refreshAllData,
    enabled: !!endpointMonitorId,
  })

  // This effect is now responsible for fetching uptime data when the timeRange changes.
  // It skips the initial render because useAutoRefresh handles the initial data load.
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false
      return
    }
    fetchUptimeData()
  }, [fetchUptimeData])

  useEffect(() => {
    // The useAutoRefresh hook now handles the initial data fetch.
    return () => {
      setHeaderLeftContent(null)
      setHeaderRightContent(defaultHeaderContent)
    }
  }, [setHeaderLeftContent, setHeaderRightContent])

  useEffect(() => {
    if (endpointMonitor) {
      setHeaderLeftContent(endpointMonitor.name)
      setHeaderRightContent(
        endpointMonitor.isRunning ? (
          <div className="flex items-center gap-2">
            {latestUptimeCheck && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-muted-foreground underline decoration-dashed cursor-help">
                      {`Checking every ${secsToHumanReadable(endpointMonitor.checkInterval)}`}
                    </p>
                    {/* <span className="underline decoration-dashed cursor-help">
                      {formatDistance(new Date(latestUptimeCheck.timestamp), new Date(), { addSuffix: true })}
                    </span> */}
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Latest check:</p>
                    <p>
                      {new Date(latestUptimeCheck.timestamp).toLocaleString(
                        undefined,
                        {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          second: "numeric",
                          timeZoneName: "short",
                        },
                      )}
                    </p>
                    <p>Status: {latestUptimeCheck.status}</p>
                    <p>
                      Latency:{" "}
                      {msToHumanReadable(
                        latestUptimeCheck.responseTime ?? 0,
                        true,
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {!latestUptimeCheck && (
              <p className="text-sm text-muted-foreground">
                {`Checking every ${secsToHumanReadable(endpointMonitor.checkInterval)}`}
              </p>
            )}

            <div className="relative">
              <IconPointFilled className="absolute text-green-500 animate-ping" />
              <IconPointFilled className="relative z-10 mr-1 text-green-500" />
            </div>
          </div>
        ) : (
          <Badge variant="warning" className="animate-pulse">
            Paused
          </Badge>
        ),
      )
    }
  }, [
    endpointMonitor,
    latestUptimeCheck,
    setHeaderLeftContent,
    setHeaderRightContent,
  ])

  useEffect(() => {
    if (uptimeData.length > 0) {
      const uptimePercentage =
        (uptimeData.filter((check) => check.isExpectedStatus).length /
          uptimeData.length) *
        100
      setUptimePercentage(uptimePercentage)
    } else {
      setUptimePercentage(null)
    }
  }, [uptimeData])

  useEffect(() => {
    if (uptimeData.length > 0) {
      const avgLatency =
        uptimeData.reduce((sum, check) => sum + (check.responseTime ?? 0), 0) /
        uptimeData.length
      setAvgLatency(avgLatency)
    } else {
      setAvgLatency(null)
    }
  }, [uptimeData])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">
            Loading endpoint Monitor details...
          </p>
        </div>
      </div>
    )
  }

  if (!endpointMonitor) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Endpoint Monitor not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto pt-2 pb-8 px-4">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <EndpointMonitorDetailHeader
            endpointMonitor={endpointMonitor}
            onStatusChange={fetchWebsite}
          />

          <Tabs
            value={timeRange} // Use value instead of defaultValue
            onValueChange={(value) => {
              const newTimeRange = value as TimeRange
              setTimeRange(newTimeRange)
              // Update URL
              const newPath =
                newTimeRange === "1d"
                  ? `/endpoint-monitors/${endpointMonitorId}`
                  : `/endpoint-monitors/${endpointMonitorId}?range=${newTimeRange}`
              router.push(newPath as Route, { scroll: false })
            }}
            className="w-full"
          >
            <div className="flex justify-end items-center mb-3">
              <TabsList>
                <TabsTrigger value="1h">Last 1 Hour</TabsTrigger>
                <TabsTrigger value="1d">Last 1 Day</TabsTrigger>
                <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
              </TabsList>
            </div>
          </Tabs>

          <EndpointMonitorSectionCards
            endpointMonitor={endpointMonitor}
            avgResponseTime={avgLatency ?? 0}
            uptimePercentage={uptimePercentage ?? 0}
            loading={isUptimeDataLoading}
            error={uptimeDataError}
          />
          <div className="mt-0 flex flex-col gap-6">
            {uptimeData.length > 0 ? (
              <>
                <Card className="p-0">
                  <CardContent className="p-0">
                    <div className="h-[200px]">
                      <UptimeChart
                        data={uptimeData}
                        timeRange={timeRange}
                        isLoading={isUptimeDataLoading}
                        error={uptimeDataError}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="h-[400px]">
                      <LatencyRangeChart
                        data={uptimeData}
                        timeRange={timeRange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center h-full relative overflow-hidden rounded-lg bg-muted/50">
                <PolkaDots />
                <div className="relative text-muted-foreground z-10 p-8">
                  No uptime data available for the selected period.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
