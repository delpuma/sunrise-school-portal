'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    Square?: any
  }
}

export default function SquarePaymentForm({
  registrationId,
  amount,
}: {
  registrationId: string
  amount: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [card, setCard] = useState<any>(null)

  useEffect(() => {
    const initSquare = async () => {
      if (!window.Square) {
        const script = document.createElement('script')
        script.src = 'https://sandbox.web.squarecdn.com/v1/square.js'
        script.async = true
        script.onload = () => initializeCard()
        document.body.appendChild(script)
      } else {
        initializeCard()
      }
    }

    const initializeCard = async () => {
      try {
        const payments = window.Square.payments(
          process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
          process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
        )
        const cardInstance = await payments.card()
        await cardInstance.attach('#card-container')
        setCard(cardInstance)
      } catch (err: any) {
        setError('Failed to load payment form')
        console.error(err)
      }
    }

    initSquare()
  }, [])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!card) {
      setError('Payment form not ready')
      return
    }
    
    setError('')
    setLoading(true)

    try {
      const result = await card.tokenize()
      
      if (result.status === 'OK') {
        const response = await fetch('/api/square/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            registrationId,
            amount,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Payment failed')
        }

        router.push('/portal/registrations?payment=success')
      } else {
        throw new Error(result.errors?.[0]?.message || 'Tokenization failed')
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">Payment Information</h2>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex justify-between text-lg font-semibold mb-4">
          <span>Total Amount:</span>
          <span>${(amount / 100).toFixed(2)}</span>
        </div>
      </div>
      
      <form onSubmit={handlePayment}>
        <div id="card-container" className="mb-6"></div>
        
        <button
          type="submit"
          disabled={loading || !card}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
      
      <p className="mt-4 text-sm text-gray-600 text-center">
        Secure payment powered by Square
      </p>
    </div>
  )
}
