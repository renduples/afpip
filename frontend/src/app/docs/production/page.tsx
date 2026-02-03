'use client'

import { CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

export default function ProductionReadinessPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production Readiness</h1>
        <p className="text-muted-foreground mt-2">
          Current status and checklist for production deployment
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Development</h3>
          </div>
          <p className="text-2xl font-bold">100%</p>
          <p className="text-sm text-muted-foreground">Fully Operational</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold">Production</h3>
          </div>
          <p className="text-2xl font-bold">75%</p>
          <p className="text-sm text-muted-foreground">Ready to Deploy</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2 mb-2">
            <Circle className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-semibold">GCP Setup</h3>
          </div>
          <p className="text-2xl font-bold">0%</p>
          <p className="text-sm text-muted-foreground">Pending Config</p>
        </div>
      </div>

      {/* Completed Features */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-green-500" />
          Completed Components
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Core Application</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Frontend Dashboard (Next.js 14)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Backend API (FastAPI)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Database Integration (MariaDB)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                API Documentation (Swagger)
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Production Features</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Error Tracking (Sentry)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Metrics (Prometheus)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Health Checks
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Structured Logging
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Infrastructure</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Kubernetes Manifests
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Terraform Scripts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Nginx Configuration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Docker Support
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Automation</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Build Scripts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Deploy Scripts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Health Check Scripts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Database Migrations
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
          Pending Configuration
        </h2>
        <div className="space-y-4">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-sm mb-2">GCP Project Setup</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Create GCP project and enable APIs</li>
              <li>• Set up Cloud SQL instance</li>
              <li>• Configure Secret Manager</li>
              <li>• Create GKE cluster or Cloud Run service</li>
            </ul>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-sm mb-2">Environment Variables</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Configure production .env file</li>
              <li>• Set up Sentry DSN</li>
              <li>• Generate secret keys</li>
              <li>• Configure database connection strings</li>
            </ul>
          </div>
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-sm mb-2">Security</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• SSL certificates for HTTPS</li>
              <li>• JWT authentication implementation</li>
              <li>• API key rotation strategy</li>
              <li>• RBAC configuration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Running Services */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Current Development Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-semibold text-sm">Frontend</p>
                <p className="text-xs text-muted-foreground">http://localhost:3000</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-background px-2 py-1 rounded">RUNNING</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-semibold text-sm">Backend API</p>
                <p className="text-xs text-muted-foreground">http://localhost:8000</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-background px-2 py-1 rounded">RUNNING</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <div>
                <p className="font-semibold text-sm">Database</p>
                <p className="text-xs text-muted-foreground">MariaDB localhost:3306</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-background px-2 py-1 rounded">CONNECTED</span>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="rounded-lg border bg-muted p-6">
        <h2 className="text-xl font-semibold mb-4">Documentation</h2>
        <p className="text-sm text-muted-foreground mb-4">
          For detailed deployment instructions, see the following files in the repository:
        </p>
        <ul className="space-y-2 text-sm">
          <li>
            <code className="bg-background px-2 py-1 rounded text-xs">PRODUCTION_READINESS.md</code>
            <span className="text-muted-foreground ml-2">- Complete production checklist and setup guide</span>
          </li>
          <li>
            <code className="bg-background px-2 py-1 rounded text-xs">PRODUCTION.md</code>
            <span className="text-muted-foreground ml-2">- Production deployment documentation</span>
          </li>
          <li>
            <code className="bg-background px-2 py-1 rounded text-xs">scripts/build-production.sh</code>
            <span className="text-muted-foreground ml-2">- Production build automation</span>
          </li>
          <li>
            <code className="bg-background px-2 py-1 rounded text-xs">scripts/deploy-production.sh</code>
            <span className="text-muted-foreground ml-2">- GCP deployment script</span>
          </li>
        </ul>
      </div>
      </div>
    </DashboardLayout>
  )
}
