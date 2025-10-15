import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get unpaid invoices count
  const { count: unpaidInvoices } = await supabase
    .from('invoices')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'paid')
  
  // Get events near capacity
  const { data: events } = await supabase
    .from('events')
    .select('*, registrations(qty)')
    .eq('is_published', true)
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(5)
  
  const capacityAlerts = events?.filter(event => {
    if (!event.capacity) return false
    const registered = event.registrations?.reduce((sum: number, r: any) => sum + r.qty, 0) || 0
    return registered >= event.capacity * 0.8
  })
  
  // Get upcoming tours
  const { data: tours } = await supabase
    .from('bookings')
    .select('*')
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })
    .limit(5)
  
  // Get recent donations
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(5)
  
  const totalDonations = donations?.reduce((sum, d) => sum + d.amount_cents, 0) || 0

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unpaid Invoices</p>
              <p className="text-3xl font-bold text-red-600">{unpaidInvoices || 0}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Capacity Alerts</p>
              <p className="text-3xl font-bold text-yellow-600">{capacityAlerts?.length || 0}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming Tours</p>
              <p className="text-3xl font-bold text-blue-600">{tours?.length || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Recent Donations</p>
              <p className="text-3xl font-bold text-green-600">${(totalDonations / 100).toFixed(0)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Capacity Alerts</h2>
            <Link href="/admin/events" className="text-blue-600 hover:text-blue-700 text-sm">
              View All →
            </Link>
          </div>
          {capacityAlerts && capacityAlerts.length > 0 ? (
            <div className="space-y-3">
              {capacityAlerts.map((event: any) => {
                const registered = event.registrations?.reduce((sum: number, r: any) => sum + r.qty, 0) || 0
                const percentage = Math.round((registered / event.capacity) * 100)
                return (
                  <div key={event.id} className="border-b pb-3">
                    <p className="font-medium">{event.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${percentage >= 100 ? 'bg-red-600' : 'bg-yellow-600'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{percentage}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600">No capacity alerts</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Tours</h2>
            <Link href="/admin/bookings" className="text-blue-600 hover:text-blue-700 text-sm">
              View All →
            </Link>
          </div>
          {tours && tours.length > 0 ? (
            <div className="space-y-3">
              {tours.map((tour) => (
                <div key={tour.id} className="border-b pb-3">
                  <p className="font-medium">{tour.booking_name}</p>
                  <p className="text-sm text-gray-600">{tour.email}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(tour.start_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No upcoming tours</p>
          )}
        </div>
      </div>
    </div>
  )
}
