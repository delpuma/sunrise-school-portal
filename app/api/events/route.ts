import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  
  const type = searchParams.get('type')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  
  let query = supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('start_at', { ascending: true })
  
  if (type) {
    query = query.eq('type', type)
  }
  
  if (startDate) {
    query = query.gte('start_at', startDate)
  }
  
  if (endDate) {
    query = query.lte('start_at', endDate)
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Events query error:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!userData || !['admin', 'staff'].includes(userData.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  
  const body = await request.json()
  
  try {
    // Validate required fields
    if (!body.title || !body.slug || !body.start_at || !body.end_at) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from('events')
      .insert({
        ...body,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Event creation error:', error)
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
    }
    
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error('Event creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
  
  return NextResponse.json(data, { status: 201 })
}
