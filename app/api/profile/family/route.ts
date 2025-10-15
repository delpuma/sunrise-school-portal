import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const body = await request.json()
  const { address, phone } = body
  
  // Get user's family
  const { data: family } = await supabase
    .from('families')
    .select('*')
    .or(`primary_user_id.eq.${user.id},secondary_user_id.eq.${user.id}`)
    .single()
  
  if (!family) {
    return NextResponse.json({ error: 'Family not found' }, { status: 404 })
  }
  
  const { error } = await supabase
    .from('families')
    .update({ address, phone })
    .eq('id', family.id)
  
  if (error) {
    console.error('Family update error:', { errorCode: error.code, message: error.message });
    return NextResponse.json({ error: 'Failed to update family profile' }, { status: 500 })
  }
  
  // Create audit log
  await supabase.from('audit_logs').insert({
    actor_id: user.id,
    action: 'update',
    target_table: 'families',
    target_id: family.id,
    changes: { address, phone },
  })
  
  return NextResponse.json({ success: true })
}
