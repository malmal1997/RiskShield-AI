"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { supabaseClient } from "@/lib/supabase-client"
import type { User, Session } from "@supabase/supabase-js" // Import Session type
import { useRouter } from "next/navigation"

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
  role: { role: string; permissions: { all: true } }
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
  refreshProfile: (session?: Session | null) => Promise<void> // Allow session to be passed
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
  const router = useRouter()

  const refreshProfile = async (sessionFromEvent?: Session | null) => {
    setLoading(true);
    console.log("AuthContext: Starting refreshProfile...");

    // Clear previous state before attempting to load new state
    setUser(null);
    setProfile(null);
    setOrganization(null);
    setRole(null);
    setIsDemo(false);

    // 1. Check for demo session first
    const demoSession = localStorage.getItem("demo_session")
    if (demoSession) {
      try {
        const session: DemoSession = JSON.parse(demoSession)
        setUser(session.user)
        setOrganization(session.organization)
        setRole(session.role)
        setProfile(session.profile)
        setIsDemo(true)
        console.log("AuthContext: Demo session loaded successfully. User:", session.user.email);
        setLoading(false);
        return;
      } catch (error) {
        console.error("AuthContext: Error parsing demo session:", error)
        localStorage.removeItem("demo_session")
        // Continue to Supabase auth if demo session fails
      }
    }

    // 2. Attempt to get Supabase session
    let supabaseUser: User | null = null;
    let currentSession: Session | null = null;

    if (sessionFromEvent) {
      currentSession = sessionFromEvent;
      supabaseUser = sessionFromEvent.user;
      console.log("AuthContext: Using session from auth event.");
    } else {
      console.log("AuthContext: Attempting to fetch Supabase session...");
      try {
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
        if (sessionError) {
          console.error("AuthContext: Supabase getSession error:", sessionError.message);
          setLoading(false);
          return;
        }
        currentSession = session;
        supabaseUser = session?.user || null;
        if (supabaseUser) {
          console.log("AuthContext: Supabase session found. User:", supabaseUser.email, "ID:", supabaseUser.id);
        } else {
          console.log("AuthContext: No active Supabase session found.");
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("AuthContext: Error calling getSession:", error);
        setLoading(false);
        return;
      }
    }

    if (!supabaseUser) {
      console.log("AuthContext: No authenticated Supabase user after session check.");
      setLoading(false);
      return;
    }

    // 3. Fetch user profile
    console.log("AuthContext: Fetching user profile for user ID:", supabaseUser.id);
    try {
      const { data: profileData, error: profileError } = await supabaseClient
        .from("user_profiles")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .single();

      if (profileError) {
        console.error("AuthContext: Supabase profile error:", profileError.message);
        setLoading(false);
        return;
      }
      if (!profileData) {
        console.log("AuthContext: No user profile found for user ID:", supabaseUser.id);
        setLoading(false);
        return;
      }
      console.log("AuthContext: User profile found:", profileData);
      setProfile(profileData);

      // 4. Fetch organization
      console.log("AuthContext: Fetching organization for ID:", profileData.organization_id);
      const { data: organizationData, error: orgError } = await supabaseClient
        .from("organizations")
        .select("*")
        .eq("id", profileData.organization_id)
        .single();

      if (orgError) {
        console.error("AuthContext: Supabase organization error:", orgError.message);
        setLoading(false);
        return;
      }
      if (!organizationData) {
        console.log("AuthContext: No organization found for ID:", profileData.organization_id);
        setLoading(false);
        return;
      }
      console.log("AuthContext: Organization found:", organizationData.name);
      setOrganization(organizationData);

      // 5. Fetch user role
      console.log("AuthContext: Fetching user role for user ID:", supabaseUser.id, "and organization ID:", profileData.organization_id);
      const { data: roleData, error: roleError } = await supabaseClient
        .from("user_roles")
        .select("*")
        .eq("user_id", supabaseUser.id)
        .eq("organization_id", profileData.organization_id)
        .single();

      if (roleError) {
        console.error("AuthContext: Supabase role error:", roleError.message);
        setLoading(false);
        return;
      }
      if (!roleData) {
        console.log("AuthContext: No user role found for user ID:", supabaseUser.id);
        setLoading(false);
        return;
      }
      console.log("AuthContext: User role found:", roleData.role);
      setRole(roleData);

      // All data successfully loaded
      setUser(supabaseUser);
      setIsDemo(false);
      console.log("AuthContext: All Supabase user data loaded successfully.");
    } catch (error) {
      console.error("AuthContext: General error during Supabase data fetching:", error);
      // Ensure state is cleared on general error
      setUser(null); setProfile(null); setOrganization(null); setRole(null); setIsDemo(false);
    } finally {
      setLoading(false);
      console.log("AuthContext: refreshProfile completed. Loading:", false);
    }
  };

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

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
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem("demo_session"); // Clear demo session on sign out
          await refreshProfile(null); // Explicitly pass null session
        } else if (session) {
          await refreshProfile(session); // Pass the session from the event
        } else {
          await refreshProfile(null); // Fallback if session is unexpectedly null
        }
      });

      subscription = authSubscription;
    } catch (error) {
      console.error("AuthContext: Error setting up auth listener:", error);
      setLoading(false);
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
  }, []); // Empty dependency array to run once on mount

  const signIn = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signIn...");
    localStorage.removeItem("demo_session");
    setIsDemo(false);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("AuthContext: signIn error:", error.message);
    } else {
      console.log("AuthContext: signIn successful. Auth state change listener will handle refresh.");
      // No explicit refreshProfile call here, as onAuthStateChange will trigger it
    }
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    console.log("AuthContext: Attempting signUp...");
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("AuthContext: signUp error:", error.message);
    } else {
      console.log("AuthContext: signUp successful. Auth state change listener will handle refresh.");
    }
    return { error };
  };

  const signOut = async () => {
    console.log("AuthContext: Attempting signOut...");
    localStorage.removeItem("demo_session");
    setIsDemo(false);

    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("AuthContext: signOut error:", error.message);
    } else {
      console.log("AuthContext: signOut successful. Auth state change listener will handle state reset and redirect.");
    }
    // The onAuthStateChange listener will handle state reset and redirect
  };

  const hasPermission = (permission: string): boolean => {
    if (!role) return false;
    if (role.role === "admin" || isDemo) return true;
    return role.permissions && (role.permissions[permission] === true || role.permissions.all === true);
  };

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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}