'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Bot, Brain, Code, Database, Zap, Shield, DollarSign, AlertCircle } from 'lucide-react'

export default function AIAssistantPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Platform Assistant</h1>
          <p className="text-muted-foreground">
            Context-aware AI assistance with role-based agents and multi-provider LLM support
          </p>
        </div>

        {/* Overview */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Bot className="h-8 w-8 text-primary mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-3">Overview</h2>
              <p className="text-muted-foreground mb-4">
                The AI Platform Assistant is an intelligent chatbot integrated throughout the AFPI platform. 
                It provides context-aware assistance tailored to your current workflow, whether you're analyzing 
                data, configuring agents, or exploring documentation.
              </p>
              <p className="text-muted-foreground">
                Access the assistant by clicking the floating bot icon in the bottom-right corner of any page.
              </p>
            </div>
          </div>
        </div>

        {/* Agent Roles */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Agent Roles
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Researcher Agent</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Specializes in information discovery, summarization, and analysis.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Summarize economic reports and policy documents</li>
                <li>Compare data across multiple sources</li>
                <li>Identify trends and patterns in fiscal data</li>
                <li>Research topics using platform data sources</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-1">Developer Agent</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Assists with technical tasks, code generation, and troubleshooting.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Generate API integration code</li>
                <li>Debug data pipeline issues</li>
                <li>Explain technical architecture</li>
                <li>Provide code examples for common tasks</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-1">Data Analyst Agent</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Focuses on data analysis, visualization, and statistical insights.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Analyze fiscal policy trends</li>
                <li>Suggest visualization strategies</li>
                <li>Perform statistical analysis on datasets</li>
                <li>Generate insights from BigQuery data</li>
              </ul>
            </div>
          </div>
        </div>

        {/* LLM Providers */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Supported LLM Providers
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">X.AI (Grok)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Fast, efficient model with real-time knowledge and strong reasoning capabilities.
              </p>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono">grok-3</span> • ~$5 per 1M tokens
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">OpenAI (GPT-4)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Industry-leading model with advanced reasoning and broad knowledge base.
              </p>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono">gpt-4-turbo</span> • ~$10 per 1M tokens
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Anthropic (Claude)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Excels at analysis, coding, and long-form content with strong safety features.
              </p>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono">claude-3-5-sonnet</span> • ~$3 per 1M tokens
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-semibold mb-2">Google (Gemini)</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Multimodal capabilities with strong integration into Google Cloud ecosystem.
              </p>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono">gemini-pro</span> • ~$0.50 per 1M tokens
              </div>
            </div>
          </div>
        </div>

        {/* Configuration */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Code className="h-6 w-6 text-primary" />
            Configuration
          </h2>
          <p className="text-muted-foreground mb-4">
            Configure your AI Assistant in the Settings page under the "AI Agent" tab:
          </p>
          <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
            <li>Navigate to <span className="font-semibold text-foreground">Settings → AI Agent</span></li>
            <li>Select your preferred LLM provider (X.AI, OpenAI, Anthropic, or Google)</li>
            <li>Enter your API key for the selected provider</li>
            <li>Choose a default agent role or switch roles per conversation</li>
            <li>Click "Save Changes" to apply configuration</li>
          </ol>
          <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">API Key Security</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Currently, API keys are stored in browser localStorage for development. 
                  In production, they should be stored securely on the backend with encryption.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Common Use Cases
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">📊 Data Analysis</h3>
              <p className="text-sm text-muted-foreground mb-2">
                "Analyze the fiscal policy trends from the last 5 years and identify key patterns"
              </p>
              <p className="text-xs text-muted-foreground italic">
                Recommended: Data Analyst Agent with Gemini or GPT-4
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">🔍 Research</h3>
              <p className="text-sm text-muted-foreground mb-2">
                "Summarize the latest economic reports on inflation and employment"
              </p>
              <p className="text-xs text-muted-foreground italic">
                Recommended: Researcher Agent with Grok or Claude
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">💻 Development</h3>
              <p className="text-sm text-muted-foreground mb-2">
                "Generate Python code to fetch data from the Treasury API and store it in BigQuery"
              </p>
              <p className="text-xs text-muted-foreground italic">
                Recommended: Developer Agent with GPT-4 or Claude
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📈 Visualization</h3>
              <p className="text-sm text-muted-foreground mb-2">
                "Suggest the best chart type for visualizing GDP growth across multiple countries"
              </p>
              <p className="text-xs text-muted-foreground italic">
                Recommended: Data Analyst Agent with GPT-4 or Gemini
              </p>
            </div>
          </div>
        </div>

        {/* Security & Privacy */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Security & Privacy
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>All conversations are processed in real-time and not stored on the platform</li>
            <li>Context includes only publicly available platform information (no PII)</li>
            <li>API keys are required for external LLM providers</li>
            <li>Consider data sensitivity when sharing information with AI models</li>
            <li>Use role-based access control to limit which users can configure AI settings</li>
          </ul>
        </div>

        {/* Cost Management */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Cost Management
          </h2>
          <p className="text-sm text-muted-foreground mb-3">
            Estimated costs per 1,000 conversations (assuming ~1,500 tokens/conversation):
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="font-mono text-sm">X.AI (Grok)</div>
              <div className="text-2xl font-bold text-primary">~$7.50</div>
              <div className="text-xs text-muted-foreground">per 1,000 conversations</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="font-mono text-sm">OpenAI (GPT-4)</div>
              <div className="text-2xl font-bold text-primary">~$15.00</div>
              <div className="text-xs text-muted-foreground">per 1,000 conversations</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="font-mono text-sm">Anthropic (Claude)</div>
              <div className="text-2xl font-bold text-primary">~$4.50</div>
              <div className="text-xs text-muted-foreground">per 1,000 conversations</div>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <div className="font-mono text-sm">Google (Gemini)</div>
              <div className="text-2xl font-bold text-primary">~$0.75</div>
              <div className="text-xs text-muted-foreground">per 1,000 conversations</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 italic">
            Note: Actual costs may vary based on conversation length and model pricing changes.
          </p>
        </div>

        {/* Technical Details */}
        <div className="rounded-lg border bg-muted/50 p-6">
          <h3 className="font-semibold mb-2">Technical Implementation</h3>
          <p className="text-sm text-muted-foreground mb-3">
            The AI Assistant is built using:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>React Context API for global state management (AgentContext)</li>
            <li>Role-based system prompts with platform-specific context</li>
            <li>Direct API integration with 4 major LLM providers</li>
            <li>Real-time streaming responses (where supported)</li>
            <li>Conversation history maintained client-side during session</li>
          </ul>
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            For detailed technical documentation, see: <code className="px-1.5 py-0.5 rounded bg-muted">AI_AGENT.md</code>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
