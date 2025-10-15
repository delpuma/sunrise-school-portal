import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
  description: z.string().optional(),
  schema: z.record(z.any()),
  is_active: z.boolean().default(true),
})

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')
  
  if (slug) {
    // Get specific form by slug
    const { data: form, error } = await supabase
      .from('forms')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single()
    
    if (error || !form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }
    
    return NextResponse.json({ form })
  }
  
  // List all active forms (public)
  const { data: forms, error } = await supabase
    .from('forms')
    .select('id, title, slug, description, is_active')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Forms query error:', { errorCode: error.code, message: error.message })
    return NextResponse.json({ error: 'Failed to fetch forms' }, { status: 500 })
  }
  
  return NextResponse.json({ forms })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Check if user is admin/staff
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
    const validatedData = formSchema.parse(body)
    
    const { data: form, error } = await supabase
      .from('forms')
      .insert({
        ...validatedData,
        created_by: user.id,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Form creation error:', { errorCode: error.code, message: error.message })
      return NextResponse.json({ error: 'Failed to create form' }, { status: 500 })
    }
    
    return NextResponse.json({ form })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Form API error:', { message: error?.message || 'Unknown error' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
