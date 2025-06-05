import type { AppEnv } from "#/infra/types/env"

declare module "cloudflare:workers" {
  namespace Cloudflare {
    export interface Env extends AppEnv {}
  }
}
