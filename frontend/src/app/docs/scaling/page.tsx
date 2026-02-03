'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { TrendingUp, Server, Zap, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default function ScalingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Scaling Architecture</h1>
          <p className="text-muted-foreground">
            How AFPI scales from startup to enterprise workloads
          </p>
        </div>

        {/* Current Architecture */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Zap className="h-8 w-8 text-blue-500 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Phase 1: Cloud Run (Current)</h2>
              <p className="text-muted-foreground mb-4">
                Serverless containerized deployment with auto-scaling and pay-per-use pricing.
                Perfect for getting to market quickly with minimal operational overhead.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Frontend</div>
                  <div className="text-2xl font-bold">1-10</div>
                  <div className="text-xs text-muted-foreground">Auto-scaled instances</div>
                </div>
                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-4">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">Backend</div>
                  <div className="text-2xl font-bold">1-10</div>
                  <div className="text-xs text-muted-foreground">Auto-scaled instances</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Future Architecture */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Server className="h-8 w-8 text-purple-500 mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3">Phase 2: GKE + GPU (Future)</h2>
              <p className="text-muted-foreground mb-4">
                Hybrid architecture adding Kubernetes with GPU nodes for local LLM processing.
                Enables data-sensitive workloads and reduces API costs at scale.
              </p>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/10 p-1.5 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold">When to Migrate</div>
                    <p className="text-sm text-muted-foreground">
                      LLM API costs exceed $500/month OR data sensitivity requires on-premises processing
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/10 p-1.5 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold">GPU Options</div>
                    <p className="text-sm text-muted-foreground">
                      NVIDIA T4 ($0.35/hr), V100 ($2.48/hr), or A100 ($6/hr per GPU)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/10 p-1.5 mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-purple-500" />
                  </div>
                  <div>
                    <div className="font-semibold">Local Models</div>
                    <p className="text-sm text-muted-foreground">
                      Llama-2 (7B-70B), Mistral-7B, CodeLlama for private processing
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Comparison */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Cost Comparison
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-3">Cloud Run + APIs</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Infrastructure</span>
                  <span className="font-mono">$400/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">LLM APIs (10K calls)</span>
                  <span className="font-mono">$500/mo</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-mono text-green-600 dark:text-green-400">$900/mo</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-3">GKE + GPU</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Infrastructure</span>
                  <span className="font-mono">$833/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GPU Nodes (2x T4)</span>
                  <span className="font-mono">$780/mo</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-mono">$1,613/mo</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mt-4 italic">
            Break-even at ~24K LLM conversations/month. GKE cheaper at higher volumes.
          </p>
        </div>

        {/* Scaling Tiers */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Scaling Tiers
          </h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">Tier 1: Startup (0-1K users)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Cloud Run only • External LLM APIs • $400-900/mo • 1 hour setup
              </p>
            </div>

            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Tier 2: Growth (1K-10K users)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Cloud Run + GKE (CPU) • Mixed APIs + caching • $800-1,500/mo • 1 day setup
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-1">Tier 3: Scale (10K-100K users)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Cloud Run + GKE GPU • Local models (7B-13B) • $1,600-3,000/mo • 1 week setup
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-semibold text-orange-600 dark:text-orange-400 mb-1">Tier 4: Enterprise (100K+ users)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Full GKE cluster • Multi-region • Local 70B models • $5,000-15,000/mo • 2-4 weeks setup
              </p>
            </div>
          </div>
        </div>

        {/* Documentation Link */}
        <div className="rounded-lg border bg-muted/50 p-6">
          <h3 className="font-semibold mb-2">Detailed Documentation</h3>
          <p className="text-sm text-muted-foreground mb-3">
            For comprehensive scaling architecture including diagrams, deployment strategies, and technical specifications:
          </p>
          <code className="block bg-muted p-3 rounded text-sm mb-3">
            docs/SCALING_ARCHITECTURE.md
          </code>
          <p className="text-xs text-muted-foreground">
            Includes: Infrastructure diagrams, GPU configurations, cost analysis, roadmap, technology choices, monitoring setup, and disaster recovery procedures.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
