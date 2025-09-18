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

    // Check if a record exists for this session and page path that is still "open" (time_on_page is null)
    const { data: existingPageView, error: selectError } = await supabaseAdmin
      .from("page_views")
      .select("id")
      .eq("session_id", sessionId)
      .eq("page_path", pagePath)
      .is("time_on_page", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single(); // Use single to expect one or zero records

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means no rows found
      console.error("Supabase SELECT error in track-page-time:", selectError);
      return NextResponse.json({ error: "Database query failed during select" }, { status: 500 });
    }

    if (existingPageView) {
      // If an open page view exists, update it
      const { error: updateError } = await supabaseAdmin
        .from("page_views")
        .update({ time_on_page: timeOnPage })
        .eq("id", existingPageView.id); // Update by specific ID

      if (updateError) {
        console.error("Supabase UPDATE error in track-page-time:", updateError);
        return NextResponse.json({ error: "Failed to update page time" }, { status: 500 });
      }
      console.log("Successfully updated page_views for session:", sessionId, "path:", pagePath);
    } else {
      // If no open page view, it might be a new page load or a missed initial insert.
      // For now, we'll just log a warning. In a real app, you might want to insert a new record here
      // or ensure the initial insert is more robust.
      console.warn("No open page_view record found to update for session:", sessionId, "path:", pagePath);
      // Optionally, insert a new record if this is a valid scenario for a new page view
      // await supabaseAdmin.from("page_views").insert({ session_id: sessionId, page_path: pagePath, time_on_page: timeOnPage });
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking page time:", error)
    return NextResponse.json({ error: "Failed to track page time" }, { status: 500 })
  }
}
