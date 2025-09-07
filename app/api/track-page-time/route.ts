import { type NextRequest, NextResponse } from "next/server"
import { supabaseClient } from "@/lib/supabase-client"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, pagePath, timeOnPage } = data

    await supabaseClient
      .from("page_views")
      .update({ time_on_page: timeOnPage })
      .eq("session_id", sessionId)
      .eq("page_path", pagePath)
      .is("time_on_page", null)
      .order("created_at", { ascending: false })
      .limit(1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page time:", error)
    return NextResponse.json({ error: "Failed to track page time" }, { status: 500 })
  }
}
