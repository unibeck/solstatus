import { desc } from "drizzle-orm";
import { json, error } from "rwsdk";
import { INTERNAL_SERVER_ERROR } from "stoker/http-status-codes";
import { useDrizzle } from "@/db";
import { EndpointMonitorsTable } from "@/db/schema";
import { endpointMonitorsInsertSchema } from "@/db/zod-schema";
import { nanoid } from "@/lib/ids";

/**
 * GET /api/endpoint-monitors
 * 
 * Lists all endpoint monitors.
 * 
 * @returns {Promise} JSON response with array of endpoint monitors
 * @throws {Response} 500 Internal Server Error on database errors
 */
export async function get({ env }) {
  const db = useDrizzle(env.DB);
  
  try {
    const endpointMonitors = await db.query.EndpointMonitorsTable.findMany({
      orderBy: [desc(EndpointMonitorsTable.createdAt)],
    });
    
    return json(endpointMonitors);
  } catch (error) {
    console.error("Error fetching endpoint monitors:", error);
    return error(INTERNAL_SERVER_ERROR, { error: "Failed to fetch endpoint monitors" });
  }
}

/**
 * POST /api/endpoint-monitors
 * 
 * Creates a new endpoint monitor.
 * 
 * @returns {Promise} JSON response with the created endpoint monitor
 * @throws {Response} 500 Internal Server Error on database errors
 */
export async function post({ request, env }) {
  const db = useDrizzle(env.DB);
  
  try {
    const body = await request.json();
    const validatedData = endpointMonitorsInsertSchema.parse(body);
    
    const id = nanoid();
    const now = new Date();
    
    const endpointMonitor = {
      id,
      createdAt: now,
      updatedAt: now,
      name: validatedData.name,
      url: validatedData.url,
      status: "unknown",
      monitoringEnabled: true,
      method: validatedData.method || "GET",
      frequency: validatedData.frequency || 60,
      timeout: validatedData.timeout || 5000,
      retryCount: validatedData.retryCount || 0,
      retryInterval: validatedData.retryInterval || 0,
      headers: validatedData.headers || {},
      body: validatedData.body || null,
      successCodes: validatedData.successCodes || [200],
      statusCode: null,
      latencyMs: null,
      lastCheck: null,
    };
    
    await db.insert(EndpointMonitorsTable).values(endpointMonitor);
    
    // Initialize the Durable Object for this monitor
    await fetch(`/api/endpoint-monitors/${id}/init-do`, {
      method: "POST",
    });
    
    return json(endpointMonitor, { status: 201 });
  } catch (error) {
    console.error("Error creating endpoint monitor:", error);
    return error(INTERNAL_SERVER_ERROR, { error: "Failed to create endpoint monitor" });
  }
}