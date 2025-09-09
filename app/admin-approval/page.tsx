"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  RefreshCw,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  Shield,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { PendingRegistration } from "@/lib/auth-service"
import { supabaseClient } from "@/lib/supabase-client"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { approveRegistration } from "./actions" // Import from the new server action file

export default function AdminApprovalPage() {
  return (
    <AuthGuard>
      <AdminApprovalContent />
    </AuthGuard>
  )
}

function AdminApprovalContent() {
  const { user, profile, role, loading: authLoading } = useAuth()
  const [pendingRegistrations, setPendingRegistrations] = useState<PendingRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isApproving, setIsApproving] = useState<string | null>(null) // Stores ID of registration being approved
  const { toast } = useToast()

  const isAdmin = role?.role === "admin"

  const fetchPendingRegistrations = async () => {
    if (!isAdmin) {
      setError("You do not have administrative privileges to view this page.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabaseClient
        .from("pending_registrations")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: true })

      if (error) throw error
      setPendingRegistrations(data || [])
    } catch (err: any) {
      console.error("Error fetching pending registrations:", err)
      setError(err.message || "Failed to fetch pending registrations.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      fetchPendingRegistrations()
    }
  }, [authLoading, isAdmin])

  const handleApprove = async (registrationId: string) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Admin user ID not found. Please sign in again.",
      })
      return
    }

    setIsApproving(registrationId)
    try {
      const { success, error: approveError } = await approveRegistration(registrationId, user.id)

      if (approveError) {
        throw new Error(approveError)
      }

      if (success) {
        toast({
          title: "Registration Approved!",
          description: "The institution has been approved and can now log in.",
        })
        await fetchPendingRegistrations() // Refresh the list
      } else {
        toast({
          variant: "destructive",
          title: "Approval Failed",
          description: "An unknown error occurred during approval.",
        })
      }
    } catch (err: any) {
      console.error("Error approving registration:", err)
      toast({
        variant: "destructive",
        title: "Approval Failed",
        description: err.message || "Failed to approve registration. Please try again.",
      })
    } finally {
      setIsApproving(null)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading pending registrations...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">RiskGuard AI</span>
              </Link>
              <span className="text-gray-400">→</span>
              <span className="text-gray-600">Admin Approval</span>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/dashboard">← Back to Dashboard</a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pending Registrations</h1>
            <p className="mt-2 text-gray-600">Review and approve new institution registrations.</p>
          </div>
          <Button onClick={fetchPendingRegistrations} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh List
          </Button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center space-x-3 text-red-800">
              <AlertTriangle className="h-5 w-5" />
              <p className="font-medium">{error}</p>
            </CardContent>
          </Card>
        )}

        {pendingRegistrations.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Pending Registrations</h2>
              <p className="text-gray-600">All new registrations have been reviewed and processed.</p>
            </CardContent>
          </Card>
        )}

        {pendingRegistrations.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {pendingRegistrations.map((reg) => (
              <Card key={reg.id} className="border-l-4 border-l-yellow-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5 text-yellow-600" />
                      <span>{reg.institution_name}</span>
                    </CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                  <CardDescription>
                    Registered on {new Date(reg.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium">{reg.contact_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Institution Type</p>
                      <p className="font-medium">{reg.institution_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {reg.email}
                      </p>
                    </div>
                    {reg.phone && (
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {reg.phone}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      disabled={isApproving === reg.id}
                      onClick={() => {
                        // Implement reject logic here if needed
                        toast({
                          title: "Reject Action",
                          description: "Rejection functionality not yet implemented.",
                        })
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(reg.id)}
                      disabled={isApproving === reg.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isApproving === reg.id ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}