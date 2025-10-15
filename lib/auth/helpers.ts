import { createClient } from '@/lib/supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return data?.role || null
}

export async function isAdmin() {
  const role = await getUserRole()
  return role === 'admin' || role === 'staff'
}

export async function isParent() {
  const role = await getUserRole()
  return role === 'parent'
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  const admin = await isAdmin()
  if (!admin) {
    throw new Error('Forbidden')
  }
  return user
}
