import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check if user is admin/staff
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!userData || !['admin', 'staff'].includes(userData.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  try {
    const body = await request.json()
    const { contactIds } = body
    
    let query = supabase
      .from('crm_contacts')
      .select('*')
    
    if (contactIds && contactIds.length > 0) {
      query = query.in('id', contactIds)
    }
    
    const { data: contacts, error } = await query
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Convert to CSV
    const headers = ['Email', 'First Name', 'Last Name', 'Phone', 'Status', 'Source', 'Grade Interest', 'Tags', 'Engagement Score']
    const rows = contacts.map(contact => [
      contact.email,
      contact.first_name || '',
      contact.last_name || '',
      contact.phone || '',
      contact.status,
      contact.source || '',
      contact.grade_interest || '',
      (contact.tags || []).join('; '),
      contact.engagement_score || 0,
    ])
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="contacts-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
