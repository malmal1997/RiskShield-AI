import { supabaseClient } from "./supabase-client"
import { getCurrentUserWithProfile } from "./auth-service"

export interface RiskMetrics {
  totalAssessments: number
  completedAssessments: number
  averageRiskScore: number
  highRiskVendors: number
  riskTrend: Array<{ date: string; score: number }>
  riskDistribution: Array<{ level: string; count: number }>
  complianceScore: number
}

export interface VendorMetrics {
  totalVendors: number
  activeVendors: number
  riskLevels: Record<string, number>
  industryBreakdown: Array<{ industry: string; count: number }>
  assessmentCompletion: number
}

export interface ComplianceMetrics {
  frameworks: Array<{
    name: string
    status: string
    completionPercentage: number
    lastAssessment: string
  }>
  gaps: Array<{
    requirement: string
    status: string
    priority: string
  }>
}

// Get risk analytics
export async function getRiskAnalytics(timeframe = "30d"): Promise<RiskMetrics> {
  try {
    const { user, profile, organization } = await getCurrentUserWithProfile()
    if (!user || !profile || !organization) {
      console.log("getRiskAnalytics: No authenticated user, profile, or organization found. Returning empty metrics.");
      return {
        totalAssessments: 0,
        completedAssessments: 0,
        averageRiskScore: 0,
        highRiskVendors: 0,
        riskTrend: [],
        riskDistribution: [],
        complianceScore: 0,
      };
    }

    console.log(`getRiskAnalytics: User ID: ${user.id}, Profile Org ID: ${profile.organization_id}, Auth Org ID: ${organization.id}`);

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    switch (timeframe) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(endDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(endDate.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }
    console.log(`getRiskAnalytics: Filtering by created_at between ${startDate.toISOString()} and ${endDate.toISOString()}`);

    // Get assessments data, filtering by user_id and organization_id
    const { data: assessments, error } = await supabaseClient
      .from("assessments")
      .select("*")
      .eq("user_id", user.id) // Filter by current user's ID
      .eq("organization_id", organization.id) // Explicitly filter by organization_id
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString())

    if (error) {
      console.error("getRiskAnalytics: Supabase query error:", error);
      throw error;
    }

    console.log(`getRiskAnalytics: Fetched ${assessments?.length || 0} assessments.`);
    if (assessments && assessments.length > 0) {
      console.log("getRiskAnalytics: Sample assessment:", assessments[0]);
    }

    const totalAssessments = assessments?.length || 0
    const completedAssessments = assessments?.filter((a) => a.status === "completed").length || 0
    const riskScores = assessments?.filter((a) => a.risk_score).map((a) => a.risk_score) || []
    const averageRiskScore =
      riskScores.length > 0 ? riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length : 0

    // Risk distribution
    const riskDistribution = [
      { level: "Low", count: assessments?.filter((a) => a.risk_level === "low").length || 0 },
      { level: "Medium", count: assessments?.filter((a) => a.risk_level === "medium").length || 0 },
      { level: "High", count: assessments?.filter((a) => a.risk_level === "high").length || 0 },
      { level: "Critical", count: assessments?.filter((a) => a.risk_level === "critical").length || 0 },
    ]

    // Risk trend (simplified - would need more complex aggregation in production)
    const riskTrend = generateRiskTrend(assessments || [], timeframe)

    return {
      totalAssessments,
      completedAssessments,
      averageRiskScore: Math.round(averageRiskScore),
      highRiskVendors: (riskDistribution[2]?.count || 0) + (riskDistribution[3]?.count || 0),
      riskTrend,
      complianceScore: calculateComplianceScore(assessments || []),
      riskDistribution,
    }
  } catch (error) {
    console.error("Error getting risk analytics:", error)
    throw error
  }
}

