import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import type { DBResource } from "@solstatus/common/infra"
import type { InfraMetadata } from "@solstatus/common/utils/types"
import alchemy, { type } from "alchemy"
import { DurableObjectNamespace, Worker } from "alchemy/cloudflare"
import type {
  MonitorExec,
  MonitorTrigger,
  MonitorTriggerRPC,
} from "../src/index"

export async function createApi(
  resPrefix: string,
  stage: string,
  db: DBResource,
  cloudflareAccountId: string,
) {
  const infraMetadata = {
    cloudflareAccountId: cloudflareAccountId,
    monitorExecName: `${resPrefix}-monitor-exec`,
    monitorTriggerName: `${resPrefix}-monitor-trigger`,
  }

  const monitorExecWorker = await createMonitorExecWorker(
    infraMetadata,
    stage,
    db,
  )
  const monitorTriggerWorker = await createMonitorTriggerWorker(
    infraMetadata,
    db,
    monitorExecWorker,
  )

  return {
    monitorExecWorker,
    monitorTriggerWorker,
  }
}

async function createMonitorExecWorker(
  infraMetadata: InfraMetadata,
  stage: string,
  db: DBResource,
) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const entrypoint = resolve(__dirname, "../src/monitor-exec.ts")

  return await Worker(infraMetadata.monitorExecName, {
    name: infraMetadata.monitorExecName,
    entrypoint: entrypoint,
    rpc: type<MonitorExec>,
    bindings: {
      DB: db,
      OPSGENIE_API_KEY: alchemy.secret(process.env.OPSGENIE_API_KEY || ""),
      APP_ENV: stage,
      MONITOR_EXEC_NAME: infraMetadata.monitorExecName,
      MONITOR_TRIGGER_NAME: infraMetadata.monitorTriggerName,
      CLOUDFLARE_ACCOUNT_ID: infraMetadata.cloudflareAccountId,
    },
  })
}
export type MonitorExecWorkerResource = Awaited<
  ReturnType<typeof createMonitorExecWorker>
>

async function createMonitorTriggerWorker(
  infraMetadata: InfraMetadata,
  db: DBResource,
  monitorExecWorker: MonitorExecWorkerResource,
) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const entrypoint = resolve(__dirname, "../src/monitor-trigger.ts")

  return await Worker(infraMetadata.monitorTriggerName, {
    name: infraMetadata.monitorTriggerName,
    entrypoint: entrypoint,
    rpc: type<MonitorTriggerRPC>,
    bindings: {
      DB: db,
      MONITOR_EXEC: monitorExecWorker,
      MONITOR_TRIGGER: new DurableObjectNamespace<MonitorTrigger>(
        `${infraMetadata.monitorTriggerName}-do`,
        {
          className: "MonitorTrigger",
          sqlite: true,
        },
      ),
      MONITOR_EXEC_NAME: infraMetadata.monitorExecName,
      MONITOR_TRIGGER_NAME: infraMetadata.monitorTriggerName,
      CLOUDFLARE_ACCOUNT_ID: infraMetadata.cloudflareAccountId,
    },
  })
}
export type MonitorTriggerWorkerResource = Awaited<
  ReturnType<typeof createMonitorTriggerWorker>
>
