'use server'

import { getCloudflareContext } from "@opennextjs/cloudflare"

export interface InfraMetadata {
    cloudflareAccountId: string
    monitorExecName: string
    monitorTriggerName: string
}

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
