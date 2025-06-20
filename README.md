[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/unibeck/solstatus)
![GitHub](https://img.shields.io/github/license/unibeck/solstatus)
![GitHub release (with filter)](https://img.shields.io/github/v/release/unibeck/solstatus)
![GitHub contributors](https://img.shields.io/github/contributors/unibeck/solstatus)
![GitHub commits since latest release (by SemVer including pre-releases)](https://img.shields.io/github/commits-since/unibeck/solstatus/latest)

# SolStatus

An uptime monitoring service that is easy and cheap to run at scale. Create endpoint checks for uptime, latency, and status code. Supports OpsGenie, for alerts when there are two or more consecutive failures.

![Demo dashboard](./docs/dashboard-demo.gif)

## Quick Start

```bash
# Install dependencies
pnpm i

# Run the CLI
pnpm cli --help
```

### Common Commands

```bash
# Deploy infrastructure
pnpm cli --fqdn uptime.example.com

# Deploy to production
pnpm cli --fqdn uptime.example.com --stage prod

# Destroy infrastructure
pnpm cli --fqdn uptime.example.com --phase destroy
```

## v2 TODO:
- Release notes:
    - Imperative to update to latest v1.x version before upgrading to v2
    - Migration code for a breaking change from v1.5 to v1.6 has been removed
    - to adopt previous services to IaC you need to rename the services to the new format:
        - Worker: `monitor-exec-production` -> `solstatus-prod-monitor-exec`
        - Worker: `monitor-trigger-production` -> `solstatus-prod-monitor-trigger`
        - Worker: `solstatus-production` -> `solstatus-prod-app`
    - [] test upgrade from v1.x to v2.x
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
- [x] fix infra entrypoint for monitor-exec and monitor-trigger(?)
- [] implement adopt logic for alchemy
- [x] update .env.example files
- [] document token permissions needed for the infra
- [] test
    - [x] test fresh install
    - [] test upgrade from v1.x to v2.x
- [x] update dependabot to use pnpm catalogs as well
- [x] create solstatus CLI
    - use effect/cli (https://raw.githubusercontent.com/Effect-TS/effect/refs/heads/main/packages/cli/README.md)
    - v2.0
        - fork repo and run local script to trigger cli

## Local Dev

For a holistic dev experience, it is best to run dev from the root of the repo.

### Init

First, copy the `./packages/infra/.dev.vars.example` file to `./packages/infra/.dev.vars`.

Then, run the following command to confirm you're using the correct CF account:
and run to confirm you're using the correct CF account:
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

See the [infra README](./packages/infra/README.md#database-management) for more details.

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
