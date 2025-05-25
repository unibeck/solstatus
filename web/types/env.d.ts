import type { site } from "@root/infra.config"

export type WorkerEnv = typeof site.Env

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends WorkerEnv {}
  }
}
