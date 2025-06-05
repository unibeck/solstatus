import { D1Database, KVNamespace } from "alchemy/cloudflare"

export async function createSessionsStorageKV(resPrefix: string) {
  const kvName = `${resPrefix}-sessions-storage`
  return await KVNamespace(kvName, {
    title: kvName,
    adopt: true,
  })
}
export type SessionsStorageKVResource = Awaited<ReturnType<typeof createSessionsStorageKV>>

export async function createDB(resPrefix: string): Promise<D1Database> {
  const dbName = `${resPrefix}-db`
  return await D1Database(dbName, {
    name: dbName,
    adopt: true,
    migrationsDir: "src/db/migrations",
    primaryLocationHint: "enam",
    readReplication: {
      mode: "auto",
    },
  })
}
export type DBResource = Awaited<ReturnType<typeof createDB>>
