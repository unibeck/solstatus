import alchemy from "alchemy"
import { D1Database, KVNamespace, Website } from "alchemy/cloudflare"

const APP_NAME = "fullstack-cf-example"

const app = await alchemy(APP_NAME, {
  phase: process.argv[2] === "destroy" ? "destroy" : "up",
  stage: process.argv[3],
  quiet: process.argv.includes("--quiet"),
  password: process.env.SECRET_ALCHEMY_PASSPHRASE,
})

const kv = await KVNamespace("site-sessions-storage", {
  title: `${APP_NAME}-site-sessions-storage`,
  adopt: true,
})

const db = await D1Database("site-users-db", {
  name: `${APP_NAME}-site-users-db`,
  adopt: true,
  migrationsDir: "src/db/migrations",
  primaryLocationHint: "wnam",
  readReplication: {
    mode: "auto",
  },
})

export const site = await Website("site", {
  name: `${APP_NAME}-site`,
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
  },
})

console.log(`➜  Cloudflare:   ${site.url}`)

await app.finalize()
