# Fullstack cloudflare example

This repo contain a fullstack example to build on Cloudflare with the following stack:

## Stack

- **RedwoodSDK**: A React framework to run react 19 with SSR/RSC/ServerFunctions/etc.. on Cloudflare
- **Drizzle ORM**: Lightweight, type-safe SQL ORM with migrations
- **Better-auth**: Simple, flexible authentication library - The example is setup to use OTP
- **Alchemy**: Infrastructure-as-Code without the dead weight
- **Shadcn**: A set of beautifully-designed, accessible components to build your component library
- **Bun**: a fast JavaScript all-in-one toolkit

## Getting Started

### 1 Create your new project:

```shell
git clone https://github.com/nickbalestra/fullstack-cf-example
cd fullstack-cf-example
bun install
```

### 2 Setup your env variables

Create an .env file (look at the provided env.example for reference)

### 3 Run the application locally with all the resources needed like db, ...

```shell
bun dev
```

The application will be available at the URL displayed in your terminal (typically `http://localhost:5173`)

### 4 Deploy to Cloudflare

This will provision all the resources needed like db, ...
The application will be available at the Cloudflare URL displayed in your terminal.

```shell
bun infra:up
```

## Application Routes

This example includes several key routes:

- **/** - The landing page with a link to the protected home page
- **/home** - A protected page that requires authentication (redirects to login if not authenticated)
- **/user/login** - The login page where users can authenticate

## Authentication Flow

This example includes a complete authentication system with:

- OTP for signup and login
- Session management using a seperate KV database
- Protected routes
- Logout functionality

## Database Configuration

### Local Development

The project uses Cloudflare D1 (SQLite) with Drizzle ORM. A local development database will automatically setup when you first run `bun dev` in `./wrangler`

### Database Schema

The authentication schema is defined in `src/db/schema` and includes tables for:

- Users
- Sessions
- Accounts

### Making Schema Changes

When you need to update your database schema:

1. Modify the schema files in `src/db/schema`
2. Generate a new migration: `bun migrate:new --name="your_migration_name"`
3. Apply the migration: `bun migrate:dev`

## Deployment

To deploy the whole application (app, db, ecc) to Cloudflare:

1. Run the infra:up command to spin up and deploy: `bun infra:up`
2. Run the infra:destroy to tear it down `bun infra:destroy`

Everytime you change anything to the infra definition and run `infra:up` your whole infra will be updated, that's it.

## TODO:
- [x] fix useform ssr
- [] Fix fonts
- [] implement bun workspaces
- [] move src/app/components back to src/components (pending https://discord.com/channels/679514959968993311/1374981422925746236)


