'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search, Tags, Folder, ChevronRight } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

interface Taxonomy {
  id: string
  name: string
  description: string
  itemCount: number
  children?: Taxonomy[]
}

export default function TaxonomiesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://afpi-backend-43847292060.us-central1.run.app'

  const { data: taxonomies = [], isLoading } = useQuery<Taxonomy[]>({
    queryKey: ['taxonomies'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/api/v1/taxonomies`)
      if (!response.ok) throw new Error('Failed to fetch taxonomies')
      const json = await response.json()
      return json.data || json
    },
  })

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const TaxonomyNode = ({ taxonomy, level = 0 }: { taxonomy: Taxonomy; level?: number }) => {
    const isExpanded = expandedIds.has(taxonomy.id)
    const hasChildren = taxonomy.children && taxonomy.children.length > 0

    return (
      <div>
        <div
          className={`flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer`}
          style={{ marginLeft: `${level * 24}px` }}
          onClick={() => hasChildren && toggleExpanded(taxonomy.id)}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren ? (
              <ChevronRight
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  isExpanded ? 'rotate-90' : ''
                }`}
              />
            ) : (
              <div className="w-4" />
            )}
            <Folder className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <h3 className="font-medium">{taxonomy.name}</h3>
              <p className="text-xs text-muted-foreground">{taxonomy.description}</p>
            </div>
            <span className="text-sm text-muted-foreground">
              {taxonomy.itemCount} items
            </span>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1">
            {taxonomy.children!.map((child) => (
              <TaxonomyNode key={child.id} taxonomy={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const filteredTaxonomies = taxonomies.filter((tax) =>
    tax.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Taxonomies</h1>
            <p className="text-muted-foreground">
              Organize and categorize your fiscal policy data
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Create Taxonomy
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search taxonomies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
          />
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Taxonomies</p>
            <p className="text-2xl font-bold">{taxonomies.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Items</p>
            <p className="text-2xl font-bold">
              {taxonomies.reduce((sum, t) => sum + t.itemCount, 0).toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Avg Items per Taxonomy</p>
            <p className="text-2xl font-bold">
              {taxonomies.length > 0
                ? Math.round(
                    taxonomies.reduce((sum, t) => sum + t.itemCount, 0) / taxonomies.length
                  )
                : 0}
            </p>
          </div>
        </div>

        {/* Taxonomies Tree */}
        <div className="rounded-lg border bg-card p-4">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading taxonomies...</div>
          ) : filteredTaxonomies.length === 0 ? (
            <div className="p-8 text-center">
              <Tags className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No taxonomies found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredTaxonomies.map((taxonomy) => (
                <TaxonomyNode key={taxonomy.id} taxonomy={taxonomy} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
