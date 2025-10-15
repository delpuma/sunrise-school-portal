import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

export interface APIError {
  message: string
  code?: string
  status: number
}

export class AppError extends Error {
  public readonly status: number
  public readonly code?: string

  constructor(message: string, status = 500, code?: string) {
    super(message)
    this.status = status
    this.code = code
    this.name = 'AppError'
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error('API Error:', error)

  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    )
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: 'Validation failed', details: error.errors },
      { status: 400 }
    )
  }

  if (error instanceof Error) {
    const message = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }

  return NextResponse.json(
    { error: 'Unknown error occurred' },
    { status: 500 }
  )
}

export function validateRequiredFields(data: any, fields: string[]): void {
  const missing = fields.filter(field => !data[field])
  if (missing.length > 0) {
    throw new AppError(`Missing required fields: ${missing.join(', ')}`, 400)
  }
}