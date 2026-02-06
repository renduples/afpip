'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Database, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface DataSource {
  id: string
  name: string
  type: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
  recordCount: number
}

export default function DataSourcesPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

  const { data: dataSourcesData, isLoading } = useQuery<DataSource[]>({
    queryKey: ['data-sources'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/data-sources`)
      if (!response.ok) throw new Error('Failed to fetch data sources')
      const json = await response.json()
      // Backend returns {data: [...], pagination: {...}}, extract the array
      const data = json.data || json
      return Array.isArray(data) ? data : []
    },
  })

  // Ensure dataSources is always an array
  const dataSources = Array.isArray(dataSourcesData) ? dataSourcesData : []

  const filteredSources = dataSources.filter((source) =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusIcon = (status: DataSource['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-gray-400" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
            <p className="text-muted-foreground">
              Manage and monitor your data source connections
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
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
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-accent">
            <RefreshCw className="h-4 w-4" />
            Refresh All
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
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
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold">
              {dataSources.reduce((sum, s) => sum + (s.recordCount || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Data Sources List */}
        <div className="rounded-lg border bg-card">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading data sources...</div>
          ) : filteredSources.length === 0 ? (
            <div className="p-8 text-center">
              <Database className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No data sources found</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredSources.map((source) => (
                <div key={source.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(source.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold">{source.name}</h3>
                        <p className="text-sm text-muted-foreground">{source.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{(source.recordCount || 0).toLocaleString()} records</p>
                        <p className="text-xs text-muted-foreground">Last sync: {source.lastSync || 'Never'}</p>
                      </div>
                    </div>
                    <button className="ml-4 px-3 py-1 text-sm border rounded-lg hover:bg-accent">
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
