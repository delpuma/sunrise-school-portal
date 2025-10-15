import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CRMDashboard from '@/components/admin/CRMDashboard'

export default async function CRMPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check if user is admin/staff
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!userData || !['admin', 'staff'].includes(userData.role)) {
    redirect('/portal/dashboard')
  }
  
  // Get contacts
  const { data: contacts } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">CRM - Contact Management</h1>
      <CRMDashboard initialContacts={contacts || []} />
    </div>
  )
}
