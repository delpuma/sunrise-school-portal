import { createClient } from '@/lib/supabase/server'
import { getSquareClient, SQUARE_LOCATION_ID } from '@/lib/square/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
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
  
  try {
    const body = await request.json()
    const { familyId, amountCents, dueDate, description } = body
    
    if (!familyId || !amountCents || !dueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Get family details
    const { data: family } = await supabase
      .from('families')
      .select('*, users!families_primary_user_id_fkey(email, name)')
      .eq('id', familyId)
      .single()
    
    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 })
    }
    
    // Create invoice with Square
    const squareClient = getSquareClient()
    const { result, statusCode } = await squareClient.invoicesApi.createInvoice({
      invoice: {
        locationId: SQUARE_LOCATION_ID,
        primaryRecipient: {
          customerId: family.square_customer_id, // Would need to create customer first
          emailAddress: family.users.email,
          givenName: family.users.name,
        },
        paymentRequests: [
          {
            requestType: 'BALANCE',
            dueDate,
            automaticPaymentSource: 'NONE',
          },
        ],
        lineItems: [
          {
            name: description || 'School Invoice',
            quantity: '1',
            basePriceMoney: {
              amount: BigInt(amountCents),
              currency: 'USD',
            },
          },
        ],
      },
      idempotencyKey: `${familyId}-${Date.now()}`,
    })
    
    if (statusCode !== 200 || !result.invoice) {
      throw new Error('Failed to create invoice')
    }
    
    // Store invoice in database
    const { data: invoice, error: dbError } = await supabase
      .from('invoices')
      .insert({
        square_invoice_id: result.invoice.id,
        family_id: familyId,
        amount_cents: amountCents,
        status: 'draft',
        due_at: dueDate,
        url: result.invoice.publicUrl,
      })
      .select()
      .single()
    
    if (dbError) {
      throw new Error('Failed to save invoice')
    }
    
    // Publish invoice
    await squareClient.invoicesApi.publishInvoice(result.invoice.id, {
      version: result.invoice.version,
      idempotencyKey: `publish-${result.invoice.id}`,
    })
    
    // Update status
    await supabase
      .from('invoices')
      .update({ status: 'sent', issued_at: new Date().toISOString() })
      .eq('id', invoice.id)
    
    return NextResponse.json(invoice, { status: 201 })
  } catch (error: any) {
    console.error('Invoice creation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    )
  }
}
