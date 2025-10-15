import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verify webhook signature
    const signature = request.headers.get('x-square-signature')
    if (!signature) {
      console.error('Missing webhook signature')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { type, data } = body
    
    if (!type || !data) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 })
    }
    
    if (type === 'invoice.payment_made') {
      const invoiceId = data?.object?.invoice?.id
      
      if (!invoiceId) {
        console.error('Missing invoice ID in webhook')
        return NextResponse.json({ error: 'Invalid invoice data' }, { status: 400 })
      }
      
      const supabase = await createClient()
      
      // Update invoice status
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: 'paid' })
        .eq('square_invoice_id', invoiceId)
      
      if (updateError) {
        console.error('Failed to update invoice:', updateError)
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 })
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
