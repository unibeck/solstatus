# @solstatus/api

API workers for SolStatus.

## Overview

This package provides the core monitoring functionality for SolStatus:

- **Monitor Executor**: Performs the actual HTTP checks against monitored endpoints
- **Monitor Trigger**: Manages scheduling and triggers for monitoring checks
- Infrastructure configuration for Cloudflare Workers

## Architecture

The API is built using:
- Cloudflare Workers for serverless execution
- Durable Objects for stateful scheduling
- D1 for data persistence
