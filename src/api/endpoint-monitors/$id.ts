import { eq } from "drizzle-orm";
import { z } from "zod";
import { json, error } from "rwsdk";
import { INTERNAL_SERVER_ERROR, NOT_FOUND } from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_PHRASE } from "stoker/http-status-phrases";
import { takeUniqueOrThrow, useDrizzle } from "@/db";
import { EndpointMonitorsTable } from "@/db/schema";
import { endpointMonitorsPatchSchema } from "@/db/zod-schema";
import { idStringParamsSchema } from "@/lib/route-schemas";

/**
 * GET /api/endpoint-monitors/[id]
 *
 * Retrieves a specific endpointMonitor by ID.
 *
 * @params {string} id - Endpoint Monitor ID
 * @returns {Promise} JSON response with endpointMonitor data
 * @throws {Response} 404 Not Found if endpointMonitor doesn't exist
 * @throws {Response} 500 Internal Server Error on database errors
 */
export async function get({ params, env }) {
  const { id } = params;
  const db = useDrizzle(env.DB);

  try {
    const endpointMonitor = await db.query.EndpointMonitorsTable.findFirst({
      where: eq(EndpointMonitorsTable.id, id),
    });

    if (!endpointMonitor) {
      return error(NOT_FOUND, { message: NOT_FOUND_PHRASE });
    }

    return json(endpointMonitor);
  } catch (err) {
    console.error("Error fetching endpointMonitor: ", err);
    return error(INTERNAL_SERVER_ERROR, { error: "Failed to fetch endpointMonitor" });
  }
}

/**
 * PATCH /api/endpoint-monitors/[id]
 *
 * Updates a specific endpointMonitor by ID.
 *
 * @params {string} id - Endpoint Monitor ID
 * @returns {Promise} JSON response with updated endpointMonitor data
 * @throws {Response} 404 Not Found if endpointMonitor doesn't exist
 * @throws {Response} 500 Internal Server Error on database errors
 */
export async function patch({ params, request, env }) {
  const { id } = params;
  const db = useDrizzle(env.DB);
  
  // Parse and validate request body
  const body = await request.json();
  const validatedData = endpointMonitorsPatchSchema.parse(body);

  try {
    // Check if endpointMonitor exists
    const existingEndpointMonitor = await db.query.EndpointMonitorsTable.findFirst({
      where: eq(EndpointMonitorsTable.id, id),
    });

    if (!existingEndpointMonitor) {
      return error(NOT_FOUND, { message: NOT_FOUND_PHRASE });
    }

    // Update the endpointMonitor
    await db
      .update(EndpointMonitorsTable)
      .set(validatedData)
      .where(eq(EndpointMonitorsTable.id, id));

    // Fetch the updated endpointMonitor
    const updatedEndpointMonitor = await takeUniqueOrThrow(
      db
        .select()
        .from(EndpointMonitorsTable)
        .where(eq(EndpointMonitorsTable.id, id)),
    );

    return json(updatedEndpointMonitor);
  } catch (error) {
    console.error("Error updating endpointMonitor: ", error);
    return error(INTERNAL_SERVER_ERROR, { error: "Failed to update endpointMonitor" });
  }
}

/**
 * DELETE /api/endpoint-monitors/[id]
 *
 * Deletes a specific endpointMonitor by ID.
 *
 * @params {string} id - Endpoint Monitor ID
 * @returns {Promise} Empty response with 204 No Content status
 * @throws {Response} 500 Internal Server Error on database errors
 */
export async function del({ params, env }) {
  const { id } = params;
  const db = useDrizzle(env.DB);

  try {
    await db
      .delete(EndpointMonitorsTable)
      .where(eq(EndpointMonitorsTable.id, id));

    await env.MONITOR_TRIGGER_RPC.deleteDo(id);
    
    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error("Error deleting endpointMonitor: ", error);
    return error(INTERNAL_SERVER_ERROR, { error: "Failed to delete endpointMonitor" });
  }
}