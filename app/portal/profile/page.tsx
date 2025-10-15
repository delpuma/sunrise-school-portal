import { createClient } from '@/lib/supabase/server'
import ProfileForm from '@/components/portal/ProfileForm'

export default async function ProfilePage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (userError) {
      console.error('User query error:', { errorCode: userError.code, message: userError.message })
      return <div>Error loading user data</div>
    }
    
    // Get family data
    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('*')
      .or(`primary_user_id.eq.${user.id},secondary_user_id.eq.${user.id}`)
      .maybeSingle()
    
    if (familyError) {
      console.error('Family query error:', { errorCode: familyError.code, message: familyError.message })
      throw new Error('Failed to load family data')
    }
    
    // Get students
    let students = []
    if (family?.id) {
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('family_id', family.id)
        .order('dob', { ascending: true })
      
      if (studentsError) {
        console.error('Students query error:', { errorCode: studentsError.code, message: studentsError.message })
        throw new Error('Failed to load students data')
      }
      
      students = studentsData || []
    }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Family Profile</h1>
      
      <ProfileForm 
        user={userData}
        family={family}
        students={students}
      />
    </div>
  )
  } catch (error: any) {
    console.error('Profile page error:', { message: error?.message || 'Unknown error' })
    return <div>Error loading profile</div>
  }
}
