import type { monitorExecWorker } from "@solstatus/infra"

export type MonitorExecEnv = typeof monitorExecWorker.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends MonitorExecEnv {}
  }
}
