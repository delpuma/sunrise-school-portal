import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (!userData || !['admin', 'staff'].includes(userData.role)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm p-4 sticky top-8">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Admin Panel</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/events"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/invoices"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Invoices
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/blog"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Blog Posts
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/resources"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/forms"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Forms
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/crm"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    CRM
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/ai-tools"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    AI Tools
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/users"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    href="/admin/audit-logs"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition"
                  >
                    Audit Logs
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
