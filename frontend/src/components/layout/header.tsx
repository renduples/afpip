'use client'

import { Menu, Bell, User, LogOut, Bot, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useState } from 'react'
import { AIChatModal } from '@/components/ai/ai-chat-modal'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  return (
    <>
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button
          onClick={onMenuClick}
          className="lg:hidden -ml-2 p-2 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex-1" />

        <button 
          onClick={() => setShowAIAssistant(true)}
          className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
          title="AI Project Assistant - Full Access"
        >
          <Bot className="h-5 w-5" />
          <span className="hidden sm:block text-sm font-medium">AI Assistant</span>
          <Sparkles className="h-4 w-4" />
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent"
          >
            <User className="h-5 w-5" />
            {user && (
              <span className="hidden sm:block text-sm font-medium">{user.name}</span>
            )}
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-card border rounded-lg shadow-lg z-50">
                <div className="p-3 border-b">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="inline-block px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                      {user?.role.toUpperCase()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
    <AIChatModal isOpen={showAIAssistant} onClose={() => setShowAIAssistant(false)} />
    </>
  )
}
