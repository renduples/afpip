'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { useAuth } from '@/contexts/auth-context'
import { useAgent, LLMProvider } from '@/contexts/agent-context'
import { Settings as SettingsIcon, User, Bell, Lock, Database, Palette, Bot, Eye, EyeOff } from 'lucide-react'

type SettingsTab = 'profile' | 'notifications' | 'security' | 'data-sources' | 'appearance' | 'ai-agent'

export default function SettingsPage() {
  const { user } = useAuth()
  const { llmConfig, updateLLMConfig, setApiKey } = useAgent()
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [showApiKeys, setShowApiKeys] = useState<{ [key: string]: boolean }>({})
  const [testingConnection, setTestingConnection] = useState<{ [key: string]: boolean }>({})
  const [connectionStatus, setConnectionStatus] = useState<{ [key: string]: 'success' | 'error' | null }>({})
  const [tempApiKeys, setTempApiKeys] = useState({
    xai: llmConfig.apiKeys.xai || '',
    openai: llmConfig.apiKeys.openai || '',
    anthropic: llmConfig.apiKeys.anthropic || '',
    google: llmConfig.apiKeys.google || '',
  })

  const handleSaveApiKey = (provider: LLMProvider) => {
    if (tempApiKeys[provider]) {
      setApiKey(provider, tempApiKeys[provider])
      setConnectionStatus({ ...connectionStatus, [provider]: null })
    }
  }

  const testConnection = async (provider: LLMProvider) => {
    const apiKey = tempApiKeys[provider] || llmConfig.apiKeys[provider]
    if (!apiKey) return

    setTestingConnection({ ...testingConnection, [provider]: true })
    setConnectionStatus({ ...connectionStatus, [provider]: null })

    try {
      let response
      switch (provider) {
        case 'xai':
          response = await fetch('https://api.x.ai/v1/models', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          })
          break
        case 'openai':
          response = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          })
          break
        case 'anthropic':
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              model: 'claude-3-sonnet-20240229',
              max_tokens: 1,
              messages: [{ role: 'user', content: 'test' }]
            })
          })
          break
        case 'google':
          response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`)
          break
      }

      if (response && response.ok) {
        setConnectionStatus({ ...connectionStatus, [provider]: 'success' })
      } else {
        setConnectionStatus({ ...connectionStatus, [provider]: 'error' })
      }
    } catch (error) {
      setConnectionStatus({ ...connectionStatus, [provider]: 'error' })
    } finally {
      setTestingConnection({ ...testingConnection, [provider]: false })
    }
  }

  const toggleShowApiKey = (provider: string) => {
    setShowApiKeys(prev => ({ ...prev, [provider]: !prev[provider] }))
  }

  const providers = [
    { id: 'xai' as LLMProvider, name: 'X.AI (Grok)', model: 'grok-3' },
    { id: 'openai' as LLMProvider, name: 'OpenAI', model: 'gpt-4' },
    { id: 'anthropic' as LLMProvider, name: 'Anthropic (Claude)', model: 'claude-3-sonnet' },
    { id: 'google' as LLMProvider, name: 'Google (Gemini)', model: 'gemini-pro' },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card p-4 space-y-1">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  activeTab === 'profile'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <User className="h-4 w-4" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('ai-agent')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  activeTab === 'ai-agent'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Bot className="h-4 w-4" />
                AI Agent
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Bell className="h-4 w-4" />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  activeTab === 'security'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Lock className="h-4 w-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('data-sources')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  activeTab === 'data-sources'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Database className="h-4 w-4" />
                Data Sources
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${
                  activeTab === 'appearance'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <Palette className="h-4 w-4" />
                Appearance
              </button>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user?.name || ''}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      value={user?.role.toUpperCase() || ''}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-muted/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">User ID</label>
                    <input
                      type="text"
                      value={user?.id || ''}
                      readOnly
                      className="w-full px-3 py-2 border rounded-lg bg-muted/50 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Email notifications</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Desktop notifications</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Weekly digest</span>
                    <input type="checkbox" className="rounded" defaultChecked />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t flex gap-3">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                  Save Changes
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-accent">
                  Cancel
                </button>
              </div>
            </div>
            )}

            {activeTab === 'ai-agent' && (
              <div className="rounded-lg border bg-card p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">AI Agent Configuration</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your AI assistant with API keys from various providers. The assistant will use these to help you with research, development, and data analysis.
                  </p>
                </div>

                {/* Provider Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Active Provider</label>
                  <div className="grid grid-cols-2 gap-3">
                    {providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => updateLLMConfig({ provider: provider.id })}
                        className={`p-4 border rounded-lg text-left transition-colors ${
                          llmConfig.provider === provider.id
                            ? 'border-primary bg-primary/10'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <div className="font-semibold">{provider.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Model: {provider.model}
                        </div>
                        {llmConfig.apiKeys[provider.id] && (
                          <div className="text-xs text-green-600 mt-2">✓ Configured</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Configuration */}
                <div className="space-y-4">
                  <h3 className="font-semibold">API Keys</h3>
                  
                  {providers.map((provider) => (
                    <div key={provider.id} className="space-y-2">
                      <label className="block text-sm font-medium">
                        {provider.name} API Key
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showApiKeys[provider.id] ? 'text' : 'password'}
                            value={tempApiKeys[provider.id]}
                            onChange={(e) =>
                              setTempApiKeys({ ...tempApiKeys, [provider.id]: e.target.value })
                            }
                            placeholder={`Enter your ${provider.name} API key`}
                            className="w-full px-3 py-2 pr-10 border rounded-lg bg-background font-mono text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => toggleShowApiKey(provider.id)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
                          >
                            {showApiKeys[provider.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <button
                          onClick={() => handleSaveApiKey(provider.id)}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                          disabled={!tempApiKeys[provider.id]}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => testConnection(provider.id)}
                          className="px-4 py-2 border rounded-lg hover:bg-accent disabled:opacity-50"
                          disabled={!tempApiKeys[provider.id] && !llmConfig.apiKeys[provider.id]}
                        >
                          {testingConnection[provider.id] ? 'Testing...' : 'Test'}
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {llmConfig.apiKeys[provider.id] && (
                          <p className="text-xs text-green-600">✓ API key saved</p>
                        )}
                        {connectionStatus[provider.id] === 'success' && (
                          <p className="text-xs text-green-600">✓ Connection successful</p>
                        )}
                        {connectionStatus[provider.id] === 'error' && (
                          <p className="text-xs text-red-600">✗ Connection failed - check your API key</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Agent Roles Info */}
                <div className="pt-4 border-t">
                  <h3 className="font-semibold mb-3">Available Agent Roles</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-primary/10 border-2 border-primary/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">🤖</span>
                        <span className="font-medium text-sm">Project Assistant</span>
                        <span className="text-xs px-2 py-0.5 bg-primary text-primary-foreground rounded-full">Recommended</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <strong>FULL SITE-WIDE ACCESS</strong> - Complete access to all project files, codebase, data sources, and platform resources. Your go-to assistant for any task.
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">💻</span>
                        <span className="font-medium text-sm">Developer Mode</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Technical focus on architecture, code improvements, and infrastructure. Full access with development-oriented responses.
                      </p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">📊</span>
                        <span className="font-medium text-sm">Data Analyst Mode</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Focus on analytics, reports, and data insights. Specialized for visualization and statistical analysis.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    Site-Wide AI Assistant - Full Access
                  </h4>
                  <ol className="text-xs text-muted-foreground space-y-1">
                    <li>1. Configure an API key above (recommended: X.AI for Grok)</li>
                    <li>2. Click the "AI Assistant" button in the top header (next to notifications)</li>
                    <li>3. Select a role: Project Assistant (full access), Developer, or Data Analyst</li>
                    <li>4. Chat with your AI assistant - it has access to all project files and resources!</li>
                  </ol>
                  <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                    <strong>Pro tip:</strong> The Project Assistant role has complete site-wide access to all files, data, and platform features.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <p className="text-muted-foreground text-sm">Notification settings coming soon...</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
                <p className="text-muted-foreground text-sm">Security settings coming soon...</p>
              </div>
            )}

            {activeTab === 'data-sources' && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Data Source Configuration</h2>
                <p className="text-muted-foreground text-sm">Data source settings coming soon...</p>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                <p className="text-muted-foreground text-sm">Theme settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
