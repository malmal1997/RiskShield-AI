import { supabaseClient } from "./supabase-client"

interface TrackingData {
  sessionId: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
}

interface PageViewData {
  sessionId: string
  pagePath: string
  pageTitle?: string
  timeOnPage?: number | null // Allow null
}

interface FeatureInteractionData {
  sessionId: string
  featureName: string
  actionType: string
  featureData?: any | null // Allow null
}

interface LeadData {
  sessionId: string
  email?: string
  name?: string
  company?: string
  phone?: string
  interestLevel: "high" | "medium" | "low"
  leadSource: string
  notes?: string
}

class UsageTracker {
  private sessionId: string
  private startTime: number
  private lastActivity: number
  private pageStartTime: number
  private currentPage: string

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.startTime = Date.now()
    this.lastActivity = Date.now()
    this.pageStartTime = Date.now()
    this.currentPage = ""

    // Initialize session
    this.initializeSession()

    // Track page visibility changes
    this.setupVisibilityTracking()

    // Track page unload
    this.setupUnloadTracking()
  }

  private getOrCreateSessionId(): string {
    let sessionId = localStorage.getItem("preview_session_id")
    if (!sessionId) {
      sessionId = "preview_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
      localStorage.setItem("preview_session_id", sessionId)
    }
    return sessionId
  }

  private async initializeSession() {
    try {
      const urlParams = new URLSearchParams(window.location.search)

      const trackingData: TrackingData = {
        sessionId: this.sessionId,
        userAgent: navigator.userAgent,
        referrer: document.referrer || undefined,
        utmSource: urlParams.get("utm_source") || undefined,
        utmMedium: urlParams.get("utm_medium") || undefined,
        utmCampaign: urlParams.get("utm_campaign") || undefined,
      }

      // Try to get IP address (this would need a service in production)
      // For now, we'll skip IP tracking to avoid external dependencies

      await supabaseClient.from("preview_sessions").upsert(
        {
          session_id: trackingData.sessionId,
          user_agent: trackingData.userAgent,
          referrer: trackingData.referrer,
          utm_source: trackingData.utmSource,
          utm_medium: trackingData.utmMedium,
          utm_campaign: trackingData.utmCampaign,
          last_activity: new Date().toISOString(),
        },
        {
          onConflict: "session_id",
        },
      )
    } catch (error) {
      console.error("Error initializing tracking session:", error)
    }
  }

  async trackPageView(pagePath: string, pageTitle?: string) {
    try {
      // Track time on previous page
      if (this.currentPage && this.pageStartTime) {
        const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000)
        await this.updatePageTime(this.currentPage, timeOnPage)
      }

      // Start tracking new page
      this.currentPage = pagePath
      this.pageStartTime = Date.now()
      this.lastActivity = Date.now()

      const pageViewData: PageViewData = {
        sessionId: this.sessionId,
        pagePath,
        pageTitle: pageTitle || document.title,
        timeOnPage: null, // Explicitly set to null on initial insert
      }

      await supabaseClient.from("page_views").insert(pageViewData)

      // Update session stats
      await this.updateSessionActivity()
    } catch (error) {
      console.error("Error tracking page view:", error)
    }
  }

  async trackFeatureInteraction(featureName: string, actionType: string, featureData?: any) {
    try {
      this.lastActivity = Date.now()

      const interactionData: FeatureInteractionData = {
        sessionId: this.sessionId,
        featureName,
        actionType,
        featureData: featureData === undefined ? null : featureData, // Explicitly set to null if undefined
      }

      await supabaseClient.from("feature_interactions").insert(interactionData)

      // Update session stats
      await this.updateSessionActivity()
    } catch (error) {
      console.error("Error tracking feature interaction:", error)
    }
  }

  async trackLead(leadData: Omit<LeadData, "sessionId">) {
    try {
      const fullLeadData: LeadData = {
        sessionId: this.sessionId,
        ...leadData,
      }

      await supabaseClient.from("preview_leads").insert(fullLeadData)

      console.log("🎯 New lead captured:", leadData)
    } catch (error) {
      console.error("Error tracking lead:", error)
    }
  }

  async markUserConverted(userId: string) {
    try {
      await supabaseClient
        .from("preview_sessions")
        .update({
          converted_user_id: userId,
          converted_at: new Date().toISOString(),
        })
        .eq("session_id", this.sessionId)

      console.log("🎉 User converted:", userId)
    } catch (error) {
      console.error("Error marking user as converted:", error)
    }
  }

  private async updatePageTime(pagePath: string, timeOnPage: number) {
    try {
      await supabaseClient
        .from("page_views")
        .update({ time_on_page: timeOnPage })
        .eq("session_id", this.sessionId)
        .eq("page_path", pagePath)
        .is("time_on_page", null)
        .order("created_at", { ascending: false })
        .limit(1)
    } catch (error) {
      console.error("Error updating page time:", error)
    }
  }

  private async updateSessionActivity() {
    try {
      const totalTimeSpent = Math.round((Date.now() - this.startTime) / 1000)

      await supabaseClient
        .from("preview_sessions")
        .update({
          last_activity: new Date().toISOString(),
          total_time_spent: totalTimeSpent,
        })
        .eq("session_id", this.sessionId)
    } catch (error) {
      console.error("Error updating session activity:", error)
    }
  }

  private setupVisibilityTracking() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // Page is hidden, update time on current page
        if (this.currentPage && this.pageStartTime) {
          const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000)
          this.updatePageTime(this.currentPage, timeOnPage)
        }
      } else {
        // Page is visible again, restart timer
        this.pageStartTime = Date.now()
        this.lastActivity = Date.now()
      }
    })
  }

  private setupUnloadTracking() {
    window.addEventListener("beforeunload", () => {
      // Final update on page unload
      if (this.currentPage && this.pageStartTime) {
        const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000)
        // Use sendBeacon for reliable tracking on unload
        const data = JSON.stringify({
          sessionId: this.sessionId,
          pagePath: this.currentPage,
          timeOnPage,
        })

        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track-page-time", data)
        }
      }
    })
  }

  // Convenience methods for common tracking scenarios
  async trackSignupAttempt(email?: string, source = "signup_form") {
    await this.trackFeatureInteraction("signup", "attempt", { email, source })
    if (email) {
      await this.trackLead({
        email,
        interestLevel: "high",
        leadSource: source,
        notes: "Attempted to sign up during preview",
      })
    }
  }

  async trackDemoRequest(contactInfo: any) {
    await this.trackFeatureInteraction("demo", "request", contactInfo)
    await this.trackLead({
      ...contactInfo,
      interestLevel: "high",
      leadSource: "demo_request",
      notes: "Requested demo during preview",
    })
  }

  async trackFeatureEngagement(feature: string, engagementLevel: "low" | "medium" | "high") {
    await this.trackFeatureInteraction(feature, "engagement", { level: engagementLevel })
  }
}

// Create singleton instance
export const usageTracker = typeof window !== "undefined" ? new UsageTracker() : null

// Convenience functions
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  usageTracker?.trackPageView(pagePath, pageTitle)
}

export const trackFeatureClick = (featureName: string, additionalData?: any) => {
  usageTracker?.trackFeatureInteraction(featureName, "click", additionalData)
}

export const trackFormInteraction = (formName: string, action: string, data?: any) => {
  usageTracker?.trackFeatureInteraction(formName, action, data)
}

export const trackSignupAttempt = (email?: string, source?: string) => {
  usageTracker?.trackSignupAttempt(email, source)
}

export const trackDemoRequest = (contactInfo: any) => {
  usageTracker?.trackDemoRequest(contactInfo)
}

export const markUserConverted = (userId: string) => {
  usageTracker?.markUserConverted(userId)
}