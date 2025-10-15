'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function EventRegistrationForm({ event }: { event: any }) {
  const { user } = useAuth()
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/login?redirect=/events/' + event.slug)
      return
    }
    
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qty }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // If free event, redirect to confirmation
      if (event.price_cents === 0) {
        router.push('/portal/registrations')
      } else {
        // Redirect to payment
        router.push(`/payment/${data.id}`)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Register for this Event</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleRegister}>
        <div className="mb-4">
          <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Attendees
          </label>
          <input
            type="number"
            id="qty"
            min="1"
            max="10"
            value={qty}
            onChange={(e) => setQty(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {event.price_cents > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${((event.price_cents * qty) / 100).toFixed(2)}</span>
            </div>
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Processing...' : event.price_cents > 0 ? 'Continue to Payment' : 'Register Now'}
        </button>
        
        {!user && (
          <p className="mt-4 text-sm text-gray-600 text-center">
            You'll be redirected to sign in before completing registration
          </p>
        )}
      </form>
    </div>
  )
}
