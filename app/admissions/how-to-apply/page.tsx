import Link from 'next/link'

export default function HowToApplyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">How to Apply</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your interest in Sunrise School of Miami. We look forward to
          welcoming your family to our community.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 mt-0">Application Process</h2>
          <ol className="space-y-3 mb-0">
            <li>Schedule a campus tour to learn about our programs</li>
            <li>Complete the online application through FACTS Family Portal</li>
            <li>Submit required documents and application fee</li>
            <li>Attend a family interview (if applicable)</li>
            <li>Receive admission decision</li>
          </ol>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Apply Online</h2>
          <p className="text-gray-600 mb-6">
            Our application process is managed through FACTS Family Portal, a secure
            online platform for enrollment and tuition management.
          </p>
          <a
            href="https://factsmgt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition no-underline"
          >
            Apply via FACTS Family Portal
          </a>
          <p className="text-sm text-gray-500 mt-4">
            You will be redirected to the FACTS website
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Required Documents</h2>
        <ul className="space-y-2 mb-8">
          <li>Completed application form</li>
          <li>Birth certificate</li>
          <li>Immunization records</li>
          <li>Previous school records (if applicable)</li>
          <li>Application fee</li>
        </ul>

        <h2 className="text-2xl font-semibold mb-4">Important Dates</h2>
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Application Opens</h3>
              <p className="text-gray-600">October 1st</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Priority Deadline</h3>
              <p className="text-gray-600">January 15th</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Regular Deadline</h3>
              <p className="text-gray-600">March 1st</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Decisions Sent</h3>
              <p className="text-gray-600">Rolling basis</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
        <p className="mb-4">
          Our admissions team is here to help guide you through the application process.
        </p>
        <div className="bg-gray-50 rounded-lg p-6">
          <p className="mb-2">
            <strong>Email:</strong>{' '}
            <a href="mailto:admissions@sunriseschoolmiami.org" className="text-blue-600 hover:underline">
              admissions@sunriseschoolmiami.org
            </a>
          </p>
          <p className="mb-2">
            <strong>Phone:</strong>{' '}
            <a href="tel:+1234567890" className="text-blue-600 hover:underline">
              (123) 456-7890
            </a>
          </p>
          <p className="mb-0">
            <strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/admissions/schedule-tour"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition no-underline"
          >
            Schedule a Tour
          </Link>
          <Link
            href="/admissions/tuition-fees"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition no-underline"
          >
            View Tuition & Fees
          </Link>
        </div>
      </div>
    </div>
  )
}
