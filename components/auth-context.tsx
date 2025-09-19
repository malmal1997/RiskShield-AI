"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
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
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)
  const refreshingRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    } catch (error) {
      console.error("[v0] AuthContext: Error storing demo session:", error)
      return
    }

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

    if (refreshingRef.current) {
      console.log("[v0] AuthContext: refreshProfile already in progress, skipping")
      return
    }

    console.log("[v0] AuthContext: refreshProfile called")
    refreshingRef.current = true
    setLoading(true)

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      console.log("[v0] AuthContext: refreshProfile timeout, forcing loading to false")
      setLoading(false)
      refreshingRef.current = false
    }, 10000) // 10 second timeout

    try {
      const demoSession = sessionStorage.getItem("demo_session")
      if (demoSession) {
        try {
          const session: DemoSession = JSON.parse(demoSession)
          console.log("[v0] AuthContext: Demo session found, setting demo user")

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
          refreshingRef.current = false
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          return
        } catch (error) {
          console.error("[v0] AuthContext: Error parsing demo session:", error)
          sessionStorage.removeItem("demo_session")
        }
      }

      try {
        const supabase = createClient()
        console.log("[v0] AuthContext: Checking Supabase auth...")

        const {
          data: { user: supabaseUser },
          error: userError,
        } = await supabase.auth.getUser()

        console.log("[v0] AuthContext: Supabase getUser result:", {
          user: supabaseUser ? { id: supabaseUser.id, email: supabaseUser.email } : null,
          error: userError,
        })

        if (userError || !supabaseUser) {
          console.log("[v0] AuthContext: No authenticated user found")
          setUser(null)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
          setLoading(false)
          refreshingRef.current = false
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          return
        }

        console.log("[v0] AuthContext: Authenticated user found:", supabaseUser.email)

        console.log("[v0] AuthContext: Fetching user profile...")
        const { data: profileData, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", supabaseUser.id)
          .single()

        console.log("[v0] AuthContext: Profile fetch result:", {
          profile: profileData,
          error: profileError,
        })

        if (profileError) {
          console.log("[v0] AuthContext: Profile not found, using default profile")
          // Use default profile if none exists (will be created by trigger)
          setProfile({
            user_id: supabaseUser.id,
            email: supabaseUser.email,
            first_name: supabaseUser.email?.split("@")[0] || "User",
            timezone: "UTC",
            language: "en",
          })
        } else {
          setProfile(profileData)
        }

        let orgData = null
        let roleData = null

        if (profileData?.organization_id) {
          console.log("[v0] AuthContext: Fetching organization...")
          const { data: orgResult } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", profileData.organization_id)
            .single()
          orgData = orgResult
          console.log("[v0] AuthContext: Organization result:", orgData)
        }

        console.log("[v0] AuthContext: Fetching user role...")
        const { data: roleResult, error: roleError } = await supabase
          .from("user_roles")
          .select("*")
          .eq("user_id", supabaseUser.id)
          .single()

        console.log("[v0] AuthContext: Role fetch result:", {
          role: roleResult,
          error: roleError,
        })

        roleData = roleResult || { role: "user", permissions: ["view_assessments"] }

        console.log("[v0] AuthContext: Setting final auth state:", {
          user: supabaseUser.email,
          role: roleData.role,
          permissions: roleData.permissions,
          organization: orgData?.name,
        })

        setUser(supabaseUser)
        setOrganization(orgData)
        setRole(roleData)
        setIsDemo(false)
      } catch (error) {
        console.error("[v0] AuthContext: Error in auth check:", error)
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
      }
    } catch (error) {
      console.error("[v0] AuthContext: Unexpected error in refreshProfile:", error)
      setUser(null)
      setProfile(null)
      setOrganization(null)
      setRole(null)
      setIsDemo(false)
    } finally {
      setLoading(false)
      refreshingRef.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    let subscription: any = null
    let mounted = true

    if (typeof window !== "undefined") {
      const supabase = createClient()

      refreshProfile()

      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return

        console.log("[v0] AuthContext: Auth state change event:", event)

        if (event === "SIGNED_OUT") {
          setUser(null)
          setProfile(null)
          setOrganization(null)
          setRole(null)
          setIsDemo(false)
          setLoading(false)
          refreshingRef.current = false
        } else if (event === "SIGNED_IN" && session?.user) {
          setTimeout(() => {
            if (mounted && !refreshingRef.current) {
              refreshProfile()
            }
          }, 100)
        }
      })

      subscription = authSubscription
    }

    return () => {
      mounted = false
      if (subscription?.unsubscribe) {
        subscription.unsubscribe()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [refreshProfile])

  const signIn = async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      },
    })
    return { error }
  }

  const signOut = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("demo_session")
    }
    setIsDemo(false)

    const supabase = createClient()
    await supabase.auth.signOut()

    setUser(null)
    setProfile(null)
    setOrganization(null)
    setRole(null)
  }

  const hasPermission = (permission: string): boolean => {
    if (!role) return false
    if (role.role === "admin" || isDemo) {
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
