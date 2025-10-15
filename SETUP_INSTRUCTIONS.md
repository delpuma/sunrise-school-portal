# Complete Setup Instructions

## 1. Database Setup (REQUIRED FIRST)

The database tables need to be created before the application will work. You have two options:

### Option A: Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/wccscudunmwyyfsyassl
2. Navigate to **SQL Editor**
3. Copy and paste the contents of each migration file in order:
   - First: `supabase/migrations/20240101000000_initial_schema.sql`
   - Second: `supabase/migrations/20240101000001_rls_policies.sql`
   - Third: `supabase/migrations/20240101000002_functions.sql`
4. Run each migration by clicking "Run"

### Option B: Supabase CLI (Advanced)
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref wccscudunmwyyfsyassl

# Apply migrations
supabase db push
```

## 2. Create Admin User

After the database is set up, create your admin user:

### Method 1: Using Test Page
1. Start the development server: `npm run dev`
2. Go to: http://localhost:3000/test-auth
3. Click "Create Admin User"
4. Click "Test Login" to verify it works

### Method 2: Supabase Dashboard
1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click "Add User"
3. Fill in:
   - Email: `ryan@delpuma.com`
   - Password: `Delpuma202$$!`
   - Confirm email: Yes
4. Click "Create User"
5. Go to **SQL Editor** and run:
```sql
INSERT INTO public.users (id, email, name, role)
SELECT id, email, 'Ryan Morales', 'admin'
FROM auth.users 
WHERE email = 'ryan@delpuma.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

## 3. Test Authentication

1. Start the dev server: `npm run dev`
2. Go to: http://localhost:3000/login
3. Login with:
   - Email: `ryan@delpuma.com`
   - Password: `Delpuma202$$!`
4. Should redirect to `/admin/dashboard` (for admin users)

## 4. Verify Everything Works

### Test Admin Access:
- Visit `/admin/dashboard` - should show admin panel
- Visit `/admin/events` - should show event management
- Visit `/admin/users` - should show user management

### Test Portal Access:
- Create a regular user via `/signup`
- Login should redirect to `/portal/dashboard`

## Environment Variables

Your `.env.local` is already configured with:
```
NEXT_PUBLIC_SUPABASE_URL=https://wccscudunmwyyfsyassl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Troubleshooting

### "Could not find table 'users'" error:
- Database migrations haven't been applied yet
- Follow Step 1 above to create the database tables

### Login redirects to home page:
- User doesn't have proper role in `users` table
- Run the SQL query in Step 2 to set admin role

### "Invalid login credentials":
- User doesn't exist in auth.users table
- Create user via Supabase Dashboard Authentication section

### Build errors:
- Run `npm install` to ensure all dependencies are installed
- Check that all migration files exist in `supabase/migrations/`

## Admin Credentials
- **Email:** ryan@delpuma.com  
- **Password:** Delpuma202$$!
- **Role:** admin

## Next Steps
1. Apply database migrations (Step 1)
2. Create admin user (Step 2)  
3. Test login flow (Step 3)
4. Start building your school portal! 🎉