// Get vendor analytics
export async function getVendorAnalytics(): Promise<VendorMetrics> {
  try {
    const { user, profile, organization } = await getCurrentUserWithProfile()
    if (!user || !profile || !organization) {
      console.log("getVendorAnalytics: No authenticated user, profile, or organization found. Returning empty metrics.");
      return {
        totalVendors: 0,
        activeVendors: 0,
        riskLevels: { low: 0, medium: 0, high: 0, critical: 0 },
        industryBreakdown: [],
        assessmentCompletion: 0,
      };
    }
    console.log(`getVendorAnalytics: User ID: ${user.id}, Profile Org ID: ${profile.organization_id}, Auth Org ID: ${organization.id}`);


    // Assuming 'vendors' table has 'user_id' and 'organization_id' for RLS
    const { data: vendors, error } = await supabaseClient
      .from("vendors")
      .select("*")
      .eq("user_id", user.id) // Filter by current user's ID
      .eq("organization_id", organization.id) // Explicitly filter by organization_id

    if (error) {
      console.error("getVendorAnalytics: Supabase query error:", error);
      throw error;
    }

    console.log(`getVendorAnalytics: Fetched ${vendors?.length || 0} vendors.`);
    if (vendors && vendors.length > 0) {
      console.log("getVendorAnalytics: Sample vendor:", vendors[0]);
    }

    const totalVendors = vendors?.length || 0
    const activeVendors = vendors?.filter((v) => v.status === "active").length || 0

    // Risk levels
    const riskLevels = {
      low: vendors?.filter((v) => v.risk_level === "low").length || 0,
      medium: vendors?.filter((v) => v.risk_level === "medium").length || 0,
      high: vendors?.filter((v) => v.risk_level === "high").length || 0,
      critical: vendors?.filter((v) => v.risk_level === "critical").length || 0,
    }

    // Industry breakdown
    const industryMap = new Map()
    vendors?.forEach((vendor) => {
      if (vendor.industry) {
        industryMap.set(vendor.industry, (industryMap.get(vendor.industry) || 0) + 1)
      }
    })
    const industryBreakdown = Array.from(industryMap.entries()).map(([industry, count]) => ({
      industry,
      count,
    }))

    return {
      totalVendors,
      activeVendors,
      riskLevels,
      industryBreakdown,
      assessmentCompletion: totalVendors > 0 ? (activeVendors / totalVendors) * 100 : 0,
    }
  } catch (error) {
    console.error("getVendorAnalytics: Error getting vendor analytics:", error)
    throw error
  }
}

// Helper functions
function generateRiskTrend(assessments: any[], timeframe: string) {
  // Simplified trend generation - in production would use proper time series aggregation
  const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
  const trend = []

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const dayAssessments = assessments.filter((a) => {
      const assessmentDate = new Date(a.created_at)
      return assessmentDate.toDateString() === date.toDateString()
    })

    const avgScore =
      dayAssessments.length > 0
        ? dayAssessments.reduce((sum, a) => sum + (a.risk_score || 0), 0) / dayAssessments.length
        : 0

    trend.push({
      date: date.toISOString().split("T")[0],
      score: Math.round(avgScore),
    })
  }

  return trend
}

function calculateComplianceScore(assessments: any[]): number {
  // Simplified compliance score calculation
  const completedAssessments = assessments.filter((a) => a.status === "completed")
  const totalAssessments = assessments.length

  if (totalAssessments === 0) return 0

  return Math.round((completedAssessments.length / totalAssessments) * 100)
}

// Export data for reports
export async function exportAnalyticsData(format: "csv" | "json" = "json") {
  try {
    const riskMetrics = await getRiskAnalytics()
    const vendorMetrics = await getVendorAnalytics()

    const data = {
      riskMetrics,
      vendorMetrics,
      exportedAt: new Date().toISOString(),
    }

    if (format === "csv") {
      return convertToCSV(data)
    }

    return data
  } catch (error) {
    console.error("Error exporting analytics data:", error)
    throw error
  }
}

function convertToCSV(data: any): string {
  // Simplified CSV conversion - would need proper CSV library in production
  const headers = Object.keys(data).join(",")
  const values = Object.values(data)
    .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
    .join(",")

  return `${headers}\n${values}`
}