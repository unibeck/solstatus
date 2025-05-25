import { defineWorker } from 'rwsdk';
import { prismaClient } from '../lib/prisma';
import { transformEndpointMonitor } from '../lib/prisma';

export default defineWorker({
  // Define the executor worker that will perform the actual endpoint checks
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    
    if (path.includes('/execute-check') && request.method === 'POST') {
      // Get the monitor ID from the path
      const parts = path.split('/');
      const monitorId = parts[parts.indexOf('endpoint-monitors') + 1];
      
      if (!monitorId) {
        return new Response('Monitor ID not found', { status: 400 });
      }
      
      try {
        // Execute the check for this specific monitor
        const result = await executeMonitorCheck(monitorId, env);
        return new Response(JSON.stringify(result), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error executing check:', error);
        return new Response(JSON.stringify({ error: 'Failed to execute check' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    return new Response('Not Found', { status: 404 });
  }
});

// Helper function to execute a check for a specific monitor
async function executeMonitorCheck(monitorId: string, env: any) {
  // Get the monitor details
  const monitor = await prismaClient.endpointMonitor.findUnique({
    where: { id: monitorId }
  });
  
  if (!monitor) {
    throw new Error(`Monitor with ID ${monitorId} not found`);
  }
  
  // Transform the monitor to get the proper format with deserialized JSON
  const transformedMonitor = transformEndpointMonitor(monitor);
  
  // Execute the actual HTTP request to the endpoint
  const startTime = Date.now();
  let response;
  let error;
  
  try {
    const timeout = transformedMonitor.timeout || 5000;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Prepare headers
    const headers = new Headers();
    if (transformedMonitor.headers) {
      Object.entries(transformedMonitor.headers).forEach(([key, value]) => {
        headers.append(key, value as string);
      });
    }
    
    response = await fetch(transformedMonitor.url, {
      method: transformedMonitor.method,
      headers,
      body: transformedMonitor.method !== 'GET' && transformedMonitor.method !== 'HEAD' ? transformedMonitor.body : null,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
  } catch (err) {
    error = err;
  }
  
  const endTime = Date.now();
  const latencyMs = endTime - startTime;
  
  // Determine status based on response
  const statusCode = response?.status;
  const successCodes = transformedMonitor.successCodes || [200];
  const status = response && successCodes.includes(statusCode) ? 'up' : 'down';
  
  // Create the check record
  const check = await prismaClient.uptimeCheck.create({
    data: {
      endpointMonitorId: monitorId,
      timestamp: new Date(),
      status,
      statusCode: statusCode || null,
      latencyMs: error ? null : latencyMs,
      error: error ? String(error) : null,
    }
  });
  
  // Update the monitor with the latest check info
  await prismaClient.endpointMonitor.update({
    where: { id: monitorId },
    data: {
      status,
      statusCode: statusCode || null,
      latencyMs: error ? null : latencyMs,
      lastCheck: new Date(),
    }
  });
  
  return check;
}