import { cn } from "@/lib/utils"
import { siteConfig } from "@/app/site"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { ActiveThemeProvider } from "@/components/active-theme"
import { HeaderProvider } from "@/context/header-context"
import { SidebarProvider, SidebarInset } from "@/registry/new-york-v4/ui/sidebar"
import { Toaster } from "@/registry/new-york-v4/ui/sonner"
import { fontVariables } from "@/lib/fonts"

// Meta theme colors for light/dark modes
const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

const MainLayout = ({ children }) => {
  // In RedwoodSDK, we'll use hooks to get theme info from cookies or local storage
  const activeThemeValue = siteConfig.defaultTheme
  const isScaled = activeThemeValue?.endsWith("-scaled")
  const defaultOpen = true // By default sidebar is open

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: This is fine
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : "",
          fontVariables,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <HeaderProvider>
              <SidebarProvider
                defaultOpen={defaultOpen}
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                  }
                }
              >
                <AppSidebar variant="inset" />
                <SidebarInset>
                  <SiteHeader />
                  <div className="flex flex-1 flex-col">{children}</div>
                </SidebarInset>
              </SidebarProvider>
            </HeaderProvider>
            <Toaster />
          </ActiveThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export default MainLayout