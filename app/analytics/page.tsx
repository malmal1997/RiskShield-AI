"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Eye, Clock, MousePointer, TrendingUp, Mail, Phone, Building, RefreshCw, AlertTriangle } from "lucide-react"
import { supabaseClient } from "@/lib/supabase-client"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

interface AnalyticsData {
  sessions: any[]
  pageViews: any[]
  interactions: any[]
  leads: any[]
  stats: {
    totalSessions: number
    totalPageViews: number
    totalInteractions: number
    totalLeads: number
    avgTimeSpent: number
    conversionRate: number
  }
}

const defaultAnalyticsData: AnalyticsData = {
  sessions: [],
  pageViews: [],
  interactions: [],
  leads: [],
  stats: {
    totalSessions: 0,
    totalPageViews: 0,
    totalInteractions: 0,
    totalLeads: 0,
    avgTimeSpent: 0,
    conversionRate: 0,
  },
};

export default function AnalyticsPage() {
  return (
    <AuthGuard permission="view_analytics"> {/* Added permission prop */}
      <AnalyticsContent />
    </AuthGuard>
  )
}

function AnalyticsContent() {
  const { user, loading: authLoading, hasPermission } = useAuth();
  const [data, setData] = useState<AnalyticsData>(defaultAnalyticsData)
  const [timeframe, setTimeframe] = useState("7d")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const canViewAnalytics = hasPermission("view_analytics");

  const loadAnalytics = async () => {
    if (!canViewAnalytics) {
      setError("You do not have permission to view analytics.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      switch (timeframe) {
        case "24h":
          startDate.setDate(endDate.getDate() - 1)
          break
        case "7d":
          startDate.setDate(endDate.getDate() - 7)
          break
        case "30d":
          startDate.setDate(endDate.getDate() - 30)
          break
        case "90d":
          startDate.setDate(endDate.getDate() - 90)
          break
      }

      // Load sessions
      const { data: sessions } = await supabaseClient
        .from("preview_sessions")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })

      // Load page views
      const { data: pageViews } = await supabaseClient
        .from("page_views")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })

      // Load interactions
      const { data: interactions } = await supabaseClient
        .from("feature_interactions")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })

      // Load leads
      const { data: leads } = await supabaseClient
        .from("preview_leads")
        .select("*")
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false })

      // Calculate stats
      const totalSessions = sessions?.length || 0
      const totalPageViews = pageViews?.length || 0
      const totalInteractions = interactions?.length || 0
      const totalLeads = leads?.length || 0
      const avgTimeSpent = sessions?.reduce((sum: number, s: { total_time_spent: number }) => sum + (s.total_time_spent || 0), 0) / totalSessions || 0
      const conversions = sessions?.filter((s: { converted_user_id: string | null }) => s.converted_user_id).length || 0
      const conversionRate = totalSessions > 0 ? (conversions / totalSessions) * 100 : 0

      setData({
        sessions: sessions || [],
        pageViews: pageViews || [],
        interactions: interactions || [],
        leads: leads || [],
        stats: {
          totalSessions,
          totalPageViews,
          totalInteractions,
          totalLeads,
          avgTimeSpent: Math.round(avgTimeSpent),
          conversionRate: Math.round(conversionRate * 100) / 100,
        },
      })
    } catch (err) {
      console.error("Error loading analytics:", err)
      setError(err instanceof Error ? err.message : "Unknown error loading analytics.");
      setData(defaultAnalyticsData); // Reset to default on error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!authLoading) {
      loadAnalytics()
    }
  }, [timeframe, authLoading, canViewAnalytics])

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  const getTopPages = () => {
    if (!data) return []
    const pageStats = data.pageViews.reduce(
      (acc: Record<string, number>, pv: { page_path: string }) => {
        acc[pv.page_path] = (acc[pv.page_path] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(pageStats)
      .sort(([, a], [, b]) => (b as number) - (a as number)) // Explicitly cast a and b to number
      .slice(0, 10)
      .map(([path, views]) => ({ path, views }))
  }

  const getTopFeatures = () => {
    if (!data) return []
    const featureStats = data.interactions.reduce(
      (acc: Record<string, number>, int: { feature_name: string }) => {
        acc[int.feature_name] = (acc[int.feature_name] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return Object.entries(featureStats)
      .sort(([, a], [, b]) => (b as number) - (a as number)) // Explicitly cast a and b to number
      .slice(0, 10)
      .map(([feature, interactions]) => ({ feature, interactions }))
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usage Analytics</h1>
            <p className="text-gray-600">Track preview mode engagement and leads</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeframe}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <Button onClick={loadAnalytics} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data?.stats.totalSessions}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data?.stats.totalPageViews}</div>
                  <div className="text-sm text-gray-600">Page Views</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MousePointer className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data?.stats.totalInteractions}</div>
                  <div className="text-sm text-gray-600">Interactions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data?.stats.totalLeads}</div>
                  <div className="text-sm text-gray-600">Leads</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{formatTime(data?.stats.avgTimeSpent || 0)}</div>
                  <div className="text-sm text-gray-600">Avg Time</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <div className="text-2xl font-bold">{data?.stats.conversionRate}%</div>
                  <div className="text-sm text-gray-600">Conversion</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="features">Feature Usage</TabsTrigger>
            <TabsTrigger value="pages">Page Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Preview mode user sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.sessions.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">Session {session.session_id.slice(-8)}</div>
                        <div className="text-sm text-gray-600">{new Date(session.created_at).toLocaleString()}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {session.referrer && `From: ${new URL(session.referrer).hostname}`}
                          {session.utm_source && ` • UTM: ${session.utm_source}`}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatTime(session.total_time_spent || 0)}</div>
                        <div className="text-xs text-gray-600">{session.page_views || 0} pages</div>
                        {session.converted_user_id && (
                          <Badge className="bg-green-100 text-green-800 mt-1">Converted</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Captured Leads</CardTitle>
                <CardDescription>Users who showed interest during preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.leads.map((lead: any) => (
                    <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{lead.name || lead.email || "Anonymous"}</span>
                          <Badge
                            className={
                              lead.interest_level === "high"
                                ? "bg-red-100 text-red-800"
                                : lead.interest_level === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {lead.interest_level} interest
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {lead.email && (
                            <span className="flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {lead.email}
                            </span>
                          )}
                          {lead.company && (
                            <span className="flex items-center mt-1">
                              <Building className="h-3 w-3 mr-1" />
                              {lead.company}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Source: {lead.lead_source} • {new Date(lead.created_at).toLocaleString()}
                        </div>
                        {lead.notes && <div className="text-xs text-gray-600 mt-1 italic">{lead.notes}</div>}
                      </div>
                      <div className="flex items-center space-x-2">
                        {!lead.followed_up && <Badge className="bg-orange-100 text-orange-800">Follow Up</Badge>}
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Features</CardTitle>
                  <CardDescription>Most engaged features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopFeatures().map(({ feature, interactions }, index) => (
                      <div key={feature} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{feature}</span>
                        </div>
                        <Badge variant="outline">{interactions as number} interactions</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Interactions</CardTitle>
                  <CardDescription>Latest feature usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data?.interactions.slice(0, 10).map((interaction: any) => (
                      <div key={interaction.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium">{interaction.feature_name}</span>
                          <span className="text-gray-600 ml-2">({interaction.action_type})</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(interaction.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Page Analytics</CardTitle>
                <CardDescription>Most visited pages and engagement</CardDescription>
              </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getTopPages().map(({ path, views }, index) => (
                      <div key={path} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-green-100 text-green-600 rounded text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{path}</span>
                        </div>
                        <Badge variant="outline">{views as number} views</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }