"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabaseClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"

interface DemoUser {
  id: string
  email: string
  name: string
}

interface DemoOrganization {
  id: string
  name: string
  plan: string
}

interface DemoSession {
  user: DemoUser
  organization: DemoOrganization
  role: string
  loginTime: string
}

interface AuthContextType {
  user: User | DemoUser | null
  profile: any | null
  organization: any | null
  role: any | null
  loading: boolean
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  hasPermission: (permission: string) => boolean
  createDemoSession: (userType?: "admin" | "user") => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any | null>(null)
  const [role, setRole] = useState<any | null>(null)
  const [loading, setLoading] = useState(false) // Start with false to prevent hydration issues
  const [isDemo, setIsDemo] = useState(false)

  const createDemoSession = useCallback((userType?: "admin" | "user") => {
    if (typeof window === "undefined") return

    console.log("[v0] AuthContext: Creating demo session for", userType)

    const demoSession: DemoSession = {
      user: {
        id: userType === "admin" ? "demo-admin-001" : "demo-user-001",
        email: userType === "admin" ? "demo@riskshield.ai" : "demo@example.com",
        name: userType === "admin" ? "Demo Admin" : "Demo User",
      },
      organization: {
        id: "demo-org-001",
        name: "Demo Organization",
        plan: "enterprise",
      },
      role: userType === "admin" ? "admin" : "user",
      loginTime: new Date().toISOString(),
    }

    try {
      sessionStorage.setItem("demo_session", JSON.stringify(demoSession))
      console.log("[v0] AuthContext: Demo session stored in sessionStorage")

      // Verify it was stored
      const stored = sessionStorage.getItem("demo_session")
      console.log("[v0] AuthContext: Verification - stored session:", stored)
    } catch (error) {
      console.error("[v0] AuthContext: Error storing demo session:", error)
      return
    }

    // Immediately set the auth state
    const demoRole = {
      role: demoSession.role,
      permissions:
        userType === "admin"
          ? ["manage_users", "manage_assessments", "manage_organizations", "view_analytics"]
          : ["view_assessments"],
    }

    const demoProfile = {
      first_name: userType === "admin" ? "Demo" : "Demo",
      last_name: userType === "admin" ? "Admin" : "User",
      organization_id: demoSession.organization.id,
      avatar_url: "/placeholder.svg?height=32&width=32",
    }

    console.log("[v0] AuthContext: Setting auth state - user:", demoSession.user)
    console.log("[v0] AuthContext: Setting auth state - role:", demoRole)
    console.log("[v0] AuthContext: Setting auth state - isDemo:", true)

    setUser(demoSession.user)
    setOrganization(demoSession.organization)
    setRole(demoRole)
    setProfile(demoProfile)
    setIsDemo(true)
    setLoading(false)

    console.log("[v0] AuthContext: Demo session created successfully")
  }, [])

