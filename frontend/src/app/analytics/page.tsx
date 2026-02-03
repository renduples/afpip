'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, BarChart3 } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Advanced analytics and insights for fiscal policy data
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Data Processing</p>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">98.5%</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +2.1% from last month
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Query Performance</p>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">42ms</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" />
              -8ms faster
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">1,247</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% growth
            </p>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Cost Savings</p>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold">$45.2K</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +$8.3K this month
            </p>
          </div>
        </div>

        {/* Charts Placeholder */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Data Volume Trends</h3>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Query Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
            <div className="h-64 flex items-center justify-center bg-muted/50 rounded">
              <p className="text-muted-foreground">Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
