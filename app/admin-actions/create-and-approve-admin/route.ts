import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/src/integrations/supabase/admin";
import { approveRegistration } from "@/app/admin-approval/actions";

export async function POST() {
  try {
    const email = "new.admin@riskguard.ai";
    const password = "StrongPassword123!"; // IMPORTANT: Please change this password immediately after logging in!
    const firstName = "New";
    const lastName = "Admin";
    const institutionName = "New Admin Org";
    const institutionType = "Commercial Bank";
    const phone = "555-111-2222";

    // 1. Create user in Supabase Auth (this should trigger handle_new_user to create pending_registrations)
    const { data: userCreationData, error: userCreationError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm email for admin creation
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        organization_name: institutionName,
        institution_type: institutionType,
        phone: phone,
      },
    });

    if (userCreationError) {
      console.error("Error creating user:", userCreationError);
      return NextResponse.json({ success: false, error: userCreationError.message }, { status: 500 });
    }

    const newUserId = userCreationData.user.id;
    console.log(`User created with ID: ${newUserId}`);

    // 2. Approve the pending registration for this new user
    // The handle_new_user trigger should have created a pending_registration entry with newUserId as its ID.
    const { success: approvalSuccess, error: approvalError } = await approveRegistration(newUserId, newUserId); // Admin user is the new user itself for approval

    if (approvalError) {
      console.error("Error approving registration:", approvalError);
      // Optionally, delete the user if approval fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId);
      return NextResponse.json({ success: false, error: approvalError }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Admin user '${email}' created and approved successfully.`,
      userId: newUserId,
      email: email,
      password: password,
    });

  } catch (error) {
    console.error("Unexpected error in create-and-approve-admin:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
