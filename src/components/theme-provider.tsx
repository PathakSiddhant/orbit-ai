"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Hum ThemeProviderProps ko direct import karne ki jagah
// React.ComponentProps se nikal lenge taaki path ka error na aaye.
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}