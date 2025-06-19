#!/usr/bin/env tsx

import { execSync } from "node:child_process"
import fs from "node:fs"
import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import { Command, Options } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import dotenv from "dotenv"
import { Console, Effect, Option, pipe } from "effect"
import packageJson from "../package.json" with { type: "json" }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env file if it exists
const envPath = path.resolve(process.cwd(), ".env")
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath })
}

// Define options
const cloudflareAccountId = Options.text("cloudflare-account-id").pipe(
  Options.withDescription("Cloudflare Account ID"),
  Options.optional,
)

const cloudflareApiToken = Options.text("cloudflare-api-token").pipe(
  Options.withDescription("Cloudflare API Token"),
  Options.optional,
)

const alchemyPassphrase = Options.text("alchemy-passphrase").pipe(
  Options.withDescription("Alchemy Passphrase for state secrets"),
  Options.optional,
)

const stage = Options.text("stage").pipe(
  Options.withDescription("Deployment stage (default: dev)"),
  Options.withDefault("dev"),
)

const phase = Options.choice("phase", ["destroy", "up", "read"]).pipe(
  Options.withDescription("Phase to execute"),
  Options.withDefault("up" as const),
)

const quiet = Options.boolean("quiet").pipe(
  Options.withDescription("Run in quiet mode"),
  Options.withDefault(false),
)

const appName = Options.text("app-name").pipe(
  Options.withDescription("Application name (default: solstatus)"),
  Options.withDefault("solstatus"),
)

const fqdn = Options.text("fqdn").pipe(
  Options.withDescription("Fully qualified domain name (required)"),
)

// Create the main command
const main = Command.make(
  "solstatus",
  {
    cloudflareAccountId,
    cloudflareApiToken,
    alchemyPassphrase,
    stage,
    phase,
    quiet,
    appName,
    fqdn,
  },
  (config) => {
    return Effect.gen(function* () {
      // Get Cloudflare credentials
      const accountId = Option.getOrElse(
        config.cloudflareAccountId,
        () => process.env.CLOUDFLARE_ACCOUNT_ID || "",
      )

      const apiToken = Option.getOrElse(
        config.cloudflareApiToken,
        () => process.env.CLOUDFLARE_API_TOKEN || "",
      )

      // Validate Cloudflare credentials
      if (!accountId || !apiToken) {
        yield* Console.error(
          "Error: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be provided via CLI flags, .env file, or environment variables",
        )
        return yield* Effect.fail(1)
      }

      const alchemyPassphrase = Option.getOrElse(
        config.alchemyPassphrase,
        () => process.env.SECRET_ALCHEMY_PASSPHRASE || "",
      )

      if (!alchemyPassphrase) {
        yield* Console.error(
          "Error: SECRET_ALCHEMY_PASSPHRASE must be provided via CLI flags, .env file, or environment variables",
        )
        return yield* Effect.fail(1)
      }

      // Prepare environment variables
      const env = {
        ...process.env,
        CLOUDFLARE_ACCOUNT_ID: accountId,
        CLOUDFLARE_API_TOKEN: apiToken,
        ALCHEMY_STATE_TOKEN: apiToken,
        SECRET_ALCHEMY_PASSPHRASE: alchemyPassphrase,
        APP_NAME: config.appName,
        FQDN: config.fqdn,
      }

      // Build command arguments
      const args = [config.phase, config.stage]
      if (config.quiet) {
        args.push("--quiet")
      }

      // Construct the command
      const alchemyRunPath = path.join(
        __dirname,
        "../packages/infra/src/alchemy.run.ts",
      )
      const command = `tsx ${alchemyRunPath} ${args.join(" ")}`

      try {
        // Execute the command
        execSync(command, {
          env,
          stdio: "inherit",
          cwd: __dirname,
        })

        yield* Console.log("\n✅ Command executed successfully")
      } catch (error) {
        yield* Console.error(`\n❌ Command failed: ${error}`)
        return yield* Effect.fail(1)
      }
    })
  },
).pipe(
  Command.withDescription(
    "CLI wrapper for SolStatus infrastructure management",
  ),
)

// Run the CLI
const cli = Command.run(main, {
  name: "SolStatus",
  version: packageJson.version,
})

pipe(cli(process.argv), Effect.provide(NodeContext.layer), NodeRuntime.runMain)
