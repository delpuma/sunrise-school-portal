import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { trackInteraction } from '@/lib/crm/interactions'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient()
  
  try {
    // Get form
    const { data: form, error: formError } = await supabase
      .from('forms')
      .select('*')
      .eq('slug', params.slug)
      .eq('is_active', true)
      .single()
    
    if (formError || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }
    
    const body = await request.json()
    const { data: formData } = body
    
    // Validate required fields based on form schema
    const schema = form.schema as Record<string, any>
    const fields = schema.fields || []
    
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        return NextResponse.json(
          { error: `Field "${field.label}" is required` },
          { status: 400 }
        )
      }
    }
    
    // Create or find contact if email is provided
    let contactId = null
    if (formData.email) {
      const { data: contact } = await supabase
        .from('crm_contacts')
        .select('id')
        .eq('email', formData.email)
        .single()
      
      if (contact) {
        contactId = contact.id
      } else {
        // Create new contact
        const { data: newContact } = await supabase
          .from('crm_contacts')
          .insert({
            email: formData.email,
            first_name: formData.first_name || formData.firstName || null,
            last_name: formData.last_name || formData.lastName || null,
            phone: formData.phone || null,
            status: 'lead',
            source: `form_${params.slug}`,
          })
          .select('id')
          .single()
        
        if (newContact) {
          contactId = newContact.id
        }
      }
      
      // Track interaction
      await trackInteraction(formData.email, 'form_submission', {
        form_slug: params.slug,
        form_title: form.title,
      })
    }
    
    // Create submission
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .insert({
        form_id: form.id,
        data: formData,
        contact_id: contactId,
      })
      .select()
      .single()
    
    if (submissionError) {
      return NextResponse.json({ error: submissionError.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true,
      submission,
      message: 'Form submitted successfully'
    })
  } catch (error: any) {
    console.error('Form submission error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
