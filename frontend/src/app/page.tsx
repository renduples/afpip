'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MetricsOverview } from '@/components/dashboard/metrics-overview'
import { DataSourceStatus } from '@/components/dashboard/data-source-status'
import { AgentStatus } from '@/components/dashboard/agent-status'
import { RecentAnalysis } from '@/components/dashboard/recent-analysis'

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agentic Fiscal Policy Intelligence Platform</h1>
          <p className="text-muted-foreground">
            Monitor data sources, agents, and LLM performance
          </p>
        </div>

        <MetricsOverview />

        <div className="grid gap-6 md:grid-cols-2">
          <DataSourceStatus />
          <AgentStatus />
        </div>

        <RecentAnalysis />
      </div>
    </DashboardLayout>
  )
}
