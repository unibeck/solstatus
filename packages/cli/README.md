# SolStatus CLI

The main command-line interface for managing SolStatus infrastructure and operations.

## Installation

Make sure you have installed the dependencies:

```bash
pnpm install
```

## Usage

The CLI can be run using either of these methods:

```bash
# From the cli package directory
pnpm run cli [options]

# Or directly
tsx ./src/index.ts [options]

# Or if made executable
./src/index.ts [options]

# From the monorepo root
pnpm cli [options]

# Or using workspace filter
pnpm --filter solstatus run cli [options]
```

## Options

### Required Options

- `--fqdn <domain>` - Fully qualified domain name (required)

### Optional Options

- `--cloudflare-account-id <id>` - Cloudflare Account ID (defaults to env var)
- `--cloudflare-api-token <token>` - Cloudflare API Token (defaults to env var)
- `--stage <stage>` - Deployment stage (default: "dev")
- `--phase <phase>` - Phase to execute: "destroy", "up", or "read" (default: "up")
- `--quiet` - Run in quiet mode (default: false)
- `--app-name <name>` - Application name (default: "solstatus")

### Built-in Options

- `--help` or `-h` - Show help documentation
- `--version` - Show CLI version
- `--wizard` - Start wizard mode for interactive command building
- `--completions <shell>` - Generate shell completions (bash, sh, fish, zsh)
- `--log-level <level>` - Set minimum log level

## Environment Variables

The CLI will look for Cloudflare credentials in this order:
1. CLI flags (`--cloudflare-account-id`, `--cloudflare-api-token`)
2. `.env` file in the current directory
3. Process environment variables

Required environment variables if not provided via CLI flags:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Optional environment variables:
- `SECRET_ALCHEMY_PASSPHRASE`

## Examples

### Basic usage with required FQDN:
```bash
pnpm run cli --fqdn uptime.solstatus.com
```

### Deploy to production:
```bash
pnpm run cli --fqdn uptime.solstatus.com --stage production --phase up
```

### Destroy infrastructure:
```bash
pnpm run cli --fqdn uptime.solstatus.com --phase destroy
```

### With explicit Cloudflare credentials:
```bash
pnpm run cli --fqdn uptime.solstatus.com \
  --cloudflare-account-id YOUR_ACCOUNT_ID \
  --cloudflare-api-token YOUR_API_TOKEN
```

### View help:
```bash
pnpm run cli --help
```

### Generate shell completions:
```bash
# For bash
source <(pnpm run cli --completions bash)

# For zsh
source <(pnpm run cli --completions zsh)
```

## .env File Example

Create a `.env` file in your project root:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
SECRET_ALCHEMY_PASSPHRASE=your_passphrase_here
``` 