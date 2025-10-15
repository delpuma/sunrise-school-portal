export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">About Sunrise School of Miami</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          Sunrise School of Miami is dedicated to providing exceptional early childhood education
          in a nurturing and stimulating environment.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
        <p>
          We strive to create a community where children develop a love of learning,
          build strong social connections, and grow into confident, curious individuals.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our History</h2>
        <p>
          Founded with a vision to provide quality early childhood education, Sunrise School
          has been serving families in Miami for years, building a reputation for excellence
          and innovation in education.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Respect for each child's unique development and learning style</li>
          <li>Strong partnerships with families and the community</li>
          <li>Commitment to excellence in early childhood education</li>
          <li>Creating a safe, nurturing, and inclusive environment</li>
        </ul>
      </div>
    </div>
  )
}
