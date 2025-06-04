import alchemy, { type } from "alchemy"
import { Worker, D1Database, DurableObjectNamespace, KVNamespace, Website } from "alchemy/cloudflare"
import type { MonitorExec, MonitorTrigger, MonitorTriggerRPC } from "@solstatus/api"

const APP_NAME = "solstatus"
const stage = process.argv[3] || "dev"
const phase = process.argv[2] === "destroy" ? "destroy" : "up"
const RES_PREFIX = `${APP_NAME}-${stage}`
console.log(`${RES_PREFIX}: ${phase}`)

const infra = await alchemy(APP_NAME, {
  stage: stage,
  phase: phase,
  quiet: process.argv.includes("--quiet"),
  password: process.env.SECRET_ALCHEMY_PASSPHRASE,
})

const kv = await KVNamespace(`${RES_PREFIX}-app-sessions-storage`, {
  title: `${RES_PREFIX}-app-sessions-storage`,
  adopt: true,
})

const db = await D1Database(`${RES_PREFIX}-db`, {
  name: `${RES_PREFIX}-db`,
  adopt: true,
  migrationsDir: "src/db/migrations",
  primaryLocationHint: "enam",
  readReplication: {
    mode: "auto",
  },
})

export const monitorExecWorker = await Worker(`${RES_PREFIX}-monitor-exec`, {
  name: `${RES_PREFIX}-monitor-exec`,
  entrypoint: require.resolve("@solstatus/api/monitor-exec"),
  rpc: type<MonitorExec>,
  bindings:{
    DB: db,
    OPSGENIE_API_KEY: alchemy.secret(process.env.OPSGENIE_API_KEY),
    APP_ENV: stage,
  }
})

export const monitorTriggerWorker = await Worker(`${RES_PREFIX}-monitor-trigger`, {
  name: `${RES_PREFIX}-monitor-trigger`,
  entrypoint: require.resolve("@solstatus/api/monitor-trigger"),
  rpc: type<MonitorTriggerRPC>,
  bindings: {
    DB: db,
    MONITOR_EXEC: monitorExecWorker,
    MONITOR_TRIGGER: new DurableObjectNamespace<MonitorTrigger>(`${RES_PREFIX}-monitor-trigger`, {
      className: "MonitorTrigger",
      sqlite: true
    }),
  }
})

export const app = await Website(`${RES_PREFIX}-app`, {
  name: `${RES_PREFIX}-app`,
  command: "bun clean && bun run build",
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
    SESSIONS_KV: kv,
    BETTER_AUTH_SECRET: alchemy.secret(process.env.BETTER_AUTH_SECRET),
    MONITOR_EXEC: monitorExecWorker,
  },
})
console.log(`${RES_PREFIX}-app: ${app.url}`)

await infra.finalize()
