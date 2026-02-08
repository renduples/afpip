'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Play, Pause, Square, Settings, Search as SearchIcon, Download, Cpu, FileText, ArrowRight, ChevronDown, ChevronUp, Terminal, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface LogEntry {
  time: string
  level: 'info' | 'success' | 'warning' | 'error'
  message: string
}

interface AgentMetrics {
  [key: string]: string | number | string[]
}

interface Agent {
  id: string
  name: string
  type: 'discovery' | 'collector' | 'analyzer' | 'reporter'
  description: string
  status: 'running' | 'paused' | 'stopped' | 'error'
  model: string
  progress: number
  schedule: string
  metrics: AgentMetrics
  logs?: LogEntry[]
  [key: string]: any
}

const AGENT_ORDER = ['discovery', 'collector', 'analyzer', 'reporter']

const getAgentIcon = (type: string) => {
  switch (type) {
    case 'discovery': return SearchIcon
    case 'collector': return Download
    case 'analyzer': return Cpu
    case 'reporter': return FileText
    default: return Cpu
  }
}

const getAgentColor = (type: string) => {
  switch (type) {
    case 'discovery': return 'bg-blue-500'
    case 'collector': return 'bg-green-500'
    case 'analyzer': return 'bg-purple-500'
    case 'reporter': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

const getAgentBorderColor = (type: string) => {
  switch (type) {
    case 'discovery': return 'border-l-blue-500'
    case 'collector': return 'border-l-green-500'
    case 'analyzer': return 'border-l-purple-500'
    case 'reporter': return 'border-l-orange-500'
    default: return 'border-l-gray-500'
  }
}

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set())
  const queryClient = useQueryClient()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

  const { data: agentsData, isLoading } = useQuery<Agent[]>({
    queryKey: ['agents'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/agents`)
      if (!response.ok) throw new Error('Failed to fetch agents')
      const json = await response.json()
      const data = json.data || json
      
      // Fetch logs for each agent
      const agentsWithLogs = await Promise.all(
        (Array.isArray(data) ? data : []).map(async (agent: Agent) => {
          try {
            const logsRes = await fetch(`${API_URL}/api/v1/agents/${agent.id}/logs?limit=10`)
            const logsJson = await logsRes.json()
            return { ...agent, logs: logsJson.logs || [] }
          } catch {
            return { ...agent, logs: [] }
          }
        })
      )
      return agentsWithLogs
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds for live logs
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

  const agents = Array.isArray(agentsData) ? agentsData : []
  
  // Sort agents by pipeline order
  const sortedAgents = [...agents].sort((a, b) => {
    return AGENT_ORDER.indexOf(a.type) - AGENT_ORDER.indexOf(b.type)
  })

  const filteredAgents = sortedAgents.filter((agent) =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadgeClass = (status: Agent['status']) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-700'
      case 'paused': return 'bg-yellow-100 text-yellow-700'
      case 'stopped': return 'bg-gray-200 text-gray-600'
      case 'error': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const handleControl = (agentId: string, action: string) => {
    controlMutation.mutate({ agentId, action })
  }

  const toggleLogs = (agentId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev)
      if (newSet.has(agentId)) {
        newSet.delete(agentId)
      } else {
        newSet.add(agentId)
      }
      return newSet
    })
  }

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="h-3 w-3 text-green-500" />
      case 'warning': return <AlertCircle className="h-3 w-3 text-yellow-500" />
      case 'error': return <AlertCircle className="h-3 w-3 text-red-500" />
      default: return <Info className="h-3 w-3 text-blue-500" />
    }
  }

  const formatLogTime = (isoTime: string) => {
    const date = new Date(isoTime)
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatMetricValue = (value: string | number | string[]): string => {
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'number') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
      if (value < 1 && value > 0) return `${(value * 100).toFixed(1)}%`
      return value.toLocaleString()
    }
    return String(value)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Agent Pipeline</h1>
            <p className="text-muted-foreground">
              End-to-end data processing workflow
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Add Agent
          </button>
        </div>

        {/* Pipeline Overview */}
        <div className="rounded-lg border bg-card p-4">
          <h3 className="font-semibold mb-3">Pipeline Flow</h3>
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
            {AGENT_ORDER.map((type, index) => {
              const agent = agents.find(a => a.type === type)
              const Icon = getAgentIcon(type)
              return (
                <div key={type} className="flex items-center">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${agent?.status === 'running' ? getAgentColor(type) + ' text-white' : 'bg-gray-100'}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium capitalize whitespace-nowrap">{type}</span>
                    {agent && (
                      <span className="text-xs opacity-75">{agent.progress}%</span>
                    )}
                  </div>
                  {index < AGENT_ORDER.length - 1 && (
                    <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
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
            <p className="text-sm text-muted-foreground">Pipeline Agents</p>
            <p className="text-2xl font-bold">{agents.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Running</p>
            <p className="text-2xl font-bold text-green-500">
              {agents.filter((a) => a.status === 'running').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Records Processed</p>
            <p className="text-2xl font-bold">
              {formatMetricValue(agents.find(a => a.type === 'analyzer')?.records_processed || 0)}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Reports Generated</p>
            <p className="text-2xl font-bold">
              {agents.find(a => a.type === 'reporter')?.reports_generated || 0}
            </p>
          </div>
        </div>

        {/* Agents List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Loading agents...
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="p-8 text-center">
              <Cpu className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No agents found</p>
            </div>
          ) : (
            filteredAgents.map((agent) => {
              const Icon = getAgentIcon(agent.type)
              return (
                <div key={agent.id} className={`rounded-lg border bg-card p-6 border-l-4 ${getAgentBorderColor(agent.type)}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getAgentColor(agent.type)} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{agent.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeClass(agent.status)}`}>
                            {agent.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{agent.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">Schedule: {agent.schedule}</p>
                      </div>
                    </div>
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
                          <Pause className="h-4 w-4" />
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
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${getAgentColor(agent.type)}`}
                          style={{ width: `${agent.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-10 text-right">
                        {agent.progress || 0}%
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  {agent.metrics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      {Object.entries(agent.metrics).slice(0, 4).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-muted-foreground capitalize">
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p className="font-semibold">{formatMetricValue(value)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tab Buttons */}
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleLogs(agent.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                          expandedLogs.has(agent.id)
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Terminal className="h-4 w-4" />
                        <span>Logs</span>
                        {agent.status === 'running' && (
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                        )}
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Config</span>
                      </button>
                      <button
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                      >
                        <Info className="h-4 w-4" />
                        <span>History</span>
                      </button>
                    </div>
                    
                    {expandedLogs.has(agent.id) && (
                      <div className="mt-3 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                          <span className="text-xs text-gray-400 font-medium">RUNTIME OUTPUT</span>
                          <div className="flex items-center gap-2">
                            {agent.status === 'running' && (
                              <span className="text-xs text-green-400 flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                Live
                              </span>
                            )}
                            <span className="text-xs text-gray-500">{agent.logs?.length || 0} entries</span>
                          </div>
                        </div>
                        <div className="p-3 font-mono text-xs max-h-64 overflow-y-auto">
                          {agent.logs && agent.logs.length > 0 ? (
                            agent.logs.map((log, idx) => (
                              <div key={idx} className="flex items-start gap-3 py-1.5 border-b border-gray-800 last:border-0 hover:bg-gray-800/50">
                                <span className="text-gray-500 whitespace-nowrap font-medium">{formatLogTime(log.time)}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  log.level === 'error' ? 'bg-red-900/50 text-red-400' :
                                  log.level === 'warning' ? 'bg-yellow-900/50 text-yellow-400' :
                                  log.level === 'success' ? 'bg-green-900/50 text-green-400' :
                                  'bg-blue-900/50 text-blue-400'
                                }`}>
                                  {log.level}
                                </span>
                                <span className={`flex-1 ${
                                  log.level === 'error' ? 'text-red-400' :
                                  log.level === 'warning' ? 'text-yellow-400' :
                                  log.level === 'success' ? 'text-green-400' :
                                  'text-gray-300'
                                }`}>
                                  {log.message}
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-500 italic py-4 text-center">No recent logs</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
