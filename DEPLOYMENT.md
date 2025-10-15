# Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Vercel account (recommended for deployment)
- Environment variables configured

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Square (when implemented)
NEXT_PUBLIC_SQUARE_APPLICATION_ID=your_square_app_id
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id

# Google Calendar (when implemented)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALENDAR_ID=your_calendar_id

# Givebutter (when implemented)
GIVEBUTTER_CAMPAIGN_ID=your_campaign_id
GIVEBUTTER_WEBHOOK_SECRET=your_webhook_secret

# OpenAI (optional)
OPENAI_API_KEY=your_openai_key
```

## Database Setup

### 1. Apply Migrations

Go to your Supabase project dashboard:
1. Navigate to SQL Editor
2. Run each migration file in order:
   - `supabase/migrations/20240101000000_initial_schema.sql`
   - `supabase/migrations/20240101000001_rls_policies.sql`
   - `supabase/migrations/20240101000002_functions.sql`

### 2. Create Admin User

After migrations, create your first admin user:

1. Sign up through the app at `/signup`
2. In Supabase SQL Editor, run:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 3. Configure Storage Buckets

Create storage buckets in Supabase:
- `event-images` - for event photos
- `blog-images` - for blog post images
- `parent-resources` - for downloadable resources

Set appropriate RLS policies for each bucket.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Add environment variables in Vercel dashboard

### Option 2: Deploy via GitHub

1. Push code to GitHub repository

2. Import project in Vercel dashboard:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

### Environment Variables in Vercel

Add all environment variables from `.env.local` in:
- Vercel Dashboard → Project → Settings → Environment Variables

## Post-Deployment Checklist

- [ ] Database migrations applied
- [ ] Admin user created
- [ ] Storage buckets configured
- [ ] Environment variables set
- [ ] Test authentication flow
- [ ] Test event creation and registration
- [ ] Test parent portal access
- [ ] Test admin dashboard access
- [ ] Configure custom domain (optional)
- [ ] Set up SSL certificate (automatic with Vercel)
- [ ] Test all API endpoints
- [ ] Monitor error logs

## Monitoring

### Vercel Analytics
- Automatically enabled for all deployments
- View in Vercel Dashboard → Analytics

### Supabase Logs
- Database queries: Supabase Dashboard → Database → Logs
- Auth events: Supabase Dashboard → Authentication → Logs
- API logs: Supabase Dashboard → API → Logs

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for performance monitoring

## Backup Strategy

### Database Backups
- Supabase automatically backs up your database
- Manual backups: Supabase Dashboard → Database → Backups

### Storage Backups
- Download files from Supabase Storage periodically
- Consider automated backup scripts

## Scaling Considerations

### Database
- Supabase Pro plan for production workloads
- Monitor query performance
- Add indexes as needed

### API Routes
- Vercel automatically scales serverless functions
- Monitor function execution times
- Optimize slow endpoints

### Storage
- Use CDN for static assets
- Optimize images before upload
- Consider image transformation service

## Security Checklist

- [ ] All RLS policies enabled
- [ ] Service role key kept secret
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] CSRF protection enabled
- [ ] Audit logging active

## Troubleshooting

### Build Failures
- Check Node.js version (18+)
- Verify all dependencies installed
- Check for TypeScript errors

### Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies
- Ensure migrations applied

### Authentication Issues
- Verify Supabase Auth configuration
- Check redirect URLs
- Ensure cookies enabled

## Support

For issues or questions:
- Check project documentation in `/docs`
- Review Supabase docs: https://supabase.com/docs
- Review Next.js docs: https://nextjs.org/docs
- Check Vercel docs: https://vercel.com/docs