  const refreshProfile = useCallback(async () => {
    if (typeof window === "undefined") {
      return
    }

    console.log("[v0] AuthContext: refreshProfile called")
    setLoading(true)

    const demoSession = sessionStorage.getItem("demo_session")
    console.log("[v0] AuthContext: Checking sessionStorage for demo_session:", demoSession)

    if (demoSession) {
      try {
        const session: DemoSession = JSON.parse(demoSession)
        console.log("[v0] AuthContext: Demo session found, setting demo user:", session)

        const demoRole = {
          role: session.role,
          permissions:
            session.role === "admin"
              ? ["manage_users", "manage_assessments", "manage_organizations", "view_analytics"]
              : ["view_assessments"],
        }

        const demoProfile = {
          first_name: session.role === "admin" ? "Demo" : "Demo",
          last_name: session.role === "admin" ? "Admin" : "User",
          organization_id: session.organization.id,
          avatar_url: "/placeholder.svg?height=32&width=32",
        }

        setUser(session.user)
        setOrganization(session.organization)
        setRole(demoRole)
        setProfile(demoProfile)
        setIsDemo(true)
        setLoading(false)

        console.log("[v0] AuthContext: Demo auth state set successfully")
        return
      } catch (error) {
        console.error("[v0] AuthContext: Error parsing demo session:", error)
        sessionStorage.removeItem("demo_session")
      }
    }

    try {
      let session = null
      let supabaseUser = null

      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log(`[v0] AuthContext: Session/User fetch attempt ${attempt}`)

        const sessionResult = await supabaseClient.auth.getSession()
        const userResult = await supabaseClient.auth.getUser()

        console.log(
          `[v0] AuthContext: Attempt ${attempt} - Session:`,
          !!sessionResult.data.session,
          "User:",
          !!userResult.data.user,
        )

        if (sessionResult.data.session && userResult.data.user) {
          session = sessionResult.data.session
          supabaseUser = userResult.data.user
          console.log(`[v0] AuthContext: Session and user found on attempt ${attempt}`)
          break
        }

        if (attempt < 3) {
          console.log(`[v0] AuthContext: Session/User not found on attempt ${attempt}, retrying...`)
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      if (!session || !supabaseUser) {
        console.log("[v0] AuthContext: No Supabase session or user found after retries")
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
      } else {
        console.log("[v0] AuthContext: Supabase user found, fetching profile")
        console.log("[v0] AuthContext: Supabase user ID:", supabaseUser.id)

        let profileData = null
        let profileError = null

        for (let attempt = 1; attempt <= 3; attempt++) {
          console.log(`[v0] AuthContext: Profile fetch attempt ${attempt}`)

          const result = await supabaseClient.from("user_profiles").select("*").eq("user_id", supabaseUser.id).single()

          profileData = result.data
          profileError = result.error

          if (!profileError && profileData) {
            console.log(`[v0] AuthContext: Profile found on attempt ${attempt}`)
            break
          }

          if (attempt < 3) {
            console.log(`[v0] AuthContext: Profile not found on attempt ${attempt}, retrying...`)
            await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait 1 second before retry
          }
        }

        console.log("[v0] AuthContext: Final profile query result:", { profileData, profileError })

        if (profileError || !profileData) {
          console.log("[v0] AuthContext: No profile found for user after retries, error:", profileError)
          setUser(supabaseUser)
          setProfile(null)
          setOrganization(null)
          setRole({ role: "user", permissions: ["view_assessments"] }) // Default role
          setIsDemo(false)
        } else {
          console.log("[v0] AuthContext: Profile found, fetching organization and role")
          // Get organization and role data
          const [orgResult, roleResult] = await Promise.all([
            supabaseClient.from("organizations").select("*").eq("id", profileData.organization_id).single(),
            supabaseClient.from("user_roles").select("*").eq("user_id", supabaseUser.id).single(),
          ])

          console.log("[v0] AuthContext: Organization result:", orgResult)
          console.log("[v0] AuthContext: Role result:", roleResult)

          setUser(supabaseUser)
          setProfile(profileData)
          setOrganization(orgResult.error ? null : orgResult.data)
          setRole(roleResult.error ? { role: "user", permissions: ["view_assessments"] } : roleResult.data)
          setIsDemo(false)
        }
      }
    } catch (error) {
      console.error("[v0] AuthContext: Error in auth check:", error)
      setUser(null)
      setProfile(null)
      setOrganization(null)
      setRole(null)
      setIsDemo(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let subscription: any = null

    if (typeof window !== "undefined") {
      refreshProfile()

      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("[v0] AuthContext: Auth state change event:", event)
        if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
          setLoading(false)
        } else if (session?.user) {
          await refreshProfile()
        }
      })
      subscription = authSubscription
    }

    return () => {
      if (subscription?.unsubscribe) {
        subscription.unsubscribe()
      }
    }
  }, [refreshProfile])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    // Clear demo session
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("demo_session")
    }
    setIsDemo(false)

    // Sign out from Supabase
    await supabaseClient.auth.signOut()

    // Reset state
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setRole(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!role) return false
    if (role.role === "admin" || isDemo) {
      console.log("[v0] AuthContext: Admin or demo user, granting permission:", permission)
      return true
    }
    return role.permissions && (role.permissions.includes(permission) || role.permissions === "all")
  }

  const value = {
    user,
    profile,
    organization,
    role,
    loading,
    isDemo,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    hasPermission,
    createDemoSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  console.log("useAuth hook: context =", context) // Added logging here
  if (context === undefined) {
    if (typeof window === "undefined") {
      return {
        user: null,
        profile: null,
        organization: null,
        role: null,
        loading: false,
        isDemo: false,
        signIn: async () => ({ error: null }),
        signUp: async () => ({ error: null }),
        signOut: async () => {},
        refreshProfile: async () => {},
        hasPermission: () => false,
        createDemoSession: () => {},
      }
    }
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
