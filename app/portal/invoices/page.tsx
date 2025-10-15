import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function InvoicesPage() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    // Get user's family
    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('*')
      .or(`primary_user_id.eq.${user.id},secondary_user_id.eq.${user.id}`)
      .single()
    
    if (familyError) {
      console.error('Family query error:', { errorCode: familyError.code, message: familyError.message })
      return <div>Error loading family data</div>
    }
    
    // Get all invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('*')
      .eq('family_id', family?.id)
      .order('due_at', { ascending: false })
    
    if (invoicesError) {
      console.error('Invoices query error:', { errorCode: invoicesError.code, message: invoicesError.message })
      return <div>Error loading invoices</div>
    }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Invoices</h1>
      
      {invoices && invoices.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.issued_at 
                      ? new Date(invoice.issued_at).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.due_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${(invoice.amount_cents / 100).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : invoice.status === 'sent'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {invoice.status !== 'paid' && invoice.url ? (
                      <a
                        href={invoice.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Pay Now →
                      </a>
                    ) : invoice.status === 'paid' ? (
                      <span className="text-gray-500">Paid</span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-600 mb-4">No invoices found</p>
          <p className="text-sm text-gray-500">
            Invoices will appear here when they are issued by the school
          </p>
        </div>
      )}
    </div>
  )
  } catch (error) {
    console.error('Invoices page error:', error)
    return <div>Error loading invoices</div>
  }
}
