#!/usr/bin/env tsx

import { execSync } from "node:child_process"
import { randomBytes } from "node:crypto"
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

const secretAlchemyPassphrase = Options.text("secret-alchemy-passphrase").pipe(
  Options.withDescription("Alchemy Passphrase for state secrets"),
  Options.optional,
)

const betterAuthSecret = Options.text("better-auth-secret").pipe(
  Options.withDescription("Better Auth Secret for authentication"),
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
  Options.withDescription(
    "Fully qualified domain name (optional - if not provided, a worker URL will be generated)",
  ),
  Options.optional,
)

// Create the main command
const main = Command.make(
  "solstatus",
  {
    cloudflareAccountId,
    cloudflareApiToken,
    secretAlchemyPassphrase,
    betterAuthSecret,
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

      let secretAlchemyPassphrase = Option.getOrElse(
        config.secretAlchemyPassphrase,
        () => process.env.SECRET_ALCHEMY_PASSPHRASE || "",
      )

      if (!secretAlchemyPassphrase) {
        // Generate a random 32-character hex passphrase
        secretAlchemyPassphrase = randomBytes(16).toString("hex")

        yield* Console.log(
          "🔑 No --secret-alchemy-passphrase or env.SECRET_ALCHEMY_PASSPHRASE provided. Generating new passphrase...",
        )

        // Read existing .env file or create empty content
        let envContent = ""
        if (fs.existsSync(envPath)) {
          envContent = fs.readFileSync(envPath, "utf-8")
        }

        // Add new passphrase to .env file
        if (envContent && !envContent.endsWith("\n")) {
          envContent += "\n"
        }
        envContent += `SECRET_ALCHEMY_PASSPHRASE="${secretAlchemyPassphrase}"\n`

        // Write to .env file
        fs.writeFileSync(envPath, envContent)

        yield* Console.log(
          `✅ Generated and saved new passphrase to ${envPath}`,
        )
      }

      let betterAuthSecret = Option.getOrElse(
        config.betterAuthSecret,
        () => process.env.BETTER_AUTH_SECRET || "",
      )

      if (!betterAuthSecret) {
        // Generate a random 32-character hex passphrase
        betterAuthSecret = randomBytes(16).toString("hex")

        yield* Console.log(
          "🔑 No --better-auth-secret or env.BETTER_AUTH_SECRET provided. Generating new secret...",
        )

        // Read existing .env file or create empty content
        let envContent = ""
        if (fs.existsSync(envPath)) {
          envContent = fs.readFileSync(envPath, "utf-8")
        }

        // Add new secret to .env file
        if (envContent && !envContent.endsWith("\n")) {
          envContent += "\n"
        }
        envContent += `BETTER_AUTH_SECRET="${betterAuthSecret}"\n`

        // Write to .env file
        fs.writeFileSync(envPath, envContent)

        yield* Console.log(`✅ Generated and saved new secret to ${envPath}`)
      }

      // Get optional FQDN
      const fqdnValue = Option.getOrElse(config.fqdn, () => "")

      // Prepare environment variables
      const env = {
        ...process.env,
        CLOUDFLARE_ACCOUNT_ID: accountId,
        CLOUDFLARE_API_TOKEN: apiToken,
        ALCHEMY_STATE_TOKEN: apiToken,
        SECRET_ALCHEMY_PASSPHRASE: secretAlchemyPassphrase,
        BETTER_AUTH_SECRET: betterAuthSecret,
        APP_NAME: config.appName,
        ...(fqdnValue && { FQDN: fqdnValue }),
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
