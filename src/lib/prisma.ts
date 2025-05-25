import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prismaClient = new PrismaClient();

// Helper functions for JSON serialization/deserialization
export function serializeJSON(value: any): string {
  return JSON.stringify(value);
}

export function deserializeJSON(value: string | null): any {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
}

// Helper to transform EndpointMonitor from Prisma to application format
export function transformEndpointMonitor(monitor: any) {
  return {
    ...monitor,
    headers: monitor.headers ? deserializeJSON(monitor.headers) : {},
    successCodes: monitor.successCodes ? deserializeJSON(monitor.successCodes) : [200],
  };
}

// Helper to prepare EndpointMonitor for Prisma
export function prepareEndpointMonitorForPrisma(monitor: any) {
  return {
    ...monitor,
    headers: monitor.headers ? serializeJSON(monitor.headers) : null,
    successCodes: monitor.successCodes ? serializeJSON(monitor.successCodes) : "[200]",
  };
}

export { prismaClient };