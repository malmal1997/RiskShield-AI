"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Building,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  Users, // Added Users import
} from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { useAuth } from "@/components/auth-context";
import {
  getOrganizationMembers,
  updateMemberRole,
  updateMemberStatus,
  OrganizationMember,
  UserProfile, // Added UserProfile import
} from "@/lib/auth-service";
import { inviteUserToOrganization, deleteUserFromOrganization } from "./actions";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

export default function TeamManagementPage() {
  return (
    <AuthGuard>
      <TeamManagementContent />
    </AuthGuard>
  );
}

function TeamManagementContent() {
  const { user, profile, role, loading: authLoading, isDemo } = useAuth();
  const { toast } = useToast();

  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null); // Stores user_id of member being updated/deleted
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "viewer" as OrganizationMember['role_name'],
  });

  const isAdmin = role?.role === "admin" || isDemo; // Demo users are considered admin for this page

  const loadMembers = async () => {
    if (!isAdmin) {
      setError("You do not have administrative privileges to view this page.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getOrganizationMembers();
      if (fetchError) {
        throw new Error(fetchError);
      }
      setMembers(data || []);
    } catch (err: any) {
      console.error("Error fetching organization members:", err);
      setError(err.message || "Failed to fetch organization members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadMembers();
    }
  }, [authLoading, isAdmin]);

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "User invitation is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }

    setIsInviting(true);
    try {
      const { success, error: inviteError } = await inviteUserToOrganization(
        inviteForm.email,
        inviteForm.firstName,
        inviteForm.lastName,
        inviteForm.role
      );

      if (inviteError) {
        throw new Error(inviteError);
      }

      if (success) {
        toast({
          title: "Invitation Sent!",
          description: `An invitation has been sent to ${inviteForm.email}.`,
        });
        setShowInviteDialog(false);
        setInviteForm({ firstName: "", lastName: "", email: "", role: "viewer" });
        await loadMembers(); // Refresh the list
      }
    } catch (err: any) {
      console.error("Error inviting user:", err);
      toast({
        title: "Invitation Failed",
        description: err.message || "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = async (memberUserId: string, newRole: OrganizationMember['role_name']) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Role changes are not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    setIsUpdating(memberUserId);
    try {
      const { success, error: updateError } = await updateMemberRole(memberUserId, newRole);
      if (updateError) {
        throw new Error(updateError);
      }
      if (success) {
        toast({
          title: "Role Updated!",
          description: "User role has been updated successfully.",
        });
        await loadMembers();
      }
    } catch (err: any) {
      console.error("Error updating role:", err);
      toast({
        title: "Role Update Failed",
        description: err.message || "Failed to update role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleStatusChange = async (memberUserId: string, newStatus: UserProfile['status']) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Status changes are not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    setIsUpdating(memberUserId);
    try {
      const { success, error: updateError } = await updateMemberStatus(memberUserId, newStatus);
      if (updateError) {
        throw new Error(updateError);
      }
      if (success) {
        toast({
          title: "Status Updated!",
          description: "User status has been updated successfully.",
        });
        await loadMembers();
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      toast({
        title: "Status Update Failed",
        description: err.message || "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteMember = async (memberUserId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "User deletion is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setIsUpdating(memberUserId);
    try {
      const { success, error: deleteError } = await deleteUserFromOrganization(memberUserId);
      if (deleteError) {
        throw new Error(deleteError);
      }
      if (success) {
        toast({
          title: "User Deleted!",
          description: "User has been successfully removed from the organization.",
        });
        await loadMembers();
      }
    } catch (err: any) {
      console.error("Error deleting user:", err);
      toast({
        title: "Deletion Failed",
        description: err.message || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/settings">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Settings
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="mt-2 text-gray-600">Manage users and roles within your organization.</p>
            </div>
          </div>
          <Button onClick={() => setShowInviteDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Invite Member
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

        {members.length === 0 && !loading && !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">No Team Members Yet</h2>
              <p className="text-gray-600">Invite your first team member to get started.</p>
              <Button onClick={() => setShowInviteDialog(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Invite Member
              </Button>
            </CardContent>
          </Card>
        )}

        {members.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {members.map((member) => (
              <Card key={member.user_id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.first_name?.[0]}
                          {member.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">
                          {member.first_name} {member.last_name}
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{member.email}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={
                        member.profile_status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {member.profile_status === "active" ? <CheckCircle className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                      {member.profile_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`role-${member.user_id}`}>Role</Label>
                      <Select
                        value={member.role_name}
                        onValueChange={(value: OrganizationMember['role_name']) =>
                          handleRoleChange(member.user_id, value)
                        }
                        disabled={isUpdating === member.user_id || member.user_id === user?.id}
                      >
                        <SelectTrigger id={`role-${member.user_id}`}>
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
                    <div>
                      <Label htmlFor={`status-${member.user_id}`}>Status</Label>
                      <Select
                        value={member.profile_status}
                        onValueChange={(value: UserProfile['status']) =>
                          handleStatusChange(member.user_id, value)
                        }
                        disabled={isUpdating === member.user_id || member.user_id === user?.id}
                      >
                        <SelectTrigger id={`status-${member.user_id}`}>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteMember(member.user_id)}
                      disabled={isUpdating === member.user_id || member.user_id === user?.id}
                    >
                      {isUpdating === member.user_id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 h-4 w-4" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite New Member</DialogTitle>
            <DialogDescription>
              Enter the details of the user you want to invite to your organization.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleInviteSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={inviteForm.firstName}
                onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={inviteForm.lastName}
                onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={inviteForm.role}
                onValueChange={(value: OrganizationMember['role_name']) =>
                  setInviteForm({ ...inviteForm, role: value })
                }
              >
                <SelectTrigger id="role" className="col-span-3">
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
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isInviting}>
                {isInviting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inviting...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Invite
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
