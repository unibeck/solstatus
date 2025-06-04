import type { DBResource } from "@solstatus/common/infra"
import alchemy, { type } from "alchemy"
import { DurableObjectNamespace, Worker } from "alchemy/cloudflare"
import type { MonitorExec, MonitorTrigger, MonitorTriggerRPC } from "#/index"

const APP_NAME = "solstatus"
const stage = process.argv[3] || "dev"
const phase = process.argv[2] === "destroy" ? "destroy" : "up"
const RES_PREFIX = `${APP_NAME}-${stage}`
console.log(`${RES_PREFIX}: ${phase}`)

export const createMonitorExecWorker = (db: DBResource) => Worker(`${RES_PREFIX}-monitor-exec`, {
  name: `${RES_PREFIX}-monitor-exec`,
  entrypoint: require.resolve("@solstatus/api/monitor-exec"),
  rpc: type<MonitorExec>,
  bindings:{
    DB: db,
    OPSGENIE_API_KEY: alchemy.secret(process.env.OPSGENIE_API_KEY),
    APP_ENV: stage,
  }
})

export const createMonitorTriggerWorker = (db: DBResource, monitorExecWorker: Awaited<ReturnType<typeof createMonitorExecWorker>>) => Worker(`${RES_PREFIX}-monitor-trigger`, {
  name: `${RES_PREFIX}-monitor-trigger`,
  entrypoint: require.resolve("@solstatus/api/monitor-trigger"),
  rpc: type<MonitorTriggerRPC>,
  bindings: {
    DB: db,
    MONITOR_EXEC: monitorExecWorker,
    MONITOR_TRIGGER: new DurableObjectNamespace<MonitorTrigger>(`${RES_PREFIX}-monitor-trigger`, {
      className: "MonitorTrigger",
      sqlite: true
    }),
  }
})

// Export types for other modules to use
export type MonitorExecWorkerResource = Awaited<ReturnType<typeof createMonitorExecWorker>>
export type MonitorTriggerWorkerResource = Awaited<ReturnType<typeof createMonitorTriggerWorker>>
