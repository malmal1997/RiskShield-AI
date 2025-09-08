"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase-client"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation" // Import useRouter

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
  const router = useRouter() // Initialize useRouter

  const refreshProfile = async () => {
    setLoading(true); // Ensure loading is true at the start of refresh
    console.log("AuthContext: Starting refreshProfile...");

    // Clear previous state before attempting to load new state
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setRole(null);
    setIsDemo(false);

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
        console.log("AuthContext: Demo session loaded successfully. User:", session.user.email);
        return
      } catch (error) {
        console.error("AuthContext: Error parsing demo session:", error)
        localStorage.removeItem("demo_session")
        // Continue to Supabase auth if demo session fails
      }
    }

    // Regular Supabase auth flow continues...
    try {
      console.log("AuthContext: Attempting to fetch Supabase user...")
      const {
        data: { user: supabaseUser },
        error: userError,
      } = await supabaseClient.auth.getUser()

      if (userError) {
        console.error("AuthContext: Supabase getUser error:", userError.message);
        // Ensure state is cleared and loading is false
        setUser(null); setProfile(null); setOrganization(null); setRole(null); setIsDemo(false);
        return;
      }

      if (!supabaseUser) {
        console.log("AuthContext: No authenticated Supabase user found.");
        // Ensure state is cleared and loading is false
        setUser(null); setProfile(null); setOrganization(null); setRole(null); setIsDemo(false);
        return;
      }

      console.log("AuthContext: Supabase user found:", supabaseUser.email, "ID:", supabaseUser.id)
      setUser(supabaseUser); // Set user immediately

      // Get user profile from Supabase
      console.log("AuthContext: Fetching user profile for user ID:", supabaseUser.id)
      const { data: profileData, error: profileError } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .single()

      if (profileError) {
        console.error("AuthContext: Supabase profile error:", profileError.message);
        setProfile(null); setOrganization(null); setRole(null); setIsDemo(false);
        return;
      }

      if (!profileData) {
        console.log("AuthContext: No user profile found for user ID:", supabaseUser.id);
        setProfile(null); setOrganization(null); setRole(null); setIsDemo(false);
        return;
      }

      console.log("AuthContext: User profile found:", profileData)
      setProfile(profileData); // Set profile immediately

      // Get organization
      console.log("AuthContext: Fetching organization for ID:", profileData.organization_id)
      const { data: organizationData, error: orgError } = await supabaseClient
        .from("organizations")
        .select("*")
        .eq("id", profileData.organization_id)
        .single()

      if (orgError) {
        console.error("AuthContext: Supabase organization error:", orgError.message);
        setOrganization(null); setRole(null); setIsDemo(false);
        return;
      }

      if (!organizationData) {
        console.log("AuthContext: No organization found for ID:", profileData.organization_id);
        setOrganization(null); setRole(null); setIsDemo(false);
        return;
      }

      console.log("AuthContext: Organization found:", organizationData.name)
      setOrganization(organizationData); // Set organization immediately

      // Get user role
      console.log("AuthContext: Fetching user role for user ID:", supabaseUser.id, "and organization ID:", profileData.organization_id)
      const { data: roleData, error: roleError } = await supabaseClient
        .from("user_roles")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .eq("organization_id", profileData.organization_id)
        .single()

      if (roleError) {
        console.error("AuthContext: Supabase role error:", roleError.message);
        setRole(null); setIsDemo(false);
        return;
      }

      if (!roleData) {
        console.log("AuthContext: No user role found for user ID:", supabaseUser.id);
        setRole(null); setIsDemo(false);
        return;
      }

      console.log("AuthContext: User role found:", roleData.role)
      setRole(roleData); // Set role immediately

      setIsDemo(false)
      console.log("AuthContext: All Supabase user data loaded successfully.")
    } catch (error) {
      console.error("AuthContext: General error during refreshProfile (Supabase flow):", error)
      // Ensure state is cleared on general error
      setUser(null); setProfile(null); setOrganization(null); setRole(null); setIsDemo(false);
    } finally {
      setLoading(false)
      console.log("AuthContext: refreshProfile completed. Loading:", false);
    }
  }

  useEffect(() => {
    let subscription: any = null;

    const getInitialSession = async () => {
      await refreshProfile();
    };

    getInitialSession();

    // Listen for auth changes
    try {
      const {
        data: { subscription: authSubscription },
      } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
        console.log("AuthContext: Auth state changed:", event);
        // Only trigger refreshProfile if it's not a demo session
        if (!isDemo) {
          await refreshProfile();
        } else {
          // If it's a demo session and auth state changes (e.g., user signs out), clear demo
          if (event === 'SIGNED_OUT') {
            localStorage.removeItem("demo_session");
            setIsDemo(false);
            await refreshProfile(); // Re-evaluate auth state
          }
        }
      });

      subscription = authSubscription;
    } catch (error) {
      console.error("AuthContext: Error setting up auth listener:", error);
      setLoading(false); // Ensure loading is false even if listener setup fails
    }

    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error("AuthContext: Error unsubscribing from auth changes:", error);
        }
      }
    };
  }, [isDemo]); // Depend on isDemo to re-run effect if demo state changes

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signIn...");
    // Clear demo session before attempting a real login
    localStorage.removeItem("demo_session")
    setIsDemo(false)

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      console.error("AuthContext: signIn error:", error.message);
    } else {
      console.log("AuthContext: signIn successful. Triggering refreshProfile...");
      await refreshProfile(); // Refresh profile after successful login
    }
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signUp...");
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })
    if (error) {
      console.error("AuthContext: signUp error:", error.message);
    } else {
      console.log("AuthContext: signUp successful. Triggering refreshProfile...");
      await refreshProfile(); // Refresh profile after successful signup
    }
    return { error }
  }

  const signOut = async () => {
    console.log("AuthContext: Attempting signOut...");
    // Clear demo session
    localStorage.removeItem("demo_session")
    setIsDemo(false)

    // Sign out from Supabase
    const { error } = await supabaseClient.auth.signOut()
    if (error) {
      console.error("AuthContext: signOut error:", error.message);
    } else {
      console.log("AuthContext: signOut successful.");
    }

    // Reset state
    setUser(null)
    setProfile(null)
    setOrganization(null)
    setRole(null)

    // Explicitly redirect to login page
    router.push("/auth/login")
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