'use client'

import Link from 'next/link'
import { FileText, Workflow, Rocket, Book, Shield, Database, Bot, TrendingUp, PlayCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

const docCategories = [
  {
    title: 'Getting Started',
    icon: PlayCircle,
    description: 'Quick setup and initial configuration',
    links: [
      { name: 'Quick Start Guide', href: '/docs/quickstart' },
      { name: 'Local Development Setup', href: '/docs/local-dev' },
      { name: 'Environment Configuration', href: '/docs/environment' },
    ]
  },
  {
    title: 'AI Assistant',
    icon: Bot,
    description: 'AI platform assistant with role-based agents',
    links: [
      { name: 'AI Assistant Overview', href: '/docs/ai-assistant' },
      { name: 'Agent Roles & Capabilities', href: '/docs/ai-assistant#agent-roles' },
      { name: 'LLM Provider Configuration', href: '/docs/ai-assistant#llm-providers' },
    ]
  },
  {
    title: 'Architecture',
    icon: Workflow,
    description: 'System architecture and scaling strategies',
    links: [
      { name: 'Tech Stack Architecture', href: '/docs/architecture' },
      { name: 'Scaling Strategy', href: '/docs/scaling' },
      { name: 'Security Architecture', href: '/docs/security' },
    ]
  },
  {
    title: 'Deployment',
    icon: Rocket,
    description: 'Production deployment and configuration',
    links: [
      { name: 'Deployment Guide', href: '/docs/deployment' },
      { name: 'Production Readiness', href: '/docs/production' },
      { name: 'GCP Cloud Run Setup', href: '/docs/gcp-setup' },
    ]
  },
  {
    title: 'API Reference',
    icon: Database,
    description: 'API endpoints and integration guides',
    links: [
      { name: 'REST API Documentation', href: 'http://localhost:8000/api/v1/docs', external: true },
      { name: 'Authentication', href: '/docs/auth' },
      { name: 'Webhooks', href: '/docs/webhooks' },
    ]
  },
  {
    title: 'User Guides',
    icon: Book,
    description: 'How-to guides and tutorials',
    links: [
      { name: 'Authentication System', href: '/docs/authentication' },
      { name: 'Data Source Management', href: '/docs/data-sources-guide' },
      { name: 'Agent Configuration', href: '/docs/agents-guide' },
    ]
  },
]

export default function DocsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Documentation</h1>
        <p className="text-muted-foreground">
          Complete documentation for the Agentic Fiscal Policy Intelligence Platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {docCategories.map((category) => (
          <div
            key={category.title}
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
          >
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <category.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>
                <ul className="space-y-2">
                  {category.links.map((link) => (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {link.name}
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm text-primary hover:underline"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-muted/50 p-6">
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-muted-foreground mt-1" />
          <div>
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              If you can't find what you're looking for in the documentation, please contact the development team.
            </p>
            <div className="flex gap-4 text-sm">
              <span className="text-muted-foreground">Version: <span className="font-mono">1.0.0</span></span>
              <span className="text-muted-foreground">Last Updated: <span className="font-mono">Jan 30, 2026</span></span>
            </div>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}
