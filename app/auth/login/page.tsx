"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff, Play, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { supabaseClient } from "@/lib/supabase-client"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { refreshProfile, createDemoSession } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check for demo credentials first
      if (email === "demo@riskshield.ai" && password === "demo123") {
        console.log("[v0] Login: Creating admin demo session")
        createDemoSession("admin")
        await new Promise((resolve) => setTimeout(resolve, 500))
        router.push("/admin-dashboard")
        return
      }

      console.log("[v0] Login: Attempting Supabase authentication for:", email)
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (authError) {
        console.log("[v0] Login: Supabase auth error:", authError.message)
        setError("Invalid email or password. Please check your credentials or contact your administrator.")
        return
      }

      if (data.user) {
        console.log("[v0] Login: Supabase authentication successful for:", data.user.email)
        console.log("[v0] Login: Session established:", !!data.session)

        await new Promise((resolve) => setTimeout(resolve, 1500))

        const { data: sessionCheck } = await supabaseClient.auth.getSession()
        console.log("[v0] Login: Session verification:", !!sessionCheck.session)

        if (!sessionCheck.session) {
          console.log("[v0] Login: Session not established, retrying...")
          await new Promise((resolve) => setTimeout(resolve, 1000))
          const { data: retryCheck } = await supabaseClient.auth.getSession()
          console.log("[v0] Login: Retry session verification:", !!retryCheck.session)
        }

        console.log("[v0] Login: Refreshing auth profile...")
        await refreshProfile()

        await new Promise((resolve) => setTimeout(resolve, 1000))

        console.log("[v0] Login: Navigating to dashboard")
        router.push("/dashboard")
        return
      }

      setError("Authentication failed. Please try again.")
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail("demo@riskshield.ai")
    setPassword("demo123")
    setIsLoading(true)
    setError("")

    try {
      console.log("[v0] Login: Demo button clicked, creating admin session")

      createDemoSession("admin")

      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("[v0] Login: Navigating to admin dashboard")
      router.push("/admin-dashboard")
    } catch (err) {
      console.error("[v0] Demo login error:", err)
      setError("Demo login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
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
            {/* Demo Access Banner */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">Demo Access (Admin)</h3>
                  <p className="text-sm text-blue-700">Try the full enterprise platform</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Email: demo@riskshield.ai
                    <br />
                    Password: demo123
                  </p>
                </div>
                <Button
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Demo
                    </>
                  )}
                </Button>
              </div>
            </div>

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
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot your password?
              </Link>
              <div className="text-sm text-gray-600">
                {"Don't have an account? "}
                <Link href="/auth/register" className="text-blue-600 hover:underline">
                  Contact your administrator
                </Link>
              </div>
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
