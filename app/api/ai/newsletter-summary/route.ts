import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const summarySchema = z.object({
  content: z.string().min(1, 'Content is required'),
  maxLength: z.number().optional(),
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
    const { content, maxLength = 200 } = summarySchema.parse(body)
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        summary: null 
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
            content: 'You are a professional editor creating concise, engaging summaries for school newsletters. Capture the key points while maintaining a warm, community-focused tone.'
          },
          {
            role: 'user',
            content: `Summarize the following newsletter content in approximately ${maxLength} words. Focus on the most important information and maintain an engaging tone:\n\n${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: Math.ceil(maxLength * 1.5),
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API error')
    }
    
    const data = await response.json()
    const summary = data.choices[0]?.message?.content
    
    if (!summary) {
      throw new Error('No summary generated')
    }
    
    return NextResponse.json({ 
      summary,
      warning: 'This is AI-generated content. Please review before using.'
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
