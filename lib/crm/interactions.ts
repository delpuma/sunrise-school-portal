import { createClient } from '@/lib/supabase/server'

export type InteractionType = 
  | 'form_submission'
  | 'tour_booking'
  | 'event_registration'
  | 'email_open'
  | 'page_visit'

export async function trackInteraction(
  email: string,
  type: InteractionType,
  details?: Record<string, any>
) {
  const supabase = await createClient()
  
  // Find or create contact
  let { data: contact } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('email', email)
    .single()
  
  if (!contact) {
    // Create new contact
    const { data: newContact, error } = await supabase
      .from('crm_contacts')
      .insert({
        email,
        status: 'lead',
        source: type,
        engagement_score: 0,
      })
      .select()
      .single()
    
    if (error || !newContact) {
      console.error('Failed to create contact:', { errorCode: error?.code, message: error?.message })
      return
    }
    
    contact = newContact
  }
  
  // Create interaction
  const { error: interactionError } = await supabase.from('crm_interactions').insert({
    contact_id: contact.id,
    type,
    details,
  })
  
  if (interactionError) {
    console.error('Failed to create interaction:', { errorCode: interactionError.code, message: interactionError.message })
    return
  }
  
  // Update engagement score
  const scoreIncrement = getScoreIncrement(type)
  const { error: updateError } = await supabase
    .from('crm_contacts')
    .update({
      engagement_score: (contact.engagement_score || 0) + scoreIncrement,
    })
    .eq('id', contact.id)
  
  if (updateError) {
    console.error('Failed to update engagement score:', { errorCode: updateError.code, message: updateError.message })
  }
}

function getScoreIncrement(type: InteractionType): number {
  switch (type) {
    case 'form_submission': return 10
    case 'tour_booking': return 20
    case 'event_registration': return 15
    case 'email_open': return 2
    case 'page_visit': return 1
    default: return 1
  }
}

export async function updateContactFromBooking(
  email: string,
  name: string,
  phone?: string
) {
  const supabase = await createClient()
  
  const [firstName, ...lastNameParts] = name.split(' ')
  const lastName = lastNameParts.join(' ')
  
  const { error } = await supabase
    .from('crm_contacts')
    .upsert({
      email,
      first_name: firstName,
      last_name: lastName || null,
      phone: phone || null,
      status: 'prospect',
      source: 'tour_booking',
    }, {
      onConflict: 'email',
      ignoreDuplicates: false,
    })
  
  if (error) {
    console.error('Failed to update contact from booking:', { errorCode: error.code, message: error.message })
  }
}
