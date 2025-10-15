-- Create admin user in Supabase Auth
-- This script should be run in the Supabase SQL Editor

-- First, create the user in auth.users table
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'ryan@delpuma.com',
  crypt('Delpuma202$$!', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Ryan Morales"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Get the user ID we just created
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user ID
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'ryan@delpuma.com';
    
    -- Insert into public.users table with admin role
    INSERT INTO public.users (id, email, name, role, created_at, updated_at)
    VALUES (user_uuid, 'ryan@delpuma.com', 'Ryan Morales', 'admin', NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        role = 'admin',
        name = 'Ryan Morales',
        updated_at = NOW();
        
    RAISE NOTICE 'Admin user created with ID: %', user_uuid;
END $$;