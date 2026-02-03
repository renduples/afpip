'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'

export function RecentAnalysis() {
  const { data: analyses } = useQuery({
    queryKey: ['recent-analysis'],
    queryFn: async () => {
      const res = await fetch('/api/v1/analytics/recent')
      return res.json()
    },
  })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Analysis</h3>
      <div className="space-y-3">
        {analyses?.data?.map((analysis: any) => (
          <div key={analysis.id} className="border-l-2 border-primary pl-4 py-2">
            <p className="font-medium">{analysis.title}</p>
            <p className="text-sm text-muted-foreground">{analysis.description}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(analysis.completed_at), { addSuffix: true })}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}
