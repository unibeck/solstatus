"use server"

import { getCloudflareContext } from "@opennextjs/cloudflare"
import type { InfraMetadata } from "@solstatus/common/utils/types"

export async function getInfraMetadata(): Promise<InfraMetadata> {
  const cfEnv = getCloudflareContext().env
  const cloudflareAccountId = cfEnv.CLOUDFLARE_ACCOUNT_ID
  const monitorExecName = cfEnv.MONITOR_EXEC_NAME
  const monitorTriggerName = cfEnv.MONITOR_TRIGGER_NAME

  return {
    cloudflareAccountId,
    monitorExecName,
    monitorTriggerName,
  }
}
