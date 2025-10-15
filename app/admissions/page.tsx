import Link from 'next/link'

export default function AdmissionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Admissions</h1>
      
      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-xl text-gray-600">
          We welcome families who share our commitment to providing children with
          a nurturing and enriching educational experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          href="/admissions/how-to-apply"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">How to Apply</h2>
          <p className="text-gray-600">
            Learn about our application process and requirements.
          </p>
        </Link>

        <Link
          href="/admissions/tuition-fees"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Annual Tuition and Fees</h2>
          <p className="text-gray-600">
            View our tuition rates and fee structure.
          </p>
        </Link>

        <Link
          href="/admissions/schedule-tour"
          className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Schedule a Tour</h2>
          <p>
            Visit our campus and meet our educators.
          </p>
        </Link>
      </div>
    </div>
  )
}
