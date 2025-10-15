'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormField = {
  name: string
  label: string
  type: 'text' | 'email' | 'phone' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file'
  required: boolean
  placeholder?: string
  options?: string[]
}

export default function FormBuilder({ 
  initialForm,
  mode = 'create'
}: { 
  initialForm?: any
  mode?: 'create' | 'edit'
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: initialForm?.title || '',
    slug: initialForm?.slug || '',
    description: initialForm?.description || '',
    is_active: initialForm?.is_active ?? true,
  })
  
  const [fields, setFields] = useState<FormField[]>(
    initialForm?.schema?.fields || []
  )
  
  const [currentField, setCurrentField] = useState<FormField>({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    options: [],
  })

  const handleAddField = () => {
    if (!currentField.name || !currentField.label) {
      setError('Field name and label are required')
      return
    }
    
    setFields([...fields, { ...currentField }])
    setCurrentField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      options: [],
    })
    setError('')
  }

  const handleRemoveField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleMoveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...fields]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex < 0 || newIndex >= fields.length) return
    
    [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]]
    setFields(newFields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const schema = { fields }
      
      const url = mode === 'edit' 
        ? `/api/forms/${initialForm.slug}`
        : '/api/forms'
      
      const method = mode === 'edit' ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          schema,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save form')
      }

      router.push('/admin/forms')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save form')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Form Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Form Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug * (URL-friendly identifier)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="contact-form"
                required
                disabled={mode === 'edit'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Field Builder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Form Fields</h2>
          
          {/* Existing Fields */}
          {fields.length > 0 && (
            <div className="mb-6 space-y-2">
              {fields.map((field, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <span className="font-medium">{field.label}</span>
                    <span className="text-sm text-gray-500 ml-2">({field.type})</span>
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveField(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveField(index, 'down')}
                      disabled={index === fields.length - 1}
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveField(index)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Add New Field */}
          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold">Add New Field</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Name (internal)
                </label>
                <input
                  type="text"
                  value={currentField.name}
                  onChange={(e) => setCurrentField({ ...currentField, name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Label (displayed)
                </label>
                <input
                  type="text"
                  value={currentField.label}
                  onChange={(e) => setCurrentField({ ...currentField, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Email Address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Type
                </label>
                <select
                  value={currentField.type}
                  onChange={(e) => setCurrentField({ ...currentField, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="textarea">Textarea</option>
                  <option value="select">Select</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="radio">Radio</option>
                  <option value="file">File Upload</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={currentField.placeholder}
                  onChange={(e) => setCurrentField({ ...currentField, placeholder: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              {['select', 'checkbox', 'radio'].includes(currentField.type) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={currentField.options?.join(', ')}
                    onChange={(e) => setCurrentField({ 
                      ...currentField, 
                      options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Option 1, Option 2, Option 3"
                  />
                </div>
              )}
              
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={currentField.required}
                    onChange={(e) => setCurrentField({ ...currentField, required: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Required Field</span>
                </label>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleAddField}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Add Field
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading || fields.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : mode === 'edit' ? 'Update Form' : 'Create Form'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
