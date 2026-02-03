'use client'

import { useState, useRef, useEffect } from 'react'
import { X, Send, Loader2, User, Bot, Settings as SettingsIcon, AlertCircle } from 'lucide-react'
import { useAgent, AgentRole } from '@/contexts/agent-context'
import { useAuth } from '@/contexts/auth-context'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const ROLE_CONFIGS = {
  researcher: {
    name: 'Project Assistant',
    icon: '🤖',
    description: 'Full site-wide access to all project files and resources',
    systemPrompt: `You are the AI Project Assistant for the Agentic Fiscal Policy Intelligence Platform (AFPI).

You have FULL SITE-WIDE ACCESS to:
- All project files and codebase (frontend and backend)
- All data sources, datasets, and analytics
- Economic indicators, fiscal policy data, and research documents
- Platform architecture and infrastructure
- GCP resources and deployment configurations
- User data and system configurations

Your capabilities include:
- Answering questions about any part of the platform
- Analyzing data and generating insights
- Helping with development and debugging
- Providing architectural guidance
- Assisting with research and analysis
- Managing data sources and taxonomies
- Creating reports and visualizations

Tech Stack:
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS, Shadcn/ui
- Backend: FastAPI, Python 3.11, SQLAlchemy, Pydantic
- Database: MariaDB (dev), Cloud SQL MySQL (prod), BigQuery, Cloud Storage
- Infrastructure: Cloud Run, GCP, Docker
- AI/ML: Vertex AI, Gemini

You are a comprehensive assistant with access to everything - help users with any task.`,
    allowedMenus: 'all',
  },
  developer: {
    name: 'Developer Mode',
    icon: '💻',
    description: 'Technical focus on code, architecture, and infrastructure',
    systemPrompt: `You are the AI Developer Assistant for the Agentic Fiscal Policy Intelligence Platform (AFPI).
You have full access to the platform architecture, codebase, and cloud components. You can:
- Review and improve the architecture
- Suggest code improvements
- Help with GCP integrations
- Debug issues
- Optimize performance
- Manage infrastructure

Tech Stack:
- Frontend: Next.js 14, React, TypeScript, Tailwind CSS, Shadcn/ui
- Backend: FastAPI, Python 3.11, SQLAlchemy, Pydantic
- Database: MariaDB (dev), Cloud SQL MySQL (prod), BigQuery, Cloud Storage
- Infrastructure: Cloud Run, GCP, Docker
- AI/ML: Vertex AI, Gemini
- Monitoring: Sentry, Prometheus, Cloud Monitoring

Provide technical guidance, code suggestions, and architectural recommendations.`,
    allowedMenus: 'all',
  },
  'data-analyst': {
    name: 'Data Analyst Mode',
    icon: '📊',
    description: 'Focus on analytics, reports, and data insights',
    systemPrompt: `You are the AI Data Analyst Assistant for the Agentic Fiscal Policy Intelligence Platform (AFPI).
You help analyze data, generate reports, and provide insights. You have access to:
- Analytics dashboards
- Report generation tools
- Data visualization components
- SQL queries and BigQuery
- Statistical analysis tools
- Data quality metrics

Focus on data analysis, creating visualizations, interpreting trends, and generating actionable insights from fiscal policy data.`,
    allowedMenus: ['/', '/analytics', '/reports', '/data-sources', '/docs'],
  },
}

