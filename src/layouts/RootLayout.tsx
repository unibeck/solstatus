import React from "react";
import { cookies } from "rwsdk";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { fontVariables } from "@/lib/fonts";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ActiveThemeProvider } from "@/components/active-theme";
import { HeaderProvider } from "@/context/header-context";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = siteConfig.defaultTheme;
  // const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <>
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
      <div
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
                style={{
                  "--sidebar-width": "calc(var(--spacing) * 72)",
                } as React.CSSProperties}
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
      </div>
    </>
  );
}