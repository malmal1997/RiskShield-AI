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
  const { signIn, user, profile, role, loading, signOut } = useAuth() // Get user, profile, role, loading from useAuth

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

      // If signIn is successful, AuthContext's onAuthStateChange listener will fire.
      // We need to wait for the profile and role to be loaded by AuthContext.
      // The redirect logic is now primarily handled by AuthGuard.
      // If the user is signed in but has no profile/role, it means their registration is pending.
      // This check will be done in the useEffect below.

    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  // Effect to check user status after AuthContext has loaded
  useEffect(() => {
    if (!loading && user && !profile && !role) {
      // User is authenticated in Supabase, but no profile/role means pending approval
      setShowPendingApproval(true);
      setError("Your account is pending approval. Please wait for an administrator to approve your registration.");
      // Optionally, sign out the user if they are not approved to prevent them from staying logged in
      // signOut(); 
    } 
    // Removed the else if (!loading && user && profile && role) { router.replace('/dashboard'); }
    // This redirection is now handled by AuthGuard.
  }, [loading, user, profile, role, setShowPendingApproval, setError, signOut]);

  const handleDemoLogin = () => {
    localStorage.setItem("demo_session", JSON.stringify({ user: { id: "demo-user-id", email: "demo@riskguard.ai", name: "Demo User" }, organization: { id: "demo-org-id", name: "RiskGuard Demo Organization", plan: "enterprise" }, role: "admin", loginTime: new Date().toISOString() }));
    window.location.href = "/dashboard"; // Redirect to dashboard after setting demo session
  };


  if (showPendingApproval) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Clock className="h-16 w-16 text-yellow-500 mx-auto" />
                <h2 className="text-2xl font-bold text-gray-900">Account Pending Approval</h2>
                <p className="text-gray-600">
                  Your registration for <strong>{email}</strong> is currently pending review by our administrators. You will receive an email notification once your account has been approved.
                </p>
                <div className="pt-4">
                  <Button className="w-full" onClick={() => {
                    setShowPendingApproval(false);
                    setError("");
                    setEmail("");
                    setPassword("");
                  }}>
                    Try Again
                  </Button>
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
            <span className="text-2xl font-bold text-gray-900">RiskGuard AI</span>
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