import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function PortalDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get user's family
  const { data: family } = await supabase
    .from('families')
    .select('*')
    .or(`primary_user_id.eq.${user.id},secondary_user_id.eq.${user.id}`)
    .single()
  
  // Get recent invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('family_id', family?.id)
    .order('created_at', { ascending: false })
    .limit(3)
  
  // Get recent registrations
  const { data: registrations } = await supabase
    .from('registrations')
    .select('*, events(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(3)
  
  // Get students
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('family_id', family?.id)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Students:</span>
              <span className="font-semibold">{students?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Active Registrations:</span>
              <span className="font-semibold">{registrations?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending Invoices:</span>
              <span className="font-semibold">
                {invoices?.filter(i => i.status !== 'paid').length || 0}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/events"
              className="block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
            >
              Browse Events
            </Link>
            <Link
              href="/portal/profile"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
            >
              Update Profile
            </Link>
            <Link
              href="/portal/resources"
              className="block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center"
            >
              View Resources
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
            <Link href="/portal/invoices" className="text-blue-600 hover:text-blue-700 text-sm">
              View All →
            </Link>
          </div>
          {invoices && invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <p className="font-medium">${(invoice.amount_cents / 100).toFixed(2)}</p>
                    <p className="text-sm text-gray-600">
                      Due: {new Date(invoice.due_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    invoice.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No invoices yet</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Registrations</h2>
            <Link href="/portal/registrations" className="text-blue-600 hover:text-blue-700 text-sm">
              View All →
            </Link>
          </div>
          {registrations && registrations.length > 0 ? (
            <div className="space-y-3">
              {registrations.map((reg) => (
                <div key={reg.id} className="border-b pb-3">
                  <p className="font-medium">{reg.events?.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(reg.events?.start_at).toLocaleDateString()}
                  </p>
                  <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                    reg.status === 'paid' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reg.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No registrations yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
