'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Bot, Play, Pause, Square, Settings } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface Agent {
  id: string
  name: string
  type: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  tasksCompleted: number
  uptime: string
  model: string
}

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

  const { data: agents = [], isLoading } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/agents`)
      if (!response.ok) throw new Error('Failed to fetch agents')
      const json = await response.json()
      return json.data || json
    },
  })

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
              {agents.reduce((sum, a) => sum + a.tasksCompleted, 0).toLocaleString()}
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
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Bot className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-xs text-muted-foreground">{agent.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)} animate-pulse`} />
                    <span className="text-xs font-medium capitalize">{agent.status}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-mono text-xs">{agent.model}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tasks Completed:</span>
                    <span className="font-medium">{agent.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Uptime:</span>
                    <span className="font-medium">{agent.uptime}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {agent.status === 'running' ? (
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-accent">
                      <Pause className="h-4 w-4" />
                      Pause
                    </button>
                  ) : (
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-accent">
                      <Play className="h-4 w-4" />
                      Start
                    </button>
                  )}
                  <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-accent">
                    <Square className="h-4 w-4" />
                    Stop
                  </button>
                  <button className="px-3 py-2 text-sm border rounded-lg hover:bg-accent">
                    <Settings className="h-4 w-4" />
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
