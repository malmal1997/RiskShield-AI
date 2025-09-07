"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | DemoUser | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [organization, setOrganization] = useState<any | null>(null)
  const [role, setRole] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDemo, setIsDemo] = useState(false)

  const refreshProfile = async () => {
    console.log("AuthContext: refreshProfile called - START")
    // Check for demo session first
    const demoSession = localStorage.getItem("demo_session")
    if (demoSession) {
      try {
        const session: DemoSession = JSON.parse(demoSession)
        setUser(session.user)
        setOrganization(session.organization)
        setRole({ role: session.role, permissions: { all: true } })
        setProfile({
          first_name: "Demo",
          last_name: "User",
          organization_id: session.organization.id,
          avatar_url: "/placeholder.svg?height=32&width=32",
        })
        setIsDemo(true)
        setLoading(false)
        console.log("AuthContext: Demo session active. User:", session.user.email)
        return // IMPORTANT: Exit early if demo session is active
      } catch (error) {
        console.error("AuthContext: Error parsing demo session:", error)
        localStorage.removeItem("demo_session")
        // Fall through to regular Supabase auth if demo session is corrupted
      }
    }

    // Regular Supabase auth flow continues...
    try {
      const {
        data: { user: supabaseUser },
        error: userError,
      } = await supabaseClient.auth.getUser()

      if (userError || !supabaseUser) {
        console.log("AuthContext: No Supabase user found or userError:", userError?.message)
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        setLoading(false) // Ensure loading is set to false
        return
      }

      console.log("AuthContext: Supabase user found:", supabaseUser.email)
      setUser(supabaseUser) // Set user immediately

      // Get user profile from Supabase
      const { data: profileData, error: profileError } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .single()

      if (profileError || !profileData) {
        console.warn("AuthContext: No user profile found or profileError:", profileError?.message)
        setProfile(null)
        setOrganization(null) // Clear organization if profile is missing
        setRole(null) // Clear role if profile is missing
        setIsDemo(false)
        setLoading(false)
        return
      }

      console.log("AuthContext: Profile found for:", profileData.first_name, profileData.last_name)
      setProfile(profileData)

      // Get organization
      const { data: organizationData, error: orgError } = await supabaseClient
        .from("organizations")
        .select("*")
        .eq("id", profileData.organization_id)
        .single()

      if (orgError || !organizationData) {
        console.warn("AuthContext: No organization found or orgError:", orgError?.message)
        setOrganization(null)
        setRole(null) // Clear role if organization is missing
        setIsDemo(false)
        setLoading(false)
        return
      }

      console.log("AuthContext: Organization found:", organizationData.name)
      setOrganization(organizationData)

      // Get user role
      const { data: roleData, error: roleError } = await supabaseClient
        .from("user_roles")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .eq("organization_id", profileData.organization_id)
        .single()

      if (roleError || !roleData) {
        console.warn("AuthContext: No user role found or roleError:", roleError?.message)
        setRole(null)
        setIsDemo(false)
        setLoading(false)
        return
      }

      console.log("AuthContext: Role found:", roleData.role)
      setRole(roleData)
      setIsDemo(false)
      setLoading(false)
      console.log("AuthContext: refreshProfile completed successfully.")
    } catch (error) {
      console.error("AuthContext: Error during refreshProfile:", error)
      setUser(null)
      setProfile(null)
      setOrganization(null)
      setRole(null)
      setIsDemo(false)
      setLoading(false) // Ensure loading is set to false even on error
    }
  }

  useEffect(() => {
    let subscription: any = null

    const getInitialSession = async () => {
      await refreshProfile() // This handles both real and demo sessions
      // setLoading(false) // Moved inside refreshProfile for more granular control
    }

    getInitialSession()

    // Listen for auth changes
    try {
      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthContext: Auth state changed event:", event)
        // Always refresh profile on auth state change, let refreshProfile handle demo logic
        // This ensures the context is always up-to-date with Supabase's state
        await refreshProfile()
        // setLoading(false) // Moved inside refreshProfile for more granular control
      })

      subscription = authSubscription
    } catch (error) {
      console.error("AuthContext: Error setting up auth listener:", error)
      setLoading(false)
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          subscription.unsubscribe()
          console.log("AuthContext: Supabase auth subscription unsubscribed.")
        } catch (error) {
          console.error("AuthContext: Error unsubscribing from auth changes:", error)
        }
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signIn for:", email)
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error("AuthContext: SignIn error:", error.message)
    } else {
      console.log("AuthContext: SignIn successful for:", email)
    }
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signUp for:", email)
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
    if (error) {
      console.error("AuthContext: SignUp error:", error.message)
    } else {
      console.log("AuthContext: SignUp successful for:", email)
    }
    return { error }
  }

  const signOut = async () => {
    console.log("AuthContext: Attempting signOut.")
    // Clear demo session
    localStorage.removeItem("demo_session")
    setIsDemo(false)

    // Sign out from Supabase
    await supabaseClient.auth.signOut()

    // Reset state
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setRole(null)
    console.log("AuthContext: SignOut completed.")
  }

  const hasPermission = (permission: string): boolean => {
    if (!role) return false
    if (role.role === "admin" || isDemo) return true
    return role.permissions && (role.permissions[permission] === true || role.permissions.all === true)
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
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}