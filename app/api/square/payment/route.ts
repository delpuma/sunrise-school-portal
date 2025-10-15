import { createClient } from '@/lib/supabase/server'
import { getSquareClient, SQUARE_LOCATION_ID } from '@/lib/square/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const { sourceId, registrationId, amount } = body
    
    if (!sourceId || !registrationId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get registration details
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .select('*, events(*)')
      .eq('id', registrationId)
      .eq('user_id', user.id)
      .single()
    
    if (regError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    
    // Process payment with Square
    const squareClient = getSquareClient()
    let paymentResult
    
    try {
      const { result, statusCode } = await squareClient.paymentsApi.createPayment({
        sourceId,
        amountMoney: {
          amount: BigInt(amount),
          currency: 'USD',
        },
        locationId: SQUARE_LOCATION_ID,
        idempotencyKey: `${registrationId}-${Date.now()}`,
        note: `Event Registration: ${registration.events?.title}`,
      })
      
      if (statusCode !== 200 || !result.payment) {
        throw new Error(`Payment failed with status: ${statusCode}`)
      }
      
      paymentResult = result.payment
    } catch (squareError: any) {
      console.error('Square payment error:', squareError)
      throw new Error(`Payment processing failed: ${squareError.message || 'Unknown error'}`)
    }
    
    // Update registration with payment info
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        status: 'paid',
        square_payment_id: paymentResult.id,
      })
      .eq('id', registrationId)
    
    if (updateError) {
      console.error('Registration update error:', updateError)
      throw new Error('Failed to update registration status')
    }
    
    // Create audit log
    const { error: auditError } = await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'payment_completed',
      target_table: 'registrations',
      target_id: registrationId,
      changes: { square_payment_id: paymentResult.id },
    })
    
    if (auditError) {
      console.error('Audit log error:', auditError)
    }
    
    return NextResponse.json({
      success: true,
      paymentId: paymentResult.id,
    })
  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: error.message || 'Payment processing failed' },
      { status: 500 }
    )
  }
}
