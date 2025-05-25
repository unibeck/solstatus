[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/unibeck/solstatus)
![GitHub](https://img.shields.io/github/license/unibeck/solstatus)
![GitHub release (with filter)](https://img.shields.io/github/v/release/unibeck/solstatus)
![GitHub contributors](https://img.shields.io/github/contributors/unibeck/solstatus)
![GitHub commits since latest release (by SemVer including pre-releases)](https://img.shields.io/github/commits-since/unibeck/solstatus/latest)

# SolStatus

An uptime monitoring service that is easy and cheap to run at scale. Create endpoint checks for uptime, latency, and status code. Supports OpsGenie, for alerts when there are two or more consecutive failures.

> **Note:** This project is being migrated from NextJS to RedwoodSDK. See [the migration guide](./docs/REDWOOD_MIGRATION.md) for details.

![Demo dashboard](./docs/dashboard-demo.gif)

TODO: expectations for cost

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
