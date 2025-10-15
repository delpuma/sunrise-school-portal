import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AIFAQAssistant from '@/components/admin/AIFAQAssistant'

export default async function AIToolsPage() {
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
  
  const isConfigured = !!process.env.OPENAI_API_KEY

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">AI Content Tools</h1>
      
      {!isConfigured && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            <strong>Note:</strong> OpenAI API key is not configured. AI features will not work until you add your API key to the environment variables.
          </p>
        </div>
      )}

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Available AI Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">✍️</div>
              <h3 className="font-semibold mb-2">Blog Draft Generator</h3>
              <p className="text-sm text-gray-600 mb-3">
                Generate blog post drafts on any topic with customizable tone and length.
              </p>
              <p className="text-xs text-gray-500">
                Available in the blog editor
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">❓</div>
              <h3 className="font-semibold mb-2">FAQ Answer Generator</h3>
              <p className="text-sm text-gray-600 mb-3">
                Get AI-generated answers to common parent questions.
              </p>
              <p className="text-xs text-gray-500">
                Available below
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl mb-2">📰</div>
              <h3 className="font-semibold mb-2">Newsletter Summarizer</h3>
              <p className="text-sm text-gray-600 mb-3">
                Create concise summaries of newsletter content.
              </p>
              <p className="text-xs text-gray-500">
                API endpoint available
              </p>
            </div>
          </div>
        </div>

        <AIFAQAssistant />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Important Notes</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>All AI-generated content should be reviewed and edited before publishing</li>
            <li>AI tools are meant to assist, not replace human judgment</li>
            <li>Verify factual accuracy, especially for school-specific information</li>
            <li>Ensure the tone and style match your school's voice</li>
            <li>AI usage is logged for quality assurance</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
