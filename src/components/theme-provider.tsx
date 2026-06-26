"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode } from "react";

type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * Dark-first, like the /Design mockup. Manual toggle is persisted by next-themes.
 * disableTransitionOnChange is intentionally OFF so the global color transition
 * (background/color 0.5s in globals.css) plays when the theme is switched.
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}
