# Database Setup Instructions

## Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Supabase project created (already done)

## Apply Migrations

### Option 1: Using Supabase Dashboard (Recommended for now)
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/wccscudunmwyyfsyassl
2. Navigate to SQL Editor
3. Copy and paste each migration file in order:
   - `supabase/migrations/20240101000000_initial_schema.sql`
   - `supabase/migrations/20240101000001_rls_policies.sql`
   - `supabase/migrations/20240101000002_functions.sql`
4. Run each migration

### Option 2: Using Supabase CLI
```bash
# Link to your project
supabase link --project-ref wccscudunmwyyfsyassl

# Push migrations
supabase db push

# Generate TypeScript types
supabase gen types typescript --linked > types/database.types.ts
```

## Verify Setup
After running migrations, verify tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Create Initial Admin User
After migrations, create an admin user through Supabase Auth, then update their role:
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```
