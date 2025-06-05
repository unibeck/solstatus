#!/usr/bin/env tsx

import { createMonitorExecWorker, createMonitorTriggerWorker } from "@solstatus/api/infra"
import { createApp } from "@solstatus/app/infra"
import { createDB, createSessionsStorageKV } from "@solstatus/common/infra"
import alchemy from "alchemy"

const APP_NAME = "solstatus"
const stage = process.argv[3] || "dev"
const phase = process.argv[2] === "destroy" ? "destroy" : "up"
const resPrefix = `${APP_NAME}-${stage}`
console.log(`${resPrefix}: ${phase}`)

const infra = await alchemy(APP_NAME, {
  stage: stage,
  phase: phase,
  quiet: process.argv.includes("--quiet"),
  password: process.env.SECRET_ALCHEMY_PASSPHRASE,
})

// Shared resources
const sessionsStorageKV = await createSessionsStorageKV(resPrefix)
const db = await createDB(resPrefix)

// API resources
export const monitorExecWorker = await createMonitorExecWorker(resPrefix, db)
export const monitorTriggerWorker = await createMonitorTriggerWorker(resPrefix, db, monitorExecWorker)

// App resources
export const app = await createApp(resPrefix, db, sessionsStorageKV, monitorExecWorker)

await infra.finalize()
