'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const createAdminUser = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // First, sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: 'ryan@delpuma.com',
        password: 'Delpuma202$$!',
      })

      if (authError) {
        setResult(`Auth error: ${authError.message}`)
        return
      }

      if (authData.user) {
        // Create user record with admin role
        const { error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: 'ryan@delpuma.com',
            name: 'Ryan Morales',
            role: 'admin',
          })

        if (userError) {
          setResult(`User record error: ${userError.message}`)
          return
        }

        setResult(`✅ Admin user created successfully!\nUser ID: ${authData.user.id}\nEmail: ryan@delpuma.com\nRole: admin`)
      }
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'ryan@delpuma.com',
        password: 'Delpuma202$$!',
      })

      if (error) {
        setResult(`Login error: ${error.message}`)
        return
      }

      // Get user role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (userError) {
        setResult(`User query error: ${userError.message}`)
        return
      }

      setResult(`✅ Login successful!\nUser: ${userData.name}\nEmail: ${userData.email}\nRole: ${userData.role}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentUser = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        setResult('No user logged in')
        return
      }

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        setResult(`User query error: ${error.message}`)
        return
      }

      setResult(`Current user:\nName: ${userData.name}\nEmail: ${userData.email}\nRole: ${userData.role}`)
    } catch (error: any) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setResult('Signed out')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={createAdminUser}
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Create Admin User
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Test Login
          </button>
          
          <button
            onClick={checkCurrentUser}
            disabled={loading}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Check Current User
          </button>
          
          <button
            onClick={signOut}
            disabled={loading}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Sign Out
          </button>
        </div>

        {result && (
          <div className="bg-white p-4 rounded border">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
    </div>
  )
}