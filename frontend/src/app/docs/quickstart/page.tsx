'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { BookOpen, ExternalLink } from 'lucide-react'
import { DocumentEditor } from '@/components/ui/document-editor'

export default function QuickStartPage() {
  const [docContent, setDocContent] = useState(`# Quick Start Guide

Welcome to the Agentic Fiscal Policy Intelligence Platform (AFPI). Follow these steps to get started quickly:

1. Clone the repository
2. Set up environment variables (copy .env.example to .env)
3. Install dependencies (npm install for frontend, pip install for backend)
4. Start local services (./scripts/start.sh)
5. Access the dashboard at http://localhost:3000`)

  const handleSave = (content: string) => {
    setDocContent(content)
    // In a real implementation, save to backend API
    console.log('Saving content:', content)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quick Start Guide</h1>
          <p className="text-muted-foreground">
            Get up and running with AFPI in minutes
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <BookOpen className="h-6 w-6 text-primary mt-1" />
            <div className="flex-1">
              <p className="text-muted-foreground mb-4">
                For detailed setup instructions, please refer to the quickstart documentation file.
              </p>
              <a
                href="https://github.com/yourusername/afpi/blob/main/docs/QUICKSTART.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                View QUICKSTART.md
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Documentation</h2>
          <DocumentEditor initialContent={docContent} onSave={handleSave} />
        </div>

        <div className="rounded-lg border bg-muted/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Steps</h2>
          <ol className="space-y-3 list-decimal list-inside text-muted-foreground">
            <li>Clone the repository</li>
            <li>Set up environment variables (copy .env.example to .env)</li>
            <li>Install dependencies (npm install for frontend, pip install for backend)</li>
            <li>Start local services (./scripts/start.sh)</li>
            <li>Access the dashboard at http://localhost:3000</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  )
}
