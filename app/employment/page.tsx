export default function EmploymentPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Employment Opportunities</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-6">
          Join our team of dedicated educators and staff committed to excellence
          in early childhood education.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Why Work With Us</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Supportive and collaborative work environment</li>
          <li>Professional development opportunities</li>
          <li>Competitive compensation and benefits</li>
          <li>Small class sizes and quality resources</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Current Openings</h2>
        <p>
          We are always looking for passionate educators. Please send your resume
          and cover letter to{' '}
          <a href="mailto:careers@sunriseschoolmiami.org" className="text-blue-600 hover:underline">
            careers@sunriseschoolmiami.org
          </a>
        </p>
        
        <div className="bg-blue-50 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-2">Application Requirements</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Bachelor's degree in Early Childhood Education or related field</li>
            <li>State teaching certification (preferred)</li>
            <li>Experience working with young children</li>
            <li>Strong communication and interpersonal skills</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
