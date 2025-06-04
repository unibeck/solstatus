import type { monitorExecWorker, monitorTriggerWorker } from "#/infra"

export type MonitorExecEnv = typeof monitorExecWorker.Env
export type MonitorTriggerEnv = typeof monitorTriggerWorker.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends MonitorExecEnv, MonitorTriggerEnv {}
  }
}
