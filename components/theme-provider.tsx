'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider(props: ThemeProviderProps) { // Removed 'children' from destructuring
  return <NextThemesProvider {...props} />
}