declare namespace Cloudflare {
  type AppEnv = import("@/infra/types/env").AppEnv
	interface Env extends AppEnv {}
}
interface CloudflareEnv extends Cloudflare.Env {}
