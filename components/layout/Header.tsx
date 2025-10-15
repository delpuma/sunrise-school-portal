'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function Header() {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    if (user) {
      const fetchUserRole = async () => {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .limit(1)
          
          if (error) {
            console.error('User role query error:', { errorCode: error.code, message: error.message })
            setUserRole(null)
          } else {
            setUserRole(data?.[0]?.role || null)
          }
        } catch (error: any) {
          console.error('User role fetch error:', { message: error?.message || 'Unknown error' })
          setUserRole(null)
        }
      }
      
      fetchUserRole()
    } else {
      setUserRole(null)
    }
  }, [user, supabase])

  return (
    <header className="bg-white shadow-lg relative z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-400 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-400 bg-clip-text text-transparent">
                Sunrise School
              </span>
            </Link>
            <div className="hidden lg:ml-12 lg:flex lg:space-x-8">
              <Link
                href="/about"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-orange-50"
              >
                About
              </Link>
              <Link
                href="/curriculum"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-orange-50"
              >
                Curriculum
              </Link>
              <Link
                href="/admissions"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-orange-50"
              >
                Admissions
              </Link>
              <Link
                href="/news-events"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-orange-50"
              >
                News & Events
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors duration-200 rounded-lg hover:bg-orange-50"
              >
                Blog
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/give"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-full text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
            >
              Donate
            </Link>
            {user ? (
              <>
                {userRole === 'admin' || userRole === 'staff' ? (
                  <Link
                    href="/admin/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/portal/dashboard"
                    className="text-sm font-medium text-gray-700 hover:text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                  >
                    Portal
                  </Link>
                )}
                <button
                  onClick={() => signOut().catch(console.error)}
                  className="text-sm font-medium text-gray-700 hover:text-orange-500 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-orange-500 border-2 border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                Sign In
              </Link>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-orange-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <Link href="/about" className="px-3 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg">About</Link>
              <Link href="/curriculum" className="px-3 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg">Curriculum</Link>
              <Link href="/admissions" className="px-3 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg">Admissions</Link>
              <Link href="/news-events" className="px-3 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg">News & Events</Link>
              <Link href="/blog" className="px-3 py-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg">Blog</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
