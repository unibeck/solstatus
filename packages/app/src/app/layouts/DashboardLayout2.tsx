"use client"

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

export default function DashboardLayout({ children }: LayoutProps) {
  const activeThemeValue = siteConfig.defaultTheme
  const defaultOpen = true

  return (
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
  )
}
