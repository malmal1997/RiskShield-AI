"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  User,
  Building,
  Bell,
  Lock,
  CreditCard,
  Users,
  Key,
  Zap,
  AlertTriangle,
  Save,
  Upload,
  Trash2,
  Plus,
  ArrowLeft, // Added ArrowLeft for back button
  Loader2, // For loading states
  X, // For closing dialogs
  Edit, // For editing integrations
  CheckCircle, // For Admin Approval card
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { updateUserProfile } from "@/lib/auth-service"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { getIntegrations, createIntegration, updateIntegration, deleteIntegration } from "@/lib/integration-service"; // Import integration services
import type { Integration } from "@/lib/supabase"; // Import Integration type
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select for integration status

// Define the super admin email. This user will be the only one to see the Admin Approval card.
const SUPER_ADMIN_EMAIL = "new.admin@riskguard.ai"; // Or "demo@riskguard.ai" if you prefer the demo user to be the sole approver.

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}

function SettingsContent() {
  const { user, profile, organization, role, refreshProfile, isDemo, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    timezone: profile?.timezone || "UTC",
    language: profile?.language || "en",
  })

  // Organization form state
  const [orgForm, setOrgForm] = useState({
    name: organization?.name || "",
    domain: organization?.domain || "",
    settings: organization?.settings || {},
  })

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    email_assessments: true,
    email_reports: true,
    email_alerts: true,
    push_notifications: true,
    sms_alerts: false,
  })

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    session_timeout: 30,
    password_expiry: 90,
  })

  // Integrations state
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showIntegrationDialog, setShowIntegrationDialog] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [integrationForm, setIntegrationForm] = useState({
    integration_name: "",
    settings: "{}", // JSON string
    status: "inactive" as Integration['status'],
  });
  const [isSavingIntegration, setIsSavingIntegration] = useState(false);
  const [isDeletingIntegration, setIsDeletingIntegration] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        timezone: profile.timezone || "UTC",
        language: profile.language || "en",
      })
    }
    if (organization) {
      setOrgForm({
        name: organization.name || "",
        domain: organization.domain || "",
        settings: organization.settings || {},
      })
    }
  }, [profile, organization])

  const loadIntegrations = async () => {
    if (isDemo) {
      // Mock data for demo mode
      setIntegrations([
        { id: "mock-slack", organization_id: "demo-org", integration_name: "Slack", settings: {}, status: "active", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: "mock-jira", organization_id: "demo-org", integration_name: "Jira", settings: {}, status: "inactive", created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      ]);
      return;
    }
    setLoading(true);
    try {
      const { data, error: fetchError } = await getIntegrations();
      if (fetchError) {
        throw new Error(fetchError);
      }
      setIntegrations(data || []);
    } catch (err: any) {
      console.error("Error fetching integrations:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to load integrations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "integrations" && !loading) {
      loadIntegrations();
    }
  }, [activeTab, loading, isDemo]);

  const handleProfileUpdate = async () => {
    try {
      setLoading(true)
      await updateUserProfile(profileForm)
      await refreshProfile()
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleIntegrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Integration management is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingIntegration(true);
    try {
      const parsedSettings = JSON.parse(integrationForm.settings); // Validate JSON
      const dataToSave = { ...integrationForm, settings: parsedSettings };

      let result;
      if (editingIntegration) {
        result = await updateIntegration(editingIntegration.id, dataToSave);
      } else {
        result = await createIntegration(dataToSave);
      }

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success!",
        description: `Integration "${integrationForm.integration_name}" has been ${editingIntegration ? "updated" : "created"}.`,
      });
      setShowIntegrationDialog(false);
      setEditingIntegration(null);
      setIntegrationForm({ integration_name: "", settings: "{}", status: "inactive" });
      await loadIntegrations();
    } catch (err: any) {
      console.error("Error saving integration:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to save integration. Ensure settings is valid JSON.",
        variant: "destructive",
      });
    } finally {
      setIsSavingIntegration(false);
    }
  };

  const handleEditIntegration = (integration: Integration) => {
    setEditingIntegration(integration);
    setIntegrationForm({
      integration_name: integration.integration_name,
      settings: JSON.stringify(integration.settings, null, 2),
      status: integration.status,
    });
    setShowIntegrationDialog(true);
  };

  const handleDeleteIntegration = async (integrationId: string) => {
    if (isDemo) {
      toast({
        title: "Preview Mode",
        description: "Integration deletion is not available in preview mode. Please sign up for full access.",
        variant: "destructive",
      });
      return;
    }
    if (!confirm("Are you sure you want to delete this integration?")) {
      return;
    }

    setIsDeletingIntegration(integrationId);
    try {
      const { success, error: deleteError } = await deleteIntegration(integrationId);
      if (deleteError) {
        throw new Error(deleteError);
      }
      if (success) {
        toast({
          title: "Success!",
          description: "Integration deleted successfully.",
        });
        await loadIntegrations();
      }
    } catch (err: any) {
      console.error("Error deleting integration:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete integration.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingIntegration(null);
    }
  };

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Australia/Sydney",
  ]

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
  ]

  const isOrgAdmin = role?.role === "admin";
  const isSuperAdmin = isOrgAdmin && user?.email === SUPER_ADMIN_EMAIL;

  // If not an admin and not in demo mode, deny access to the entire page
  if (!authLoading && !isOrgAdmin && !isDemo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the settings page.</p>
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
        {/* Page Header - Integrated header content here */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="mt-2 text-gray-600">Manage your account, organization, and application preferences.</p>
          </div>
          <nav className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </a>
            </Button>
          </nav>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>Update your personal details and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {profileForm.first_name?.[0]}
                      {profileForm.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileForm.first_name}
                      onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileForm.last_name}
                      onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="bg-gray-50" />
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm({ ...profileForm, timezone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {timezones.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={profileForm.language}
                      onChange={(e) => setProfileForm({ ...profileForm, language: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organization Settings */}
          <TabsContent value="organization" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Organization Details</span>
                </CardTitle>
                <CardDescription>Manage your organization settings and branding.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="org_name">Organization Name</Label>
                  <Input
                    id="org_name"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                    placeholder="Enter organization name"
                  />
                </div>

                <div>
                  <Label htmlFor="org_domain">Domain</Label>
                  <Input
                    id="org_domain"
                    value={orgForm.domain}
                    onChange={(e) => setOrgForm({ ...orgForm, domain: e.target.value })}
                    placeholder="company.com"
                  />
                </div>

                <div>
                  <Label>Subscription Plan</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      {organization?.subscription_plan?.toUpperCase() || "FREE"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Upgrade Plan
                    </Button>
                  </div>
                </div>

                {organization?.trial_ends_at && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">Trial Period</span>
                    </div>
                    <p className="text-yellow-700 mt-1">
                      Your trial expires on {new Date(organization.trial_ends_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Management */}
            {isOrgAdmin && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Team Management</span>
                    </CardTitle>
                    <CardDescription>Manage team members and their roles.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-600">Manage who has access to your organization.</p>
                      <Link href="/settings/team-management">
                        <Button size="sm">
                          <Users className="mr-2 h-4 w-4" />
                          Manage Team
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Approval Card - Only visible to the designated super admin */}
                {(isSuperAdmin || isDemo) && ( // Keep isDemo for preview mode functionality
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>Admin Approval</span>
                      </CardTitle>
                      <CardDescription>Review and approve new institution registrations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-600">Access pending registrations for approval.</p>
                        <Link href="/admin-approval">
                          <Button size="sm">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Review Registrations
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>Choose how you want to be notified about important events.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive email notifications for assessments</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.email_assessments}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({ ...notificationPrefs, email_assessments: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Report Notifications</Label>
                      <p className="text-sm text-gray-600">Get notified when reports are generated</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.email_reports}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({ ...notificationPrefs, email_reports: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Security Alerts</Label>
                      <p className="text-sm text-gray-600">Important security and risk alerts</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.email_alerts}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({ ...notificationPrefs, email_alerts: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-600">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.push_notifications}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs({ ...notificationPrefs, push_notifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-gray-600">Critical alerts via SMS</p>
                    </div>
                    <Switch
                      checked={notificationPrefs.sms_alerts}
                      onCheckedChange={(checked) => setNotificationPrefs({ ...notificationPrefs, sms_alerts: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Manage your account security and authentication.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline" size="sm">
                      {securitySettings.two_factor_enabled ? "Disable" : "Enable"}
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label>Change Password</Label>
                    <p className="text-sm text-gray-600 mb-3">Update your password to keep your account secure</p>
                    <Button variant="outline" size="sm">
                      <Key className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-gray-600 mb-3">Automatically sign out after period of inactivity</p>
                    <select
                      value={securitySettings.session_timeout}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          session_timeout: Number.parseInt(e.target.value),
                        })
                      }
                      className="w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={240}>4 hours</option>
                      <option value={480}>8 hours</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Access</CardTitle>
                <CardDescription>Manage API keys for integrations and third-party access.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Create and manage API keys for programmatic access.</p>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Generate API Key
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Billing & Subscription</span>
                </CardTitle>
                <CardDescription>Manage your subscription and billing information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Free</CardTitle>
                      <CardDescription>Perfect for getting started</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">$0</div>
                      <p className="text-sm text-gray-600">per month</p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li>• Up to 5 assessments</li>
                        <li>• Basic reporting</li>
                        <li>• Email support</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Professional</CardTitle>
                      <CardDescription>For growing teams</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">$49</div>
                      <p className="text-sm text-gray-600">per month</p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li>• Unlimited assessments</li>
                        <li>• Advanced analytics</li>
                        <li>• Priority support</li>
                        <li>• API access</li>
                      </ul>
                      <Button className="w-full mt-4">Upgrade</Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-lg">Enterprise</CardTitle>
                      <CardDescription>For large organizations</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">$199</div>
                      <p className="text-sm text-gray-600">per month</p>
                      <ul className="mt-4 space-y-2 text-sm">
                        <li>• Everything in Pro</li>
                        <li>• Custom integrations</li>
                        <li>• Dedicated support</li>
                        <li>• SSO & SAML</li>
                      </ul>
                      <Button className="w-full mt-4">Contact Sales</Button>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Integrations</span>
                </CardTitle>
                <CardDescription>Connect RiskGuard AI with your existing tools and workflows.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Button onClick={() => {
                    setEditingIntegration(null);
                    setIntegrationForm({ integration_name: "", settings: "{}", status: "inactive" });
                    setShowIntegrationDialog(true);
                  }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Integration
                  </Button>
                </div>

                {integrations.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-500">
                    <Zap className="h-10 w-10 mx-auto mb-3" />
                    <p>No integrations configured yet. Click "Add Integration" to get started.</p>
                  </div>
                )}

                {loading && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading integrations...</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations.map((integration) => (
                    <Card key={integration.id} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">
                              {integration.integration_name === "Slack" && "💬"}
                              {integration.integration_name === "Jira" && "📋"}
                              {integration.integration_name === "Microsoft Teams" && "👥"}
                              {integration.integration_name === "ServiceNow" && "🔧"}
                              {integration.integration_name === "Salesforce" && "☁️"}
                              {integration.integration_name === "Webhook" && "🔗"}
                              {!["Slack", "Jira", "Microsoft Teams", "ServiceNow", "Salesforce", "Webhook"].includes(integration.integration_name) && "🔌"}
                            </span>
                            <div>
                              <h3 className="font-medium">{integration.integration_name}</h3>
                              <p className="text-sm text-gray-600">
                                Status:{" "}
                                <Badge variant="outline" className={integration.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {integration.status}
                                </Badge>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditIntegration(integration)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleDeleteIntegration(integration.id)}
                            disabled={isDeletingIntegration === integration.id}
                          >
                            {isDeletingIntegration === integration.id ? (
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Integration Dialog */}
      <Dialog open={showIntegrationDialog} onOpenChange={setShowIntegrationDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingIntegration ? "Edit Integration" : "Add New Integration"}</DialogTitle>
            <DialogDescription>
              {editingIntegration ? "Update the details for this integration." : "Configure a new third-party integration."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleIntegrationSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="integration_name">Integration Name *</Label>
              <Input
                id="integration_name"
                value={integrationForm.integration_name}
                onChange={(e) => setIntegrationForm({ ...integrationForm, integration_name: e.target.value })}
                placeholder="e.g., Slack, Jira, Custom Webhook"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="settings">Settings (JSON) *</Label>
              <Textarea
                id="settings"
                value={integrationForm.settings}
                onChange={(e) => setIntegrationForm({ ...integrationForm, settings: e.target.value })}
                rows={8}
                placeholder='{"api_key": "your_key", "channel": "#alerts"}'
                required
              />
              <p className="text-xs text-gray-500">
                Sensitive information like API keys should be stored securely (e.g., encrypted in Supabase).
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={integrationForm.status}
                onValueChange={(value: Integration['status']) => setIntegrationForm({ ...integrationForm, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSavingIntegration}>
                {isSavingIntegration ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingIntegration ? "Save Changes" : "Add Integration"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}