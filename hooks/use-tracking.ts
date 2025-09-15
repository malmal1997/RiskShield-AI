"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackPageView, trackFeatureClick, trackFormInteraction } from "@/lib/usage-tracking"

export function usePageTracking() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname])
}

export function useFeatureTracking() {
  const trackClick = (featureName: string, additionalData?: any) => {
    trackFeatureClick(featureName, additionalData)
  }

  const trackForm = (formName: string, action: string, data?: any) => {
    trackFormInteraction(formName, action, data)
  }

  return { trackClick, trackForm }
}