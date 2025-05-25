import { createContext, useContext, useEffect, useState } from "react"

const COOKIE_NAME = "active_theme"
const DEFAULT_THEME = "neutral"

const ThemeContext = createContext({
  theme: undefined,
  setTheme: () => null,
})

function setThemeCookie(theme) {
  if (typeof window === "undefined") {
    return
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Should use RedwoodSDK lib, but we're migrating from NextJS, so keeping this for now
  document.cookie = `${COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${window.location.protocol === "https:" ? "Secure;" : ""}`
}

export function ActiveThemeProvider({ children, initialTheme }) {
  const [theme, setTheme] = useState(() => initialTheme || DEFAULT_THEME)

  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event.key === COOKIE_NAME) {
        setTheme(event.newValue || DEFAULT_THEME)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleThemeChange)
      return () => window.removeEventListener("storage", handleThemeChange)
    }
  }, [])

  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    setThemeCookie(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useActiveTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useActiveTheme must be used within an ActiveThemeProvider")
  }
  return context
}