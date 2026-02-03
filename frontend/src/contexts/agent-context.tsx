'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type LLMProvider = 'xai' | 'openai' | 'anthropic' | 'google'
export type AgentRole = 'researcher' | 'developer' | 'data-analyst'

interface LLMConfig {
  provider: LLMProvider
  apiKeys: {
    xai?: string
    openai?: string
    anthropic?: string
    google?: string
  }
  defaultModel: string
}

interface AgentContextType {
  llmConfig: LLMConfig
  updateLLMConfig: (config: Partial<LLMConfig>) => void
  setApiKey: (provider: LLMProvider, key: string) => void
  currentRole: AgentRole | null
  setCurrentRole: (role: AgentRole | null) => void
}

const AgentContext = createContext<AgentContextType | undefined>(undefined)

const DEFAULT_CONFIG: LLMConfig = {
  provider: 'xai',
  apiKeys: {},
  defaultModel: 'grok-3',
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const [llmConfig, setLLMConfig] = useState<LLMConfig>(() => {
    // Load from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('afpi_llm_config')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          // Migrate deprecated grok-beta to grok-3
          if (parsed.defaultModel === 'grok-beta') {
            parsed.defaultModel = 'grok-3'
            localStorage.setItem('afpi_llm_config', JSON.stringify(parsed))
          }
          return parsed
        } catch (e) {
          return DEFAULT_CONFIG
        }
      }
    }
    return DEFAULT_CONFIG
  })

  const [currentRole, setCurrentRole] = useState<AgentRole | null>(null)

  const updateLLMConfig = (config: Partial<LLMConfig>) => {
    const updated = { ...llmConfig, ...config }
    setLLMConfig(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('afpi_llm_config', JSON.stringify(updated))
    }
  }

  const setApiKey = (provider: LLMProvider, key: string) => {
    const updated = {
      ...llmConfig,
      apiKeys: {
        ...llmConfig.apiKeys,
        [provider]: key,
      },
    }
    setLLMConfig(updated)
    if (typeof window !== 'undefined') {
      localStorage.setItem('afpi_llm_config', JSON.stringify(updated))
    }
  }

  return (
    <AgentContext.Provider
      value={{
        llmConfig,
        updateLLMConfig,
        setApiKey,
        currentRole,
        setCurrentRole,
      }}
    >
      {children}
    </AgentContext.Provider>
  )
}

export function useAgent() {
  const context = useContext(AgentContext)
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider')
  }
  return context
}
