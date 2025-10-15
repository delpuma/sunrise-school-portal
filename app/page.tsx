import HeroSection from '@/components/home/HeroSection'
import EventsRail from '@/components/home/EventsRail'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main>
      <HeroSection />
      
      {/* Values Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why Choose Sunrise School?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe in nurturing the whole child through innovative education, 
              creative expression, and meaningful community connections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center card-hover bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🎨</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Creative Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Art, music, and imaginative play are woven into every aspect of our curriculum, 
                fostering creativity and self-expression.
              </p>
            </div>
            
            <div className="text-center card-hover bg-gradient-to-br from-blue-50 to-teal-50 p-8 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🤝</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Community Connection</h3>
              <p className="text-gray-600 leading-relaxed">
                Strong partnerships between families, teachers, and children create a 
                supportive learning environment where everyone thrives.
              </p>
            </div>
            
            <div className="text-center card-hover bg-gradient-to-br from-green-50 to-yellow-50 p-8 rounded-3xl">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">🌱</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Holistic Development</h3>
              <p className="text-gray-600 leading-relaxed">
                We nurture social, emotional, physical, and cognitive growth through 
                age-appropriate activities and individualized attention.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* About Preview Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 to-red-50 relative">
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-white">
            <path d="M0,0 C300,60 900,60 1200,0 L1200,0 L0,0 Z"></path>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                A Place Where Children Flourish
              </h2>
              <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                At Sunrise School of Miami, we create an environment where curiosity is celebrated, 
                creativity is nurtured, and every child feels valued and supported.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our experienced educators use play-based learning approaches that honor each child's 
                unique developmental journey while building strong foundations for future learning.
              </p>
              <Link 
                href="/about" 
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                Learn About Our Approach
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Children playing and learning"
                width={600}
                height={400}
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-400 rounded-full opacity-20"></div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400 rounded-full opacity-30"></div>
            </div>
          </div>
        </div>
      </section>
      
      <EventsRail />
      
      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white relative">
        <div className="absolute top-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" className="w-full h-20 fill-current text-white">
            <path d="M0,0 C300,60 900,60 1200,0 L1200,0 L0,0 Z"></path>
          </svg>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Schedule a tour to see our beautiful campus and meet our caring educators. 
            We'd love to show you what makes Sunrise School special.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/admissions/schedule-tour" 
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
            >
              Schedule Your Tour
            </Link>
            <Link 
              href="/admissions" 
              className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              View Admissions Info
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}