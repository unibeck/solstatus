import type { site } from "@root/alchemy.run"

export type WorkerEnv = typeof site.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends WorkerEnv {}
  }
}
