"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  BarChart,
  Clock,
  Shield,
  RefreshCw,
  Database,
  Server,
  Cpu,
  HardDrive,
  Network,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
} from "lucide-react"
import dynamic from "next/dynamic"
const ResponsiveContainer = dynamic(() => import("recharts").then(m => m.ResponsiveContainer), { ssr: false })
const LineChart = dynamic(() => import("recharts").then(m => m.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then(m => m.Line), { ssr: false })
const XAxis = dynamic(() => import("recharts").then(m => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then(m => m.YAxis), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then(m => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then(m => m.Tooltip), { ssr: false })
const AreaChart = dynamic(() => import("recharts").then(m => m.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then(m => m.Area), { ssr: false })
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/components/auth-context"
import Link from "next/link"

// Sample performance data
const performanceData = [
  { time: "00:00", cpu: 35, memory: 42, requests: 18 },
  { time: "01:00", cpu: 28, memory: 40, requests: 12 },
  { time: "02:00", cpu: 27, memory: 38, requests: 9 },
  { time: "03:00", cpu: 25, memory: 38, requests: 8 },
  { time: "04:00", cpu: 26, memory: 38, requests: 10 },
  { time: "05:00", cpu: 28, memory: 39, requests: 14 },
  { time: "06:00", cpu: 35, memory: 42, requests: 22 },
  { time: "07:00", cpu: 48, memory: 50, requests: 35 },
  { time: "08:00", cpu: 62, memory: 58, requests: 48 },
  { time: "09:00", cpu: 75, memory: 62, requests: 56 },
  { time: "10:00", cpu: 82, memory: 65, requests: 61 },
  { time: "11:00", cpu: 78, memory: 63, requests: 58 },
  { time: "12:00", cpu: 74, memory: 62, requests: 52 },
  { time: "13:00", cpu: 72, memory: 60, requests: 50 },
  { time: "14:00", cpu: 70, memory: 58, requests: 48 },
  { time: "15:00", cpu: 68, memory: 57, requests: 46 },
  { time: "16:00", cpu: 65, memory: 55, requests: 44 },
  { time: "17:00", cpu: 60, memory: 52, requests: 40 },
  { time: "18:00", cpu: 55, memory: 50, requests: 36 },
  { time: "19:00", cpu: 50, memory: 48, requests: 32 },
  { time: "20:00", cpu: 45, memory: 45, requests: 28 },
  { time: "21:00", cpu: 40, memory: 42, requests: 24 },
  { time: "22:00", cpu: 35, memory: 40, requests: 20 },
  { time: "23:00", cpu: 30, memory: 38, requests: 16 },
]

// Sample errors data
const errorsData = [
  { id: 1, type: "API Error", message: "500 Internal Server Error in /api/vendors", time: "10 minutes ago", count: 3 },
  {
    id: 2,
    type: "Database Error",
    message: "Connection timeout in assessment service",
    time: "25 minutes ago",
    count: 1,
  },
  { id: 3, type: "Auth Error", message: "JWT verification failed for user session", time: "1 hour ago", count: 5 },
  { id: 4, type: "Rate Limit", message: "Too many requests from IP 192.168.1.45", time: "2 hours ago", count: 12 },
]

// Sample logs data
const logsData = [
  { id: 1, level: "INFO", message: "User login successful: user@example.com", timestamp: "2023-06-15T10:23:45Z" },
  {
    id: 2,
    level: "WARN",
    message: "Slow database query detected (2.5s): SELECT * FROM assessments",
    timestamp: "2023-06-15T10:22:30Z",
  },
  { id: 3, level: "ERROR", message: "Failed to connect to email service", timestamp: "2023-06-15T10:20:15Z" },
  { id: 4, level: "INFO", message: "Assessment #1234 completed successfully", timestamp: "2023-06-15T10:18:22Z" },
  { id: 5, level: "DEBUG", message: "Cache hit ratio: 78.5%", timestamp: "2023-06-15T10:15:10Z" },
  { id: 6, level: "INFO", message: "Scheduled job started: cleanup_old_sessions", timestamp: "2023-06-15T10:10:00Z" },
  { id: 7, level: "ERROR", message: "Invalid request payload for /api/assessments", timestamp: "2023-06-15T10:05:45Z" },
  { id: 8, level: "WARN", message: "Memory usage above 75% threshold", timestamp: "2023-06-15T10:00:30Z" },
]

export default function DevDashboardPage() {
  return (
    <AuthGuard>
      <DevDashboardContent />
    </AuthGuard>
  )
}

function DevDashboardContent() {
  const { user, profile, role, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [timeframe, setTimeframe] = useState("24h")

  // System metrics state
  const [systemMetrics, setSystemMetrics] = useState({
    activeUsers: 37,
    systemLoad: 45,
    responseTime: 138,
    uptime: 99.8,
  })

  // Database metrics state
  const [dbMetrics, setDbMetrics] = useState({
    connections: 24,
    queryTime: 45,
    cacheHitRatio: 82,
    size: 1.2,
  })

  // Error counts
  const [errorCounts, setErrorCounts] = useState({
    critical: 2,
    warning: 8,
    info: 15,
  })

  // Check if user has developer role
  const isDeveloper = role?.role === "admin" || (role?.permissions && role.permissions.developer === true)

  // Simulate real-time updates
  useEffect(() => {
    if (!isDeveloper) return

    const interval = setInterval(() => {
      setSystemMetrics((prev) => ({
        activeUsers: Math.max(1, prev.activeUsers + Math.floor(Math.random() * 5) - 2),
        systemLoad: Math.max(5, Math.min(95, prev.systemLoad + Math.floor(Math.random() * 10) - 5)),
        responseTime: Math.max(50, Math.min(500, prev.responseTime + Math.floor(Math.random() * 20) - 10)),
        uptime: Math.max(95, Math.min(100, prev.uptime + (Math.random() - 0.5) * 0.1)),
      }))

      setDbMetrics((prev) => ({
        connections: Math.max(1, prev.connections + Math.floor(Math.random() * 3) - 1),
        queryTime: Math.max(10, Math.min(200, prev.queryTime + Math.floor(Math.random() * 8) - 4)),
        cacheHitRatio: Math.max(50, Math.min(100, prev.cacheHitRatio + Math.floor(Math.random() * 4) - 2)),
        size: Math.max(0.1, prev.size + (Math.random() - 0.5) * 0.01),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [isDeveloper])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  // If not a developer, show access denied
  if (!isDeveloper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the developer dashboard.</p>
          <Link href="/dashboard">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <Server className="h-8 w-8 text-blue-400" />
                <div>
                  <span className="text-xl font-bold">DevOps Dashboard</span>
                  <p className="text-xs text-gray-400">RiskGuard AI Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-600">DEVELOPMENT</Badge>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-300">Live Monitoring</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                >
                  Exit Dev Mode
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* System Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Activity className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-4xl font-bold text-green-500">{systemMetrics.activeUsers}</div>
              <div className="text-sm text-gray-500 mt-1">Active Users</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <BarChart className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-4xl font-bold text-blue-500">{systemMetrics.systemLoad}%</div>
              <div className="text-sm text-gray-500 mt-1">System Load</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Clock className="h-8 w-8 text-amber-500 mb-2" />
              <div className="text-4xl font-bold text-amber-500">{systemMetrics.responseTime}ms</div>
              <div className="text-sm text-gray-500 mt-1">Response Time</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <Shield className="h-8 w-8 text-purple-500 mb-2" />
              <div className="text-4xl font-bold text-purple-500">{systemMetrics.uptime}%</div>
              <div className="text-sm text-gray-500 mt-1">Uptime</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="errors">Errors & Logs</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">System Performance</h3>
                  <div className="flex space-x-2">
                    {["6h", "24h", "7d"].map((period) => (
                      <Button
                        key={period}
                        variant={timeframe === period ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeframe(period)}
                      >
                        {period}
                      </Button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="cpu" stroke="#3b82f6" fill="#93c5fd" name="CPU %" />
                    <Area type="monotone" dataKey="memory" stroke="#10b981" fill="#a7f3d0" name="Memory %" />
                    <Area type="monotone" dataKey="requests" stroke="#f59e0b" fill="#fcd34d" name="Requests/s" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">Server Resources</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Cpu className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm text-gray-600">CPU Usage</span>
                        </div>
                        <span className="text-sm font-medium">{systemMetrics.systemLoad}%</span>
                      </div>
                      <Progress value={systemMetrics.systemLoad} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm text-gray-600">Memory Usage</span>
                        </div>
                        <span className="text-sm font-medium">62%</span>
                      </div>
                      <Progress value={62} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Network className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm text-gray-600">Network I/O</span>
                        </div>
                        <span className="text-sm font-medium">24.5 MB/s</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <HardDrive className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm text-gray-600">Disk Usage</span>
                        </div>
                        <span className="text-sm font-medium">38%</span>
                      </div>
                      <Progress value={38} className="h-2" />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-4">API Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg. Response Time</span>
                      <span className="text-sm font-medium">{systemMetrics.responseTime} ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Requests/minute</span>
                      <span className="text-sm font-medium">124</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <span className="text-sm font-medium">0.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cache Hit Ratio</span>
                      <span className="text-sm font-medium">76%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">P95 Response Time</span>
                      <span className="text-sm font-medium">210 ms</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">P99 Response Time</span>
                      <span className="text-sm font-medium">350 ms</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <Database className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-3xl font-bold text-blue-500">{dbMetrics.connections}</div>
                  <div className="text-sm text-gray-500 mt-1">Active Connections</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <Clock className="h-8 w-8 text-amber-500 mb-2" />
                  <div className="text-3xl font-bold text-amber-500">{dbMetrics.queryTime} ms</div>
                  <div className="text-sm text-gray-500 mt-1">Avg. Query Time</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <BarChart className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-3xl font-bold text-green-500">{dbMetrics.cacheHitRatio}%</div>
                  <div className="text-sm text-gray-500 mt-1">Cache Hit Ratio</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <HardDrive className="h-8 w-8 text-purple-500 mb-2" />
                  <div className="text-3xl font-bold text-purple-500">{dbMetrics.size.toFixed(2)} GB</div>
                  <div className="text-sm text-gray-500 mt-1">Database Size</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Slow Queries</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Query
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Executions
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          SELECT * FROM assessments WHERE vendor_id = ?
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">2.4s</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">124</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-red-100 text-red-800">Needs Index</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          SELECT * FROM vendors JOIN assessments
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">1.8s</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">56</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-amber-100 text-amber-800">Optimize</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                          UPDATE user_profiles SET last_login = ?
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">0.9s</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">312</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-blue-100 text-blue-800">Monitoring</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Errors & Logs Tab */}
          <TabsContent value="errors" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                  <div className="text-3xl font-bold text-red-500">{errorCounts.critical}</div>
                  <div className="text-sm text-gray-500 mt-1">Critical Errors</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                  <div className="text-3xl font-bold text-amber-500">{errorCounts.warning}</div>
                  <div className="text-sm text-gray-500 mt-1">Warnings</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-3xl font-bold text-green-500">98.7%</div>
                  <div className="text-sm text-gray-500 mt-1">Success Rate</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent Errors</h3>
                <div className="space-y-4">
                  {errorsData.map((error) => (
                    <div key={error.id} className="p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-red-800">{error.type}</h4>
                        <Badge className="bg-red-100 text-red-800">{error.count}x</Badge>
                      </div>
                      <p className="text-sm mt-1 text-gray-700 font-mono">{error.message}</p>
                      <p className="text-xs mt-2 text-gray-500">{error.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">System Logs</h3>
                <ScrollArea className="h-[300px] rounded-md border">
                  <div className="p-4 font-mono text-sm">
                    {logsData.map((log) => (
                      <div key={log.id} className="py-2 border-b border-gray-100 last:border-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 text-xs">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          <Badge
                            className={
                              log.level === "ERROR"
                                ? "bg-red-100 text-red-800"
                                : log.level === "WARN"
                                  ? "bg-amber-100 text-amber-800"
                                  : log.level === "INFO"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-800"
                            }
                          >
                            {log.level}
                          </Badge>
                          <span className="text-gray-800">{log.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <Users className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-3xl font-bold text-blue-500">{systemMetrics.activeUsers}</div>
                  <div className="text-sm text-gray-500 mt-1">Active Users</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <Activity className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-3xl font-bold text-green-500">24</div>
                  <div className="text-sm text-gray-500 mt-1">New Users (24h)</div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardContent className="p-6 flex flex-col items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-500 mb-2" />
                  <div className="text-3xl font-bold text-red-500">3</div>
                  <div className="text-sm text-gray-500 mt-1">Failed Logins</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">User Activity</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Active Sessions" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="bg-white shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Recent User Activity</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Action
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Time
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          IP Address
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              JD
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">John Doe</div>
                              <div className="text-xs text-gray-500">john@example.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Completed assessment</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">192.168.1.45</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              JS
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">Jane Smith</div>
                              <div className="text-xs text-gray-500">jane@example.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Generated policy</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">192.168.1.72</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                              RJ
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">Robert Johnson</div>
                              <div className="text-xs text-gray-500">robert@example.com</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Logged in</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25 minutes ago</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">192.168.1.89</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
