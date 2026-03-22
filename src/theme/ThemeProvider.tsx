"use client"

// ** React
import React from "react"

// ** Next Themes
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
                                  children,
                                  ...props
                              }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}