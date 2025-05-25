# SolStatus Migration to RedwoodSDK

This document outlines the migration of SolStatus from NextJS to RedwoodSDK.

## What is RedwoodSDK?

RedwoodSDK is a React framework for Cloudflare with minimal abstraction. It provides:
- Server and client components
- API routes
- Cloudflare integration (Workers, D1, Durable Objects)
- Built-in routing
- Authentication
- And more

## Migration Overview

The migration involved several key changes:

1. **Project Structure**: Moving from Next.js structure to RedwoodSDK structure
   - `/src/routes` for page components
   - `/src/api` for API endpoints
   - `/src/components` for shared components
   - `/src/lib` for utility functions
   - `/src/workers` for Cloudflare Workers

2. **Database**: Migrated from Drizzle ORM to Prisma ORM
   - Schema defined in `/prisma/schema.prisma`
   - Helper functions in `/src/lib/prisma.ts` and `/src/lib/db.ts`

3. **Routing**: Changed from Next.js App Router to RedwoodSDK routing
   - Pages in `/src/routes` directory
   - Dynamic routes using `$parameter.tsx` naming convention
   - API routes in `/src/api` directory

4. **Workers**: Implemented Cloudflare Workers using RedwoodSDK patterns
   - Monitor trigger worker in `/src/workers/monitor-trigger.ts`
   - Monitor execution worker in `/src/workers/monitor-exec.ts`

5. **Components**: Adapted React components to work with RedwoodSDK
   - Updated imports and APIs
   - Replaced Next.js specific hooks with RedwoodSDK equivalents

## Configuration Files

- `app.config.ts`: Main application configuration
- `rwsdk.config.ts`: RedwoodSDK specific configuration

## Running the Application

```sh
# Development
pnpm dev

# Build
pnpm build

# Deploy
pnpm deploy
```

## Key Differences from Next.js

1. RedwoodSDK uses a simpler API for routing and API endpoints
2. Database integration is handled through Prisma instead of Drizzle
3. Worker configuration is more integrated into the application codebase
4. Authentication is handled through RedwoodSDK's built-in auth system

## Future Improvements

1. Implement comprehensive testing
2. Optimize build process and deployment
3. Enhance worker functionality
4. Add additional RedwoodSDK features like Storybook integration