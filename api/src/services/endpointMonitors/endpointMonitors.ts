import { getCloudflareContext } from "@opennextjs/cloudflare"
import { and, asc, count, desc, eq, like, sql } from "drizzle-orm"
import type { SQLiteColumn } from "drizzle-orm/sqlite-core"
import { takeUniqueOrThrow, useDrizzle } from "../../../src/db"
import { EndpointMonitorsTable } from "../../../src/db/schema"

// Helper functions adapted from existing codebase
function getColumn(columnName: string): SQLiteColumn {
  switch (columnName) {
    case "name":
      return EndpointMonitorsTable.name
    case "url":
      return EndpointMonitorsTable.url
    case "method":
      return EndpointMonitorsTable.method
    case "checkInterval":
      return EndpointMonitorsTable.checkInterval
    case "isRunning":
      return EndpointMonitorsTable.isRunning
    case "createdAt":
      return EndpointMonitorsTable.createdAt
    case "updatedAt":
      return EndpointMonitorsTable.updatedAt
    case "lastCheckedAt":
      return EndpointMonitorsTable.lastCheckedAt
    case "consecutiveFailures":
      return EndpointMonitorsTable.consecutiveFailures
    case "statusCode":
      return EndpointMonitorsTable.statusCode
    case "responseTime":
      return EndpointMonitorsTable.responseTime
    default:
      return EndpointMonitorsTable.createdAt
  }
}

function getOrderDirection(order: "asc" | "desc") {
  return order === "asc" ? asc : desc
}

export const endpointMonitors = async ({
  page = 0,
  pageSize = 10,
  orderBy = "consecutiveFailures",
  order = "desc",
  search,
  isRunning,
  checkIntervalMin,
  checkIntervalMax,
}) => {
  const { env } = getCloudflareContext()
  const db = useDrizzle(env.DB)
  
  // Create the where conditions
  const whereConditions = and(
    search
      ? sql`(${like(EndpointMonitorsTable.name, `%${search}%`)} OR ${like(EndpointMonitorsTable.url, `%${search}%`)})`
      : sql`1=1`,
    isRunning !== undefined
      ? eq(EndpointMonitorsTable.isRunning, isRunning === "true")
      : sql`1=1`,
    checkIntervalMin
      ? sql`${EndpointMonitorsTable.checkInterval} >= ${checkIntervalMin}`
      : sql`1=1`,
    checkIntervalMax
      ? sql`${EndpointMonitorsTable.checkInterval} <= ${checkIntervalMax}`
      : sql`1=1`,
  )
  
  // Get total count
  const [{ value: totalCount }] = await db
    .select({ value: count() })
    .from(EndpointMonitorsTable)
    .where(whereConditions)
  
  // Get paginated results
  const orderByCol = getColumn(orderBy)
  const orderDir = getOrderDirection(order as "asc" | "desc")
  
  const results = await db
    .select()
    .from(EndpointMonitorsTable)
    .where(whereConditions)
    .orderBy(orderDir(orderByCol))
    .limit(pageSize)
    .offset(page * pageSize)
  
  return {
    endpointMonitors: results,
    count: totalCount,
    hasMore: (page + 1) * pageSize < totalCount,
  }
}

export const endpointMonitor = async ({ id }) => {
  const { env } = getCloudflareContext()
  const db = useDrizzle(env.DB)
  
  return await takeUniqueOrThrow(
    db
      .select()
      .from(EndpointMonitorsTable)
      .where(eq(EndpointMonitorsTable.id, id))
  )
}

export const createEndpointMonitor = async ({ input }) => {
  const { env } = getCloudflareContext()
  const db = useDrizzle(env.DB)
  
  const now = new Date()
  const [endpointMonitor] = await db.insert(EndpointMonitorsTable).values({
    ...input,
    createdAt: now,
    updatedAt: now,
    consecutiveFailures: 0,
  }).returning()
  
  return endpointMonitor
}

export const updateEndpointMonitor = async ({ id, input }) => {
  const { env } = getCloudflareContext()
  const db = useDrizzle(env.DB)
  
  const [endpointMonitor] = await db
    .update(EndpointMonitorsTable)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(EndpointMonitorsTable.id, id))
    .returning()
  
  return endpointMonitor
}

export const deleteEndpointMonitor = async ({ id }) => {
  const { env } = getCloudflareContext()
  const db = useDrizzle(env.DB)
  
  const [endpointMonitor] = await db
    .delete(EndpointMonitorsTable)
    .where(eq(EndpointMonitorsTable.id, id))
    .returning()
  
  return endpointMonitor
}

export const pauseEndpointMonitor = async ({ id }) => {
  return updateEndpointMonitor({ id, input: { isRunning: false } })
}

export const resumeEndpointMonitor = async ({ id }) => {
  return updateEndpointMonitor({ id, input: { isRunning: true } })
}

// This function would call the worker to execute a check
export const executeCheck = async ({ id }) => {
  // Implementation would depend on how you want to handle this in RedwoodJS
  // For now, we'll just return the current monitor
  return endpointMonitor({ id })
}