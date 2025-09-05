"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function SetupAdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create admin profile
        const { error: profileError } = await supabase.from("user_profiles").insert({
          user_id: authData.user.id,
          email: email,
          first_name: "Admin",
          last_name: "User",
        })

        if (profileError) throw profileError

        // Create admin role
        const { error: roleError } = await supabase.from("user_roles").insert({
          user_id: authData.user.id,
          role: "admin",
          permissions: ["manage_users", "manage_assessments", "manage_organizations", "view_analytics"],
        })

        if (roleError) throw roleError

        setSuccess(true)
      }
    } catch (error) {
      console.error("Error creating admin:", error)
      alert("Error creating admin account")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600">Admin Account Created!</CardTitle>
            <CardDescription>You can now log in with your credentials and access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => (window.location.href = "/auth/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Admin Account</CardTitle>
          <CardDescription>Create your first admin account for RiskShield AI</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetupAdmin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating Admin..." : "Create Admin Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
