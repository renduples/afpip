'use client'

import { ArrowRight, Server, Database, Cloud, Lock, BarChart, Zap } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function ArchitecturePage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tech Stack Architecture</h1>
        <p className="text-muted-foreground mt-2">
          Visual overview of the Agentic Fiscal Policy Intelligence Platform architecture
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="rounded-lg border bg-card p-8">
        <h2 className="text-xl font-semibold mb-6">System Architecture</h2>
        
        {/* Frontend Layer */}
        <div className="mb-8">
          <div className="inline-block bg-blue-500/10 border-2 border-blue-500 rounded-lg px-6 py-4 mb-4">
            <div className="flex items-center gap-3">
              <BarChart className="h-6 w-6 text-blue-500" />
              <div>
                <h3 className="font-bold text-lg">Frontend Layer</h3>
                <p className="text-sm text-muted-foreground">Next.js 14 • React • TypeScript</p>
              </div>
            </div>
          </div>
          <div className="ml-8 grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">UI Components</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Shadcn/ui</li>
                <li>• Tailwind CSS</li>
                <li>• Lucide Icons</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">State Management</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• React Query</li>
                <li>• React Hooks</li>
                <li>• Context API</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Visualization</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• D3.js</li>
                <li>• Recharts</li>
                <li>• Apache ECharts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <ArrowRight className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Backend Layer */}
        <div className="mb-8">
          <div className="inline-block bg-green-500/10 border-2 border-green-500 rounded-lg px-6 py-4 mb-4">
            <div className="flex items-center gap-3">
              <Server className="h-6 w-6 text-green-500" />
              <div>
                <h3 className="font-bold text-lg">Backend Layer</h3>
                <p className="text-sm text-muted-foreground">FastAPI • Python 3.11 • Uvicorn</p>
              </div>
            </div>
          </div>
          <div className="ml-8 grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">API Gateway</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• REST API</li>
                <li>• OpenAPI/Swagger</li>
                <li>• CORS & Auth</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Services</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Data Processing</li>
                <li>• LLM Integration</li>
                <li>• Analytics Engine</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Monitoring</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Sentry</li>
                <li>• Prometheus</li>
                <li>• Structured Logs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <ArrowRight className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* Data Layer */}
        <div className="mb-8">
          <div className="inline-block bg-purple-500/10 border-2 border-purple-500 rounded-lg px-6 py-4 mb-4">
            <div className="flex items-center gap-3">
              <Database className="h-6 w-6 text-purple-500" />
              <div>
                <h3 className="font-bold text-lg">Data Layer</h3>
                <p className="text-sm text-muted-foreground">Multi-Database Architecture</p>
              </div>
            </div>
          </div>
          <div className="ml-8 grid grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">MariaDB</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Local Dev</li>
                <li>• Relational Data</li>
                <li>• SQLAlchemy ORM</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Cloud SQL</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Production</li>
                <li>• MySQL 8.0</li>
                <li>• Auto Backups</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">BigQuery</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Analytics</li>
                <li>• Big Data</li>
                <li>• Data Warehouse</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Cloud Storage</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Object Storage</li>
                <li>• Documents</li>
                <li>• Model Artifacts</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <ArrowRight className="h-8 w-8 text-muted-foreground" />
        </div>

        {/* GCP Services */}
        <div>
          <div className="inline-block bg-orange-500/10 border-2 border-orange-500 rounded-lg px-6 py-4 mb-4">
            <div className="flex items-center gap-3">
              <Cloud className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-bold text-lg">GCP Services</h3>
                <p className="text-sm text-muted-foreground">Google Cloud Platform Integration</p>
              </div>
            </div>
          </div>
          <div className="ml-8 grid grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Compute</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• GKE (Kubernetes)</li>
                <li>• Cloud Run</li>
                <li>• Cloud Functions</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">AI/ML</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Vertex AI</li>
                <li>• PaLM 2 / Gemini</li>
                <li>• AutoML</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold text-sm mb-2">Data Pipeline</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Dataflow</li>
                <li>• Pub/Sub</li>
                <li>• Cloud Composer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Security Layer */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lock className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold">Security & Compliance</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Authentication</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• OAuth 2.0</li>
              <li>• JWT Tokens</li>
              <li>• GCP IAM</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Encryption</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• TLS/HTTPS</li>
              <li>• Cloud KMS</li>
              <li>• At Rest & Transit</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Protection</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Cloud Armor</li>
              <li>• DDoS Protection</li>
              <li>• WAF Rules</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Compliance</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Audit Logs</li>
              <li>• DLP API</li>
              <li>• RBAC</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Features */}
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-semibold">Performance & Optimization</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Caching</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Redis (Memorystore)</li>
              <li>• CDN Caching</li>
              <li>• Query Caching</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Load Balancing</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Cloud Load Balancer</li>
              <li>• Auto-scaling</li>
              <li>• Health Checks</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4 bg-muted/50">
            <h4 className="font-semibold text-sm mb-2">Monitoring</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Cloud Monitoring</li>
              <li>• Cloud Trace</li>
              <li>• Error Reporting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technology Stack Summary */}
      <div className="rounded-lg border bg-muted p-6">
        <h2 className="text-xl font-semibold mb-4">Technology Stack Summary</h2>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2">Frontend</h3>
            <p className="text-muted-foreground font-mono text-xs">
              Next.js 14 • React 18 • TypeScript • Tailwind CSS • Shadcn/ui
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Backend</h3>
            <p className="text-muted-foreground font-mono text-xs">
              FastAPI • Python 3.11 • SQLAlchemy • Pydantic • Uvicorn
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Database</h3>
            <p className="text-muted-foreground font-mono text-xs">
              MariaDB • Cloud SQL • BigQuery • Cloud Storage
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Infrastructure</h3>
            <p className="text-muted-foreground font-mono text-xs">
              GKE • Cloud Run • Terraform • Docker • Kubernetes
            </p>
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  )
}
