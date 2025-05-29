import alchemy from "alchemy"
import { D1Database, DurableObjectNamespace, KVNamespace, Website } from "alchemy/cloudflare"
import { MonitorExec } from "@solstatus/api/src"
// import { MonitorExec } from "@solstatus/api/src/monitor-exec.js"

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

const monitorExecDO = new DurableObjectNamespace<MonitorExec>(`${RES_PREFIX}-monitor-exec`, {
  className: "MonitorExec",
  sqlite: true
});

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
    MONITOR_EXEC: monitorExecDO,
  },
})
console.log(`${RES_PREFIX}-app: ${app.url}`)

await infra.finalize()
