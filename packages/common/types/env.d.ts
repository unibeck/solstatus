import type { app } from "@solstatus/infra"

export type WorkerEnv = typeof app.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends WorkerEnv {}
  }
}
