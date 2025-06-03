import type { AppContext } from "#/worker"

declare module "rwsdk/worker" {
  interface DefaultAppContext extends AppContext {}
}
