'use client'

import { useEffect } from 'react'

export default function GivebutterWidget({ campaignId }: { campaignId?: string }) {
  useEffect(() => {
    // Load Givebutter script
    const script = document.createElement('script')
    script.src = 'https://js.givebutter.com/elements/latest.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      try {
        if (document.body.contains(script)) {
          document.body.removeChild(script)
        }
      } catch (error) {
        console.error('Error removing Givebutter script:', error)
      }
    }
  }, [])

  const handleDonate = () => {
    try {
      if (typeof window !== 'undefined' && (window as any).Givebutter) {
        (window as any).Givebutter.open()
      }
    } catch (error) {
      console.error('Error opening Givebutter widget:', error)
    }
  }

  const sanitizedCampaignId = campaignId?.replace(/[^a-zA-Z0-9-_]/g, '')

  return (
    <>
      {sanitizedCampaignId && (
        <div dangerouslySetInnerHTML={{ __html: `<givebutter-widget campaign-id="${sanitizedCampaignId}"></givebutter-widget>` }} />
      )}
      <button
        onClick={handleDonate}
        className="px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
      >
        Donate Now
      </button>
    </>
  )
}
