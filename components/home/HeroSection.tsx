'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

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
    hero_subtitle: 'Nurturing young minds through innovative early childhood education in a warm, creative environment',
    hero_background_type: 'color',
    hero_background_value: 'gradient-sunrise',
    hero_cta_primary_text: 'Schedule a Tour',
    hero_cta_primary_url: '/admissions/schedule-tour',
    hero_cta_secondary_text: 'Apply Now',
    hero_cta_secondary_url: '/admissions/how-to-apply',
    hero_cta_tertiary_text: 'Learn More',
    hero_cta_tertiary_url: '/about'
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
        backgroundImage: `linear-gradient(rgba(255, 107, 53, 0.8), rgba(255, 138, 128, 0.8)), url(${settings.hero_image_url})`,
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
    return 'gradient-sunrise'
  }

  return (
    <div className={`relative ${getBackgroundClass()} text-white overflow-hidden`} style={getBackgroundStyle()}>
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
      
      {/* Curved decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white bg-opacity-10 rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white bg-opacity-5 rounded-full translate-y-32 -translate-x-32"></div>
      
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                {settings.hero_title}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white text-opacity-90 leading-relaxed">
                {settings.hero_subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={settings.hero_cta_primary_url}
                  className="px-8 py-4 bg-white text-orange-500 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {settings.hero_cta_primary_text}
                </Link>
                <Link
                  href={settings.hero_cta_secondary_url}
                  className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-orange-500 transition-all duration-300"
                >
                  {settings.hero_cta_secondary_text}
                </Link>
              </div>
            </div>
            
            <div className="relative fade-in">
              <div className="relative z-10">
                <Image
                  src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Children learning at Sunrise School"
                  width={600}
                  height={400}
                  className="rounded-3xl shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-80"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-teal-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-white">
          <path d="M0,120 C300,60 900,60 1200,120 L1200,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  )
}
