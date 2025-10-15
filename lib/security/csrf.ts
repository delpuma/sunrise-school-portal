import { NextRequest } from 'next/server'
import crypto from 'crypto'

const CSRF_SECRET = process.env.CSRF_SECRET || 'default-secret-change-in-production'

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token') || 
                request.headers.get('csrf-token')
  
  if (!token) {
    return false
  }
  
  // In production, implement proper CSRF token validation
  // This is a simplified version
  return token.length === 64 && /^[a-f0-9]+$/.test(token)
}

export function requireCSRF(request: NextRequest): boolean {
  const method = request.method
  const contentType = request.headers.get('content-type') || ''
  
  // Require CSRF for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    // Skip CSRF for API routes with JSON content type from same origin
    if (contentType.includes('application/json')) {
      const origin = request.headers.get('origin')
      const host = request.headers.get('host')
      
      // Allow same-origin requests
      if (origin && host && origin.includes(host)) {
        return true
      }
    }
    
    return validateCSRFToken(request)
  }
  
  return true
}