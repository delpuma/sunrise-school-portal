export default function GivePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold mb-8">Support Our School</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-xl text-gray-600 mb-8">
          Your generous donations help us provide exceptional educational experiences
          and maintain our facilities for current and future students.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Annual Fundraiser</h2>
            <p className="text-gray-600 mb-6">
              Support our annual fundraising campaign to enhance educational programs
              and provide scholarships for families in need.
            </p>
            <button className="w-full px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 transition">
              Donate to Annual Fund
            </button>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Capital Campaign</h2>
            <p className="text-gray-600 mb-6">
              Help us invest in facility improvements and new learning spaces
              that will benefit generations of students.
            </p>
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">
              Support Capital Campaign
            </button>
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mt-8">
          <h3 className="text-xl font-semibold mb-3">Other Ways to Give</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Matching gifts from your employer</li>
            <li>Planned giving and legacy gifts</li>
            <li>In-kind donations of supplies and materials</li>
            <li>Volunteer your time and expertise</li>
          </ul>
        </div>

        <p className="mt-8 text-sm text-gray-600">
          Sunrise School of Miami is a 501(c)(3) nonprofit organization.
          All donations are tax-deductible to the extent allowed by law.
        </p>
      </div>
    </div>
  )
}
