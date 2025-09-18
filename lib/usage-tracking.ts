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
  timeOnPage?: number
}

interface FeatureInteractionData {
  sessionId: string
  featureName: string
  actionType: string
  featureData?: any
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
    if (!this.sessionId || this.sessionId.trim() === '') {
      console.warn("Skipping session initialization: Missing or invalid sessionId.");
      return;
    }
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
    // Ensure pagePath is a non-empty string
    const validatedPagePath = pagePath?.trim();
    if (!this.sessionId || this.sessionId.trim() === '' || !validatedPagePath || validatedPagePath.trim() === '') {
      console.warn("Skipping page view tracking: Missing sessionId or valid pagePath.", { sessionId: this.sessionId, pagePath });
      return;
    }
    try {
      // Track time on previous page
      if (this.currentPage && this.pageStartTime) {
        const timeOnPage = Math.round((Date.now() - this.pageStartTime) / 1000)
        await this.updatePageTime(this.currentPage, timeOnPage)
      }

      // Start tracking new page
      this.currentPage = validatedPagePath; // Use validated path
      this.pageStartTime = Date.now()
      this.lastActivity = Date.now()

      const pageViewData: PageViewData = {
        sessionId: this.sessionId,
        pagePath: validatedPagePath,
        pageTitle: pageTitle || document.title,
      }

      await supabaseClient.from("page_views").insert(pageViewData)

      // Update session stats
      await this.updateSessionActivity()
    } catch (error) {
      console.error("Error tracking page view:", error)
    }
  }

  async trackFeatureInteraction(featureName: string, actionType: string, featureData?: any) {
    // Ensure featureName and actionType are non-empty strings
    const validatedFeatureName = featureName?.trim();
    const validatedActionType = actionType?.trim();
    if (!this.sessionId || this.sessionId.trim() === '' || !validatedFeatureName || validatedFeatureName.trim() === '' || !validatedActionType || validatedActionType.trim() === '') {
      console.warn("Skipping feature interaction tracking: Missing sessionId, valid featureName, or valid actionType.", { sessionId: this.sessionId, featureName, actionType });
      return;
    }
    try {
      this.lastActivity = Date.now()

      const interactionData: FeatureInteractionData = {
        sessionId: this.sessionId,
        featureName: validatedFeatureName,
        actionType: validatedActionType,
        featureData,
      }

      await supabaseClient.from("feature_interactions").insert(interactionData)

      // Update session stats
      await this.updateSessionActivity()
    } catch (error) {
      console.error("Error tracking feature interaction:", error)
    }
  }

  async trackLead(leadData: Omit<LeadData, "sessionId">) {
    if (!this.sessionId || this.sessionId.trim() === '') {
      console.warn("Skipping lead tracking: Missing or invalid sessionId.", { sessionId: this.sessionId });
      return;
    }
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
    if (!this.sessionId || this.sessionId.trim() === '' || !userId || userId.trim() === '') {
      console.warn("Skipping user conversion tracking: Missing sessionId or userId.", { sessionId: this.sessionId, userId });
      return;
    }
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
    const validatedPagePath = pagePath?.trim();
    if (!this.sessionId || this.sessionId.trim() === '' || !validatedPagePath || validatedPagePath.trim() === '') {
      console.warn("Skipping page time update: Missing sessionId or valid pagePath.", { sessionId: this.sessionId, pagePath });
      return;
    }
    try {
      await supabaseClient
        .from("page_views")
        .update({ time_on_page: timeOnPage })
        .eq("session_id", this.sessionId)
        .eq("page_path", validatedPagePath)
        .is("time_on_page", null)
        .order("created_at", { ascending: false })
        .limit(1)
    } catch (error) {
      console.error("Error updating page time:", error)
    }
  }

  private async updateSessionActivity() {
    if (!this.sessionId || this.sessionId.trim() === '') {
      console.warn("Skipping session activity update: Missing or invalid sessionId.", { sessionId: this.sessionId });
      return;
    }
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
      if (this.currentPage && this.pageStartTime && this.sessionId && this.sessionId.trim() !== '') { // Ensure sessionId is present and valid
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
    // Validate email and source
    const validatedEmail = email?.trim();
    const validatedSource = source?.trim();
    if (!validatedEmail && !validatedSource) {
      console.warn("Skipping signup attempt tracking: Missing email and source.");
      return;
    }

    await this.trackFeatureInteraction("signup", "attempt", { email: validatedEmail, source: validatedSource })
    if (validatedEmail) {
      await this.trackLead({
        email: validatedEmail,
        interestLevel: "high",
        leadSource: validatedSource || "signup_form",
        notes: "Attempted to sign up during preview",
      })
    }
  }

  async trackDemoRequest(contactInfo: any) {
    // Basic validation for contactInfo
    if (!contactInfo || Object.keys(contactInfo).length === 0) {
      console.warn("Skipping demo request tracking: Empty contactInfo.");
      return;
    }

    await this.trackFeatureInteraction("demo", "request", contactInfo)
    await this.trackLead({
      ...contactInfo,
      interestLevel: "high",
      leadSource: "demo_request",
      notes: "Requested demo during preview",
    })
  }

  async trackFeatureEngagement(feature: string, engagementLevel: "low" | "medium" | "high") {
    // Validate feature
    const validatedFeature = feature?.trim();
    if (!validatedFeature) {
      console.warn("Skipping feature engagement tracking: Missing feature name.");
      return;
    }
    await this.trackFeatureInteraction(validatedFeature, "engagement", { level: engagementLevel })
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
