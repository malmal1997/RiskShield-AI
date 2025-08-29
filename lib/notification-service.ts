import { supabaseClient } from "./supabase-client"
import { getCurrentUserWithProfile } from "./auth-service"

export interface Notification {
  id: string
  organization_id: string
  user_id: string
  type: string
  title: string
  message: string
  data: Record<string, any>
  read_at?: string
  created_at: string
}

// Create notification
export async function createNotification(data: {
  user_id: string
  type: string
  title: string
  message: string
  data?: Record<string, any>
}) {
  try {
    const { profile } = await getCurrentUserWithProfile()
    if (!profile) throw new Error("No user profile found")

    const { error } = await supabaseClient.from("notifications").insert({
      organization_id: profile.organization_id,
      ...data,
      data: data.data || {},
    })

    if (error) throw error
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  }
}

// Get user notifications
export async function getUserNotifications(limit = 50): Promise<Notification[]> {
  try {
    const { user } = await getCurrentUserWithProfile()
    if (!user) return []

    const { data, error } = await supabaseClient
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting notifications:", error)
    return []
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  try {
    const { error } = await supabaseClient
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("id", notificationId)

    if (error) throw error
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  try {
    const { user } = await getCurrentUserWithProfile()
    if (!user) return

    const { error } = await supabaseClient
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .is("read_at", null)

    if (error) throw error
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    throw error
  }
}

// Real-time notification subscription
export function subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
  return supabaseClient
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload.new as Notification)
      },
    )
    .subscribe()
}

// Notification types
export const NotificationTypes = {
  ASSESSMENT_COMPLETED: "assessment_completed",
  ASSESSMENT_OVERDUE: "assessment_overdue",
  VENDOR_INVITED: "vendor_invited",
  RISK_THRESHOLD_EXCEEDED: "risk_threshold_exceeded",
  REPORT_GENERATED: "report_generated",
  USER_INVITED: "user_invited",
  SYSTEM_ALERT: "system_alert",
} as const
