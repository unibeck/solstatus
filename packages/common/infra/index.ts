import { D1Database, KVNamespace } from "alchemy/cloudflare"

const APP_NAME = "solstatus"
const stage = process.argv[3] || "dev"
const phase = process.argv[2] === "destroy" ? "destroy" : "up"
const RES_PREFIX = `${APP_NAME}-${stage}`
console.log(`${RES_PREFIX}: ${phase}`)

export const kv = await KVNamespace(`${RES_PREFIX}-app-sessions-storage`, {
  title: `${RES_PREFIX}-app-sessions-storage`,
  adopt: true,
})

export const db = await D1Database(`${RES_PREFIX}-db`, {
  name: `${RES_PREFIX}-db`,
  adopt: true,
  migrationsDir: "src/db/migrations",
  primaryLocationHint: "enam",
  readReplication: {
    mode: "auto",
  },
})
