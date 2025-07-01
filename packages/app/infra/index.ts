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
  fqdn: string | undefined,
  cloudflareAccountId: string,
) {
  const appName = `${resPrefix}-app`

  const kvIncrementalCache = await KVNamespace(`${appName}-inc-cache`, {
    title: `${appName}-inc-cache`,
    adopt: true,
  })

  const app = await Website(appName, {
    name: appName,
    // command: "pnpm build:opennextjs",
    main: ".open-next/worker.js",
    assets: ".open-next/assets",
    url: !fqdn,
    compatibilityFlags: ["nodejs_compat"],
    observability: {
      enabled: true,
    },
    wrangler: false,
    ...(fqdn && {
      domains: [
        {
          domainName: fqdn,
          adopt: true,
        },
      ],
    }),
    bindings: {
      DB: db,
      SESSIONS_KV: sessionsStorageKV,
      BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET),
      MONITOR_EXEC: monitorExecWorker,
      MONITOR_TRIGGER_RPC: monitorTriggerWorker,
      NEXT_INC_CACHE_KV: kvIncrementalCache,
      MONITOR_EXEC_NAME: monitorExecWorker.name,
      MONITOR_TRIGGER_NAME: monitorTriggerWorker.name,
      CLOUDFLARE_ACCOUNT_ID: cloudflareAccountId,
    },
  })

  if (fqdn) {
    console.log(`${appName}: https://${fqdn}`)
  } else {
    console.log(`${appName}: ${app.url}`)
  }
  return app
}
export type AppResource = Awaited<ReturnType<typeof createApp>>
