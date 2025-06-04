import { createMonitorExecWorker, createMonitorTriggerWorker } from "@solstatus/api/infra"
import { createDB, createKV } from "@solstatus/common/infra"
import alchemy from "alchemy"
import { Website } from "alchemy/cloudflare"

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

// Create common resources
export const kv = await createKV()
export const db = await createDB()

// Create API resources
export const monitorExecWorker = await createMonitorExecWorker(db)
export const monitorTriggerWorker = await createMonitorTriggerWorker(db, monitorExecWorker)

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
