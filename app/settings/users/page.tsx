"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, User, Mail, Building, RefreshCw, AlertTriangle, X } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { supabaseClient } from "@/lib/supabase-client"

interface OrganizationUser {
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  avatar_url?: string
  created_at: string
}

export default function UserManagementPage() {
  return (
    <AuthGuard>
      <UserManagementContent />
    </AuthGuard>
  )
}

function UserManagementContent() {
  const { user, profile, organization, role, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<OrganizationUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showInviteUserModal, setShowInviteUserModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "analyst", // Default role for new users
  })
  const [isInviting, setIsInviting] = useState(false)

  const isOrgAdmin = role?.role === "admin" || role?.permissions?.all === true

  const fetchOrganizationUsers = async () => {
    if (!organization?.id) return

    setLoading(true)
    try {
      const { data: userProfiles, error: profileError } = await supabaseClient
        .from("user_profiles")
        .select(`
          user_id,
          email,
          first_name,
          last_name,
          avatar_url,
          created_at,
          user_roles ( role )
        `)
        .eq("organization_id", organization.id)

      if (profileError) throw profileError

      const formattedUsers: OrganizationUser[] = userProfiles.map((p: any) => ({
        user_id: p.user_id,
        email: p.email,
        first_name: p.first_name,
        last_name: p.last_name,
        avatar_url: p.avatar_url,
        created_at: p.created_at,
        role: p.user_roles?.[0]?.role || "viewer", // Assuming one role per user per org
      }))
      setUsers(formattedUsers)
    } catch (error) {
      console.error("Error fetching organization users:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load organization users.",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (organization?.id && !authLoading) {
      fetchOrganizationUsers()
    }
  }, [organization?.id, authLoading])

  const handleInviteUser = async () => {
    if (!inviteForm.email || !inviteForm.role) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide an email and select a role.",
      })
      return
    }
    if (!organization?.id || !user?.id) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Organization or user ID not found. Please sign in again.",
      })
      return
    }

    setIsInviting(true)
    try {
      const response = await fetch("/api/user-management/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: inviteForm.email,
          role: inviteForm.role,
          organizationId: organization.id,
          inviterUserId: user.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to send invitation.")
      }

      toast({
        title: "Invitation Sent",
        description: result.message,
      })
      setInviteForm({ email: "", role: "analyst" })
      setShowInviteUserModal(false)
      fetchOrganizationUsers() // Refresh user list
    } catch (error) {
      console.error("Error inviting user:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send invitation.",
      })
    } finally {
      setIsInviting(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading user management...</p>
        </div>
      </div>
    )
  }

  if (!isOrgAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have administrative permissions to access this page.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">RiskGuard AI</span>
                  {organization && <p className="text-sm text-gray-600">{organization.name}</p>}
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                ← Back to Settings
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="mt-2 text-gray-600">Manage users within your organization.</p>
            </div>
            <Button onClick={() => setShowInviteUserModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Users ({users.length})</CardTitle>
            <CardDescription>All active users in your organization.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No users found in your organization.</div>
              ) : (
                users.map((orgUser) => (
                  <div key={orgUser.user_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={orgUser.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {orgUser.first_name?.[0] || orgUser.email?.[0]}
                          {orgUser.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {orgUser.first_name} {orgUser.last_name} {orgUser.first_name || orgUser.last_name ? "" : orgUser.email}
                        </p>
                        <p className="text-sm text-gray-600">{orgUser.email}</p>
                      </div>
                    </div>
                    <Badge>{orgUser.role}</Badge>
                    {/* Add actions like 'Edit Role', 'Remove User' here */}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite User Modal */}
      {showInviteUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invite New User</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowInviteUserModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>Send an invitation email to a new team member.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="user@yourcompany.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="invite-role">Role</Label>
                <Select
                  value={inviteForm.role}
                  onValueChange={(value) => setInviteForm({ ...inviteForm, role: value })}
                >
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleInviteUser} disabled={isInviting} className="w-full">
                {isInviting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Invitation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
