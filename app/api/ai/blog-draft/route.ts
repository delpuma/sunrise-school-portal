import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const blogDraftSchema = z.object({
  topic: z.string().min(1, 'Topic is required'),
  tone: z.enum(['professional', 'friendly', 'informative', 'inspirational']).optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
})

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
    const { topic, tone = 'friendly', length = 'medium' } = blogDraftSchema.parse(body)
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        draft: null 
      }, { status: 503 })
    }
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a professional content writer for Sunrise School of Miami, a Montessori school. Write engaging, informative blog posts that resonate with parents and educators. Use a ${tone} tone.`
          },
          {
            role: 'user',
            content: `Write a ${length} blog post about: ${topic}\n\nFormat the response in Markdown with a title, introduction, main sections with headings, and a conclusion. Include practical examples and insights relevant to Montessori education.`
          }
        ],
        temperature: 0.7,
        max_tokens: length === 'short' ? 500 : length === 'medium' ? 1000 : 1500,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API error')
    }
    
    const data = await response.json()
    const draft = data.choices[0]?.message?.content
    
    if (!draft) {
      throw new Error('No content generated')
    }
    
    return NextResponse.json({ 
      draft,
      warning: 'This is AI-generated content. Please review and edit before publishing.'
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
