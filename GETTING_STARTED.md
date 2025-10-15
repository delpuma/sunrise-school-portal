# Getting Started - Sunrise School Portal

## 🎯 What's Been Built

A comprehensive school website and parent portal with:
- ✅ Complete authentication system
- ✅ Public website with events, blog, and information pages
- ✅ Event registration with capacity tracking
- ✅ Square payment integration for events and invoices
- ✅ Parent portal with dashboard, invoices, registrations, and resources
- ✅ Admin dashboard with metrics and management tools
- ✅ Newsletter signup
- ✅ Tour booking system
- ✅ Security features (RLS, headers, rate limiting)

## 🚀 Quick Setup (5 minutes)

### Step 1: Database Setup

Go to your Supabase project: https://supabase.com/dashboard/project/wccscudunmwyyfsyassl

Navigate to **SQL Editor** and run these migrations in order:

1. **Initial Schema** - Copy/paste `supabase/migrations/20240101000000_initial_schema.sql`
2. **RLS Policies** - Copy/paste `supabase/migrations/20240101000001_rls_policies.sql`
3. **Functions** - Copy/paste `supabase/migrations/20240101000002_functions.sql`

### Step 2: Create Storage Buckets

In Supabase Dashboard → Storage, create these buckets:
- `event-images` (public)
- `blog-images` (public)
- `parent-resources` (private with RLS)

### Step 3: Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

### Step 4: Create Your Admin Account

1. Go to http://localhost:3000/signup
2. Sign up with your email
3. In Supabase SQL Editor, run:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

4. Refresh the page - you now have admin access!

### Step 5: Access Admin Dashboard

Visit http://localhost:3000/admin/dashboard

You can now:
- Create events
- Manage blog posts
- View metrics
- Create invoices (when Square is configured)

## 📱 Key URLs

### Public Pages
- Homepage: http://localhost:3000
- Events: http://localhost:3000/events
- Blog: http://localhost:3000/blog
- About: http://localhost:3000/about
- Admissions: http://localhost:3000/admissions
- Schedule Tour: http://localhost:3000/admissions/schedule-tour

### Authentication
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Reset Password: http://localhost:3000/reset-password

### Parent Portal (requires login)
- Dashboard: http://localhost:3000/portal/dashboard
- Invoices: http://localhost:3000/portal/invoices
- Registrations: http://localhost:3000/portal/registrations
- Resources: http://localhost:3000/portal/resources
- Profile: http://localhost:3000/portal/profile

### Admin Dashboard (requires admin role)
- Dashboard: http://localhost:3000/admin/dashboard
- Events: http://localhost:3000/admin/events
- Blog: http://localhost:3000/admin/blog

## 🧪 Testing the System

### Test Event Registration Flow

1. **Create an Event** (as admin)
   - Go to /admin/events
   - Click "Create Event"
   - Fill in details (title, date, capacity, price)
   - Publish it

2. **Register for Event** (as parent)
   - Go to /events
   - Click on your event
   - Click "Register"
   - Complete registration

3. **View Registration** (as parent)
   - Go to /portal/registrations
   - See your registration

### Test Blog System

1. **Create Blog Post** (as admin)
   - Go to /admin/blog
   - Click "Create Post"
   - Add title, content, tags
   - Set published date
   - Save

2. **View Blog Post** (as visitor)
   - Go to /blog
   - Click on your post
   - Read the content

### Test Tour Booking

1. Go to /admissions/schedule-tour
2. Fill out the form
3. Submit request
4. Check Supabase → bookings table

## 🔧 Configuration (Optional)

### Square Payment (for real payments)

Update `.env.local`:
```bash
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_app_id
NEXT_PUBLIC_SQUARE_LOCATION_ID=your_location_id
SQUARE_ACCESS_TOKEN=your_access_token
SQUARE_ENVIRONMENT=sandbox  # or 'production'
```

Get credentials from: https://developer.squareup.com/

### Google Calendar (for tour booking)

Update `.env.local`:
```bash
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALENDAR_ID=your_calendar_id
NEXT_PUBLIC_USE_GOOGLE_CALENDAR_EMBED=true
NEXT_PUBLIC_GOOGLE_CALENDAR_APPOINTMENT_URL=your_appointment_url
```

### Givebutter (for donations)

Update `.env.local`:
```bash
GIVEBUTTER_CAMPAIGN_ID=your_campaign_id
GIVEBUTTER_WEBHOOK_SECRET=your_webhook_secret
```

## 📊 What Works Right Now

### ✅ Fully Functional
- User signup/login/logout
- Event browsing and viewing
- Event registration (without payment)
- Blog viewing
- Parent portal dashboard
- Admin dashboard overview
- Newsletter signup
- Tour booking requests

### ⚙️ Needs Configuration
- Square payments (needs API keys)
- Invoice creation (needs Square)
- Google Calendar integration (needs OAuth)
- Givebutter donations (needs campaign ID)

### 🚧 In Progress
- Admin CRUD interfaces (partial)
- Profile editing (partial)
- CRM system (not started)
- Form builder (not started)

## 🐛 Troubleshooting

### "Unauthorized" errors
- Make sure you're logged in
- Check your user role in Supabase users table

### Events not showing
- Check `is_published` is true in events table
- Check `start_at` date is in the future

### Can't access admin dashboard
- Verify your user role is 'admin' or 'staff'
- Run the UPDATE query from Step 4

### Database errors
- Ensure all migrations are applied
- Check RLS policies are enabled
- Verify Supabase credentials in .env.local

## 📚 Next Steps

### To Make It Production Ready

1. **Complete Admin Interfaces**
   - Invoice management UI
   - Resource upload UI
   - User management UI
   - Audit log viewer

2. **Add Sample Content**
   - Create 5-10 events
   - Write 3-5 blog posts
   - Upload parent resources
   - Add curriculum content

3. **Configure Payments**
   - Set up Square account
   - Add API keys
   - Test payment flow
   - Set up webhooks

4. **Test Everything**
   - Test all user flows
   - Test payment processing
   - Test email notifications
   - Test on mobile devices

5. **Deploy to Production**
   - Push to GitHub
   - Deploy to Vercel
   - Configure custom domain
   - Set up monitoring

## 💡 Tips

- **Use Supabase Dashboard** to view/edit data directly
- **Check browser console** for errors during development
- **Use Vercel logs** to debug API routes
- **Test with multiple users** to verify RLS policies
- **Start with free events** before configuring payments

## 🎉 You're Ready!

The system is functional and ready for development testing. Follow the steps above to get started, then refer to:
- `PROJECT_STATUS.md` for detailed status
- `DEPLOYMENT.md` for production deployment
- `docs/API.md` for API documentation

Need help? Check the code comments or Supabase/Next.js documentation.

Happy building! 🚀
