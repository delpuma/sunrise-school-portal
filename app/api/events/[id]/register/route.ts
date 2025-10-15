import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { trackInteraction } from '@/lib/crm/interactions'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { student_id, qty = 1 } = body
  
  // Get event details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', params.id)
    .single()
  
  if (eventError || !event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }
  
  // Check capacity
  if (event.capacity) {
    const { data: registrations } = await supabase
      .from('registrations')
      .select('qty')
      .eq('event_id', params.id)
      .in('status', ['paid', 'pending'])
    
    const registeredCount = registrations?.reduce((sum, r) => sum + r.qty, 0) || 0
    
    if (registeredCount + qty > event.capacity) {
      return NextResponse.json(
        { error: 'Event is full', waitlist: true },
        { status: 400 }
      )
    }
  }
  
  // Calculate total
  const totalCents = event.price_cents * qty
  
  // Create registration
  const { data: registration, error: regError } = await supabase
    .from('registrations')
    .insert({
      event_id: params.id,
      user_id: user.id,
      student_id,
      qty,
      total_cents: totalCents,
      status: totalCents > 0 ? 'pending' : 'paid',
    })
    .select()
    .single()
  
  if (regError) {
    return NextResponse.json({ error: regError.message }, { status: 500 })
  }
  
  // Get user email for CRM tracking
  const { data: userData } = await supabase
    .from('users')
    .select('email')
    .eq('id', user.id)
    .single()
  
  if (userData?.email) {
    await trackInteraction(userData.email, 'event_registration', {
      event_id: params.id,
      event_title: event.title,
      registration_id: registration.id,
    })
  }
  
  return NextResponse.json(registration, { status: 201 })
}
