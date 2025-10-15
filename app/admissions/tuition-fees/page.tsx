import Link from 'next/link'

export default function TuitionFeesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Annual Tuition and Fees</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          We strive to make quality education accessible while maintaining the highest
          standards of teaching and learning.
        </p>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
          <div className="bg-blue-600 text-white px-6 py-4">
            <h2 className="text-2xl font-semibold m-0">2024-2025 Tuition Rates</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg mb-1">Parent-Child Program</h3>
                <p className="text-gray-600 text-sm mb-0">Ages 18 months - 3 years</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 mb-0">$8,500</p>
                <p className="text-sm text-gray-500 mb-0">per year</p>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg mb-1">Early Childhood Program</h3>
                <p className="text-gray-600 text-sm mb-0">Ages 3 - 6 years</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 mb-0">$12,500</p>
                <p className="text-sm text-gray-500 mb-0">per year</p>
              </div>
            </div>
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg mb-1">Elementary Program</h3>
                <p className="text-gray-600 text-sm mb-0">Grades 1 - 6</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600 mb-0">$14,500</p>
                <p className="text-sm text-gray-500 mb-0">per year</p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Additional Fees</h2>
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <ul className="space-y-3 mb-0">
            <li className="flex justify-between">
              <span>Application Fee (non-refundable)</span>
              <span className="font-semibold">$150</span>
            </li>
            <li className="flex justify-between">
              <span>Registration Fee (annual)</span>
              <span className="font-semibold">$500</span>
            </li>
            <li className="flex justify-between">
              <span>Materials Fee (annual)</span>
              <span className="font-semibold">$300</span>
            </li>
            <li className="flex justify-between">
              <span>After-School Care (per hour)</span>
              <span className="font-semibold">$15</span>
            </li>
          </ul>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Payment Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">Annual Payment</h3>
            <p className="text-gray-600 mb-3">
              Pay tuition in full by August 1st and receive a 3% discount.
            </p>
            <p className="text-sm text-blue-600 font-semibold mb-0">Save up to $435</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-lg mb-3">Monthly Payment Plan</h3>
            <p className="text-gray-600 mb-3">
              Spread payments over 10 months (August - May) through FACTS.
            </p>
            <p className="text-sm text-gray-600 mb-0">No additional fees</p>
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 mt-0">Financial Assistance</h2>
          <p className="mb-4">
            We believe that financial circumstances should not prevent qualified students
            from attending Sunrise School. Financial aid is available based on demonstrated
            need.
          </p>
          <p className="mb-0">
            To apply for financial assistance, please complete the FACTS Grant & Aid
            Assessment application after submitting your enrollment application.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Tuition Management</h2>
        <p className="mb-4">
          All tuition payments are processed through FACTS Tuition Management, a secure
          and convenient online payment system.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-6 text-center mb-8">
          <a
            href="https://factsmgt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition no-underline"
          >
            Manage Tuition via FACTS
          </a>
          <p className="text-sm text-gray-500 mt-4 mb-0">
            Existing families can log in to make payments and view statements
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/admissions/how-to-apply"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition no-underline"
          >
            Apply Now
          </Link>
          <Link
            href="/admissions/schedule-tour"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition no-underline"
          >
            Schedule a Tour
          </Link>
        </div>
      </div>
    </div>
  )
}
