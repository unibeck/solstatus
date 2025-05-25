import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import { cn } from "../../../lib/utils"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

// Create a context for sidebar state
const SidebarContext = createContext({
  state: "expanded",
  open: true,
  setOpen: () => {},
  isMobile: false,
  openMobile: false,
  setOpenMobile: () => {},
  toggleSidebar: () => {},
})

// SidebarProvider component
export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}) {
  // State for desktop sidebar
  const [open, setOpen] = useState(defaultOpen)
  
  // State for mobile sidebar
  const [openMobile, setOpenMobile] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Effect for media query
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)")
    const handleResize = (e) => setIsMobile(e.matches)
    
    setIsMobile(mql.matches)
    mql.addEventListener("change", handleResize)
    
    return () => mql.removeEventListener("change", handleResize)
  }, [])

  // Toggle sidebar function
  const toggleSidebar = () => {
    const newState = !open
    setOpen(newState)
    
    // Set cookie for persistence
    document.cookie = `${SIDEBAR_COOKIE_NAME}=${newState}; path=/; max-age=31536000; SameSite=Lax`
  }

  // Keyboard shortcut for toggling sidebar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  const state = open ? "expanded" : "collapsed"

  const contextValue = useMemo(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, isMobile, openMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div className={cn("relative flex", className)} style={style} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

// Hook for accessing sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext)
  
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  
  return context
}

// SidebarInset component
export function SidebarInset({ children, className, ...props }) {
  const { state } = useSidebar()
  
  return (
    <div
      className={cn("relative flex flex-1 flex-col", className)}
      data-state={state}
      {...props}
    >
      {children}
    </div>
  )
}