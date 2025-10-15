// Setup admin user script
// Run this with: node scripts/setup-admin.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need to add this to .env.local

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    console.log('Creating admin user...')
    
    // Create user in auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'ryan@delpuma.com',
      password: 'Delpuma202$$!',
      email_confirm: true,
      user_metadata: {
        name: 'Ryan Morales'
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return
    }

    console.log('Auth user created:', authData.user.id)

    // Create user record in public.users table
    const { error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'ryan@delpuma.com',
        name: 'Ryan Morales',
        role: 'admin'
      })

    if (userError) {
      console.error('User record error:', userError)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log('Email: ryan@delpuma.com')
    console.log('Password: Delpuma202$$!')
    console.log('Role: admin')
    
  } catch (error) {
    console.error('Error:', error)
  }
}

createAdminUser()