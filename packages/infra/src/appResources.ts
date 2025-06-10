import {
  createMonitorExecWorker,
  createMonitorTriggerWorker,
} from "@solstatus/api/infra"
import { createApp } from "@solstatus/app/infra"
import { createDB, createSessionsStorageKV } from "@solstatus/common/infra"

export async function run(resPrefix: string, stage: string) {
  // Shared resources
  const sessionsStorageKV = await createSessionsStorageKV(resPrefix)
  const db = await createDB(resPrefix)

  // API resources
  const monitorExecWorker = await createMonitorExecWorker(resPrefix, stage, db)
  const monitorTriggerWorker = await createMonitorTriggerWorker(
    resPrefix,
    db,
    monitorExecWorker,
  )

  // App resources
  const app = await createApp(
    resPrefix,
    db,
    sessionsStorageKV,
    monitorExecWorker,
    monitorTriggerWorker,
  )

  return {
    sessionsStorageKV,
    db,
    monitorExecWorker,
    monitorTriggerWorker,
    app,
  }
}
