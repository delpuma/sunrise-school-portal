import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  email: z.string().email(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  status: z.enum(['lead', 'prospect', 'enrolled', 'alumni']).default('lead'),
  source: z.string().optional(),
  grade_interest: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export async function GET(request: NextRequest) {
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
  
  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const source = searchParams.get('source')
  const search = searchParams.get('search')
  const tags = searchParams.get('tags')?.split(',')
  
  let query = supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (status) {
    query = query.eq('status', status)
  }
  
  if (source) {
    query = query.eq('source', source)
  }
  
  if (search) {
    query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
  }
  
  if (tags && tags.length > 0) {
    query = query.contains('tags', tags)
  }
  
  const { data: contacts, error } = await query
  
  if (error) {
    console.error('CRM contacts query error:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
  
  return NextResponse.json({ contacts })
}

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
    const validatedData = contactSchema.parse(body)
    
    const { data: contact, error } = await supabase
      .from('crm_contacts')
      .insert(validatedData)
      .select()
      .single()
    
    if (error) {
      console.error('CRM contact creation error:', error)
      return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
    }
    
    // Create audit log
    const { error: auditError } = await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'create',
      target_table: 'crm_contacts',
      target_id: contact.id,
      changes: validatedData,
    })
    
    if (auditError) {
      console.error('Audit log error:', auditError)
    }
    
    return NextResponse.json({ contact })
  } catch (error: any) {
    console.error('CRM contact creation error:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
