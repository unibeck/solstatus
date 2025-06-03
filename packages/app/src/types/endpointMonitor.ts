import type { z } from "zod"
import type { endpointMonitorsSelectSchema } from "@solstatus/common/db"

export type TimeRange = "1h" | "1d" | "7d"

export interface ConflictEndpointMonitorResponse {
  message: string
  matchingEndpointMonitor: z.infer<typeof endpointMonitorsSelectSchema>
}
