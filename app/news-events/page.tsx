import Link from 'next/link'

export default function NewsEventsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">News & Events</h1>
      
      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-xl text-gray-600">
          Stay connected with our school community through events, programs, and celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          href="/news-events/summer-camp"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Summer Camp</h2>
          <p className="text-gray-600">
            Explore our exciting summer camp programs.
          </p>
        </Link>

        <Link
          href="/news-events/community"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Community</h2>
          <p className="text-gray-600">
            Learn about our community initiatives and partnerships.
          </p>
        </Link>

        <Link
          href="/news-events/community-education"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Community Education</h2>
          <p className="text-gray-600">
            Discover educational programs for the wider community.
          </p>
        </Link>

        <Link
          href="/news-events/festivals"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Festivals and Celebrations</h2>
          <p className="text-gray-600">
            Join us for seasonal festivals and special celebrations.
          </p>
        </Link>
      </div>
    </div>
  )
}
