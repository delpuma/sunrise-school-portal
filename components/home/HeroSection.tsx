import Link from 'next/link'

export default function HeroSection() {
  return (
    <div className="relative bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Sunrise School of Miami
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Nurturing young minds through innovative early childhood education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admissions/schedule-tour"
              className="px-8 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Schedule a Tour
            </Link>
            <Link
              href="/admissions/how-to-apply"
              className="px-8 py-3 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800 transition"
            >
              Apply/Enroll
            </Link>
            <Link
              href="/give"
              className="px-8 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition"
            >
              Donate
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
