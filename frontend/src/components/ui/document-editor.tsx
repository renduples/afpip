'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Save, Edit } from 'lucide-react'

interface DocumentEditorProps {
  initialContent: string
  onSave: (content: string) => void
}

export function DocumentEditor({ initialContent, onSave }: DocumentEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(initialContent)

  const handleSave = () => {
    onSave(content)
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        {isEditing ? (
          <>
            <Button variant="outline" size="sm" onClick={() => setContent(initialContent)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </>
        ) : (
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
      {isEditing ? (
        <Textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          className="min-h-[400px] font-mono text-sm"
          placeholder="Edit documentation content in Markdown format..."
        />
      ) : (
        <div className="rounded-md border bg-muted p-4 min-h-[400px] text-sm">
          <pre className="whitespace-pre-wrap font-mono">{content || 'No content available. Click "Edit" to add documentation.'}</pre>
        </div>
      )}
    </div>
  )
}
