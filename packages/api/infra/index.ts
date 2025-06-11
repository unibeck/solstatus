import type { DBResource } from "@solstatus/common/infra"
import alchemy, { type } from "alchemy"
import { DurableObjectNamespace, Worker } from "alchemy/cloudflare"
import type {
  MonitorExec,
  MonitorTrigger,
  MonitorTriggerRPC,
} from "../src/index"

export async function createMonitorExecWorker(
  resPrefix: string,
  stage: string,
  db: DBResource,
) {
  const workerName = `${resPrefix}-monitor-exec`
  return await Worker(workerName, {
    name: workerName,
    entrypoint: '../src/monitor-exec.ts',
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
    entrypoint: '../src/monitor-trigger.ts',
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
