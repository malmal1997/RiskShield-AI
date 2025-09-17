import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/src/integrations/supabase/admin" // Changed import to server-side Supabase Admin client

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, pagePath, timeOnPage } = data;

    console.log("Received track-page-time payload:", { sessionId, pagePath, timeOnPage });

    // Validate incoming data more strictly
    if (!sessionId || typeof sessionId !== 'string' || sessionId.trim() === '') {
      console.error("Validation Error: Missing or invalid sessionId in track-page-time payload. Payload:", data);
      return NextResponse.json({ error: "Missing or invalid sessionId" }, { status: 400 });
    }
    if (!pagePath || typeof pagePath !== 'string' || pagePath.trim() === '') {
      console.error("Validation Error: Missing or invalid pagePath in track-page-time payload. Payload:", data);
      return NextResponse.json({ error: "Missing or invalid pagePath" }, { status: 400 });
    }
    // timeOnPage can be null or undefined, but if present, should be a number
    if (timeOnPage !== undefined && timeOnPage !== null && typeof timeOnPage !== 'number') {
      console.warn("Validation Warning: Invalid timeOnPage type, expected number or null/undefined. Payload:", data);
      // We can still proceed if other fields are valid, but log a warning
    }

    await supabaseAdmin // Changed from supabaseClient to supabaseAdmin
      .from("page_views")
      .update({ time_on_page: timeOnPage })
      .eq("session_id", sessionId)
      .eq("page_path", pagePath)
      .is("time_on_page", null)
      .order("created_at", { ascending: false })
      .limit(1)

    console.log("Successfully updated page_views for session:", sessionId, "path:", pagePath);
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page time:", error)
    return NextResponse.json({ error: "Failed to track page time" }, { status: 500 })
  }
}