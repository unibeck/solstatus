import React, { useState } from "react"
import { Button } from "../registry/new-york-v4/ui/button"

export function AddEndpointMonitorDialog({ trigger, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    checkIntervalMinutes: 5,
    isRunning: true
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // In RedwoodSDK, API calls would use the SDK's fetch utilities
      const response = await fetch("/api/endpoint-monitors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error("Failed to create endpoint monitor")
      }
      
      // Close dialog and reset form
      setIsOpen(false)
      setFormData({
        name: "",
        url: "",
        checkIntervalMinutes: 5,
        isRunning: true
      })
      
      // Call success callback
      if (onSuccess) {
        await onSuccess()
      }
    } catch (error) {
      console.error("Error creating endpoint monitor:", error)
      // Could add error handling UI here
    } finally {
      setIsLoading(false)
    }
  }
  
  // Simplified dialog implementation
  // In a real app, you'd use a proper dialog component
  if (!isOpen) {
    return (
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>
    )
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Add Endpoint Monitor</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                className="w-full p-2 border rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="url">
                URL
              </label>
              <input
                id="url"
                className="w-full p-2 border rounded-md"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                type="url"
                placeholder="https://"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="interval">
                Check Interval (minutes)
              </label>
              <input
                id="interval"
                className="w-full p-2 border rounded-md"
                value={formData.checkIntervalMinutes}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  checkIntervalMinutes: parseInt(e.target.value, 10) 
                })}
                type="number"
                min="1"
                required
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="isRunning"
                type="checkbox"
                checked={formData.isRunning}
                onChange={(e) => setFormData({ ...formData, isRunning: e.target.checked })}
                className="mr-2"
              />
              <label htmlFor="isRunning">Active</label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}