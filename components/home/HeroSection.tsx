'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HomepageSettings {
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

export default function HeroSection() {
  const [settings, setSettings] = useState<HomepageSettings>({
    hero_title: 'Welcome to Sunrise School of Miami',
    hero_subtitle: 'Nurturing young minds through innovative early childhood education',
    hero_background_type: 'color',
    hero_background_value: 'bg-blue-600',
    hero_cta_primary_text: 'Schedule a Tour',
    hero_cta_primary_url: '/admissions/schedule-tour',
    hero_cta_secondary_text: 'Apply/Enroll',
    hero_cta_secondary_url: '/admissions/how-to-apply',
    hero_cta_tertiary_text: 'Donate',
    hero_cta_tertiary_url: '/give'
  })

  useEffect(() => {
    fetch('/api/homepage')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {}) // Use defaults on error
  }, [])

  const getBackgroundStyle = () => {
    if (settings.hero_background_type === 'image' && settings.hero_image_url) {
      return {
        backgroundImage: `url(${settings.hero_image_url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }
    return {}
  }

  const getBackgroundClass = () => {
    if (settings.hero_background_type === 'color') {
      return settings.hero_background_value
    }
    return 'bg-blue-600' // fallback
  }

  return (
    <div className={`relative ${getBackgroundClass()} text-white`} style={getBackgroundStyle()}>
      {settings.hero_background_type === 'video' && settings.hero_video_url && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={settings.hero_video_url} type="video/mp4" />
        </video>
      )}
      <div className="relative z-10 bg-black bg-opacity-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {settings.hero_title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              {settings.hero_subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={settings.hero_cta_primary_url}
                className="px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                {settings.hero_cta_primary_text}
              </Link>
              <Link
                href={settings.hero_cta_secondary_url}
                className="px-8 py-3 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800 transition"
              >
                {settings.hero_cta_secondary_text}
              </Link>
              <Link
                href={settings.hero_cta_tertiary_url}
                className="px-8 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
              >
                {settings.hero_cta_tertiary_text}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
