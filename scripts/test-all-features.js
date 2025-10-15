const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testFeatures() {
  console.log('🧪 Testing all features...\n')

  // Test 1: Database connection
  console.log('1. Testing database connection...')
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    if (error) throw error
    console.log('✅ Database connection successful\n')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    return
  }

  // Test 2: Check all required tables exist
  console.log('2. Checking required tables...')
  const tables = [
    'users', 'families', 'students', 'events', 'registrations',
    'invoices', 'blog_posts', 'parent_resources', 'forms',
    'form_submissions', 'crm_contacts', 'audit_logs'
  ]
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1)
      if (error && error.code !== 'PGRST116') throw error
      console.log(`✅ Table ${table} exists`)
    } catch (error) {
      console.error(`❌ Table ${table} missing or inaccessible:`, error.message)
    }
  }
  console.log()

  // Test 3: Check homepage settings
  console.log('3. Testing homepage settings...')
  try {
    const { data, error } = await supabase
      .from('homepage_settings')
      .select('*')
      .limit(1)
    
    if (error) throw error
    console.log('✅ Homepage settings table accessible')
    console.log('Settings:', data?.[0] ? 'Found' : 'Empty')
  } catch (error) {
    console.error('❌ Homepage settings error:', error.message)
  }
  console.log()

  // Test 4: Check events
  console.log('4. Testing events system...')
  try {
    const { data, error } = await supabase
      .from('events')
      .select('id, title, start_at, capacity')
      .limit(5)
    
    if (error) throw error
    console.log(`✅ Events accessible (${data?.length || 0} found)`)
  } catch (error) {
    console.error('❌ Events error:', error.message)
  }
  console.log()

  // Test 5: Check blog posts
  console.log('5. Testing blog system...')
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, published_at')
      .limit(5)
    
    if (error) throw error
    console.log(`✅ Blog posts accessible (${data?.length || 0} found)`)
  } catch (error) {
    console.error('❌ Blog posts error:', error.message)
  }
  console.log()

  // Test 6: Check CRM contacts
  console.log('6. Testing CRM system...')
  try {
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('id, first_name, last_name, status')
      .limit(5)
    
    if (error) throw error
    console.log(`✅ CRM contacts accessible (${data?.length || 0} found)`)
  } catch (error) {
    console.error('❌ CRM contacts error:', error.message)
  }
  console.log()

  console.log('🎉 Feature testing complete!')
}

testFeatures().catch(console.error)