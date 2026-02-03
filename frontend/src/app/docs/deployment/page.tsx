'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Rocket, ExternalLink } from 'lucide-react'

export default function DeploymentPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deployment Guide</h1>
          <p className="text-muted-foreground">
            Deploy AFPI to Google Cloud Platform
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Rocket className="h-6 w-6 text-primary mt-1" />
            <div className="flex-1">
              <p className="text-muted-foreground mb-4">
                For detailed deployment procedures, please refer to the deployment documentation file.
              </p>
              <a
                href="https://github.com/yourusername/afpi/blob/main/docs/DEPLOYMENT.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                View DEPLOYMENT.md
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-6">
          <h2 className="text-xl font-semibold mb-4">Deployment Scripts</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Full Deployment</h3>
              <code className="block bg-muted p-3 rounded text-sm">
                ./scripts/deploy-gcp.sh
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Complete deployment including infrastructure setup, Docker builds, and Cloud Run services
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Quick Update</h3>
              <code className="block bg-muted p-3 rounded text-sm">
                ./scripts/deploy-quick.sh
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Fast redeployment without infrastructure changes
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Domain Mapping</h3>
              <code className="block bg-muted p-3 rounded text-sm">
                ./scripts/map-domain.sh
              </code>
              <p className="text-sm text-muted-foreground mt-2">
                Map custom domain (afpip.com) to Cloud Run services
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
