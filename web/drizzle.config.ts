import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
})
