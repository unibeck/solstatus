import type { app, monitorExecWorker } from "@/alchemy.run"

export type MonitorExecEnv = typeof monitorExecWorker.Env
export type AppEnv = typeof app.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends MonitorExecEnv, AppEnv {}
  }
}
