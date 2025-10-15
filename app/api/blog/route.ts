import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  
  const tag = searchParams.get('tag')
  
  let query = supabase
    .from('blog_posts')
    .select('*')
    .not('published_at', 'is', null)
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false })
  
  if (tag) {
    query = query.contains('tags', [tag])
  }
  
  const { data, error } = await query
  
  if (error) {
    console.error('Blog query error:', { errorCode: error.code, message: error.message });
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 })
  }
  
  return NextResponse.json(data)
}

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
  
  const body = await request.json()
  
  const { data, error } = await supabase
    .from('blog_posts')
    .insert({
      ...body,
      created_by: user.id,
    })
    .select()
    .single()
  
  if (error) {
    console.error('Blog creation error:', { errorCode: error.code, message: error.message });
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 })
  }
  
  return NextResponse.json(data, { status: 201 })
}
