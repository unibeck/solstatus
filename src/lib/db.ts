import { prismaClient, transformEndpointMonitor, prepareEndpointMonitorForPrisma } from './prisma';

// Endpoint Monitors
export async function getAllEndpointMonitors() {
  const monitors = await prismaClient.endpointMonitor.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return monitors.map(transformEndpointMonitor);
}

export async function getEndpointMonitorById(id: string) {
  const monitor = await prismaClient.endpointMonitor.findUnique({
    where: { id },
  });
  return monitor ? transformEndpointMonitor(monitor) : null;
}

export async function createEndpointMonitor(data: any) {
  const monitorData = prepareEndpointMonitorForPrisma(data);
  const monitor = await prismaClient.endpointMonitor.create({
    data: monitorData,
  });
  return transformEndpointMonitor(monitor);
}

export async function updateEndpointMonitor(id: string, data: any) {
  const monitorData = prepareEndpointMonitorForPrisma(data);
  const monitor = await prismaClient.endpointMonitor.update({
    where: { id },
    data: monitorData,
  });
  return transformEndpointMonitor(monitor);
}

export async function deleteEndpointMonitor(id: string) {
  await prismaClient.endpointMonitor.delete({
    where: { id },
  });
}

// Uptime Checks
export async function getUptimeChecks(endpointMonitorId: string, limit?: number) {
  const checks = await prismaClient.uptimeCheck.findMany({
    where: { endpointMonitorId },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
  return checks;
}

export async function getUptimeChecksInTimeRange(
  endpointMonitorId: string, 
  startTime: Date,
  endTime: Date
) {
  const checks = await prismaClient.uptimeCheck.findMany({
    where: { 
      endpointMonitorId,
      timestamp: {
        gte: startTime,
        lte: endTime,
      }
    },
    orderBy: { timestamp: 'desc' },
  });
  return checks;
}

export async function createUptimeCheck(data: any) {
  return await prismaClient.uptimeCheck.create({
    data,
  });
}