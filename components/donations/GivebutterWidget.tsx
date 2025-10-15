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
      document.body.removeChild(script)
    }
  }, [])

  const handleDonate = () => {
    // Open Givebutter widget
    if (typeof window !== 'undefined' && (window as any).Givebutter) {
      (window as any).Givebutter.open()
    }
  }

  return (
    <>
      {campaignId && (
        <givebutter-widget campaign-id={campaignId}></givebutter-widget>
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
