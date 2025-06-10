#!/usr/bin/env tsx

import alchemy from "alchemy"
import { run } from "./appResources"

const APP_NAME = "solstatus"

export const ALL_PHASES = ["destroy", "up", "read"] as const
export type Phase = (typeof ALL_PHASES)[number]

const stage = process.argv[3] || "dev"
const phase: Phase = process.argv[2] as Phase
const quiet = process.argv.includes("--quiet")

if (!ALL_PHASES.includes(phase)) {
  throw new Error(`Invalid phase [${phase}]`)
}
const resPrefix = `${APP_NAME}-${stage}`
console.log(`${resPrefix}: ${phase}`)

const infra = await alchemy(APP_NAME, {
  stage: stage,
  phase: phase,
  quiet,
  password: process.env.SECRET_ALCHEMY_PASSPHRASE,
})

run(resPrefix, stage).catch(err => {
  console.error(err.message)
  process.exit(1)
})

await infra.finalize()
