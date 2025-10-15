import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FormBuilder from '@/components/admin/FormBuilder'

export default async function NewFormPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  // Check if user is admin/staff
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!userData || !['admin', 'staff'].includes(userData.role)) {
    redirect('/portal/dashboard')
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Create New Form</h1>
      <FormBuilder mode="create" />
    </div>
  )
}
