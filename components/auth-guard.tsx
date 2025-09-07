"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Shield, Play } from "lucide-react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  allowPreview?: boolean
  previewMessage?: string
}

export function AuthGuard({ children, allowPreview = false, previewMessage }: AuthGuardProps) {
  const { user, profile, organization, loading, isDemo } = useAuth() // Added profile and organization
  const router = useRouter()
  const pathname = usePathname()

  // Paths that do NOT require authentication
  const publicPaths = ['/', '/solutions', '/auth/login', '/auth/register', '/auth/forgot-password', '/demo', '/ai-test', '/system-status', '/demo-features'];

  useEffect(() => {
    // If still loading auth state, do nothing yet.
    if (loading) {
      return;
    }

    // A user is considered fully authenticated if:
    // 1. It's a demo session, OR
    // 2. A Supabase user object exists AND their profile AND organization data are loaded.
    const isAuthenticated = isDemo || (!!user && !!profile && !!organization);

    const isPublicPath = publicPaths.includes(pathname);

    // Scenario 1: User is NOT authenticated and tries to access a PROTECTED page
    if (!isAuthenticated && !isPublicPath && !allowPreview) {
      console.log(`AuthGuard: Redirecting unauthenticated user from ${pathname} to /auth/login`);
      router.replace('/auth/login');
      return; // Prevent further execution
    } 
    
    // Scenario 2: User IS authenticated and tries to access an AUTH PAGE (login/register/forgot)
    if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forgot-password')) {
      console.log(`AuthGuard: Redirecting authenticated user from ${pathname} to /dashboard`);
      router.replace('/dashboard');
      return; // Prevent further execution
    }

    // Scenario 3: User is NOT authenticated but is on a PUBLIC page or ALLOWED PREVIEW
    // In this case, no redirect is needed, just render children.
    // Scenario 4: User IS authenticated and is on a PROTECTED page
    // In this case, no redirect is needed, just render children.

  }, [loading, user, profile, organization, isDemo, allowPreview, pathname, router, publicPaths]); // Added profile and organization to dependencies

  const handleDemoLogin = () => {
    localStorage.setItem(
      "demo_session",
      JSON.stringify({
        user: {
          id: "demo-user-id",
          email: "demo@riskguard.ai",
          name: "Demo User",
        },
        organization: {
          id: "demo-org-id",
          name: "RiskGuard Demo Organization",
          plan: "enterprise",
        },
        role: "admin",
        loginTime: new Date().toISOString(),
        profile: { // Added profile to demo session for consistency
          first_name: "Demo",
          last_name: "User",
          organization_id: "demo-org-id",
          avatar_url: "/placeholder.svg?height=32&width=32",
        }
      }),
    );
    // Force full page reload to ensure AuthContext re-evaluates and navigation updates
    window.location.href = "/dashboard"; 
  };

  // Render loading spinner if auth is still resolving
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  // After loading, if not authenticated and not a public path, and not allowed preview, show preview banner or redirect
  const isAuthenticated = isDemo || (!!user && !!profile && !!organization); // Updated check here too
  const isPublicPath = publicPaths.includes(pathname);

  if (!isAuthenticated && allowPreview && !isPublicPath) {
    // This is the preview mode for protected pages
    return (
      <div className="min-h-screen bg-white">
        {/* Preview Banner */}
        <div className="bg-blue-600 text-white py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span className="font-medium">
                {previewMessage || "You're viewing a preview. Sign up for full access to all features."}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleDemoLogin}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Play className="h-4 w-4 mr-1" />
                Try Demo
              </Button>
              <a href="/auth/register" className="text-white hover:text-blue-100 text-sm font-medium">
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  // If authenticated, or on a public path, or if allowPreview is true and we're not on a public path (handled above)
  return <>{children}</>;
}