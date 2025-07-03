import alchemy from "alchemy"
import { WranglerJson } from "alchemy/cloudflare"
import { SolStatus } from "@/solstatus"

// TODO: waiting on https://github.com/sam-goodwin/alchemy/pull/230 to land to run alchemy against miniflare to generate these locally
const genWranglerConfig = async () => {
  const APP_NAME = "solstatus"
  const stage = "dev"
  const phase = "up"
  const quiet = false
  console.log(`${APP_NAME}-${stage}: ${phase}`)

  const infra = await alchemy(APP_NAME, {
    stage: stage,
    phase: phase,
    quiet,
    password: process.env.SECRET_ALCHEMY_PASSPHRASE,
  })

  const { monitorExecWorker, monitorTriggerWorker } = await SolStatus(
    `${APP_NAME}-${stage}`,
    {
      stage,
      fqdn: "uptime.solstatus.com",
      cloudflareAccountId: "local",
    },
  )

  await WranglerJson("wrangler-monitor-exec", {
    worker: monitorExecWorker,
    path: "./wrangler-monitor-exec.jsonc",
  })

  await WranglerJson("wrangler-monitor-trigger", {
    worker: monitorTriggerWorker,
    path: "./wrangler-monitor-trigger.jsonc",
  })

  await infra.finalize()
}

genWranglerConfig()
