import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const body = await request.json()
  const { email } = body
  
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }
  
  // Check if already subscribed
  const { data: existing } = await supabase
    .from('newsletter_signups')
    .select('*')
    .eq('email', email)
    .single()
  
  if (existing) {
    if (existing.status === 'unsubscribed') {
      // Resubscribe
      const { error } = await supabase
        .from('newsletter_signups')
        .update({
          status: 'active',
          consent_at: new Date().toISOString(),
        })
        .eq('email', email)
      
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ message: 'Resubscribed successfully' })
    }
    
    return NextResponse.json({ message: 'Already subscribed' })
  }
  
  // Create new subscription
  const { error } = await supabase
    .from('newsletter_signups')
    .insert({
      email,
      consent_at: new Date().toISOString(),
      status: 'active',
    })
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  
  return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 })
}
