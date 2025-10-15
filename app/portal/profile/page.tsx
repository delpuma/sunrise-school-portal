import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/portal/ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Get user data
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
  
  // Get family data
  const { data: family } = await supabase
    .from('families')
    .select('*')
    .or(`primary_user_id.eq.${user.id},secondary_user_id.eq.${user.id}`)
    .single()
  
  // Get students
  const { data: students } = await supabase
    .from('students')
    .select('*')
    .eq('family_id', family?.id)
    .order('dob', { ascending: true })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Family Profile</h1>
      
      <ProfileForm 
        user={userData}
        family={family}
        students={students || []}
      />
    </div>
  )
}
