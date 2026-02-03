'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { FileText, Download, Calendar, Filter, Search } from 'lucide-react'

interface Report {
  id: string
  title: string
  type: string
  createdAt: string
  size: string
  status: 'completed' | 'processing' | 'failed'
}

const mockReports: Report[] = [
  {
    id: '1',
    title: 'Q4 2025 Fiscal Analysis',
    type: 'Quarterly Report',
    createdAt: '2025-12-31',
    size: '2.4 MB',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Employment Trends Report',
    type: 'Monthly Report',
    createdAt: '2026-01-15',
    size: '1.8 MB',
    status: 'completed',
  },
  {
    id: '3',
    title: 'GDP Growth Analysis',
    type: 'Annual Report',
    createdAt: '2026-01-20',
    size: '4.2 MB',
    status: 'processing',
  },
]

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredReports = mockReports.filter((report) =>
    report.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-600/10'
      case 'processing':
        return 'text-yellow-600 bg-yellow-600/10'
      case 'failed':
        return 'text-destructive bg-destructive/10'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and download fiscal policy reports
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90">
            <FileText className="h-4 w-4" />
            Generate Report
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
            />
          </div>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-accent">
            <Calendar className="h-4 w-4" />
            Date Range
          </button>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-accent">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Reports</p>
            <p className="text-2xl font-bold">{mockReports.length}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {mockReports.filter((r) => r.status === 'completed').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">Processing</p>
            <p className="text-2xl font-bold text-yellow-600">
              {mockReports.filter((r) => r.status === 'processing').length}
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold">
              {mockReports.filter((r) => r.createdAt.startsWith('2026-01')).length}
            </p>
          </div>
        </div>

        {/* Reports List */}
        <div className="rounded-lg border bg-card">
          <div className="divide-y">
            {filteredReports.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reports found</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{report.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground">{report.type}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{report.createdAt}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{report.size}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    {report.status === 'completed' && (
                      <button className="ml-4 flex items-center gap-2 px-4 py-2 text-sm border rounded-lg hover:bg-accent">
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
