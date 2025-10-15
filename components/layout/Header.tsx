'use client'

import Link from 'next/link'
import { useAuth } from '@/components/auth/AuthProvider'
import { useState } from 'react'

export default function Header() {
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">
                Sunrise School of Miami
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <Link
                href="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                About
              </Link>
              <Link
                href="/curriculum"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                Curriculum
              </Link>
              <Link
                href="/admissions"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                Admissions
              </Link>
              <Link
                href="/news-events"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                News & Events
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                Blog
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/give"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Donate
            </Link>
            {user ? (
              <>
                <Link
                  href="/portal/dashboard"
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  Portal
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
