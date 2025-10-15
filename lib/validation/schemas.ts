// Validation schemas using basic validation
// In production, consider using Zod for more robust validation

export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

export function validatePhone(phone: string): boolean {
  if (!phone || typeof phone !== 'string') {
    return false
  }
  const phoneRegex = /^\+?[\d\s\-()]+$/
  return phoneRegex.test(phone.trim())
}

export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  return input.trim().replace(/[<>"'&]/g, '')
}

export function validateEventData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid event data')
    return { valid: false, errors }
  }
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters')
  }
  
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length < 3) {
    errors.push('Slug must be at least 3 characters')
  }
  
  if (!data.type || typeof data.type !== 'string') {
    errors.push('Event type is required')
  }
  
  if (!data.start_at) {
    errors.push('Start date is required')
  }
  
  if (!data.end_at) {
    errors.push('End date is required')
  }
  
  if (data.capacity !== undefined && (typeof data.capacity !== 'number' || data.capacity < 1)) {
    errors.push('Capacity must be at least 1')
  }
  
  if (data.price_cents !== undefined && (typeof data.price_cents !== 'number' || data.price_cents < 0)) {
    errors.push('Price cannot be negative')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateBlogPostData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data || typeof data !== 'object') {
    errors.push('Invalid blog post data')
    return { valid: false, errors }
  }
  
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters')
  }
  
  if (!data.slug || typeof data.slug !== 'string' || data.slug.trim().length < 3) {
    errors.push('Slug must be at least 3 characters')
  }
  
  if (!data.content || typeof data.content !== 'string' || data.content.trim().length < 10) {
    errors.push('Content must be at least 10 characters')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}
