import type { app } from "@/alchemy.run"

export type WorkerEnv = typeof app.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends WorkerEnv {}
  }
}
