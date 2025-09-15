"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, User, Clock } from "lucide-react" // Added Clock icon
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPendingApproval, setShowPendingApproval] = useState(false); // New state for pending approval
  const router = useRouter()
  const { signIn, user, profile, role, organization, loading, signOut, refreshProfile, isDemo } = useAuth() // Get user, profile, role, loading from useAuth

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setShowPendingApproval(false);

    try {
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        setError(signInError.message)
        setIsLoading(false)
        return
      }

      // After successful signIn, explicitly refresh the profile to ensure latest data is fetched
      // This is crucial if the user was just approved and their profile/role were created.
      await refreshProfile();

    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // Effect to check user status after AuthContext has loaded
  useEffect(() => {
    console.log(`Login Page useEffect: loading=${loading}, user=${user?.email}, profile=${profile?.first_name}, role=${role?.role}, isDemo=${isDemo}, organization=${organization?.name}`);
    if (!loading && user && !isDemo) { // Only check for non-demo users
      // A user is considered "approved" if they have a profile, a role, AND an organization.
      const isApproved = !!profile && !!role && !!organization; // Use the same definition as AuthGuard

      if (!isApproved) {
        // User is authenticated in Supabase, but not fully approved
        console.log(`Login Page: User ${user.email} is authenticated but not approved. Showing pending message.`);
        setShowPendingApproval(true);
        setError("Your account is pending approval. Please wait for an administrator to approve your registration.");
      } else {
        // User is authenticated AND approved, redirect to dashboard
        console.log(`Login Page: User ${user.email} is authenticated and approved. Redirecting to dashboard.`);
        router.replace('/dashboard');
      }
    }
  }, [loading, user, isDemo, profile, role, organization, router]); // Added organization to dependencies

  const handleDemoLogin = () => {
    localStorage.setItem("demo_session", JSON.stringify({ user: { id: "demo-user-id", email: "demo@riskguard.ai", name: "Demo User" }, organization: { id: "demo-org-id", name: "RiskGuard Demo Organization", plan: "enterprise" }, role: "admin", loginTime: new Date().toISOString() }));
    window.location.href = "/dashboard"; // Redirect to dashboard after setting demo session
  };


  if (showPendingApproval) {
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
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">RiskShield AI</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your financial institution account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your risk management dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@bank.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/auth/register" className="text-blue-600 hover:underline">
                  Register your institution
                </Link>
              </div>
              <Button variant="link" onClick={handleDemoLogin} className="w-full text-blue-600 hover:underline">
                Continue as Demo User
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}