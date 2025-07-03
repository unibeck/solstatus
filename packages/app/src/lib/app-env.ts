const DEV: AppEnvMetadata = {}

const PRE: AppEnvMetadata = {
  ...DEV,
}

const PROD: AppEnvMetadata = {
  ...PRE,
}

export enum AppEnvID {
  DEV = "dev",
  PRE = "pre",
  PROD = "prod",
}

// biome-ignore lint/suspicious/noEmptyInterface: This app env concept is not used yet
export interface AppEnvMetadata {}

const AppEnvs: { [value in AppEnvID]: AppEnvMetadata } = {
  [AppEnvID.DEV]: DEV,
  [AppEnvID.PRE]: PRE,
  [AppEnvID.PROD]: PROD,
}

export function getAppEnvID(): AppEnvID {
  console.log(`Getting app env ID for [${process.env.NEXT_PUBLIC_APP_ENV}]`)
  return getAppEnvIDFromStr(process.env.NEXT_PUBLIC_APP_ENV || "dev")
}

export function getAppEnvIDFromStr(appEnvStr: string): AppEnvID {
  switch (appEnvStr.toLowerCase()) {
    case "dev":
      return AppEnvID.DEV
    case "pre":
      return AppEnvID.PRE
    case "prod":
      return AppEnvID.PROD
    default:
      throw new Error(`Unknown environment: ${appEnvStr}`)
  }
}

export function getAppEnvMetadata(appEnvId = getAppEnvID()): AppEnvMetadata {
  return AppEnvs[appEnvId]
}
