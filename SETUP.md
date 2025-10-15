# Setup Guide

Complete setup instructions for the Sunrise School Portal.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account
- Square account (for payments)
- Google Cloud account (for Calendar API)
- Givebutter account (for donations)
- OpenAI account (optional, for AI features)

## Step 1: Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/sunrise-school-portal.git
cd sunrise-school-portal
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

### Supabase Setup

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API
4. Copy your project URL and anon key
5. Copy your service role key (keep this secret!)

### Square Setup

1. Go to [developer.squareup.com](https://developer.squareup.com)
2. Create an application
3. Get your Application ID and Location ID
4. Generate an access token
5. Use sandbox credentials for testing

### Google Calendar Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs
6. Get your calendar ID from Google Calendar settings

### Givebutter Setup

1. Go to [givebutter.com](https://givebutter.com)
2. Create a campaign
3. Get your campaign ID from the widget embed code
4. Set up webhook in Givebutter settings
5. Copy webhook secret

### OpenAI Setup (Optional)

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Add to `.env.local`

## Step 4: Database Setup

### Run Migrations

```bash
# If using Supabase CLI
npx supabase db push

# Or manually run migrations in Supabase SQL Editor
# Copy and paste each file from supabase/migrations/
```

### Create Admin User

In Supabase SQL Editor:

```sql
-- First, create a user in Supabase Auth
-- Then run this to add them to the users table

INSERT INTO users (id, email, name, role)
VALUES (
  'your-auth-user-id-from-supabase-auth',
  'admin@sunriseschoolmiami.org',
  'Admin User',
  'admin'
);
```

## Step 5: Storage Setup

In Supabase:

1. Go to Storage
2. Create buckets:
   - `media` (public)
   - `resources` (private)
3. Set up CORS if needed

## Step 6: Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 7: Test Features

### Test Authentication
1. Go to `/signup`
2. Create a test account
3. Verify email (check Supabase Auth)
4. Log in

### Test Admin Features
1. Log in as admin
2. Go to `/admin/dashboard`
3. Create a test event
4. Create a test form
5. Add a CRM contact

### Test Parent Portal
1. Log in as parent
2. Go to `/portal/profile`
3. Add a student
4. View invoices and resources

### Test Payments (Sandbox)
1. Register for a paid event
2. Use Square test card: `4111 1111 1111 1111`
3. Complete payment
4. Verify in Square dashboard

## Step 8: Configure Webhooks

### Square Webhooks

1. Go to Square Developer Dashboard
2. Add webhook URL: `https://your-domain.com/api/webhooks/square`
3. Subscribe to payment events
4. Test webhook delivery

### Givebutter Webhooks

1. Go to Givebutter campaign settings
2. Add webhook URL: `https://your-domain.com/api/webhooks/givebutter`
3. Add webhook secret to `.env.local`
4. Test with a donation

## Step 9: Deploy to Vercel

### Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure project settings
4. Add environment variables
5. Deploy

### Post-Deployment

1. Update webhook URLs to production domain
2. Update NEXT_PUBLIC_SITE_URL
3. Test all integrations
4. Set up custom domain
5. Configure SSL (automatic with Vercel)

## Step 10: Production Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Storage buckets configured
- [ ] Webhooks configured and tested
- [ ] Square sandbox → production
- [ ] Google Calendar production credentials
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics configured
- [ ] Error monitoring set up
- [ ] Backup strategy in place

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys
- Check if project is paused
- Verify RLS policies are correct

### Authentication Issues
- Check Supabase Auth settings
- Verify redirect URLs
- Check email templates

### Payment Issues
- Verify Square credentials
- Check if using sandbox vs production
- Test with Square test cards

### API Errors
- Check Vercel function logs
- Verify environment variables
- Check API rate limits

## Support

- Documentation: See README.md and other docs
- Issues: Open a GitHub issue
- Supabase: Check Supabase logs
- Vercel: Check deployment logs

## Next Steps

1. Migrate WordPress content (see MIGRATION_GUIDE.md)
2. Customize branding and content
3. Train staff on admin features
4. Set up monitoring and analytics
5. Plan go-live date
6. Prepare rollback plan

## Development Tips

- Use `npm run dev` for hot reload
- Check `npm run lint` before committing
- Run `npm test` to verify changes
- Use Supabase Studio for database management
- Check Vercel logs for production issues

## Security Notes

- Never commit `.env.local` to git
- Keep service role key secret
- Use environment variables for all secrets
- Enable 2FA on all service accounts
- Regularly rotate API keys
- Monitor for suspicious activity

## Performance Tips

- Use Next.js Image component for images
- Enable ISR for dynamic pages
- Use React Server Components where possible
- Optimize database queries
- Monitor Core Web Vitals
- Use CDN for static assets

Good luck with your deployment! 🚀
