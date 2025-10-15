import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SquarePaymentForm from '@/components/payment/SquarePaymentForm'

export default async function PaymentPage({
  params,
}: {
  params: { registrationId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }
  
  const { data: registration } = await supabase
    .from('registrations')
    .select('*, events(*)')
    .eq('id', params.registrationId)
    .eq('user_id', user.id)
    .single()
  
  if (!registration) {
    redirect('/portal/registrations')
  }
  
  if (registration.status === 'paid') {
    redirect('/portal/registrations')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Your Payment</h1>
        <p className="text-gray-600">
          Event: {registration.events?.title}
        </p>
      </div>
      
      <SquarePaymentForm
        registrationId={registration.id}
        amount={registration.total_cents}
      />
    </div>
  )
}
