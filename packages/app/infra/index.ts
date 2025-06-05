import type { MonitorExecWorkerResource } from "@solstatus/api/infra"
import type { DBResource, SessionsStorageKVResource } from "@solstatus/common/infra"
import alchemy from "alchemy"
import { Website } from "alchemy/cloudflare"

export async function createApp(resPrefix: string, db: DBResource, sessionsStorageKV: SessionsStorageKVResource, monitorExecWorker: MonitorExecWorkerResource) {
  const appName = `${resPrefix}-app`
  const app = await Website(appName, {
    name: appName,
    command: "pnpm clean && pnpm run build",
    main: "dist/worker/worker.js",
    assets: "dist/client",
    wrangler: {
      main: "src/worker.tsx",
    },
    compatibilityFlags: ["nodejs_compat"],
    observability: {
      enabled: true,
    },
    bindings: {
      DB: db,
      SESSIONS_KV: sessionsStorageKV,
      BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET),
      MONITOR_EXEC: monitorExecWorker,
    },
  })
  console.log(`${appName}: ${app.url}`)
  return app  
}
export type AppResource = Awaited<ReturnType<typeof createApp>>
