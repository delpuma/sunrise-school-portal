import Link from 'next/link'

export default function CurriculumPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Our Curriculum</h1>
      
      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-xl text-gray-600">
          Our curriculum is designed to foster holistic development through play-based learning,
          hands-on experiences, and individualized attention.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          href="/curriculum/what-we-strive"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">What We Strive to Achieve</h2>
          <p className="text-gray-600">
            Learn about our educational philosophy and goals for student development.
          </p>
        </Link>

        <Link
          href="/curriculum/early-childhood"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Early Childhood Program</h2>
          <p className="text-gray-600">
            Discover our comprehensive early childhood education approach.
          </p>
        </Link>

        <Link
          href="/curriculum/parent-child"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Parent Child Program</h2>
          <p className="text-gray-600">
            Explore our unique parent-child learning experiences.
          </p>
        </Link>

        <Link
          href="/curriculum/by-grades"
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-3">Curriculum by the Grades</h2>
          <p className="text-gray-600">
            View detailed curriculum information for each grade level.
          </p>
        </Link>
      </div>
    </div>
  )
}
