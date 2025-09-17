import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/src/integrations/supabase/admin" // Changed import to server-side Supabase Admin client

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, pagePath, timeOnPage } = data

    if (!sessionId || !pagePath) {
      console.error("Error tracking page time: Missing sessionId or pagePath.", { sessionId, pagePath });
      return NextResponse.json({ error: "Missing sessionId or pagePath" }, { status: 400 });
    }

    await supabaseAdmin // Changed from supabaseClient to supabaseAdmin
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