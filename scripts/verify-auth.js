// Verify authentication flow after database setup
// Run with: node scripts/verify-auth.js

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyDatabase() {
  try {
    console.log('🔍 Checking database tables...')
    
    // Check if users table exists
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database not set up:', error.message)
      console.log('\n📋 Next steps:')
      console.log('1. Go to Supabase Dashboard → SQL Editor')
      console.log('2. Run the migration files in order:')
      console.log('   - supabase/migrations/20240101000000_initial_schema.sql')
      console.log('   - supabase/migrations/20240101000001_rls_policies.sql')
      console.log('   - supabase/migrations/20240101000002_functions.sql')
      return false
    }
    
    console.log('✅ Database tables exist')
    return true
  } catch (error) {
    console.error('❌ Database check failed:', error.message)
    return false
  }
}

async function verifyAdminUser() {
  try {
    console.log('🔍 Checking admin user...')
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: process.env.ADMIN_PASSWORD || 'change-me',
    })

    if (error) {
      console.error('❌ Admin login failed:', error.message)
      console.log('\n📋 Create admin user:')
      console.log('1. Go to http://localhost:3000/test-auth')
      console.log('2. Click "Create Admin User"')
      console.log('3. Or use Supabase Dashboard → Authentication → Users')
      return false
    }

    // Check user role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError || !userData) {
      console.error('❌ User record not found:', userError?.message)
      return false
    }

    if (userData.role !== 'admin') {
      console.error('❌ User is not admin, role:', userData.role)
      return false
    }

    console.log('✅ Admin user verified')
    console.log(`   Name: ${userData.name}`)
    console.log(`   Email: ${userData.email}`)
    console.log(`   Role: ${userData.role}`)
    
    // Sign out
    await supabase.auth.signOut()
    
    return true
  } catch (error) {
    console.error('❌ Admin verification failed:', error.message)
    return false
  }
}

async function main() {
  console.log('🚀 Verifying Sunrise School Portal Setup\n')
  
  const dbOk = await verifyDatabase()
  if (!dbOk) return
  
  const adminOk = await verifyAdminUser()
  
  if (dbOk && adminOk) {
    console.log('\n🎉 Setup complete! You can now:')
    console.log('1. Start dev server: npm run dev')
    console.log('2. Login at: http://localhost:3000/login')
    console.log('3. Access admin panel: http://localhost:3000/admin/dashboard')
  }
}

main()