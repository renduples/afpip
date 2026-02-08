'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Search, Database, CheckCircle2, XCircle, AlertCircle, RefreshCw, Settings, Trash2, Play, ExternalLink, Clock, Globe, FileUp, Server, X, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface DataSource {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error' | 'syncing'
  lastSync: string
  recordCount: number
  url?: string
  schedule?: string
  description?: string
}

const SOURCE_TYPES = [
  { id: 'api', name: 'REST API', icon: Globe, description: 'Connect to external APIs' },
  { id: 'file', name: 'File Upload', icon: FileUp, description: 'CSV, JSON, Excel files' },
  { id: 'database', name: 'Database', icon: Server, description: 'SQL, MongoDB, BigQuery' },
  { id: 'scraper', name: 'Web Scraper', icon: ExternalLink, description: 'Automated web extraction' },
]

export default function DataSourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showConfigModal, setShowConfigModal] = useState<DataSource | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    schedule: '0 */6 * * *', // Every 6 hours
    description: '',
  })
  const queryClient = useQueryClient()

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

  const { data: dataSourcesData, isLoading, refetch } = useQuery<DataSource[]>({
    queryKey: ['data-sources'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/data-sources`)
      if (!response.ok) throw new Error('Failed to fetch data sources')
      const json = await response.json()
      const data = json.data || json
      return Array.isArray(data) ? data : []
    },
    refetchInterval: 10000,
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData & { type: string }) => {
      const response = await fetch(`${API_URL}/api/v1/data-sources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-sources'] })
      setShowAddModal(false)
      setSelectedType(null)
      setFormData({ name: '', url: '', schedule: '0 */6 * * *', description: '' })
    },
  })

  const syncMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      const response = await fetch(`${API_URL}/api/v1/data-sources/${sourceId}/sync`, {
        method: 'POST',
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-sources'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (sourceId: string) => {
      const response = await fetch(`${API_URL}/api/v1/data-sources/${sourceId}`, {
        method: 'DELETE',
      })
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data-sources'] })
    },
  })

  const dataSources = Array.isArray(dataSourcesData) ? dataSourcesData : []

  const filteredSources = dataSources.filter((source) =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    source.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'syncing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-gray-400" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Database className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: DataSource['status']) => {
    const styles = {
      connected: 'bg-green-100 text-green-700',
      syncing: 'bg-blue-100 text-blue-700',
      disconnected: 'bg-gray-100 text-gray-600',
      error: 'bg-red-100 text-red-700',
    }
    return styles[status] || styles.disconnected
  }

  const getTypeIcon = (type: string) => {
    const found = SOURCE_TYPES.find(t => t.id === type)
    return found?.icon || Database
  }

  const handleCreate = () => {
    if (!selectedType || !formData.name) return
    createMutation.mutate({ ...formData, type: selectedType })
  }

  const handleRefreshAll = async () => {
    for (const source of dataSources) {
      if (source.status !== 'syncing') {
        syncMutation.mutate(source.id)
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
            <p className="text-muted-foreground">
              Connect and manage your financial data sources
            </p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Data Source
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search data sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <button 
            onClick={handleRefreshAll}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-accent transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            Sync All
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Sources</p>
            <p className="text-2xl font-bold">{dataSources.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Connected</p>
            <p className="text-2xl font-bold text-green-500">
              {dataSources.filter((s) => s.status === 'connected').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Syncing</p>
            <p className="text-2xl font-bold text-blue-500">
              {dataSources.filter((s) => s.status === 'syncing').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold">
              {dataSources.reduce((sum, s) => sum + (s.recordCount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Data Sources List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <Loader2 className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-4" />
              <p className="text-muted-foreground">Loading data sources...</p>
            </div>
          ) : filteredSources.length === 0 ? (
            <div className="rounded-lg border bg-card p-8 text-center">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No data sources found</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add Your First Data Source
              </button>
            </div>
          ) : (
            filteredSources.map((source) => {
              const TypeIcon = getTypeIcon(source.type)
              return (
                <div key={source.id} className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        source.status === 'connected' ? 'bg-green-100' :
                        source.status === 'syncing' ? 'bg-blue-100' :
                        source.status === 'error' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        <TypeIcon className={`h-6 w-6 ${
                          source.status === 'connected' ? 'text-green-600' :
                          source.status === 'syncing' ? 'text-blue-600' :
                          source.status === 'error' ? 'text-red-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{source.name}</h3>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(source.status)}`}>
                            {source.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">{source.type}</p>
                        {source.description && (
                          <p className="text-sm text-muted-foreground mt-1">{source.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Last sync: {source.lastSync || 'Never'}
                          </span>
                          {source.schedule && (
                            <span className="flex items-center gap-1">
                              <RefreshCw className="h-3 w-3" />
                              Schedule: {source.schedule}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{(source.recordCount || 0).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">records</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => syncMutation.mutate(source.id)}
                          disabled={source.status === 'syncing'}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                          title="Sync now"
                        >
                          <Play className={`h-4 w-4 ${source.status === 'syncing' ? 'animate-spin' : ''}`} />
                          Sync
                        </button>
                        <button
                          onClick={() => setShowConfigModal(source)}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-accent transition-colors"
                          title="Configure"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this data source?')) {
                              deleteMutation.mutate(source.id)
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Add Data Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Add Data Source</h2>
              <button 
                onClick={() => { setShowAddModal(false); setSelectedType(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {!selectedType ? (
              <div className="p-6">
                <p className="text-muted-foreground mb-4">Select a data source type:</p>
                <div className="grid grid-cols-2 gap-4">
                  {SOURCE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                    >
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <type.icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{type.name}</h3>
                        <p className="text-sm text-muted-foreground">{type.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <button
                  onClick={() => setSelectedType(null)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  ← Back to type selection
                </button>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Federal Reserve Economic Data"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>

                {selectedType === 'api' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">API URL</label>
                    <input
                      type="text"
                      value={formData.url}
                      onChange={(e) => setFormData(p => ({ ...p, url: e.target.value }))}
                      placeholder="https://api.example.com/data"
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                    placeholder="Brief description of this data source"
                    className="w-full px-3 py-2 border rounded-lg resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Sync Schedule</label>
                  <select
                    value={formData.schedule}
                    onChange={(e) => setFormData(p => ({ ...p, schedule: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg bg-white"
                  >
                    <option value="0 * * * *">Every hour</option>
                    <option value="0 */6 * * *">Every 6 hours</option>
                    <option value="0 0 * * *">Daily at midnight</option>
                    <option value="0 0 * * 0">Weekly (Sundays)</option>
                    <option value="manual">Manual only</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    onClick={() => { setShowAddModal(false); setSelectedType(null); }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={!formData.name || createMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                  >
                    {createMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Create Data Source
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Configure Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Configure: {showConfigModal.name}</h2>
              <button 
                onClick={() => setShowConfigModal(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{showConfigModal.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-medium capitalize">{showConfigModal.status}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Records</p>
                    <p className="font-medium">{(showConfigModal.recordCount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Sync</p>
                    <p className="font-medium">{showConfigModal.lastSync || 'Never'}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                <p>Full configuration editing requires database persistence (Cloud SQL setup).</p>
                <p className="mt-1">Currently using mock data for demonstration.</p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowConfigModal(null)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
