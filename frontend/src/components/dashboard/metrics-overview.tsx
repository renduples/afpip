'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Database, Activity, Zap, DollarSign } from 'lucide-react'

export function MetricsOverview() {
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/v1/analytics/dashboard')
      return res.json()
    },
  })

  const cards = [
    {
      title: 'Total Records',
      value: metrics?.metrics?.total_records?.toLocaleString() || '0',
      icon: Database,
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Active Agents',
      value: metrics?.metrics?.active_agents || '0',
      icon: Activity,
      trend: '+2',
      trendUp: true,
    },
    {
      title: 'Data Sources',
      value: metrics?.metrics?.data_sources || '0',
      icon: Zap,
      trend: '+3',
      trendUp: true,
    },
    {
      title: 'Monthly Cost',
      value: `$${metrics?.metrics?.monthly_cost_usd?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      trend: '-8.2%',
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {card.title}
              </p>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
              <p className={`text-xs mt-1 ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {card.trend} from last month
              </p>
            </div>
            <card.icon className="h-8 w-8 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  )
}
