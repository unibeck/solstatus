import path from "node:path"
import {
  createMonitorExecWorker,
  createMonitorTriggerWorker,
} from "@solstatus/api/infra"
import { createApp } from "@solstatus/app/infra"
import { createDB, createSessionsStorageKV } from "@solstatus/common/infra"

export interface SolStatusConfig {
  stage: string
  fqdn: string
  cloudflareAccountId: string
}

export async function SolStatus(name: string, config: SolStatusConfig) {
  const { stage, fqdn, cloudflareAccountId } = config

  // Shared resources
  const sessionsStorageKV = await createSessionsStorageKV(name)
  const db = await createDB(name)

  // API resources
  const monitorExecWorker = await createMonitorExecWorker(name, stage, db)
  const monitorTriggerWorker = await createMonitorTriggerWorker(
    name,
    db,
    monitorExecWorker,
  )

  // App resources
  const originalCwd = process.cwd()
  const appDir = path.join(process.cwd(), '../packages/app')
  process.chdir(appDir)
  
  const app = await createApp(
    name,
    db,
    sessionsStorageKV,
    monitorExecWorker,
    monitorTriggerWorker,
    fqdn,
    cloudflareAccountId,
  )
  
  // Restore original directory
  process.chdir(originalCwd)

  return {
    sessionsStorageKV,
    db,
    monitorExecWorker,
    monitorTriggerWorker,
    app,
  }
}
