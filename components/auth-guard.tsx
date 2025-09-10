"use client"

import type React from "react"
import { useAuth } from "./auth-context"
import { Button } from "@/components/ui/button"
import { Shield, Play, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"

// Paths that do NOT require authentication
const publicPaths = ['/', '/solutions', '/auth/login', '/auth/register', '/auth/forgot-password', '/demo', '/ai-test', '/system-status', '/demo-features'];

interface AuthGuardProps {
  children: React.ReactNode
  allowPreview?: boolean
  previewMessage?: string
}

export function AuthGuard({ children, allowPreview = false, previewMessage }: AuthGuardProps) {
  const { user, loading, isDemo, profile, organization, role, signOut } = useAuth() // Added organization
  const router = useRouter()
  const pathname = usePathname()

  const [redirecting, setRedirecting] = useState(false);
  const [showPendingApprovalMessage, setShowPendingApprovalMessage] = useState(false);

  useEffect(() => {
    console.log(`AuthGuard useEffect START: loading=${loading}, user=${user?.email}, profile=${profile?.first_name}, role=${role?.role}, isDemo=${isDemo}, pathname=${pathname}`);

    setShowPendingApprovalMessage(false); // Reset on each effect run

    if (loading) {
      setRedirecting(false);
      console.log("AuthGuard useEffect: Still loading, returning.");
      return; // Still loading auth state, do nothing yet
    }
    console.log("AuthGuard useEffect: Loading is false, proceeding with checks.");

    const isAuthenticated = !!user || isDemo;
    const isApproved = !!profile && !!role && !!organization; // User is fully approved if profile, role, AND organization are present
    const isPublicPath = publicPaths.includes(pathname);

    // Scenario 1: User is NOT authenticated (or demo) and tries to access a PROTECTED page
    if (!isAuthenticated && !isPublicPath && !allowPreview) {
      console.log(`AuthGuard: Redirecting unauthenticated user from ${pathname} to /auth/login`);
      setRedirecting(true);
      router.replace('/auth/login');
      return;
    } 
    
    // Scenario 2: User IS authenticated (Supabase user, not demo) but NOT APPROVED (no profile/role/organization)
    // This check applies to protected pages. If they are on login/register, they should be allowed to stay there.
    if (user && !isDemo && !isApproved && !isPublicPath && pathname !== '/auth/login' && pathname !== '/auth/register') {
      console.log(`AuthGuard: User ${user.email} is authenticated but not approved. Setting showPendingApprovalMessage to true.`);
      setShowPendingApprovalMessage(true); // Set state to show message
      setRedirecting(false);
      return;
    }

    // Scenario 3: User IS fully authenticated and APPROVED (has profile/role/organization) and tries to access an AUTH PAGE (login/register/forgot)
    if (isAuthenticated && isApproved && (pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/auth/forgot-password')) {
      console.log(`AuthGuard: Redirecting fully authenticated and approved user from ${pathname} to /dashboard`);
      setRedirecting(true);
      router.replace('/dashboard');
      return;
    }

    // If none of the above redirect/block conditions are met, then the user is allowed to view the current page.
    setRedirecting(false);
    console.log("AuthGuard useEffect END: User is allowed to view this page.");

  }, [loading, user, isDemo, profile, organization, role, allowPreview, pathname, router, signOut]); // Added organization to dependencies

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
    window.location.href = "/dashboard"; 
  };

  let contentToRender: React.ReactNode = null;

  const renderLoadingStateContent = () => {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">
            {loading ? "Loading authentication..." : "Redirecting..."}
          </p>
        </div>
      </div>
    );
  };

  const renderPendingApprovalStateContent = () => {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Account Pending Approval</h2>
                <p className="text-gray-600">
                  Your account ({user?.email}) is currently pending review by our administrators. You will receive an email notification once your account has been approved.
                </p>
                <div className="pt-4">
                  <Button className="w-full" onClick={signOut}>
                    Sign Out
                  </Button>
                  <a href="/auth/login">
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
  };

  if (loading || redirecting) {
    console.log("AuthGuard: Assigning loading state content.");
    contentToRender = renderLoadingStateContent();
  } else if (showPendingApprovalMessage && user && !isDemo && (!profile || !role || !organization)) { // Ensure all three are checked
    console.log("AuthGuard: Assigning pending approval state content.");
    contentToRender = renderPendingApprovalStateContent();
  } else {
    console.log("AuthGuard: Assigning children content.");
    contentToRender = <>{children}</>;
  }

  return contentToRender;
}