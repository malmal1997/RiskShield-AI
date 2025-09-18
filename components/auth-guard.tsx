"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Shield, Play, Clock } from "lucide-react"
import { useEffect } from "react" // Removed useState for redirecting
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import type { UserPermissions } from "@/lib/auth-service" // Import UserPermissions

// Define required permissions for specific paths
const pathPermissions: Record<string, keyof UserPermissions | null> = {
  '/dashboard': 'view_dashboard',
  '/risk-assessment': 'view_assessments',
  '/third-party-assessment': 'view_assessments',
  '/policy-generator': 'create_policies',
  '/policy-library': 'view_policies',
  '/settings': 'manage_organization_settings', // General settings access
  '/settings/personal': 'view_dashboard', // Personal settings are generally accessible if authenticated
  '/settings/team-management': 'manage_team_members',
  '/settings/integrations': 'manage_integrations',
  '/admin-approval': 'review_registrations',
  '/assessment-templates': 'manage_assessment_templates',
  '/assessment-templates/create': 'manage_assessment_templates',
  '/vendors': 'view_vendors',
  '/reports': 'view_reports',
  '/analytics': 'view_analytics',
  '/dev-dashboard': 'access_dev_dashboard',
  '/ai-test': 'access_ai_test', // Updated to new permission
  '/demo-features': 'view_demo_features', // Updated to new permission
  '/demo': 'view_interactive_demo', // Updated to new permission
  '/system-status': 'view_system_status', // Updated to new permission
};

// Paths that do NOT require authentication
const publicPaths = ['/', '/solutions', '/auth/login', '/auth/register', '/auth/forgot-password'];

interface AuthGuardProps {
  children: React.ReactNode
  allowPreview?: boolean
  previewMessage?: string
  permission?: keyof UserPermissions; // New optional permission prop
}

export function AuthGuard({ children, allowPreview = false, previewMessage, permission }: AuthGuardProps) {
  const { user, loading, isDemo, profile, organization, role, signOut, hasPermission } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log(`AuthGuard useEffect START: pathname=${pathname}, loading=${loading}, user=${user?.email}, profile=${profile?.first_name}, role=${role?.role}, isDemo=${isDemo}`);

    if (loading) {
      console.log("AuthGuard useEffect: Still loading auth state, returning.");
      return;
    }
    console.log("AuthGuard useEffect: Auth state loaded, proceeding with checks.");

    const isAuthenticated = !!user || isDemo;
    const isApproved = !!profile && !!role && !!organization;
    const isAuthPage = ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname);

    let redirectTo: string | null = null;

    // 1. If user is authenticated (real user or demo) AND on the public landing page ('/'):
    if (isAuthenticated && pathname === '/') {
      redirectTo = '/dashboard';
      console.log(`AuthGuard: Authenticated user on landing page. Setting redirect to ${redirectTo}.`);
    }
    // 2. If user is authenticated (real user, not demo) but NOT APPROVED:
    else if (user && !isDemo && !isApproved && !isAuthPage) {
      redirectTo = '/auth/login';
      console.log(`AuthGuard: User ${user.email} is authenticated but NOT APPROVED. Setting redirect to ${redirectTo}.`);
    }
    // 3. If user is FULLY APPROVED (authenticated and approved) AND on an auth page:
    else if (isAuthenticated && isApproved && isAuthPage) {
      redirectTo = '/dashboard';
      console.log(`AuthGuard: User ${user?.email} is FULLY APPROVED and on an auth page. Setting redirect to ${redirectTo}.`);
    }
    // 4. If user is NOT AUTHENTICATED and tries to access a PROTECTED page:
    else if (!isAuthenticated && !publicPaths.includes(pathname) && !allowPreview) {
      redirectTo = '/auth/login';
      console.log(`AuthGuard: User is NOT AUTHENTICATED. Setting redirect to ${redirectTo}.`);
    }
    // 5. If user is AUTHENTICATED but lacks specific permission for the current path
    else if (isAuthenticated && !publicPaths.includes(pathname) && !allowPreview) {
      const requiredPermission = permission || pathPermissions[pathname]; // Use prop permission if provided, else path-based
      if (requiredPermission && !hasPermission(requiredPermission)) {
        redirectTo = '/dashboard'; // Redirect to dashboard if permission is missing
        console.log(`AuthGuard: User ${user?.email} lacks permission '${requiredPermission}' for ${pathname}. Redirecting to ${redirectTo}.`);
      }
    }

    // Perform redirection if a target path is determined and it's different from the current path
    if (redirectTo && pathname !== redirectTo) {
      console.log(`AuthGuard: Initiating router.replace(${redirectTo}) from ${pathname}.`);
      router.replace(redirectTo);
    } else {
      console.log(`AuthGuard: No redirection needed for ${pathname}.`);
    }

  }, [loading, user, isDemo, profile, organization, role, allowPreview, pathname, router, hasPermission, permission]);

  // Render logic:
  // If still loading auth state, show a loading spinner.
  if (loading) {
    console.log("AuthGuard: Rendering loading state.");
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // Determine if a redirect is pending based on current state and pathname
  const isAuthenticated = !!user || isDemo;
  const isApproved = !!profile && !!role && !!organization;
  const isAuthPage = ['/auth/login', '/auth/register', '/auth/forgot-password'].includes(pathname);

  let isRedirectPending = false;
  if (isAuthenticated && pathname === '/') {
    isRedirectPending = true;
  } else if (user && !isDemo && !isApproved && !isAuthPage) {
    isRedirectPending = true;
  } else if (isAuthenticated && isApproved && isAuthPage) {
    isRedirectPending = true;
  } else if (!isAuthenticated && !publicPaths.includes(pathname) && !allowPreview) {
    isRedirectPending = true;
  } else if (isAuthenticated && !publicPaths.includes(pathname) && !allowPreview) {
    const requiredPermission = permission || pathPermissions[pathname];
    if (requiredPermission && !hasPermission(requiredPermission)) {
      isRedirectPending = true;
    }
  }

  // If a redirect is pending, show a redirecting message and suppress children rendering.
  if (isRedirectPending) {
    console.log(`AuthGuard: Suppressing children render for ${pathname} due to pending redirect.`);
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // If no loading and no redirect is pending, render children.
  console.log("AuthGuard: Rendering children.");
  return <>{children}</>;
}