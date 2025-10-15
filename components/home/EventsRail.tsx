import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export default async function EventsRail() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(3)

  // Show placeholder events if no real events exist
  const displayEvents = events && events.length > 0 ? events : [
    {
      id: '1',
      title: 'Open House & School Tour',
      slug: 'open-house-tour',
      start_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      capacity: 25,
      description: 'Join us for a guided tour of our beautiful campus and meet our dedicated teachers.'
    },
    {
      id: '2', 
      title: 'Art & Music Showcase',
      slug: 'art-music-showcase',
      start_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      capacity: 50,
      description: 'Celebrate creativity as our students showcase their artistic and musical talents.'
    },
    {
      id: '3',
      title: 'Family Picnic Day',
      slug: 'family-picnic-day', 
      start_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      image_url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      capacity: 100,
      description: 'A fun-filled day of games, food, and community building for the whole family.'
    }
  ]

  return (
    <section className="py-20 bg-white relative">
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-orange-50">
          <path d="M0,0 C300,60 900,60 1200,0 L1200,0 L0,0 Z"></path>
        </svg>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for exciting events that bring our school community together 
            and celebrate the joy of learning.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="group card-hover bg-white rounded-3xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.image_url || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-semibold text-orange-500">
                  {new Date(event.start_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-orange-500 transition-colors">
                  {event.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {event.description || 'Join us for this exciting event at Sunrise School.'}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {new Date(event.start_at).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  {event.capacity && (
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                      {event.capacity} spots
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/events"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-red-400 text-white rounded-full font-semibold hover:from-orange-600 hover:to-red-500 transition-all duration-300 transform hover:scale-105"
          >
            View All Events
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
