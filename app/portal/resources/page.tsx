import { createClient } from '@/lib/supabase/server'

export default async function ResourcesPage() {
  const supabase = await createClient()
  
  // Get published resources
  const { data: resources } = await supabase
    .from('parent_resources')
    .select('*')
    .eq('is_published', true)
    .order('category', { ascending: true })
    .order('title', { ascending: true })
  
  // Group by category
  const resourcesByCategory = resources?.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = []
    }
    acc[resource.category].push(resource)
    return acc
  }, {} as Record<string, typeof resources>)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Parent Resources</h1>
      
      {resourcesByCategory && Object.keys(resourcesByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(resourcesByCategory).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((resource) => (
                  <a
                    key={resource.id}
                    href={resource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition flex items-center gap-4"
                  >
                    <div className="flex-shrink-0">
                      <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-600">Click to download</p>
                    </div>
                    <div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-600 mb-2">No resources available yet</p>
          <p className="text-sm text-gray-500">
            Resources will appear here when they are published by the school
          </p>
        </div>
      )}
    </div>
  )
}
