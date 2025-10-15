'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface HomepageSettings {
  id: string
  hero_title: string
  hero_subtitle: string
  hero_background_type: 'color' | 'image' | 'video'
  hero_background_value: string
  hero_image_url?: string
  hero_video_url?: string
  hero_cta_primary_text: string
  hero_cta_primary_url: string
  hero_cta_secondary_text: string
  hero_cta_secondary_url: string
  hero_cta_tertiary_text: string
  hero_cta_tertiary_url: string
}

export default function HomepageManagement() {
  const [settings, setSettings] = useState<HomepageSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/homepage')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })
      
      if (response.ok) {
        alert('Settings saved successfully!')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!settings) return <div>Error loading settings</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Homepage Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Hero Title</label>
          <input
            type="text"
            value={settings.hero_title}
            onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
            className="w-full p-3 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
          <textarea
            value={settings.hero_subtitle}
            onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
            className="w-full p-3 border rounded-md h-24"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Background Type</label>
          <select
            value={settings.hero_background_type}
            onChange={(e) => setSettings({ ...settings, hero_background_type: e.target.value as any })}
            className="w-full p-3 border rounded-md"
          >
            <option value="color">Solid Color</option>
            <option value="image">Background Image</option>
            <option value="video">Background Video</option>
          </select>
        </div>

        {settings.hero_background_type === 'color' && (
          <div>
            <label className="block text-sm font-medium mb-2">Background Color Class</label>
            <input
              type="text"
              value={settings.hero_background_value}
              onChange={(e) => setSettings({ ...settings, hero_background_value: e.target.value })}
              placeholder="e.g., bg-blue-600"
              className="w-full p-3 border rounded-md"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}