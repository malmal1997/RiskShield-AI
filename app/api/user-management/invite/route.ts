import { type NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key for admin functions

export async function POST(request: NextRequest) {
  try {
    const { email, role, organizationId, inviterUserId } = await request.json();

    if (!email || !role || !organizationId || !inviterUserId) {
      return NextResponse.json({ error: "Missing required fields: email, role, organizationId, inviterUserId" }, { status: 400 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    // 1. Invite the user
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        organization_id: organizationId,
        invited_by: inviterUserId,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/login?invited=true`, // Redirect to login after invite
    });

    if (inviteError) {
      console.error("Supabase invite user error:", inviteError);
      return NextResponse.json({ error: inviteError.message }, { status: 500 });
    }

    if (!inviteData.user) {
      return NextResponse.json({ error: "Failed to create user during invitation." }, { status: 500 });
    }

    const newUserId = inviteData.user.id;

    // 2. Create user profile
    const { error: profileError } = await supabaseAdmin.from("user_profiles").insert({
      user_id: newUserId,
      organization_id: organizationId,
      first_name: null, // User will set this on first login
      last_name: null,
      email: email,
      timezone: "UTC", // Default, user can change
      language: "en", // Default, user can change
    });

    if (profileError) {
      console.error("Supabase create profile error:", profileError);
      // Attempt to delete the invited user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json({ error: `Failed to create user profile: ${profileError.message}` }, { status: 500 });
    }

    // 3. Assign user role
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({
      user_id: newUserId,
      organization_id: organizationId,
      role: role,
      permissions: {}, // Default empty permissions, can be updated later
    });

    if (roleError) {
      console.error("Supabase assign role error:", roleError);
      // Attempt to delete the invited user and profile if role assignment fails
      await supabaseAdmin.from("user_profiles").delete().eq("user_id", newUserId);
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json({ error: `Failed to assign user role: ${roleError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: `Invitation sent to ${email}.`, userId: newUserId }, { status: 200 });

  } catch (error) {
    console.error("Error in user invitation API:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "An unknown error occurred." }, { status: 500 });
  }
}
