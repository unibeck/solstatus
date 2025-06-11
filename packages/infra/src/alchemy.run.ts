#!/usr/bin/env tsx

import alchemy from "alchemy"
import { DOStateStore } from "alchemy/cloudflare"
import { SolStatus } from "./solstatus"

const APP_NAME = "solstatus"

export const ALL_PHASES = ["destroy", "up", "read"] as const
export type Phase = (typeof ALL_PHASES)[number]

const stage = process.argv[3] || "dev"
const phase: Phase = process.argv[2] as Phase
const quiet = process.argv.includes("--quiet")

if (!ALL_PHASES.includes(phase)) {
  throw new Error(`Invalid phase [${phase}]`)
}
console.log(`${APP_NAME}-${stage}: ${phase}`)

const infra = await alchemy(APP_NAME, {
  stage: stage,
  phase: phase,
  quiet,
  password: process.env.SECRET_ALCHEMY_PASSPHRASE,
  stateStore: (scope) => new DOStateStore(scope, {
    // apiKey: alchemy.secret(process.env.CLOUDFLARE_API_KEY),
    // email: process.env.CLOUDFLARE_EMAIL,
    worker: {
      name: `${APP_NAME}-${stage}-alchemy-state`
    }
  }),
})

await SolStatus(`${APP_NAME}-${stage}`, {
  stage,
  fqdn: "uptime.solstatus.com",
})

await infra.finalize()
