# Quick Reference Guide

## 🚀 Getting Started in 5 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Visit http://localhost:3000
```

## 📋 Essential Setup Steps

### 1. Database Setup (Required)
Go to Supabase Dashboard → SQL Editor and run:
1. `supabase/migrations/20240101000000_initial_schema.sql`
2. `supabase/migrations/20240101000001_rls_policies.sql`
3. `supabase/migrations/20240101000002_functions.sql`

### 2. Create Admin User
```sql
-- After signing up at /signup
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### 3. Storage Buckets (Optional)
Create in Supabase Dashboard → Storage:
- `event-images` (public)
- `blog-images` (public)
- `parent-resources` (private)

## 🔑 Key URLs

### Public
- Homepage: `/`
- Events: `/events`
- Blog: `/blog`
- Tour Booking: `/admissions/schedule-tour`

### Authentication
- Login: `/login`
- Signup: `/signup`
- Reset Password: `/reset-password`

### Parent Portal (login required)
- Dashboard: `/portal/dashboard`
- Invoices: `/portal/invoices`
- Registrations: `/portal/registrations`
- Resources: `/portal/resources`
- Profile: `/portal/profile`

### Admin Dashboard (admin role required)
- Dashboard: `/admin/dashboard`
- Events: `/admin/events`
- Invoices: `/admin/invoices`
- Blog: `/admin/blog`
- Resources: `/admin/resources`
- Users: `/admin/users`
- Audit Logs: `/admin/audit-logs`

## 🔧 Configuration

### Environment Variables (.env.local)
```bash
# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://wccscudunmwyyfsyassl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Square Payment (Configure when ready)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=sandbox-sq0idb-xxx
NEXT_PUBLIC_SQUARE_LOCATION_ID=xxx
SQUARE_ACCESS_TOKEN=xxx
SQUARE_ENVIRONMENT=sandbox

# Google Calendar (Optional)
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALENDAR_ID=xxx

# Givebutter (Optional)
GIVEBUTTER_CAMPAIGN_ID=xxx
```

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| users | User accounts and roles |
| families | Family information |
| students | Student records |
| events | School events |
| registrations | Event registrations |
| invoices | Square invoices |
| bookings | Tour bookings |
| donations | Donation records |
| blog_posts | Blog content |
| parent_resources | Downloadable files |
| newsletter_signups | Newsletter subscribers |
| forms | Form definitions |
| form_submissions | Form responses |
| crm_contacts | CRM contacts |
| crm_interactions | Contact interactions |
| crm_notes | Contact notes |
| crm_segments | Contact segments |
| audit_logs | System audit trail |

## 🎯 Common Tasks

### Create an Event
1. Go to `/admin/events`
2. Click "Create Event"
3. Fill in details
4. Set `is_published` to true
5. Save

### Create a Blog Post
1. Go to `/admin/blog`
2. Click "Create Post"
3. Add title, content, tags
4. Set `published_at` date
5. Save

### Create an Invoice
1. Go to `/admin/invoices`
2. Click "Create Invoice"
3. Select family
4. Enter amount and due date
5. Save (requires Square configuration)

### Change User Role
1. Go to `/admin/users`
2. Find user
3. Click "Change Role"
4. Select new role
5. Confirm

### View Audit Logs
1. Go to `/admin/audit-logs`
2. Browse recent activities
3. Click "View changes" for details

## 🐛 Troubleshooting

### Can't login
- Check Supabase credentials in `.env.local`
- Verify user exists in Supabase Auth

### Can't access admin dashboard
- Verify user role is 'admin' or 'staff'
- Run: `UPDATE users SET role = 'admin' WHERE email = 'your-email';`

### Events not showing
- Check `is_published = true`
- Check `start_at` is in the future
- Verify RLS policies applied

### Payment not working
- Add Square API keys to `.env.local`
- Use sandbox keys for testing
- Check Square dashboard for errors

### Images not loading
- Create storage buckets in Supabase
- Check bucket permissions
- Verify image URLs

## 📱 Testing Checklist

- [ ] Sign up new user
- [ ] Login with credentials
- [ ] Browse events
- [ ] Register for event
- [ ] View parent portal
- [ ] Access admin dashboard (as admin)
- [ ] Create event
- [ ] Create blog post
- [ ] View audit logs
- [ ] Test newsletter signup
- [ ] Request tour booking

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

### Environment Variables to Add
- All from `.env.local`
- Add production Square keys
- Add production Supabase keys (if different)

## 📚 Documentation

- **GETTING_STARTED.md** - Detailed setup
- **PROJECT_STATUS.md** - Current status
- **FINAL_STATUS.md** - Completion summary
- **DEPLOYMENT.md** - Production deployment
- **docs/API.md** - API reference
- **docs/ACCESSIBILITY.md** - Accessibility guide
- **docs/PERFORMANCE.md** - Performance guide

## 💡 Tips

- Use Supabase Dashboard to view/edit data directly
- Check browser console for errors
- Test with multiple user roles
- Start with free events before configuring payments
- Use sandbox mode for Square testing

## 🆘 Support

### Resources
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Square Docs: https://developer.squareup.com/
- Tailwind Docs: https://tailwindcss.com/docs

### Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linter
```

## ✅ What's Working

- ✅ Authentication (signup, login, logout)
- ✅ Event management (create, view, register)
- ✅ Blog system (create, view posts)
- ✅ Parent portal (dashboard, invoices, registrations)
- ✅ Admin dashboard (all management interfaces)
- ✅ Tour booking (form submission)
- ✅ Newsletter signup
- ✅ Payment integration (needs API keys)
- ✅ Security (RLS, headers, validation)
- ✅ Accessibility (WCAG 2.2 AA)

## 🎉 You're Ready!

The system is fully functional. Follow the setup steps above and you'll be running in minutes!
