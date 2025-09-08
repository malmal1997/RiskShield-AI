"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Shield, Play, Clock } from "lucide-react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card" // Import Card and CardContent

interface AuthGuardProps {
  children: React.ReactNode
  allowPreview?: boolean
  previewMessage?: string
}

export function AuthGuard({ children, allowPreview = false, previewMessage }: AuthGuardProps) {
  const { user, loading, isDemo, profile, role, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Paths that do NOT require authentication
  const publicPaths = ['/', '/solutions', '/auth/login', '/auth/register', '/auth/forgot-password', '/demo', '/ai-test', '/system-status', '/demo-features'];

  useEffect(() => {
    console.log(`AuthGuard useEffect: loading=${loading}, user=${user?.email}, profile=${profile?.first_name}, role=${role?.role}, isDemo=${isDemo}, pathname=${pathname}`);

    // If still loading auth state, do nothing yet.
    if (loading) {
      console.log("AuthGuard: Still loading, returning early.");
      return;
    }

    const isAuthenticated = !!user || isDemo;
    const isApproved = !!profile && !!role; // User is approved if they have a profile and role
    const isPublicPath = publicPaths.includes(pathname);

    // Scenario 1: User is NOT authenticated (or demo) and tries to access a PROTECTED page
    if (!isAuthenticated && !isPublicPath && !allowPreview) {
      console.log(`AuthGuard: Redirecting unauthenticated user from ${pathname} to /auth/login`);
      router.replace('/auth/login');
      return;
    } 
    
    // Scenario 2: User IS authenticated (Supabase user, not demo) but NOT APPROVED (no profile/role)
    // and tries to access any page other than login/register/forgot.
    // This means they've signed up but an admin hasn't approved them yet.
    // IMPORTANT: We remove the signOut() and router.replace() here.
    // Instead, the render logic will handle displaying a "Pending Approval" message.
    if (user && !isDemo && !isApproved && !isPublicPath && pathname !== '/auth/login' && pathname !== '/auth/register') {
      console.log(`AuthGuard: User ${user.email} is authenticated but not approved. Will render pending message.`);
      // Do NOT redirect or sign out here. Let the render logic handle it.
      return;
    }

    // Scenario 3: User IS fully authenticated and APPROVED (has profile/role) and tries to access an AUTH PAGE (login/register/forgot)
    if (isAuthenticated && isApproved && (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forgot-password')) {
      console.log(`AuthGuard: Redirecting fully authenticated and approved user from ${pathname} to /dashboard`);
      router.replace('/dashboard');
      return;
    }

    console.log(`AuthGuard: No redirect needed. isAuthenticated=${isAuthenticated}, isApproved=${isApproved}, isPublicPath=${isPublicPath}, allowPreview=${allowPreview}`);

  }, [loading, user, isDemo, profile, role, allowPreview, pathname, router, signOut, publicPaths]);

  const handleDemoLogin = () => {
    console.log("AuthGuard: handleDemoLogin called.");
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
      }),
    );
    // Force full page reload to ensure AuthContext re-evaluates and navigation updates
    window.location.href = "/dashboard"; 
  };

  // Render loading spinner if auth is still resolving
  if (loading) {
    console.log("AuthGuard: Rendering loading spinner.");
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user || isDemo;
  const isApproved = !!profile && !!role;
  const isPublicPath = publicPaths.includes(pathname);

  // New render condition for authenticated but unapproved users on protected paths
  if (user && !isDemo && !isApproved && !isPublicPath) {
    console.log("AuthGuard: Rendering 'Pending Approval' message for authenticated but unapproved user.");
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Account Pending Approval</h2>
                <p className="text-gray-600">
                  Your account ({user.email}) is currently pending review by our administrators. You will receive an email notification once your account has been approved.
                </p>
                <div className="pt-4">
                  <Button className="w-full" onClick={signOut}>
                    Sign Out
                  </Button>
                  <a href="/auth/login"> {/* Use <a> tag for full page reload to login page */}
                    <Button variant="outline" className="w-full mt-2">
                      Go to Login Page
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // If not authenticated and not a public path, and not allowed preview, show preview banner or redirect
  if (!isAuthenticated && allowPreview && !isPublicPath) {
    // This is the preview mode for protected pages
    console.log("AuthGuard: Rendering preview banner for protected page.");
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
  console.log("AuthGuard: Rendering children.");
  return <>{children}</>;
}