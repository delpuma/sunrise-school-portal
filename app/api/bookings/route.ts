import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { trackInteraction, updateContactFromBooking } from '@/lib/crm/interactions'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  try {
    const body = await request.json()
    const { name, email, phone, date, time, notes } = body
    
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Combine date and time
    const startAt = new Date(`${date}T${time}:00`)
    const endAt = new Date(startAt.getTime() + 45 * 60000) // 45 minutes later
    
    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        calendar_id: 'default',
        booking_name: name,
        email,
        phone,
        start_at: startAt.toISOString(),
        end_at: endAt.toISOString(),
        status: 'pending',
        notes,
      })
      .select()
      .single()
    
    if (error) {
      throw new Error(error.message)
    }
    
    // Track CRM interaction
    await updateContactFromBooking(email, name, phone)
    await trackInteraction(email, 'tour_booking', {
      booking_id: booking.id,
      date: startAt.toISOString(),
    })
    
    // TODO: Create Google Calendar event if configured
    // const googleCalendarId = process.env.GOOGLE_CALENDAR_ID
    // if (googleCalendarId) {
    //   // Create event via Google Calendar API
    // }
    
    return NextResponse.json(booking, { status: 201 })
  } catch (error: any) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    )
  }
}
