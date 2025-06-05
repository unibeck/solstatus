import "dotenv/config"
import { resolve } from "node:path"
import { type Config, defineConfig } from "drizzle-kit"

// export default defineConfig({
//   // out: "./migrations",
//   // schema: "./schema",
//   out: resolve(__dirname, './migrations'),
//   schema: resolve(__dirname, './schema'),
//   dialect: "sqlite",
//   driver: "d1-http",
//   dbCredentials: {
//     databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
//     accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
//     token: process.env.CLOUDFLARE_D1_TOKEN ?? "",
//   },
// })

export const createDatabaseConfig = (databaseId: string, accountId: string, token: string): Config => {
  console.log("databaseId", databaseId)
  return defineConfig({
    out: resolve(__dirname, './migrations'),
    schema: resolve(__dirname, './schema'),
    // out: "./migrations",
    // schema: "./schema",
    dialect: "sqlite",
    driver: "d1-http",
    dbCredentials: {
      databaseId,
      accountId,
      token,
    },
  });
};
