import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function EventsPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Upcoming Events</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events && events.length > 0 ? (
          events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">
                  {event.type}
                </div>
                <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-4">
                  {new Date(event.start_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                {event.price_cents > 0 && (
                  <p className="text-gray-700 font-semibold">
                    ${(event.price_cents / 100).toFixed(2)}
                  </p>
                )}
                {event.capacity && (
                  <p className="text-sm text-gray-500 mt-2">
                    Capacity: {event.capacity} spots
                  </p>
                )}
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No upcoming events at this time.</p>
          </div>
        )}
      </div>
    </div>
  )
}
