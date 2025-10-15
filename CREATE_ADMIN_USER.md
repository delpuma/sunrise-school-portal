# Create Admin User - Quick Setup

## Step 1: Apply Database Migrations

Go to your Supabase Dashboard: https://supabase.com/dashboard/project/wccscudunmwyyfsyassl

Navigate to **SQL Editor** and run these migrations in order:

### Migration 1: Initial Schema
```sql
-- Copy and paste the contents of: supabase/migrations/20240101000000_initial_schema.sql
```

### Migration 2: RLS Policies  
```sql
-- Copy and paste the contents of: supabase/migrations/20240101000001_rls_policies.sql
```

### Migration 3: Functions
```sql
-- Copy and paste the contents of: supabase/migrations/20240101000002_functions.sql
```

## Step 2: Create Admin User

After migrations are applied, go to **Authentication** → **Users** in Supabase Dashboard:

1. Click **"Add User"**
2. Fill in:
   - **Email:** `ryan@delpuma.com`
   - **Password:** `Delpuma202$$!`
   - **Confirm Email:** ✅ Yes
3. Click **"Create User"**

## Step 3: Set Admin Role

Go back to **SQL Editor** and run:

```sql
-- Get the user ID and set admin role
INSERT INTO public.users (id, email, name, role)
SELECT id, email, 'Ryan Morales', 'admin'
FROM auth.users 
WHERE email = 'ryan@delpuma.com'
ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    name = 'Ryan Morales';
```

## Step 4: Test Login

1. Go to: http://localhost:3000/login
2. Login with:
   - **Email:** `ryan@delpuma.com`
   - **Password:** `Delpuma202$$!`
3. Should redirect to `/admin/dashboard`

## Troubleshooting

If login still fails:
1. Check Supabase Dashboard → Authentication → Users (user should exist)
2. Check SQL Editor: `SELECT * FROM public.users WHERE email = 'ryan@delpuma.com';` (should show admin role)
3. Check browser console for specific error messages