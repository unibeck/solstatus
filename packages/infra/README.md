# @solstatus/infra

Infrastructure configuration and deployment tools for SolStatus uptime monitoring service.

## Installation

```bash
pnpm i @solstatus/infra
```

## Overview

This package provides infrastructure as code and deployment tools for SolStatus:

- Alchemy-based infrastructure deployment
- Wrangler configurations for Cloudflare Workers
- Database migration management
- Development and production environment setup

## Key Components

- **Alchemy Configuration**: Infrastructure as code using Alchemy framework
- **Database Management**: D1 database creation, migrations, and seeding
- **Wrangler Configs**: Cloudflare Workers configuration templates

## Development

```bash
# Deploy infrastructure
pnpm infra:up

# Destroy infrastructure
pnpm infra:destroy

# Database setup
pnpm db:setup

# Run migrations
pnpm db:migrate
```
