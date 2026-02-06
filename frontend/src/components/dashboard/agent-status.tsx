'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Play, Pause, Square } from 'lucide-react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

export function AgentStatus() {
  const queryClient = useQueryClient()

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/v1/agents`)
      const json = await res.json()
      return json
    },
  })

  const controlMutation = useMutation({
    mutationFn: async ({ agentId, action }: { agentId: string; action: string }) => {
      const response = await fetch(`${API_URL}/api/v1/agents/${agentId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  const handleControl = (agentId: string, action: string) => {
    controlMutation.mutate({ agentId, action })
  }

  const agentsList = agents?.data || []

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Active Agents</h3>
      <div className="space-y-4">
        {agentsList.slice(0, 5).map((agent: any) => (
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
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleControl(agent.id, 'stop')}
                disabled={agent.status === 'stopped'}
              >
                <Square className="h-3 w-3" />
              </Button>
              {agent.status === 'running' ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleControl(agent.id, 'pause')}
                >
                  <Play className="h-3 w-3" />
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleControl(agent.id, 'resume')}
                  disabled={agent.status === 'stopped'}
                >
                  <Play className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
