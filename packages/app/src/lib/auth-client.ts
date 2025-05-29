import { emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const setupAuthClient = (baseUrl: string) =>
  createAuthClient({
    plugins: [emailOTPClient()],

    // The base URL of the server (optional if you're using the same domain)
    baseURL: baseUrl,
    basePath: "/api/auth",
  })
