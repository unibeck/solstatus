import type { monitorExecWorker, monitorTriggerWorker } from "#/infra/index"

export type MonitorExecEnv = typeof monitorExecWorker.Env
export type MonitorTriggerEnv = typeof monitorTriggerWorker.Env