interface AIChatModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatModal({ isOpen, onClose }: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showRoleSelector, setShowRoleSelector] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { currentRole, setCurrentRole, llmConfig } = useAgent()
  const { user } = useAuth()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !currentRole) {
      setShowRoleSelector(true)
    }
  }, [isOpen, currentRole])

  const selectRole = (role: AgentRole) => {
    setCurrentRole(role)
    setShowRoleSelector(false)
    
    // Check if API key is configured
    const hasApiKey = llmConfig.apiKeys[llmConfig.provider]
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: hasApiKey 
        ? `Hello! I'm your ${ROLE_CONFIGS[role].name} assistant. ${ROLE_CONFIGS[role].description}. How can I help you today?`
        : `Hello! I'm ready to assist you, but I need an API key to function. Please go to Settings → AI Agent and configure an API key for ${llmConfig.provider === 'xai' ? 'X.AI (Grok)' : llmConfig.provider}. I recommend X.AI for the best experience.`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])
  }

  const sendMessage = async () => {
    if (!input.trim() || !currentRole || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Call LLM API based on configured provider
      const response = await callLLMAPI(input, currentRole)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I apologize, but I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API key configuration in Settings.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const callLLMAPI = async (message: string, role: AgentRole): Promise<string> => {
    const roleConfig = ROLE_CONFIGS[role]
    const apiKey = llmConfig.apiKeys[llmConfig.provider]

    if (!apiKey) {
      throw new Error('API key not configured')
    }

    // Build context based on role and current user
    const context = buildContextForRole(role)

    // Use the backend API URL - in production this should be the custom domain
    // For now, use the Cloud Run URL directly
    const apiUrl = 'https://afpi-backend-43847292060.us-central1.run.app'

    try {
      // Call backend proxy endpoint to avoid CORS issues
      const response = await fetch(`${apiUrl}/api/v1/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: llmConfig.provider,
          api_key: apiKey,
          message: message,
          system_prompt: roleConfig.systemPrompt,
          context: context,
          model: llmConfig.defaultModel,
          role: role,  // Pass role to control GitHub access (developer = write, others = read-only)
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'API call failed')
      }

      const data = await response.json()
      return data.content
    } catch (error) {
      console.error('AI API Error:', error)
      throw error
    }
  }

  const buildContextForRole = (role: AgentRole): string => {
    const baseContext = `
Current User: ${user?.name} (${user?.role})
Platform: Agentic Fiscal Policy Intelligence Platform
Date: ${new Date().toLocaleDateString()}
`

    const roleContext = ROLE_CONFIGS[role]
    
    if (role === 'developer') {
      return baseContext + `
Available Components:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/v1/docs
- Database: MariaDB (local), Cloud SQL (production)

You have full access to make architectural improvements and code changes.
`
    }

    return baseContext + `
Accessible Menus: ${roleContext.allowedMenus}
You can help with questions about the data and features available in these sections.
`
  }

  const changeRole = () => {
    setShowRoleSelector(true)
    setMessages([])
    setCurrentRole(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl h-[600px] bg-card border rounded-lg shadow-xl flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold flex items-center gap-2">
                AI Project Assistant
                <span className="text-xs px-2 py-0.5 bg-primary/20 rounded-full">Full Access</span>
              </h2>
              {currentRole && (
                <p className="text-xs text-muted-foreground">
                  {ROLE_CONFIGS[currentRole].icon} {ROLE_CONFIGS[currentRole].name}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentRole && (
              <button
                onClick={changeRole}
                className="p-2 hover:bg-accent rounded-lg text-muted-foreground"
                title="Change role"
              >
                <SettingsIcon className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-lg text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Role Selector */}
        {showRoleSelector && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="max-w-md w-full space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">AI Project Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Select the assistant mode (recommended: Project Assistant for full access)
                </p>
              </div>

              {(Object.entries(ROLE_CONFIGS) as [AgentRole, typeof ROLE_CONFIGS[AgentRole]][]).map(
                ([key, config]) => (
                  <button
                    key={key}
                    onClick={() => selectRole(key)}
                    className="w-full p-4 border rounded-lg hover:bg-accent text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold">{config.name}</h4>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {!showRoleSelector && currentRole && (
          <>
            {/* API Key Warning Banner */}
            {!llmConfig.apiKeys[llmConfig.provider] && (
              <div className="mx-4 mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-yellow-900 dark:text-yellow-100 mb-1">
                      API Key Required
                    </h4>
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 mb-2">
                      Configure an API key to enable the AI assistant. X.AI (Grok) is recommended for best results.
                    </p>
                    <Link
                      href="/settings?tab=ai-agent"
                      onClick={() => onClose()}
                      className="inline-flex items-center gap-2 text-xs bg-yellow-600 text-white px-3 py-1.5 rounded hover:bg-yellow-700"
                    >
                      <SettingsIcon className="h-3 w-3" />
                      Configure API Keys
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="p-2 bg-primary/10 rounded-full h-fit">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="p-2 bg-primary/10 rounded-full h-fit">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="p-2 bg-primary/10 rounded-full h-fit">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
