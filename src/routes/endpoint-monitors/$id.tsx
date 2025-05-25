import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "rwsdk";
import { ArrowLeft } from "lucide-react";
import { IconPointFilled } from "@tabler/icons-react";
import { EndpointMonitorDetailHeader } from "@/components/endpoint-monitor-detail-header";
import { EndpointMonitorSectionCards } from "@/components/endpoint-monitor-section-cards";
import LatencyRangeChart from "@/components/latency-range-chart";
import { UptimeChart } from "@/components/uptime-chart";
import {
  defaultHeaderContent,
  useHeaderContext,
} from "@/context/header-context";
import type {
  endpointMonitorsSelectSchema,
  uptimeChecksSelectSchema,
} from "@/db/zod-schema";
import { msToHumanReadable } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import RootLayout from "@/layouts/RootLayout";
import type { z } from "zod";

type TimeRange = "1h" | "1d" | "7d";

export default function EndpointMonitorDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const endpointMonitorId = params.id as string;
  const { setHeaderLeftContent, setHeaderRightContent } = useHeaderContext();
  const searchParams = useSearchParams();

  const [endpointMonitor, setEndpointMonitor] = useState<z.infer<
    typeof endpointMonitorsSelectSchema
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize timeRange from URL or default to '1d'
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    const rangeParam = searchParams.get("range");
    return rangeParam === "1h" || rangeParam === "1d" || rangeParam === "7d"
      ? rangeParam as TimeRange
      : "1d";
  });

  const [uptimeData, setUptimeData] = useState<
    z.infer<typeof uptimeChecksSelectSchema>[]
  >([]);
  const [isUptimeLoading, setIsUptimeLoading] = useState(true);
  
  const { toast } = useToast();

  // Fetch the endpoint monitor data
  useEffect(() => {
    const fetchEndpointMonitor = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/endpoint-monitors/${endpointMonitorId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch endpoint monitor");
        }
        const data = await response.json();
        setEndpointMonitor(data);
      } catch (error) {
        console.error("Error fetching endpoint monitor:", error);
        toast({
          title: "Error",
          description: "Failed to fetch endpoint monitor details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEndpointMonitor();
  }, [endpointMonitorId, toast]);

  // Fetch uptime data based on the selected time range
  useEffect(() => {
    const fetchUptimeData = async () => {
      if (!endpointMonitorId) return;

      setIsUptimeLoading(true);
      try {
        const response = await fetch(
          `/api/endpoint-monitors/${endpointMonitorId}/uptime/range?timeRange=${timeRange}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch uptime data");
        }
        const data = await response.json();
        setUptimeData(data);
      } catch (error) {
        console.error("Error fetching uptime data:", error);
      } finally {
        setIsUptimeLoading(false);
      }
    };

    fetchUptimeData();
  }, [endpointMonitorId, timeRange]);

  // Set header content when component mounts
  useEffect(() => {
    setHeaderLeftContent(
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="h-8 w-8"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex items-center gap-2">
          <h2 className="line-clamp-1 font-medium">
            {isLoading
              ? "Loading..."
              : endpointMonitor?.name || "Endpoint Monitor"}
          </h2>
          {endpointMonitor?.url && (
            <Badge variant="outline" className="px-1">
              {new URL(endpointMonitor.url).hostname}
            </Badge>
          )}
        </div>
      </div>
    );

    return () => {
      setHeaderLeftContent(defaultHeaderContent);
      setHeaderRightContent(null);
    };
  }, [
    endpointMonitor?.name,
    endpointMonitor?.url,
    isLoading,
    setHeaderLeftContent,
    setHeaderRightContent,
    navigate,
  ]);

  // Function to manually fetch the website status
  const fetchWebsite = useCallback(async () => {
    if (!endpointMonitor) return;

    try {
      const response = await fetch(
        `/api/endpoint-monitors/${endpointMonitorId}/execute-check`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to execute check");
      }

      const data = await response.json();
      
      // Update endpointMonitor state with the latest data
      setEndpointMonitor((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          lastCheck: data.timestamp,
          status: data.status,
          statusCode: data.statusCode,
          latencyMs: data.latencyMs,
        };
      });

      // Add the new check to uptime data
      setUptimeData((prev) => [data, ...prev]);

      toast({
        title: "Check completed",
        description: `Status: ${data.status}, Latency: ${msToHumanReadable(data.latencyMs)}`,
      });
    } catch (error) {
      console.error("Error executing check:", error);
      toast({
        title: "Error",
        description: "Failed to execute check",
        variant: "destructive",
      });
    }
  }, [endpointMonitor, endpointMonitorId, toast]);

  if (isLoading) {
    return (
      <RootLayout>
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </RootLayout>
    );
  }

  if (!endpointMonitor) {
    return (
      <RootLayout>
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-muted-foreground">Endpoint monitor not found</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go back to dashboard
          </Button>
        </div>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <EndpointMonitorDetailHeader
            endpointMonitor={endpointMonitor}
            onStatusChange={fetchWebsite}
          />

          <Tabs
            value={timeRange}
            onValueChange={(value) => {
              const newTimeRange = value as TimeRange;
              setTimeRange(newTimeRange);
              // Update URL
              navigate({
                to: newTimeRange === "1d"
                  ? `/endpoint-monitors/${endpointMonitorId}`
                  : `/endpoint-monitors/${endpointMonitorId}?range=${newTimeRange}`,
              });
            }}
            className="w-full"
          >
            <div className="flex justify-end items-center mb-3">
              <TabsList>
                <TabsTrigger value="1h" className="text-xs">
                  1H
                </TabsTrigger>
                <TabsTrigger value="1d" className="text-xs">
                  1D
                </TabsTrigger>
                <TabsTrigger value="7d" className="text-xs">
                  7D
                </TabsTrigger>
              </TabsList>
            </div>

            <EndpointMonitorSectionCards
              endpointMonitor={endpointMonitor}
              uptimeData={uptimeData}
            />

            <TabsContent value="1h" className="mt-0 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-2">
                  <div className="rounded-xl border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Uptime
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last hour uptime status
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <UptimeChart
                        data={uptimeData}
                        isLoading={isUptimeLoading}
                        timeRange="1h"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-2">
                  <div className="rounded-xl border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Response Time
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last hour response times
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <LatencyRangeChart
                        data={uptimeData}
                        isLoading={isUptimeLoading}
                        timeRange="1h"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="1d" className="mt-0 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-2">
                  <div className="rounded-xl border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Uptime
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last day uptime status
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <UptimeChart
                        data={uptimeData}
                        isLoading={isUptimeLoading}
                        timeRange="1d"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-2">
                  <div className="rounded-xl border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Response Time
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last day response times
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <LatencyRangeChart
                        data={uptimeData}
                        isLoading={isUptimeLoading}
                        timeRange="1d"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="7d" className="mt-0 space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-2">
                  <div className="rounded-xl border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Uptime
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last week uptime status
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <UptimeChart
                        data={uptimeData}
                        isLoading={isUptimeLoading}
                        timeRange="7d"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-2">
                  <div className="rounded-xl border shadow-sm">
                    <div className="flex flex-col space-y-1.5 p-6">
                      <h3 className="text-2xl font-semibold leading-none tracking-tight">
                        Response Time
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last week response times
                      </p>
                    </div>
                    <div className="p-6 pt-0">
                      <LatencyRangeChart
                        data={uptimeData}
                        isLoading={isUptimeLoading}
                        timeRange="7d"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Recent Status Checks</h3>
            <div className="rounded-xl border shadow-sm overflow-hidden">
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full border-collapse">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left text-sm">Time</th>
                      <th className="p-3 text-left text-sm">Status</th>
                      <th className="p-3 text-left text-sm">Code</th>
                      <th className="p-3 text-left text-sm">Latency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isUptimeLoading ? (
                      <tr>
                        <td colSpan={4} className="p-3 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : uptimeData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-3 text-center">
                          No status checks available
                        </td>
                      </tr>
                    ) : (
                      uptimeData.map((check) => (
                        <tr
                          key={check.id}
                          className="border-t hover:bg-muted/50"
                        >
                          <td className="p-3 text-sm">
                            {new Date(check.timestamp).toLocaleString()}
                          </td>
                          <td className="p-3 text-sm">
                            <div className="flex items-center gap-2">
                              <IconPointFilled
                                className={
                                  check.status === "up"
                                    ? "text-green-500"
                                    : "text-red-500"
                                }
                                size={16}
                              />
                              {check.status}
                            </div>
                          </td>
                          <td className="p-3 text-sm">{check.statusCode}</td>
                          <td className="p-3 text-sm">
                            {check.latencyMs
                              ? msToHumanReadable(check.latencyMs)
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}