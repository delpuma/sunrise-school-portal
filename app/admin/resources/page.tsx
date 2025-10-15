import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminResourcesPage() {
  const supabase = await createClient()
  
  const { data: resources } = await supabase
    .from('parent_resources')
    .select('*')
    .order('category', { ascending: true })
    .order('created_at', { ascending: false })

  const resourcesByCategory = resources?.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = []
    }
    acc[resource.category].push(resource)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resource Management</h1>
        <Link
          href="/admin/resources/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload Resource
        </Link>
      </div>
      
      {resourcesByCategory && Object.keys(resourcesByCategory).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(resourcesByCategory).map(([category, items]) => (
            <div key={category} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <div className="space-y-3">
                {(items as any[]).map((resource: any) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-gray-900">{resource.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(resource.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        resource.is_published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {resource.is_published ? 'Published' : 'Draft'}
                      </span>
                      <a
                        href={resource.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 mr-2"
                      >
                        Download
                      </a>
                      <Link
                        href={`/admin/resources/${resource.id}`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
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
          <p className="text-gray-600 mb-4">No resources yet</p>
          <Link
            href="/admin/resources/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Upload Your First Resource
          </Link>
        </div>
      )}
    </div>
  )
}
