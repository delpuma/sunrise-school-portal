import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { name } = body
  
  const { error } = await supabase
    .from('users')
    .update({ name })
    .eq('id', user.id)
  
  if (error) {
    console.error('User update error:', { errorCode: error.code, message: error.message });
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
  }
  
  // Create audit log
  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update',
    target_table: 'users',
    target_id: user.id,
    changes: { name },
  })
  
  return NextResponse.json({ success: true })
}
