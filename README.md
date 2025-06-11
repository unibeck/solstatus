[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/unibeck/solstatus)
![GitHub](https://img.shields.io/github/license/unibeck/solstatus)
![GitHub release (with filter)](https://img.shields.io/github/v/release/unibeck/solstatus)
![GitHub contributors](https://img.shields.io/github/contributors/unibeck/solstatus)
![GitHub commits since latest release (by SemVer including pre-releases)](https://img.shields.io/github/commits-since/unibeck/solstatus/latest)

# SolStatus

An uptime monitoring service that is easy and cheap to run at scale. Create endpoint checks for uptime, latency, and status code. Supports OpsGenie, for alerts when there are two or more consecutive failures.

![Demo dashboard](./docs/dashboard-demo.gif)

TODO: expectations for cost

## Usage

| Method | Notes | Complexity | Customization |
|--------|-------|------------|---------------|
| `npx solstatus@latest` | Install complete SolStatus stack into Cloudflare account | Low | Low |
| Fork repo | Customize, but syncing with upstream in mind | Medium | High |
| `pnpm i @solstatus/infra` | Use as library alongside other Alchemy IaC | Medium | Medium |


### Quick Start

```bash
# Install dependencies
pnpm i

# Run the CLI
pnpm cli --help
```

### Required Options

- `--fqdn <domain>` - Fully qualified domain name (required)

### Common Commands

```bash
# Deploy infrastructure
pnpm cli --fqdn uptime.example.com

# Deploy to production
pnpm cli --fqdn uptime.example.com --stage production

# Destroy infrastructure
pnpm cli --fqdn uptime.example.com --phase destroy
```

See `pnpm cli --help` for all available options and the full CLI documentation below.

## v2 TODO:
- Release notes:
    - Imperative to update to latest v1.x version before upgrading to v2
    - Migration code for a breaking change from v1.5 to v1.6 has been removed 
- [x] fix useform ssr
- [x] implement bun workspaces/catalog
- [x] Reconsider pnpm in favor of bun
- [x] fix monorepo deps and types
- [x] use https://www.npmjs.com/package/http-status-codes instead of stoker
- [x] remove all next/nextjs references
- [x] app version
- [x] rpc type inference https://x.com/samgoodwin89/status/1928040299030343994
- [x] update CI
    - [x] add a step to check types
- [x] circular dependency (api -> infra -> api) via tsconfig.json references
    - accomplish this by moving api specific infra to the api package, common infra to the common package, and app specific infra to the app package. 
    - The infra package will then be a package that combines all of the infra code together(?)
- [x] catalog all drizzle libs
- [] update bootstrap script
- [x] fix infra entrypoint for monitor-exec and monitor-trigger(?)
- [] implement adopt logic for alchemy
- [] test
    - [] test fresh install
    - [] test upgrade from v1.x to v2.x
- [x] update dependabot to use pnpm catalogs as well
- [x] create solstatus CLI
    - use effect/cli (https://raw.githubusercontent.com/Effect-TS/effect/refs/heads/main/packages/cli/README.md)
    - v2.0
        - fork repo and run local script to trigger cli
    - v2.x
        - publish packages
        - use npx solstatus
        - does this clone the repo or just use it as a package?
- [] ci/cd
    - [] add preview infra deploy (https://github.com/sam-goodwin/alchemy/blob/main/.github/workflows/pr-preview.yml) 

## v2.1 TODO:
- [] Worker for Platforms to create a new worker per synthetic monitor (https://x.com/samgoodwin89/status/1926034269543035252)

## Quick Deploy

0) Fork the repo
1) Copy and fill out
    - `.env.example` -> `.env`
2) Create production D1 database
    - run `pnpm db:create:prod`
    - search for `UPDATE_ME_D1_ID` and replace with the id
    - run migrations with `pnpm db:migrate:prod`
3) Update production fully qualified domain name
    - search for `UPDATE_ME_PROD_FQDN` and replace with your production FQDN (e.g. `solstatus.example.com`)
4) Deploy the app and api with `pnpm run deploy`

Optional:
- Search for `UPDATE_ME_ABC` and replace with your unique values

## Backend
Built 100% on Cloudflare, using Workers, Durable Objects, and D1. A quick explanation of the architecture:
- Each endpoint has its own Durable Object, known as the Trigger. This acts as a programmable CronJob via the Alarm API
- The Trigger calls a Worker, known as the Executioner. 
    - This is a fire and forget call via `waitUntil()` — minimizing the time the Durable Object is running and thus its cost (charged for Wall Time)
- The Executioner handles making the request to the respective endpoint and updating the DB
    - This is extremely cost effective since Workers are charged for CPU Time, and waiting on I/O tasks like this costs nothing 

You can find this code in the `./api` directory.

## Frontend
Standard NextJS v15, shadcn, TailwindCSS v4, and Drizzle stack. Some other notable points:
- pnpm as package manager
- biome as linter/formatter
- zustand for state management
- opennext with the CF adapter (not that it changes much)
- OpenAPI support via scalar

You can find this code in the `./src` directory.

## Local Dev

### Init
Fill out the env files and run to confirm you're using the correct CF account:
```sh
pnpm exec wrangler whoami
```

Run the migrations and (optionally) seed the database:
```sh
# this is a convenience script that runs db:touch, db:generate, db:migrate, and db:seed
pnpm db:setup
```

### Dev
This repo uses multiple workers, each split into their own workspace. To run everything together:

```sh
# Start both the API (monitor workers) and the Next.js app
pnpm dev
```

If you need to run components separately:

```sh
# Run just the API (includes both executor and trigger workers)
pnpm dev:api

# Run just the Next.js app
pnpm dev:app

# Run the API executor worker
pnpm dev:api-exec

# Run the API trigger worker
pnpm dev:api-trigger
```

### Deployment

To deploy the entire application:
```sh
pnpm run deploy
```

To deploy components separately:
```sh
# Deploy just the Next.js app
pnpm deploy:app

# Deploy just the API workers
pnpm deploy:api

# Deploy the API executor worker
pnpm deploy:api-exec

# Deploy the API trigger worker
pnpm deploy:api-trigger
```

### Maintenance
Update dependencies

Dependabot automatically creates pull requests for dependency updates weekly. For manual updates:
```sh
pnpm exec ncu -t minor -u
pnpm i
```

## Database Management

To generate the latest migration files, run:
```shell
pnpm run db:generate
```

Then, test the migration locally:
```shell
pnpm run db:migrate
```

To run the migration script for production:
```shell
pnpm run db:migrate:prod
```

To view/edit your database with Drizzle Studio:
```shell
# Local database
pnpm run db:studio

# Production database
pnpm run db:studio:prod
```

## CI/CD

### Dependency Management
This repository uses Dependabot to keep dependencies up to date:
- npm dependencies are checked weekly (grouped as minor and patch updates)
- GitHub Actions are checked monthly
- PR limits are set to avoid overwhelming with dependency updates

### npm Publishing
Packages are automatically published to npm when release-please creates tags:
- `solstatus` - Main CLI package
- `@solstatus/common` - Shared utilities and schemas
- `@solstatus/api` - API workers
- `@solstatus/app` - Web application
- `@solstatus/infra` - Infrastructure tools

To enable npm publishing:
1. Create an npm access token at https://www.npmjs.com/
2. Add it as a GitHub secret named `NPM_TOKEN`
3. Release-please will create tags that trigger the publish workflow

## CLI Documentation

### Options

#### Required Options

- `--fqdn <domain>` - Fully qualified domain name (required)

#### Optional Options

- `--cloudflare-account-id <id>` - Cloudflare Account ID (defaults to env var)
- `--cloudflare-api-token <token>` - Cloudflare API Token (defaults to env var)
- `--stage <stage>` - Deployment stage (default: "dev")
- `--phase <phase>` - Phase to execute: "destroy", "up", or "read" (default: "up")
- `--quiet` - Run in quiet mode (default: false)
- `--app-name <name>` - Application name (default: "solstatus")

#### Built-in Options

- `--help` or `-h` - Show help documentation
- `--version` - Show CLI version
- `--wizard` - Start wizard mode for interactive command building
- `--completions <shell>` - Generate shell completions (bash, sh, fish, zsh)
- `--log-level <level>` - Set minimum log level

### Environment Variables

The CLI will look for Cloudflare credentials in this order:
1. CLI flags (`--cloudflare-account-id`, `--cloudflare-api-token`)
2. `.env` file in the current directory
3. Process environment variables

Required environment variables if not provided via CLI flags:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Optional environment variables:
- `SECRET_ALCHEMY_PASSPHRASE`

### Examples

```bash
# Basic usage with required FQDN
pnpm cli --fqdn uptime.solstatus.com

# Deploy to production
pnpm cli --fqdn uptime.solstatus.com --stage production --phase up

# Destroy infrastructure
pnpm cli --fqdn uptime.solstatus.com --phase destroy

# With explicit Cloudflare credentials
pnpm cli --fqdn uptime.solstatus.com \
  --cloudflare-account-id YOUR_ACCOUNT_ID \
  --cloudflare-api-token YOUR_API_TOKEN

# Generate shell completions
source <(pnpm cli --completions bash)
```
