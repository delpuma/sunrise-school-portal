-- Fix RLS circular dependency issue
-- Run this in Supabase SQL Editor

-- First, disable RLS on users table temporarily to fix the circular dependency
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

-- Re-enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create simpler users policies that don't create circular dependencies
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Allow service role to access users table (for admin checks)
CREATE POLICY "Service role full access"
ON users FOR ALL
USING (auth.role() = 'service_role');

-- Create a function to check if user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users au
    JOIN public.users u ON au.id = u.id
    WHERE au.id = auth.uid()
    AND u.role IN ('admin', 'staff')
  );
$$;

-- Update all policies to use the new function instead of direct table queries
-- This prevents the circular dependency issue