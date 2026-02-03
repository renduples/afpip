'use client'

import { useState } from 'react'
import { Bot } from 'lucide-react'
import { AIChatModal } from './ai-chat-modal'

export function AIFloatingButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-2xl hover:bg-primary/90 transition-all hover:scale-110 z-50 ring-4 ring-primary/20"
        title="Open AI Assistant"
        aria-label="Open AI Assistant"
      >
        <Bot className="h-6 w-6" />
      </button>

      <AIChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
