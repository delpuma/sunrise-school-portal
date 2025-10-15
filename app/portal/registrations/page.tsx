import { createClient } from '@/lib/supabase/server'

export default async function RegistrationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get all registrations with event details
  const { data: registrations } = await supabase
    .from('registrations')
    .select(`
      *,
      events (
        title,
        slug,
        start_at,
        end_at,
        type
      ),
      students (
        name
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Event Registrations</h1>
      
      {registrations && registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((registration) => (
            <div key={registration.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{registration.events?.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      registration.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : registration.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : registration.status === 'waitlist'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {registration.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Event Type:</span> {registration.events?.type}
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {new Date(registration.events?.start_at).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                    {registration.students && (
                      <p>
                        <span className="font-medium">Student:</span> {registration.students.name}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Quantity:</span> {registration.qty}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> ${(registration.total_cents / 100).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Registered:</span>{' '}
                      {new Date(registration.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  {registration.status === 'pending' && (
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Complete Payment
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">No registrations yet</p>
          <p className="text-sm text-gray-500 mb-6">
            Browse our events and register for programs
          </p>
          <a
            href="/events"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Browse Events
          </a>
        </div>
      )}
    </div>
  )
}
