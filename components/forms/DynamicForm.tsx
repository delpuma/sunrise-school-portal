'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormField = {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file'
  required?: boolean
  placeholder?: string
  options?: string[]
  validation?: {
    pattern?: string
    min?: number
    max?: number
  }
  conditionalLogic?: {
    field: string
    value: any
    action: 'show' | 'hide'
  }
}

type FormSchema = {
  fields: FormField[]
}

export default function DynamicForm({ 
  formSlug, 
  schema,
  onSuccess,
}: { 
  formSlug: string
  schema: FormSchema
  onSuccess?: () => void
}) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value })
  }

  const shouldShowField = (field: FormField): boolean => {
    if (!field.conditionalLogic) return true
    
    const { field: dependentField, value: dependentValue, action } = field.conditionalLogic
    const currentValue = formData[dependentField]
    
    const matches = currentValue === dependentValue
    return action === 'show' ? matches : !matches
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetch(`/api/forms/${formSlug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      setSuccess(true)
      setFormData({})
      
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit form')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field: FormField) => {
    if (!shouldShowField(field)) return null

    const commonProps = {
      id: field.name,
      name: field.name,
      required: field.required,
      className: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <input
            {...commonProps}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            pattern={field.validation?.pattern}
          />
        )
      
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
          />
        )
      
      case 'select':
        return (
          <select
            {...commonProps}
            value={formData[field.name] || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name={field.name}
                  value={option}
                  checked={(formData[field.name] || []).includes(option)}
                  onChange={(e) => {
                    const current = formData[field.name] || []
                    const updated = e.target.checked
                      ? [...current, option]
                      : current.filter((v: string) => v !== option)
                    handleChange(field.name, updated)
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={formData[field.name] === option}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )
      
      case 'file':
        return (
          <input
            {...commonProps}
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleChange(field.name, file.name)
              }
            }}
          />
        )
      
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">Form submitted successfully! Thank you.</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {schema.fields.map((field) => (
          <div key={field.name} className={shouldShowField(field) ? '' : 'hidden'}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
