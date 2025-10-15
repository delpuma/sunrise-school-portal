import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const body = await request.json()
    const { email } = body
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
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
        console.error('Newsletter resubscribe error:', { errorCode: error.code, message: error.message })
        return NextResponse.json({ error: 'Failed to resubscribe' }, { status: 500 })
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
    console.error('Newsletter signup error:', { errorCode: error.code, message: error.message })
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
  
  return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 })
  } catch (error: any) {
    console.error('Newsletter API error:', { message: error?.message || 'Unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
