import type { monitorExecWorker, monitorTriggerWorker } from "@solstatus/infra"

export type MonitorExecEnv = typeof monitorExecWorker.Env
export type MonitorTriggerEnv = typeof monitorTriggerWorker.Env
