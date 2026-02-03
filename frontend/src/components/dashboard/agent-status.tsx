'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square } from 'lucide-react'

export function AgentStatus() {
  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch('/api/v1/agents')
      return res.json()
    },
  })

  const handleControl = async (agentId: string, action: string) => {
    await fetch(`/api/v1/agents/${agentId}/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Active Agents</h3>
      <div className="space-y-4">
        {agents?.data?.slice(0, 5).map((agent: any) => (
          <div key={agent.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium">{agent.name}</p>
                <p className="text-sm text-muted-foreground">{agent.taxonomy}</p>
              </div>
              <Badge variant={agent.status === 'running' ? 'default' : 'secondary'}>
                {agent.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all"
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{agent.progress}%</span>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={() => handleControl(agent.id, 'pause')}>
                <Pause className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleControl(agent.id, 'resume')}>
                <Play className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleControl(agent.id, 'stop')}>
                <Square className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
