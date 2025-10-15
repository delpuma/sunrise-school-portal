// Test database connection and create admin user
// Run with: node scripts/test-db.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wccscudunmwyyfsyassl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3NjdWR1bm13eXlmc3lhc3NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjgxMTksImV4cCI6MjA3NjA0NDExOX0.knQ6X-9dMyCzsu4XbFr1JguP4kqnP_2ova4MF8bdTr0'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Database connection failed:', error.message)
      return false
    }
    
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('Connection test failed:', error.message)
    return false
  }
}

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'ryan@delpuma.com',
      password: 'Delpuma202$$!',
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists, trying to sign in...')
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: 'ryan@delpuma.com',
          password: 'Delpuma202$$!',
        })
        
        if (signInError) {
          console.error('Sign in failed:', signInError.message)
          return
        }
        
        console.log('✅ User signed in successfully')
        
        // Update user role to admin
        const { error: updateError } = await supabase
          .from('users')
          .upsert({
            id: signInData.user.id,
            email: 'ryan@delpuma.com',
            name: 'Ryan Morales',
            role: 'admin',
          })
        
        if (updateError) {
          console.error('Failed to update user role:', updateError.message)
          return
        }
        
        console.log('✅ User role updated to admin')
        return
      }
      
      console.error('Auth error:', authError.message)
      return
    }

    if (authData.user) {
      console.log('User created with ID:', authData.user.id)
      
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
        console.error('Failed to create user record:', userError.message)
        return
      }

      console.log('✅ Admin user created successfully!')
      console.log('Email: ryan@delpuma.com')
      console.log('Password: Delpuma202$$!')
      console.log('Role: admin')
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message)
  }
}

async function main() {
  const connected = await testConnection()
  if (connected) {
    await createAdminUser()
  }
}

main()