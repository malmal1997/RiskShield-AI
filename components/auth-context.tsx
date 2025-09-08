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

interface DemoProfile {
  first_name: string;
  last_name: string;
  organization_id: string;
  avatar_url: string;
}

interface DemoSession {
  user: DemoUser
  organization: DemoOrganization
  role: { role: string; permissions: { all: true } } // Updated to object
  loginTime: string
  profile: DemoProfile;
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
    // Check for demo session first
    const demoSession = localStorage.getItem("demo_session")
    if (demoSession) {
      try {
        const session: DemoSession = JSON.parse(demoSession)
        setUser(session.user)
        setOrganization(session.organization)
        setRole(session.role) // Directly use the object
        setProfile(session.profile)
        setIsDemo(true)
        setLoading(false)
        console.log("AuthContext: Demo session loaded successfully.")
        return
      } catch (error) {
        console.error("AuthContext: Error parsing demo session:", error)
        localStorage.removeItem("demo_session")
      }
    }

    // Regular Supabase auth flow continues...
    try {
      console.log("AuthContext: Attempting to fetch Supabase user...")
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser()

      if (userError) {
        console.error("AuthContext: Supabase getUser error:", userError.message)
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      if (!user) {
        console.log("AuthContext: No authenticated Supabase user found.")
        setUser(null)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      console.log("AuthContext: Supabase user found:", user.email, "ID:", user.id)

      // Get user profile from Supabase
      console.log("AuthContext: Fetching user profile...")
      const { data: profile, error: profileError } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()

      if (profileError) {
        console.error("AuthContext: Supabase profile error:", profileError.message)
        setUser(user) // Still set user even if profile fails
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      if (!profile) {
        console.log("AuthContext: No user profile found for user ID:", user.id)
        setUser(user)
        setProfile(null)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      console.log("AuthContext: User profile found:", profile)

      // Get organization
      console.log("AuthContext: Fetching organization for ID:", profile.organization_id)
      const { data: organization, error: orgError } = await supabaseClient
        .from("organizations")
        .select("*")
        .eq("id", profile.organization_id)
        .single()

      if (orgError) {
        console.error("AuthContext: Supabase organization error:", orgError.message)
        setUser(user)
        setProfile(profile)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      if (!organization) {
        console.log("AuthContext: No organization found for ID:", profile.organization_id)
        setUser(user)
        setProfile(profile)
        setOrganization(null)
        setRole(null)
        setIsDemo(false)
        return
      }

      console.log("AuthContext: Organization found:", organization.name)

      // Get user role
      console.log("AuthContext: Fetching user role for user ID:", user.id, "and organization ID:", profile.organization_id)
      const { data: roleData, error: roleError } = await supabaseClient
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("organization_id", profile.organization_id)
        .single()

      if (roleError) {
        console.error("AuthContext: Supabase role error:", roleError.message)
        setUser(user)
        setProfile(profile)
        setOrganization(organization)
        setRole(null)
        setIsDemo(false)
        return
      }

      if (!roleData) {
        console.log("AuthContext: No user role found for user ID:", user.id)
        setUser(user)
        setProfile(profile)
        setOrganization(organization)
        setRole(null)
        setIsDemo(false)
        return
      }

      console.log("AuthContext: User role found:", roleData.role)

      setUser(user)
      setProfile(profile)
      setOrganization(organization)
      setRole(roleData)
      setIsDemo(false)
      console.log("AuthContext: All user data loaded successfully.")
    } catch (error) {
      console.error("AuthContext: General error during refreshProfile:", error)
      setUser(null)
      setProfile(null)
      setOrganization(null)
      setRole(null)
      setIsDemo(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let subscription: any = null

    const getInitialSession = async () => {
      await refreshProfile() // This handles both real and demo sessions
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    try {
      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        // Always refresh profile on auth state change, let refreshProfile handle demo logic
        // This ensures the context is always up-to-date with Supabase's state
        await refreshProfile()
        setLoading(false)
      })

      subscription = authSubscription
    } catch (error) {
      console.error("Error setting up auth listener:", error)
      setLoading(false)
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.error("Error unsubscribing from auth changes:", error)
        }
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    // Clear demo session before attempting a real login
    localStorage.removeItem("demo_session")
    setIsDemo(false)

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
    localStorage.removeItem("demo_session")
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