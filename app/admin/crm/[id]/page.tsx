import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ContactDetail from '@/components/admin/ContactDetail'

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
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
  
  // Fetch contact data via API
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/crm/contacts/${params.id}`, {
    headers: {
      Cookie: `sb-access-token=${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
  })
  
  if (!response.ok) {
    redirect('/admin/crm')
  }
  
  const data = await response.json()
  
  return (
    <div>
      <ContactDetail
        contact={data.contact}
        interactions={data.interactions}
        notes={data.notes}
      />
    </div>
  )
}
