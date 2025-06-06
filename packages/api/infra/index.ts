import type { DBResource } from "@solstatus/common/infra"
import alchemy, { type } from "alchemy"
import { DurableObjectNamespace, Worker } from "alchemy/cloudflare"
import type { MonitorExec, MonitorTrigger, MonitorTriggerRPC } from "@/index"

const APP_NAME = "solstatus"
const stage = process.argv[3] || "dev"
const phase = process.argv[2] === "destroy" ? "destroy" : "up"
const RES_PREFIX = `${APP_NAME}-${stage}`
console.log(`${RES_PREFIX}: ${phase}`)

export async function createMonitorExecWorker(
  resPrefix: string,
  db: DBResource,
) {
  const workerName = `${resPrefix}-monitor-exec`
  return await Worker(workerName, {
    name: workerName,
    entrypoint: require.resolve("@solstatus/api/monitor-exec"),
    rpc: type<MonitorExec>,
    bindings: {
      DB: db,
      OPSGENIE_API_KEY: alchemy.secret(process.env.OPSGENIE_API_KEY),
      APP_ENV: stage,
    },
  })
}
export type MonitorExecWorkerResource = Awaited<
  ReturnType<typeof createMonitorExecWorker>
>

export async function createMonitorTriggerWorker(
  resPrefix: string,
  db: DBResource,
  monitorExecWorker: MonitorExecWorkerResource,
) {
  const workerName = `${resPrefix}-monitor-trigger`
  return await Worker(workerName, {
    name: workerName,
    entrypoint: require.resolve("@solstatus/api/monitor-trigger"),
    rpc: type<MonitorTriggerRPC>,
    bindings: {
      DB: db,
      MONITOR_EXEC: monitorExecWorker,
      MONITOR_TRIGGER: new DurableObjectNamespace<MonitorTrigger>(
        `${workerName}-do`,
        {
          className: "MonitorTrigger",
          sqlite: true,
        },
      ),
    },
  })
}
export type MonitorTriggerWorkerResource = Awaited<
  ReturnType<typeof createMonitorTriggerWorker>
>
