import { RootLayout } from '../../../src/app/layout'
import { SidebarProvider } from '../../../src/registry/new-york-v4/ui/sidebar'
import { ThemeProvider } from '../../../src/components/theme-provider'
import { ActiveThemeProvider } from '../../../src/components/active-theme'
import { siteConfig } from '../../../src/app/site'
import { AppSidebar } from '../../../src/components/app-sidebar'
import { SiteHeader } from '../../../src/components/site-header'
import { Toaster } from '../../../src/registry/new-york-v4/ui/sonner'
import { SidebarInset } from '../../../src/registry/new-york-v4/ui/sidebar'
import { HeaderProvider } from '../../../src/context/header-context'

type MainLayoutProps = {
  children?: React.ReactNode
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const activeThemeValue = siteConfig.defaultTheme
  const isScaled = activeThemeValue?.endsWith("-scaled")
  const defaultOpen = true // for now, we'll default to open

  return (
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

export default MainLayout