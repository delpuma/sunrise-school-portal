'use client'

import { useState } from 'react'

export default function AIFAQAssistant() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [answer, setAnswer] = useState('')
  const [formData, setFormData] = useState({
    question: '',
    context: '',
  })

  const handleGenerate = async () => {
    if (!formData.question.trim()) {
      setError('Please enter a question')
      return
    }

    setError('')
    setLoading(true)
    setAnswer('')

    try {
      const response = await fetch('/api/ai/faq-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate answer')
      }

      setAnswer(data.answer)
    } catch (err: any) {
      setError(err.message || 'Failed to generate answer')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(answer)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🤖</span>
        <h2 className="text-xl font-semibold">AI FAQ Assistant</h2>
      </div>

      <p className="text-sm text-gray-600">
        Generate helpful answers to common parent questions using AI.
      </p>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Question *
          </label>
          <input
            type="text"
            value={formData.question}
            onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            placeholder="e.g., What is the Montessori method?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Context (optional)
          </label>
          <textarea
            value={formData.context}
            onChange={(e) => setFormData({ ...formData, context: e.target.value })}
            placeholder="Add any specific details or context..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate Answer'}
        </button>
      </div>

      {answer && (
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
            ⚠️ This is AI-generated content. Please review for accuracy before using.
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <p className="text-gray-900 whitespace-pre-wrap">{answer}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => {
                setAnswer('')
                setFormData({ question: '', context: '' })
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
