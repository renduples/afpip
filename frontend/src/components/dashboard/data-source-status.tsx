'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function DataSourceStatus() {
  const { data: sources } = useQuery({
    queryKey: ['data-sources'],
    queryFn: async () => {
      const res = await fetch('/api/v1/data-sources')
      return res.json()
    },
  })

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Data Sources</h3>
      <div className="space-y-3">
        {sources?.data?.slice(0, 5).map((source: any) => (
          <div key={source.id} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{source.name}</p>
              <p className="text-sm text-muted-foreground">
                {source.record_count?.toLocaleString()} records
              </p>
            </div>
            <Badge variant={source.status === 'active' ? 'default' : 'secondary'}>
              {source.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
