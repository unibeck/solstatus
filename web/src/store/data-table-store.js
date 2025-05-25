import { create } from "zustand"

export const useDataTableStore = create((set, get) => ({
  // Data state
  data: [],
  pagination: {
    pageIndex: 0,
    pageSize: 10,
    pageCount: 0,
    totalCount: 0,
  },
  sorting: [{ id: "consecutiveFailures", desc: true }],
  filters: {
    search: "",
    isRunning: undefined,
    checkIntervalMin: undefined,
    checkIntervalMax: undefined,
  },
  
  // UI state
  isLoading: false,
  error: null,
  
  // Actions
  setPagination: (pagination) => set({ pagination }),
  setSorting: (sorting) => set({ sorting }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  
  fetchEndpointMonitors: async () => {
    set({ isLoading: true, error: null })
    
    const { pagination, sorting, filters } = get()
    
    // Build query parameters
    const params = new URLSearchParams({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      orderBy: sorting[0]?.id || "consecutiveFailures",
      order: sorting[0]?.desc ? "desc" : "asc",
      ...filters,
    })
    
    try {
      // In RedwoodSDK, API calls would use the SDK's fetch utilities
      const response = await fetch(`/api/endpoint-monitors?${params}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch endpoint monitors")
      }
      
      const result = await response.json()
      
      set({
        data: result.data,
        pagination: {
          ...pagination,
          pageCount: result.pagination.totalPages,
          totalCount: result.pagination.totalCount
        },
        isLoading: false
      })
    } catch (error) {
      console.error("Error fetching endpoint monitors:", error)
      set({ error: error.message, isLoading: false })
    }
  },
  
  resetStore: () => set({
    data: [],
    pagination: {
      pageIndex: 0,
      pageSize: 10,
      pageCount: 0,
      totalCount: 0,
    },
    sorting: [{ id: "consecutiveFailures", desc: true }],
    filters: {
      search: "",
      isRunning: undefined,
      checkIntervalMin: undefined,
      checkIntervalMax: undefined,
    },
    isLoading: false,
    error: null
  })
}))