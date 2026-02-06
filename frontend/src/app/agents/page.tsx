'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Bot, Play, Pause, Square, Settings } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface Agent {
  id: string
  name: string
  type: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  taxonomy: string
  tasksCompleted: number
  uptime: string
  model: string
  progress: number
}

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const queryClient = useQueryClient()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

  const { data: agentsData, isLoading } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/agents`)
      if (!response.ok) throw new Error('Failed to fetch agents')
      const json = await response.json()
      const data = json.data || json
      return Array.isArray(data) ? data : []
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

  // Ensure agents is always an array
  const agents = Array.isArray(agentsData) ? agentsData : []

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-500'
      case 'paused':
        return 'bg-yellow-500'
      case 'stopped':
        return 'bg-gray-400'
      case 'error':
        return 'bg-destructive'
    }
  }

  const getStatusBadgeClass = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return 'bg-primary text-primary-foreground'
      case 'paused':
        return 'bg-gray-200 text-gray-700'
      case 'stopped':
        return 'bg-gray-300 text-gray-600'
      case 'error':
        return 'bg-red-100 text-red-700'
    }
  }

  const handleControl = (agentId: string, action: string) => {
    controlMutation.mutate({ agentId, action })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Agents</h1>
            <p className="text-muted-foreground">
              Manage and monitor your LLM agents
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Create Agent
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
          />
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Agents</p>
            <p className="text-2xl font-bold">{agents.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Running</p>
            <p className="text-2xl font-bold text-green-500">
              {agents.filter((a) => a.status === 'running').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Paused</p>
            <p className="text-2xl font-bold text-yellow-500">
              {agents.filter((a) => a.status === 'paused').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Tasks Completed</p>
            <p className="text-2xl font-bold">
              {agents.reduce((sum, a) => sum + (a.tasksCompleted || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full p-8 text-center text-muted-foreground">
              Loading agents...
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="col-span-full p-8 text-center">
              <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No agents found</p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <div key={agent.id} className="rounded-lg border bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold">{agent.name}</h3>
                    <p className="text-sm text-muted-foreground">{agent.taxonomy}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(agent.status)}`}>
                    {agent.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${agent.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-10 text-right">
                      {agent.progress || 0}%
                    </span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleControl(agent.id, 'stop')}
                    disabled={agent.status === 'stopped'}
                    className="flex items-center justify-center p-2 text-sm border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Stop"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                  {agent.status === 'running' ? (
                    <button
                      onClick={() => handleControl(agent.id, 'pause')}
                      className="flex items-center justify-center p-2 text-sm border rounded-lg hover:bg-accent"
                      title="Pause"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleControl(agent.id, 'resume')}
                      disabled={agent.status === 'stopped'}
                      className="flex items-center justify-center p-2 text-sm border rounded-lg hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Resume"
                    >
                      <Play className="h-4 w-4" />
                    </button>
                  )}
                  <button 
                    className="flex items-center justify-center p-2 text-sm border rounded-lg hover:bg-accent"
                    title="Settings"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
