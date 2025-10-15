import TourBookingForm from '@/components/tours/TourBookingForm'

export default function ScheduleTourPage() {
  const useGoogleEmbed = process.env.NEXT_PUBLIC_USE_GOOGLE_CALENDAR_EMBED === 'true'
  const calendarUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_APPOINTMENT_URL

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-4">Schedule a Tour</h1>
      <p className="text-xl text-gray-600 mb-8">
        Visit our campus and see firsthand what makes Sunrise School special.
        Meet our educators and explore our learning spaces.
      </p>
      
      {useGoogleEmbed && calendarUrl ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <iframe
            src={calendarUrl}
            width="100%"
            height="600"
            frameBorder="0"
            className="w-full"
          ></iframe>
        </div>
      ) : (
        <TourBookingForm />
      )}
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">What to Expect</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Tour duration: approximately 45 minutes</li>
          <li>• Meet with our admissions team</li>
          <li>• Visit classrooms and learning spaces</li>
          <li>• Ask questions about our programs</li>
          <li>• Learn about enrollment process</li>
        </ul>
      </div>
    </div>
  )
}
