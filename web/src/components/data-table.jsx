import React, { useEffect } from "react"
import { useDataTableStore } from "../store/data-table-store"

export function DataTable() {
  const { data, fetchEndpointMonitors, isLoading } = useDataTableStore()

  useEffect(() => {
    fetchEndpointMonitors()
  }, [fetchEndpointMonitors])

  return (
    <div className="rounded-md border">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Endpoint Monitors</h2>
        <p className="text-sm text-muted-foreground">
          List of all your monitored endpoints
        </p>
      </div>
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">Name</th>
              <th className="h-12 px-4 text-left align-middle font-medium">URL</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Last Check</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {isLoading ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No endpoint monitors found.
                </td>
              </tr>
            ) : (
              data.map((monitor) => (
                <tr 
                  key={monitor.id}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <td className="p-4">{monitor.name}</td>
                  <td className="p-4">{monitor.url}</td>
                  <td className="p-4">
                    {monitor.isRunning ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {monitor.lastCheckAt ? new Date(monitor.lastCheckAt).toLocaleString() : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}