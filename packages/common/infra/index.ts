import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { D1Database, KVNamespace } from "alchemy/cloudflare"

export async function createSessionsStorageKV(resPrefix: string) {
  const kvName = `${resPrefix}-sessions-storage`
  return await KVNamespace(kvName, {
    title: kvName,
    adopt: true,
  })
}
export type SessionsStorageKVResource = Awaited<
  ReturnType<typeof createSessionsStorageKV>
>

export async function createDB(resPrefix: string): Promise<D1Database> {
  const dbName = `${resPrefix}`
  // TODO: migrate from solstatus-prod to solstatus-prod-db eventually (https://developers.cloudflare.com/d1/best-practices/import-export-data/)
  // const dbName = `${resPrefix}-db`

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const migrationsDir = resolve(__dirname, "../src/db/migrations")

  return await D1Database(dbName, {
    name: dbName,
    adopt: true,
    migrationsDir: migrationsDir,
    primaryLocationHint: "enam",
    readReplication: {
      mode: "auto",
    },
  })
}
export type DBResource = Awaited<ReturnType<typeof createDB>>
