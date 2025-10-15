import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactUpdateSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['lead', 'prospect', 'enrolled', 'alumni']).optional(),
  grade_interest: z.string().optional(),
  tags: z.array(z.string()).optional(),
  opted_out: z.boolean().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
  
  // Get contact with interactions and notes
  const { data: contact, error: contactError } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (contactError || !contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
  }
  
  // Get interactions
  const { data: interactions } = await supabase
    .from('crm_interactions')
    .select('*')
    .eq('contact_id', params.id)
    .order('occurred_at', { ascending: false })
  
  // Get notes
  const { data: notes } = await supabase
    .from('crm_notes')
    .select('*, created_by_user:users!crm_notes_created_by_fkey(name)')
    .eq('contact_id', params.id)
    .order('created_at', { ascending: false })
  
  return NextResponse.json({
    contact,
    interactions: interactions || [],
    notes: notes || [],
  })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = contactUpdateSchema.parse(body)
    
    const { data: contact, error } = await supabase
      .from('crm_contacts')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'update',
      target_table: 'crm_contacts',
      target_id: params.id,
      changes: validatedData,
    })
    
    return NextResponse.json({ contact })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
