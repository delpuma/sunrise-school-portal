// Test database connection and create admin user
// Run with: node scripts/test-db.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

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
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'change-me',
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('User already exists, trying to sign in...')
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: process.env.ADMIN_EMAIL || 'admin@example.com',
          password: process.env.ADMIN_PASSWORD || 'change-me',
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
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
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
          email: process.env.ADMIN_EMAIL || 'admin@example.com',
          name: 'Ryan Morales',
          role: 'admin',
        })

      if (userError) {
        console.error('Failed to create user record:', userError.message)
        return
      }

      console.log('✅ Admin user created successfully!')
      console.log('Email:', process.env.ADMIN_EMAIL || 'admin@example.com')
      console.log('Password: [REDACTED]')
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