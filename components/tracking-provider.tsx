"use client"

import type React from "react"

import { useEffect } from "react"
import { usePageTracking } from "@/hooks/use-tracking"

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  usePageTracking()

  useEffect(() => {
    // Track initial page load
    if (typeof window !== "undefined") {
      console.log("🔍 Tracking initialized")
    }
  }, [])

  return <>{children}</>
}
