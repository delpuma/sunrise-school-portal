import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature
    const signature = request.headers.get('x-givebutter-signature')
    if (!signature) {
      console.error('Missing Givebutter webhook signature')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { type, data } = body
    
    if (!type || !data) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
    }
    
    if (type === 'donation.created') {
      if (!data.id || !data.amount) {
        console.error('Missing required donation data')
        return NextResponse.json({ error: 'Invalid donation data' }, { status: 400 })
      }
      
      const supabase = await createClient()
      
      // Store donation record
      const { error: insertError } = await supabase.from('donations').insert({
        source: 'givebutter',
        external_id: data.id,
        amount_cents: Math.round(data.amount * 100),
        campaign: data.campaign_name || null,
        occurred_at: data.created_at || new Date().toISOString(),
      })
      
      if (insertError) {
        console.error('Failed to store donation:', insertError)
        return NextResponse.json({ error: 'Database insert failed' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Givebutter webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
