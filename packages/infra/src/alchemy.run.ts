import alchemy from "alchemy"

const APP_NAME = "solstatus"
const stage = process.argv[3] || "dev"
const phase = process.argv[2] === "destroy" ? "destroy" : "up"
const RES_PREFIX = `${APP_NAME}-${stage}`
console.log(`${RES_PREFIX}: ${phase}`)

const infra = await alchemy(APP_NAME, {
  stage: stage,
  phase: phase,
  quiet: process.argv.includes("--quiet"),
  password: process.env.SECRET_ALCHEMY_PASSPHRASE,
})

/////////// Import all infra resources here, which will also execute them ///////////

// Common: first create common infra resources
import { db, kv } from "@solstatus/common/infra"

// API: then create api infra resources
import { monitorExecWorker, monitorTriggerWorker } from "@solstatus/api/infra"

// App: then create app infra resources
import { app } from "@solstatus/app/infra"

await infra.finalize()
