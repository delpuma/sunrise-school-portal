import HeroSection from '@/components/home/HeroSection'
import EventsRail from '@/components/home/EventsRail'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <EventsRail />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold mb-2">Quality Education</h3>
            <p className="text-gray-600">
              Innovative curriculum designed for early childhood development
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
            <p className="text-gray-600">
              Building strong relationships between families and educators
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-2">Holistic Growth</h3>
            <p className="text-gray-600">
              Nurturing social, emotional, and cognitive development
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
