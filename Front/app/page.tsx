'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton' // optional: for loading skeletons
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import { TrendingUp, Users, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

// Type matching your backend response
interface DashboardData {
  total_poa_requests: { current_month: number; comparison_percent: string }
  pending_approvals: { current_month: number; comparison_percent: string }
  verified_agents: { current_month: number; comparison_percent: string }
  rejected_kyc_issues: { current_month: number; comparison_percent: string }
  monthly_activity: { month: string; count: number }[]
  annual_total: number
  last_6_month_increase: string
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('https://legatora-backend.onrender.com/dashboard', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const json: DashboardData = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch on mount
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Transform backend monthly_activity → chart format
  const monthlyData = data?.monthly_activity.map(item => ({
    month: item.month,
    requests: item.count
  })) || []

  // Metrics derived from real API data
  const metrics = data
    ? [
        {
          label: 'Total POA Requests',
          value: data.total_poa_requests.current_month.toLocaleString(),
          change: data.total_poa_requests.comparison_percent,
          icon: TrendingUp,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-100',
          lineColor: '#eab308',
        },
        {
          label: 'Pending Approvals',
          value: data.pending_approvals.current_month.toString(),
          change: data.pending_approvals.comparison_percent,
          icon: AlertCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-100',
          lineColor: '#16a34a',
        },
        {
          label: 'Verified Agents',
          value: data.verified_agents.current_month.toString(),
          change: data.verified_agents.comparison_percent,
          icon: CheckCircle2,
          color: 'text-teal-600',
          bgColor: 'bg-teal-50',
          borderColor: 'border-teal-100',
          lineColor: '#0d9488',
        },
        {
          label: 'Rejected/FYC Issues',
          value: data.rejected_kyc_issues.current_month.toString(),
          change: data.rejected_kyc_issues.comparison_percent,
          icon: AlertCircle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-100',
          lineColor: '#ea580c',
        },
      ]
    : []

  // Sparkline stays static (or you can generate from real trends later)
  const sparklineData = [
    { value: 20 }, { value: 85 }, { value: 35 }, { value: 95 },
    { value: 40 }, { value: 90 }, { value: 50 },
  ]

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 lg:ml-56 flex flex-col overflow-hidden">
          <Header />
          <div className="p-6">
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-lg" />
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 lg:ml-56 flex flex-col items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">Failed to load dashboard</p>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={fetchDashboardData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-56 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">A summary of system activity and key metrics.</p>
              </div>
              <Button variant="outline" size="sm" onClick={fetchDashboardData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {metrics.map((metric) => {
                const Icon = metric.icon
                return (
                  <div
                    key={metric.label}
                    className={`${metric.bgColor} border-2 ${metric.borderColor} rounded-lg p-5 flex items-center justify-between`}
                  >
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground mb-1">{metric.label}</p>
                      <h3 className="text-3xl font-bold text-foreground">{metric.value}</h3>
                      <p className={`text-xs mt-2 font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {metric.change}
                      </p>
                    </div>

                    <div className="w-24 h-10 ml-3 flex-shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sparklineData} margin={{ top: 2, right: 2, left: -20, bottom: 2 }}>
                          <Line
                            type="linear"
                            dataKey="value"
                            stroke={metric.lineColor}
                            strokeWidth={2.5}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Main Chart + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
              <Card className="lg:col-span-2 p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">Monthly Activity</h2>
                  <p className="text-sm text-muted-foreground">
                    Last 12 Months • {data?.annual_total.toLocaleString()} Total Requests • {data?.last_6_month_increase}
                  </p>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="month" stroke="#666666" />
                    <YAxis stroke="#666666" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e0e0e0', borderRadius: '8px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="requests"
                      stroke="#17a3a3"
                      strokeWidth={3}
                      dot={{ fill: '#17a3a3', r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Review Urgent Approvals
                  </Button>
                  <Button variant="outline" className="w-full">
                    Assign Flagged Requests
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Suspicious Accounts
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
