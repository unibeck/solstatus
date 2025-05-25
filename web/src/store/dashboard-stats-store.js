import { create } from "zustand"

export const useStatsStore = create((set) => ({
  // State
  stats: {
    totalEndpointMonitors: 0,
    activeEndpointMonitors: 0,
    averageLatencyMs: 0,
    highestLatencyEndpointMonitorId: null,
    uptimePercentage: 100,
  },
  isLoading: false,
  error: null,

  // Actions
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null })
    
    try {
      // In RedwoodSDK, API calls would use the SDK's fetch utilities
      const response = await fetch("/api/endpoint-monitors/stats")
      
      if (!response.ok) {
        throw new Error("Failed to fetch stats")
      }
      
      const data = await response.json()
      set({ stats: data, isLoading: false })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  resetStats: () => {
    set({
      stats: {
        totalEndpointMonitors: 0,
        activeEndpointMonitors: 0,
        averageLatencyMs: 0,
        highestLatencyEndpointMonitorId: null,
        uptimePercentage: 100,
      }
    })
  }
}))