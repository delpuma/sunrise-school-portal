# Admin User Setup Guide

## Quick Setup Steps

### 1. Apply Database Migrations
Go to your Supabase Dashboard → SQL Editor and run these migrations in order:

1. `supabase/migrations/20240101000000_initial_schema.sql`
2. `supabase/migrations/20240101000001_rls_policies.sql` 
3. `supabase/migrations/20240101000002_functions.sql`

### 2. Create Admin User

**Option A: Using the Test Page (Recommended)**
1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/test-auth`
3. Click "Create Admin User" button
4. Click "Test Login" to verify

**Option B: Manual Supabase Dashboard**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User"
3. Email: `ryan@delpuma.com`
4. Password: `Delpuma202$$!`
5. Click "Create User"
6. Go to SQL Editor and run:
```sql
INSERT INTO public.users (id, email, name, role)
SELECT id, email, 'Ryan Morales', 'admin'
FROM auth.users 
WHERE email = 'ryan@delpuma.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

### 3. Test Authentication Flow

1. Go to `http://localhost:3000/login`
2. Login with:
   - Email: `ryan@delpuma.com`
   - Password: `Delpuma202$$!`
3. Should redirect to `/portal/dashboard`
4. Check that admin navigation shows up

### 4. Access Admin Panel

Once logged in as admin, you can access:
- Admin Dashboard: `/admin/dashboard`
- All admin features will be available

## Troubleshooting

### If login fails:
1. Check Supabase logs in Dashboard
2. Verify user exists in auth.users table
3. Verify user record exists in public.users table with role='admin'

### If redirected to home instead of portal:
1. Check that user has 'admin' or 'staff' role in public.users table
2. Verify RLS policies are applied correctly

### Database Connection Issues:
1. Verify `.env.local` has correct Supabase URL and anon key
2. Check Supabase project is active and not paused

## Admin Credentials
- **Email:** ryan@delpuma.com
- **Password:** Delpuma202$$!
- **Role:** admin

## Next Steps After Setup
1. Test all authentication flows (login, logout, signup)
2. Verify admin panel access
3. Test portal access for regular users
4. Set up additional admin users if needed