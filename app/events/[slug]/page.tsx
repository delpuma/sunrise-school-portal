import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventRegistrationForm from '@/components/events/EventRegistrationForm'

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createClient()
  
  const { data: event } = await supabase
    .from('events')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_published', true)
    .single()
  
  if (!event) {
    notFound()
  }
  
  // Get capacity info
  const { data: registrations } = await supabase
    .from('registrations')
    .select('qty')
    .eq('event_id', event.id)
    .in('status', ['paid', 'pending'])
  
  const registeredCount = registrations?.reduce((sum, r) => sum + r.qty, 0) || 0
  const availableSpots = event.capacity ? Math.max(0, event.capacity - registeredCount) : null
  const isFull = event.capacity ? registeredCount >= event.capacity : false
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {event.image_url && (
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-96 object-cover rounded-lg mb-8"
        />
      )}
      
      <div className="mb-4">
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full">
          {event.type}
        </span>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
      
      <div className="flex items-center gap-6 text-gray-600 mb-8">
        <div>
          <svg className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(event.start_at).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <div>
          <svg className="inline w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {new Date(event.start_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </div>
      </div>
      
      {event.description && (
        <div className="prose prose-lg max-w-none mb-8">
          <p>{event.description}</p>
        </div>
      )}
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Event Details</h2>
        <div className="space-y-2">
          {event.price_cents > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Price:</span>
              <span className="font-semibold">${(event.price_cents / 100).toFixed(2)}</span>
            </div>
          )}
          {event.capacity && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Capacity:</span>
                <span className="font-semibold">{event.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Registered:</span>
                <span className="font-semibold">{registeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Available Spots:</span>
                <span className={`font-semibold ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                  {isFull ? 'Full' : availableSpots}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
      
      {isFull ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800 font-semibold mb-2">This event is currently full</p>
          <p className="text-yellow-700">Join the waitlist to be notified if spots become available</p>
          <button className="mt-4 px-6 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700">
            Join Waitlist
          </button>
        </div>
      ) : (
        <EventRegistrationForm event={event} />
      )}
    </div>
  )
}
