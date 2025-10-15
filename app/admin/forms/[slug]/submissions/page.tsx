import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function FormSubmissionsPage({ params }: { params: { slug: string } }) {
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
  
  // Get form
  const { data: form } = await supabase
    .from('forms')
    .select('*')
    .eq('slug', params.slug)
    .single()
  
  if (!form) {
    redirect('/admin/forms')
  }
  
  // Get submissions
  const { data: submissions } = await supabase
    .from('form_submissions')
    .select('*, contact:crm_contacts(email, first_name, last_name)')
    .eq('form_id', form.id)
    .order('submitted_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/forms" className="text-blue-600 hover:underline mb-2 inline-block">
          ← Back to Forms
        </Link>
        <h1 className="text-3xl font-bold">{form.title} - Submissions</h1>
      </div>

      {!submissions || submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission: any) => (
            <div key={submission.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(submission.submitted_at).toLocaleString()}
                  </p>
                  {submission.contact && (
                    <p className="text-sm text-gray-500">
                      Contact: {submission.contact.first_name} {submission.contact.last_name} ({submission.contact.email})
                    </p>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                {Object.entries(submission.data as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-2">
                    <span className="text-sm font-medium text-gray-700">{key}:</span>
                    <span className="text-sm text-gray-900 ml-2">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
