import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  grade: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await request.json()
    const validatedData = studentSchema.parse(body)
    
    // Get user's family
    const { data: family } = await supabase
      .from('families')
      .select('*')
      .or(`primary_user_id.eq.${user.id},secondary_user_id.eq.${user.id}`)
      .single()
    
    if (!family) {
      return NextResponse.json({ error: 'Family not found' }, { status: 404 })
    }
    
    const { data: student, error } = await supabase
      .from('students')
      .insert({
        family_id: family.id,
        ...validatedData,
      })
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    // Create audit log
    await supabase.from('audit_logs').insert({
      actor_id: user.id,
      action: 'create',
      target_table: 'students',
      target_id: student.id,
      changes: validatedData,
    })
    
    return NextResponse.json({ student })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
