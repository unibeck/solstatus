import { createDatabaseConfig } from "@solstatus/common/drizzle"

const databaseConfig = createDatabaseConfig(
  process.env.CLOUDFLARE_DATABASE_ID ?? "",
  process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
  process.env.CLOUDFLARE_D1_TOKEN ?? "",
)

export default databaseConfig
