'use client'

import { useState } from 'react'

export default function AIBlogAssistant({ onInsert }: { onInsert: (content: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'friendly' as const,
    length: 'medium' as const,
  })

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError('Please enter a topic')
      return
    }

    setError('')
    setLoading(true)
    setDraft('')

    try {
      const response = await fetch('/api/ai/blog-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate draft')
      }

      setDraft(data.draft)
    } catch (err: any) {
      setError(err.message || 'Failed to generate draft')
    } finally {
      setLoading(false)
    }
  }

  const handleInsert = () => {
    if (draft) {
      onInsert(draft)
      setDraft('')
      setShowForm(false)
      setFormData({ topic: '', tone: 'friendly', length: 'medium' })
    }
  }

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2"
      >
        <span>✨</span>
        AI Blog Assistant
      </button>
    )
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-purple-900">AI Blog Assistant</h3>
        <button
          onClick={() => setShowForm(false)}
          className="text-purple-600 hover:text-purple-800"
        >
          ✕
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic *
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            placeholder="e.g., Benefits of Montessori Education"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="informative">Informative</option>
              <option value="inspirational">Inspirational</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Length
            </label>
            <select
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="short">Short (~300 words)</option>
              <option value="medium">Medium (~600 words)</option>
              <option value="long">Long (~1000 words)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Draft'}
        </button>
      </div>

      {draft && (
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
            ⚠️ This is AI-generated content. Please review and edit before publishing.
          </div>

          <div className="bg-white border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm font-mono">{draft}</pre>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleInsert}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Insert into Editor
            </button>
            <button
              onClick={() => setDraft('')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
