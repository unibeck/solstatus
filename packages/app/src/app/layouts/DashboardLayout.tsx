import { AppSidebar } from "#/app/components/app-sidebar"
import { SiteHeader } from "#/app/components/site-header"
import { ThemeProvider } from "#/app/components/theme-provider"
import { siteConfig } from "#/app/site"
import {
  SidebarInset,
  SidebarProvider,
} from "#/registry/new-york-v4/ui/sidebar"
import { Toaster } from "#/registry/new-york-v4/ui/sonner"

// import "#/app/globals.css"
// import "#/app/theme.css"

import type { LayoutProps } from "rwsdk/router"
import { ActiveThemeProvider } from "#/app/components/active-theme"
import { HeaderProvider } from "#/context/header-context"
import { cn } from "#/lib/utils"

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
}

export default function DashboardLayout({ children }: LayoutProps) {
  "use client"
  
  const activeThemeValue = siteConfig.defaultTheme
  const isScaled = activeThemeValue?.endsWith("-scaled")
  const defaultOpen = true

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
        )}
      >
        <ThemeProvider>
          <ActiveThemeProvider initialTheme={activeThemeValue}>
            <HeaderProvider>
              <SidebarProvider
                defaultOpen={defaultOpen}
                style={
                  {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                  } as React.CSSProperties
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
