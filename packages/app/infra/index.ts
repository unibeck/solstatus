import type {
  MonitorExecWorkerResource,
  MonitorTriggerWorkerResource,
} from "@solstatus/api/infra"
import type {
  DBResource,
  SessionsStorageKVResource,
} from "@solstatus/common/infra"
import alchemy from "alchemy"
import { KVNamespace, Website } from "alchemy/cloudflare"

export async function createApp(
  resPrefix: string,
  db: DBResource,
  sessionsStorageKV: SessionsStorageKVResource,
  monitorExecWorker: MonitorExecWorkerResource,
  monitorTriggerWorker: MonitorTriggerWorkerResource,
  fqdn: string,
) {
  const appName = `${resPrefix}-app`

  const kvIncrementalCache = await KVNamespace(`${appName}-inc-cache`, {
    title: `${appName}-inc-cache`,
  })

  const app = await Website(appName, {
    name: appName,
    // command: "pnpm clean && pnpm run build:opennextjs",
    main: ".open-next/worker.js",
    assets: ".open-next/assets",
    url: false,
    compatibilityFlags: ["nodejs_compat"],
    observability: {
      enabled: true,
    },
    routes: [
      {
        pattern: `${fqdn}/*`,
        customDomain: true,
      },
    ],
    bindings: {
      DB: db,
      SESSIONS_KV: sessionsStorageKV,
      BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET),
      MONITOR_EXEC: monitorExecWorker,
      MONITOR_TRIGGER_RPC: monitorTriggerWorker,
      NEXT_INC_CACHE_KV: kvIncrementalCache,
    },
  })
  console.log(`${appName}: https://${fqdn}`)
  return app
}
export type AppResource = Awaited<ReturnType<typeof createApp>>
