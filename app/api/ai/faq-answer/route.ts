import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const faqSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  context: z.string().optional(),
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
    const { question, context } = faqSchema.parse(body)
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        answer: null 
      }, { status: 503 })
    }
    
    const systemPrompt = `You are a knowledgeable representative of Sunrise School of Miami, a Montessori school. Answer parent questions clearly, accurately, and warmly. Focus on Montessori philosophy, child development, and practical school information.`
    
    const userPrompt = context 
      ? `Question: ${question}\n\nAdditional context: ${context}\n\nProvide a clear, helpful answer.`
      : `Question: ${question}\n\nProvide a clear, helpful answer.`
    
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API error')
    }
    
    const data = await response.json()
    const answer = data.choices[0]?.message?.content
    
    if (!answer) {
      throw new Error('No answer generated')
    }
    
    return NextResponse.json({ 
      answer,
      warning: 'This is AI-generated content. Please review for accuracy before using.'
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
