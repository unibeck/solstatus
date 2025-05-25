import React, { createContext, useContext, useState } from "react"

const HeaderContext = createContext({
  headerLeftContent: null,
  setHeaderLeftContent: () => null,
  headerRightContent: null,
  setHeaderRightContent: () => null,
})

export function HeaderProvider({ children }) {
  const [headerLeftContent, setHeaderLeftContent] = useState(null)
  const [headerRightContent, setHeaderRightContent] = useState(null)

  return (
    <HeaderContext.Provider
      value={{
        headerLeftContent,
        setHeaderLeftContent,
        headerRightContent,
        setHeaderRightContent,
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeaderContext() {
  const context = useContext(HeaderContext)
  if (context === undefined) {
    throw new Error("useHeaderContext must be used within a HeaderProvider")
  }
  return context
}