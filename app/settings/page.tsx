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
  EyeOff,
  Eye,
  ExternalLink, // Added ExternalLink icon
  Bot, // Added Bot icon
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import { updateUserProfile } from "@/lib/auth-service"
import { useToast } from "@/components/ui/use-toast"
import { createUserApiKey, getUserApiKeys, deleteUserApiKey, type EncryptedApiKey } from "@/lib/user-api-key-service"
import Link from "next/link" // Import Link

export default function SettingsPage() {
  return (
    <AuthGuard>
      <SettingsContent />
    </AuthGuard>
  )
}

function SettingsContent() {
  const { user, profile, organization, role, refreshProfile } = useAuth()
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

  // API Keys state
  const [apiKeys, setApiKeys] = useState<EncryptedApiKey[]>([])
  const [newApiKeyName, setNewApiKeyName] = useState("")
  const [newApiKeyValue, setNewApiKeyValue] = useState("")
  const [showApiKeyValue, setShowApiKeyValue] = useState(false)
  const [isAddingApiKey, setIsAddingApiKey] = useState(false)

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

  // Load API keys when component mounts or tab changes
  useEffect(() => {
    if (activeTab === "integrations" && user) {
      fetchApiKeys();
    }
  }, [activeTab, user]);

  const fetchApiKeys = async () => {
    setLoading(true);
    const { data, error } = await getUserApiKeys();
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    } else {
      setApiKeys(data || []);
    }
    setLoading(false);
  };

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

  const handleAddApiKey = async () => {
    if (!newApiKeyName || !newApiKeyValue) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both an API key name and the key value.",
      });
      return;
    }

    setIsAddingApiKey(true);
    const { success, message } = await createUserApiKey(newApiKeyName, newApiKeyValue);
    if (success) {
      toast({
        title: "Success",
        description: message,
      });
      setNewApiKeyName("");
      setNewApiKeyValue("");
      fetchApiKeys(); // Refresh the list of keys
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
    setIsAddingApiKey(false);
  };

  const handleDeleteApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key?")) {
      return;
    }

    setLoading(true);
    const { success, message } = await deleteUserApiKey(keyId);
    if (success) {
      toast({
        title: "Success",
        description: message,
      });
      fetchApiKeys(); // Refresh the list
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    }
    setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <span className="text-xl font-bold text-gray-900">RiskGuard AI</span>
                  {organization && <p className="text-sm text-gray-600">{organization.name}</p>}
                </div>
              </div>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Manage your account, organization, and application preferences.</p>
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
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
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
                  <Link href="/settings/users"> {/* Link to the new user management page */}
                    <Button size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Manage Users
                    </Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>
                          {profile?.first_name?.[0]}
                          {profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <Badge>{role?.role}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: "Slack", description: "Get notifications in Slack", icon: "💬", connected: false },
                    {
                      name: "Microsoft Teams",
                      description: "Collaborate with your team",
                      icon: "👥",
                      connected: false,
                    },
                    { name: "ServiceNow", description: "Sync with ITSM workflows", icon: "🔧", connected: false },
                    { name: "Jira", description: "Create tickets for remediation", icon: "📋", connected: true },
                    { name: "Salesforce", description: "Sync vendor information", icon: "☁️", connected: false },
                    { name: "Webhook", description: "Custom webhook integrations", icon: "🔗", connected: false },
                  ].map((integration) => (
                    <Card key={integration.name} className="border">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{integration.icon}</span>
                            <div>
                              <h3 className="font-medium">{integration.name}</h3>
                              <p className="text-sm text-gray-600">{integration.description}</p>
                            </div>
                          </div>
                        </div>
                        <Button variant={integration.connected ? "outline" : "default"} size="sm" className="w-full">
                          {integration.connected ? "Disconnect" : "Connect"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* User API Keys Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-5 w-5" />
                  <span>Your API Keys</span>
                </CardTitle>
                <CardDescription>
                  Manage your personal API keys for third-party AI services (e.g., Google Gemini, Groq).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiKeyName">API Key Name</Label>
                    <Input
                      id="apiKeyName"
                      value={newApiKeyName}
                      onChange={(e) => setNewApiKeyName(e.target.value)}
                      placeholder="e.g., My Google Gemini Key"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apiKeyValue">API Key Value</Label>
                    <div className="relative">
                      <Input
                        id="apiKeyValue"
                        type={showApiKeyValue ? "text" : "password"}
                        value={newApiKeyValue}
                        onChange={(e) => setNewApiKeyValue(e.target.value)}
                        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowApiKeyValue(!showApiKeyValue)}
                      >
                        {showApiKeyValue ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Your API keys are encrypted and stored securely. They are never exposed to the client-side.
                    </p>
                  </div>
                  <Button onClick={handleAddApiKey} disabled={isAddingApiKey || !newApiKeyName || !newApiKeyValue}>
                    {isAddingApiKey ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding Key...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add API Key
                      </>
                    )}
                  </Button>
                </div>

                <Separator />

                <h3 className="text-lg font-medium mb-4">Get Free API Keys</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 border border-blue-200 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Bot className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-800">Google AI Studio (Gemini)</p>
                      <p className="text-sm text-blue-700">Get your free Gemini API key</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-blue-600 ml-auto" />
                  </a>
                  <a
                    href="https://console.groq.com/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 border border-green-200 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  >
                    <Zap className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Groq Cloud</p>
                      <p className="text-sm text-green-700">Access fast inference models</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-green-600 ml-auto" />
                  </a>
                  <a
                    href="https://huggingface.co/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 border border-purple-200 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <Brain className="h-6 w-6 text-purple-600" />
                    <div>
                      <p className="font-medium text-purple-800">Hugging Face</p>
                      <p className="text-sm text-purple-700">Explore open-source AI models</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-purple-600 ml-auto" />
                  </a>
                  <a
                    href="https://openrouter.ai/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Bot className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800">OpenRouter</p>
                      <p className="text-sm text-gray-700">Access various models through a unified API</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-600 ml-auto" />
                  </a>
                </div>

                <Separator />

                <h3 className="text-lg font-medium mb-4">Existing API Keys</h3>
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading keys...</p>
                  </div>
                ) : apiKeys.length === 0 ? (
                  <p className="text-gray-600">No API keys added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{key.api_key_name}</p>
                          <p className="text-sm text-gray-600">
                            Added: {new Date(key.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteApiKey(key.id)}
                          disabled={loading}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}