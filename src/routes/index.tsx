import { useState, useEffect } from "react";
import RootLayout from "@/layouts/RootLayout";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/data-table/columns";
import { AddEndpointMonitorDialog } from "@/components/add-endpoint-monitor-dialog";
import { SectionCards } from "@/components/section-cards";
import { useDashboardStatsStore } from "@/store/dashboard-stats-store";
import type { z } from "zod";
import type { endpointMonitorsSelectSchema } from "@/db/zod-schema";

export default function HomePage() {
  const [endpointMonitors, setEndpointMonitors] = useState<
    z.infer<typeof endpointMonitorsSelectSchema>[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const { stats, setStats } = useDashboardStatsStore();

  useEffect(() => {
    const fetchEndpointMonitors = async () => {
      try {
        const response = await fetch("/api/endpoint-monitors");
        if (!response.ok) throw new Error("Failed to fetch endpoint monitors");
        const data = await response.json();
        setEndpointMonitors(data);
      } catch (error) {
        console.error("Error fetching endpoint monitors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/endpoint-monitors/stats");
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchEndpointMonitors();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <RootLayout>
      <div className="@container/main flex flex-1 flex-col">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-4 text-3xl font-semibold tracking-tight">
                Dashboard
              </h1>
              <SectionCards stats={stats} />
            </div>
            <AddEndpointMonitorDialog
              onSuccess={(newEndpointMonitor) => {
                setEndpointMonitors((prev) => [...prev, newEndpointMonitor]);
              }}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border shadow-sm">
              <DataTable
                columns={columns}
                data={endpointMonitors}
                isLoading={isLoading}
                onRefresh={async () => {
                  setIsLoading(true);
                  try {
                    const response = await fetch("/api/endpoint-monitors");
                    if (!response.ok) throw new Error("Failed to fetch endpoint monitors");
                    const data = await response.json();
                    setEndpointMonitors(data);
                  } catch (error) {
                    console.error("Error refreshing endpoint monitors:", error);
                  } finally {
                    setIsLoading(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}