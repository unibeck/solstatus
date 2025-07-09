import { create } from "zustand"

interface DialogState {
  // Track which dialogs are open
  isEditEndpointMonitorDialogOpen: boolean

  // Actions
  setEditEndpointMonitorDialogOpen: (isOpen: boolean) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  // Initial state
  isEditEndpointMonitorDialogOpen: false,

  // Actions
  setEditEndpointMonitorDialogOpen: (isOpen) =>
    set({ isEditEndpointMonitorDialogOpen: isOpen }),
}))
