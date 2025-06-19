'use server'

import { getCloudflareContext } from "@opennextjs/cloudflare"

export interface InfraMetadata {
    cloudflareAccountId: string
    monitorExecName: string
    monitorTriggerName: string
}

export async function getInfraMetadata(): Promise<InfraMetadata> {
    const { env } = getCloudflareContext()
    const cloudflareAccountId = env.CLOUDFLARE_ACCOUNT_ID
    const monitorExecName = env.MONITOR_EXEC_NAME
    const monitorTriggerName = env.MONITOR_TRIGGER_NAME

    return {
        cloudflareAccountId,
        monitorExecName,
        monitorTriggerName,
    }
}
