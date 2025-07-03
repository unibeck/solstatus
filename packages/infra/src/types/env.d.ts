import type {
  app,
  monitorExecWorker,
  monitorTriggerWorker,
} from "@/alchemy.run"

export type MonitorExecEnv = typeof monitorExecWorker.Env
export type MonitorTriggerEnv = typeof monitorTriggerWorker.Env
export type AppEnv = typeof app.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends MonitorExecEnv, MonitorTriggerEnv, AppEnv {}
  }
}
