import * as React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  attribute?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
  enableColorScheme = true,
  attribute = "data-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (defaultTheme as Theme) || "system",
  );

  useEffect(() => {
    if (defaultTheme) {
      setTheme(defaultTheme);
    }
  }, [defaultTheme]);

  const resolvedTheme = React.useMemo(() => {
    if (theme === "system" && enableSystem) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme, enableSystem]);

  useEffect(() => {
    const root = window.document.documentElement;

    root.setAttribute(attribute, resolvedTheme);

    if (enableColorScheme) {
      root.style.colorScheme = resolvedTheme;
    }

    if (disableTransitionOnChange) {
      const originalStyle = window.getComputedStyle(document.documentElement)
        .transitionProperty;

      root.style.transitionProperty = "none";

      const tid = window.setTimeout(() => {
        root.style.transitionProperty = originalStyle;
      }, 0);

      return () => {
        window.clearTimeout(tid);
      };
    }
  }, [
    resolvedTheme,
    attribute,
    enableColorScheme,
    disableTransitionOnChange,
  ]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
